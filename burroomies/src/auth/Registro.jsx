// src/auth/Registro.jsx
import { useState } from 'react';
import {
  Mail, Phone, Calendar, Lock, Eye, EyeOff, User,
  MapPin, Home, FileText, CheckSquare, ChevronRight,
  GraduationCap, Briefcase,
} from 'lucide-react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import s from './auth.module.css';
import rs from './Registro.module.css';
import burroPensativo from '../img/burroPensativo1.png';
import { useEffect } from 'react';


const UNIDADES  = ['UPALM', 'Zacatenco', 'Santo Tomás', 'Tepepan', 'Milpa Alta'];
const CARRERAS  = ['ISC', 'IIA', 'LCD', 'IA', 'MCIC'];
const SEMESTRES = ['1°','2°','3°','4°','5°','6°','7°','8°','9°','10°'];

const SOLO_LETRAS       = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const CORREO_VALIDO     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOLO_NUMEROS      = /^\d+$/;
const CONTRASENA_VALIDA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;
const CP_VALIDO         = /^\d{5}$/;

const FORM_INICIAL = {
  nombres:'', apellidoP:'', apellidoM:'',
  correo:'', telefono:'', curp:'', fechaNac:'',
  unidad:'', carrera:'', boleta:'', semestre:'',
  cp:'', estado:'', municipio:'', colonia:'', calle:'', numExt:'', numInt:'',
  contrasena:'', repetirContrasena:'',
  avisoPrivacidad: false, terminosCondiciones: false,
};

// Construye el form inicial usando datosIniciales si existen
const buildForm = (d) => {
  if (!d) return FORM_INICIAL;
  return {
    nombres:             d.nombres             || '',
    apellidoP:           d.apellidoP           || '',
    apellidoM:           d.apellidoM           || '',
    correo:              d.correo              || '',
    telefono:            d.telefono            || '',
    curp:                d.curp                || '',
    fechaNac:            d.fechaNac            || '',
    unidad:              d.unidad              || '',
    carrera:             d.carrera             || '',
    apodo:               d.apodo               || '',
    boleta:              d.boleta              || '',
    semestre:            d.semestre            || '',
    cp:                  d.cp                  || '',
    estado:              d.estado              || '',
    municipio:           d.municipio           || '',
    colonia:             d.colonia             || '',
    calle:               d.calle               || '',
    numExt:              d.numExt              || '',
    numInt:              d.numInt              || '',
    contrasena:          d.contrasena          || '',
    repetirContrasena:   d.repetirContrasena   || '',
    avisoPrivacidad:     d.avisoPrivacidad     || false,
    terminosCondiciones: d.terminosCondiciones || false,
  };
};

export default function Registro({ onPaginaPrincipal, onInicioSesion, onSiguiente, datosIniciales }) {
  const [tipo,    setTipo]    = useState(datosIniciales?.tipo || 'estudiante');
  const [tipoFijado, setTipoFijado] = useState(!!datosIniciales?.tipo);
  const [form,    setForm]    = useState(() => buildForm(datosIniciales));
  const [errores, setErrores] = useState({});
  const [showP1,  setShowP1]  = useState(false);
  const [showP2,  setShowP2]  = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tipoUrl = params.get('tipo');
    if (tipoUrl === 'arrendador' || tipoUrl === 'estudiante') {
      handleTipo(tipoUrl);
      setTipoFijado(true);
    }
  }, []);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
    setErrores(prev => ({ ...prev, [field]: '' }));
  };

  const handleTipo = (t) => {
    setTipo(t);
    setForm(FORM_INICIAL);
    setErrores({});
  };

  const validar = () => {
    const e = {};
    if (!form.nombres.trim())                    e.nombres    = 'El nombre es obligatorio.';
    else if (!SOLO_LETRAS.test(form.nombres))    e.nombres    = 'Solo se permiten letras.';
    if (!form.apellidoP.trim())                  e.apellidoP  = 'El apellido paterno es obligatorio.';
    else if (!SOLO_LETRAS.test(form.apellidoP))  e.apellidoP  = 'Solo se permiten letras.';
    if (form.apellidoM && !SOLO_LETRAS.test(form.apellidoM)) e.apellidoM = 'Solo se permiten letras.';
    if (!form.correo.trim())                     e.correo     = 'El correo es obligatorio.';
    else if (!CORREO_VALIDO.test(form.correo))   e.correo     = 'Ingresa un correo válido.';
    if (form.telefono && !SOLO_NUMEROS.test(form.telefono)) e.telefono = 'Solo se permiten números.';
    if (!form.contrasena)                        e.contrasena = 'La contraseña es obligatoria.';
    else if (!CONTRASENA_VALIDA.test(form.contrasena))
      e.contrasena = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial.';
    if (!form.repetirContrasena)                 e.repetirContrasena = 'Repite tu contraseña.';
    else if (form.contrasena !== form.repetirContrasena)
      e.repetirContrasena = 'Las contraseñas no coinciden.';

    if (tipo === 'estudiante') {
      if (!form.apodo.trim())                    e.apodo    = 'El apodo es obligatorio.';
      else if (form.apodo.trim().length < 3)     e.apodo    = 'Mínimo 3 caracteres.';
      else if (!/^[a-zA-Z0-9_]+$/.test(form.apodo)) e.apodo = 'Solo letras, números y guión bajo.';
      if (!form.unidad)                          e.unidad   = 'Selecciona una unidad académica.';
      if (!form.carrera)                         e.carrera  = 'Selecciona una carrera.';
      if (!form.semestre)                        e.semestre = 'Selecciona un semestre.';
      if (!form.boleta.trim())                   e.boleta   = 'La boleta es obligatoria.';
      else if (!SOLO_NUMEROS.test(form.boleta))  e.boleta   = 'La boleta solo acepta números.';
    }

    if (tipo === 'arrendador') {
      if (!form.cp.trim())                       e.cp        = 'El código postal es obligatorio.';
      else if (!CP_VALIDO.test(form.cp))         e.cp        = 'El código postal debe tener 5 dígitos.';
      if (!form.estado.trim())                   e.estado    = 'El estado es obligatorio.';
      if (!form.municipio.trim())                e.municipio = 'El municipio es obligatorio.';
      if (!form.colonia.trim())                  e.colonia   = 'La colonia es obligatoria.';
      if (!form.calle.trim())                    e.calle     = 'La calle es obligatoria.';
    }

    if (!form.avisoPrivacidad)     e.avisoPrivacidad     = 'Debes aceptar el aviso de privacidad.';
    if (!form.terminosCondiciones) e.terminosCondiciones = 'Debes aceptar los términos y condiciones.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  // Solo valida y pasa datos al padre — NO llama al backend
  const handleSiguiente = (e) => {
    e.preventDefault();
    if (!validar()) return;
    onSiguiente?.({ tipo, ...form });
  };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Inicio de sesión', onClick: onInicioSesion, variant: 'primary' },
    ]} />
  );

  return (
  <AuthLayout navbar={navbar} center={false}>
    <div className={rs.pageWrapper}>

      {/* Burrito lateral */}
      <div className={rs.burroCol}>
        <button
          type="button"
          onClick={onPaginaPrincipal}
          className={rs.btnRegresar}
        >
          ← Regresar
        </button>

        <div className={rs.burroCirculo}>
          <div className={rs.burroFondo} />
          <img src={burroPensativo} alt="Burroomies" className={rs.burroImg} />
        </div>
        <div className={rs.burroTexto}>
          <p className={rs.burroTitulo}>
            {tipo === 'arrendador' ? '¡Bienvenido, arrendador!' : '¡Casi listo!'}
          </p>
          <p className={rs.burroSub}>
            {tipo === 'arrendador'
              ? 'Publica tus propiedades y conecta con estudiantes verificados del IPN 🏠'
              : 'Completa tu registro para encontrar tu hogar🎓'}
          </p>
        </div>
      </div>

      <form className={rs.formPage} onSubmit={handleSiguiente} noValidate>
        {/* Encabezado dinámico según tipo */}
        <div className={rs.perfilHeader} style={{
          background: tipo === 'arrendador'
            ? 'linear-gradient(135deg, #f5eef2, #ede0f8)'
            : 'linear-gradient(135deg, #eef2ff, #e0e8f8)',
          borderColor: tipo === 'arrendador' ? '#ddc8e8' : '#c7d2fe',
        }}>
          <div className={rs.perfilHeaderIcon} style={{
            background: tipo === 'arrendador'
              ? 'linear-gradient(135deg, #7B2D6E, #6B3FA0)'
              : 'linear-gradient(135deg, #4f46e5, #6B3FA0)',
          }}>
            {tipo === 'arrendador' ? <Briefcase size={26} color="white" /> : <GraduationCap size={26} color="white" />}
          </div>
          <div>
            <p className={rs.perfilHeaderTag} style={{
              color: tipo === 'arrendador' ? '#7B2D6E' : '#4f46e5',
            }}>
              {tipo === 'arrendador' ? 'ARRENDADOR' : 'ARRENDATARIO (ESTUDIANTE)'}
            </p>
            <h1 className={rs.perfilHeaderTitulo}>
              {tipo === 'arrendador'
                ? 'Publica y gestiona tus propiedades'
                : 'Encuentra tu hogar estudiantil'}
            </h1>
            <p className={rs.perfilHeaderDesc}>
              {tipo === 'arrendador'
                ? 'Registra tu cuenta para publicar inmuebles.'
                : 'Registra tu cuenta para buscar viviendas cercanas a tu unidad académica.'}
            </p>
          </div>
        </div>

        {/* Selector de tipo — solo cuando NO viene de página principal */}
        {!tipoFijado && (
          <>
            <div className={rs.tipoRow}>
              <span className={rs.tipoLabel}><Briefcase size={16} /> ¿Cómo quieres registrarte?</span>
              <div className={rs.tipoOpciones}>
                {['estudiante','arrendador'].map(t => (
                  <label key={t} className={`${rs.radioLabel} ${tipo === t ? rs.radioLabelActive : ''}`}>
                    <input type="radio" name="tipo" value={t}
                      checked={tipo === t} onChange={() => handleTipo(t)} className={s.radioInput} />
                    <span className={s.radioCustom} />
                    {t === 'estudiante' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                    {t === 'estudiante' ? 'Arrendatario (Estudiante)' : 'Arrendador'}
                  </label>
                ))}
              </div>
            </div>
            <hr className={rs.divider} />
          </>
        )}

        {/* Beneficios por tipo */}
        <div className={rs.beneficiosBox}>
          {tipo === 'arrendador' ? (
            <>
              <p className={rs.beneficiosTitulo}>Con tu cuenta podrás:</p>
              <ul className={rs.beneficiosList}>
                <li className={rs.beneficioItem}><span>🏠</span> Publicar múltiples propiedades con fotos y descripción</li>
                <li className={rs.beneficioItem}><span>✅</span> Verificar tu identidad con CURP oficial</li>
                <li className={rs.beneficioItem}><span>⭐</span> Construir tu reputación con reseñas de estudiantes</li>
              </ul>
            </>
          ) : (
            <>
              <p className={rs.beneficiosTitulo}>Con tu cuenta podrás:</p>
              <ul className={rs.beneficiosList}>
                <li className={rs.beneficioItem}><span>🔍</span> Buscar viviendas cercanas a tu unidad académica</li>
                <li className={rs.beneficioItem}><span>💰</span> Filtrar por precio, servicios y tipo de propiedad</li>
                <li className={rs.beneficioItem}><span>🎓</span> Validar tu estatus con tu constancia de estudios IPN</li>
                <li className={rs.beneficioItem}><span>💬</span> Leer reseñas de otros estudiantes sobre cada propiedad</li>
                <li className={rs.beneficioItem}><span>📄</span> Acceder a plantilla de contrato de arrendamiento</li>
              </ul>
            </>
          )}
        </div>

        <hr className={rs.divider} />

        {/* Datos personales */}
        <section className={rs.seccion}>
          <div className={rs.seccionHeader}>
            <span className={rs.seccionHeaderIcon}>👤</span>
            <div>
              <p className={rs.seccionHeaderTitulo}>Datos personales</p>
              <p className={rs.seccionHeaderDesc}>Información del titular de la cuenta</p>
            </div>
          </div>

          
          {tipo === 'estudiante' && (
            <div className={rs.campoApodo}>
              <Campo label="Apodo / Username" error={errores.apodo}>
                <div className={s.inputIconWrapper}>
                  <span className={s.inputIcon} style={{ fontSize:'1rem' }}>@</span>
                  <input
                    className={`${s.inputWithIcon} ${errores.apodo ? s.inputError : ''}`}
                    type="text"
                    placeholder="ej. burro_ipn, estudiante01"
                    value={form.apodo}
                    onChange={set('apodo')}
                    maxLength={30}
                  />
                </div>
                <span style={{ fontSize:'0.75rem', color:'#9b6b8e', fontWeight:600 }}>
                  Solo letras, números y guión bajo. Será visible para otros usuarios.
                </span>
              </Campo>
            </div>
          )}

          <div className={rs.grid3}>
            <Campo label="Nombre(s)" error={errores.nombres}>
              <input className={`${s.input} ${errores.nombres ? s.inputError : ''}`}
                type="text" value={form.nombres} onChange={set('nombres')} />
            </Campo>
            <Campo label="Apellido paterno" error={errores.apellidoP}>
              <input className={`${s.input} ${errores.apellidoP ? s.inputError : ''}`}
                type="text" value={form.apellidoP} onChange={set('apellidoP')} />
            </Campo>
            <Campo label="Apellido materno" error={errores.apellidoM}>
              <input className={`${s.input} ${errores.apellidoM ? s.inputError : ''}`}
                type="text" value={form.apellidoM} onChange={set('apellidoM')} />
            </Campo>
          </div>
          <div className={rs.grid2}>
            <Campo label="Correo" error={errores.correo}>
              <div className={s.inputIconWrapper}>
                <Mail className={s.inputIcon} size={18} />
                <input className={`${s.inputWithIcon} ${errores.correo ? s.inputError : ''}`}
                  type="email" value={form.correo} onChange={set('correo')} />
              </div>
            </Campo>
            <Campo label="Teléfono" error={errores.telefono}>
              <div className={s.inputIconWrapper}>
                <Phone className={s.inputIcon} size={18} />
                <input className={`${s.inputWithIcon} ${errores.telefono ? s.inputError : ''}`}
                  type="tel" value={form.telefono} onChange={set('telefono')} maxLength={10} />
              </div>
            </Campo>
          </div>
          <div className={rs.grid2}>
            <Campo label="CURP">
              <input className={s.input} type="text" value={form.curp}
                onChange={set('curp')} maxLength={18} style={{ textTransform:'uppercase' }} />
            </Campo>
            <Campo label="Fecha de nacimiento">
              <div className={s.inputIconWrapper}>
                <Calendar className={s.inputIcon} size={18} />
                <input className={s.inputWithIcon} type="date" value={form.fechaNac} onChange={set('fechaNac')} />
              </div>
            </Campo>
          </div>
        </section>

        <hr className={rs.divider} />

        {tipo === 'estudiante'
          ? <SeccionEstudiante form={form} set={set} s={s} rs={rs} errores={errores} />
          : <SeccionArrendador form={form} set={set} s={s} rs={rs} errores={errores} />
        }

        <hr className={rs.divider} />

        {/* Contraseñas */}
        <section className={rs.seccion}>
          <div className={rs.passRow}>
            <div className={rs.grid2}>
              <Campo label="Contraseña" error={errores.contrasena}>
                <div className={s.inputWrapper}>
                  <input className={`${s.input} ${errores.contrasena ? s.inputError : ''}`}
                    type={showP1 ? 'text' : 'password'}
                    value={form.contrasena} onChange={set('contrasena')} />
                  <button type="button" className={s.togglePass} onClick={() => setShowP1(v => !v)}>
                    {showP1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Campo>
              <Campo label="Repetir contraseña" error={errores.repetirContrasena}>
                <div className={s.inputWrapper}>
                  <input className={`${s.input} ${errores.repetirContrasena ? s.inputError : ''}`}
                    type={showP2 ? 'text' : 'password'}
                    value={form.repetirContrasena} onChange={set('repetirContrasena')} />
                  <button type="button" className={s.togglePass} onClick={() => setShowP2(v => !v)}>
                    {showP2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Campo>
            </div>
            <p className={rs.passHint}>
              <Lock size={14} /> *Mínimo 8 caracteres, mayúscula, minúscula y carácter especial.
            </p>
          </div>

          <div className={rs.checkGroup}>
            <label className={rs.checkLabel}>
              <input type="checkbox" checked={form.avisoPrivacidad} onChange={set('avisoPrivacidad')} className={s.checkInput} />
              <span className={s.checkCustom} />
              <FileText size={16} /> Aviso de Privacidad
            </label>
            {errores.avisoPrivacidad && <Err msg={errores.avisoPrivacidad} />}
            <label className={rs.checkLabel}>
              <input type="checkbox" checked={form.terminosCondiciones} onChange={set('terminosCondiciones')} className={s.checkInput} />
              <span className={s.checkCustom} />
              <CheckSquare size={16} /> Términos y Condiciones de Uso
            </label>
            {errores.terminosCondiciones && <Err msg={errores.terminosCondiciones} />}
          </div>

          <div className={rs.siguienteRow}>
            <button type="submit" className={s.btnSiguiente}>
              Siguiente <ChevronRight size={18} />
            </button>
          </div>
        </section>

      </form>
    </div>  
    </AuthLayout>
  );
}

/* ── Secciones específicas ── */
function SeccionEstudiante({ form, set, s, rs, errores }) {
  return (
    <section className={rs.seccion}>
      <div className={rs.seccionHeader}>
        <span className={rs.seccionHeaderIcon}>🎓</span>
        <div>
          <p className={rs.seccionHeaderTitulo}>Datos académicos</p>
          <p className={rs.seccionHeaderDesc}>Información de tu inscripción en el IPN — necesaria para verificar tu estatus como estudiante.</p>
        </div>
      </div>
      <div className={rs.grid3}>
        <Campo label="Unidad académica" error={errores.unidad}>
          <SelectInput value={form.unidad} onChange={set('unidad')} s={s}>
            <option value="" disabled>Selecciona</option>
            {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="Carrera" error={errores.carrera}>
          <SelectInput value={form.carrera} onChange={set('carrera')} s={s}>
            <option value="" disabled>Selecciona</option>
            {CARRERAS.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="No. Boleta" error={errores.boleta}>
          <input className={`${s.input} ${errores.boleta ? s.inputError : ''}`}
            type="text" value={form.boleta} onChange={set('boleta')} maxLength={10} />
        </Campo>
      </div>
      <div style={{ maxWidth:200 }}>
        <Campo label="No. Semestre" error={errores.semestre}>
          <SelectInput value={form.semestre} onChange={set('semestre')} s={s}>
            <option value="" disabled>Selecciona</option>
            {SEMESTRES.map(sem => <option key={sem} value={sem}>{sem}</option>)}
          </SelectInput>
        </Campo>
      </div>
    </section>
  );
}

function SeccionArrendador({ form, set, s, rs, errores }) {
  return (
    <section className={rs.seccion}>
      <div className={rs.seccionHeader}>
        <span className={rs.seccionHeaderIcon}>🏠</span>
        <div>
          <p className={rs.seccionHeaderTitulo}>Domicilio personal del arrendador</p>
          <p className={rs.seccionHeaderDesc}>
            Tu dirección personal como propietario — <strong>no</strong> la dirección de la propiedad que vas a publicar.
            Podrás agregar tus propiedades después de completar el registro.
          </p>
        </div>
      </div>
      <div className={rs.grid3}>
        <Campo label="Código postal" error={errores.cp}>
          <div className={s.inputIconWrapper}>
            <MapPin className={s.inputIcon} size={18} />
            <input className={`${s.inputWithIcon} ${errores.cp ? s.inputError : ''}`}
              type="text" value={form.cp} onChange={set('cp')} maxLength={5} />
          </div>
        </Campo>
        <Campo label="Estado" error={errores.estado}>
          <input className={`${s.input} ${errores.estado ? s.inputError : ''}`}
            type="text" value={form.estado} onChange={set('estado')} />
        </Campo>
        <Campo label="Municipio / Delegación" error={errores.municipio}>
          <input className={`${s.input} ${errores.municipio ? s.inputError : ''}`}
            type="text" value={form.municipio} onChange={set('municipio')} />
        </Campo>
      </div>
      <div className={rs.grid3}>
        <Campo label="Colonia / Localidad" error={errores.colonia}>
          <input className={`${s.input} ${errores.colonia ? s.inputError : ''}`}
            type="text" value={form.colonia} onChange={set('colonia')} />
        </Campo>
        <Campo label="Calle" error={errores.calle}>
          <div className={s.inputIconWrapper}>
            <Home className={s.inputIcon} size={18} />
            <input className={`${s.inputWithIcon} ${errores.calle ? s.inputError : ''}`}
              type="text" value={form.calle} onChange={set('calle')} />
          </div>
        </Campo>
        <div className={rs.grid2mini}>
          <Campo label="No. Exterior">
            <input className={s.input} type="text" value={form.numExt} onChange={set('numExt')} />
          </Campo>
          <Campo label="No. Interior">
            <input className={s.input} type="text" value={form.numInt} onChange={set('numInt')} />
          </Campo>
        </div>
      </div>
    </section>
  );
}

/* ── Auxiliares ── */
function Err({ msg }) {
  return <span style={{ color:'#e53e3e', fontSize:'0.75rem', marginTop:2 }}>{msg}</span>;
}

function Campo({ label, children, error }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#2d2550' }}>{label}</label>
      {children}
      {error && <Err msg={error} />}
    </div>
  );
}

function SelectInput({ children, s, ...props }) {
  return (
    <div className={s.selectWrapper}>
      <select className={s.select} {...props}>{children}</select>
      <span className={s.selectArrow}>⌄</span>
    </div>
  );
}