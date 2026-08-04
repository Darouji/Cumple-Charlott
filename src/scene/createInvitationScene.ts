import { Application, Container, Graphics, type Ticker } from "pixi.js";

import { sceneConfig } from "../config/scene.config";
import type { SceneId } from "../config/experience.config";
import { createSeededRandom } from "../utils/createSeededRandom";
import { readCssHexColor } from "../utils/readCssHexColor";
import { createLightFairySwarm } from "./createLightFairies";

interface Firefly {
  readonly view: Container;
  readonly originX: number;
  readonly originY: number;
  readonly phase: number;
  readonly speed: number;
  readonly driftX: number;
  readonly driftY: number;
}

export interface InvitationSceneController {
  readonly resize: () => void;
  readonly setScene: (scene: SceneId) => void;
  readonly destroy: () => void;
}

function createFireflyView(
  radius: number,
  coreColor: number,
  haloColor: number,
): Container {
  const view = new Container();
  const halo = new Graphics()
    .circle(0, 0, radius * 4.5)
    .fill({ color: haloColor, alpha: 0.035 })
    .circle(0, 0, radius * 2.6)
    .fill({ color: haloColor, alpha: 0.1 })
    .circle(0, 0, radius * 1.45)
    .fill({ color: haloColor, alpha: 0.22 });
  const core = new Graphics()
    .circle(0, 0, radius)
    .fill({ color: coreColor, alpha: 0.96 });

  view.addChild(halo, core);
  return view;
}

export function createInvitationScene(
  app: Application,
  initialScene: SceneId,
): InvitationSceneController {
  const root = new Container();
  const fireflyLayer = new Container();
  const lightFairyLayer = new Container();
  const random = createSeededRandom(sceneConfig.fireflies.seed);
  const coreColor = readCssHexColor("--color-fairy-glow");
  const haloColor = readCssHexColor("--color-magic-green");
  const lightFairies = createLightFairySwarm(
    lightFairyLayer,
    {
      core: readCssHexColor("--color-fairy-glow"),
      halo: readCssHexColor("--color-light-fairy-halo"),
      wings: readCssHexColor("--color-light-fairy-wings"),
    },
    initialScene,
  );
  const { width, height } = sceneConfig.designSize;

  root.label = "invitation-scene";
  fireflyLayer.label = "fireflies";
  lightFairyLayer.label = "light-fairies";
  root.addChild(fireflyLayer, lightFairyLayer);
  app.stage.addChild(root);

  const fireflies: Firefly[] = Array.from(
    { length: sceneConfig.fireflies.count },
    () => {
      const radius =
        sceneConfig.fireflies.minimumRadius +
        random() *
          (sceneConfig.fireflies.maximumRadius -
            sceneConfig.fireflies.minimumRadius);
      const originX = random() * width;
      const originY = height * 0.08 + random() * height * 0.84;
      const view = createFireflyView(radius, coreColor, haloColor);

      view.position.set(originX, originY);
      view.alpha = 0.3 + random() * 0.55;
      fireflyLayer.addChild(view);

      return {
        view,
        originX,
        originY,
        phase: random() * Math.PI * 2,
        speed:
          sceneConfig.fireflies.minimumSpeed +
          random() *
            (sceneConfig.fireflies.maximumSpeed -
              sceneConfig.fireflies.minimumSpeed),
        driftX:
          sceneConfig.fireflies.minimumHorizontalDrift +
          random() *
            (sceneConfig.fireflies.maximumHorizontalDrift -
              sceneConfig.fireflies.minimumHorizontalDrift),
        driftY:
          sceneConfig.fireflies.minimumVerticalDrift +
          random() *
            (sceneConfig.fireflies.maximumVerticalDrift -
              sceneConfig.fireflies.minimumVerticalDrift),
      };
    },
  );

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let elapsedSeconds = 0;

  const animate = (ticker: Ticker) => {
    const motionScale = reducedMotionQuery.matches
      ? sceneConfig.fireflies.reducedMotionScale
      : 1;
    elapsedSeconds += (ticker.deltaMS / 1000) * motionScale;
    lightFairies.animate(
      elapsedSeconds,
      ticker.deltaMS / 1000,
      reducedMotionQuery.matches,
    );

    for (const firefly of fireflies) {
      const time = elapsedSeconds * firefly.speed + firefly.phase;
      firefly.view.x =
        firefly.originX + Math.sin(time) * firefly.driftX;
      firefly.view.y =
        firefly.originY +
        Math.cos(time * 0.72) * firefly.driftY;
      firefly.view.alpha = 0.22 + (Math.sin(time * 1.8) + 1) * 0.3;
    }
  };

  const resize = () => {
    const scale = Math.max(app.screen.width / width, app.screen.height / height);
    root.scale.set(scale);
    root.position.set(
      (app.screen.width - width * scale) / 2,
      (app.screen.height - height * scale) / 2,
    );
  };

  app.ticker.add(animate);
  app.ticker.maxFPS = 60;
  app.ticker.start();
  resize();

  return {
    resize,
    setScene: lightFairies.setScene,
    destroy: () => {
      app.ticker.remove(animate);
      root.removeFromParent();
      root.destroy({ children: true });
    },
  };
}
