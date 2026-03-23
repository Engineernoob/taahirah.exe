import { useEffect, useState } from "react";
import { playStartup } from "../sounds";

interface WindowsSplashProps {
  onComplete: () => void;
}

// Win95 progress bar — chunky discrete blocks that fill left to right
function ProgressBar() {
  const TOTAL = 18;
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    let i = 0;
    // Fill one block every ~130ms so it takes ~2.3s to complete
    const iv = setInterval(() => {
      i++;
      setFilled(i);
      if (i >= TOTAL) clearInterval(iv);
    }, 130);
    return () => clearInterval(iv);
  }, []);

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
      {Array.from({ length: TOTAL }).map((_, idx) => (
        <div
          key={idx}
          style={{
            width: 8,
            height: 14,
            background: idx < filled ? "#00a" : "#000",
            // Each filled block has a subtle top-left highlight for depth
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
  useEffect(() => {
    playStartup();
    const timer = setTimeout(() => onComplete(), 2600);
    return () => clearTimeout(timer);
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
        // Subtle scanline overlay
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
      }}
    >
      {/* Centre card */}
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
            // Very slight drop shadow so it lifts off black
            filter: "drop-shadow(0 2px 8px rgba(0,0,80,0.8))",
          }}
        >
          {/* Red (top-left) */}
          <div style={{ background: "#c0002a" }} />
          {/* Green (top-right) */}
          <div style={{ background: "#1e7a1e" }} />
          {/* Blue (bottom-left) */}
          <div style={{ background: "#00009a" }} />
          {/* Yellow (bottom-right) */}
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
          {/* "Microsoft" in small caps above, "Windows" large */}
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

          {/* "95" — bold, slightly smaller, offset up */}
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

        {/* ── Tagline ──────────────────────────────────────────────────────── */}
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

        {/* ── Progress bar ─────────────────────────────────────────────────── */}
        <ProgressBar />
      </div>

      {/* ── Bottom copyright line ────────────────────────────────────────────── */}
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
