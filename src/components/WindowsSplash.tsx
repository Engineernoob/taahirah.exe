import { useEffect, useState } from "react";
import { playStartup } from "../sounds";

interface WindowsSplashProps {
  onComplete: () => void;
}

// How long the splash is visible *after* fade-in completes. The progress
// bar fills evenly across this window; onComplete fires at the end.
const SPLASH_VISIBLE_MS = 1600;
// Fade-in length. Short enough to feel like a CRT warming up, long enough
// to register as a transition rather than a flash.
const FADE_IN_MS = 200;

const PROGRESS_TOTAL = 18;

// Controlled progress bar. `filled` is owned by the parent; the bar just renders.
function ProgressBar({ filled }: { filled: number }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        padding: 2,
        background: "#000",
        border: "1px solid #444",
        width: 200,
      }}
    >
      {Array.from({ length: PROGRESS_TOTAL }).map((_, idx) => (
        <div
          key={idx}
          style={{
            width: 8,
            height: 14,
            background: idx < filled ? "#00a" : "#000",
            boxShadow:
              idx < filled ? "inset 1px 1px 0 rgba(100,100,255,0.5)" : "none",
            transition: "background 0.05s",
          }}
        />
      ))}
    </div>
  );
}

export default function WindowsSplash({ onComplete }: WindowsSplashProps) {
  const [filled, setFilled] = useState(0);
  // Drives the fade-in CSS opacity transition. Set to 1 on next frame so
  // the browser actually animates 0 -> 1 instead of skipping to 1.
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    playStartup();

    // Trigger fade-in on the next frame
    const fadeRaf = requestAnimationFrame(() => setOpacity(1));

    // Drive the progress bar evenly across SPLASH_VISIBLE_MS, starting
    // after the fade-in completes so the bar isn't filling under a
    // half-faded flag.
    const stepMs = SPLASH_VISIBLE_MS / PROGRESS_TOTAL;
    let i = 0;
    const fillIv = window.setTimeout(function tick() {
      i++;
      setFilled(i);
      if (i < PROGRESS_TOTAL) {
        window.setTimeout(tick, stepMs);
      } else {
        // Hand off as soon as the bar lands. No artificial dead zone.
        onComplete();
      }
    }, FADE_IN_MS + stepMs);

    return () => {
      cancelAnimationFrame(fadeRaf);
      window.clearTimeout(fillIv);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity,
        transition: `opacity ${FADE_IN_MS}ms ease-out`,
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          userSelect: "none",
        }}
      >
        {/* ── Win95 four-pane flag ─────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            width: 76,
            height: 76,
            marginBottom: 20,
            filter: "drop-shadow(0 2px 8px rgba(0,0,80,0.8))",
          }}
        >
          <div style={{ background: "#c0002a" }} />
          <div style={{ background: "#1e7a1e" }} />
          <div style={{ background: "#00009a" }} />
          <div style={{ background: "#c8a800" }} />
        </div>

        {/* ── Wordmark ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            marginBottom: 6,
            lineHeight: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "#fff",
                letterSpacing: "0.04em",
                marginBottom: 1,
                opacity: 0.9,
              }}
            >
              Microsoft
            </span>
            <span
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 42,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Windows
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 30,
              color: "#fff",
              marginLeft: 6,
              alignSelf: "flex-end",
              marginBottom: 4,
            }}
          >
            95
          </span>
        </div>

        <p
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
            fontSize: 12,
            color: "#ccc",
            margin: "0 0 24px",
            letterSpacing: "0.02em",
          }}
        >
          Starting Windows 95...
        </p>

        <ProgressBar filled={filled} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 24,
          fontSize: 11,
          color: "#444",
          fontFamily: "'Courier New', monospace",
          letterSpacing: "0.03em",
        }}
      >
        Copyright © 1998 Denmark Corp.
      </div>
    </div>
  );
}
