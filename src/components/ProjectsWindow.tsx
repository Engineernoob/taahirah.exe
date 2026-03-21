const projects = [
  {
    name: "RetroOS Portfolio",
    url: "github.com/Engineernoob/taahirah.exe",
    description:
      "An interactive portfolio website styled as a retro operating system with draggable windows, BIOS boot screen, and Win95 chrome.",
    tech: ["React", "TypeScript", "CSS"],
    icon: "🖥️",
  },
  {
    name: "Noir - Terminal IDE",
    url: "https://github.com/Engineernoob/Noir",
    description:
      "Noir is a terminal-based IDE for developers who prefer a minimalist, keyboard-driven coding environment. It features a built-in file explorer, code editor with syntax highlighting, and Git integration.",
    tech: ["Rust", "TUI", "Git"],
    icon: "🕶️",
  },
  {
    name: "PatchPilot",
    url: "github.com/Engineernoob/patchpilot",
    description:
      "Open-source AI support engineer for debugging apps, ranking root causes, and generating patch-ready fixes from logs, stack traces, and bug reports.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "🩹",
  },
  {
    name: "StackTrace AI",
    url: "github.com/Engineernoob/stacktrace-ai",
    description:
      "a developer tool that analyzes stack traces and converts them into clear explanations with suggested fixes, leveraging AI to help developers quickly understand and resolve errors in their code.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "📚",
  },
  {
    name: "OpsHub API",
    url: "github.com/Engineernoob/OpsHub",
    description:
      "Production-ready REST API built with TypeScript, Express, Prisma, and PostgreSQL. It provides endpoints for user authentication, project management, and AI-assisted debugging features, serving as the backend for the PatchPilot support engineer tool.",
    tech: ["TypeScript", "Express", "Prisma", "PostgreSQL"],
    icon: "⏿",
  },
];

export default function ProjectsWindow() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
      }}
    >
      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
        }}
      >
        <span style={{ fontSize: 11, color: "#555" }}>
          {projects.length} items
        </span>
      </div>

      {/* ── File list ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* Column headers — Win95 Explorer style */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 120px",
            padding: "2px 12px",
            background: "var(--color-gray-200)",
            borderBottom: "1px solid var(--color-gray-300)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {["", "Name / Description", "Tech"].map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: "#000",
                padding: "2px 4px",
                fontFamily: "Tahoma, Arial, sans-serif",
                boxShadow: "var(--shadow-outer-3)",
                userSelect: "none",
                cursor: "default",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {projects.map((proj, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 120px",
              padding: "6px 12px",
              borderBottom: "1px solid var(--color-gray-100)",
              alignItems: "start",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#000080";
              Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>("[data-text]"),
              ).forEach((el) => (el.style.color = "#fff"));
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "";
              Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>("[data-text]"),
              ).forEach((el) => (el.style.color = ""));
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: 18, lineHeight: 1, paddingTop: 1 }}>
              {proj.icon}
            </span>

            {/* Name + description */}
            <div style={{ paddingRight: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 2,
                }}
              >
                <span
                  data-text
                  style={{
                    fontWeight: "bold",
                    color: "var(--color-blue)",
                    fontSize: 12,
                  }}
                >
                  {proj.name}
                </span>
                {proj.url && (
                  <span data-text style={{ fontSize: 10, color: "#aaa" }}>
                    {proj.url}
                  </span>
                )}
              </div>
              <p
                data-text
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#555",
                  lineHeight: 1.5,
                }}
              >
                {proj.description}
              </p>
            </div>

            {/* Tech stack */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                paddingTop: 2,
              }}
            >
              {proj.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    color: "var(--color-blue)",
                    border: "1px solid var(--color-blue)",
                    padding: "0 4px",
                    background: "#fff",
                    fontFamily: "Tahoma, Arial, sans-serif",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Status bar ────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          borderTop: "1px solid var(--color-gray-300)",
          padding: "2px 12px",
          fontSize: 11,
          color: "#555",
          flexShrink: 0,
          boxShadow: "inset 0 1px 0 #fff",
        }}
      >
        {projects.length} object(s)
      </div>
    </div>
  );
}
