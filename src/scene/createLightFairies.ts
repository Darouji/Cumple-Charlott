import { Container, Graphics } from "pixi.js";

import {
  sceneConfig,
  type LightFairyPlacement,
} from "../config/scene.config";
import type { SceneId } from "../config/experience.config";
import { createSeededRandom } from "../utils/createSeededRandom";

interface LightFairyColors {
  readonly core: number;
  readonly halo: number;
  readonly wings: number;
}

interface LightFairyVisual {
  readonly view: Container;
  readonly glow: Graphics;
  readonly core: Graphics;
  readonly wings: Container;
  readonly trail: readonly Graphics[];
}

interface LightFairy extends LightFairyVisual {
  readonly scene: SceneId;
  readonly placement: LightFairyPlacement;
  readonly phaseX: number;
  readonly phaseY: number;
  readonly phaseWobble: number;
  readonly speed: number;
  readonly frequencyX: number;
  readonly frequencyY: number;
  readonly wobbleFrequency: number;
  readonly direction: 1 | -1;
  readonly flutterSpeed: number;
  currentAlpha: number;
  targetAlpha: number;
  previousX: number;
  previousY: number;
}

export interface LightFairySwarmController {
  readonly animate: (
    elapsedSeconds: number,
    deltaSeconds: number,
    reducedMotion: boolean,
  ) => void;
  readonly setScene: (scene: SceneId, immediate?: boolean) => void;
}

function createWing(
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
  color: number,
  alpha: number,
): Graphics {
  const wing = new Graphics()
    .ellipse(0, 0, radiusX, radiusY)
    .fill({ color, alpha });

  wing.position.set(x, y);
  wing.rotation = rotation;
  return wing;
}

function createLightFairyView(colors: LightFairyColors): LightFairyVisual {
  const view = new Container();
  const wings = new Container();
  const trail = [2.2, 1.65, 1.15].map((radius, index) =>
    new Graphics()
      .circle(0, 0, radius)
      .fill({ color: colors.halo, alpha: 0.3 - index * 0.07 }),
  );
  const glow = new Graphics()
    .circle(0, 0, 23)
    .fill({ color: colors.halo, alpha: 0.035 })
    .circle(0, 0, 15)
    .fill({ color: colors.halo, alpha: 0.075 })
    .circle(0, 0, 9)
    .fill({ color: colors.core, alpha: 0.18 });
  const core = new Graphics()
    .circle(0, 0, 4.2)
    .fill({ color: colors.core, alpha: 0.98 })
    .circle(-1.1, -1.3, 1.35)
    .fill({ color: 0xffffff, alpha: 0.9 });

  wings.addChild(
    createWing(-9, -4.5, 9.5, 3.2, 0.35, colors.wings, 0.34),
    createWing(-7, 4.2, 7.5, 2.55, -0.3, colors.wings, 0.26),
    createWing(9, -4.5, 9.5, 3.2, -0.35, colors.wings, 0.34),
    createWing(7, 4.2, 7.5, 2.55, 0.3, colors.wings, 0.26),
  );
  view.addChild(...trail, wings, glow, core);
  view.alpha = 0;
  view.eventMode = "none";

  return { view, glow, core, wings, trail };
}

export function createLightFairySwarm(
  parent: Container,
  colors: LightFairyColors,
  initialScene: SceneId,
): LightFairySwarmController {
  const random = createSeededRandom(sceneConfig.lightFairies.seed);
  const fairies: LightFairy[] = (
    Object.entries(sceneConfig.lightFairies.placements) as Array<
      [SceneId, readonly LightFairyPlacement[]]
    >
  ).flatMap(([scene, placements]) =>
    placements.map((placement) => {
      const visual = createLightFairyView(colors);
      const fairy: LightFairy = {
        ...visual,
        scene,
        placement,
        phaseX: random() * Math.PI * 2,
        phaseY: random() * Math.PI * 2,
        phaseWobble: random() * Math.PI * 2,
        speed: placement.speed * (0.88 + random() * 0.24),
        frequencyX: 0.62 + random() * 0.92,
        frequencyY: 0.58 + random() * 0.88,
        wobbleFrequency: 1.7 + random() * 1.55,
        direction: random() > 0.5 ? 1 : -1,
        flutterSpeed: 9.5 + random() * 6,
        currentAlpha: scene === initialScene ? placement.alpha : 0,
        targetAlpha: scene === initialScene ? placement.alpha : 0,
        previousX: placement.x,
        previousY: placement.y,
      };

      fairy.view.position.set(placement.x, placement.y);
      fairy.view.scale.set(placement.scale);
      fairy.view.alpha = fairy.currentAlpha;
      parent.addChild(fairy.view);
      return fairy;
    }),
  );

  const setScene = (scene: SceneId, immediate = false) => {
    for (const fairy of fairies) {
      fairy.targetAlpha = fairy.scene === scene ? fairy.placement.alpha : 0;

      if (immediate) {
        fairy.currentAlpha = fairy.targetAlpha;
        fairy.view.alpha = fairy.targetAlpha;
      }
    }
  };

  const animate = (
    elapsedSeconds: number,
    deltaSeconds: number,
    reducedMotion: boolean,
  ) => {
    const motionScale = reducedMotion
      ? sceneConfig.lightFairies.reducedMotionScale
      : 1;
    const alphaBlend = Math.min(
      1,
      deltaSeconds * sceneConfig.lightFairies.sceneTransitionSpeed,
    );

    for (const fairy of fairies) {
      fairy.currentAlpha +=
        (fairy.targetAlpha - fairy.currentAlpha) * alphaBlend;
      fairy.view.alpha = fairy.currentAlpha;

      if (fairy.currentAlpha < 0.004 && fairy.targetAlpha === 0) {
        fairy.view.visible = false;
        continue;
      }

      fairy.view.visible = true;
      const time = elapsedSeconds * fairy.speed * fairy.direction;
      const dartWave = Math.sin(
        time * fairy.wobbleFrequency + fairy.phaseWobble,
      );
      const dart = Math.sign(dartWave) * Math.abs(dartWave) ** 7;
      const nextX =
        fairy.placement.x +
        Math.sin(time * fairy.frequencyX + fairy.phaseX) *
          fairy.placement.orbitX *
          motionScale +
        Math.sin(time * 0.37 + fairy.phaseY) *
          fairy.placement.orbitX *
          0.34 *
          motionScale +
        dart * fairy.placement.orbitX * 0.2 * motionScale;
      const nextY =
        fairy.placement.y +
        Math.cos(time * fairy.frequencyY + fairy.phaseY) *
          fairy.placement.orbitY *
          motionScale +
        Math.sin(time * 1.43 + fairy.phaseWobble) *
          fairy.placement.orbitY *
          0.3 *
          motionScale -
        dart * fairy.placement.orbitY * 0.16 * motionScale;
      const velocityX = Math.max(
        -2.5,
        Math.min(2.5, nextX - fairy.previousX),
      );
      const velocityY = Math.max(
        -2.5,
        Math.min(2.5, nextY - fairy.previousY),
      );
      const flutter =
        0.28 +
        Math.abs(
          Math.sin(elapsedSeconds * fairy.flutterSpeed + fairy.phaseWobble),
        ) *
          0.72;
      const pulse =
        0.88 + Math.sin(time * 2.1 + fairy.phaseX) * 0.12;

      fairy.view.position.set(nextX, nextY);
      fairy.view.rotation = Math.atan2(velocityY, velocityX) * 0.16;
      fairy.wings.scale.y = reducedMotion ? 0.7 : flutter;
      fairy.glow.scale.set(pulse);
      fairy.core.scale.set(0.96 + (pulse - 0.88) * 0.65);

      fairy.trail.forEach((dot, index) => {
        const distance = (index + 1) * 8;
        dot.position.set(-velocityX * distance, -velocityY * distance);
        dot.alpha = reducedMotion ? 0.1 : 0.32 - index * 0.075;
      });
      fairy.previousX = nextX;
      fairy.previousY = nextY;
    }
  };

  setScene(initialScene, true);
  return { animate, setScene };
}
