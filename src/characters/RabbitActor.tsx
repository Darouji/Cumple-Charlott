import { useEffect, useRef } from "react";
import gsap from "gsap";

import {
  createRabbitEscape,
  createRabbitIdle,
} from "../animation/createRabbitMotion";
import rabbitAlert from "../assets/characters/rabbit-alert.webp";
import rabbitHop from "../assets/characters/rabbit-hop.webp";
import styles from "./RabbitActor.module.css";

type RabbitScene = "threshold" | "transitioning" | "glade" | "stage";

interface RabbitActorProps {
  readonly scene: RabbitScene;
  readonly escaping: boolean;
  readonly onEscapeComplete: () => void;
}

export function RabbitActor({
  scene,
  escaping,
  onEscapeComplete,
}: RabbitActorProps) {
  const alertRef = useRef<HTMLImageElement>(null);
  const escapeRef = useRef<HTMLImageElement>(null);
  const onEscapeCompleteRef = useRef(onEscapeComplete);

  useEffect(() => {
    onEscapeCompleteRef.current = onEscapeComplete;
  }, [onEscapeComplete]);

  useEffect(() => {
    const alertRabbit = alertRef.current;

    if (!alertRabbit) {
      return;
    }

    gsap.killTweensOf(alertRabbit);

    if (scene !== "threshold") {
      const hideTween = gsap.to(alertRabbit, {
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      return () => {
        hideTween.kill();
      };
    }

    const timeline = createRabbitIdle(alertRabbit, {
      reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
    });

    return () => {
      timeline.kill();
    };
  }, [scene]);

  useEffect(() => {
    const escapeRabbit = escapeRef.current;

    if (!escapeRabbit || !escaping) {
      return;
    }

    const timeline = createRabbitEscape(escapeRabbit, {
      reducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches,
      onComplete: () => onEscapeCompleteRef.current(),
    });

    return () => {
      timeline.kill();
    };
  }, [escaping]);

  return (
    <div className={styles.layer} aria-hidden="true">
      <img
        ref={alertRef}
        className={`${styles.rabbit} ${styles.alert}`}
        src={rabbitAlert}
        alt=""
      />
      <img
        ref={escapeRef}
        className={`${styles.rabbit} ${styles.escape}`}
        src={rabbitHop}
        alt=""
      />
    </div>
  );
}
