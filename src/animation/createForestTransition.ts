import gsap from "gsap";

interface ForestTransitionElements {
  readonly threshold: HTMLElement;
  readonly glade: HTMLElement;
  readonly introduction: HTMLElement;
  readonly discoveryHint: HTMLElement;
}

interface ForestTransitionOptions {
  readonly reducedMotion: boolean;
  readonly onComplete: () => void;
}

export function createForestTransition(
  elements: ForestTransitionElements,
  options: ForestTransitionOptions,
): gsap.core.Timeline {
  const { threshold, glade, introduction, discoveryHint } = elements;

  if (options.reducedMotion) {
    return gsap
      .timeline({ onComplete: options.onComplete })
      .set(introduction, { autoAlpha: 0 })
      .set(threshold, { autoAlpha: 0 })
      .set(glade, { autoAlpha: 1, scale: 1 })
      .set(discoveryHint, { autoAlpha: 1, y: 0 });
  }

  return gsap
    .timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: options.onComplete,
    })
    .to(introduction, { autoAlpha: 0, y: -18, duration: 0.5 })
    .to(
      threshold,
      { autoAlpha: 0, filter: "blur(8px)", scale: 1.13, duration: 1.35 },
      0,
    )
    .fromTo(
      glade,
      { autoAlpha: 0, scale: 1.08 },
      { autoAlpha: 1, scale: 1, duration: 1.25 },
      0.55,
    )
    .fromTo(
      discoveryHint,
      { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: "power2.out" },
      1.45,
    );
}
