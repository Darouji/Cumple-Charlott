export type ExperiencePhase =
  | "threshold-intro"
  | "threshold-arrival"
  | "threshold-ready"
  | "threshold-exit"
  | "entering-glade"
  | "glade-prompt"
  | "glade-journey"
  | "glade-listening"
  | "entering-stage"
  | "stage-reveal"
  | "fairy-story"
  | "invitation-reveal";

export type SceneId = "threshold" | "glade" | "stage";

export const experienceCopy = {
  intro: {
    eyebrow: "Una celebración encantada",
    title: "El bosque está preparando algo mágico…",
  },
  glade: {
    prompt: "Shh… parece que el conejo quiere mostrarnos algo.",
    listening: "¿Escuchaste eso? Parece venir del claro…",
  },
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
    approach: {
      coarse: "Toca para acercarte",
      fine: "Haz clic para acercarte",
    },
  },
} as const;

export function getActiveScene(phase: ExperiencePhase): SceneId {
  if (
    phase === "stage-reveal" ||
    phase === "fairy-story" ||
    phase === "invitation-reveal" ||
    phase === "entering-stage"
  ) {
    return "stage";
  }

  if (
    phase === "glade-prompt" ||
    phase === "glade-journey" ||
    phase === "glade-listening" ||
    phase === "entering-glade"
  ) {
    return "glade";
  }

  return "threshold";
}
