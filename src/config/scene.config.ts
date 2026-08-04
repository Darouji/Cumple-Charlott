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
    { x: 155, y: 710, scale: 1.7, orbitX: 135, orbitY: 92, speed: 0.72, alpha: 0.84 },
    { x: 875, y: 765, scale: 1.45, orbitX: 110, orbitY: 128, speed: 0.86, alpha: 0.76 },
    { x: 825, y: 1190, scale: 1.95, orbitX: 145, orbitY: 96, speed: 0.64, alpha: 0.84 },
  ],
  glade: [
    { x: 150, y: 720, scale: 1.4, orbitX: 125, orbitY: 112, speed: 0.78, alpha: 0.76 },
    { x: 890, y: 690, scale: 1.55, orbitX: 142, orbitY: 90, speed: 0.7, alpha: 0.8 },
    { x: 335, y: 930, scale: 2.05, orbitX: 165, orbitY: 135, speed: 0.58, alpha: 0.9 },
    { x: 735, y: 980, scale: 1.75, orbitX: 148, orbitY: 118, speed: 0.74, alpha: 0.84 },
    { x: 185, y: 1240, scale: 2.15, orbitX: 120, orbitY: 94, speed: 0.66, alpha: 0.9 },
    { x: 875, y: 1260, scale: 1.55, orbitX: 116, orbitY: 142, speed: 0.82, alpha: 0.78 },
  ],
  stage: [
    { x: 190, y: 780, scale: 1.55, orbitX: 122, orbitY: 102, speed: 0.7, alpha: 0.8 },
    { x: 855, y: 765, scale: 1.45, orbitX: 108, orbitY: 138, speed: 0.84, alpha: 0.76 },
    { x: 285, y: 1110, scale: 2.1, orbitX: 152, orbitY: 118, speed: 0.62, alpha: 0.9 },
    { x: 795, y: 1190, scale: 1.9, orbitX: 138, orbitY: 96, speed: 0.76, alpha: 0.86 },
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
