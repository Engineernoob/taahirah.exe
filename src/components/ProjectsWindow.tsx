import { ProjectData } from "./ProjectDetailWindow";

const projects: (ProjectData & { url: string })[] = [
  {
    name: "RetroOS Portfolio",
    url: "github.com/Engineernoob/taahirah.exe",
    description:
      "An interactive portfolio website styled as a retro operating system with draggable windows, BIOS boot screen, and Win95 chrome.",
    tech: ["React", "TypeScript", "CSS"],
    icon: "🖥️",
    status: "In-Progress"
  },
  {
    name: "Noir - Terminal IDE",
    url: "https://github.com/Engineernoob/Noir",
    description:
      "Noir is a terminal-based IDE for developers who prefer a minimalist, keyboard-driven coding environment. It features a built-in file explorer, code editor with syntax highlighting, and Git integration.",
    tech: ["Rust", "TUI", "Git"],
    icon: "🕶️",
    status: "In-Progress"
  },
  {
    name: "PatchPilot",
    url: "github.com/Engineernoob/patchpilot",
    description:
      "Open-source AI support engineer for debugging apps, ranking root causes, and generating patch-ready fixes from logs, stack traces, and bug reports.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "🩹",
    status: "In-Progress"
  },
  {
    name: "StackTrace AI",
    url: "github.com/Engineernoob/stacktrace-ai",
    description:
      "a developer tool that analyzes stack traces and converts them into clear explanations with suggested fixes, leveraging AI to help developers quickly understand and resolve errors in their code.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "📚",
    status: "In-Progress"
  },
  {
    name: "OpsHub API",
    url: "github.com/Engineernoob/OpsHub",
    description:
      "Production-ready REST API built with TypeScript, Express, Prisma, and PostgreSQL. It provides endpoints for user authentication, project management, and AI-assisted debugging features, serving as the backend for the PatchPilot support engineer tool.",
    tech: ["TypeScript", "Express", "Prisma", "PostgreSQL"],
    icon: "⏿",
    status: "In-Progress"
  },
  {
    name: "AI Knowledge Agent",
    url: "github.com/Engineernoob/ai-knowledge-agent",
    description:
      "A responsive AI chatbot with light/dark mode toggle, collapsible side nav, and a conversational interface for asking questions. React frontend backed by a Flask AI layer.",
    tech: ["React", "Chakra UI", "Python", "Flask"],
    icon: "🤖",
    githubUrl: "https://github.com/Engineernoob/ai-knowledge-agent",
    status: "Completed",
  },
];

interface ProjectsWindowProps {
  onOpenProject?: (project: ProjectData) => void;
}

export default function ProjectsWindow({ onOpenProject }: ProjectsWindowProps) {
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
          {projects.length} items — double-click a project to open
        </span>
      </div>

      {/* ── File list ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 110px 80px",
            padding: "2px 12px",
            background: "var(--color-gray-200)",
            borderBottom: "1px solid var(--color-gray-300)",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {["", "Name / Description", "Tech", "Status"].map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: 11,
                color: "#000",
                padding: "2px 4px",
                boxShadow: "var(--shadow-outer-3)",
                userSelect: "none",
                fontFamily: "Tahoma, Arial, sans-serif",
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
              gridTemplateColumns: "28px 1fr 110px 80px",
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
            onDoubleClick={() => onOpenProject?.(proj)}
          >
            <span style={{ fontSize: 18, lineHeight: 1, paddingTop: 1 }}>
              {proj.icon}
            </span>

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

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                paddingTop: 2,
              }}
            >
              {proj.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    color: "var(--color-blue)",
                    border: "1px solid var(--color-blue)",
                    padding: "0 4px",
                    background: "#fff",
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                >
                  {t}
                </span>
              ))}
              {proj.tech.length > 3 && (
                <span style={{ fontSize: 10, color: "#888" }}>
                  +{proj.tech.length - 3} more
                </span>
              )}
            </div>

            <div style={{ paddingTop: 2 }}>
              <span
                style={{
                  fontSize: 9,
                  padding: "1px 6px",
                  background:
                    proj.status === "Live"
                      ? "#1a4a8b"
                      : proj.status === "Ongoing"
                        ? "#5a3a00"
                        : "#1a5a1a",
                  color: "#fff",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                }}
              >
                {proj.status}
              </span>
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
        {projects.length} object(s) · Double-click any row to view details
      </div>
    </div>
  );
}
