const projects = [
  {
    name: "RetroOS Portfolio",
    url: "github.com/yourhandle/retroos-portfolio",
    description: "An interactive portfolio website styled as a retro operating system with draggable windows, BIOS boot screen, and Win95 chrome.",
    tech: ["React", "TypeScript", "CSS"],
    icon: "🖥️",
  },
  {
    name: "CloudSync API",
    url: "github.com/yourhandle/cloudsync",
    description: "High-performance file synchronisation API handling 1M+ daily operations with real-time conflict resolution and end-to-end encryption.",
    tech: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    icon: "☁️",
  },
  {
    name: "DevDash",
    url: "github.com/yourhandle/devdash",
    description: "Developer productivity dashboard aggregating GitHub, Jira, and Slack metrics into a single unified view with smart alerting.",
    tech: ["React", "GraphQL", "Python", "FastAPI"],
    icon: "📊",
  },
  {
    name: "OpenCart",
    url: "github.com/yourhandle/opencart",
    description: "Open-source e-commerce engine for small businesses. Handles inventory, orders, and payment processing with Stripe.",
    tech: ["TypeScript", "Next.js", "Stripe", "Prisma"],
    icon: "🛒",
  },
  {
    name: "TermChat",
    url: "github.com/yourhandle/termchat",
    description: "Terminal-style real-time chat application with end-to-end encryption and self-hosted deployment support.",
    tech: ["WebSocket", "Node.js", "React", "SQLite"],
    icon: "💬",
  },
  {
    name: "Music Production",
    url: "",
    description: "Electronic music produced in Ableton Live, spanning ambient, lo-fi, and experimental genres. Available on major streaming platforms.",
    tech: ["Ableton", "Max/MSP", "Synthesis"],
    icon: "🎵",
  },
];

export default function ProjectsWindow() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12 }}>

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div style={{
        background: "var(--color-gray-200)",
        padding: "6px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
        boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
      }}>
        <span style={{ fontSize: 11, color: "#555" }}>
          {projects.length} items
        </span>
      </div>

      {/* ── File list ─────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>

        {/* Column headers — Win95 Explorer style */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "28px 1fr 120px",
          padding: "2px 12px",
          background: "var(--color-gray-200)",
          borderBottom: "1px solid var(--color-gray-300)",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}>
          {["", "Name / Description", "Tech"].map((h, i) => (
            <div key={i} style={{
              fontSize: 11,
              color: "#000",
              padding: "2px 4px",
              fontFamily: "Tahoma, Arial, sans-serif",
              boxShadow: "var(--shadow-outer-3)",
              userSelect: "none",
              cursor: "default",
            }}>
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
            onMouseEnter={(e) => { e.currentTarget.style.background = "#000080"; Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-text]")).forEach(el => el.style.color = "#fff"); }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-text]")).forEach(el => el.style.color = ""); }}
          >
            {/* Icon */}
            <span style={{ fontSize: 18, lineHeight: 1, paddingTop: 1 }}>{proj.icon}</span>

            {/* Name + description */}
            <div style={{ paddingRight: 12 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                <span data-text style={{ fontWeight: "bold", color: "var(--color-blue)", fontSize: 12 }}>
                  {proj.name}
                </span>
                {proj.url && (
                  <span data-text style={{ fontSize: 10, color: "#aaa" }}>{proj.url}</span>
                )}
              </div>
              <p data-text style={{ margin: 0, fontSize: 11, color: "#555", lineHeight: 1.5 }}>
                {proj.description}
              </p>
            </div>

            {/* Tech stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
              {proj.tech.map((t) => (
                <span key={t} style={{
                  fontSize: 10,
                  color: "var(--color-blue)",
                  border: "1px solid var(--color-blue)",
                  padding: "0 4px",
                  background: "#fff",
                  fontFamily: "Tahoma, Arial, sans-serif",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Status bar ────────────────────────────────────────── */}
      <div style={{
        background: "var(--color-gray-200)",
        borderTop: "1px solid var(--color-gray-300)",
        padding: "2px 12px",
        fontSize: 11,
        color: "#555",
        flexShrink: 0,
        boxShadow: "inset 0 1px 0 #fff",
      }}>
        {projects.length} object(s)
      </div>
    </div>
  );
}
