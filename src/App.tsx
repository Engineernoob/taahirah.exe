import { Suspense, lazy, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const LandingScene = lazy(() => import("./components/LandingScene"));
const BootScreen = lazy(() => import("./components/BootScreen"));
const WindowsSplash = lazy(() => import("./components/WindowsSplash"));
const Desktop = lazy(() => import("./components/Desktop"));

type AppState =
  | "landing"
  | "bios"
  | "handoff" // 250ms pure black between BIOS and Splash
  | "splash"
  | "desktop"
  | "shutdown"
  | "dos";

// Pure black for HANDOFF_MS, then advances. Mirrors the moment between
// BIOS POST completion and OS bootloader handoff on a real machine —
// counterintuitively makes the chain feel snappier by giving each screen
// its own clean entry/exit instead of jamming them together.
const HANDOFF_MS = 250;
function BiosToSplashHandoff({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, HANDOFF_MS);
    return () => window.clearTimeout(id);
  }, [onDone]);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9998,
      }}
    />
  );
}

function AppLoadingScreen() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#c3c6ca",
        fontFamily: '"Courier Prime", "Courier New", monospace',
        fontSize: 14,
      }}
    >
      Loading...
    </div>
  );
}

function PowerStateScreen({
  title,
  subtitle,
  onWake,
}: {
  title: string;
  subtitle: string;
  onWake: () => void;
}) {
  return (
    <div
      onClick={onWake}
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        color: "#c3c6ca",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: '"Courier Prime", "Courier New", monospace',
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: 22, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-line" }}>
        {subtitle}
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("landing");

  const handleShutdown = (action: "shutdown" | "restart" | "dos") => {
    if (action === "restart") {
      setAppState("bios");
      return;
    }
    if (action === "dos") {
      setAppState("dos");
      return;
    }
    setAppState("shutdown");
  };

  return (
    <>
      <Suspense fallback={<AppLoadingScreen />}>
        {appState === "landing" && (
          <LandingScene onStart={() => setAppState("bios")} />
        )}
        {appState === "bios" && (
          <BootScreen onComplete={() => setAppState("handoff")} />
        )}
        {appState === "handoff" && (
          <BiosToSplashHandoff onDone={() => setAppState("splash")} />
        )}
        {appState === "splash" && (
          <WindowsSplash onComplete={() => setAppState("desktop")} />
        )}
        {appState === "desktop" && <Desktop onShutdown={handleShutdown} />}
        {appState === "shutdown" && (
          <LandingScene mode="shutdown" onStart={() => setAppState("bios")} />
        )}
        {appState === "dos" && (
          <PowerStateScreen
            title="Starting MS-DOS mode..."
            subtitle={"C:\\>\nClick anywhere to reboot back into Windows."}
            onWake={() => setAppState("bios")}
          />
        )}
      </Suspense>
      <Analytics />
    </>
  );
}
