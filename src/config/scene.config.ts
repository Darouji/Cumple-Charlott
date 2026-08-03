export const sceneConfig = {
  designSize: {
    width: 1080,
    height: 1920,
  },
  renderer: {
    maximumPixelRatio: 2,
  },
  fireflies: {
    count: 30,
    seed: 30_080_826,
    minimumRadius: 1.8,
    maximumRadius: 4.4,
    minimumSpeed: 0.7,
    maximumSpeed: 1.35,
    minimumHorizontalDrift: 30,
    maximumHorizontalDrift: 90,
    minimumVerticalDrift: 40,
    maximumVerticalDrift: 120,
    reducedMotionScale: 0.35,
  },
} as const;
