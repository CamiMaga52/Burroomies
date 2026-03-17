// src/arrendador/EditarPropiedad.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Upload, Info, X } from 'lucide-react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';

const TIPOS_PROPIEDAD   = ['Habitación', 'Departamento', 'Casa', 'Cuarto compartido'];
const SERVICIOS_BASICOS = ['Agua', 'Luz', 'Gas'];
const SERVICIOS_COM_ENT = ['Internet', 'TV por cable'];
const SERVICIOS_ADICIONALES = [
  'Amueblada', 'Estacionamiento', 'Gimnasio o alberca',
  'Mantenimiento y limpieza', 'Seguridad', 'Elevador',
];

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload  = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

/* Convierte el string de servicios guardado ("Agua, Luz") a array */
const strToArr = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

export default function EditarPropiedad({
  idPropiedad,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
}) {
  const [paso,      setPaso]      = useState(1);
  const [form,      setForm]      = useState(null);   // null = cargando
  const [errores,   setErrores]   = useState({});
  const [fotos,     setFotos]     = useState([]);     // { preview, file? }
  const [dragging,  setDragging]  = useState(false);
  const [enviando,  setEnviando]  = useState(false);
  const [showExito, setShowExito] = useState(false);
  const [cargando,  setCargando]  = useState(true);
  const fotoRef = useRef(null);

  /* ── Cargar datos actuales de la propiedad ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch(`http://localhost:3001/api/propiedades/${idPropiedad}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al cargar');
        const p = await res.json();
        setForm({
          titulo:       p.propiedadTitulo      || '',
          descripcion:  p.propiedadDescripcion || '',
          tipo:         p.propiedadTipo        || '',
          renta:        p.propiedadPrecio      || '',
          ocupabilidad: p.propiedadLugares     || '',
          calle:        p.propiedadCalle       || '',
          numExt:       p.propiedadNumExt      || '',
          numInt:       p.propiedadNumInt      || '',
          colonia:      p.propiedadColonia     || '',
          municipio:    p.propiedadMunicipio   || '',
          estado:       p.propiedadEstado      || '',
          cp:           p.propiedadCp          || '',
          serBasicos:   strToArr(p.propiedadSerBasicos),
          serComEnt:    strToArr(p.propiedadSerComEnt),
          serAdicio:    strToArr(p.propiedadSerAdicio),
        });
        // Fotos existentes (base64 strings)
        if (p.propiedadFotos) {
          try {
            const arr = JSON.parse(p.propiedadFotos);
            setFotos(arr.map(src => ({ preview: src, file: null })));
          } catch {}
        }
      } catch (err) {
        console.error(err);
        alert('No se pudo cargar la propiedad.');
        onMisViviendas?.();
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [idPropiedad]);

  const setField     = (key) => (e) => { setForm(f => ({ ...f, [key]: e.target.value })); setErrores(p => ({ ...p, [key]: '' })); };
  const toggleLista  = (key, val) => setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val] }));

  /* ── Fotos ── */
  const agregarFotos = (files) => {
    const nuevas = Array.from(files).slice(0, 10 - fotos.length);
    setFotos(prev => [...prev, ...nuevas.map(file => ({ preview: URL.createObjectURL(file), file }))]);
  };
  const eliminarFoto    = (i) => setFotos(prev => prev.filter((_, idx) => idx !== i));
  const handleDropFotos = (e) => { e.preventDefault(); setDragging(false); agregarFotos(e.dataTransfer.files); };

  /* ── Validaciones ── */
  const validarPaso1 = () => {
    const errs = {};
    if (!form.titulo.trim())       errs.titulo       = 'El título es obligatorio';
    if (!form.descripcion.trim())  errs.descripcion  = 'La descripción es obligatoria';
    if (!form.tipo)                errs.tipo         = 'Selecciona un tipo';
    if (!form.renta || form.renta <= 0) errs.renta   = 'Ingresa una renta válida';
    if (!form.ocupabilidad || form.ocupabilidad < 1) errs.ocupabilidad = 'Mínimo 1 lugar';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };
  const validarPaso2 = () => {
    const errs = {};
    if (!form.calle.trim())     errs.calle     = 'La calle es obligatoria';
    if (!form.colonia.trim())   errs.colonia   = 'La colonia es obligatoria';
    if (!form.municipio.trim()) errs.municipio = 'El municipio es obligatorio';
    if (!form.estado.trim())    errs.estado    = 'El estado es obligatorio';
    if (!form.cp.trim() || !/^\d{5}$/.test(form.cp)) errs.cp = 'CP de 5 dígitos';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const siguiente = (e) => { e.preventDefault(); if (paso === 1 && !validarPaso1()) return; if (paso === 2 && !validarPaso2()) return; setPaso(p => p + 1); setErrores({}); };
  const anterior  = () => { setPaso(p => p - 1); setErrores({}); };

  /* ── Guardar cambios ── */
  const handleGuardar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const fotosBase64 = await Promise.all(
        fotos.map(f => f.file ? fileToBase64(f.file) : Promise.resolve(f.preview))
      );
      const token = localStorage.getItem('burroomies_token');
      const body = {
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
        propiedadFotos:       JSON.stringify(fotosBase64),
      };
      const res = await fetch(`http://localhost:3001/api/propiedades/${idPropiedad}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Error al guardar.'); return; }
      setShowExito(true);
    } catch (err) {
      console.error(err);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setEnviando(false);
    }
  };

  function Err({ campo }) {
    if (!errores[campo]) return null;
    return <span style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: 2 }}>{errores[campo]}</span>;
  }

  if (cargando || !form) return (
    <ArrendadorLayout onMisViviendas={onMisViviendas} onMisArrendamientos={onMisArrendamientos} onVerPerfil={onVerPerfil} onCerrarSesion={onCerrarSesion}>
      <p style={{ color: 'var(--purple-dark)', fontWeight: 600 }}>Cargando propiedad...</p>
    </ArrendadorLayout>
  );

  return (
    <ArrendadorLayout onMisViviendas={onMisViviendas} onMisArrendamientos={onMisArrendamientos} onVerPerfil={onVerPerfil} onCerrarSesion={onCerrarSesion}>
      <div style={{ width: '100%', maxWidth: 720 }}>

        <h1 className={s.pageTitle}>Editar Propiedad</h1>
        <p className={s.pageSubtitle}>Actualiza la información de tu propiedad</p>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['Información básica', 'Ubicación y servicios', 'Fotografías'].map((label, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                height: 4, borderRadius: 4, marginBottom: 4,
                background: paso > i ? 'var(--purple-main)' : paso === i + 1 ? 'var(--purple-mid)' : '#e2e8f0',
              }} />
              <span style={{ fontSize: '0.72rem', color: paso === i + 1 ? 'var(--purple-main)' : '#999' }}>
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
                  <input className={s.input} type="text" value={form.titulo} onChange={setField('titulo')} />
                  <Err campo="titulo" />
                </div>
                <div className={s.campo}>
                  <label className={s.label}>Descripción</label>
                  <textarea className={s.textarea} value={form.descripcion} onChange={setField('descripcion')} />
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
                    <input className={s.input} type="number" min="0" value={form.renta} onChange={setField('renta')} />
                    <Err campo="renta" />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Lugares disponibles</label>
                    <input className={s.input} type="number" min="1" max="20" value={form.ocupabilidad} onChange={setField('ocupabilidad')} />
                    <Err campo="ocupabilidad" />
                  </div>
                </div>
              </div>
            </div>
            <div className={`${s.navRow} ${s.navRowEnd}`}>
              <button type="button" className={s.btnAnterior} onClick={onMisViviendas}>
                <ChevronLeft size={18} /> Cancelar
              </button>
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
                  <div className={s.campo} style={{ gridColumn: '1/3' }}>
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
                    <input className={s.input} type="text" maxLength={5} value={form.cp} onChange={setField('cp')} />
                    <Err campo="cp" />
                  </div>
                </div>
                <div className={s.grid3}>
                  <div className={s.campo}>
                    <label className={s.label}>Municipio</label>
                    <input className={s.input} type="text" value={form.municipio} onChange={setField('municipio')} />
                    <Err campo="municipio" />
                  </div>
                  <div className={s.campo} style={{ gridColumn: '2/4' }}>
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
                        <input type="checkbox" checked={form.serBasicos.includes(sv)} onChange={() => toggleLista('serBasicos', sv)} />
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
                        <input type="checkbox" checked={form.serComEnt.includes(sv)} onChange={() => toggleLista('serComEnt', sv)} />
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
                        <input type="checkbox" checked={form.serAdicio.includes(sv)} onChange={() => toggleLista('serAdicio', sv)} />
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
          <form onSubmit={handleGuardar}>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Fotografías</h2>
              <div className={s.formSection}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={15} /> Puedes agregar o eliminar fotos. Máximo 10.
                </p>
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
                      style={{ display: 'none' }}
                      onChange={e => agregarFotos(e.target.files)} />
                    <Upload size={36} className={s.photoZoneIcon} />
                    <p className={s.photoZoneText}>
                      {fotos.length === 0 ? 'Haz clic o arrastra fotos aquí.' : `${fotos.length}/10 fotos — clic para agregar más.`}
                    </p>
                  </div>
                )}
                {fotos.length > 0 && (
                  <div className={s.photoGrid}>
                    {fotos.map((f, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={f.preview} alt={`Foto ${i + 1}`} className={s.photoThumb} />
                        <button type="button" onClick={() => eliminarFoto(i)}
                          style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                {enviando ? 'Guardando...' : <>Guardar cambios <ChevronRight size={18} /></>}
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
                <path d="M10 20 L17 28 L30 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={s.modalTexto}>La propiedad se ha actualizado<br />correctamente.</p>
            <button type="button" className={s.btnAceptar} onClick={() => { setShowExito(false); onMisViviendas?.(); }}>
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}