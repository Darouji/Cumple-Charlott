import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  createFairyStoryFinalIdle,
  createFairyStoryTimeline,
  setFairyStoryOpening,
  type FairyStoryElements,
} from "../animation/createFairyStoryTimeline";
import { experienceAudio } from "../audio/experienceAudio";
import openingPose from "../assets/characters/fairy/frames-v2/magic-idea.webp";
import rabbitPeek from "../assets/characters/rabbit-alert.webp";
import chestClosed from "../assets/props/chest-front-closed.webp";
import chestOpen from "../assets/props/chest-front-open.webp";
import { fairyStoryAssetSources } from "../config/fairyStory.config";
import type { ExperiencePhase } from "../config/experience.config";
import styles from "./FairyStoryActor.module.css";

interface FairyStoryActorProps {
  readonly phase: ExperiencePhase;
  readonly onComplete: () => void;
}

export function FairyStoryActor({
  phase,
  onComplete,
}: FairyStoryActorProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const poseRef = useRef<HTMLImageElement>(null);
  const poseGhostRef = useRef<HTMLImageElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<HTMLImageElement>(null);
  const chestShadowRef = useRef<HTMLDivElement>(null);
  const chestGlowRef = useRef<HTMLDivElement>(null);
  const ideaSparkRef = useRef<HTMLDivElement>(null);
  const sprinkleRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const rabbitPeekRef = useRef<HTMLImageElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const preloadSources = [
      ...fairyStoryAssetSources,
      chestClosed,
      chestOpen,
      rabbitPeek,
    ];

    for (const source of preloadSources) {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
    }
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    const actor = actorRef.current;
    const pose = poseRef.current;
    const poseGhost = poseGhostRef.current;
    const shadow = shadowRef.current;
    const chest = chestRef.current;
    const chestShadow = chestShadowRef.current;
    const chestGlow = chestGlowRef.current;
    const ideaSpark = ideaSparkRef.current;
    const sprinkle = sprinkleRef.current;
    const dust = dustRef.current;
    const burst = burstRef.current;
    const rabbit = rabbitPeekRef.current;

    if (
      !layer ||
      !actor ||
      !pose ||
      !poseGhost ||
      !shadow ||
      !chest ||
      !chestShadow ||
      !chestGlow ||
      !ideaSpark ||
      !sprinkle ||
      !dust ||
      !burst ||
      !rabbit
    ) {
      return;
    }

    const elements: FairyStoryElements = {
      layer,
      actor,
      pose,
      poseGhost,
      shadow,
      chest,
      chestShadow,
      chestGlow,
      ideaSpark,
      sprinkle,
      dust,
      burst,
      rabbit,
    };
    const animatedElements = Object.values(elements);

    gsap.killTweensOf(animatedElements);

    if (phase === "close-reveal") {
      setFairyStoryOpening(elements);
      return;
    }

    if (phase === "invitation-reveal") {
      const idle = createFairyStoryFinalIdle(elements);

      return () => idle.kill();
    }

    if (phase !== "fairy-story") {
      gsap.set(layer, { autoAlpha: 0 });
      return;
    }

    const timeline = createFairyStoryTimeline(elements, {
      reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
      onSoundCue: (cue) => experienceAudio.play(cue),
      onComplete: () => onCompleteRef.current(),
    });

    return () => {
      timeline.kill();
      gsap.killTweensOf([pose, poseGhost]);
    };
  }, [phase]);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <div ref={sprinkleRef} className={styles.sprinkle} />
      <div ref={dustRef} className={styles.dust} />
      <div ref={burstRef} className={styles.burst} />
      <div ref={ideaSparkRef} className={styles.ideaSpark} />
      <div className={styles.rabbitPeekFrame}>
        <img
          ref={rabbitPeekRef}
          className={styles.rabbitPeek}
          src={rabbitPeek}
          alt=""
        />
      </div>

      <div ref={chestGlowRef} className={styles.chestGlow} />
      <div ref={chestShadowRef} className={styles.chestShadow} />
      <img
        ref={chestRef}
        className={styles.chest}
        src={chestClosed}
        alt=""
      />

      <div ref={actorRef} className={styles.actor}>
        <div ref={shadowRef} className={styles.shadow} />
        <img
          ref={poseGhostRef}
          className={`${styles.pose} ${styles.poseGhost}`}
          src={openingPose}
          alt=""
        />
        <img ref={poseRef} className={styles.pose} src={openingPose} alt="" />
      </div>
    </div>
  );
}
