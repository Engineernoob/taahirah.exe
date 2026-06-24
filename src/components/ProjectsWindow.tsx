import { useState } from "react";
import type { ProjectData } from "./ProjectDetailWindow";

const projects: (ProjectData & {
  url: string;
  category: string;
  updated: string;
  highlight: string;
})[] = [
  {
    name: "RetroOS Portfolio",
    url: "github.com/Engineernoob/taahirah.exe",
    description:
      "An interactive portfolio website styled as a retro operating system with draggable windows, BIOS boot screen, and Win95 chrome.",
    tech: ["React", "TypeScript", "Three.js", "Vite", "CSS"],
    icon: "🖥️",
    githubUrl: "https://github.com/Engineernoob/taahirah.exe",
    liveUrl: "https://taahirah-exe.vercel.app",
    status: "Live",
    category: "Portfolio OS",
    updated: "June 2026",
    highlight: "Draggable retro windows, BIOS boot flow, and a portfolio that feels like software instead of a static page.",
  },
  {
    name: "Noir - Terminal IDE",
    url: "github.com/Engineernoob/Noir",
    description:
      "Noir is a terminal-based IDE for developers who prefer a minimalist, keyboard-driven coding environment. It features a built-in file explorer, code editor with syntax highlighting, and Git integration.",
    tech: ["Rust", "TUI", "Git"],
    icon: "🕶️",
    githubUrl: "https://github.com/Engineernoob/Noir",
    status: "In-Progress",
    category: "Developer Tools",
    updated: "June 2026",
    highlight: "A keyboard-first IDE experiment focused on speed, focus, and terminal-native workflows.",
  },
  {
    name: "PatchPilot",
    url: "github.com/Engineernoob/patchpilot",
    description:
      "Open-source AI support engineer for debugging apps, ranking root causes, and generating patch-ready fixes from logs, stack traces, and bug reports.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "🩹",
    githubUrl: "https://github.com/Engineernoob/patchpilot",
    status: "In-Progress",
    category: "AI Debugging",
    updated: "June 2026",
    highlight: "Turns noisy bug reports and stack traces into ranked root causes with patch-ready next steps.",
  },
  {
    name: "StackTrace AI",
    url: "github.com/Engineernoob/stacktrace-ai",
    description:
      "A developer tool that analyzes stack traces and converts them into clear explanations with suggested fixes, leveraging AI to help developers quickly understand and resolve errors in their code.",
    tech: ["Python", "Machine Learning", "NLP", "Ollama"],
    icon: "📚",
    githubUrl: "https://github.com/Engineernoob/stacktrace-ai",
    status: "Live",
    category: "AI Developer Tools",
    updated: "June 2026",
    highlight: "Makes stack traces readable by converting raw errors into plain-English explanations and suggested fixes.",
  },
  {
    name: "OpsHub API",
    url: "github.com/Engineernoob/OpsHub",
    description:
      "Production-ready REST API built with TypeScript, Express, Prisma, and PostgreSQL. Provides endpoints for user authentication, project management, and AI-assisted debugging features — serving as the backend for PatchPilot.",
    tech: ["TypeScript", "Express", "Prisma", "PostgreSQL"],
    icon: "⚙️",
    githubUrl: "https://github.com/Engineernoob/OpsHub",
    liveUrl: "https://opshub-api.onrender.com/",
    status: "Live",
    category: "Backend Systems",
    updated: "June 2026",
    highlight: "A production-style API foundation for auth, project management, and AI-assisted debugging workflows.",
  },
  {
    name: "PromptDiff",
    url: "github.com/Engineernoob/PromptDiff",
    description:
      "Prompt Diff is a lightweight web tool that analyzes how changes between two prompts impact an LLM’s behavior. Instead of focusing on surface-level text differences, it highlights meaningful behavioral shifts that affect cost, reliability, and model safety.",
    tech: [" FastAPI", "Jinja2", "Python"],
    icon: "🤖",
    githubUrl: "https://github.com/Engineernoob/PromptDiff",
    liveUrl: "https://promptdiff.onrender.com/",
    status: "Live",
    category: "LLM Evaluation",
    updated: "June 2026",
    highlight: "Compares prompt versions by behavior, not just text changes, so prompt edits become easier to reason about.",
  },
];

interface ProjectsWindowProps {
  onOpenProject?: (project: ProjectData) => void;
}

export default function ProjectsWindow({ onOpenProject }: ProjectsWindowProps) {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const featuredProject = projects[0];
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#fff",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span style={{ fontSize: 11, color: "#555" }}>
            Portfolio Projects Explorer
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ fontSize: 10, color: "#1a4a8b" }}>
              Live: {projects.filter((p) => p.status === "Live").length}
            </span>
            <span style={{ fontSize: 10, color: "#7a3a00" }}>
              In Progress: {projects.filter((p) => p.status === "In-Progress").length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Featured project ─────────────────────────────────── */}
      <div
        style={{
          padding: "10px 14px",
          background: "linear-gradient(90deg, #eef4ff, #ffffff)",
          borderBottom: "1px solid var(--color-gray-300)",
          boxShadow: "inset 0 1px 0 #fff",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>
              Featured Project
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "var(--color-blue)",
                marginBottom: 4,
              }}
            >
              {featuredProject.icon} {featuredProject.name}
            </div>
            <p
              style={{
                margin: 0,
                maxWidth: 720,
                fontSize: 11,
                lineHeight: 1.5,
                color: "#333",
              }}
            >
              {featuredProject.highlight}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenProject?.(featuredProject)}
            style={{
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: 11,
              padding: "3px 10px",
              border: 0,
              background: "var(--color-gray-200)",
              boxShadow: "var(--shadow-outer-3)",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Open Details
          </button>
        </div>
      </div>

      {/* ── Project explorer + preview ───────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 280px",
          background: "#fff",
        }}
      >
        <div style={{ overflowY: "auto", minWidth: 0 }}>
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1.8fr 120px 90px",
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
              className="project-row"
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1.8fr 120px 90px",
                padding: "6px 12px",
                borderBottom: "1px solid var(--color-gray-100)",
                alignItems: "start",
                cursor: "default",
                background: selectedProject.name === proj.name ? "#dfeaff" : "#fff",
                boxShadow:
                  selectedProject.name === proj.name
                    ? "inset 3px 0 0 var(--color-blue)"
                    : "none",
              }}
              onClick={() => setSelectedProject(proj)}
              onDoubleClick={() => onOpenProject?.(proj)}
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
                      textShadow: "1px 1px 0 rgba(255,255,255,0.6)",
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
                <div
                  data-text
                  style={{ fontSize: 10, color: "#777", marginBottom: 3 }}
                >
                  {proj.category} · Updated {proj.updated}
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

              {/* Tech stack — first 3 + overflow count */}
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
                    data-text
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
                {proj.tech.length > 3 && (
                  <span data-text style={{ fontSize: 10, color: "#888" }}>
                    +{proj.tech.length - 3} more
                  </span>
                )}
              </div>

              {/* Status badge */}
              <div style={{ paddingTop: 2 }}>
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 6px",
                    background:
                      proj.status === "Live"
                        ? "#1a4a8b"
                        : proj.status === "In-Progress"
                          ? "#7a3a00"
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

        {/* Preview pane */}
        <aside
          style={{
            borderLeft: "1px solid var(--color-gray-300)",
            background: "var(--color-gray-100)",
            padding: 12,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 10,
              boxShadow: "var(--shadow-inner-2)",
              minHeight: "100%",
            }}
          >
            <div style={{ fontSize: 10, color: "#777", marginBottom: 6 }}>
              Preview Pane
            </div>

            <div style={{ fontSize: 28, marginBottom: 6 }}>
              {selectedProject.icon}
            </div>

            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 14,
                color: "var(--color-blue)",
              }}
            >
              {selectedProject.name}
            </h3>

            <div style={{ fontSize: 10, color: "#777", marginBottom: 10 }}>
              {selectedProject.category} · {selectedProject.status} · {selectedProject.updated}
            </div>

            <p style={{ margin: "0 0 10px", fontSize: 11, lineHeight: 1.5 }}>
              {selectedProject.highlight}
            </p>

            <div style={{ fontSize: 10, fontWeight: "bold", marginBottom: 5 }}>
              Tech Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {selectedProject.tech.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 10,
                    color: "var(--color-blue)",
                    border: "1px solid var(--color-blue)",
                    padding: "1px 5px",
                    background: "#fff",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenProject?.(selectedProject)}
              style={{
                width: "100%",
                fontFamily: "Tahoma, Arial, sans-serif",
                fontSize: 11,
                padding: "4px 8px",
                border: 0,
                background: "var(--color-gray-200)",
                boxShadow: "var(--shadow-outer-3)",
                cursor: "pointer",
              }}
            >
              Open Project Details
            </button>
          </div>
        </aside>
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
        {projects.length} project(s) loaded · Double-click to open project details
      </div>
    </div>
  );
}
