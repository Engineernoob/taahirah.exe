import {
  downloadResumePdf,
  openResumePdf,
  RESUME_LAST_UPDATED,
} from "../resume";

const SUMMARY_CARDS = [
  { label: "Primary Track", value: "AI Engineering" },
  { label: "Strength", value: "Developer Tools" },
  { label: "Experience", value: "Product + Ops" },
  { label: "Resume", value: `Updated ${RESUME_LAST_UPDATED}` },
];

const experiences = [
  {
    company: "Series: AI Native Social Platform",
    role: "Software Engineer Intern",
    date: "2025",
    tech: ["React", "Firebase", "TypeScript", "Product Engineering"],
    bullets: [
      "Built and refined product features for an AI-native social platform, working across frontend UI, data structure, and user profile flows.",
      "Collaborated on Firebase-backed profile architecture and implementation details for scalable user data handling.",
      "Contributed research, documentation, and product thinking to support feature planning and team execution.",
    ],
  },
  {
    company: "AI + Developer Tools Projects",
    role: "Independent Builder",
    date: "2025 – Present",
    tech: ["Python", "React", "Ollama", "FastAPI", "TypeScript"],
    bullets: [
      "Built PatchPilot, an AI debugging assistant that turns stack traces and bug reports into ranked root-cause candidates and patch-ready next steps.",
      "Created Recuris, an experimental autonomous software team with agent roles, task planning, and local-first workflow ideas.",
      "Developed RetroOS Portfolio, an interactive Windows-inspired portfolio system with draggable windows, project previews, and custom UI interactions.",
      "Experimented with local LLMs, retrieval, prompt evaluation, and developer-facing AI workflows through multiple hands-on projects.",
    ],
  },
  {
    company: "High-Volume Service Environments (Various Roles)",
    role: "Operations Specialist",
    date: "2019 – Present",
    tech: ["Customer Service", "Team Leadership", "Process Optimization"],
    bullets: [
      "Worked in fast-paced service environments requiring accuracy, prioritization, communication, and calm execution under pressure.",
      "Managed high-volume workflows where timing, quality, and consistency directly affected customer experience.",
      "Built strong operational instincts around reliability, process improvement, and real-time problem solving.",
    ],
  },
];

const education = {
  school: "Lewis University",
  degree: "B.S. Computer Science",
  date: "Class of 2027",
  note: "Focus on software engineering, systems design, and applied AI development.",
};

export default function ExperienceWindow() {
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
      {/* ── Header ────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
        }}
      >
        <div>
          <div style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}>
            Experience.log
          </div>
          <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
            Work history, project experience, and education
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="btn"
            style={{
              fontSize: 11,
              fontFamily: "Tahoma, Arial, sans-serif",
              padding: "1px 10px",
            }}
            onClick={openResumePdf}
          >
            Open PDF
          </button>
          <button
            className="btn"
            style={{
              fontSize: 11,
              fontFamily: "Tahoma, Arial, sans-serif",
              padding: "1px 10px",
            }}
            onClick={downloadResumePdf}
          >
            Download
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#fff",
          padding: "12px 16px",
        }}
      >
        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {SUMMARY_CARDS.map((card) => (
            <div
              key={card.label}
              style={{
                background: "var(--color-gray-100)",
                border: "1px solid var(--color-gray-300)",
                boxShadow: "inset 1px 1px 0 #fff",
                padding: "8px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#666",
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: "bold",
                  color: "var(--color-blue)",
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Positioning note */}
        <div
          style={{
            padding: "10px 12px",
            background: "linear-gradient(90deg, #eef4ff, #ffffff)",
            border: "1px solid #b8c7e6",
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          <strong>Career focus:</strong> AI engineering, developer tools, and
          product-minded software systems. I connect hands-on coding, local AI
          experimentation, and real-world operational experience into practical
          tools that solve messy problems.
        </div>

        <div className="section-header">Work Experience</div>

        {experiences.map((exp, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              padding: 12,
              background:
                i === 0 ? "linear-gradient(90deg, #f4f8ff, #ffffff)" : "#fff",
              border: "1px solid var(--color-gray-300)",
              boxShadow: "var(--shadow-outer-1)",
            }}
          >
            {/* Company + date row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{ fontWeight: "bold", fontSize: 13, color: "#000" }}
                >
                  {exp.company}
                </span>
                {i === 0 && (
                  <span
                    style={{
                      fontSize: 9,
                      color: "#fff",
                      background: "var(--color-blue)",
                      padding: "1px 5px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    FEATURED
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#fff",
                  background: "#555",
                  padding: "1px 6px",
                  flexShrink: 0,
                  fontFamily: "Tahoma, Arial, sans-serif",
                }}
              >
                {exp.date}
              </span>
            </div>

            {/* Role */}
            <div
              style={{
                color: "var(--color-blue)",
                fontWeight: "bold",
                fontSize: 12,
                marginBottom: 6,
              }}
            >
              {exp.role}
            </div>

            {/* Tech badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 4,
                marginBottom: 8,
              }}
            >
              {exp.tech.map((t) => (
                <span
                  key={t}
                  className="skill-badge"
                  style={{ fontSize: 10, padding: "1px 6px" }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Bullets */}
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                color: "#333",
                lineHeight: 1.7,
                fontSize: 12,
              }}
            >
              {exp.bullets.map((b, j) => (
                <li key={j} style={{ marginBottom: 2 }}>
                  {b.replace(/^-\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Separator */}
        <div
          style={{
            height: 1,
            background: "var(--color-gray-300)",
            margin: "4px 0 1px",
          }}
        />
        <div style={{ height: 1, background: "#fff", marginBottom: 12 }} />

        {/* Education */}
        <div className="section-header">Education</div>
        <div
          style={{
            padding: 12,
            background: "#fff",
            border: "1px solid var(--color-gray-300)",
            boxShadow: "var(--shadow-outer-1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 2,
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: 13, color: "#000" }}>
              {education.school}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#fff",
                background: "var(--color-gray-300)",
                padding: "1px 6px",
                fontFamily: "Tahoma, Arial, sans-serif",
              }}
            >
              {education.date}
            </span>
          </div>
          <div
            style={{
              color: "var(--color-blue)",
              fontWeight: "bold",
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            {education.degree}
          </div>
          <p style={{ color: "#555", fontSize: 11, margin: 0 }}>
            {education.note}
          </p>
        </div>
      </div>

      {/* ── Status bar ────────────────────────────────────────── */}
      <div
        style={{
          padding: "3px 8px",
          background: "var(--color-gray-200)",
          borderTop: "1px solid var(--color-gray-300)",
          fontSize: 10,
          color: "#555",
          display: "flex",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span>{experiences.length} experience record(s)</span>
        <span>Resume updated {RESUME_LAST_UPDATED}</span>
      </div>
    </div>
  );
}
