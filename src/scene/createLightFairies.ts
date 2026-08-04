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
  readonly phase: number;
  readonly speed: number;
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
      const phase = random() * Math.PI * 2;
      const fairy: LightFairy = {
        ...visual,
        scene,
        placement,
        phase,
        speed: placement.speed * (0.88 + random() * 0.24),
        flutterSpeed: 10 + random() * 4,
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
      const time = elapsedSeconds * fairy.speed + fairy.phase;
      const orbitScale = motionScale * fairy.placement.scale;
      const nextX =
        fairy.placement.x +
        Math.sin(time) * fairy.placement.orbitX * orbitScale +
        Math.sin(time * 0.43 + fairy.phase) *
          fairy.placement.orbitX *
          0.28 *
          orbitScale;
      const nextY =
        fairy.placement.y +
        Math.cos(time * 0.72) * fairy.placement.orbitY * orbitScale +
        Math.sin(time * 1.31 + fairy.phase) *
          fairy.placement.orbitY *
          0.18 *
          orbitScale;
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
        Math.abs(Math.sin(elapsedSeconds * fairy.flutterSpeed + fairy.phase)) *
          0.72;
      const pulse = 0.88 + Math.sin(time * 2.1) * 0.12;

      fairy.view.position.set(nextX, nextY);
      fairy.view.rotation = Math.atan2(velocityY, velocityX) * 0.08;
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
