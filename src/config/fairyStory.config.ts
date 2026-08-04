export const fairyStoryPoseNames = [
  "push-reach",
  "push-contact",
  "push-drive",
  "push-max",
  "recover-breath",
  "hip-turn",
  "hip-grip",
  "hip-brace",
  "hip-drive",
  "hip-push",
  "hip-max",
  "hip-stumble",
  "lift-crouch",
  "lift-corner",
  "inspect-ground",
  "takeoff-low",
  "hover-low",
  "fly-across",
  "descend-left",
  "land-left",
  "pull-grip",
  "pull-step",
  "pull-max",
  "pull-slip",
  "fall-airborne",
  "fall-impact",
  "fall-rebound",
  "fall-seated",
  "magic-idea",
  "magic-retrieve",
  "magic-measure",
  "magic-sprinkle",
  "magic-hopeful",
  "magic-pull",
  "magic-not-enough",
  "magic-second-pouch",
  "pouch-hold",
  "pouch-slip",
  "pouch-reach",
  "pouch-spill",
  "burst-shield",
  "burst-pushback",
  "burst-peek",
  "final-wave",
] as const;

export type FairyStoryPose = (typeof fairyStoryPoseNames)[number];

const poseFiles = import.meta.glob<string>(
  "../assets/characters/fairy/frames-v2/*.webp",
  { eager: true, query: "?url", import: "default" },
);

function getPoseSource(pose: FairyStoryPose): string {
  const source = poseFiles[
    `../assets/characters/fairy/frames-v2/${pose}.webp`
  ];

  if (!source) {
    throw new Error(`No se encontró el fotograma del hada: ${pose}`);
  }

  return source;
}

export const fairyStoryPoses = Object.fromEntries(
  fairyStoryPoseNames.map((pose) => [pose, getPoseSource(pose)]),
) as Record<FairyStoryPose, string>;

export const fairyStorySequences = {
  handPush: fairyStoryPoseNames.slice(0, 4),
  hipPreparation: fairyStoryPoseNames.slice(4, 8),
  hipPush: fairyStoryPoseNames.slice(8, 12),
  takeoff: fairyStoryPoseNames.slice(12, 16),
  crossToLeft: fairyStoryPoseNames.slice(16, 20),
  pull: fairyStoryPoseNames.slice(20, 24),
  fall: fairyStoryPoseNames.slice(24, 28),
  firstMagic: fairyStoryPoseNames.slice(28, 32),
  secondMagic: fairyStoryPoseNames.slice(32, 36),
  pouchAccident: fairyStoryPoseNames.slice(36, 40),
  finale: fairyStoryPoseNames.slice(40, 44),
} as const satisfies Record<string, readonly FairyStoryPose[]>;

export const fairyStoryAssetSources = Object.values(fairyStoryPoses);

export const fairyStoryMirroredPoses = new Set<FairyStoryPose>([
  "hip-turn",
  "hip-grip",
  "hip-brace",
  "hip-drive",
  "hip-push",
  "hip-max",
  "hip-stumble",
]);

interface FairyStoryPoseAdjustment {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
}

export const fairyStoryPoseAdjustments: Partial<
  Record<FairyStoryPose, FairyStoryPoseAdjustment>
> = {
  "push-reach": { x: 2, y: 1 },
  "push-contact": { x: -1, y: 1 },
  "push-drive": { x: -3, y: 1 },
  "push-max": { x: -5, y: 1 },
  "hip-turn": { x: -2, y: 2 },
  "hip-grip": { x: -3, y: 1 },
  "hip-brace": { x: -4, y: 1 },
  "hip-drive": { x: -5, y: 1 },
  "hip-push": { x: -6, y: 2 },
  "hip-max": { x: -7, y: 2 },
  "hip-stumble": { x: -2, y: 1 },
  "pull-grip": { x: 2, y: 2 },
  "pull-step": { x: 4, y: 2 },
  "pull-max": { x: 6, y: 2 },
  "pull-slip": { x: 5, y: 1 },
  "fall-impact": { y: 3 },
  "fall-seated": { y: 3 },
};

export const fairyStoryLayout = {
  close: {
    chest: { left: "48%", top: "53%", rotation: -1 },
    rightActor: { left: "var(--fairy-right-x)", top: "50.5%" },
    leftActor: { left: "var(--fairy-left-x)", top: "50.5%" },
  },
  overview: {
    chest: { left: "49%", top: "55%", scale: 0.32 },
    actor: { left: "var(--fairy-overview-x)", top: "53%", scale: 0.32 },
  },  frame: {
    width: 720,
    height: 724,
  },
} as const;
