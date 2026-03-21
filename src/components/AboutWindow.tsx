const SKILLS = [
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "AWS",
  "GraphQL",
  "REST APIs",
  "Git",
  "CI/CD",
  "Testing",
];

const QUICK_FACTS = [
  { label: "Role", value: "Software Engineer" },
  { label: "Based", value: "United States" },
  { label: "Focus", value: "Full-Stack Web" },
  { label: "Status", value: "Open to opportunities" },
];

export default function AboutWindow() {
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
      {/* ── Identity header ───────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexShrink: 0,
          boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
        }}
      >
        {/* Avatar box */}
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--color-blue)",
            flexShrink: 0,
            boxShadow: "var(--shadow-outer-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            color: "#fff",
            userSelect: "none",
          }}
        >
          👩🏾‍💻
        </div>
        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: "#000",
              lineHeight: 1.2,
            }}
          >
            Taahirah Denmark
          </div>
          <div
            style={{
              color: "var(--color-gray-300)",
              fontSize: 11,
              marginTop: 2,
            }}
          >
            Software Engineer
          </div>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* Quick facts table */}
        <div style={{ padding: "12px 16px 0" }}>
          <div className="section-header">Info</div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 4,
            }}
          >
            <tbody>
              {QUICK_FACTS.map(({ label, value }) => (
                <tr key={label}>
                  <td
                    style={{
                      padding: "3px 12px 3px 0",
                      color: "#555",
                      fontWeight: "bold",
                      width: 80,
                      verticalAlign: "top",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </td>
                  <td style={{ padding: "3px 0", color: "#000" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Separator */}
        <div
          style={{
            margin: "0 16px",
            height: 1,
            background: "var(--color-gray-300)",
          }}
        />
        <div style={{ margin: "0 16px 10px", height: 1, background: "#fff" }} />

        {/* Bio */}
        <div style={{ padding: "0 16px 12px" }}>
          <div className="section-header">About Me</div>
          <p className="content-p">
            Hi! I'm a software engineer passionate about building clean,
            performant applications. From a young age I've been fascinated by
            how things work — that curiosity led me to programming and
            eventually to full-stack web development.
          </p>
          <p className="content-p">
            I care deeply about user experience, performance, and maintainable
            code. When I'm not at a keyboard you'll find me exploring new
            technologies, working out, cooking, or gaming.
          </p>
        </div>

        {/* Separator */}
        <div
          style={{
            margin: "0 16px",
            height: 1,
            background: "var(--color-gray-300)",
          }}
        />
        <div style={{ margin: "0 16px 10px", height: 1, background: "#fff" }} />

        {/* Skills */}
        <div style={{ padding: "0 16px 16px" }}>
          <div className="section-header">Skills</div>
          <div className="skill-grid">
            {SKILLS.map((s) => (
              <span key={s} className="skill-badge">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
