import {
  fairyStoryPoses,
  type FairyStoryPose,
} from "../config/fairyStory.config";

export interface PoseSequenceOptions {
  readonly start: number;
  readonly frameDuration: number;
}

export function setPose(
  image: HTMLImageElement,
  pose: FairyStoryPose,
): void {
  image.src = fairyStoryPoses[pose];
}

export function addPoseSequence(
  timeline: GSAPTimeline,
  image: HTMLImageElement,
  poses: readonly FairyStoryPose[],
  options: PoseSequenceOptions,
): number {
  poses.forEach((pose, index) => {
    timeline.call(
      () => setPose(image, pose),
      undefined,
      options.start + index * options.frameDuration,
    );
  });

  return options.start + poses.length * options.frameDuration;
}
