import { useEffect, useRef, useState } from "react";

import { createForestTransition } from "../animation/createForestTransition";
import gladeLandscape from "../assets/forest/hidden-glade-landscape.webp";
import gladePortrait from "../assets/forest/hidden-glade-portrait.webp";
import thresholdLandscape from "../assets/forest/forest-threshold-landscape.webp";
import thresholdPortrait from "../assets/forest/enchanted-forest.webp";
import { invitationConfig } from "../config/invitation.config";
import { PixiScene } from "../scene/PixiScene";
import styles from "./App.module.css";

export function App() {
  const [scene, setScene] = useState<"threshold" | "transitioning" | "glade">(
    "threshold",
  );
  const thresholdRef = useRef<HTMLPictureElement>(null);
  const gladeRef = useRef<HTMLPictureElement>(null);
  const introductionRef = useRef<HTMLElement>(null);
  const discoveryHintRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (scene === "glade") {
      discoveryHintRef.current?.focus({ preventScroll: true });
    }
  }, [scene]);

  const enterForest = () => {
    const threshold = thresholdRef.current;
    const glade = gladeRef.current;
    const introduction = introductionRef.current;
    const discoveryHint = discoveryHintRef.current;

    if (
      scene !== "threshold" ||
      !threshold ||
      !glade ||
      !introduction ||
      !discoveryHint
    ) {
      return;
    }

    setScene("transitioning");
    timelineRef.current = createForestTransition(
      { threshold, glade, introduction, discoveryHint },
      {
        reducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches,
        onComplete: () => setScene("glade"),
      },
    );
  };

  return (
    <main className={styles.app}>
      <picture
        ref={thresholdRef}
        className={`${styles.forest} ${styles.threshold}`}
        aria-hidden="true"
      >
        <source media="(min-aspect-ratio: 4 / 3)" srcSet={thresholdLandscape} />
        <img src={thresholdPortrait} alt="" />
      </picture>

      <picture
        ref={gladeRef}
        className={`${styles.forest} ${styles.glade}`}
        aria-hidden="true"
      >
        <source media="(min-aspect-ratio: 4 / 3)" srcSet={gladeLandscape} />
        <img src={gladePortrait} alt="" />
      </picture>

      <PixiScene />
      <div className={styles.atmosphere} aria-hidden="true" />

      <section
        ref={introductionRef}
        className={styles.content}
        aria-labelledby="invitation-title"
        aria-hidden={scene === "glade"}
      >
        <div className={styles.glow} aria-hidden="true" />

        <p className={styles.eyebrow}>Una celebración encantada</p>

        <h1 id="invitation-title" className={styles.title}>
          {invitationConfig.honoree} cumple {invitationConfig.age}
        </h1>

        <p className={styles.subtitle}>
          El bosque está preparando algo mágico. Quizás deberíamos acercarnos.
        </p>

        <button
          className={styles.enterButton}
          type="button"
          onClick={enterForest}
          disabled={scene !== "threshold"}
        >
          Adéntrate en el bosque
        </button>
      </section>

      <p
        ref={discoveryHintRef}
        className={styles.discoveryHint}
        tabIndex={-1}
        aria-hidden={scene !== "glade"}
      >
        Shh… parece que alguien está preparando algo.
      </p>
    </main>
  );
}
