import { useState, useRef, useEffect } from "react";

interface RunDialogProps {
  onOpen: (id: string) => void;
  onClose: () => void;
}

// Known commands → window IDs or special actions
const COMMANDS: Record<
  string,
  { target?: string; action?: string; desc: string }
> = {
  projects: { target: "projects", desc: "Open Projects window" },
  about: { target: "about", desc: "Open About window" },
  blog: { target: "blog", desc: "Open Blog window" },
  resume: { target: "resume", desc: "Open Resume" },
  contact: { target: "contact", desc: "Open Contact window" },
  netflix: { target: "netflix", desc: "Open Netflix 95" },
  msn: { target: "msn", desc: "Open MSN Messenger" },
  notepad: { target: "notepad", desc: "Open Notepad" },
  settings: { target: "settings", desc: "Open Settings" },
  welcome: { target: "welcome", desc: "Open Welcome screen" },
  explorer: { target: "showcase", desc: "Open My Computer" },
  help: { action: "help", desc: "Show available commands" },
  cls: { action: "clear", desc: "Clear history" },
  clear: { action: "clear", desc: "Clear history" },
};

const HISTORY_KEY = "run-dialog-history";

export default function RunDialog({ onOpen, onClose }: RunDialogProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const run = () => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    // Save to history
    const newHist = [cmd, ...history.filter((h) => h !== cmd)].slice(0, 20);
    setHistory(newHist);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
    setHistIdx(-1);

    const entry = COMMANDS[cmd];

    if (!entry) {
      setError(
        `'${cmd}' is not recognized as an internal or external command.`,
      );
      setShowHelp(false);
      return;
    }

    if (entry.action === "help") {
      setShowHelp(true);
      setError("");
      setInput("");
      return;
    }

    if (entry.action === "clear") {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      setError("");
      setShowHelp(false);
      setInput("");
      return;
    }

    if (entry.target) {
      onOpen(entry.target);
      onClose();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      run();
      return;
    }
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#c0c0c0",
        padding: 12,
        gap: 10,
      }}
    >
      {/* Icon + description row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32, lineHeight: 1 }}>🖥</div>
        <div style={{ fontSize: 11, color: "#222", lineHeight: 1.6 }}>
          Type the name of a program, folder, or window to open it.
        </div>
      </div>

      {/* Win95 sunken divider */}
      <div style={{ height: 1, background: "#808080" }} />
      <div style={{ height: 1, background: "#fff", marginTop: -10 }} />

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ flexShrink: 0, fontSize: 12 }}>Open:</label>
        <input
          ref={inputRef}
          className="field"
          style={{
            flex: 1,
            fontFamily: "Courier New, monospace",
            fontSize: 12,
          }}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
            setShowHelp(false);
          }}
          onKeyDown={onKeyDown}
          list="run-history"
          autoComplete="off"
        />
        <datalist id="run-history">
          {history.map((h) => (
            <option key={h} value={h} />
          ))}
        </datalist>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: "6px 8px",
            background: "#fff",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            fontSize: 11,
            color: "#c00",
            lineHeight: 1.5,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Help output */}
      {showHelp && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#000",
            color: "#0f0",
            fontFamily: "Courier New, monospace",
            fontSize: 11,
            padding: "8px 10px",
            lineHeight: 1.8,
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
          }}
        >
          <div style={{ color: "#fff", marginBottom: 4 }}>
            Available commands:
          </div>
          {Object.entries(COMMANDS).map(([cmd, { desc }]) => (
            <div key={cmd}>
              <span
                style={{
                  color: "#0ff",
                  minWidth: 100,
                  display: "inline-block",
                }}
              >
                {cmd.padEnd(14)}
              </span>
              <span style={{ color: "#0f0" }}>{desc}</span>
            </div>
          ))}
          <div style={{ color: "#888", marginTop: 8 }}>
            ↑↓ arrow keys to browse history · ESC to close
          </div>
        </div>
      )}

      {/* Button row */}
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "flex-end",
          marginTop: "auto",
        }}
      >
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 64 }}
          onClick={run}
        >
          OK
        </button>
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 64 }}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 64 }}
          onClick={() => {
            setShowHelp(true);
            setError("");
          }}
        >
          Help
        </button>
      </div>
    </div>
  );
}
