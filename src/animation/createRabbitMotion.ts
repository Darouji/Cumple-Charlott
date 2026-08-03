import gsap from "gsap";

interface RabbitMotionOptions {
  readonly reducedMotion: boolean;
}

interface RabbitEscapeOptions extends RabbitMotionOptions {
  readonly onComplete: () => void;
}

export function createRabbitIdle(
  rabbit: HTMLElement,
  options: RabbitMotionOptions,
): gsap.core.Timeline {
  const timeline = gsap.timeline();

  if (options.reducedMotion) {
    return timeline.set(rabbit, {
      autoAlpha: 1,
      rotation: 0,
      scale: 1,
      x: 0,
      y: 0,
    });
  }

  return timeline
    .fromTo(
      rabbit,
      { autoAlpha: 0, rotation: -2, scale: 0.94, x: -18, y: 12 },
      {
        autoAlpha: 1,
        rotation: 0,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.4)",
      },
    )
    .to(rabbit, {
      rotation: 0.7,
      y: -5,
      duration: 1.7,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
}

export function createRabbitEscape(
  rabbit: HTMLElement,
  options: RabbitEscapeOptions,
): gsap.core.Timeline {
  const timeline = gsap.timeline({ onComplete: options.onComplete });

  if (options.reducedMotion) {
    return timeline.set(rabbit, {
      autoAlpha: 0,
      left: "50%",
      top: "57%",
      rotation: 0,
      scale: 0.08,
    });
  }

  return timeline
    .set(rabbit, {
      autoAlpha: 0,
      left: "10%",
      top: "66%",
      rotation: -3,
      scale: 0.72,
    })
    .to(rabbit, { autoAlpha: 1, duration: 0.16 })
    .to(rabbit, {
      left: "24%",
      top: "53%",
      rotation: 4,
      scale: 0.58,
      duration: 0.42,
      ease: "power2.out",
    })
    .to(rabbit, {
      left: "34%",
      top: "61%",
      rotation: -2,
      scale: 0.46,
      duration: 0.3,
      ease: "power2.in",
    })
    .to(rabbit, {
      left: "43%",
      top: "53%",
      rotation: 3,
      scale: 0.29,
      duration: 0.37,
      ease: "power2.out",
    })
    .to(rabbit, {
      left: "50%",
      top: "58%",
      rotation: 0,
      scale: 0.09,
      duration: 0.46,
      ease: "power2.in",
    })
    .to(rabbit, { autoAlpha: 0, duration: 0.2 }, "-=0.12");
}
