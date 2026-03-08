import styles from './AuthLayout.module.css';
import Footer  from './Footer';

export default function AuthLayout({ navbar, children, center = true }) {
  return (
    <div className={styles.page}>
      {navbar}
      <main className={`${styles.container} ${center ? styles.center : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}