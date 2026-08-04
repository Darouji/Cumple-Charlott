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

  setPose(elements.pose, "push-contact");
  gsap.set(elements.layer, { autoAlpha: 1 });
  gsap.set(elements.actor, {
    autoAlpha: 1,
    left: overview.actor.left,
    top: overview.actor.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    scale: overview.actor.scale,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.38, scale: 0.82 });
  gsap.set(elements.chest, {
    autoAlpha: 1,
    left: overview.chest.left,
    top: overview.chest.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: -1,
    scale: overview.chest.scale,
  });
  gsap.set(elements.chestShadow, {
    autoAlpha: 0.58,
    left: overview.chest.left,
    top: "58.2%",
    xPercent: -50,
    yPercent: -50,
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
    rotation: close.chest.rotation,
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
      { x: -2, rotation: -1.35, duration: 0.16, yoyo: true, repeat: 1 },
      1.03,
    )
    .to(elements.chestShadow, { x: -2, duration: 0.32 }, 1.03);

  timeline.addLabel("hipPush", 2.05);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.hipPreparation, {
    start: 2.05,
    frameDuration: 0.38,
  });
  addPoseSequence(timeline, elements.pose, fairyStorySequences.hipPush, {
    start: 3.57,
    frameDuration: 0.32,
  });
  timeline
    .to(elements.actor, { x: -7, duration: 0.75 }, 3.55)
    .to(
      elements.chest,
      { x: -5, rotation: -1.55, duration: 0.42, ease: "power3.out" },
      3.95,
    )
    .to(elements.chestShadow, { x: -5, scaleX: 0.98, duration: 0.42 }, 3.95);

  timeline.addLabel("changeSides", 5.15);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.takeoff, {
    start: 5.15,
    frameDuration: 0.36,
  });
  timeline
    .to(elements.actor, { top: "41%", x: 0, duration: 0.82, ease: "power2.out" }, 5.88)
    .to(elements.shadow, { autoAlpha: 0.1, scale: 0.58, duration: 0.68 }, 5.88);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.crossToLeft, {
    start: 6.72,
    frameDuration: 0.4,
  });
  timeline
    .to(
      elements.actor,
      {
        left: fairyStoryLayout.close.leftActor.left,
        top: fairyStoryLayout.close.leftActor.top,
        x: 0,
        duration: 1.35,
        ease: "power2.inOut",
      },
      6.82,
    )
    .to(elements.shadow, { autoAlpha: 0.45, scale: 1, duration: 0.5 }, 7.72);

  timeline.addLabel("pull", 8.35);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.pull, {
    start: 8.35,
    frameDuration: 0.34,
  });
  timeline
    .to(elements.actor, { x: -11, duration: 0.86, ease: "power3.out" }, 8.68)
    .to(
      elements.chest,
      { x: -12, rotation: -1.8, duration: 0.72, ease: "power3.out" },
      8.94,
    )
    .to(elements.chestShadow, { x: -12, duration: 0.72 }, 8.94);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.fall, {
    start: 9.83,
    frameDuration: 0.3,
  });
  timeline
    .to(
      elements.actor,
      { x: "-34%", top: "55%", duration: 0.36, ease: "power3.in" },
      9.83,
    )
    .to(elements.actor, { y: -5, duration: 0.11, yoyo: true, repeat: 4 }, 10.2)
    .to(elements.shadow, { scale: 1.16, autoAlpha: 0.54, duration: 0.24 }, 10.15);

  timeline.addLabel("firstMagic", 11.18);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.firstMagic, {
    start: 11.18,
    frameDuration: 0.44,
  });
  timeline
    .to(elements.actor, { left: "47%", top: "34%", x: 0, y: 0, duration: 1.05 }, 11.48)
    .to(elements.shadow, { autoAlpha: 0.11, scale: 0.62, duration: 0.7 }, 11.48)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.32 },
      { autoAlpha: 0.78, scale: 0.78, duration: 0.72 },
      12.32,
    )
    .to(elements.dust, { autoAlpha: 0, duration: 0.48 }, 13.1)
    .to(
      elements.chest,
      { x: -14, y: -2, rotation: -2.1, duration: 0.28, yoyo: true, repeat: 1 },
      12.67,
    );

  timeline
    .call(() => setPose(elements.pose, "magic-hopeful"), undefined, 13.25)
    .to(
      elements.actor,
      {
        left: fairyStoryLayout.close.leftActor.left,
        top: fairyStoryLayout.close.leftActor.top,
        x: 0,
        duration: 0.72,
      },
      13.5,
    )
    .to(elements.shadow, { autoAlpha: 0.45, scale: 1, duration: 0.45 }, 13.72)
    .call(() => setPose(elements.pose, "magic-pull"), undefined, 13.68)
    .to(elements.chest, { x: -17, duration: 0.52 }, 13.7)
    .to(elements.chestShadow, { x: -17, duration: 0.52 }, 13.7)
    .call(() => setPose(elements.pose, "magic-not-enough"), undefined, 14.25)
    .call(() => setPose(elements.pose, "magic-second-pouch"), undefined, 14.78)
    .to(elements.actor, { left: "50%", top: "31%", duration: 0.82 }, 14.62)
    .to(elements.shadow, { autoAlpha: 0.08, scale: 0.55, duration: 0.55 }, 14.62);

  timeline.addLabel("pouchAccident", 15.48);
  addPoseSequence(timeline, elements.pose, fairyStorySequences.pouchAccident, {
    start: 15.48,
    frameDuration: 0.37,
  });
  timeline
    .to(elements.actor, { y: -5, duration: 0.46, yoyo: true, repeat: 2 }, 15.48)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.3 },
      { autoAlpha: 1, scale: 1.5, duration: 1.0 },
      16.4,
    )
    .to(
      elements.chest,
      { x: -13, y: -2, rotation: 0.8, duration: 0.075, yoyo: true, repeat: 11 },
      16.55,
    )
    .to(elements.chest, { y: -13, scale: 1.025, duration: 0.85, ease: "power2.out" }, 17.34)
    .to(elements.chestShadow, { autoAlpha: 0.34, scale: 0.84, duration: 0.75 }, 17.34);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.finale, {
    start: 17.0,
    frameDuration: 0.4,
  });
  timeline
    .to(
      elements.actor,
      { left: "var(--fairy-final-x)", top: "31%", x: 0, y: 0, duration: 1.0 },
      17.68,
    )
    .fromTo(
      elements.burst,
      { autoAlpha: 0, scale: 0.2 },
      { autoAlpha: 1, scale: 1.48, duration: 0.7 },
      17.42,
    )
    .set([elements.chest, elements.chestShadow], { autoAlpha: 0 }, 18.08)
    .to(elements.burst, { autoAlpha: 0, scale: 2.1, duration: 1.0 }, 18.12)
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
      18.14,
    );

  return timeline;
}
