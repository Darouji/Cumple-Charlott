import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  createRabbitArrival,
  createRabbitIdle,
  createRabbitJourney,
  createRabbitThresholdExit,
  type RabbitMotionElements,
} from "../animation/createRabbitMotion";
import rabbitAlert from "../assets/characters/rabbit-alert.webp";
import rabbitHop from "../assets/characters/rabbit-hop.webp";
import rabbitHopSide from "../assets/characters/rabbit-hop-side.webp";
import rabbitLandAway from "../assets/characters/rabbit-land-away.webp";
import rabbitLandSide from "../assets/characters/rabbit-land-side.webp";
import rabbitLookBack from "../assets/characters/rabbit-look-back.webp";
import type { ExperiencePhase } from "../config/experience.config";
import styles from "./RabbitActor.module.css";

interface RabbitActorProps {
  readonly phase: ExperiencePhase;
  readonly onArrivalComplete: () => void;
  readonly onThresholdExitComplete: () => void;
  readonly onJourneyComplete: () => void;
}

export function RabbitActor({
  phase,
  onArrivalComplete,
  onThresholdExitComplete,
  onJourneyComplete,
}: RabbitActorProps) {
  const rigRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLImageElement>(null);
  const hopSideRef = useRef<HTMLImageElement>(null);
  const landSideRef = useRef<HTMLImageElement>(null);
  const hopAwayRef = useRef<HTMLImageElement>(null);
  const landAwayRef = useRef<HTMLImageElement>(null);
  const lookBackRef = useRef<HTMLImageElement>(null);
  const callbacksRef = useRef({
    onArrivalComplete,
    onThresholdExitComplete,
    onJourneyComplete,
  });

  useEffect(() => {
    callbacksRef.current = {
      onArrivalComplete,
      onThresholdExitComplete,
      onJourneyComplete,
    };
  }, [onArrivalComplete, onJourneyComplete, onThresholdExitComplete]);

  useEffect(() => {
    const rig = rigRef.current;
    const shadow = shadowRef.current;
    const alert = alertRef.current;
    const hopSide = hopSideRef.current;
    const landSide = landSideRef.current;
    const hopAway = hopAwayRef.current;
    const landAway = landAwayRef.current;
    const lookBack = lookBackRef.current;

    if (
      !rig ||
      !shadow ||
      !alert ||
      !hopSide ||
      !landSide ||
      !hopAway ||
      !landAway ||
      !lookBack
    ) {
      return;
    }

    const elements: RabbitMotionElements = {
      rig,
      shadow,
      poses: { alert, hopSide, landSide, hopAway, landAway, lookBack },
    };
    const animatedElements = [
      rig,
      shadow,
      alert,
      hopSide,
      landSide,
      hopAway,
      landAway,
      lookBack,
    ];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.killTweensOf(animatedElements);

    let timeline: gsap.core.Timeline | null = null;

    if (phase === "threshold-arrival") {
      timeline = createRabbitArrival(elements, {
        reducedMotion,
        onComplete: () => callbacksRef.current.onArrivalComplete(),
      });
    } else if (phase === "threshold-ready") {
      timeline = createRabbitIdle(rig, { reducedMotion });
    } else if (phase === "threshold-exit") {
      timeline = createRabbitThresholdExit(elements, {
        reducedMotion,
        onComplete: () => callbacksRef.current.onThresholdExitComplete(),
      });
    } else if (phase === "glade-journey") {
      timeline = createRabbitJourney(elements, {
        reducedMotion,
        onComplete: () => callbacksRef.current.onJourneyComplete(),
      });
    } else {
      gsap.set(animatedElements, { autoAlpha: 0 });
    }

    return () => {
      timeline?.kill();
    };
  }, [phase]);

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={shadowRef} className={styles.shadow} />
      <div ref={rigRef} className={styles.rig}>
        <img ref={alertRef} className={styles.pose} src={rabbitAlert} alt="" />
        <img
          ref={hopSideRef}
          className={styles.pose}
          src={rabbitHopSide}
          alt=""
        />
        <img
          ref={landSideRef}
          className={styles.pose}
          src={rabbitLandSide}
          alt=""
        />
        <img ref={hopAwayRef} className={styles.pose} src={rabbitHop} alt="" />
        <img
          ref={landAwayRef}
          className={styles.pose}
          src={rabbitLandAway}
          alt=""
        />
        <img
          ref={lookBackRef}
          className={styles.pose}
          src={rabbitLookBack}
          alt=""
        />
      </div>
    </div>
  );
}
