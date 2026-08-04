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

export const fairyStoryLayout = {
  close: {
    envelope: { left: "50%", top: "51.5%", rotation: -1.5 },
    rightActor: { left: "var(--fairy-right-x)", top: "47.5%" },
    leftActor: { left: "var(--fairy-left-x)", top: "47.5%" },
  },
  overview: {
    envelope: { left: "50%", top: "56%", scale: 0.38 },
    actor: { left: "var(--fairy-overview-x)", top: "52%", scale: 0.36 },
  },
  frame: {
    width: 720,
    height: 724,
  },
} as const;
