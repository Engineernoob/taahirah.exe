import { openResumePdf } from "../resume";

const experiences = [
  {
    company: "Series: AI Native Social Platform",
    role: "Software Engineer Intern",
    date: "2024-2025",
    tech: ["Python", "React", "Node.js", "Google Cloud"],
    bullets: [
      "- Architected NLP-driven recommendation features using Node.js and Python, implementing advanced data structures to boost user engagement by 30% for 1,500+ active users.",
      "- Scaled backend services into a distributed system to accommodate 10,000+ daily API requests while maintaining a sub-200ms average latency.",
      "- Optimized Firebase database performance by implementing custom indexing and caching strategies, resulting in a 20% reduction in read latency and improved data throughput.",
    ],
  },
  {
    company: "Year Up – National Capital Region",
    role: "IT Trainee",
    date: "2016 – 2017",
    tech: ["Windows Server", "Active Directory", "Office 365"],
    bullets: [
      "- Mastered intensive technical training in IT systems, programming fundamentals, and enterprise software workflows, developing hands-on proficiency with AWS, Git, and React.",
      "- Led a capstone project to design and implement a secure, scalable web application using React and Node.js, demonstrating full-stack development skills and best practices.",
      "- Collaborated with a team of 5 trainees to troubleshoot and resolve complex IT issues in a simulated enterprise environment, enhancing problem-solving abilities and teamwork skills.",
    ],
  },
  {
    company: "High-Volume Service Environments (Various Roles)",
    role: "Operations Specialist",
    date: "2019 – 2020",
    tech: ["Customer Service", "Team Leadership", "Process Optimization"],
    bullets: [
      "- Operated in high-throughput environments managing 100+ parallel tasks per shift, prioritizing execution accuracy under strict timing constraints.",
      "- Improved operational efficiency by standardizing preparation workflows, reducing bottlenecks and improving service throughput.",
      "- Maintained strict compliance with safety and regulatory standards while operating in fast-paced production environments.",
      "- Diagnosed and resolved real-time operational issues during peak demand, maintaining service continuity and quality.",
    ],
  },
];

const education = {
  school: "Lewis University",
  degree: "B.S. Computer Science",
  date: "In Progress",
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
        <span style={{ fontWeight: "bold", fontSize: 12, color: "#000" }}>
          Experience.log
        </span>
        <button
          className="btn"
          style={{
            fontSize: 11,
            fontFamily: "Tahoma, Arial, sans-serif",
            padding: "1px 10px",
          }}
          onClick={openResumePdf}
        >
          📄 Download Resume
        </button>
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
        <div className="section-header">Work Experience</div>

        {experiences.map((exp, i) => (
          <div
            key={i}
            style={{
              marginBottom: 16,
              paddingBottom: 16,
              borderBottom:
                i < experiences.length - 1
                  ? "1px solid var(--color-gray-100)"
                  : "none",
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
                {exp && (
                  <span
                    style={{ color: "var(--color-gray-300)", fontSize: 10 }}
                  ></span>
                )}
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: "#fff",
                  background: "var(--color-gray-300)",
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
                  {b}
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
        <div>
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
    </div>
  );
}
