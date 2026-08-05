import burstPeek from "../assets/characters/fairy/frames-v2/burst-peek.webp";
import burstPushback from "../assets/characters/fairy/frames-v2/burst-pushback.webp";
import burstShield from "../assets/characters/fairy/frames-v2/burst-shield.webp";
import finalWave from "../assets/characters/fairy/frames-v2/final-wave.webp";
import flyAcross from "../assets/characters/fairy/frames-v2/fly-across.webp";
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
  "takeoff-low",
  "fly-across",
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
  "takeoff-low": takeoffLow,
  "fly-across": flyAcross,
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

export const fairyStoryMirroredPoses = new Set<FairyStoryPose>([
  "magic-retrieve",
  "magic-measure",
  "magic-sprinkle",
  "magic-hopeful",
  "magic-second-pouch",
  "pouch-hold",
  "pouch-slip",
  "pouch-reach",
  "pouch-spill",
  "burst-shield",
  "burst-peek",
]);

interface FairyStoryPoseAdjustment {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
}

export const fairyStoryPoseAdjustments: Partial<
  Record<FairyStoryPose, FairyStoryPoseAdjustment>
> = {
  "takeoff-low": { x: -0.15, y: 14.9 },
  "fly-across": { x: -0.1, y: 11.6 },
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
  "final-wave": { x: -0.1, y: 0 },
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
    actor: point(73, 24, 79, 24),
  },
  frame: {
    width: 720,
    height: 724,
  },
} as const;

export type FairyStoryResponsivePoint = ResponsivePoint;
