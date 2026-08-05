import {
  Fragment,
  useEffect,
  useState,
  type CSSProperties,
} from "react";

import { experienceAudio } from "../audio/experienceAudio";
import { invitationConfig } from "../config/invitation.config";
import styles from "./InvitationLetter.module.css";

type GlyphStyle = CSSProperties & {
  "--glyph-delay": string;
};

interface MagicLineProps {
  readonly children: string | number | readonly (string | number)[];
  readonly className: string;
  readonly startMs: number;
  readonly stepMs?: number;
}

interface WritingAudioLine {
  readonly text: string;
  readonly startMs: number;
  readonly stepMs: number;
}

function scheduleWritingAudio(lines: readonly WritingAudioLine[]) {
  const timers: number[] = [];

  lines.forEach(({ text, startMs, stepMs }) => {
    Array.from(text).forEach((glyph, glyphIndex) => {
      if (glyph.trim() && glyphIndex % 3 === 0) {
        timers.push(
          window.setTimeout(
            () => experienceAudio.play("letter-write"),
            startMs + glyphIndex * stepMs,
          ),
        );
      }
    });
  });

  return () => timers.forEach((timer) => window.clearTimeout(timer));
}

function MagicLine({
  children,
  className,
  startMs,
  stepMs = 48,
}: MagicLineProps) {
  const text = Array.isArray(children) ? children.join("") : String(children);
  const words = text.split(" ");
  let glyphOffset = 0;

  return (
    <span className={[styles.line, className].join(" ")}>
      <span className={styles.visualWriting} aria-hidden="true">
        {words.map((word, wordIndex) => {
          const wordOffset = glyphOffset;
          glyphOffset += Array.from(word).length + 1;

          return (
            <Fragment key={`${word}-${wordIndex}`}>
              <span className={styles.word}>
                {Array.from(word).map((glyph, glyphIndex) => (
                  <span
                    key={`${glyph}-${glyphIndex}`}
                    className={styles.glyph}
                    style={
                      {
                        "--glyph-delay": `${
                          startMs + (wordOffset + glyphIndex) * stepMs
                        }ms`,
                      } as GlyphStyle
                    }
                  >
                    {glyph}
                  </span>
                ))}
              </span>
              {wordIndex < words.length - 1 ? (
                <span className={styles.space}> </span>
              ) : null}
            </Fragment>
          );
        })}
      </span>
      <span className={styles.srOnly}>{text}</span>
    </span>
  );
}

export function InvitationLetter() {
  const [showDetails, setShowDetails] = useState(false);
  const page = showDetails ? "details" : "announcement";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      experienceAudio.play("letter-page");
      return;
    }

    const lines: readonly WritingAudioLine[] = showDetails
      ? [
          { text: "Guarda esta fecha", startMs: 220, stepMs: 54 },
          {
            text: invitationConfig.date.display,
            startMs: 1450,
            stepMs: 46,
          },
          { text: invitationConfig.time, startMs: 3150, stepMs: 58 },
          { text: invitationConfig.address, startMs: 4100, stepMs: 52 },
          {
            text: `${invitationConfig.letter.farewell} ✦`,
            startMs: 5300,
            stepMs: 62,
          },
        ]
      : [
          {
            text: `✦ ${invitationConfig.letter.opening} ✦`,
            startMs: 220,
            stepMs: 42,
          },
          {
            text: `${invitationConfig.honoree} cumple ${invitationConfig.age} años`,
            startMs: 2300,
            stepMs: 54,
          },
          {
            text: "Y nos encantaría celebrarlo contigo.",
            startMs: 4050,
            stepMs: 46,
          },
        ];

    return scheduleWritingAudio(lines);
  }, [showDetails]);

  return (
    <section className={styles.layer} aria-live="polite">
      <button
        className={styles.spell}
        type="button"
        onClick={() => {
          experienceAudio.play("letter-page");
          setShowDetails((current) => !current);
        }}
        aria-label={
          showDetails
            ? "Volver al anuncio de cumpleaños"
            : "Ver la fecha y el lugar de la celebración"
        }
      >
        <span className={styles.halo} aria-hidden="true" />
        <span
          className={[styles.spark, styles.sparkOne].join(" ")}
          aria-hidden="true"
        >
          ✦
        </span>
        <span
          className={[styles.spark, styles.sparkTwo].join(" ")}
          aria-hidden="true"
        >
          ✧
        </span>
        <span
          className={[styles.spark, styles.sparkThree].join(" ")}
          aria-hidden="true"
        >
          ✦
        </span>
        <span
          className={[styles.spark, styles.sparkFour].join(" ")}
          aria-hidden="true"
        >
          ·
        </span>

        <span key={page} className={styles.writing}>
          {showDetails ? (
            <>
              <MagicLine className={styles.eyebrow} startMs={220} stepMs={54}>
                Guarda esta fecha
              </MagicLine>
              <MagicLine className={styles.date} startMs={1450} stepMs={46}>
                {invitationConfig.date.display}
              </MagicLine>
              <MagicLine className={styles.time} startMs={3150} stepMs={58}>
                {invitationConfig.time}
              </MagicLine>
              <MagicLine className={styles.address} startMs={4100} stepMs={52}>
                {invitationConfig.address}
              </MagicLine>
              <MagicLine className={styles.farewell} startMs={5300} stepMs={62}>
                {invitationConfig.letter.farewell} ✦
              </MagicLine>
            </>
          ) : (
            <>
              <MagicLine className={styles.eyebrow} startMs={220} stepMs={42}>
                ✦ {invitationConfig.letter.opening} ✦
              </MagicLine>
              <MagicLine className={styles.title} startMs={2300} stepMs={54}>
                {invitationConfig.honoree} cumple {invitationConfig.age} años
              </MagicLine>
              <MagicLine className={styles.message} startMs={4050} stepMs={46}>
                Y nos encantaría celebrarlo contigo.
              </MagicLine>
            </>
          )}
        </span>
      </button>

      <p key={`cue-${page}`} className={styles.cue}>
        {showDetails
          ? "Toca para volver al comienzo"
          : "Toca para descubrir cuándo y dónde"}
      </p>
    </section>
  );
}