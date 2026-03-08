// ============================================================
// src/shared/components/CodeInput.jsx
// Inputs de dígitos para códigos de verificación.
// Usado en VerificarCodigo (8 dígitos) y RestablecerContrasena paso 2 (6 dígitos).
//
// Props:
//   longitud:  number              — cantidad de inputs (default 6)
//   value:     string[]            — array de dígitos
//   onChange:  fn(nuevosDigitos)   — callback con array actualizado
//   inputsRef: React.MutableRefObject
// ============================================================
import styles from './CodeInput.module.css';

export default function CodeInput({ longitud = 6, value, onChange, inputsRef }) {

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const nuevos = [...value];
    nuevos[i] = val;
    onChange(nuevos);
    if (val && i < longitud - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, longitud);
    if (!txt) return;
    const nuevos = Array(longitud).fill('');
    txt.split('').forEach((c, i) => { nuevos[i] = c; });
    onChange(nuevos);
    inputsRef.current[Math.min(txt.length, longitud - 1)]?.focus();
    e.preventDefault();
  };

  return (
    <div className={styles.row} onPaste={handlePaste}>
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          className={`${styles.input} ${d ? styles.lleno : ''} ${i === 3 && longitud === 8 ? styles.gap : ''}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}