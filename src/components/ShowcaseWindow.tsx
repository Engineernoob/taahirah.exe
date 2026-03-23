import { useState } from "react";

interface ShowcaseWindowProps {
  onOpen: (id: string) => void;
}

const QUICK_LINKS = [
  {
    id: "projects",
    icon: "📁",
    label: "Projects",
    desc: "See what I've built",
  },
  { id: "about", icon: "👤", label: "About Me", desc: "Who I am" },
  { id: "blog", icon: "📝", label: "Blog", desc: "Things I've written" },
  {
    id: "resume",
    icon: "📄",
    label: "Resume",
    desc: "Download / view my résumé",
  },
  { id: "contact", icon: "✉️", label: "Contact", desc: "Get in touch" },
  {
    id: "netflix",
    icon: "🎬",
    label: "Netflix 95",
    desc: "A little easter egg 👀",
  },
];

const TIPS = [
  "Double-click any desktop icon to open a window.",
  "Windows are draggable — rearrange the desktop however you like.",
  "Click the monitors in the 3D room to zoom in.",
  "Check the Blog window for devlogs and thoughts.",
  "The Netflix 95 window is hidden in the taskbar — go find it.",
  "Right-click the desktop for options.",
];

export default function ShowcaseWindow({ onOpen }: ShowcaseWindowProps) {
  const [tipIdx] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* ── Blue hero banner ──────────────────────────────────────────────────── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #000080 0%, #1a1aaa 60%, #0000cc 100%)",
          padding: "18px 20px 16px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 58,
            height: 58,
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.35)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "0.05em",
            boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.2)",
          }}
        >
          TD
        </div>

        <div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Welcome to
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Taahirah Denmark
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.8)",
              marginTop: 3,
            }}
          >
            Software Engineer · Lewis University CS '27
          </div>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {/* Intro blurb */}
        <p
          style={{
            margin: "0 0 14px",
            lineHeight: 1.7,
            color: "#222",
            fontSize: 12,
          }}
        >
          Hey — glad you're here. This portfolio runs like a desktop operating
          system. Every window is a real app. Open them, drag them around, and
          explore. Use the quick-launch buttons below or double-click any icon
          on the desktop.
        </p>

        {/* Win95 divider */}
        <div style={{ height: 1, background: "#808080", margin: "0 0 1px" }} />
        <div style={{ height: 1, background: "#fff", margin: "0 0 12px" }} />

        {/* Quick launch grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {QUICK_LINKS.map(({ id, icon, label, desc }) => (
            <button
              key={id}
              onClick={() => onOpen(id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 10px",
                background: "#f0f0f0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Tahoma, Arial, sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#000080";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#f0f0f0";
                (e.currentTarget as HTMLButtonElement).style.color = "#000";
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>
                {icon}
              </span>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 11 }}>{label}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>
                  {desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Win95 divider */}
        <div style={{ height: 1, background: "#808080", margin: "0 0 1px" }} />
        <div style={{ height: 1, background: "#fff", margin: "0 0 12px" }} />

        {/* Tip of the day */}
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            padding: "8px 10px",
            background: "#fffff0",
            border: "1px solid #c8c800",
          }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
          <div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: 10,
                color: "#666",
                letterSpacing: "0.05em",
                marginBottom: 3,
                textTransform: "uppercase",
              }}
            >
              Did you know?
            </div>
            <div style={{ fontSize: 11, color: "#333", lineHeight: 1.6 }}>
              {TIPS[tipIdx]}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "2px solid",
          borderColor: "#fff #808080 #808080 #fff",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          gap: 8,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem("welcome-dismissed", "1");
              } else {
                localStorage.removeItem("welcome-dismissed");
              }
            }}
          />
          Don't show this again
        </label>

        <button
          className="btn"
          style={{
            fontFamily: "Tahoma, Arial, sans-serif",
            fontSize: 12,
            minWidth: 80,
          }}
          onClick={() => setDismissed(true)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
