import {
  fairyStoryMirroredPoses,
  fairyStoryPoseAdjustments,
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
  const adjustment = fairyStoryPoseAdjustments[pose];

  image.src = fairyStoryPoses[pose];
  image.style.setProperty("--pose-x", `${adjustment?.x ?? 0}%`);
  image.style.setProperty("--pose-y", `${adjustment?.y ?? 0}%`);
  image.style.setProperty(
    "--pose-rotation",
    `${adjustment?.rotation ?? 0}deg`,
  );
  image.style.setProperty(
    "--pose-facing",
    fairyStoryMirroredPoses.has(pose) ? "-1" : "1",
  );
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
