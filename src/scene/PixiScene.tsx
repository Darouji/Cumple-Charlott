import { useEffect, useRef } from "react";
import { Application } from "pixi.js";

import { sceneConfig } from "../config/scene.config";
import {
  createInvitationScene,
  type InvitationSceneController,
} from "./createInvitationScene";
import styles from "./PixiScene.module.css";

export function PixiScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    let app: Application | null = null;
    let controller: InvitationSceneController | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let initialized = false;
    let cancelled = false;

    const mountScene = async () => {
      const bounds = host.getBoundingClientRect();
      const nextApp = new Application();
      app = nextApp;

      await nextApp.init({
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        preference: "webgl",
        powerPreference: "high-performance",
        resolution: Math.min(
          window.devicePixelRatio || 1,
          sceneConfig.renderer.maximumPixelRatio,
        ),
      });

      initialized = true;

      if (cancelled) {
        nextApp.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false, context: true },
        );
        return;
      }

      const canvas = nextApp.canvas as HTMLCanvasElement;
      canvas.className = styles.canvas;
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);

      controller = createInvitationScene(nextApp);
      resizeObserver = new ResizeObserver(([entry]) => {
        if (!entry) {
          return;
        }

        const width = Math.max(1, Math.round(entry.contentRect.width));
        const height = Math.max(1, Math.round(entry.contentRect.height));
        nextApp.renderer.resize(width, height);
        controller?.resize();
      });
      resizeObserver.observe(host);
    };

    void mountScene().catch((error: unknown) => {
      if (!cancelled) {
        console.error("No fue posible iniciar la escena mágica.", error);
      }
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      controller?.destroy();

      if (initialized && app) {
        app.destroy(
          { removeView: true },
          { children: true, texture: false, textureSource: false, context: true },
        );
      }
    };
  }, []);

  return <div ref={hostRef} className={styles.host} aria-hidden="true" />;
}
