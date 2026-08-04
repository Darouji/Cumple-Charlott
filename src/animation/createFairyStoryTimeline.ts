import gsap from "gsap";

import { addPoseSequence, setPose } from "./addPoseSequence";
import {
  fairyStoryLayout,
  fairyStorySequences,
} from "../config/fairyStory.config";

export interface FairyStoryElements {
  readonly layer: HTMLElement;
  readonly actor: HTMLElement;
  readonly pose: HTMLImageElement;
  readonly shadow: HTMLElement;
  readonly chest: HTMLImageElement;
  readonly chestShadow: HTMLElement;
  readonly letter: HTMLImageElement;
  readonly dust: HTMLElement;
  readonly burst: HTMLElement;
  readonly rabbit: HTMLImageElement;
}

interface FairyStoryOptions {
  readonly reducedMotion: boolean;
  readonly onComplete: () => void;
}

const hiddenRevealElements = (
  elements: FairyStoryElements,
): HTMLElement[] => [
  elements.letter,
  elements.dust,
  elements.burst,
];

export function setFairyStoryOverview(
  elements: FairyStoryElements,
): void {
  const { overview } = fairyStoryLayout;

  setPose(elements.pose, "magic-idea");
  gsap.set(elements.layer, { autoAlpha: 1 });
  gsap.set(elements.actor, {
    autoAlpha: 1,
    left: overview.actor.left,
    top: overview.actor.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: overview.actor.scale,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.34, x: 0, y: 0, scale: 0.72 });
  gsap.set(elements.chest, {
    autoAlpha: 1,
    left: overview.chest.left,
    top: overview.chest.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: overview.chest.scale,
  });
  gsap.set(elements.chestShadow, {
    autoAlpha: 0.58,
    left: overview.chest.left,
    top: "58.2%",
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: overview.chest.scale,
  });
  gsap.set([...hiddenRevealElements(elements), elements.rabbit], {
    autoAlpha: 0,
  });
}

export function setFairyStoryOpening(
  elements: FairyStoryElements,
): void {
  const { close } = fairyStoryLayout;

  setPose(elements.pose, "push-reach");
  gsap.set(elements.layer, { autoAlpha: 1 });
  gsap.set(elements.actor, {
    autoAlpha: 1,
    left: close.rightActor.left,
    top: close.rightActor.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.46, x: 0, y: 0, scale: 1 });
  gsap.set(elements.chest, {
    autoAlpha: 1,
    left: close.chest.left,
    top: close.chest.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  });
  gsap.set(elements.chestShadow, {
    autoAlpha: 0.72,
    left: close.chest.left,
    top: "59.3%",
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
  });
  gsap.set(elements.rabbit, { autoAlpha: 0.94 });
  gsap.set([elements.letter, elements.dust, elements.burst], {
    autoAlpha: 0,
  });
}

export function createFairyStoryTimeline(
  elements: FairyStoryElements,
  options: FairyStoryOptions,
): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: options.onComplete,
  });

  setFairyStoryOpening(elements);

  if (options.reducedMotion) {
    timeline
      .call(() => setPose(elements.pose, "final-wave"), undefined, 0.35)
      .set(
        elements.actor,
        { left: "var(--fairy-final-x)", top: "31%", x: 0, y: 0 },
        0.35,
      )
      .to(elements.dust, { autoAlpha: 1, scale: 1.1, duration: 0.65 }, 0.4)
      .to(elements.burst, { autoAlpha: 1, scale: 1.3, duration: 0.45 }, 0.75)
      .set([elements.chest, elements.chestShadow], { autoAlpha: 0 }, 1.05)
      .fromTo(
        elements.letter,
        { autoAlpha: 0, left: "48%", top: "51%", scale: 0.22, y: 0 },
        {
          autoAlpha: 1,
          left: "50%",
          top: "40%",
          scale: 0.72,
          y: -24,
          duration: 0.75,
          ease: "power3.out",
        },
        1.05,
      );

    return timeline;
  }

  timeline.addLabel("handPush", 0.4);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.handPush, {
    start: 0.4,
    frameDuration: 0.32,
  });
  timeline
    .to(elements.actor, { x: -5, duration: 0.92 }, 0.72)
    .to(
      elements.chest,
      { x: -2, rotation: -0.35, duration: 0.14, yoyo: true, repeat: 1 },
      1.03,
    )
    .to(elements.chestShadow, { x: -2, duration: 0.28 }, 1.03)
    .call(() => setPose(elements.pose, "recover-breath"), undefined, 1.82)
    .to(elements.actor, { x: 0, duration: 0.42, ease: "power2.out" }, 1.82)
    .to(elements.chest, { x: 0, rotation: 0, duration: 0.34 }, 1.82)
    .to(elements.chestShadow, { x: 0, duration: 0.34 }, 1.82)
    .call(() => setPose(elements.pose, "inspect-ground"), undefined, 2.42)
    .to(elements.actor, { y: 3, duration: 0.45, ease: "sine.inOut" }, 2.42)
    .to({}, { duration: 0.65 });

  timeline.addLabel("changeSides", 3.45);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.takeoff, {
    start: 3.45,
    frameDuration: 0.34,
  });
  timeline
    .to(
      elements.actor,
      { top: "40%", x: 0, y: 0, duration: 0.78, ease: "power2.out" },
      4.16,
    )
    .to(elements.shadow, { autoAlpha: 0.09, scale: 0.56, duration: 0.64 }, 4.16);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.crossToLeft, {
    start: 4.86,
    frameDuration: 0.38,
  });
  timeline
    .to(
      elements.actor,
      {
        left: fairyStoryLayout.close.leftActor.left,
        top: "43%",
        x: 0,
        duration: 1.16,
        ease: "power2.inOut",
      },
      4.96,
    )
    .to(
      elements.actor,
      {
        top: fairyStoryLayout.close.leftActor.top,
        duration: 0.58,
        ease: "power2.in",
      },
      6.02,
    )
    .to(elements.shadow, { autoAlpha: 0.45, scale: 1, duration: 0.48 }, 6.12);

  timeline.addLabel("pull", 6.62);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.pull, {
    start: 6.62,
    frameDuration: 0.34,
  });
  timeline
    .to(elements.actor, { x: -11, duration: 0.86, ease: "power3.out" }, 6.95)
    .to(
      elements.chest,
      { x: -12, rotation: 0, duration: 0.72, ease: "power3.out" },
      7.21,
    )
    .to(elements.chestShadow, { x: -12, duration: 0.72 }, 7.21);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.fall, {
    start: 8.1,
    frameDuration: 0.3,
  });
  timeline
    .to(
      elements.actor,
      { x: "-34%", top: "55%", duration: 0.36, ease: "power3.in" },
      8.1,
    )
    .to(elements.actor, { y: -5, duration: 0.11, yoyo: true, repeat: 4 }, 8.47)
    .to(elements.shadow, { scale: 1.16, autoAlpha: 0.54, duration: 0.24 }, 8.42);

  timeline.addLabel("firstMagic", 9.45);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.firstMagic, {
    start: 9.45,
    frameDuration: 0.44,
  });
  timeline
    .to(elements.actor, { left: "47%", top: "34%", x: 0, y: 0, duration: 1.05 }, 9.75)
    .to(elements.shadow, { autoAlpha: 0.11, scale: 0.62, duration: 0.7 }, 9.75)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.32 },
      { autoAlpha: 0.78, scale: 0.78, duration: 0.72 },
      10.59,
    )
    .to(elements.dust, { autoAlpha: 0, duration: 0.48 }, 11.37)
    .to(
      elements.chest,
      { x: -14, y: -2, rotation: -0.4, duration: 0.28, yoyo: true, repeat: 1 },
      10.94,
    );

  timeline
    .call(() => setPose(elements.pose, "magic-hopeful"), undefined, 11.52)
    .to(
      elements.actor,
      {
        left: fairyStoryLayout.close.leftActor.left,
        top: fairyStoryLayout.close.leftActor.top,
        x: 0,
        duration: 0.72,
      },
      11.77,
    )
    .to(elements.shadow, { autoAlpha: 0.45, scale: 1, duration: 0.45 }, 11.99)
    .call(() => setPose(elements.pose, "magic-pull"), undefined, 11.95)
    .to(elements.chest, { x: -17, rotation: 0, duration: 0.52 }, 11.97)
    .to(elements.chestShadow, { x: -17, duration: 0.52 }, 11.97)
    .call(() => setPose(elements.pose, "magic-not-enough"), undefined, 12.52)
    .call(() => setPose(elements.pose, "magic-second-pouch"), undefined, 13.05)
    .to(elements.actor, { left: "50%", top: "31%", duration: 0.82 }, 12.89)
    .to(elements.shadow, { autoAlpha: 0.08, scale: 0.55, duration: 0.55 }, 12.89);

  timeline.addLabel("pouchAccident", 13.75);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.pouchAccident, {
    start: 13.75,
    frameDuration: 0.37,
  });
  timeline
    .to(elements.actor, { y: -5, duration: 0.46, yoyo: true, repeat: 2 }, 13.75)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.3 },
      { autoAlpha: 1, scale: 1.5, duration: 1.0 },
      14.67,
    )
    .to(
      elements.chest,
      { x: -13, y: -2, rotation: 0.45, duration: 0.075, yoyo: true, repeat: 11 },
      14.82,
    )
    .to(elements.chest, { y: -13, rotation: 0, scale: 1.025, duration: 0.85, ease: "power2.out" }, 15.61)
    .to(elements.chestShadow, { autoAlpha: 0.34, scale: 0.84, duration: 0.75 }, 15.61);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.finale, {
    start: 15.27,
    frameDuration: 0.4,
  });
  timeline
    .to(
      elements.actor,
      { left: "var(--fairy-final-x)", top: "31%", x: 0, y: 0, duration: 1.0 },
      15.95,
    )
    .fromTo(
      elements.burst,
      { autoAlpha: 0, scale: 0.2 },
      { autoAlpha: 1, scale: 1.48, duration: 0.7 },
      15.69,
    )
    .set([elements.chest, elements.chestShadow], { autoAlpha: 0 }, 16.35)
    .to(elements.burst, { autoAlpha: 0, scale: 2.1, duration: 1.0 }, 16.39)
    .fromTo(
      elements.letter,
      {
        autoAlpha: 0,
        left: "48%",
        top: "51.5%",
        scale: 0.22,
        y: 0,
        rotation: -2,
      },
      {
        autoAlpha: 1,
        left: "50%",
        top: "40%",
        scale: 0.72,
        y: -24,
        rotation: 0,
        duration: 1.4,
        ease: "power3.out",
      },
      16.41,
    );

  return timeline;
}
