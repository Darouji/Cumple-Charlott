export type ExperiencePhase =
  | "threshold-intro"
  | "threshold-arrival"
  | "threshold-ready"
  | "threshold-exit"
  | "entering-glade"
  | "glade-prompt"
  | "glade-journey"
  | "entering-stage"
  | "stage-reveal";

export type SceneId = "threshold" | "glade" | "stage";

export const experienceCopy = {
  intro: {
    eyebrow: "Una celebración encantada",
    title: "El bosque está preparando algo mágico…",
  },
  glade: "Shh… parece que el conejo quiere mostrarnos algo.",
  stage: "Mira… parece que alguien necesita ayuda.",
  interaction: {
    continue: {
      coarse: "Toca para continuar",
      fine: "Haz clic para continuar",
    },
    follow: {
      coarse: "Toca para seguirlo",
      fine: "Haz clic para seguirlo",
    },
  },
} as const;

export function getActiveScene(phase: ExperiencePhase): SceneId {
  if (phase === "stage-reveal" || phase === "entering-stage") {
    return "stage";
  }

  if (
    phase === "glade-prompt" ||
    phase === "glade-journey" ||
    phase === "entering-glade"
  ) {
    return "glade";
  }

  return "threshold";
}
