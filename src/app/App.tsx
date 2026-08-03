import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { createSceneTransition } from "../animation/createSceneTransition";
import stageLandscape from "../assets/forest/fairy-stage-landscape.webp";
import stagePortrait from "../assets/forest/fairy-stage-portrait.webp";
import thresholdLandscape from "../assets/forest/forest-threshold-landscape-v2.webp";
import thresholdPortrait from "../assets/forest/forest-threshold-portrait-v2.webp";
import gladeLandscape from "../assets/forest/hidden-glade-landscape.webp";
import gladePortrait from "../assets/forest/hidden-glade-portrait.webp";
import { RabbitActor } from "../characters/RabbitActor";
import {
  experienceCopy,
  type ExperiencePhase,
} from "../config/experience.config";
import { PixiScene } from "../scene/PixiScene";
import styles from "./App.module.css";

type Destination = "glade" | "stage";

export function App() {
  const [phase, setPhase] = useState<ExperiencePhase>("threshold-intro");
  const thresholdRef = useRef<HTMLPictureElement>(null);
  const gladeRef = useRef<HTMLPictureElement>(null);
  const stageRef = useRef<HTMLPictureElement>(null);
  const introductionRef = useRef<HTMLElement>(null);
  const discoveryPromptRef = useRef<HTMLElement>(null);
  const stagePromptRef = useRef<HTMLElement>(null);
  const interactionRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (
      phase === "threshold-intro" ||
      phase === "threshold-ready" ||
      phase === "glade-prompt"
    ) {
      interactionRef.current?.focus({ preventScroll: true });
    } else if (phase === "stage-reveal") {
      stagePromptRef.current?.focus({ preventScroll: true });
    }
  }, [phase]);

  const beginSceneTransition = (destination: Destination) => {
    const outgoingScene =
      destination === "glade" ? thresholdRef.current : gladeRef.current;
    const incomingScene =
      destination === "glade" ? gladeRef.current : stageRef.current;
    const incomingContent =
      destination === "glade"
        ? discoveryPromptRef.current
        : stagePromptRef.current;

    if (!outgoingScene || !incomingScene || !incomingContent) {
      return;
    }

    setPhase(destination === "glade" ? "entering-glade" : "entering-stage");
    timelineRef.current = createSceneTransition(
      { outgoingScene, incomingScene, incomingContent },
      {
        reducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches,
        onComplete: () =>
          setPhase(destination === "glade" ? "glade-prompt" : "stage-reveal"),
      },
    );
  };

  const advanceExperience = () => {
    if (phase === "threshold-intro") {
      if (introductionRef.current) {
        gsap.to(introductionRef.current, {
          autoAlpha: 0,
          y: -14,
          duration: 0.45,
          ease: "power2.out",
        });
      }

      setPhase("threshold-arrival");
    } else if (phase === "threshold-ready") {
      setPhase("threshold-exit");
    } else if (phase === "glade-prompt") {
      if (discoveryPromptRef.current) {
        gsap.to(discoveryPromptRef.current, {
          autoAlpha: 0,
          y: 12,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      setPhase("glade-journey");
    }
  };

  const interactionCopy =
    phase === "threshold-intro"
      ? experienceCopy.interaction.continue
      : phase === "threshold-ready" || phase === "glade-prompt"
        ? experienceCopy.interaction.follow
        : null;

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
      <RabbitActor
        phase={phase}
        onArrivalComplete={() => setPhase("threshold-ready")}
        onThresholdExitComplete={() => beginSceneTransition("glade")}
        onJourneyComplete={() => beginSceneTransition("stage")}
      />
      <div className={styles.atmosphere} aria-hidden="true" />

      <section
        ref={introductionRef}
        className={styles.content}
        aria-labelledby="experience-title"
        aria-hidden={phase !== "threshold-intro"}
      >
        <div className={styles.glow} aria-hidden="true" />
        <p className={styles.eyebrow}>{experienceCopy.intro.eyebrow}</p>
        <h1 id="experience-title" className={styles.title}>
          {experienceCopy.intro.title}
        </h1>
      </section>

      <section
        ref={discoveryPromptRef}
        className={styles.scenePrompt}
        tabIndex={-1}
        aria-live="polite"
        aria-hidden={phase !== "glade-prompt"}
      >
        <p>{experienceCopy.glade}</p>
      </section>

      <section
        ref={stagePromptRef}
        className={`${styles.scenePrompt} ${styles.stagePrompt}`}
        tabIndex={-1}
        aria-live="polite"
        aria-hidden={phase !== "stage-reveal"}
      >
        <p>{experienceCopy.stage}</p>
      </section>

      {interactionCopy ? (
        <button
          ref={interactionRef}
          className={styles.screenTrigger}
          type="button"
          onClick={advanceExperience}
          aria-label={`${interactionCopy.coarse}.`}
        >
          <span className={styles.interactionCue}>
            <span className={styles.coarseCue}>{interactionCopy.coarse}</span>
            <span className={styles.fineCue}>{interactionCopy.fine}</span>
          </span>
        </button>
      ) : null}
    </main>
  );
}
