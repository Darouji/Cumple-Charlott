import { useEffect, useRef, useState } from "react";

import { createSceneTransition } from "../animation/createSceneTransition";
import stageLandscape from "../assets/forest/fairy-stage-landscape.webp";
import stagePortrait from "../assets/forest/fairy-stage-portrait.webp";
import thresholdLandscape from "../assets/forest/forest-threshold-landscape-v2.webp";
import thresholdPortrait from "../assets/forest/forest-threshold-portrait-v2.webp";
import gladeLandscape from "../assets/forest/hidden-glade-landscape.webp";
import gladePortrait from "../assets/forest/hidden-glade-portrait.webp";
import { invitationConfig } from "../config/invitation.config";
import { PixiScene } from "../scene/PixiScene";
import styles from "./App.module.css";

type StableScene = "threshold" | "glade" | "stage";
type SceneState = StableScene | "transitioning";

export function App() {
  const [scene, setScene] = useState<SceneState>("threshold");
  const thresholdRef = useRef<HTMLPictureElement>(null);
  const gladeRef = useRef<HTMLPictureElement>(null);
  const stageRef = useRef<HTMLPictureElement>(null);
  const introductionRef = useRef<HTMLElement>(null);
  const discoveryPromptRef = useRef<HTMLElement>(null);
  const stagePromptRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    const prompt =
      scene === "glade"
        ? discoveryPromptRef.current
        : scene === "stage"
          ? stagePromptRef.current
          : null;

    prompt?.focus({ preventScroll: true });
  }, [scene]);

  const transitionTo = (destination: "glade" | "stage") => {
    const plan =
      destination === "glade"
        ? {
            from: "threshold" as const,
            outgoingScene: thresholdRef.current,
            incomingScene: gladeRef.current,
            outgoingContent: introductionRef.current,
            incomingContent: discoveryPromptRef.current,
          }
        : {
            from: "glade" as const,
            outgoingScene: gladeRef.current,
            incomingScene: stageRef.current,
            outgoingContent: discoveryPromptRef.current,
            incomingContent: stagePromptRef.current,
          };

    if (
      scene !== plan.from ||
      !plan.outgoingScene ||
      !plan.incomingScene ||
      !plan.outgoingContent ||
      !plan.incomingContent
    ) {
      return;
    }

    setScene("transitioning");
    timelineRef.current = createSceneTransition(
      {
        outgoingScene: plan.outgoingScene,
        incomingScene: plan.incomingScene,
        outgoingContent: plan.outgoingContent,
        incomingContent: plan.incomingContent,
      },
      {
        reducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches,
        onComplete: () => setScene(destination),
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
        className={`${styles.forest} ${styles.hiddenScene}`}
        aria-hidden="true"
      >
        <source media="(min-aspect-ratio: 4 / 3)" srcSet={gladeLandscape} />
        <img src={gladePortrait} alt="" />
      </picture>

      <picture
        ref={stageRef}
        className={`${styles.forest} ${styles.hiddenScene}`}
        aria-hidden="true"
      >
        <source media="(min-aspect-ratio: 4 / 3)" srcSet={stageLandscape} />
        <img src={stagePortrait} alt="" />
      </picture>

      <PixiScene />
      <div className={styles.atmosphere} aria-hidden="true" />

      <section
        ref={introductionRef}
        className={styles.content}
        aria-labelledby="invitation-title"
        aria-hidden={scene !== "threshold"}
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
          className={styles.actionButton}
          type="button"
          onClick={() => transitionTo("glade")}
          disabled={scene !== "threshold"}
        >
          Adéntrate en el bosque
        </button>
      </section>

      <section
        ref={discoveryPromptRef}
        className={styles.scenePrompt}
        tabIndex={-1}
        aria-hidden={scene !== "glade"}
      >
        <p>Shh… parece que el conejo quiere mostrarnos algo.</p>
        <button
          className={styles.actionButton}
          type="button"
          onClick={() => transitionTo("stage")}
          disabled={scene !== "glade"}
        >
          Seguir al conejo
        </button>
      </section>

      <section
        ref={stagePromptRef}
        className={styles.scenePrompt}
        tabIndex={-1}
        aria-hidden={scene !== "stage"}
      >
        <p>Ahora sí… algo está ocurriendo junto al tocón.</p>
      </section>
    </main>
  );
}
