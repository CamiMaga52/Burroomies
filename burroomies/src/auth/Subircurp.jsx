// src/auth/SubirCurp.jsx
import { useState, useRef } from 'react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import s  from './auth.module.css';
import cs from './SubirConstancia.module.css';

const IconUpload = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconPDF = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconShield = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
    stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function SubirCurp({
  onSiguiente,
  onCancelar,
  datosRegistro,
  onPaginaPrincipal,
  onInicioSesion,
}) {
  const [archivo,   setArchivo]   = useState(null);
  const [validando, setValidando] = useState(false);
  const [validado,  setValidado]  = useState(false);
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  const handleArchivo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Solo se aceptan archivos PDF.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('El archivo no debe superar 10MB.'); return; }
    setArchivo(file);
    setError(''); setValidado(false);
  };

  const handleValidar = async () => {
    if (!archivo) { setError('Selecciona tu documento de CURP.'); return; }
    setValidando(true); setError('');
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload  = () => res(reader.result.split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(archivo);
      });
      const res = await fetch('http://localhost:3001/api/documentos/validar-curp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: base64,
          nombres:   datosRegistro?.nombres   || '',
          apellidoP: datosRegistro?.apellidoP || '',
          apellidoM: datosRegistro?.apellidoM || '',
          curp:      datosRegistro?.curp      || '',
          fechaNac:  datosRegistro?.fechaNac   || '',
        }),
      });
      const data = await res.json();
      if (!data.valido) { setError(data.message || 'El documento no pudo ser verificado.'); return; }
      setValidado(true);
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor de validación.');
    } finally {
      setValidando(false);
    }
  };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <div style={{
        background: 'white', borderRadius: 20, padding: '36px 32px',
        width: '100%', maxWidth: 460,
        boxShadow: '0 8px 40px rgba(45,37,80,0.12)',
      }}>

        {/* Ícono decorativo */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
          <div style={{
            width:72, height:72, borderRadius:'50%',
            background:'linear-gradient(135deg,#ede9f8,#dce8f8)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <IconShield />
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16, textAlign:'center' }}>
          <h2 className={s.titulo}>Sube tu CURP</h2>
          <p className={s.descripcion}>
            Necesitamos verificar tu identidad como arrendador.<br/>
            Sube el PDF de tu CURP descargado desde el portal oficial de RENAPO.
          </p>
          <p style={{ fontSize:'0.78rem', color:'#e53e3e', fontWeight:600, margin:0 }}>
            * Este paso es obligatorio para completar tu registro.
          </p>
        </div>

        {/* Zona de carga */}
        <div className={cs.uploadZone} onClick={() => inputRef.current?.click()}
          style={{ cursor:'pointer', borderColor: validado ? '#22c55e' : archivo ? '#8B5CF6' : undefined }}>
          <input ref={inputRef} type="file" accept=".pdf"
            style={{ display:'none' }} onChange={handleArchivo} />
          {archivo ? (
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <IconPDF />
              <div style={{ flex:1, textAlign:'left' }}>
                <p style={{ fontWeight:700, color:'#2d2550', margin:0, fontSize:'0.88rem' }}>
                  {archivo.name}
                </p>
                <p style={{ color:'#888', margin:0, fontSize:'0.75rem' }}>
                  {(archivo.size / 1024).toFixed(0)} KB
                </p>
              </div>
              {validado && <IconCheck />}
            </div>
          ) : (
            <div style={{ textAlign:'center', color:'#9ca3af' }}>
              <IconUpload />
              <p style={{ margin:'8px 0 0', fontSize:'0.85rem', fontWeight:600 }}>
                Haz clic para seleccionar tu CURP
              </p>
              <p style={{ margin:'4px 0 0', fontSize:'0.75rem' }}>Solo PDF • Máx. 10MB</p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:'#fff5f5', border:'1px solid #fed7d7', borderRadius:10,
            padding:'10px 14px', marginTop:10,
            color:'#e53e3e', fontSize:'0.82rem', fontWeight:600,
          }}>⚠️ {error}</div>
        )}

        {/* Éxito */}
        {validado && (
          <div style={{
            background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10,
            padding:'10px 14px', marginTop:10,
            color:'#16a34a', fontSize:'0.82rem', fontWeight:600,
            display:'flex', alignItems:'center', gap:8,
          }}><IconCheck /> CURP verificada correctamente</div>
        )}

        {/* Botones — sin opción de saltar */}
        <div style={{ marginTop:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
            <button type="button"
              onClick={onCancelar}
              style={{
                background:'transparent', border:'1px solid #c8b8e8',
                borderRadius:20, color:'#6d3fc0',
                fontSize:'0.85rem', cursor:'pointer', padding:'8px 18px',
                fontWeight:600,
              }}>
              ← Regresar
            </button>

            {!validado ? (
              <button type="button" className={`${s.btnSiguiente} ${cs.btnSig}`}
                onClick={handleValidar} disabled={!archivo || validando}>
                {validando ? 'Verificando...' : 'Verificar »'}
              </button>
            ) : (
              <button type="button" className={`${s.btnSiguiente} ${cs.btnSig}`}
                onClick={onSiguiente}>
                Continuar »
              </button>
            )}
          </div>
        </div>

      </div>
    </AuthLayout>
  );
}