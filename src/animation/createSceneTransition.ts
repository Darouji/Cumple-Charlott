import gsap from "gsap";

interface SceneTransitionElements {
  readonly outgoingScene: HTMLElement;
  readonly incomingScene: HTMLElement;
  readonly outgoingContent?: HTMLElement;
  readonly incomingContent?: HTMLElement;
}

interface SceneTransitionOptions {
  readonly reducedMotion: boolean;
  readonly onComplete: () => void;
}

export function createSceneTransition(
  elements: SceneTransitionElements,
  options: SceneTransitionOptions,
): gsap.core.Timeline {
  const {
    outgoingScene,
    incomingScene,
    outgoingContent,
    incomingContent,
  } = elements;

  const timeline = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: options.onComplete,
  });

  if (options.reducedMotion) {
    if (outgoingContent) {
      timeline.set(outgoingContent, { autoAlpha: 0 });
    }

    timeline
      .set(outgoingScene, { autoAlpha: 0 })
      .set(incomingScene, { autoAlpha: 1, filter: "none", scale: 1 });

    if (incomingContent) {
      timeline.set(incomingContent, { autoAlpha: 1, y: 0 });
    }

    return timeline;
  }

  if (outgoingContent) {
    timeline.to(outgoingContent, {
      autoAlpha: 0,
      y: -18,
      duration: 0.5,
    });
  }

  timeline
    .to(
      outgoingScene,
      {
        autoAlpha: 0,
        filter: "blur(8px) saturate(0.95)",
        scale: 1.13,
        duration: 1.35,
      },
      0,
    )
    .fromTo(
      incomingScene,
      { autoAlpha: 0, filter: "blur(3px)", scale: 1.08 },
      {
        autoAlpha: 1,
        filter: "none",
        scale: 1,
        duration: 1.25,
      },
      0.55,
    );

  if (incomingContent) {
    timeline.fromTo(
      incomingContent,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" },
      1.45,
    );
  }

  return timeline;
}
