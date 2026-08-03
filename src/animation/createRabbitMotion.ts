import gsap from "gsap";

export interface RabbitPoseElements {
  readonly alert: HTMLElement;
  readonly hopSide: HTMLElement;
  readonly landSide: HTMLElement;
  readonly hopAway: HTMLElement;
  readonly landAway: HTMLElement;
  readonly lookBack: HTMLElement;
}

export interface RabbitMotionElements {
  readonly rig: HTMLElement;
  readonly shadow: HTMLElement;
  readonly poses: RabbitPoseElements;
}

interface RabbitMotionOptions {
  readonly reducedMotion: boolean;
  readonly onComplete?: () => void;
}

interface Point {
  readonly x: number;
  readonly ground: number;
  readonly scale: number;
}

const allPoses = (poses: RabbitPoseElements): HTMLElement[] =>
  Object.values(poses);

function showPose(
  timeline: gsap.core.Timeline,
  poses: RabbitPoseElements,
  pose: HTMLElement,
  position?: gsap.Position,
) {
  timeline
    .set(allPoses(poses), { autoAlpha: 0 }, position)
    .set(pose, { autoAlpha: 1 }, position);
}

function setGroundedState(
  timeline: gsap.core.Timeline,
  elements: RabbitMotionElements,
  point: Point,
) {
  timeline
    .set(elements.rig, {
      autoAlpha: 1,
      left: `${point.x}%`,
      top: `${point.ground}%`,
      rotation: 0,
      scale: point.scale,
      scaleX: 1,
      scaleY: 1,
      x: 0,
      y: 0,
    })
    .set(elements.shadow, {
      autoAlpha: 0.42,
      left: `${point.x}%`,
      top: `${point.ground}%`,
      scale: point.scale,
      scaleX: 1,
      scaleY: 1,
    });
}

function addHop(
  timeline: gsap.core.Timeline,
  elements: RabbitMotionElements,
  from: Point,
  to: Point,
  apexHeight: number,
  landingPose: HTMLElement,
) {
  const midpointX = (from.x + to.x) / 2;
  const midpointGround = (from.ground + to.ground) / 2;
  const midpointScale = (from.scale + to.scale) / 2;

  showPose(timeline, elements.poses, elements.poses.hopAway);
  timeline
    .to(elements.rig, {
      left: `${midpointX}%`,
      top: `${midpointGround - apexHeight}%`,
      scale: midpointScale,
      rotation: 2,
      duration: 0.28,
      ease: "power2.out",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.16,
        left: `${midpointX}%`,
        top: `${midpointGround}%`,
        scale: midpointScale * 0.58,
        duration: 0.28,
        ease: "power1.out",
      },
      "<",
    )
    .to(elements.rig, {
      left: `${to.x}%`,
      top: `${to.ground}%`,
      scale: to.scale,
      rotation: 0,
      duration: 0.23,
      ease: "power2.in",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.44,
        left: `${to.x}%`,
        top: `${to.ground}%`,
        scale: to.scale,
        duration: 0.23,
        ease: "power1.in",
      },
      "<",
    );
  showPose(timeline, elements.poses, landingPose);
  timeline
    .to(elements.rig, {
      scaleX: 1.055,
      scaleY: 0.91,
      duration: 0.08,
      ease: "power2.out",
    })
    .to(elements.rig, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.12,
      ease: "back.out(2)",
    });
}

export function createRabbitIdle(
  rabbit: HTMLElement,
  options: Pick<RabbitMotionOptions, "reducedMotion">,
): gsap.core.Timeline {
  const timeline = gsap.timeline();

  if (options.reducedMotion) {
    return timeline.set(rabbit, {
      autoAlpha: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
  }

  return timeline
    .set(rabbit, { autoAlpha: 1, rotation: 0, scaleX: 1, scaleY: 1 })
    .to(rabbit, {
      rotation: 0.65,
      scaleY: 1.008,
      duration: 1.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "50% 100%",
    });
}

export function createRabbitArrival(
  elements: RabbitMotionElements,
  options: Required<RabbitMotionOptions>,
): gsap.core.Timeline {
  const landscape = window.matchMedia("(min-aspect-ratio: 4 / 3)").matches;
  const start: Point = landscape
    ? { x: -7, ground: 82, scale: 0.58 }
    : { x: -9, ground: 84, scale: 0.72 };
  const firstLanding: Point = landscape
    ? { x: 9, ground: 77, scale: 0.56 }
    : { x: 10, ground: 80, scale: 0.69 };
  const finalLanding: Point = landscape
    ? { x: 19, ground: 74, scale: 0.53 }
    : { x: 22, ground: 77, scale: 0.63 };
  const timeline = gsap.timeline({ onComplete: options.onComplete });

  if (options.reducedMotion) {
    setGroundedState(timeline, elements, finalLanding);
    showPose(timeline, elements.poses, elements.poses.alert);
    return timeline;
  }

  setGroundedState(timeline, elements, start);
  showPose(timeline, elements.poses, elements.poses.hopSide);

  const firstMidX = (start.x + firstLanding.x) / 2;
  const firstMidGround = (start.ground + firstLanding.ground) / 2;
  timeline
    .to(elements.rig, {
      left: `${firstMidX}%`,
      top: `${firstMidGround - 9}%`,
      scale: (start.scale + firstLanding.scale) / 2,
      rotation: -2,
      duration: 0.3,
      ease: "power2.out",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.15,
        left: `${firstMidX}%`,
        top: `${firstMidGround}%`,
        scale: firstLanding.scale * 0.58,
        duration: 0.3,
      },
      "<",
    )
    .to(elements.rig, {
      left: `${firstLanding.x}%`,
      top: `${firstLanding.ground}%`,
      scale: firstLanding.scale,
      rotation: 0,
      duration: 0.24,
      ease: "power2.in",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.44,
        left: `${firstLanding.x}%`,
        top: `${firstLanding.ground}%`,
        scale: firstLanding.scale,
        duration: 0.24,
      },
      "<",
    );
  showPose(timeline, elements.poses, elements.poses.landSide);
  timeline
    .to(elements.rig, { scaleX: 1.055, scaleY: 0.9, duration: 0.08 })
    .to(elements.rig, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.13,
      ease: "back.out(2)",
    });

  const secondMidX = (firstLanding.x + finalLanding.x) / 2;
  const secondMidGround = (firstLanding.ground + finalLanding.ground) / 2;
  showPose(timeline, elements.poses, elements.poses.hopSide);
  timeline
    .to(elements.rig, {
      left: `${secondMidX}%`,
      top: `${secondMidGround - 6.5}%`,
      scale: (firstLanding.scale + finalLanding.scale) / 2,
      rotation: 1.5,
      duration: 0.25,
      ease: "power2.out",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.17,
        left: `${secondMidX}%`,
        top: `${secondMidGround}%`,
        scale: finalLanding.scale * 0.62,
        duration: 0.25,
      },
      "<",
    )
    .to(elements.rig, {
      left: `${finalLanding.x}%`,
      top: `${finalLanding.ground}%`,
      scale: finalLanding.scale,
      rotation: 0,
      duration: 0.21,
      ease: "power2.in",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.44,
        left: `${finalLanding.x}%`,
        top: `${finalLanding.ground}%`,
        scale: finalLanding.scale,
        duration: 0.21,
      },
      "<",
    );
  showPose(timeline, elements.poses, elements.poses.landSide);
  timeline
    .to(elements.rig, { scaleX: 1.05, scaleY: 0.92, duration: 0.08 })
    .to(elements.rig, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.14,
      ease: "back.out(2)",
    });
  showPose(timeline, elements.poses, elements.poses.alert);
  timeline.fromTo(
    elements.rig,
    { rotation: -1.2 },
    { rotation: 0, duration: 0.35, ease: "back.out(1.8)" },
  );

  return timeline;
}

export function createRabbitThresholdExit(
  elements: RabbitMotionElements,
  options: Required<RabbitMotionOptions>,
): gsap.core.Timeline {
  const landscape = window.matchMedia("(min-aspect-ratio: 4 / 3)").matches;
  const destination: Point = landscape
    ? { x: 55, ground: 64, scale: 0.18 }
    : { x: 51, ground: 63, scale: 0.2 };
  const timeline = gsap.timeline({ onComplete: options.onComplete });

  if (options.reducedMotion) {
    return timeline.set([elements.rig, elements.shadow], { autoAlpha: 0 });
  }

  showPose(timeline, elements.poses, elements.poses.hopSide);
  timeline
    .to(elements.rig, {
      left: `${destination.x}%`,
      top: `${destination.ground - 7}%`,
      scale: destination.scale * 1.45,
      rotation: 2,
      duration: 0.48,
      ease: "power2.out",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0.15,
        left: `${destination.x}%`,
        top: `${destination.ground}%`,
        scale: destination.scale * 0.85,
        duration: 0.48,
      },
      "<",
    )
    .to(elements.rig, {
      top: `${destination.ground}%`,
      scale: destination.scale,
      rotation: 0,
      duration: 0.28,
      ease: "power2.in",
    })
    .to(
      elements.shadow,
      {
        autoAlpha: 0,
        scale: destination.scale,
        duration: 0.28,
      },
      "<",
    )
    .to(elements.rig, { autoAlpha: 0, duration: 0.14 }, "-=0.1");

  return timeline;
}

export function createRabbitJourney(
  elements: RabbitMotionElements,
  options: Required<RabbitMotionOptions>,
): gsap.core.Timeline {
  const landscape = window.matchMedia("(min-aspect-ratio: 4 / 3)").matches;
  const start: Point = landscape
    ? { x: 50, ground: 91, scale: 0.54 }
    : { x: 50, ground: 92, scale: 0.72 };
  const firstLanding: Point = { x: 48.5, ground: 80, scale: start.scale * 0.76 };
  const secondLanding: Point = { x: 50.5, ground: 70, scale: start.scale * 0.53 };
  const thirdLanding: Point = { x: 49.5, ground: 63, scale: start.scale * 0.28 };
  const destination: Point = { x: 50, ground: 58.5, scale: start.scale * 0.1 };
  const timeline = gsap.timeline({ onComplete: options.onComplete });

  if (options.reducedMotion) {
    return timeline.set([elements.rig, elements.shadow], { autoAlpha: 0 });
  }

  setGroundedState(timeline, elements, start);
  showPose(timeline, elements.poses, elements.poses.hopAway);
  addHop(timeline, elements, start, firstLanding, 8, elements.poses.landAway);
  addHop(
    timeline,
    elements,
    firstLanding,
    secondLanding,
    6.5,
    elements.poses.landAway,
  );

  showPose(timeline, elements.poses, elements.poses.lookBack);
  timeline
    .to(elements.rig, {
      rotation: -1.2,
      duration: 0.18,
      ease: "power2.out",
    })
    .to(elements.rig, {
      rotation: 0.8,
      duration: 0.32,
      ease: "sine.inOut",
    })
    .to(elements.rig, {
      rotation: 0,
      duration: 0.2,
      ease: "power2.out",
    })
    .to({}, { duration: 0.34 });

  addHop(
    timeline,
    elements,
    secondLanding,
    thirdLanding,
    4.2,
    elements.poses.landAway,
  );
  addHop(
    timeline,
    elements,
    thirdLanding,
    destination,
    2.6,
    elements.poses.landAway,
  );
  timeline
    .to(elements.shadow, { autoAlpha: 0, duration: 0.2 })
    .to(elements.rig, { autoAlpha: 0, duration: 0.2 }, "<");

  return timeline;
}
