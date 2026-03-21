import { Suspense, lazy, useState } from "react";

const LandingScene = lazy(() => import("./components/LandingScene"));
const BootScreen = lazy(() => import("./components/BootScreen"));
const WindowsSplash = lazy(() => import("./components/WindowsSplash"));
const Desktop = lazy(() => import("./components/Desktop"));

type AppState = "landing" | "bios" | "splash" | "desktop" | "shutdown" | "dos";

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
    <Suspense fallback={<AppLoadingScreen />}>
      {appState === "landing" && (
        <LandingScene onStart={() => setAppState("bios")} />
      )}
      {appState === "bios" && (
        <BootScreen onComplete={() => setAppState("splash")} />
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
  );
}
