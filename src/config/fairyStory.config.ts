import decidesMagic from "../assets/characters/fairy/frames/fairy-decides-magic.webp";
import fallBack from "../assets/characters/fairy/frames/fairy-fall-back.webp";
import finalGreeting from "../assets/characters/fairy/frames/fairy-final-greeting.webp";
import gripSlip from "../assets/characters/fairy/frames/fairy-grip-slip.webp";
import hopefulCheck from "../assets/characters/fairy/frames/fairy-hopeful-check.webp";
import hoverInspect from "../assets/characters/fairy/frames/fairy-hover-inspect.webp";
import liftFail from "../assets/characters/fairy/frames/fairy-lift-fail.webp";
import magicBurstReact from "../assets/characters/fairy/frames/fairy-magic-burst-react.webp";
import measureDust from "../assets/characters/fairy/frames/fairy-measure-dust.webp";
import pouchRelease from "../assets/characters/fairy/frames/fairy-pouch-release.webp";
import pouchSecondAttempt from "../assets/characters/fairy/frames/fairy-pouch-second-attempt.webp";
import pullPrep from "../assets/characters/fairy/frames/fairy-pull-prep.webp";
import pullStrain from "../assets/characters/fairy/frames/fairy-pull-strain.webp";
import pushPrep from "../assets/characters/fairy/frames/fairy-push-prep.webp";
import pushStrain from "../assets/characters/fairy/frames/fairy-push-strain.webp";
import reachForPouch from "../assets/characters/fairy/frames/fairy-reach-for-pouch.webp";
import retrievePouch from "../assets/characters/fairy/frames/fairy-retrieve-pouch.webp";
import seatedFrustrated from "../assets/characters/fairy/frames/fairy-seated-frustrated.webp";
import sprinkleDust from "../assets/characters/fairy/frames/fairy-sprinkle-dust.webp";

export const fairyStoryPoses = {
  pushPrep: { source: pushPrep, scale: 1 },
  pushStrain: { source: pushStrain, scale: 1 },
  liftFail: { source: liftFail, scale: 1 },
  hoverInspect: { source: hoverInspect, scale: 0.96 },
  pullPrep: { source: pullPrep, scale: 1 },
  pullStrain: { source: pullStrain, scale: 1 },
  gripSlip: { source: gripSlip, scale: 1 },
  fallBack: { source: fallBack, scale: 1 },
  seatedFrustrated: { source: seatedFrustrated, scale: 1 },
  decidesMagic: { source: decidesMagic, scale: 0.8 },
  retrievePouch: { source: retrievePouch, scale: 0.76 },
  measureDust: { source: measureDust, scale: 0.8 },
  sprinkleDust: { source: sprinkleDust, scale: 0.8 },
  hopefulCheck: { source: hopefulCheck, scale: 0.8 },
  pouchSecondAttempt: { source: pouchSecondAttempt, scale: 0.86 },
  pouchRelease: { source: pouchRelease, scale: 0.86 },
  reachForPouch: { source: reachForPouch, scale: 0.88 },
  magicBurstReact: { source: magicBurstReact, scale: 0.84 },
  finalGreeting: { source: finalGreeting, scale: 0.84 },
} as const;

export type FairyStoryPose = keyof typeof fairyStoryPoses;

export const fairyStoryAssetSources = Object.values(fairyStoryPoses).map(
  ({ source }) => source,
);
