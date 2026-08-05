import gsap from "gsap";

import { setPose } from "./addPoseSequence";
import type { ExperienceSoundCue } from "../audio/experienceAudio";
import chestClosed from "../assets/props/chest-front-closed.webp";
import chestOpen from "../assets/props/chest-front-open.webp";

const finalFairyScale = 2.5012;
import {
  fairyStoryLayout,
  fairyStorySequences,
  type FairyStoryPose,
  type FairyStoryResponsivePoint,
} from "../config/fairyStory.config";

export interface FairyStoryElements {
  readonly layer: HTMLElement;
  readonly actor: HTMLElement;
  readonly pose: HTMLImageElement;
  readonly poseGhost: HTMLImageElement;
  readonly shadow: HTMLElement;
  readonly chest: HTMLImageElement;
  readonly chestShadow: HTMLElement;
  readonly chestGlow: HTMLElement;
  readonly ideaSpark: HTMLElement;
  readonly sprinkle: HTMLElement;
  readonly dust: HTMLElement;
  readonly burst: HTMLElement;
  readonly rabbit: HTMLImageElement;
}

interface FairyStoryOptions {
  readonly reducedMotion: boolean;
  readonly onSoundCue: (cue: ExperienceSoundCue) => void;
  readonly onComplete: () => void;
}

interface PixelPoint {
  readonly x: number;
  readonly y: number;
}

const poseProperties = [
  "--pose-x",
  "--pose-y",
  "--pose-facing",
  "--pose-rotation",
] as const;

function isWideLayer(layer: HTMLElement): boolean {
  const bounds = layer.getBoundingClientRect();
  const width = bounds.width || window.innerWidth;
  const height = bounds.height || window.innerHeight;

  return width / Math.max(height, 1) >= 4 / 3;
}

function selectPoint(
  layer: HTMLElement,
  point: FairyStoryResponsivePoint,
): { readonly x: number; readonly y: number } {
  return isWideLayer(layer) ? point.wide : point.portrait;
}

function resolvePoint(
  layer: HTMLElement,
  point: FairyStoryResponsivePoint,
): PixelPoint {
  const bounds = layer.getBoundingClientRect();
  const width = bounds.width || window.innerWidth;
  const height = bounds.height || window.innerHeight;
  const selected = selectPoint(layer, point);

  return {
    x: (width * selected.x) / 100,
    y: (height * selected.y) / 100,
  };
}

function copyPosePresentation(
  source: HTMLImageElement,
  destination: HTMLImageElement,
): void {
  destination.src = source.src;

  for (const property of poseProperties) {
    destination.style.setProperty(
      property,
      source.style.getPropertyValue(property),
    );
  }
}

function setPoseImmediately(
  elements: FairyStoryElements,
  pose: FairyStoryPose,
): void {
  gsap.killTweensOf([elements.pose, elements.poseGhost]);
  setPose(elements.pose, pose);
  gsap.set(elements.pose, { autoAlpha: 1 });
  gsap.set(elements.poseGhost, { autoAlpha: 0 });
}

function crossfadePose(
  elements: FairyStoryElements,
  pose: FairyStoryPose,
  duration = 0.22,
): void {
  gsap.killTweensOf([elements.pose, elements.poseGhost]);
  copyPosePresentation(elements.pose, elements.poseGhost);
  gsap.set(elements.poseGhost, { autoAlpha: 1 });
  setPose(elements.pose, pose);
  gsap.set(elements.pose, { autoAlpha: 0 });
  gsap.to(elements.pose, {
    autoAlpha: 1,
    duration,
    ease: "power1.out",
    overwrite: true,
  });
  gsap.to(elements.poseGhost, {
    autoAlpha: 0,
    duration,
    ease: "power1.out",
    overwrite: true,
  });
}

function addCrossfadeSequence(
  timeline: gsap.core.Timeline,
  elements: FairyStoryElements,
  poses: readonly FairyStoryPose[],
  start: number,
  frameDuration: number,
  fadeDuration = 0.22,
): void {
  poses.forEach((pose, index) => {
    timeline.call(
      () => crossfadePose(elements, pose, fadeDuration),
      undefined,
      start + index * frameDuration,
    );
  });
}

function setActorPoint(
  elements: FairyStoryElements,
  point: PixelPoint,
  scale: number,
): void {
  gsap.set(elements.actor, {
    autoAlpha: 1,
    left: 0,
    top: 0,
    xPercent: -50,
    yPercent: -50,
    x: point.x,
    y: point.y,
    rotation: 0,
    scale,
  });
}

function setFloatingPoint(
  element: HTMLElement,
  point: PixelPoint,
): void {
  gsap.set(element, {
    left: 0,
    top: 0,
    xPercent: -50,
    yPercent: -50,
    x: point.x,
    y: point.y,
  });
}

function showClosedChest(elements: FairyStoryElements): void {
  elements.chest.src = chestClosed;
}

function showOpenChest(elements: FairyStoryElements): void {
  elements.chest.src = chestOpen;
}

export function setFairyStoryOpening(
  elements: FairyStoryElements,
): void {
  const actorPoint = resolvePoint(elements.layer, fairyStoryLayout.close.actor);
  const chestPoint = selectPoint(elements.layer, fairyStoryLayout.close.chest);

  showClosedChest(elements);
  setPoseImmediately(elements, "magic-idea");
  gsap.set(elements.layer, { autoAlpha: 1 });
  setActorPoint(elements, actorPoint, 1);
  gsap.set(elements.shadow, { autoAlpha: 0.42, x: 0, y: 0, scale: 1 });
  gsap.set(elements.chest, {
    autoAlpha: 1,
    left: `${chestPoint.x}%`,
    top: `${chestPoint.y}%`,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  });
  gsap.set(elements.chestShadow, {
    autoAlpha: 0.6,
    left: `${chestPoint.x}%`,
    top: `${chestPoint.y + 5.6}%`,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  });
  gsap.set(elements.chestGlow, {
    autoAlpha: 0,
    left: `${chestPoint.x}%`,
    top: `${chestPoint.y}%`,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: 0.62,
  });
  gsap.set(elements.ideaSpark, {
    autoAlpha: 0,
    left: 0,
    top: 0,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: 0.2,
    rotation: -35,
  });
  gsap.set(elements.rabbit, { autoAlpha: 0.94 });
  gsap.set([elements.sprinkle, elements.dust, elements.burst], {
    autoAlpha: 0,
  });
}

export function createFairyStoryFinalIdle(
  elements: FairyStoryElements,
): gsap.core.Tween {
  const finalPoint = resolvePoint(elements.layer, fairyStoryLayout.final.actor);

  setPoseImmediately(elements, "final-wave");
  gsap.set(elements.layer, { autoAlpha: 1 });
  setActorPoint(elements, finalPoint, finalFairyScale);
  gsap.set(elements.actor, { rotation: -0.5 });
  gsap.set(elements.shadow, { autoAlpha: 0.04, scale: 0.44 });
  gsap.set(elements.rabbit, { autoAlpha: 0.94 });
  gsap.set(
    [
      elements.chest,
      elements.chestShadow,
      elements.chestGlow,
      elements.ideaSpark,
      elements.sprinkle,
      elements.dust,
      elements.burst,
    ],
    { autoAlpha: 0 },
  );

  return gsap.to(elements.actor, {
    y: finalPoint.y - 6,
    rotation: 0.55,
    duration: 1.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}

export function createFairyStoryTimeline(
  elements: FairyStoryElements,
  options: FairyStoryOptions,
): gsap.core.Timeline {
  const closePoint = resolvePoint(elements.layer, fairyStoryLayout.close.actor);
  const liftPoint = resolvePoint(elements.layer, fairyStoryLayout.lift.actor);
  const airPoint = resolvePoint(elements.layer, fairyStoryLayout.air.actor);
  const waitPoint = resolvePoint(elements.layer, fairyStoryLayout.wait.actor);
  const openingIdeaPoint = resolvePoint(
    elements.layer,
    fairyStoryLayout.openingIdea,
  );
  const waitIdeaPoint = resolvePoint(elements.layer, fairyStoryLayout.wait.idea);
  const finalPoint = resolvePoint(elements.layer, fairyStoryLayout.final.actor);
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: options.onComplete,
  });

  setFairyStoryOpening(elements);

  if (options.reducedMotion) {
    timeline
      .call(() => options.onSoundCue("chest-open"), undefined, 0.55)
      .call(() => options.onSoundCue("magic-burst"), undefined, 0.65)
      .call(() => showOpenChest(elements), undefined, 0.55)
      .fromTo(
        elements.burst,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35 },
        0.65,
      )
      .call(() => setPoseImmediately(elements, "final-wave"), undefined, 1.05)
      .set(
        elements.actor,
        {
          x: finalPoint.x,
          y: finalPoint.y,
          scale: finalFairyScale,
        },
        1.05,
      )
      .to(
        [elements.chest, elements.chestShadow],
        { autoAlpha: 0, duration: 0.35 },
        1.25,
      )
      .to(elements.burst, { autoAlpha: 0, duration: 0.4 }, 1.35);

    return timeline;
  }

  timeline
    .call(() => options.onSoundCue("fairy-idea"), undefined, 1.08)
    .call(() => options.onSoundCue("fairy-takeoff"), undefined, 2.18)
    .call(() => options.onSoundCue("fairy-flight"), undefined, 3.43)
    .call(() => options.onSoundCue("magic-sprinkle-soft"), undefined, 6.25)
    .call(() => options.onSoundCue("chest-glow-soft"), undefined, 6.28)
    .call(() => options.onSoundCue("chest-rattle-soft"), undefined, 6.55)
    .call(() => options.onSoundCue("fairy-idea"), undefined, 12.19)
    .call(() => options.onSoundCue("fairy-flight"), undefined, 13.15)
    .call(() => options.onSoundCue("pouch-rustle"), undefined, 15.35)
    .call(() => options.onSoundCue("pouch-slip"), undefined, 16.08)
    .call(() => options.onSoundCue("magic-spill"), undefined, 17.35)
    .call(() => options.onSoundCue("chest-glow-strong"), undefined, 17.4)
    .call(() => options.onSoundCue("chest-rumble-heavy"), undefined, 17.55)
    .call(() => options.onSoundCue("chest-open"), undefined, 19.05)
    .call(() => options.onSoundCue("magic-burst"), undefined, 19.25)
    .call(() => options.onSoundCue("fairy-flight"), undefined, 20.55);

  timeline
    .to(
      elements.actor,
      {
        x: closePoint.x,
        y: closePoint.y + 1,
        rotation: -0.35,
        duration: 0.48,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
      },
      0.12,
    )
    .call(
      () => setFloatingPoint(elements.ideaSpark, openingIdeaPoint),
      undefined,
      1.02,
    )
    .fromTo(
      elements.ideaSpark,
      { autoAlpha: 0, scale: 0.2, rotation: -35 },
      {
        autoAlpha: 1,
        scale: 1.15,
        rotation: 18,
        duration: 0.42,
        ease: "back.out(2.5)",
      },
      1.08,
    )
    .to(
      elements.ideaSpark,
      { autoAlpha: 0, scale: 0.75, duration: 0.5 },
      1.55,
    )
    .call(() => crossfadePose(elements, "takeoff-low"), undefined, 2.05)
    .to(
      elements.actor,
      {
        x: closePoint.x,
        y: liftPoint.y,
        rotation: 0,
        duration: 1.25,
        ease: "power2.out",
      },
      2.18,
    )
    .to(elements.shadow, { autoAlpha: 0.07, scale: 0.5, duration: 1.1 }, 2.18)
    .call(() => crossfadePose(elements, "fly-across"), undefined, 3.4)
    .to(
      elements.actor,
      {
        x: airPoint.x,
        y: airPoint.y,
        duration: 1.25,
        ease: "power2.inOut",
      },
      3.43,
    )
    .call(() => crossfadePose(elements, "magic-hopeful"), undefined, 4.62);

  addCrossfadeSequence(
    timeline,
    elements,
    fairyStorySequences.measuredMagic,
    4.95,
    0.68,
  );
  timeline
    .fromTo(
      elements.sprinkle,
      { autoAlpha: 0, scaleX: 0.5, scaleY: 0.22, y: -18 },
      {
        autoAlpha: 0.94,
        scaleX: 0.92,
        scaleY: 0.92,
        y: 0,
        duration: 0.82,
        ease: "power2.out",
      },
      6.25,
    )
    .to(elements.sprinkle, { autoAlpha: 0, y: 18, duration: 0.9 }, 7.02)
    .to(elements.chestGlow, { autoAlpha: 0.32, scale: 0.82, duration: 0.72 }, 6.28)
    .to(
      elements.chest,
      {
        x: -2.5,
        rotation: -0.8,
        duration: 0.11,
        repeat: 5,
        yoyo: true,
        ease: "sine.inOut",
      },
      6.55,
    )
    .set(elements.chest, { x: 0, rotation: 0 }, 7.22)
    .to(elements.chestGlow, { autoAlpha: 0, duration: 0.8 }, 6.95)
    .call(() => crossfadePose(elements, "magic-hopeful"), undefined, 7.2)
    .to(
      elements.actor,
      {
        x: waitPoint.x,
        y: waitPoint.y,
        rotation: 0,
        duration: 1.2,
        ease: "power2.inOut",
      },
      7.25,
    )
    .to(
      elements.actor,
      {
        y: waitPoint.y - 5,
        duration: 1.1,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut",
      },
      8.5,
    )
    .call(() => crossfadePose(elements, "magic-not-enough"), undefined, 11)
    .to(
      elements.actor,
      {
        x: waitPoint.x,
        y: waitPoint.y + 3,
        rotation: -1.8,
        duration: 0.65,
        ease: "sine.inOut",
      },
      11,
    )
    .to(
      elements.actor,
      {
        x: waitPoint.x,
        y: waitPoint.y - 1,
        rotation: 0.4,
        duration: 0.5,
        ease: "back.out(2)",
      },
      12.15,
    )
    .call(
      () => setFloatingPoint(elements.ideaSpark, waitIdeaPoint),
      undefined,
      12.1,
    )
    .fromTo(
      elements.ideaSpark,
      { autoAlpha: 0, scale: 0.18, rotation: -40 },
      {
        autoAlpha: 1,
        scale: 1.28,
        rotation: 20,
        duration: 0.48,
        ease: "back.out(2.6)",
      },
      12.19,
    )
    .to(
      elements.ideaSpark,
      { autoAlpha: 0, scale: 0.8, duration: 0.55 },
      12.73,
    )
    .call(() => crossfadePose(elements, "fly-across"), undefined, 13.1)
    .to(
      elements.actor,
      {
        x: airPoint.x,
        y: airPoint.y,
        rotation: 0,
        duration: 1.4,
        ease: "power2.inOut",
      },
      13.15,
    )
    .call(() => crossfadePose(elements, "magic-hopeful"), undefined, 14.5)
    .call(
      () => crossfadePose(elements, "magic-second-pouch", 0.28),
      undefined,
      14.85,
    );

  addCrossfadeSequence(
    timeline,
    elements,
    fairyStorySequences.pouchAccident,
    15.35,
    0.72,
    0.24,
  );
  timeline
    .fromTo(
      elements.sprinkle,
      { autoAlpha: 0, scaleX: 0.62, scaleY: 0.3, y: -22 },
      {
        autoAlpha: 1,
        scaleX: 1.15,
        scaleY: 1.55,
        y: 28,
        duration: 1.28,
        ease: "power2.in",
      },
      16.08,
    )
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.28, y: -28 },
      {
        autoAlpha: 0.98,
        scale: 1.42,
        y: 5,
        duration: 1.18,
        ease: "power3.out",
      },
      17.35,
    )
    .to(elements.chestGlow, { autoAlpha: 0.96, scale: 1.12, duration: 1.1 }, 17.4)
    .to(
      elements.chest,
      {
        x: -4,
        rotation: -1.2,
        duration: 0.09,
        repeat: 7,
        yoyo: true,
        ease: "sine.inOut",
      },
      17.55,
    )
    .to(
      elements.chest,
      {
        x: 7,
        rotation: 2,
        duration: 0.075,
        repeat: 9,
        yoyo: true,
        ease: "sine.inOut",
      },
      18.27,
    )
    .set(elements.chest, { x: 0, rotation: 0 }, 19.04)
    .call(() => showOpenChest(elements), undefined, 19.05)
    .fromTo(
      elements.chest,
      { scale: 0.98, y: 3 },
      { scale: 1.04, y: -2, duration: 0.32, ease: "back.out(2)" },
      19.05,
    );

  addCrossfadeSequence(
    timeline,
    elements,
    fairyStorySequences.finaleReaction,
    18.85,
    0.55,
    0.2,
  );
  timeline
    .fromTo(
      elements.burst,
      { autoAlpha: 0, scale: 0.82 },
      { autoAlpha: 1, scale: 1, duration: 0.42, ease: "power3.out" },
      19.25,
    )
    .to(elements.burst, { autoAlpha: 1, scale: 1.05, duration: 1.1 }, 19.67)
    .to(
      [elements.sprinkle, elements.dust],
      { autoAlpha: 0, duration: 0.6 },
      20.05,
    )
    .to(elements.burst, { autoAlpha: 0, scale: 1.2, duration: 0.75 }, 20.77)
    .to(
      [elements.chest, elements.chestShadow, elements.chestGlow],
      { autoAlpha: 0, duration: 0.85 },
      21.12,
    )
    .call(() => crossfadePose(elements, "fly-across"), undefined, 20.55)
    .to(
      elements.actor,
      {
        x: finalPoint.x,
        y: finalPoint.y,
        rotation: -0.5,
        scale: finalFairyScale,
        duration: 1.7,
        ease: "power2.inOut",
      },
      20.55,
    )
    .call(() => crossfadePose(elements, "final-wave"), undefined, 21.58)
    .to({}, { duration: 0.2 }, 22.35);

  return timeline;
}
