import { useState, useEffect } from "react";
import { playBiosBeep } from "../sounds";

const BIOS_LINES = [
  "",
  "Denmark, Taahirah Inc.",
  "Released: 06/26/1998",
  "",
  "TDBIOS (C)1998 Denmark Taahirah Inc.,",
  "TSP S13 2000-2026 Special UC131S",
  "TSP Portfolio(tm) XX 113",
  "",
  "Checking RAM : 14000 OK",
  "",
  "FINISHED LOADING RESOURCES",
  "",
  "Loaded mouseUp                  ... 63%",
  "Loaded keyboardKeydown2         ... 68%",
  "Loaded mouseDown                ... 74%",
  "Loaded keyboardKeydown3         ... 79%",
  "Loaded ccType                   ... 84%",
  "Loaded keyboardKeydown1         ... 89%",
  "Loaded startup                  ... 95%",
  "Loaded office                   ... 100%",
  "",
  "All Content Loaded, launching 'Portfolio' V1.0",
  "",
  "Press DEL to enter SETUP , ESC to skip memory test",
  "",
];

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // PC speaker POST beep at boot start
  useEffect(() => {
    const id = setTimeout(() => playBiosBeep(), 120);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (visibleLines < BIOS_LINES.length) {
      const delay = BIOS_LINES[visibleLines] === "" ? 50 : 70;
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => onComplete(), 700);
    return () => clearTimeout(timer);
  }, [onComplete, visibleLines]);

  return (
    <div className="bios-screen">
      <div className="scanlines" />
      <div>
        {BIOS_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="bios-line" style={{ whiteSpace: "pre" }}>
            {line === "" ? "\u00A0" : line}
          </div>
        ))}
        {visibleLines < BIOS_LINES.length && <span className="blink-cursor" />}
      </div>
    </div>
  );
}
