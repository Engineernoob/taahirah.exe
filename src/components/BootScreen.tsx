import { useState, useEffect } from "react";
import { playBiosBeep } from "../sounds";

const BIOS_LINES = [
  "",
  "TaahirahOS Personal Workstation BIOS v2.6",
  "Copyright (C) 1998-2026 Denmark Systems",
  "",
  "CPU : AI Engineer Core @ Unlimited Curiosity MHz",
  "Memory Test : 32768 KB OK",
  "Storage : 2TB Developer Edition Detected",
  "Input Device : Mechanical Keyboard Ready",
  "Network : Connected",
  "",
  "Initializing TaahirahOS Runtime...",
  "Loading Personal Profile...................OK",
  "Loading Project Archive....................OK",
  "Loading AI Lab.............................OK",
  "Loading Resume.log.........................OK",
  "Loading Contact Terminal...................OK",
  "Loading MSN Messenger......................OK",
  "Loading Internet Explorer 5.0..............OK",
  "",
  "Mounted PatchPilot",
  "Mounted Recuris",
  "Mounted DARiAN",
  "Mounted RetroOS Portfolio",
  "",
  "Recruiter Detection Service...............READY",
  "Founder Detection Service.................READY",
  "Creative Mode.............................ENABLED",
  "",
  "All systems operational.",
  "Launching TaahirahOS...",
  "",
  "Tip: Open AI Lab to explore featured projects",
  "",
];

// Per-line cadence. Faster than before (was 70ms/50ms) but not so fast
// it stops reading like a real BIOS. Blank lines step quickly so the
// vertical rhythm of BIOS_LINES still matters.
const LINE_DELAY_MS = 42;
const BLANK_DELAY_MS = 18;
// How long to hold on the completed BIOS before handing off. Real POSTs
// have a brief pause here while the bootloader finds the OS partition.
const TAIL_MS = 650;

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  const progress = Math.min(
    100,
    Math.round((visibleLines / BIOS_LINES.length) * 100),
  );

  // PC speaker POST beep at boot start
  useEffect(() => {
    const id = setTimeout(() => playBiosBeep(), 120);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (visibleLines < BIOS_LINES.length) {
      const isBlank = BIOS_LINES[visibleLines] === "";
      const delay = isBlank ? BLANK_DELAY_MS : LINE_DELAY_MS;
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => onComplete(), TAIL_MS);
    return () => clearTimeout(timer);
  }, [onComplete, visibleLines]);

  return (
    <div className="bios-screen">
      <div className="scanlines" />
      <div>
        <div
          style={{
            marginBottom: 10,
            color: "#00ff66",
            fontWeight: "bold",
          }}
        >
          TaahirahOS Boot Manager
        </div>
        {BIOS_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="bios-line" style={{ whiteSpace: "pre" }}>
            {line === "" ? "\u00A0" : line}
          </div>
        ))}
        {visibleLines < BIOS_LINES.length && <span className="blink-cursor" />}
        <div
          style={{
            marginTop: 12,
            width: 420,
            maxWidth: "100%",
          }}
        >
          <div
            style={{
              border: "1px solid #00ff66",
              height: 10,
              padding: 1,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#00ff66",
                transition: "width 40ms linear",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: "#00ff66",
            }}
          >
            Boot Progress: {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
