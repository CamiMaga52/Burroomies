// src/arrendador/AgregarPropiedad.jsx
// Formulario de 3 pasos para agregar una nueva propiedad.
// Paso 1: Información básica
// Paso 2: Ubicación y servicios
// Paso 3: Fotografías + modal de éxito
//
// Props:
//   onGuardar:      fn(datos)  — callback al completar
//   onMisViviendas: fn
//   onCerrarSesion: fn
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Upload, Info } from 'lucide-react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';

const TIPOS_PROPIEDAD = ['Habitación', 'Departamento', 'Casa', 'Cuarto compartido'];
const SERVICIOS = [
  'Servicio de internet', 'Elevador',
  'Amueblada',            'Estacionamiento',
  'Mantenimiento y limpieza', 'Gimnasio o alberca',
  'Seguridad',            'Servicio de TV por cable',
];

const FORM_INICIAL = {
  titulo: '', descripcion: '', tipo: '', renta: '', ocupabilidad: '',
  direccion: '', cp: '',
  servicios: [],
  fotos: [],
};

export default function AgregarPropiedad({ onGuardar, onMisViviendas, onCerrarSesion }) {
  const [paso,        setPaso]      = useState(1);
  const [form,        setForm]      = useState(FORM_INICIAL);
  const [showExito,   setShowExito] = useState(false);
  const [dragging,    setDragging]  = useState(false);
  const fotoRef = useRef(null);

  /* ── Helpers de form ── */
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggleServicio = (serv) => setForm((f) => ({
    ...f,
    servicios: f.servicios.includes(serv)
      ? f.servicios.filter((x) => x !== serv)
      : [...f.servicios, serv],
  }));

  /* ── Fotos ── */
  const agregarFotos = (files) => {
    const nuevas = Array.from(files).slice(0, 10 - form.fotos.length);
    const urls   = nuevas.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...urls] }));
  };
  const handleDropFotos = (e) => {
    e.preventDefault(); setDragging(false);
    agregarFotos(e.dataTransfer.files);
  };

  /* ── Navegación ── */
  const siguiente = (e) => { e.preventDefault(); setPaso((p) => p + 1); };
  const anterior  = ()    => setPaso((p) => p - 1);

  const handleAgregar = (e) => {
    e.preventDefault();
    setShowExito(true);
  };
  const handleAceptarExito = () => {
    setShowExito(false);
    onGuardar?.(form);
    onMisViviendas?.();
  };

  return (
    <ArrendadorLayout onMisViviendas={onMisViviendas} onCerrarSesion={onCerrarSesion}>
      <div style={{ width: '100%', maxWidth: 720 }}>

        {/* Encabezado global */}
        <h1 className={s.pageTitle}>Agregar Propiedad</h1>
        <p className={s.pageSubtitle}>Completa la información de tu propiedad para publicar el anuncio</p>

        {/* ═══════════ PASO 1: Info básica ═══════════ */}
        {paso === 1 && (
          <form onSubmit={siguiente}>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Información Básica</h2>
              <div className={s.formSection}>

                <div className={s.campo}>
                  <label className={s.label}>Título del anuncio</label>
                  <input
                    className={s.input}
                    type="text"
                    placeholder="Ej: Habitación amueblada cerca de la UPALM"
                    value={form.titulo}
                    onChange={setField('titulo')}
                    required
                  />
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Descripción</label>
                  <textarea
                    className={s.textarea}
                    placeholder="Describe tu propiedad, características, etc."
                    value={form.descripcion}
                    onChange={setField('descripcion')}
                    required
                  />
                </div>

                <div className={s.grid3}>
                  <div className={s.campo}>
                    <label className={s.label}>Tipo de propiedad</label>
                    <div className={s.selectWrapper}>
                      <select className={s.select} value={form.tipo} onChange={setField('tipo')} required>
                        <option value="" disabled />
                        {TIPOS_PROPIEDAD.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className={s.selectArrow}>⌄</span>
                    </div>
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Renta mensual (MXN)</label>
                    <input className={s.input} type="number" min="0" value={form.renta} onChange={setField('renta')} required />
                  </div>
                  <div className={s.campo}>
                    <label className={s.label}>Ocupabilidad</label>
                    <input className={s.input} type="number" min="1" max="20" value={form.ocupabilidad} onChange={setField('ocupabilidad')} required />
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

        {/* ═══════════ PASO 2: Ubicación y servicios ═══════════ */}
        {paso === 2 && (
          <form onSubmit={siguiente}>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Ubicación y Servicios</h2>
              <div className={s.formSection}>

                <div className={s.campo}>
                  <label className={s.label}>Dirección Completa</label>
                  <input className={s.input} type="text" value={form.direccion} onChange={setField('direccion')} required />
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Código postal</label>
                  <input className={s.input} type="text" maxLength={5} value={form.cp} onChange={setField('cp')} required />
                </div>

                <div className={s.campo}>
                  <label className={s.label}>Servicios Incluidos</label>
                  <div className={s.checkGrid}>
                    {SERVICIOS.map((serv) => (
                      <label key={serv} className={s.checkLabel}>
                        <input
                          type="checkbox"
                          checked={form.servicios.includes(serv)}
                          onChange={() => toggleServicio(serv)}
                        />
                        <span className={s.checkBox} />
                        {serv}
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

        {/* ═══════════ PASO 3: Fotografías ═══════════ */}
        {paso === 3 && (
          <form onSubmit={handleAgregar}>
            <div className={s.formCard}>
              <h2 className={s.formCardTitle}>Fotografías</h2>
              <div className={s.formSection}>

                <p style={{ fontSize:'0.85rem', color:'var(--text-mid)', margin:0, display:'flex', alignItems:'center', gap:6 }}>
                  <Info size={15} /> Agrega hasta 10 fotos de tu propiedad.
                </p>

                {/* Zona de fotos */}
                <div
                  className={`${s.photoZone} ${dragging ? s.photoZoneDragging : ''}`}
                  onClick={() => form.fotos.length < 10 && fotoRef.current?.click()}
                  onDrop={handleDropFotos}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  role="button" tabIndex={0}
                >
                  <input
                    ref={fotoRef} type="file" accept="image/*" multiple
                    style={{ display: 'none' }}
                    onChange={(e) => agregarFotos(e.target.files)}
                  />

                  {form.fotos.length === 0 ? (
                    <>
                      <Upload size={36} className={s.photoZoneIcon} />
                      <p className={s.photoZoneText}>Haz clic para subir las fotos.</p>
                    </>
                  ) : (
                    <div className={s.photoGrid}>
                      {form.fotos.map((url, i) => (
                        <img key={i} src={url} alt={`Foto ${i + 1}`} className={s.photoThumb} />
                      ))}
                      {form.fotos.length < 10 && (
                        <div style={{
                          display:'flex', alignItems:'center', justifyContent:'center',
                          border:'2px dashed var(--purple-light)', borderRadius:10,
                          aspectRatio:1, cursor:'pointer', color:'var(--text-light)'
                        }}>
                          <Upload size={22}/>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className={s.navRow}>
              <button type="button" className={s.btnAnterior} onClick={anterior}>
                <ChevronLeft size={18} /> Anterior
              </button>
              <button type="submit" className={s.btnSiguiente}>
                Agregar <ChevronRight size={18} />
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Modal de éxito */}
      {showExito && (
        <div className={s.overlay} onClick={() => {}}>
          <div className={s.modal} role="dialog" aria-modal="true">
            <div className={`${s.modalIcon} ${s.modalIconVerde}`}>
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <path d="M10 20 L17 28 L30 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
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