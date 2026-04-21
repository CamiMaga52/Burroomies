// backend/src/controllers/documentoController.js

//FUNCIONAMIENTO:
// Controlador para validar documentos PDF de constancia de estudios y CURP usando la API de PDF.co para extraer QR y texto.
// Define dos funciones principales: validarConstancia (para constancias de estudios) y validarCurp (para CURP).
// Ambas funciones reciben un PDF en base64 y datos del usuario, suben el PDF a PDF.co, extraen el QR, consultan el sistema SAES del IPN (en el caso de constancias) o parsean el QR (en el caso de CURP), y comparan los datos extraídos con los proporcionados por el usuario.
// Devuelven un resultado indicando si el documento es válido o no, junto con mensajes de error específicos en caso de discrepancias.

const PDF_CO_KEY = process.env.PDF_CO_KEY

// ── Normalizar texto para comparación ────────────────────────────
const normalizar = (str) =>
    String(str || '')
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()

// ── Subir PDF a PDF.co ───────────────────────────────────────────
const subirArchivo = async (base64, filename) => {
    const res = await fetch('https://api.pdf.co/v1/file/upload/base64', {
        method: 'POST',
        headers: { 'x-api-key': PDF_CO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, name: filename }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.message || 'Error al subir archivo')
    return data.url
}

// ── Extraer QR del PDF ───────────────────────────────────────────
const extraerQR = async (fileUrl) => {
    const res = await fetch('https://api.pdf.co/v1/barcode/read/from/url', {
        method: 'POST',
        headers: { 'x-api-key': PDF_CO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url: fileUrl,
            types: 'QRCode,Aztec,DataMatrix',
            pages: '0-',
            scale: 500,
            grayscale: true,
            async: false,
        }),
    })
    const data = await res.json()
    console.log('PDF.co barcode response:', JSON.stringify(data).substring(0, 300))
    if (data.error) throw new Error(data.message || 'Error al leer QR')
    return data.barcodes || []
}

// ── Extraer texto del PDF ────────────────────────────────────────
const extraerTextoPDF = async (fileUrl) => {
    const res = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
        method: 'POST',
        headers: { 'x-api-key': PDF_CO_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileUrl, inline: true, async: false }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.message || 'Error al extraer texto')
    return data.body || ''
}

// ────────────────────────────────────────────────────────────────
// POST /api/documentos/validar-constancia
// Body: { pdfBase64, nombres, apellidoP, apellidoM, boleta, curp }
// ────────────────────────────────────────────────────────────────
const validarConstancia = async (req, res) => {
    try {
        const { pdfBase64, nombres, apellidoP, apellidoM, boleta, curp } = req.body
        if (!pdfBase64) return res.status(400).json({ valido: false, message: 'No se recibió el PDF.' })

        // 1. Subir PDF a PDF.co
        const fileUrl = await subirArchivo(pdfBase64, 'constancia.pdf')

        // 2. Extraer QR del PDF
        const barcodes = await extraerQR(fileUrl)
        if (!barcodes.length) {
            return res.status(400).json({ valido: false, message: 'No se encontró código QR en el documento.' })
        }

        // 3. Obtener URL del QR
        const qrValue = barcodes[0]?.value || barcodes[0]?.Value || barcodes[0]?.data || barcodes[0]?.text
        console.log('QR extraído:', qrValue)

        // 4. Consultar SAES con GET + POST
        let htmlSAES = ''
        try {
            const base = new URL(qrValue)
            const baseUrl = `${base.protocol}//${base.host}`
            let cookies = ''

            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'es-MX,es;q=0.9',
            }

            // Paso 1: GET para obtener cookies y ViewState
            let currentUrl = qrValue
            let getHtml = ''
            for (let i = 0; i < 10; i++) {
                const r = await fetch(currentUrl, { headers: { ...headers, Cookie: cookies }, redirect: 'manual' })
                const sc = r.headers.get('set-cookie')
                if (sc) {
                    const nc = sc.split(',').map(x => x.split(';')[0].trim()).join('; ')
                    cookies = cookies ? `${cookies}; ${nc}` : nc
                }
                if (r.status >= 300 && r.status < 400) {
                    let loc = r.headers.get('location')
                    if (!loc) break
                    if (loc.startsWith('/')) loc = `${baseUrl}${loc}`
                    currentUrl = loc
                    continue
                }
                getHtml = await r.text()
                break
            }

            // Extraer ViewState
            const vsMatch = getHtml.match(/id="__VIEWSTATE"\s+value="([^"]*)"/)
            const vsGenMatch = getHtml.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]*)"/)
            const eventValMatch = getHtml.match(/id="__EVENTVALIDATION"\s+value="([^"]*)"/)

            if (vsMatch) {
                // Paso 2: POST con ViewState
                const params = new URLSearchParams()
                params.append('__EVENTTARGET', '')
                params.append('__EVENTARGUMENT', '')
                params.append('__VIEWSTATE', vsMatch[1])
                if (vsGenMatch) params.append('__VIEWSTATEGENERATOR', vsGenMatch[1])
                if (eventValMatch) params.append('__EVENTVALIDATION', eventValMatch[1])
                params.append('ctl00$ContentPlaceHolder1$Button1', 'Validar')

                const postRes = await fetch(currentUrl, {
                    method: 'POST',
                    headers: {
                        ...headers,
                        'Cookie': cookies,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': currentUrl,
                    },
                    body: params.toString(),
                    redirect: 'follow',
                })
                htmlSAES = await postRes.text()
            } else {
                htmlSAES = getHtml
            }

        } catch (err) {
            console.error('Error al consultar SAES:', err)
            return res.status(400).json({
                valido: false,
                message: 'No se pudo verificar el documento con el sistema del IPN. Intenta de nuevo.',
            })
        }

        // 5. Extraer datos del HTML de SAES
        // Estructura real: Nombre del estudiante: </font><font color="Blue"><b>VALOR</b></font>
        const extraer = (patron) => {
            const match = htmlSAES.match(patron)
            return match ? normalizar(match[1]) : ''
        }

        const nombreSAES = extraer(/Nombre del estudiante:\s*<\/font><font[^>]*><b>([^<]+)<\/b>/)
        const curpSAES = extraer(/CURP:\s*<\/font><font[^>]*>([^<]+)<\/font>/)
        const boletaSAES = extraer(/Boleta:\s*<\/font><font[^>]*>([^<]+)<\/font>/)
        const vigencia = extraer(/Vigencia del documento:\s*<\/font><font[^>]*>([^<]+)<\/font>/)

        console.log('Datos SAES:', { nombreSAES, curpSAES, boletaSAES, vigencia })

        // Si no se extrajeron datos
        if (!nombreSAES && !curpSAES) {
            return res.status(400).json({
                valido: false,
                message: 'No se pudo extraer información del sistema del IPN. Verifica que la constancia sea válida.',
            })
        }

        // 6. Comparar datos del registro con los oficiales del SAES
        const errores = []

        if (nombreSAES && !nombreSAES.includes(normalizar(apellidoP))) {
            errores.push(`El apellido paterno "${apellidoP}" no coincide con la constancia.`)
        }
        if (nombreSAES && !nombreSAES.includes(normalizar(nombres))) {
            errores.push(`El nombre "${nombres}" no coincide con la constancia.`)
        }
        if (curpSAES && curp && curpSAES !== normalizar(curp)) {
            errores.push(`La CURP "${curp}" no coincide con la constancia.`)
        }
        if (boletaSAES && boleta && boletaSAES !== normalizar(boleta)) {
            errores.push(`La boleta "${boleta}" no coincide con la constancia.`)
        }

        if (errores.length > 0) {
            return res.status(400).json({ valido: false, message: errores[0], errores })
        }

        // 7. Verificar vigencia — si está vencida, rechazar
        if (htmlSAES.includes('Ya no se encuentra dentro del periodo')) {
            return res.status(400).json({
                valido: false,
                message: 'La constancia está fuera del periodo de vigencia. Debes subir una constancia vigente.',
            })
        }

        res.json({
            valido: true,
            message: 'Constancia verificada correctamente.',
            datos: { nombre: nombreSAES, curp: curpSAES, boleta: boletaSAES, vigencia },
        })

    } catch (error) {
        console.error('Error en validarConstancia:', error)
        res.status(500).json({ valido: false, message: 'Error al validar el documento. Intenta de nuevo.' })
    }
}

// ────────────────────────────────────────────────────────────────
// POST /api/documentos/validar-curp
// Body: { pdfBase64, nombres, apellidoP, apellidoM, curp }
// El QR de la CURP oficial contiene texto con formato pipe:
// CURP||APELLIDO_PAT|APELLIDO_MAT|NOMBRES|SEXO|FECHA_NAC|PAIS|ESTADO|
// ────────────────────────────────────────────────────────────────
const validarCurp = async (req, res) => {
    try {
        const { pdfBase64, nombres, apellidoP, apellidoM, curp, fechaNac } = req.body
        if (!pdfBase64) return res.status(400).json({ valido: false, message: 'No se recibió el PDF.' })
        const fechaNacReg = fechaNac || ''

        // 1. Subir PDF a PDF.co
        const fileUrl = await subirArchivo(pdfBase64, 'curp.pdf')

        // 2. Extraer QR del PDF (contiene los datos directamente en texto)
        const barcodes = await extraerQR(fileUrl)
        console.log('Barcodes CURP encontrados:', barcodes.length)

        if (!barcodes.length) {
            return res.status(400).json({
                valido: false,
                message: 'No se encontró código QR en el documento de CURP. Verifica que sea el PDF oficial de RENAPO.',
            })
        }

        // 3. Parsear datos del QR
        // Formato: CURP||APELLIDO_PAT|APELLIDO_MAT|NOMBRES|SEXO|FECHA_NAC|PAIS|ESTADO|
        const qrText = barcodes[0]?.Value || barcodes[0]?.value || ''
        console.log('QR CURP texto:', qrText)

        const partes = qrText.split('|').map(p => p.trim())
        // Formato: CURP||ApePat|ApeMat|Nombres|Sexo|DD/MM/YYYY|Pais|Estado|
        const curpQR     = normalizar(partes[0] || '')
        const apePatQR   = normalizar(partes[2] || '')
        const apeMatQR   = normalizar(partes[3] || '')
        const nombresQR  = normalizar(partes[4] || '')
        const fechaNacQR = partes[6] || '' // DD/MM/YYYY

        console.log('Datos QR CURP:', { curpQR, apePatQR, apeMatQR, nombresQR })

        // Verificar que el QR tenga estructura de CURP
        if (!curpQR || curpQR.length !== 18) {
            return res.status(400).json({
                valido: false,
                message: 'El QR del documento no contiene datos de CURP válidos.',
            })
        }

        // 4. Comparar con datos del registro
        const curpReg = normalizar(curp)
        const apePatReg = normalizar(apellidoP)
        const apeMatReg = normalizar(apellidoM || '')
        const nombresReg = normalizar(nombres)

        const errores = []

        if (curpQR !== curpReg) {
            errores.push(`La CURP ingresada "${curp}" no coincide con el documento.`)
        }
        if (apePatQR && apePatReg && apePatQR !== apePatReg) {
            errores.push(`El apellido paterno "${apellidoP}" no coincide con el documento.`)
        }
        if (apeMatQR && apeMatReg && apeMatQR !== apeMatReg) {
            errores.push(`El apellido materno "${apellidoM}" no coincide con el documento.`)
        }
        if (nombresQR && nombresReg && !nombresQR.includes(nombresReg) && !nombresReg.includes(nombresQR)) {
            errores.push(`El nombre "${nombres}" no coincide con el documento..`)
        }
        // Validar fecha de nacimiento si fue proporcionada
        if (fechaNacQR && fechaNacReg) {
            // QR viene DD/MM/YYYY, registro viene YYYY-MM-DD
            const [dd, mm, yyyy] = fechaNacQR.split('/')
            const fechaQRNorm = `${yyyy}-${mm}-${dd}` // convertir a YYYY-MM-DD
            if (fechaQRNorm !== fechaNacReg) {
                errores.push(`La fecha de nacimiento no coincide con el documento CURP.`)
            }
        }

        if (errores.length > 0) {
            return res.status(400).json({ valido: false, message: errores[0], errores })
        }

        res.json({
            valido: true,
            message: 'CURP verificada correctamente.',
            datos: { curp: curpQR, apellidoPaterno: apePatQR, apellidoMaterno: apeMatQR, nombres: nombresQR },
        })

    } catch (error) {
        console.error('Error en validarCurp:', error)
        res.status(500).json({ valido: false, message: 'Error al validar el documento. Intenta de nuevo.' })
    }
}

module.exports = { validarConstancia, validarCurp }