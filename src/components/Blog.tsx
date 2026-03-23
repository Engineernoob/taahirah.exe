import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type BlogPost = {
  id: string;
  title: string;
  date: string;
  category: Category;
  excerpt: string;
  content: ContentBlock[];
};

type Category = "Devlog" | "Experiments" | "Thoughts" | "Career";

// Content block types for rich formatting
type ContentBlock =
  | { type: "p";    text: string }
  | { type: "h3";   text: string }
  | { type: "ul";   items: string[] }
  | { type: "code"; text: string }
  | { type: "hr" };

// ── Posts ─────────────────────────────────────────────────────────────────────
const POSTS: BlogPost[] = [
  {
    id: "building-a-retro-desktop-portfolio",
    title: "Building a Retro Desktop Portfolio",
    date: "March 21, 2026",
    category: "Devlog",
    excerpt:
      "Why I stopped making generic portfolio sites and built a Windows 95-style desktop with a live 3D room instead.",
    content: [
      {
        type: "p",
        text: "I got tired of modern portfolios all looking the same. Same hero section. Same gradient. Same 'crafting digital experiences' copy. Same scrolljacked animations that make you wait three seconds to read a single sentence.",
      },
      {
        type: "p",
        text: "So I built mine like a retro operating system instead — complete with a 3D room you zoom into, draggable Win95 windows, a fake BIOS boot sequence, and a Netflix clone hiding inside one of the windows.",
      },
      { type: "h3", text: "The 3D Landing Scene" },
      {
        type: "p",
        text: "The entry point is a Three.js room — a dark walnut desk with dual monitors, a bookshelf full of manga, anime posters, a cork board, and a whiteboard with system design diagrams. When you click, the camera zooms into the right monitor and the desktop loads.",
      },
      {
        type: "p",
        text: "Getting the monitor stands to actually connect to the panels took way longer than I'd like to admit. The core issue: Three.js BoxGeometry local +Z is the 'front' face. The camera sits at positive Z looking toward negative Z. So monitors at MON_Z = -0.18 with zero Y-rotation already face the camera correctly — no Math.PI needed. Every time I added that rotation trying to 'fix' facing, I was actually flipping them toward the back wall.",
      },
      { type: "h3", text: "The Desktop UI" },
      {
        type: "p",
        text: "Windows are draggable, resizable, minimizable, and z-indexed correctly. The taskbar tracks open windows. Double-clicking icons opens apps. Right now the apps include: Projects, Blog, About, Resume, Netflix 95, and a Contact form.",
      },
      {
        type: "ul",
        items: [
          "React 18 + TypeScript for the UI layer",
          "Three.js r128 for the 3D landing scene",
          "Web Audio API for all sounds — no audio files",
          "95.css for authentic Win95 widget styles",
          "Vite for bundling, Vercel for deployment",
        ],
      },
      {
        type: "p",
        text: "The best part of the project is that the portfolio itself is the proof of work. You don't need to read a bullet list of skills — you can just look around the room.",
      },
    ],
  },
  {
    id: "lessons-from-building-noir-ide",
    title: "What I Learned Building a Terminal IDE",
    date: "March 19, 2026",
    category: "Devlog",
    excerpt:
      "Nova is a browser-based terminal IDE I'm building. Here's what I've learned about dev tooling, Monaco, and scope creep.",
    content: [
      {
        type: "p",
        text: "Nova started as a simple idea: a dark, minimal, browser-based IDE with a built-in terminal aesthetic. No sidebars. No icon forests. Just code and output.",
      },
      {
        type: "p",
        text: "Three weeks in, it had grown into a multi-tab editor with a virtual file system, a plugin API, and a theme engine. Classic scope creep. I had to cut it back hard.",
      },
      { type: "h3", text: "Monaco Is Both a Gift and a Trap" },
      {
        type: "p",
        text: "Monaco Editor (the engine behind VS Code) is incredible out of the box. Language support, IntelliSense, diff views — it's all there. But integrating it into a custom React app with a non-standard layout requires fighting it constantly.",
      },
      {
        type: "ul",
        items: [
          "Web Worker setup for language services is non-trivial",
          "The editor resizes poorly inside flex/grid containers without explicit resize observers",
          "Custom themes require registering before mounting — order matters",
          "Keybindings conflict with browser shortcuts and need careful overriding",
        ],
      },
      { type: "h3", text: "The File System Problem" },
      {
        type: "p",
        text: "A browser IDE needs somewhere to put files. The File System Access API is the right answer for a desktop-class experience, but the permission model is clunky for a first-run user. I ended up using an in-memory virtual FS with optional persistence to localStorage for the MVP.",
      },
      {
        type: "code",
        text: `// Virtual FS node
type FSNode =
  | { kind: "file";   content: string }
  | { kind: "dir";    children: Map<string, FSNode> };`,
      },
      {
        type: "p",
        text: "The lesson: don't build the perfect infrastructure before building the thing. Ship a version that works for the core use case, then layer in persistence, collaboration, and plugins after you know what users actually need.",
      },
    ],
  },
  {
    id: "why-weird-projects-beat-safe-ones",
    title: "Weird Projects Beat Safe Ones",
    date: "March 18, 2026",
    category: "Thoughts",
    excerpt:
      "Memorable, opinionated builds get more attention than another polished but forgettable CRUD app.",
    content: [
      {
        type: "p",
        text: "A lot of people build safe portfolio projects because they think 'professional' means bland. A task manager. A weather app. An e-commerce clone. Technically fine. Completely forgettable.",
      },
      {
        type: "p",
        text: "I disagree with safe as a default strategy.",
      },
      { type: "h3", text: "Weird Is Memorable" },
      {
        type: "p",
        text: "A browser OS, a retro game launcher, a creepy analog-horror microsite — those things tell me more about a builder than another task manager ever will. They show taste, they show range, and they show that you're building things you actually care about.",
      },
      {
        type: "ul",
        items: [
          "Safe projects prove competence",
          "Weird projects prove taste",
          "Taste is the part people can't fake",
        ],
      },
      { type: "h3", text: "The Interviewer Test" },
      {
        type: "p",
        text: "Think about what happens when a hiring manager looks at ten portfolios in a row. Nine of them have the same three projects. One has a Windows 95 desktop with a Three.js room and a BIOS boot sequence. Which one are they going to remember? Which one are they going to show their team?",
      },
      {
        type: "p",
        text: "I'm not saying ignore fundamentals. Learn your data structures. Understand the runtime. Know why your code is slow. But once you've got the foundations, build the weird thing. The weird thing is the one that opens doors.",
      },
    ],
  },
  {
    id: "patchpilot-devlog",
    title: "PatchPilot: AI-Powered Dependency Updates",
    date: "March 15, 2026",
    category: "Experiments",
    excerpt:
      "I'm building a tool that reads your package.json, finds outdated deps, and writes the migration code for you.",
    content: [
      {
        type: "p",
        text: "Dependency updates are boring, error-prone, and skipped by most teams until something breaks in production. PatchPilot is my attempt to automate the painful part.",
      },
      {
        type: "p",
        text: "The idea: point it at a repo, and it reads the current package.json, checks against the npm registry, identifies outdated packages, and uses an LLM to generate migration steps — including code changes where the API has changed.",
      },
      { type: "h3", text: "The Hard Part Isn't the LLM" },
      {
        type: "p",
        text: "Generating a summary of what changed in a major version is easy with an LLM. The hard part is making the output actually safe to apply automatically. Breaking changes in major releases can be subtle — a removed option, a changed default, a renamed export.",
      },
      {
        type: "p",
        text: "My current approach is conservative: PatchPilot generates a migration plan and a set of suggested code edits, but always requires human review before applying. It's a co-pilot, not an autopilot.",
      },
      { type: "h3", text: "Current Status" },
      {
        type: "ul",
        items: [
          "✓ Reads package.json and identifies outdated deps",
          "✓ Pulls changelog/release notes from GitHub",
          "✓ Generates human-readable migration guide",
          "→ Code-level diff generation (in progress)",
          "→ PR creation via GitHub API (planned)",
        ],
      },
      {
        type: "p",
        text: "If you're dealing with a project that's years behind on its dependencies, I'd love a beta tester. Hit the contact window.",
      },
    ],
  },
  {
    id: "breaking-into-software-without-a-cs-degree",
    title: "What It's Actually Like Studying CS at Lewis University",
    date: "March 10, 2026",
    category: "Career",
    excerpt:
      "I'm a Junior pursuing my BS in Computer Science at Lewis University. Here's what I've learned so far — inside and outside the classroom.",
    content: [
      {
        type: "p",
        text: "I'm currently a Junior at Lewis University in Romeoville, IL, working toward my Bachelor of Science in Computer Science. I'm somewhere in that middle stretch of a degree where the fundamentals are solid but the real-world application is just starting to click.",
      },
      {
        type: "p",
        text: "Here's an honest look at what that experience has been like — what the coursework has given me, where I've had to go beyond it, and what I'm building toward.",
      },
      { type: "h3", text: "What the Classroom Gets Right" },
      {
        type: "ul",
        items: [
          "Data structures and algorithms — genuinely useful, not just for interviews",
          "Systems thinking — understanding what's happening below the abstraction",
          "Discrete math and theory — harder to appreciate now, clearly foundational later",
          "Working in teams on longer-horizon projects with real deadlines",
        ],
      },
      { type: "h3", text: "Where I've Gone Beyond the Curriculum" },
      {
        type: "p",
        text: "The degree teaches you to think. It doesn't always teach you to ship. So I've been filling that gap myself — building real projects, learning React, TypeScript, Three.js, and Node outside of class, and deploying things people can actually use.",
      },
      {
        type: "p",
        text: "This portfolio is part of that. So is Noir (my terminal IDE project), PatchPilot, and StackTrace AI. None of those came from coursework. They came from wanting to build things I actually cared about.",
      },
      { type: "h3", text: "What I'm Working Toward" },
      {
        type: "p",
        text: "I graduate in 2027. Between now and then I'm focused on two things: going deep on software engineering fundamentals, and shipping enough real work that my portfolio speaks louder than my GPA.",
      },
      {
        type: "p",
        text: "If you're a recruiter or engineer who wants to talk — the contact window is right there on the desktop.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<Category, string> = {
  Devlog:      "#000080",
  Experiments: "#8b0000",
  Thoughts:    "#1a5c1a",
  Career:      "#5a3a00",
};

function readingTime(blocks: ContentBlock[]): number {
  const words = blocks.reduce((acc, b) => {
    if (b.type === "p" || b.type === "h3" || b.type === "code") return acc + b.text.split(" ").length;
    if (b.type === "ul") return acc + b.items.join(" ").split(" ").length;
    return acc;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}

function isNew(dateStr: string): boolean {
  const posted = new Date(dateStr);
  const now = new Date();
  return (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24) <= 7;
}

// ── Content renderer ──────────────────────────────────────────────────────────
function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "h3":
      return (
        <p key={i} style={{
          margin: "14px 0 6px",
          fontWeight: "bold",
          fontSize: 12,
          fontFamily: "Tahoma, Arial, sans-serif",
          color: "#000080",
          borderBottom: "1px solid #c0c0c0",
          paddingBottom: 3,
        }}>
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul key={i} style={{
          margin: "0 0 12px 18px",
          padding: 0,
          fontSize: 12,
          lineHeight: 1.8,
          color: "#222",
          fontFamily: "Tahoma, Arial, sans-serif",
        }}>
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre key={i} style={{
          margin: "0 0 12px",
          padding: "8px 10px",
          background: "#1e1e1e",
          color: "#d4d4d4",
          fontSize: 11,
          fontFamily: "'Courier New', monospace",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          overflowX: "auto",
          lineHeight: 1.6,
          whiteSpace: "pre",
        }}>
          {block.text}
        </pre>
      );
    case "hr":
      return (
        <div key={i} style={{ margin: "12px 0" }}>
          <div style={{ height: 1, background: "#808080" }} />
          <div style={{ height: 1, background: "#fff" }} />
        </div>
      );
    default: // "p"
      return (
        <p key={i} style={{
          margin: "0 0 12px",
          lineHeight: 1.75,
          color: "#222",
          fontSize: 12,
          fontFamily: "Tahoma, Arial, sans-serif",
        }}>
          {block.text}
        </p>
      );
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Blog() {
  const [selectedId, setSelectedId] = useState<string>(POSTS[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return POSTS;
    return POSTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedPost =
    filteredPosts.find(p => p.id === selectedId) ?? filteredPosts[0] ?? null;

  return (
    <div style={{
      height: "100%",
      display: "grid",
      gridTemplateColumns: "220px 1fr",
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: 12,
      overflow: "hidden",
    }}>

      {/* ── Left pane — post list ───────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        borderRight: "2px solid",
        borderColor: "#808080 #fff #fff #808080",
        background: "var(--color-gray-200, #c0c0c0)",
        overflow: "hidden",
      }}>

        {/* Search bar */}
        <div style={{
          padding: "5px 6px",
          borderBottom: "1px solid #808080",
          background: "#c0c0c0",
        }}>
          <input
            className="field"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search posts..."
            style={{
              width: "100%",
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: 11,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Post list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredPosts.length === 0 ? (
            <div style={{ padding: "10px 8px", color: "#555", fontSize: 11 }}>
              No posts found.
            </div>
          ) : (
            filteredPosts.map(post => {
              const active = selectedPost?.id === post.id;
              const mins = readingTime(post.content);
              const fresh = isNew(post.date);
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedId(post.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "7px 9px",
                    border: "none",
                    borderBottom: "1px solid #a0a0a0",
                    background: active ? "#000080" : "transparent",
                    color: active ? "#fff" : "#000",
                    cursor: "pointer",
                    fontFamily: "Tahoma, Arial, sans-serif",
                  }}
                >
                  {/* Title row */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 4,
                    fontWeight: "bold",
                    fontSize: 11,
                    marginBottom: 3,
                    lineHeight: 1.3,
                  }}>
                    <span style={{ flex: 1 }}>{post.title}</span>
                    {fresh && (
                      <span style={{
                        fontSize: 8,
                        padding: "1px 3px",
                        background: active ? "rgba(255,255,255,0.25)" : "#cc0000",
                        color: "#fff",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>NEW</span>
                    )}
                  </div>

                  {/* Meta row */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 10,
                    opacity: 0.85,
                  }}>
                    <span
                      style={{
                        padding: "0 4px",
                        background: active
                          ? "rgba(255,255,255,0.2)"
                          : (CATEGORY_COLORS[post.category] ?? "#444"),
                        color: "#fff",
                        fontSize: 9,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span style={{ marginLeft: "auto" }}>{mins} min</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Status bar */}
        <div style={{
          padding: "2px 8px",
          borderTop: "1px solid #808080",
          fontSize: 10,
          color: "#444",
          background: "#c0c0c0",
          boxShadow: "inset 0 1px 0 #fff",
        }}>
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Right pane — post content ───────────────────────────────────────── */}
      <div style={{ overflowY: "auto", background: "#fff" }}>
        {selectedPost ? (
          <div style={{ padding: "14px 18px" }}>

            {/* Header */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  background: CATEGORY_COLORS[selectedPost.category] ?? "#000080",
                  color: "#fff",
                  letterSpacing: "0.06em",
                }}>
                  {selectedPost.category}
                </span>
                <span style={{ fontSize: 10, color: "#777" }}>
                  {selectedPost.date} · {readingTime(selectedPost.content)} min read
                </span>
                {isNew(selectedPost.date) && (
                  <span style={{
                    fontSize: 9,
                    padding: "1px 4px",
                    background: "#cc0000",
                    color: "#fff",
                  }}>NEW</span>
                )}
              </div>

              <h2 style={{
                margin: "0 0 8px",
                fontSize: 17,
                fontFamily: "Tahoma, Arial, sans-serif",
                fontWeight: "bold",
                color: "#000",
                lineHeight: 1.25,
              }}>
                {selectedPost.title}
              </h2>

              <p style={{
                margin: 0,
                fontStyle: "italic",
                color: "#555",
                fontSize: 12,
                lineHeight: 1.5,
              }}>
                {selectedPost.excerpt}
              </p>
            </div>

            {/* Win95 double-rule separator */}
            <div style={{ height: 1, background: "#808080", margin: "0 0 1px" }} />
            <div style={{ height: 1, background: "#fff", marginBottom: 14 }} />

            {/* Body */}
            <article>
              {selectedPost.content.map((block, i) => renderBlock(block, i))}
            </article>

            {/* Footer */}
            <div style={{
              marginTop: 20,
              paddingTop: 8,
              borderTop: "1px solid #c0c0c0",
              fontSize: 10,
              color: "#888",
            }}>
              taahirah.exe · {selectedPost.date}
            </div>

          </div>
        ) : (
          <div style={{ padding: 20, color: "#777", fontSize: 12 }}>
            No post selected.
          </div>
        )}
      </div>
    </div>
  );
}