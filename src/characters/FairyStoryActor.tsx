import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  createFairyStoryTimeline,
  setFairyStoryOpening,
  setFairyStoryOverview,
  type FairyStoryElements,
} from "../animation/createFairyStoryTimeline";
import openingPose from "../assets/characters/fairy/frames-v2/push-reach.webp";
import rabbitPeek from "../assets/characters/rabbit-alert.webp";
import chestClosed from "../assets/props/chest-closed.webp";
import blankLetter from "../assets/props/invitation-letter.webp";
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
  const shadowRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<HTMLImageElement>(null);
  const chestShadowRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLImageElement>(null);
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
      blankLetter,
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
    const shadow = shadowRef.current;
    const chest = chestRef.current;
    const chestShadow = chestShadowRef.current;
    const letter = letterRef.current;
    const dust = dustRef.current;
    const burst = burstRef.current;
    const rabbit = rabbitPeekRef.current;

    if (
      !layer ||
      !actor ||
      !pose ||
      !shadow ||
      !chest ||
      !chestShadow ||
      !letter ||
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
      shadow,
      chest,
      chestShadow,
      letter,
      dust,
      burst,
      rabbit,
    };
    const animatedElements = Object.values(elements);

    gsap.killTweensOf(animatedElements);

    if (phase === "stage-reveal") {
      setFairyStoryOverview(elements);
      return;
    }

    if (phase === "close-reveal") {
      setFairyStoryOpening(elements);
      return;
    }

    if (phase !== "fairy-story") {
      if (phase !== "invitation-reveal") {
        gsap.set(layer, { autoAlpha: 0 });
      }
      return;
    }

    const timeline = createFairyStoryTimeline(elements, {
      reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
      onComplete: () => onCompleteRef.current(),
    });

    return () => {
      timeline.kill();
    };
  }, [phase]);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <div ref={dustRef} className={styles.dust} />
      <div ref={burstRef} className={styles.burst} />
      <div className={styles.rabbitPeekFrame}>
        <img ref={rabbitPeekRef} className={styles.rabbitPeek} src={rabbitPeek} alt="" />
      </div>

      <div ref={chestShadowRef} className={styles.chestShadow} />
      <img
        ref={chestRef}
        className={styles.chest}
        src={chestClosed}
        alt=""
      />

      <img ref={letterRef} className={styles.letter} src={blankLetter} alt="" />

      <div ref={actorRef} className={styles.actor}>
        <div ref={shadowRef} className={styles.shadow} />
        <img ref={poseRef} className={styles.pose} src={openingPose} alt="" />
      </div>
    </div>
  );
}
