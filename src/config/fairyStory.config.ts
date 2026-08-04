import burstPeek from "../assets/characters/fairy/frames-v2/burst-peek.webp";
import burstPushback from "../assets/characters/fairy/frames-v2/burst-pushback.webp";
import burstShield from "../assets/characters/fairy/frames-v2/burst-shield.webp";
import finalWave from "../assets/characters/fairy/frames-v2/final-wave.webp";
import flyAcross from "../assets/characters/fairy/frames-v2/fly-across.webp";
import hoverLow from "../assets/characters/fairy/frames-v2/hover-low.webp";
import liftCorner from "../assets/characters/fairy/frames-v2/lift-corner.webp";
import liftCrouch from "../assets/characters/fairy/frames-v2/lift-crouch.webp";
import magicHopeful from "../assets/characters/fairy/frames-v2/magic-hopeful.webp";
import magicIdea from "../assets/characters/fairy/frames-v2/magic-idea.webp";
import magicMeasure from "../assets/characters/fairy/frames-v2/magic-measure.webp";
import magicNotEnough from "../assets/characters/fairy/frames-v2/magic-not-enough.webp";
import magicRetrieve from "../assets/characters/fairy/frames-v2/magic-retrieve.webp";
import magicSecondPouch from "../assets/characters/fairy/frames-v2/magic-second-pouch.webp";
import magicSprinkle from "../assets/characters/fairy/frames-v2/magic-sprinkle.webp";
import pouchHold from "../assets/characters/fairy/frames-v2/pouch-hold.webp";
import pouchReach from "../assets/characters/fairy/frames-v2/pouch-reach.webp";
import pouchSlip from "../assets/characters/fairy/frames-v2/pouch-slip.webp";
import pouchSpill from "../assets/characters/fairy/frames-v2/pouch-spill.webp";
import takeoffLow from "../assets/characters/fairy/frames-v2/takeoff-low.webp";

export const fairyStoryPoseNames = [
  "magic-idea",
  "lift-crouch",
  "lift-corner",
  "takeoff-low",
  "fly-across",
  "hover-low",
  "magic-retrieve",
  "magic-measure",
  "magic-sprinkle",
  "magic-hopeful",
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

export const fairyStoryPoses = {
  "magic-idea": magicIdea,
  "lift-crouch": liftCrouch,
  "lift-corner": liftCorner,
  "takeoff-low": takeoffLow,
  "fly-across": flyAcross,
  "hover-low": hoverLow,
  "magic-retrieve": magicRetrieve,
  "magic-measure": magicMeasure,
  "magic-sprinkle": magicSprinkle,
  "magic-hopeful": magicHopeful,
  "magic-not-enough": magicNotEnough,
  "magic-second-pouch": magicSecondPouch,
  "pouch-hold": pouchHold,
  "pouch-slip": pouchSlip,
  "pouch-reach": pouchReach,
  "pouch-spill": pouchSpill,
  "burst-shield": burstShield,
  "burst-pushback": burstPushback,
  "burst-peek": burstPeek,
  "final-wave": finalWave,
} as const satisfies Record<FairyStoryPose, string>;

export const fairyStorySequences = {
  measuredMagic: ["magic-retrieve", "magic-measure", "magic-sprinkle"],
  pouchAccident: ["pouch-hold", "pouch-slip", "pouch-reach", "pouch-spill"],
  finaleReaction: ["burst-shield", "burst-pushback", "burst-peek"],
} as const satisfies Record<string, readonly FairyStoryPose[]>;

export const fairyStoryAssetSources = Object.values(fairyStoryPoses);

export const fairyStoryMirroredPoses = new Set<FairyStoryPose>();

interface FairyStoryPoseAdjustment {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
}

export const fairyStoryPoseAdjustments: Partial<
  Record<FairyStoryPose, FairyStoryPoseAdjustment>
> = {
  "lift-crouch": { y: -2.5 },
  "lift-corner": { y: -3.7 },
  "takeoff-low": { x: -0.15, y: 14.9 },
  "fly-across": { x: -0.1, y: 11.6 },
  "hover-low": { x: -0.15, y: 6.1 },
  "magic-retrieve": { x: -0.15, y: 0.4 },
  "magic-measure": { x: -0.1, y: -7.6 },
  "magic-sprinkle": { y: -8 },
  "magic-hopeful": { x: -0.15, y: -3.9 },
  "magic-not-enough": { x: -0.1, y: -5.1 },
  "magic-second-pouch": { x: -0.15, y: -3.7 },
  "pouch-hold": { x: -0.1, y: -5.5 },
  "pouch-slip": { x: -0.1, y: -0.8 },
  "pouch-reach": { x: -0.1, y: -1.5 },
  "pouch-spill": { x: -0.1, y: -0.1 },
  "burst-shield": { x: -0.1, y: -8.4 },
  "burst-pushback": { x: -0.1, y: -1.8 },
  "burst-peek": { x: -0.1, y: -5.2 },
  "final-wave": { x: -0.1, y: -5.4 },
};

interface ResponsivePoint {
  readonly portrait: {
    readonly x: number;
    readonly y: number;
  };
  readonly wide: {
    readonly x: number;
    readonly y: number;
  };
}

const point = (
  portraitX: number,
  portraitY: number,
  wideX = portraitX,
  wideY = portraitY,
): ResponsivePoint => ({
  portrait: { x: portraitX, y: portraitY },
  wide: { x: wideX, y: wideY },
});

export const fairyStoryLayout = {
  close: {
    chest: point(48, 53.5),
    actor: point(70, 50.5, 60, 50.5),
  },
  overview: {
    chest: point(56.5, 54.5, 56, 54.5),
    actor: point(64, 53.5, 60, 53.5),
    scale: 0.34,
  },
  lift: {
    actor: point(70, 38.5, 60, 38.5),
  },
  air: {
    actor: point(49.5, 31.5),
  },
  wait: {
    actor: point(67, 34, 65, 34),
    idea: point(67, 22, 65, 21),
  },
  openingIdea: point(70, 39, 60, 39),
  final: {
    actor: point(80, 23, 78, 24),
  },
  frame: {
    width: 720,
    height: 724,
  },
} as const;

export type FairyStoryResponsivePoint = ResponsivePoint;