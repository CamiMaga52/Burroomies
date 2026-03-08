// src/auth/Registro.jsx
import { useState } from 'react';
import {
  Mail, Phone, Calendar, Lock, Eye, EyeOff, User, MapPin,
  Home, FileText, CheckSquare, ChevronRight, GraduationCap,
  Briefcase, Key
} from 'lucide-react';
import styles from './Registro.module.css';
import Footer from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

const UNIDADES = ['UPALM', 'Zacatenco', 'Santo Tomás', 'Tepepan', 'Milpa Alta'];
const CARRERAS = ['ISC', 'IIA', 'LCD', 'IA', 'MCIC'];
const SEMESTRES = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°'];

const FORM_INICIAL = {
  nombres: '', apellidoP: '', apellidoM: '',
  correo: '', telefono: '', curp: '', fechaNac: '',
  unidad: '', carrera: '', boleta: '', semestre: '',
  cp: '', estado: '', municipio: '',
  colonia: '', calle: '', numExt: '', numInt: '',
  contrasena: '', repetirContrasena: '',
  avisoPrivacidad: false, terminosCondiciones: false,
};

export default function Registro({ onPaginaPrincipal, onInicioSesion, onSiguiente }) {
  const [tipo, setTipo] = useState('estudiante');
  const [form, setForm] = useState(FORM_INICIAL);
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleTipo = (t) => {
    setTipo(t);
    setForm(FORM_INICIAL);
  };

  const handleSiguiente = (e) => {
    e.preventDefault();
    onSiguiente?.({ tipo, ...form });
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <img src={burroLogo} alt="Burroomies" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>
        <div className={styles.navbarRight}>
          <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onPaginaPrincipal}>
            Página principal
          </button>
          <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onInicioSesion}>
            Inicio de sesión
          </button>
        </div>
      </header>

      <main className={styles.container}>
        <form className={styles.formPage} onSubmit={handleSiguiente}>
          <div className={styles.tituloRow}>
            <User className={styles.tituloIcon} size={28} />
            <h1 className={styles.titulo}>Registro de usuario</h1>
          </div>

          {/* Tipo de usuario */}
          <div className={styles.tipoRow}>
            <span className={styles.tipoLabel}>
              <Briefcase size={16} /> Tipo de usuario
            </span>
            <div className={styles.tipoOpciones}>
              {['estudiante', 'arrendador'].map(t => (
                <label key={t} className={styles.radioLabel}>
                  <input
                    type="radio" name="tipo" value={t}
                    checked={tipo === t}
                    onChange={() => handleTipo(t)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioCustom} />
                  {t === 'estudiante' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Datos personales (ambos) */}
          <div className={styles.seccion}>
            <div className={styles.grid3}>
              <Campo label="Nombre(s)">
                <input className={styles.input} type="text" value={form.nombres} onChange={set('nombres')} required />
              </Campo>
              <Campo label="Apellido paterno">
                <input className={styles.input} type="text" value={form.apellidoP} onChange={set('apellidoP')} required />
              </Campo>
              <Campo label="Apellido materno">
                <input className={styles.input} type="text" value={form.apellidoM} onChange={set('apellidoM')} />
              </Campo>
            </div>

            <div className={styles.grid2}>
              <Campo label="Correo">
                <div className={styles.inputIconWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input className={styles.inputWithIcon} type="email" value={form.correo} onChange={set('correo')} required />
                </div>
              </Campo>
              <Campo label="Teléfono">
                <div className={styles.inputIconWrapper}>
                  <Phone className={styles.inputIcon} size={18} />
                  <input className={styles.inputWithIcon} type="tel" value={form.telefono} onChange={set('telefono')} />
                </div>
              </Campo>
            </div>

            <div className={styles.grid2}>
              <Campo label="CURP">
                <input className={styles.input} type="text" value={form.curp} onChange={set('curp')} maxLength={18} style={{ textTransform: 'uppercase' }} />
              </Campo>
              <Campo label="Fecha de nacimiento">
                <div className={styles.inputIconWrapper}>
                  <Calendar className={styles.inputIcon} size={18} />
                  <input className={styles.inputWithIcon} type="date" value={form.fechaNac} onChange={set('fechaNac')} />
                </div>
              </Campo>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Sección específica */}
          {tipo === 'estudiante' ? (
            <SeccionEstudiante form={form} set={set} />
          ) : (
            <SeccionArrendador form={form} set={set} />
          )}

          <hr className={styles.divider} />

          {/* Contraseñas y checks */}
          <div className={styles.seccion}>
            <div className={styles.passRow}>
              <div className={styles.grid2half}>
                <Campo label="Contraseña">
                  <div className={styles.inputWrapper}>
                    <input className={styles.input} type={showPass ? 'text' : 'password'}
                      value={form.contrasena} onChange={set('contrasena')} required />
                    <button type="button" className={styles.togglePass} onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Campo>
                <Campo label="Repetir contraseña">
                  <div className={styles.inputWrapper}>
                    <input className={styles.input} type={showPass2 ? 'text' : 'password'}
                      value={form.repetirContrasena} onChange={set('repetirContrasena')} required />
                    <button type="button" className={styles.togglePass} onClick={() => setShowPass2(v => !v)}>
                      {showPass2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Campo>
              </div>
              <p className={styles.passHint}>
                <Lock size={14} /> *Mínimo 8 caracteres, incluir letra, número y carácter especial.
              </p>
            </div>

            <div className={styles.checkGroup}>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.avisoPrivacidad} onChange={set('avisoPrivacidad')} className={styles.checkInput} required />
                <span className={styles.checkCustom} />
                <FileText size={16} /> Aviso de Privacidad
              </label>
              <label className={styles.checkLabel}>
                <input type="checkbox" checked={form.terminosCondiciones} onChange={set('terminosCondiciones')} className={styles.checkInput} required />
                <span className={styles.checkCustom} />
                <CheckSquare size={16} /> Términos y Condiciones de Uso
              </label>
            </div>

            <div className={styles.siguienteRow}>
              <button type="submit" className={styles.btnSiguiente}>
                Siguiente <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

// Sección Estudiante
function SeccionEstudiante({ form, set }) {
  return (
    <div className={styles.seccion}>
      <div className={styles.grid3}>
        <Campo label="Unidad académica">
          <SelectInput value={form.unidad} onChange={set('unidad')} required>
            <option value="" disabled></option>
            {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="Carrera">
          <SelectInput value={form.carrera} onChange={set('carrera')} required>
            <option value="" disabled></option>
            {CARRERAS.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
        </Campo>
        <Campo label="No. Boleta">
          <input className={styles.input} type="text" value={form.boleta} onChange={set('boleta')} required />
        </Campo>
      </div>
      <div className={styles.grid1}>
        <div style={{ maxWidth: 200 }}>
          <Campo label="No. Semestre">
            <SelectInput value={form.semestre} onChange={set('semestre')} required>
              <option value="" disabled></option>
              {SEMESTRES.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectInput>
          </Campo>
        </div>
      </div>
    </div>
  );
}

// Sección Arrendador
function SeccionArrendador({ form, set }) {
  return (
    <div className={styles.seccion}>
      <div className={styles.grid3}>
        <Campo label="Código postal">
          <div className={styles.inputIconWrapper}>
            <MapPin className={styles.inputIcon} size={18} />
            <input className={styles.inputWithIcon} type="text" value={form.cp} onChange={set('cp')} maxLength={5} />
          </div>
        </Campo>
        <Campo label="Estado">
          <input className={styles.input} type="text" value={form.estado} onChange={set('estado')} />
        </Campo>
        <Campo label="Municipio / Delegación">
          <input className={styles.input} type="text" value={form.municipio} onChange={set('municipio')} />
        </Campo>
      </div>
      <div className={styles.grid3}>
        <Campo label="Colonia / Localidad">
          <input className={styles.input} type="text" value={form.colonia} onChange={set('colonia')} />
        </Campo>
        <Campo label="Calle">
          <div className={styles.inputIconWrapper}>
            <Home className={styles.inputIcon} size={18} />
            <input className={styles.inputWithIcon} type="text" value={form.calle} onChange={set('calle')} />
          </div>
        </Campo>
        <div className={styles.grid2mini}>
          <Campo label="No. Exterior">
            <input className={styles.input} type="text" value={form.numExt} onChange={set('numExt')} />
          </Campo>
          <Campo label="No. Interior">
            <input className={styles.input} type="text" value={form.numInt} onChange={set('numInt')} />
          </Campo>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function Campo({ label, children }) {
  return (
    <div className={styles.campo}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function SelectInput({ children, ...props }) {
  return (
    <div className={styles.selectWrapper}>
      <select className={styles.select} {...props}>{children}</select>
      <span className={styles.selectArrow}>⌄</span>
    </div>
  );
}