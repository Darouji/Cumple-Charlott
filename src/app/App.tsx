import { invitationConfig } from "../config/invitation.config";
import { PixiScene } from "../scene/PixiScene";
import styles from "./App.module.css";

export function App() {
  return (
    <main className={styles.app}>
      <div className={styles.forest} aria-hidden="true" />
      <PixiScene />
      <div className={styles.atmosphere} aria-hidden="true" />

      <section className={styles.content} aria-labelledby="invitation-title">
        <div className={styles.glow} aria-hidden="true" />

        <p className={styles.eyebrow}>Una celebración encantada</p>

        <h1 id="invitation-title" className={styles.title}>
          {invitationConfig.honoree} cumple {invitationConfig.age}
        </h1>

        <p className={styles.subtitle}>
          El bosque está preparando algo mágico. Muy pronto podrás descubrirlo.
        </p>
      </section>
    </main>
  );
}
