import { useState } from "react";

import letterTexture from "../assets/props/invitation-letter.webp";
import { invitationConfig } from "../config/invitation.config";
import styles from "./InvitationLetter.module.css";

export function InvitationLetter() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className={styles.layer} aria-live="polite">
      <button
        className={`${styles.card} ${showDetails ? styles.details : ""}`}
        type="button"
        onClick={() => setShowDetails((current) => !current)}
        aria-label={
          showDetails
            ? "Volver al anuncio de cumpleaños"
            : "Ver la fecha y el lugar de la celebración"
        }
        >
          <img className={styles.paper} src={letterTexture} alt="" />
          <img
            className={`${styles.paper} ${styles.paperBack}`}
            src={letterTexture}
            alt=""
          />

        <span className={`${styles.face} ${styles.front}`}>
          <span className={styles.sparkle}>✦</span>
          <span className={styles.opening}>{invitationConfig.letter.opening}</span>
          <strong>
            {invitationConfig.honoree} cumple {invitationConfig.age} años
          </strong>
          <span>{invitationConfig.letter.message}</span>
        </span>

        <span className={`${styles.face} ${styles.back}`}>
          <span className={styles.sparkle}>✦</span>
          <strong>{invitationConfig.date.display}</strong>
          <span>{invitationConfig.time}</span>
          <span>{invitationConfig.address}</span>
          <span className={styles.farewell}>
            {invitationConfig.letter.farewell} ✦
          </span>
        </span>
      </button>

      <p className={styles.cue}>
        {showDetails ? "Toca la carta para volver" : "Toca la carta para ver los detalles"}
      </p>
    </section>
  );
}
