import gsap from "gsap";

import {
  fairyStoryPoses,
  type FairyStoryPose,
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
}

interface FairyStoryOptions {
  readonly reducedMotion: boolean;
  readonly onComplete: () => void;
}

function displayPose(
  image: HTMLImageElement,
  pose: FairyStoryPose,
): void {
  const poseConfig = fairyStoryPoses[pose];

  image.src = poseConfig.source;
  gsap.set(image, {
    scale: poseConfig.scale,
    transformOrigin: "50% 100%",
  });
}

export function setFairyStoryOpening(
  elements: FairyStoryElements,
): void {
  displayPose(elements.pose, "pushPrep");
  gsap.set(elements.layer, { autoAlpha: 1 });
  gsap.set(elements.actor, {
    autoAlpha: 1,
    left: "70%",
    top: "53%",
    xPercent: -50,
    yPercent: -50,
  });
  gsap.set(elements.shadow, { autoAlpha: 0.48, scale: 1 });
  gsap.set(elements.envelope, {
    autoAlpha: 1,
    left: "49%",
    top: "57%",
    xPercent: -50,
    yPercent: -50,
    rotation: -2,
    scale: 1,
  });
  gsap.set(
    [elements.openEnvelope, elements.letter, elements.dust, elements.burst],
    { autoAlpha: 0 },
  );
}

export function createFairyStoryTimeline(
  elements: FairyStoryElements,
  options: FairyStoryOptions,
): gsap.core.Timeline {
  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: options.onComplete,
  });
  const pose = (name: FairyStoryPose, at?: gsap.Position) => {
    timeline.call(() => displayPose(elements.pose, name), undefined, at);
  };

  setFairyStoryOpening(elements);

  if (options.reducedMotion) {
    pose("magicBurstReact", 0.4);
    timeline
      .to(elements.dust, { autoAlpha: 1, scale: 1.2, duration: 0.7 }, 0.4)
      .to(elements.burst, { autoAlpha: 1, scale: 1.3, duration: 0.5 }, 0.8)
      .set(elements.envelope, { autoAlpha: 0 }, 1.1)
      .set(elements.openEnvelope, { autoAlpha: 1 }, 1.1)
      .to(elements.letter, { autoAlpha: 1, duration: 0.6 }, 1.15);

    return timeline;
  }

  timeline.addLabel("push", 0.7);
  pose("pushStrain", "push");
  timeline
    .to(elements.actor, { left: "67.5%", duration: 0.8 }, "push")
    .to(elements.shadow, { scaleX: 0.9, duration: 0.8 }, "push")
    .to(elements.envelope, { x: -3, duration: 0.15, yoyo: true, repeat: 5 }, "push+=0.25");
  pose("pushPrep", "push+=1.1");
  pose("pushStrain", "push+=1.65");
  timeline.to(elements.actor, { left: "66.5%", duration: 0.75 }, "push+=1.65");
  pose("liftFail", "push+=2.6");
  timeline.to(elements.actor, { top: "55%", duration: 0.45 }, "push+=2.6");

  timeline.addLabel("inspect", "push+=3.55");
  pose("hoverInspect", "inspect");
  timeline
    .to(elements.actor, { left: "63%", top: "39%", duration: 1.05 }, "inspect")
    .to(elements.shadow, { autoAlpha: 0.12, scale: 0.62, duration: 0.8 }, "inspect")
    .to(elements.actor, { y: -8, duration: 0.55, yoyo: true, repeat: 2 }, "inspect+=1.05");

  timeline.addLabel("pull", "inspect+=2.85");
  pose("pullPrep", "pull");
  timeline
    .to(elements.actor, { left: "32%", top: "53%", y: 0, duration: 1.1 }, "pull")
    .to(elements.shadow, { autoAlpha: 0.48, scale: 1, duration: 0.65 }, "pull+=0.45");
  pose("pullStrain", "pull+=1.2");
  timeline
    .to(elements.actor, { left: "29%", duration: 0.85 }, "pull+=1.2")
    .to(elements.envelope, { left: "48.7%", duration: 0.85 }, "pull+=1.2");
  pose("gripSlip", "pull+=2.25");
  pose("fallBack", "pull+=2.55");
  timeline
    .to(elements.actor, { left: "24%", top: "57%", duration: 0.42, ease: "power3.in" }, "pull+=2.55")
    .to(elements.actor, { y: -7, duration: 0.12, yoyo: true, repeat: 3 }, "pull+=2.98");
  pose("seatedFrustrated", "pull+=3.55");

  timeline.addLabel("firstMagic", "pull+=4.65");
  pose("decidesMagic", "firstMagic");
  timeline.to(elements.actor, { left: "34%", top: "43%", y: 0, duration: 0.9 }, "firstMagic");
  pose("retrievePouch", "firstMagic+=1.05");
  timeline.to(elements.actor, { left: "47%", top: "34%", duration: 0.9 }, "firstMagic+=1.05");
  pose("measureDust", "firstMagic+=2.1");
  pose("sprinkleDust", "firstMagic+=3.05");
  timeline
    .fromTo(elements.dust, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 0.85, scale: 0.8, duration: 0.85 }, "firstMagic+=3.05")
    .to(elements.dust, { autoAlpha: 0, duration: 0.6 }, "firstMagic+=4.0")
    .to(elements.envelope, { x: -8, rotation: -1, duration: 0.35, yoyo: true, repeat: 1 }, "firstMagic+=3.55");
  pose("hopefulCheck", "firstMagic+=4.15");

  timeline.addLabel("accident", "firstMagic+=5.35");
  pose("pouchSecondAttempt", "accident");
  timeline.to(elements.actor, { left: "51%", top: "31%", duration: 0.7 }, "accident");
  pose("pouchRelease", "accident+=0.85");
  pose("reachForPouch", "accident+=1.35");
  timeline.to(elements.actor, { top: "38%", duration: 0.55, ease: "power2.in" }, "accident+=1.35");
  pose("magicBurstReact", "accident+=1.95");
  timeline
    .fromTo(elements.dust, { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1.5, duration: 1.05 }, "accident+=1.75")
    .to(elements.envelope, { x: 5, y: -2, rotation: 2, duration: 0.075, yoyo: true, repeat: 13 }, "accident+=2.0")
    .to(elements.envelope, { y: -52, scale: 1.08, duration: 1.1, ease: "power2.out" }, "accident+=2.8")
    .fromTo(elements.burst, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1.45, duration: 0.7 }, "accident+=3.0")
    .to(elements.burst, { autoAlpha: 0, scale: 2.1, duration: 1.05 }, "accident+=3.7")
    .set(elements.envelope, { autoAlpha: 0 }, "accident+=3.65")
    .set(elements.openEnvelope, { autoAlpha: 1, y: -52, scale: 1.08 }, "accident+=3.65")
    .to(elements.openEnvelope, { rotationX: -7, duration: 0.45 }, "accident+=3.65")
    .fromTo(
      elements.letter,
      { autoAlpha: 0, left: "49%", top: "54%", scale: 0.35, y: 0 },
      { autoAlpha: 1, left: "50%", top: "42%", scale: 0.72, y: -25, duration: 1.45, ease: "power3.out" },
      "accident+=4.0",
    );
  pose("finalGreeting", "accident+=4.35");
  timeline.to(elements.actor, { left: "76%", top: "33%", duration: 1.1 }, "accident+=4.35");

  return timeline;
}
