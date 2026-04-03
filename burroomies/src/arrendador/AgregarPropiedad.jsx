// src/arrendador/AgregarPropiedad.jsx
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Info, X } from 'lucide-react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';

const TIPOS_PROPIEDAD = ['Habitación', 'Departamento', 'Casa', 'Cuarto compartido'];

const SERVICIOS_BASICOS      = ['Agua', 'Luz', 'Gas'];
const SERVICIOS_COM_ENT      = ['Internet', 'TV por cable'];
const SERVICIOS_ADICIONALES  = [
  'Amueblada', 'Estacionamiento', 'Gimnasio o alberca',
  'Mantenimiento y limpieza', 'Seguridad', 'Elevador',
];

const FORM_INICIAL = {
  titulo: '', descripcion: '', tipo: '', renta: '', ocupabilidad: '',
  calle: '', numExt: '', numInt: '', colonia: '', municipio: '', estado: '', cp: '',
  serBasicos: [], serComEnt: [], serAdicio: [],
};

/* ── Convierte un File a string Base64 ── */
const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload  = () => resolve(reader.result); // incluye "data:image/...;base64,..."
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export default function AgregarPropiedad({ onMisViviendas, onCerrarSesion, onAtras }) {
  const [paso,      setPaso]      = useState(1);
  const [form,      setForm]      = useState(FORM_INICIAL);
  const [errores,   setErrores]   = useState({});
  const [showExito, setShowExito] = useState(false);
  const [enviando,  setEnviando]  = useState(false);
  const [dragging,  setDragging]  = useState(false);

  // fotos: array de { preview: string (objectURL), file: File }
  const [fotos, setFotos] = useState([]);
  const fotoRef = useRef(null);

  /* ── Helpers ── */
  const setField = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrores(prev => ({ ...prev, [key]: '' }));
  };
  const toggleLista = (key, val) => setForm(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
  }));

  /* ── Fotos ── */
  const agregarFotos = (files) => {
    const nuevas = Array.from(files).slice(0, 10 - fotos.length);
    const items  = nuevas.map(file => ({ preview: URL.createObjectURL(file), file }));
    setFotos(prev => [...prev, ...items]);
  };
  const eliminarFoto = (i) => {
    setFotos(prev => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };
  const handleDropFotos = (e) => {
    e.preventDefault(); setDragging(false);
    agregarFotos(e.dataTransfer.files);
  };

  /* ── Validaciones por paso ── */
  const validarPaso1 = () => {
    const e = {};
    if (!form.titulo.trim())      e.titulo       = 'El título es obligatorio.';
    if (!form.descripcion.trim()) e.descripcion  = 'La descripción es obligatoria.';
    if (!form.tipo)               e.tipo         = 'Selecciona un tipo de propiedad.';
    if (!form.renta)              e.renta        = 'La renta es obligatoria.';
    else if (+form.renta <= 0)    e.renta        = 'Ingresa una renta válida.';
    if (!form.ocupabilidad)       e.ocupabilidad = 'La ocupabilidad es obligatoria.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };
  const validarPaso2 = () => {
    const e = {};
    if (!form.calle.trim())     e.calle     = 'La calle es obligatoria.';
    if (!String(form.colonia || '').trim())   e.colonia   = 'La colonia es obligatoria.';
    if (!form.municipio.trim()) e.municipio = 'El municipio es obligatorio.';
    if (!form.estado.trim())    e.estado    = 'El estado es obligatorio.';
    if (!form.cp.trim())        e.cp        = 'El código postal es obligatorio.';
    else if (!/^\d{5}$/.test(form.cp)) e.cp = 'El CP debe tener 5 dígitos.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  /* ── Navegación ── */
  const siguiente = (e) => {
    e.preventDefault();
    if (paso === 1 && !validarPaso1()) return;
    if (paso === 2 && !validarPaso2()) return;
    setPaso(p => p + 1);
  };
  const anterior = () => { setPaso(p => p - 1); setErrores({}); };

  /* ── Enviar al backend ── */
  const handleAgregar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      // Convertir todas las fotos a Base64
      const fotosBase64 = await Promise.all(fotos.map(f => fileToBase64(f.file)));

      const token = localStorage.getItem('burroomies_token');
      const body  = {
        propiedadTitulo:      form.titulo,
        propiedadDescripcion: form.descripcion,
        propiedadTipo:        form.tipo,
        propiedadPrecio:      form.renta,
        propiedadLugares:     form.ocupabilidad,
        propiedadCalle:       form.calle,
        propiedadNumExt:      form.numExt ? parseInt(form.numExt) : null,
        propiedadNumInt:      form.numInt ? parseInt(form.numInt) : null,
        propiedadColonia:     form.colonia,
        propiedadMunicipio:   form.municipio,
        propiedadEstado:      form.estado,
        propiedadCp:          form.cp,
        propiedadSerBasicos:  form.serBasicos.join(', '),
        propiedadSerComEnt:   form.serComEnt.join(', '),
        propiedadSerAdicio:   form.serAdicio.join(', '),
        propiedadFotos:       JSON.stringify(fotosBase64), // array → string JSON
        propiedadEstatus:     'Activa',
      };

      const res = await fetch('http://localhost:3001/api/propiedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message?.includes('código postal') || data.message?.includes('zona') || data.message?.includes('CP')) {
          setErrores(prev => ({ ...prev, cp: data.message }));
          setPaso(2);
        } else {
          alert(data.message || 'Error al agregar la propiedad.');
        }
        return;
      }

      setShowExito(true);
    } catch (err) {
      console.error(err);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  const handleAceptarExito = () => {
    setShowExito(false);
    onMisViviendas?.();
  };

  const Err = ({ campo }) => errores[campo]
    ? <span style={{ color:'#e53e3e', fontSize:'0.75rem', marginTop:2 }}>{errores[campo]}</span>
    : null;

  return (
    <ArrendadorLayout onMisViviendas={onMisViviendas} onCerrarSesion={onCerrarSesion}>
      <div style={{ width:'100%', maxWidth:720 }}>

        {onAtras && (
          <button
            type="button"
            onClick={onAtras}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7B2D6E', fontWeight: 700, fontSize: '0.9rem',
              marginBottom: 16, padding: 0,
            }}
          >
            ← Regresar
          </button>
        )}

        <h1 className={s.pageTitle}>Agregar Propiedad</h1>
        <p className={s.pageSubtitle}>Completa la información de tu propiedad para publicar el anuncio</p>

        {/* Indicador de pasos */}
        <div style={{ display:'flex', gap:8, marginBottom:24 }}>
          {['Información básica','Ubicación y servicios','Fotografías'].map((label, i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:4, borderRadius:4, marginBottom:4,
                background: paso > i ? 'var(--purple-main)' : paso === i+1 ? 'var(--purple-mid)' : '#e2e8f0'
              }} />
              <span style={{ fontSize:'0.72rem', color: paso === i+1 ? 'var(--purple-main)' : '#999' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ═══ PASO 1 ═══ */}
        {paso === 1 && (
          <form onSubmit={siguiente} noValidate>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Información Básica</h2>
              <div className={s.formSection}>

                <div className={s.campo}>
                  <label className={s.label}>Título del anuncio</label>
                  <input className={s.input} type="text"
                    placeholder="Ej: Habitación amueblada cerca de la UPALM"
                    value={form.titulo} onChange={setField('titulo')} />
                  <Err campo="titulo" />
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Descripción</label>
                  <textarea className={s.textarea}
                    placeholder="Describe tu propiedad, características, reglas de la casa..."
                    value={form.descripcion} onChange={setField('descripcion')} />
                  <Err campo="descripcion" />
                </div>

                <div className={s.grid3}>
                  <div className={s.campo}>
                    <label className={s.label}>Tipo de propiedad</label>
                    <div className={s.selectWrapper}>
                      <select className={s.select} value={form.tipo} onChange={setField('tipo')}>
                        <option value="" disabled>Selecciona</option>
                        {TIPOS_PROPIEDAD.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className={s.selectArrow}>⌄</span>
                    </div>
                    <Err campo="tipo" />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Renta mensual (MXN)</label>
                    <input className={s.input} type="number" min="0"
                      value={form.renta} onChange={setField('renta')} />
                    <Err campo="renta" />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Lugares disponibles</label>
                    <input className={s.input} type="number" min="1" max="20"
                      value={form.ocupabilidad} onChange={setField('ocupabilidad')} />
                    <Err campo="ocupabilidad" />
                  </div>
                </div>

              </div>
            </div>
            <div className={`${s.navRow} ${s.navRowEnd}`}>
              <button type="submit" className={s.btnSiguiente}>
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* ═══ PASO 2 ═══ */}
        {paso === 2 && (
          <form onSubmit={siguiente} noValidate>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Ubicación y Servicios</h2>
              <div className={s.formSection}>

                <div className={s.grid3}>
                  <div className={s.campo} style={{ gridColumn:'1/3' }}>
                    <label className={s.label}>Calle</label>
                    <input className={s.input} type="text" value={form.calle} onChange={setField('calle')} />
                    <Err campo="calle" />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>No. Exterior</label>
                    <input className={s.input} type="number" value={form.numExt} onChange={setField('numExt')} />
                  </div>
                </div>

                <div className={s.grid3}>
                  <div className={s.campo}>
                    <label className={s.label}>No. Interior</label>
                    <input className={s.input} type="text" value={form.numInt} onChange={setField('numInt')} />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Colonia</label>
                    <input className={s.input} type="text" value={form.colonia} onChange={setField('colonia')} />
                    <Err campo="colonia" />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Código postal</label>
                    <input className={s.input} type="text" maxLength={5} value={form.cp}
                      onChange={async (e) => {
                        const cp = e.target.value;
                        setForm(f => ({ ...f, cp }));
                        setErrores(prev => ({ ...prev, cp: '' }));
                        if (/^\d{5}$/.test(cp)) {
                          try {
                            const res = await fetch(
                              `https://api.copomex.com/query/info_cp/${cp}?type=simplified&token=4db2db82-8f5e-4108-8754-1b24d572a41a`
                            );
                            const data = await res.json();
                            const info = data.response || data;
                            if (info && !data.error) {
                              const colonia = Array.isArray(info.asentamiento)
                                ? info.asentamiento[0]
                                : (info.asentamiento || info.colonia || '');
                              setForm(f => ({
                                ...f, cp, colonia,
                                municipio: info.municipio || f.municipio,
                                estado:    info.estado    || f.estado,
                              }));
                              setErrores(prev => ({ ...prev, cp: '', colonia: '', municipio: '', estado: '' }));
                            }
                          } catch {}
                        }
                      }}
                    />
                    <Err campo="cp" />
                  </div>
                </div>

                <div className={s.grid3}>
                  <div className={s.campo}>
                    <label className={s.label}>Municipio</label>
                    <input className={s.input} type="text" value={form.municipio} onChange={setField('municipio')} />
                    <Err campo="municipio" />
                  </div>
                  <div className={s.campo} style={{ gridColumn:'2/4' }}>
                    <label className={s.label}>Estado</label>
                    <input className={s.input} type="text" value={form.estado} onChange={setField('estado')} />
                    <Err campo="estado" />
                  </div>
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Servicios básicos incluidos</label>
                  <div className={s.checkGrid}>
                    {SERVICIOS_BASICOS.map(sv => (
                      <label key={sv} className={s.checkLabel}>
                        <input type="checkbox" checked={form.serBasicos.includes(sv)}
                          onChange={() => toggleLista('serBasicos', sv)} />
                        <span className={s.checkBox} /> {sv}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Comunicación y entretenimiento</label>
                  <div className={s.checkGrid}>
                    {SERVICIOS_COM_ENT.map(sv => (
                      <label key={sv} className={s.checkLabel}>
                        <input type="checkbox" checked={form.serComEnt.includes(sv)}
                          onChange={() => toggleLista('serComEnt', sv)} />
                        <span className={s.checkBox} /> {sv}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Servicios adicionales</label>
                  <div className={s.checkGrid}>
                    {SERVICIOS_ADICIONALES.map(sv => (
                      <label key={sv} className={s.checkLabel}>
                        <input type="checkbox" checked={form.serAdicio.includes(sv)}
                          onChange={() => toggleLista('serAdicio', sv)} />
                        <span className={s.checkBox} /> {sv}
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            <div className={s.navRow}>
              <button type="button" className={s.btnAnterior} onClick={anterior}>
                <ChevronLeft size={18} /> Anterior
              </button>
              <button type="submit" className={s.btnSiguiente}>
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* ═══ PASO 3: Fotografías ═══ */}
        {paso === 3 && (
          <form onSubmit={handleAgregar}>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Fotografías</h2>
              <div className={s.formSection}>

                <p style={{ fontSize:'0.85rem', color:'var(--text-mid)', margin:0, display:'flex', alignItems:'center', gap:6 }}>
                  <Info size={15} /> Agrega hasta 10 fotos. Se guardarán en la base de datos.
                </p>

                {/* Zona de drop */}
                {fotos.length < 10 && (
                  <div
                    className={`${s.photoZone} ${dragging ? s.photoZoneDragging : ''}`}
                    onClick={() => fotoRef.current?.click()}
                    onDrop={handleDropFotos}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    role="button" tabIndex={0}
                  >
                    <input ref={fotoRef} type="file" accept="image/*" multiple
                      style={{ display:'none' }}
                      onChange={e => agregarFotos(e.target.files)} />
                    <Upload size={36} className={s.photoZoneIcon} />
                    <p className={s.photoZoneText}>
                      {fotos.length === 0
                        ? 'Haz clic o arrastra fotos aquí.'
                        : `${fotos.length}/10 fotos — clic para agregar más.`}
                    </p>
                  </div>
                )}

                {/* Previsualización con botón eliminar */}
                {fotos.length > 0 && (
                  <div className={s.photoGrid}>
                    {fotos.map((f, i) => (
                      <div key={i} style={{ position:'relative' }}>
                        <img src={f.preview} alt={`Foto ${i+1}`} className={s.photoThumb} />
                        <button
                          type="button"
                          onClick={() => eliminarFoto(i)}
                          style={{
                            position:'absolute', top:4, right:4,
                            background:'rgba(0,0,0,0.6)', border:'none',
                            borderRadius:'50%', width:22, height:22,
                            cursor:'pointer', display:'flex',
                            alignItems:'center', justifyContent:'center',
                          }}
                        >
                          <X size={13} color="white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            <div className={s.navRow}>
              <button type="button" className={s.btnAnterior} onClick={anterior}>
                <ChevronLeft size={18} /> Anterior
              </button>
              <button type="submit" className={s.btnSiguiente} disabled={enviando}>
                {enviando ? 'Guardando...' : <>Agregar <ChevronRight size={18} /></>}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Modal de éxito */}
      {showExito && (
        <div className={s.overlay}>
          <div className={s.modal} role="dialog" aria-modal="true">
            <div className={`${s.modalIcon} ${s.modalIconVerde}`}>
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <path d="M10 20 L17 28 L30 12" stroke="white" strokeWidth="4"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={s.modalTexto}>La propiedad se ha agregado<br />correctamente.</p>
            <button type="button" className={s.btnAceptar} onClick={handleAceptarExito}>
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}