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

const STARTUP_MESSAGES = [
  "Loading AI Lab...",
  "Mounting Resume.log...",
  "Starting Internet Explorer...",
  "Connecting MSN Messenger...",
  "Preparing TaahirahOS desktop...",
];

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
  const [messageIdx, setMessageIdx] = useState(0);
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
    let timerId: number;
    function tick() {
      i++;
      setFilled(i);
      setMessageIdx(
        Math.min(
          STARTUP_MESSAGES.length - 1,
          Math.floor((i / PROGRESS_TOTAL) * STARTUP_MESSAGES.length),
        ),
      );
      if (i < PROGRESS_TOTAL) {
        timerId = window.setTimeout(tick, stepMs);
      } else {
        // Hand off as soon as the bar lands. No artificial dead zone.
        onComplete();
      }
    }
    timerId = window.setTimeout(tick, FADE_IN_MS + stepMs);

    return () => {
      cancelAnimationFrame(fadeRaf);
      window.clearTimeout(timerId);
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
            width: 82,
            height: 82,
            marginBottom: 18,
            filter: "drop-shadow(0 2px 10px rgba(0,0,120,0.9))",
            transform: "skewY(-4deg)",
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
              Denmark Systems
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
              TaahirahOS
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
            26
          </span>
        </div>

        <div
          style={{
            fontFamily: "Tahoma, Arial, sans-serif",
            fontSize: 11,
            color: "#7aa2ff",
            marginBottom: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Personal AI Workstation
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
          {STARTUP_MESSAGES[messageIdx]}
        </p>

        <ProgressBar filled={filled} />
        <div
          style={{
            marginTop: 10,
            width: 200,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            color: "#777",
          }}
        >
          <span>{Math.round((filled / PROGRESS_TOTAL) * 100)}%</span>
          <span>AI Lab online</span>
        </div>
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
        Copyright © 1998-2026 Denmark Systems · TaahirahOS Build 2.6
      </div>
    </div>
  );
}
