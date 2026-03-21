import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "loading" | "running" | "error";

const LOAD_TIMEOUT_MS = 15_000;

export default function WolfensteinWindow() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const launch = () => {
    setPhase("loading");
    timeoutRef.current = setTimeout(() => {
      setPhase("error");
    }, LOAD_TIMEOUT_MS);
  };

  const handleLoad = () => {
    clearTimer();
    setPhase("running");
  };

  const handleError = () => {
    clearTimer();
    setPhase("error");
  };

  const retry = () => {
    clearTimer();
    setPhase("idle");
  };

  useEffect(() => () => clearTimer(), []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* iframe — rendered once launch is triggered, hidden until loaded */}
      {(phase === "loading" || phase === "running") && (
        <iframe
          src="/wolf3d-browser/index.html"
          title="Wolfenstein 3D"
          onLoad={handleLoad}
          onError={handleError}
          allow="fullscreen"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            opacity: phase === "running" ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Idle splash */}
      {phase === "idle" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            gap: 16,
            fontFamily: '"Courier New", monospace',
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: "bold",
              letterSpacing: 4,
              color: "#cc0000",
              textShadow: "3px 3px 0 #800000",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Wolfenstein 3D
          </div>
          <div style={{ color: "#555", fontSize: 11 }}>
            id Software · 1992 · Shareware Episode 1
          </div>
          <button
            className="retro-btn"
            style={{ marginTop: 8, padding: "6px 32px", fontSize: 13, letterSpacing: 1 }}
            onClick={launch}
          >
            ▶ PLAY
          </button>
          <div
            style={{
              color: "#333",
              fontSize: 10,
              textAlign: "center",
              lineHeight: 1.8,
              marginTop: 4,
            }}
          >
            Arrows/WASD · Ctrl = Shoot · Space = Open door
          </div>
        </div>
      )}

      {/* Loading overlay — sits on top of the (invisible) iframe */}
      {phase === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#c3c3c3",
            fontFamily: '"Courier New", monospace',
            gap: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 13 }}>Loading Wolfenstein 3D...</div>
          <div style={{ color: "#444", fontSize: 11 }}>Please wait</div>
        </div>
      )}

      {/* Error state */}
      {phase === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#cc0000",
            fontFamily: '"Courier New", monospace',
            gap: 12,
            textAlign: "center",
            padding: 32,
          }}
        >
          <div style={{ fontSize: 13 }}>ERROR: Could not load game</div>
          <div style={{ color: "#555", fontSize: 11, lineHeight: 1.8 }}>
            Make sure the game files are present at:
            <br />
            <span style={{ color: "#888" }}>public/wolf3d-browser/index.html</span>
          </div>
          <button className="retro-btn" style={{ marginTop: 4 }} onClick={retry}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
