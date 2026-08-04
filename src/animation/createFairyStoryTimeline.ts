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
  readonly envelope: HTMLImageElement;
  readonly openEnvelope: HTMLImageElement;
  readonly letter: HTMLImageElement;
  readonly dust: HTMLElement;
  readonly burst: HTMLElement;
  readonly rabbit: HTMLImageElement;
}

interface FairyStoryOptions {
  readonly reducedMotion: boolean;
  readonly onComplete: () => void;
}

const hiddenStoryElements = (
  elements: FairyStoryElements,
): HTMLElement[] => [
  elements.openEnvelope,
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
    scale: overview.actor.scale,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.42, scale: 0.82 });
  gsap.set(elements.envelope, {
    autoAlpha: 1,
    left: overview.envelope.left,
    top: overview.envelope.top,
    xPercent: -50,
    yPercent: -50,
    rotation: -1.5,
    scale: overview.envelope.scale,
  });
  gsap.set([...hiddenStoryElements(elements), elements.rabbit], {
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
    scale: 1,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.42, scale: 1 });
  gsap.set(elements.envelope, {
    autoAlpha: 1,
    left: close.envelope.left,
    top: close.envelope.top,
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    rotation: close.envelope.rotation,
    scale: 1,
  });
  gsap.set(elements.rabbit, { autoAlpha: 0.96 });
  gsap.set(hiddenStoryElements(elements), { autoAlpha: 0 });
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
      .set(elements.actor, { left: "var(--fairy-final-x)", top: "31%", x: 0 }, 0.35)
      .to(elements.dust, { autoAlpha: 1, scale: 1.15, duration: 0.7 }, 0.4)
      .to(elements.burst, { autoAlpha: 1, scale: 1.3, duration: 0.5 }, 0.8)
      .set(elements.envelope, { autoAlpha: 0 }, 1.15)
      .set(elements.openEnvelope, { autoAlpha: 1 }, 1.15)
      .to(elements.letter, { autoAlpha: 1, duration: 0.6 }, 1.2);

    return timeline;
  }

  addPoseSequence(timeline, elements.pose, fairyStorySequences.handPush, {
    start: 0.35,
    frameDuration: 0.28,
  });
  timeline
    .to(elements.actor, { x: -6, duration: 0.9 }, 0.63)
    .to(elements.envelope, { x: -3, duration: 0.13, yoyo: true, repeat: 3 }, 0.82);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.hipPreparation, {
    start: 1.7,
    frameDuration: 0.34,
  });
  addPoseSequence(timeline, elements.pose, fairyStorySequences.hipPush, {
    start: 3.08,
    frameDuration: 0.29,
  });
  timeline
    .to(elements.actor, { x: -2, duration: 0.8 }, 3.08)
    .to(elements.envelope, { x: -4, duration: 0.16, yoyo: true, repeat: 3 }, 3.38);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.takeoff, {
    start: 4.65,
    frameDuration: 0.34,
  });
  timeline
    .to(elements.actor, { top: "40%", duration: 0.85, ease: "power2.out" }, 5.45)
    .to(elements.shadow, { autoAlpha: 0.12, scale: 0.62, duration: 0.7 }, 5.45);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.crossToLeft, {
    start: 6.15,
    frameDuration: 0.38,
  });
  timeline
    .to(elements.actor, { left: fairyStoryLayout.close.leftActor.left, top: "47.5%", x: 0, duration: 1.25 }, 6.35)
    .to(elements.shadow, { autoAlpha: 0.42, scale: 1, duration: 0.55 }, 7.05);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.pull, {
    start: 7.85,
    frameDuration: 0.31,
  });
  timeline
    .to(elements.actor, { x: -6, duration: 0.82 }, 8.16)
    .to(elements.envelope, { x: -8, duration: 0.72 }, 8.45);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.fall, {
    start: 9.25,
    frameDuration: 0.28,
  });
  timeline
    .to(elements.actor, { x: "-28%", top: "52%", duration: 0.34, ease: "power3.in" }, 9.25)
    .to(elements.actor, { y: -7, duration: 0.12, yoyo: true, repeat: 3 }, 9.72);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.firstMagic, {
    start: 10.7,
    frameDuration: 0.43,
  });
  timeline
    .to(elements.actor, { left: "47%", top: "34%", x: 0, y: 0, duration: 1.1 }, 11.05)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.35 },
      { autoAlpha: 0.82, scale: 0.78, duration: 0.75 },
      11.95,
    )
    .to(elements.dust, { autoAlpha: 0, duration: 0.5 }, 12.75)
    .to(elements.envelope, { x: -13, rotation: -2.2, duration: 0.32, yoyo: true, repeat: 1 }, 12.25);

  timeline.call(() => setPose(elements.pose, "magic-hopeful"), undefined, 12.85);
  timeline
    .to(elements.actor, { left: fairyStoryLayout.close.leftActor.left, top: "47.5%", x: 0, duration: 0.7 }, 13.25)
    .call(() => setPose(elements.pose, "magic-pull"), undefined, 13.35)
    .to(elements.envelope, { x: -17, duration: 0.55 }, 13.35)
    .call(() => setPose(elements.pose, "magic-not-enough"), undefined, 13.95)
    .call(() => setPose(elements.pose, "magic-second-pouch"), undefined, 14.5)
    .to(elements.actor, { left: "50%", top: "31%", duration: 0.85 }, 14.35);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.pouchAccident, {
    start: 15.25,
    frameDuration: 0.36,
  });
  timeline
    .to(elements.actor, { y: -6, duration: 0.48, yoyo: true, repeat: 2 }, 15.25)
    .fromTo(
      elements.dust,
      { autoAlpha: 0, scale: 0.35 },
      { autoAlpha: 1, scale: 1.55, duration: 1.05 },
      16.2,
    )
    .to(elements.envelope, { x: -12, y: -2, rotation: 1.5, duration: 0.075, yoyo: true, repeat: 13 }, 16.35)
    .to(elements.envelope, { y: -48, scale: 1.06, duration: 1.0, ease: "power2.out" }, 17.15);

  addPoseSequence(timeline, elements.pose, fairyStorySequences.finale, {
    start: 16.82,
    frameDuration: 0.38,
  });
  timeline
    .to(
      elements.actor,
      { left: "var(--fairy-final-x)", top: "31%", y: 0, duration: 1.05 },
      17.55,
    )
    .fromTo(
      elements.burst,
      { autoAlpha: 0, scale: 0.2 },
      { autoAlpha: 1, scale: 1.5, duration: 0.72 },
      17.15,
    )
    .to(elements.burst, { autoAlpha: 0, scale: 2.15, duration: 1.05 }, 17.87)
    .set(elements.envelope, { autoAlpha: 0 }, 18.05)
    .set(elements.openEnvelope, { autoAlpha: 1, y: -48, scale: 1.06 }, 18.05)
    .to(elements.openEnvelope, { rotationX: -7, duration: 0.45 }, 18.05)
    .fromTo(
      elements.letter,
      { autoAlpha: 0, left: "50%", top: "52%", scale: 0.34, y: 0 },
      {
        autoAlpha: 1,
        left: "50%",
        top: "40%",
        scale: 0.72,
        y: -24,
        duration: 1.45,
        ease: "power3.out",
      },
      18.35,
    );

  return timeline;
}
