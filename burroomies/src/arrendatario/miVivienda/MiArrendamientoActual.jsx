// src/arrendatario/miVivienda/MiArrendamientoActual.jsx
import { useState, useEffect } from 'react';
import styles from './MiArrendamientoActual.module.css';

import Navbar   from '../../shared/components/Navbar';
import Footer   from '../../shared/components/Footer';
import Modal    from '../../shared/components/Modal';
import useModal from '../../shared/hooks/useModal';

import {
  IconHome, IconPhone, IconMail, IconPlus, IconWarning,
} from '../../shared/icons';

import burroDudoso from '../../img/burroDudoso.png';
import burroTriste from '../../img/burroTriste1.png';

export default function MiArrendamientoActual({
  onFinalizar,
  onBuscar,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
}) {
  const [arrendamiento, setArrendamiento] = useState(null);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState(null);

  const finalizarModal = useModal();
  const verMasModal    = useModal();

  /* ── Cargar arrendamiento del backend ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 404) { setArrendamiento(null); return; }
        if (!res.ok) throw new Error();
        const data = await res.json();
        setArrendamiento(data);
      } catch {
        setError('No se pudo cargar tu arrendamiento.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const [esperandoArrendador, setEsperandoArrendador] = useState(false);

  /* ── Finalizar ── */
  const handleConfirmarFinalizar = async () => {
    finalizarModal.close();
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch(
        `http://localhost:3001/api/arrendamientos/${arrendamiento.idArrendamiento}/terminar`,
        { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        const idPropiedad = propiedad?.idPropiedad || arrendamiento?.propiedad_idPropiedad;
        // Guardar reseña pendiente en localStorage por si el usuario cierra sesión
        localStorage.setItem('burroomies_resena_pendiente', JSON.stringify({ idPropiedad }));
        // Si ambos confirmaron → ir a DejaReseña
        if (data.message?.includes('terminado correctamente')) {
          localStorage.removeItem('burroomies_resena_pendiente');
          onFinalizar?.(idPropiedad);
        } else {
          // Solo el arrendatario confirmó → esperar al arrendador
          setEsperandoArrendador(true);
        }
      }
    } catch {
      setEsperandoArrendador(true);
    }
  };

  /* ── Datos mapeados ── */
  const propiedad      = arrendamiento?.Propiedad;
  const arrendador     = propiedad?.Arrendador?.Usuario;
  const nombreArr      = arrendador ? `${arrendador.usuarioNom} ${arrendador.usuarioApePat}` : '—';
  const telArr         = arrendador?.usuarioTel || '—';
  const correoArr      = arrendador?.usuarioCorreo || '—';
  const primeraFoto    = (() => {
    try { const f = JSON.parse(propiedad?.propiedadFotos || '[]'); return f[0] || null; }
    catch { return null; }
  })();

  return (
    <div className={styles.page}>
      <Navbar
        showBuscar={!!onBuscar}
        onBuscar={onBuscar}
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
      />

      <main className={styles.container}>
        <header className={styles.viviendaHeader}>
          <div className={styles.viviendaHeaderIcon}><IconHome /></div>
          <h1 className={styles.viviendaHeaderTitle}>Mi arrendamiento actual</h1>
        </header>

        {cargando && (
          <div style={{ textAlign:'center', padding:'60px 0', color:'#6d3fc0', fontWeight:600 }}>
            Cargando tu arrendamiento...
          </div>
        )}

        {!cargando && error && (
          <div style={{ textAlign:'center', padding:'40px 0', color:'#e53e3e', fontWeight:600 }}>
            {error}
          </div>
        )}

        {!cargando && !error && !arrendamiento && (
          <div className={styles.sinArrendamiento}>
            <img src={burroTriste} alt="Sin arrendamiento" className={styles.burroTriste} />
            <p className={styles.sinArrTitulo}>No tienes un arrendamiento activo</p>
            <p className={styles.sinArrSub}>
              Cuando un arrendador te asigne una propiedad, aparecerá aquí.
            </p>
            {onBuscar && (
              <button type="button" className={styles.btnBuscar} onClick={onBuscar}>
                Buscar vivienda
              </button>
            )}
          </div>
        )}

        {!cargando && !error && arrendamiento && esperandoArrendador && (
          <div className={styles.sinArrendamiento}>
            <div style={{ fontSize: '3rem' }}>⏳</div>
            <p className={styles.sinArrTitulo}>Confirmación registrada</p>
            <p className={styles.sinArrSub}>
              Tu solicitud de finalización fue enviada.<br/>
              Cuando el arrendador confirme, podrás dejar tu reseña.
            </p>
          </div>
        )}

        {!cargando && !error && arrendamiento && !esperandoArrendador && (
          <>
            <section className={styles.mainCard}>
              <div className={styles.propiedadImgBanner}
                style={primeraFoto ? { padding:0, overflow:'hidden' } : {}}>
                {primeraFoto
                  ? <img src={primeraFoto} alt={propiedad?.propiedadTitulo}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span className={styles.propiedadImgEmoji}>🏠</span>
                }
                <div className={styles.propiedadImgOverlay} />
                <span className={styles.propiedadBadge}>Arrendamiento activo</span>
              </div>

              <div className={styles.propiedadBody}>
                <h2 className={styles.propiedadTitulo}>{propiedad?.propiedadTitulo || 'Propiedad'}</h2>
                <p className={styles.propiedadDesc}>
                  {propiedad?.propiedadDescripcion || 'Sin descripción disponible.'}
                </p>
                <button type="button" className={styles.btnVerMas} onClick={verMasModal.open}>
                  <IconPlus aria-hidden="true" /> Ver más
                </button>
              </div>

              <hr className={styles.divider} />

              <div className={styles.arrendadorRow}>
                <div className={styles.arrendadorLeft}>
                  <span className={styles.arrendadorLabel}>Arrendador</span>
                  <div className={styles.arrendadorAvatar}>
                    {arrendador?.usuarioFoto
                      ? <img src={arrendador.usuarioFoto} alt={nombreArr}
                          style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                      : nombreArr.charAt(0)
                    }
                  </div>
                  <span className={styles.arrendadorNombre}>{nombreArr}</span>
                  <span className={styles.arrendadorExp}>
                    Renta: ${parseInt(arrendamiento.arrendamientoRenta || 0).toLocaleString()} MXN/mes
                  </span>
                </div>
                <div className={styles.arrendadorRight}>
                  <span className={styles.contactoLabel}>Información de contacto:</span>
                  <a href={`tel:${telArr}`} className={styles.contactoItem}>
                    <IconPhone aria-hidden="true" /><span>{telArr}</span>
                  </a>
                  <a href={`mailto:${correoArr}`} className={styles.contactoItem}>
                    <IconMail aria-hidden="true" /><span>{correoArr}</span>
                  </a>
                </div>
              </div>
            </section>

            <div className={styles.finalizarWrapper}>
              <button type="button" className={styles.btnFinalizar} onClick={finalizarModal.open}>
                <IconWarning aria-hidden="true" /> Finalizar arrendamiento
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={finalizarModal.isOpen}
        onClose={finalizarModal.close}
        title="¿Finalizar arrendamiento?"
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmarFinalizar}
        onCancel={finalizarModal.close}
        confirmVariant="danger"
      >
        <img src={burroDudoso} alt="Burro dudoso" className={styles.modalBurro} />
        <p className={styles.modalDesc}>
          Al finalizar tu arrendamiento se te pedirá dejar una reseña.
          ¿Estás seguro de que deseas continuar?
        </p>
      </Modal>

      <Modal
        isOpen={verMasModal.isOpen}
        onClose={verMasModal.close}
        title={propiedad?.propiedadTitulo || 'Propiedad'}
        icon={<IconHome />}
        hideActions
      >
        <div className={styles.modalDescripcion}>
          <p>{propiedad?.propiedadDescripcion || 'Sin descripción disponible.'}</p>
        </div>
      </Modal>
    </div>
  );
}