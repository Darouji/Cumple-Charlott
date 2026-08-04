import type { SceneId } from "./experience.config";

export interface LightFairyPlacement {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  readonly orbitX: number;
  readonly orbitY: number;
  readonly speed: number;
  readonly alpha: number;
}

const lightFairyPlacements = {
  threshold: [
    { x: 155, y: 710, scale: 0.72, orbitX: 72, orbitY: 48, speed: 0.72, alpha: 0.76 },
    { x: 875, y: 765, scale: 0.58, orbitX: 54, orbitY: 68, speed: 0.86, alpha: 0.64 },
    { x: 825, y: 1190, scale: 0.88, orbitX: 82, orbitY: 52, speed: 0.64, alpha: 0.72 },
  ],
  glade: [
    { x: 150, y: 720, scale: 0.6, orbitX: 65, orbitY: 58, speed: 0.78, alpha: 0.66 },
    { x: 890, y: 690, scale: 0.7, orbitX: 72, orbitY: 46, speed: 0.7, alpha: 0.72 },
    { x: 335, y: 930, scale: 0.9, orbitX: 86, orbitY: 72, speed: 0.58, alpha: 0.82 },
    { x: 735, y: 980, scale: 0.78, orbitX: 76, orbitY: 62, speed: 0.74, alpha: 0.76 },
    { x: 185, y: 1240, scale: 0.95, orbitX: 64, orbitY: 48, speed: 0.66, alpha: 0.8 },
    { x: 875, y: 1260, scale: 0.68, orbitX: 58, orbitY: 76, speed: 0.82, alpha: 0.68 },
  ],
  stage: [
    { x: 190, y: 780, scale: 0.68, orbitX: 64, orbitY: 54, speed: 0.7, alpha: 0.7 },
    { x: 855, y: 765, scale: 0.62, orbitX: 56, orbitY: 72, speed: 0.84, alpha: 0.66 },
    { x: 285, y: 1110, scale: 0.92, orbitX: 78, orbitY: 62, speed: 0.62, alpha: 0.82 },
    { x: 795, y: 1190, scale: 0.84, orbitX: 70, orbitY: 48, speed: 0.76, alpha: 0.76 },
  ],
} as const satisfies Record<SceneId, readonly LightFairyPlacement[]>;

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
  lightFairies: {
    seed: 8_308_026,
    reducedMotionScale: 0.24,
    sceneTransitionSpeed: 3.8,
    placements: lightFairyPlacements,
  },
} as const;
