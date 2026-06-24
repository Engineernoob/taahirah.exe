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
  ailab: { target: "projects", desc: "Open AI Lab" },
  "ai-lab": { target: "projects", desc: "Open AI Lab" },
  projects: { target: "projects", desc: "Open AI Lab / Projects" },
  about: { target: "about", desc: "Open About Me" },
  blog: { target: "internet-explorer", desc: "Open Blog in Internet Explorer" },
  ie: { target: "internet-explorer", desc: "Open Internet Explorer" },
  resume: { target: "experience", desc: "Open Resume.log" },
  experience: { target: "experience", desc: "Open Resume.log" },
  contact: { target: "contact", desc: "Open Contact Terminal" },
  netflix: { target: "netflix", desc: "Open Netflix 95" },
  msn: { target: "msn", desc: "Open MSN Messenger" },
  notepad: { target: "notepad", desc: "Open Notepad" },
  settings: { target: "settings", desc: "Open Display Properties" },
  welcome: { target: "showcase", desc: "Open Taahirah.exe" },
  taahirah: { target: "showcase", desc: "Open Taahirah.exe" },
  explorer: { target: "showcase", desc: "Open Taahirah.exe" },
  help: { action: "help", desc: "Show available commands" },
  cls: { action: "clear", desc: "Clear history" },
  clear: { action: "clear", desc: "Clear history" },
};

const HISTORY_KEY = "run-dialog-history";

const SUGGESTED_COMMANDS = ["ailab", "resume", "blog", "about", "contact"];

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
    const normalizedCmd = cmd.replace(/\s+/g, "-");
    if (!cmd) return;

    // Save to history
    const newHist = [cmd, ...history.filter((h) => h !== cmd)].slice(0, 20);
    setHistory(newHist);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHist));
    setHistIdx(-1);

    const entry = COMMANDS[cmd] ?? COMMANDS[normalizedCmd];

    if (!entry) {
      setError(
        `'${cmd}' is not recognized. Type 'help' or try: ${SUGGESTED_COMMANDS.join(", ")}.`,
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
          Type a command to open a TaahirahOS window. Try <strong>ailab</strong>
          , <strong>resume</strong>, <strong>blog</strong>, or{" "}
          <strong>help</strong>.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginLeft: 44,
        }}
      >
        {SUGGESTED_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            className="btn"
            style={{
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: 10,
              padding: "1px 6px",
            }}
            onClick={() => {
              setInput(cmd);
              setError("");
              setShowHelp(false);
              inputRef.current?.focus();
            }}
          >
            {cmd}
          </button>
        ))}
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
            color: "#00ff66",
            background: "#050505",
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
            setInput("help");
          }}
        >
          Help
        </button>
      </div>
      <div
        style={{
          margin: "0 -12px -12px",
          padding: "3px 8px",
          background: "var(--color-gray-200)",
          borderTop: "1px solid var(--color-gray-300)",
          fontSize: 10,
          color: "#555",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Run.exe ready</span>
        <span>{history.length} command(s) saved</span>
      </div>
    </div>
  );
}
