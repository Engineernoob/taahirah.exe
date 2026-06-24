import { useState, useRef } from "react";

const DEFAULT_TEXT = `TaahirahOS Notepad
==================

Welcome to the built-in writing workspace.

Ideas:
- Draft blog posts
- Capture project ideas
- Prepare networking messages
- Store interview notes
- Plan AI experiments

Quick Commands:
/blog      Draft a new blog post
/project   Sketch a project idea
/network   Draft an outreach message

Notes are automatically saved locally.
`;

const STORAGE_KEY = "win95-notepad-content";

const QUICK_TEMPLATES = [
  {
    label: "Blog",
    content:
      "# Blog Post\n\n## What happened\n\n## What I learned\n\n## What's next\n",
  },
  {
    label: "Project",
    content:
      "# Project Idea\n\nProblem:\n\nSolution:\n\nTech Stack:\n\nNext Steps:\n",
  },
  {
    label: "Networking",
    content:
      "Hi [Name],\n\nI came across your work and wanted to reach out because...\n",
  },
];

function wordCount(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split("\n").length;
  const chars = text.length;
  return { words, lines, chars };
}

export default function NotepadWindow() {
  const [content, setContent] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEXT,
  );
  const [saved, setSaved] = useState(true);
  const [wrap, setWrap] = useState(true);
  const [lastSaved, setLastSaved] = useState<string>("Never");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const save = (text: string) => {
    localStorage.setItem(STORAGE_KEY, text);
    setSaved(true);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
    // Debounced auto-save
    clearTimeout((handleChange as any)._t);
    (handleChange as any)._t = setTimeout(() => save(e.target.value), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      save(content);
    }
    // Tab inserts spaces instead of changing focus
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newContent = content.slice(0, start) + "    " + content.slice(end);
      setContent(newContent);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      }, 0);
    }
  };

  const clear = () => {
    setContent("");
    save("");
  };

  const insertTemplate = (template: string) => {
    setContent(template);
    setSaved(false);
    textareaRef.current?.focus();
  };

  const stats = wordCount(content);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#c0c0c0",
      }}
    >
      {/* ── Menu bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 0,
          padding: "2px 4px",
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          flexShrink: 0,
        }}
      >
        {[
          {
            label: "File",
            items: [
              { label: "Save\tCtrl+S", onClick: () => save(content) },
              { label: "Clear", onClick: clear },
              { label: "──────────", onClick: () => {} },
              {
                label: "New",
                onClick: () => {
                  if (confirm("Discard current content?")) clear();
                },
              },
            ],
          },
          {
            label: "Edit",
            items: [
              {
                label: "Select All\tCtrl+A",
                onClick: () => textareaRef.current?.select(),
              },
              { label: "Word Wrap", onClick: () => setWrap((w) => !w) },
            ],
          },
          {
            label: "Templates",
            items: QUICK_TEMPLATES.map((template) => ({
              label: template.label,
              onClick: () => insertTemplate(template.content),
            })),
          },
        ].map((menu) => (
          <div
            key={menu.label}
            style={{ position: "relative" }}
            className="notepad-menu"
          >
            <button
              style={{
                padding: "2px 8px",
                fontSize: 12,
                fontFamily: "Tahoma",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget.nextSibling as HTMLElement)?.style &&
                  ((e.currentTarget.nextSibling as HTMLElement).style.display =
                    "block");
              }}
              onMouseLeave={(e) => {
                setTimeout(() => {
                  const dd = e.currentTarget.nextSibling as HTMLElement;
                  if (dd && !dd.matches(":hover")) dd.style.display = "none";
                }, 150);
              }}
            >
              {menu.label}
            </button>
            <div
              style={{
                display: "none",
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#c0c0c0",
                zIndex: 100,
                minWidth: 160,
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                boxShadow: "2px 2px 0 #000",
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            >
              {menu.items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    item.onClick();
                    (document.activeElement as HTMLElement)?.blur();
                  }}
                  style={{
                    padding: "4px 16px",
                    cursor: item.label.startsWith("─") ? "default" : "pointer",
                    fontSize: 12,
                    fontFamily: "Tahoma",
                    color: item.label.startsWith("─") ? "#808080" : "#000",
                  }}
                  onMouseEnter={(e) => {
                    if (!item.label.startsWith("─"))
                      (((e.currentTarget as HTMLElement).style.background =
                        "#000080"),
                        ((e.currentTarget as HTMLElement).style.color =
                          "#fff"));
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color =
                      item.label.startsWith("─") ? "#808080" : "#000";
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "4px 8px",
          background: "#d8d8d8",
          borderBottom: "1px solid #808080",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {QUICK_TEMPLATES.map((template) => (
            <button
              key={template.label}
              className="btn"
              style={{ fontSize: 10, fontFamily: "Tahoma" }}
              onClick={() => insertTemplate(template.content)}
            >
              {template.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, color: "#555" }}>Local Workspace</div>
      </div>

      {/* ── Textarea ────────────────────────────────────────────────────────── */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          padding: "6px 8px",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 13,
          lineHeight: 1.6,
          background: "#fffdf7",
          color: "#000",
          whiteSpace: wrap ? "pre-wrap" : "pre",
          overflowWrap: wrap ? "break-word" : "normal",
          overflowX: wrap ? "hidden" : "auto",
          boxSizing: "border-box",
          borderTop: "2px solid #808080",
          borderLeft: "2px solid #808080",
        }}
      />

      {/* ── Status bar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "1px solid #808080",
          padding: "2px 8px",
          boxShadow: "inset 0 1px 0 #fff",
          fontSize: 10,
          color: "#444",
          display: "flex",
          gap: 16,
          flexShrink: 0,
          justifyContent: "space-between",
        }}
      >
        <span>
          Ln{" "}
          {
            content
              .slice(0, textareaRef.current?.selectionStart ?? 0)
              .split("\n").length
          }
          , Col{" "}
          {(textareaRef.current?.selectionStart ?? 0) -
            content.lastIndexOf(
              "\n",
              (textareaRef.current?.selectionStart ?? 1) - 1,
            )}
        </span>
        <span>
          {stats.words} words · {stats.lines} lines · {stats.chars} chars
        </span>
        <span
          style={{
            color: saved ? "#007700" : "#cc0000",
            display: "flex",
            gap: 8,
          }}
        >
          <span>{saved ? "✓ Saved" : "● Unsaved"}</span>
          <span style={{ color: "#555" }}>Last: {lastSaved}</span>
        </span>
      </div>
    </div>
  );
}
