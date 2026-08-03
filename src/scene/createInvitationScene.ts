import { Application, Container, Graphics, type Ticker } from "pixi.js";

import { sceneConfig } from "../config/scene.config";
import { readCssHexColor } from "../utils/readCssHexColor";

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
  readonly destroy: () => void;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
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
): InvitationSceneController {
  const root = new Container();
  const effectsLayer = new Container();
  const random = createSeededRandom(sceneConfig.fireflies.seed);
  const coreColor = readCssHexColor("--color-fairy-glow");
  const haloColor = readCssHexColor("--color-magic-green");
  const { width, height } = sceneConfig.designSize;

  root.label = "invitation-scene";
  effectsLayer.label = "fireflies";
  root.addChild(effectsLayer);
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
      effectsLayer.addChild(view);

      return {
        view,
        originX,
        originY,
        phase: random() * Math.PI * 2,
        speed: 0.45 + random() * 0.75,
        driftX: 12 + random() * 38,
        driftY: 18 + random() * 52,
      };
    },
  );

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  let elapsedSeconds = 0;

  const animate = (ticker: Ticker) => {
    if (reducedMotionQuery.matches) {
      return;
    }

    elapsedSeconds += ticker.deltaMS / 1000;

    for (const firefly of fireflies) {
      const time = elapsedSeconds * firefly.speed + firefly.phase;
      firefly.view.x = firefly.originX + Math.sin(time) * firefly.driftX;
      firefly.view.y =
        firefly.originY + Math.cos(time * 0.72) * firefly.driftY;
      firefly.view.alpha = 0.28 + (Math.sin(time * 1.8) + 1) * 0.28;
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
  resize();

  return {
    resize,
    destroy: () => {
      app.ticker.remove(animate);
      root.removeFromParent();
      root.destroy({ children: true });
    },
  };
}
