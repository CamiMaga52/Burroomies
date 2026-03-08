// src/auth/Registro.jsx
// Formulario unificado. Cambia sección según tipo: estudiante | arrendador.
import { useState } from 'react';
import {
  Mail, Phone, Calendar, Lock, Eye, EyeOff, User,
  MapPin, Home, FileText, CheckSquare, ChevronRight,
  GraduationCap, Briefcase,
} from 'lucide-react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import s from './auth.module.css';
import rs from './Registro.module.css'; // estilos exclusivos del form grande

/* ── Datos de opciones ─────────────────────────────────── */
const UNIDADES  = ['UPALM', 'Zacatenco', 'Santo Tomás', 'Tepepan', 'Milpa Alta'];
const CARRERAS  = ['ISC', 'IIA', 'LCD', 'IA', 'MCIC'];
const SEMESTRES = ['1°','2°','3°','4°','5°','6°','7°','8°','9°','10°'];

const FORM_INICIAL = {
  nombres:'', apellidoP:'', apellidoM:'',
  correo:'', telefono:'', curp:'', fechaNac:'',
  unidad:'', carrera:'', boleta:'', semestre:'',
  cp:'', estado:'', municipio:'', colonia:'', calle:'', numExt:'', numInt:'',
  contrasena:'', repetirContrasena:'',
  avisoPrivacidad: false, terminosCondiciones: false,
};

export default function Registro({ onPaginaPrincipal, onInicioSesion, onSiguiente }) {
  const [tipo,     setTipo]     = useState('estudiante');
  const [form,     setForm]     = useState(FORM_INICIAL);
  const [showP1,   setShowP1]   = useState(false);
  const [showP2,   setShowP2]   = useState(false);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
  };
  const handleTipo = (t) => { setTipo(t); setForm(FORM_INICIAL); };
  const handleSiguiente = (e) => { e.preventDefault(); onSiguiente?.({ tipo, ...form }); };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar} center={false}>
      <form className={rs.formPage} onSubmit={handleSiguiente}>

        {/* Título */}
        <div className={rs.tituloRow}>
          <User className={rs.tituloIcon} size={28} />
          <h1 className={rs.tituloH1}>Registro de usuario</h1>
        </div>

        {/* Tipo */}
        <div className={rs.tipoRow}>
          <span className={rs.tipoLabel}><Briefcase size={16} /> Tipo de usuario</span>
          <div className={rs.tipoOpciones}>
            {['estudiante', 'arrendador'].map((t) => (
              <label key={t} className={rs.radioLabel}>
                <input type="radio" name="tipo" value={t}
                  checked={tipo === t} onChange={() => handleTipo(t)}
                  className={s.radioInput} />
                <span className={s.radioCustom} />
                {t === 'estudiante' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <hr className={rs.divider} />

        {/* ── Datos personales (ambos tipos) ── */}
        <section className={rs.seccion}>
          <div className={rs.grid3}>
            <Campo label="Nombre(s)">
              <input className={s.input} type="text" value={form.nombres} onChange={set('nombres')} required />
            </Campo>
            <Campo label="Apellido paterno">
              <input className={s.input} type="text" value={form.apellidoP} onChange={set('apellidoP')} required />
            </Campo>
            <Campo label="Apellido materno">
              <input className={s.input} type="text" value={form.apellidoM} onChange={set('apellidoM')} />
            </Campo>
          </div>
          <div className={rs.grid2}>
            <Campo label="Correo">
              <div className={s.inputIconWrapper}>
                <Mail className={s.inputIcon} size={18} />
                <input className={s.inputWithIcon} type="email" value={form.correo} onChange={set('correo')} required />
              </div>
            </Campo>
            <Campo label="Teléfono">
              <div className={s.inputIconWrapper}>
                <Phone className={s.inputIcon} size={18} />
                <input className={s.inputWithIcon} type="tel" value={form.telefono} onChange={set('telefono')} />
              </div>
            </Campo>
          </div>
          <div className={rs.grid2}>
            <Campo label="CURP">
              <input className={s.input} type="text" value={form.curp} onChange={set('curp')} maxLength={18} style={{ textTransform:'uppercase' }} />
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

        {/* ── Sección específica del tipo ── */}
        {tipo === 'estudiante'
          ? <SeccionEstudiante form={form} set={set} s={s} rs={rs} />
          : <SeccionArrendador form={form} set={set} s={s} rs={rs} />
        }

        <hr className={rs.divider} />

        {/* ── Contraseñas + checks ── */}
        <section className={rs.seccion}>
          <div className={rs.passRow}>
            <div className={rs.grid2}>
              <Campo label="Contraseña">
                <div className={s.inputWrapper}>
                  <input className={s.input} type={showP1 ? 'text' : 'password'}
                    value={form.contrasena} onChange={set('contrasena')} required />
                  <button type="button" className={s.togglePass} onClick={() => setShowP1((v) => !v)}>
                    {showP1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Campo>
              <Campo label="Repetir contraseña">
                <div className={s.inputWrapper}>
                  <input className={s.input} type={showP2 ? 'text' : 'password'}
                    value={form.repetirContrasena} onChange={set('repetirContrasena')} required />
                  <button type="button" className={s.togglePass} onClick={() => setShowP2((v) => !v)}>
                    {showP2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Campo>
            </div>
            <p className={rs.passHint}>
              <Lock size={14} /> *Mínimo 8 caracteres, incluir letra, número y carácter especial.
            </p>
          </div>

          <div className={rs.checkGroup}>
            <label className={rs.checkLabel}>
              <input type="checkbox" checked={form.avisoPrivacidad} onChange={set('avisoPrivacidad')}
                className={s.checkInput} required />
              <span className={s.checkCustom} />
              <FileText size={16} /> Aviso de Privacidad
            </label>
            <label className={rs.checkLabel}>
              <input type="checkbox" checked={form.terminosCondiciones} onChange={set('terminosCondiciones')}
                className={s.checkInput} required />
              <span className={s.checkCustom} />
              <CheckSquare size={16} /> Términos y Condiciones de Uso
            </label>
          </div>

          <div className={rs.siguienteRow}>
            <button type="submit" className={s.btnSiguiente}>
              Siguiente <ChevronRight size={18} />
            </button>
          </div>
        </section>

      </form>
    </AuthLayout>
  );
}

/* ── Secciones específicas ── */
function SeccionEstudiante({ form, set, s, rs }) {
  return (
    <section className={rs.seccion}>
      <div className={rs.grid3}>
        <Campo label="Unidad académica">
          <SelectInput value={form.unidad} onChange={set('unidad')} s={s} required>
            <option value="" disabled />
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="Carrera">
          <SelectInput value={form.carrera} onChange={set('carrera')} s={s} required>
            <option value="" disabled />
            {CARRERAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="No. Boleta">
          <input className={s.input} type="text" value={form.boleta} onChange={set('boleta')} required />
        </Campo>
      </div>
      <div style={{ maxWidth: 200 }}>
        <Campo label="No. Semestre">
          <SelectInput value={form.semestre} onChange={set('semestre')} s={s} required>
            <option value="" disabled />
            {SEMESTRES.map((sem) => <option key={sem} value={sem}>{sem}</option>)}
          </SelectInput>
        </Campo>
      </div>
    </section>
  );
}

function SeccionArrendador({ form, set, s, rs }) {
  return (
    <section className={rs.seccion}>
      <div className={rs.grid3}>
        <Campo label="Código postal">
          <div className={s.inputIconWrapper}>
            <MapPin className={s.inputIcon} size={18} />
            <input className={s.inputWithIcon} type="text" value={form.cp} onChange={set('cp')} maxLength={5} />
          </div>
        </Campo>
        <Campo label="Estado">
          <input className={s.input} type="text" value={form.estado} onChange={set('estado')} />
        </Campo>
        <Campo label="Municipio / Delegación">
          <input className={s.input} type="text" value={form.municipio} onChange={set('municipio')} />
        </Campo>
      </div>
      <div className={rs.grid3}>
        <Campo label="Colonia / Localidad">
          <input className={s.input} type="text" value={form.colonia} onChange={set('colonia')} />
        </Campo>
        <Campo label="Calle">
          <div className={s.inputIconWrapper}>
            <Home className={s.inputIcon} size={18} />
            <input className={s.inputWithIcon} type="text" value={form.calle} onChange={set('calle')} />
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
function Campo({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:'0.82rem', fontWeight:700, color:'#2d2550' }}>{label}</label>
      {children}
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