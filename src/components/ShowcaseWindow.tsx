import { useMemo, useState } from "react";
import { openResumePdf } from "../resume";

interface ShowcaseWindowProps {
  onOpen: (id: string) => void;
  ownerName: string;
  ownerTitle: string;
}

type ItemId =
  | "projects"
  | "project-ai"
  | "project-terminal"
  | "project-retro"
  | "blog"
  | "resume";

interface ExplorerItem {
  id: ItemId;
  label: string;
  icon: string;
  kind: "folder" | "file";
  level: number;
  parent?: ItemId;
  target?: string;
  meta?: string;
  description: string;
}

interface PreviewAction {
  label: string;
  target?: string;
  kind?: "resume";
}

const EXPLORER_ITEMS: ExplorerItem[] = [
  {
    id: "projects",
    label: "Projects",
    icon: "📁",
    kind: "folder",
    level: 0,
    target: "projects",
    meta: "3 items",
    description: "A folder of selected builds, experiments, and interface work.",
  },
  {
    id: "project-ai",
    label: "AI Assistant",
    icon: "📄",
    kind: "file",
    level: 1,
    parent: "projects",
    target: "projects",
    meta: "Concept note",
    description: "Agent-assisted workflow tooling focused on prompts, automation, and practical UX.",
  },
  {
    id: "project-terminal",
    label: "Terminal IDE",
    icon: "📄",
    kind: "file",
    level: 1,
    parent: "projects",
    target: "projects",
    meta: "Interface concept",
    description: "A keyboard-first coding environment shaped around command palettes, panes, and speed.",
  },
  {
    id: "project-retro",
    label: "Retro Portfolio",
    icon: "📄",
    kind: "file",
    level: 1,
    parent: "projects",
    target: "projects",
    meta: "Live project",
    description: "This Windows 95 portfolio itself: draggable windows, boot flow, and fake shell chrome.",
  },
  {
    id: "blog",
    label: "Blog",
    icon: "📝",
    kind: "folder",
    level: 0,
    target: "blog",
    meta: "3 posts",
    description: "Short writing about the build, experiments, and the case for making stranger work.",
  },
  {
    id: "resume",
    label: "Resume",
    icon: "📄",
    kind: "file",
    level: 0,
    meta: "PDF document",
    description: "The current résumé PDF for direct viewing or download.",
  },
];

const PREVIEW_COPY: Record<ItemId, { title: string; path: string; actions: PreviewAction[] }> = {
  projects: {
    title: "Projects Folder",
    path: "C:\\My Computer\\Projects",
    actions: [{ label: "Open Projects.dir", target: "projects" }],
  },
  "project-ai": {
    title: "AI Assistant",
    path: "C:\\My Computer\\Projects\\AI Assistant.txt",
    actions: [{ label: "Open Projects.dir", target: "projects" }],
  },
  "project-terminal": {
    title: "Terminal IDE",
    path: "C:\\My Computer\\Projects\\Terminal IDE.txt",
    actions: [{ label: "Open Projects.dir", target: "projects" }],
  },
  "project-retro": {
    title: "Retro Portfolio",
    path: "C:\\My Computer\\Projects\\Retro Portfolio.txt",
    actions: [{ label: "Open Projects.dir", target: "projects" }],
  },
  blog: {
    title: "Blog",
    path: "C:\\My Computer\\Blog",
    actions: [{ label: "Open Blog.txt", target: "blog" }],
  },
  resume: {
    title: "Resume",
    path: "C:\\My Computer\\Resume.pdf",
    actions: [
      { label: "Open Resume PDF", kind: "resume" },
      { label: "Open Experience.log", target: "experience" },
      { label: "Open Contact.txt", target: "contact" },
    ],
  },
};

export default function ShowcaseWindow({ onOpen, ownerName, ownerTitle }: ShowcaseWindowProps) {
  const [selectedId, setSelectedId] = useState<ItemId>("projects");
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const visibleItems = useMemo(
    () =>
      EXPLORER_ITEMS.filter(
        (item) => item.level === 0 || (projectsExpanded && item.parent === "projects"),
      ),
    [projectsExpanded],
  );

  const selectedItem =
    EXPLORER_ITEMS.find((item) => item.id === selectedId) ?? EXPLORER_ITEMS[0];
  const preview = PREVIEW_COPY[selectedItem.id];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "var(--color-gray-200)",
      }}
    >
      <div
        style={{
          padding: "6px 10px",
          background: "var(--color-gray-200)",
          boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12 }}>🖥</span>
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "2px 8px",
            boxShadow: "var(--shadow-inner-1)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {preview.path}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRight: "1px solid var(--color-gray-300)",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              background: "var(--color-gray-200)",
              boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
              fontWeight: "bold",
            }}
          >
            My Computer
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            {visibleItems.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  onDoubleClick={() => {
                    if (item.id === "resume") {
                      openResumePdf();
                      return;
                    }
                    if (item.target) onOpen(item.target);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    background: active ? "var(--color-blue)" : "transparent",
                    color: active ? "#fff" : "#000",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    paddingLeft: 10 + item.level * 18,
                    fontFamily: "Tahoma, Arial, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  {item.id === "projects" ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectsExpanded((value) => !value);
                      }}
                      style={{
                        display: "inline-flex",
                        width: 12,
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {projectsExpanded ? "▾" : "▸"}
                    </span>
                  ) : (
                    <span style={{ width: 12, flexShrink: 0 }} />
                  )}
                  <span style={{ width: 16, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            background: "#fff",
          }}
        >
          <div
            style={{
              padding: "14px 16px 12px",
              borderBottom: "1px solid var(--color-gray-100)",
              background:
                "linear-gradient(180deg, rgba(15,0,134,0.10) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <div style={{ fontSize: 19, fontWeight: "bold", color: "var(--color-blue)" }}>
              {preview.title}
            </div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
              {selectedItem.meta ?? "Explorer item"}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <div className="section-header">Overview</div>
            <p className="content-p" style={{ marginTop: 0 }}>
              {selectedItem.description}
            </p>

            <div className="section-header">System Info</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 10px 4px 0", width: 92, color: "#555" }}>Owner</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>{ownerName}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 10px 4px 0", color: "#555" }}>Role</td>
                  <td style={{ padding: "4px 0" }}>{ownerTitle}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 10px 4px 0", color: "#555" }}>Location</td>
                  <td style={{ padding: "4px 0" }}>{preview.path}</td>
                </tr>
              </tbody>
            </table>

            {selectedId === "projects" && (
              <>
                <div className="section-header">Contents</div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14 }}>
                  <tbody>
                    {EXPLORER_ITEMS.filter((item) => item.parent === "projects").map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        onDoubleClick={() => onOpen("projects")}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#000080";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "";
                          e.currentTarget.style.color = "";
                        }}
                      >
                        <td style={{ padding: "4px 8px 4px 0", width: 24 }}>{item.icon}</td>
                        <td style={{ padding: "4px 0" }}>{item.label}</td>
                        <td style={{ padding: "4px 0", textAlign: "right", color: "inherit" }}>
                          {item.meta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {preview.actions.map((action) => (
                <button
                  key={action.label}
                  className="btn"
                  style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12 }}
                  onClick={() => {
                    if (action.kind === "resume") {
                      openResumePdf();
                      return;
                    }
                    if (action.target) onOpen(action.target);
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--color-gray-200)",
          borderTop: "1px solid var(--color-gray-300)",
          padding: "3px 8px",
          boxShadow: "inset 0 1px 0 #fff",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
          fontSize: 11,
        }}
      >
        <span>{visibleItems.length} object(s)</span>
        <span>{selectedItem.label}</span>
      </div>
    </div>
  );
}
