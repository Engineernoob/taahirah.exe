// ── Data ──────────────────────────────────────────────────────────────────────

const QUICK_FACTS = [
  { label: "Name", value: "Taahirah Denmark" },
  { label: "Role", value: "Software Engineer" },
  { label: "Based", value: "O'Fallon, IL  ·  Open to Remote" },
  { label: "Focus", value: "Full-Stack Web & Developer Tools" },
  { label: "Status", value: "Open to opportunities" },
];

const EDUCATION = [
  {
    school: "Lewis University",
    degree: "B.S. Computer Science",
    period: "2023 – 2027",
    status: "Junior  ·  In Progress",
    notes: "Romeoville, IL",
  },
];

// Proficiency 0–100
const SKILLS = [
  { name: "TypeScript", pct: 82, group: "Languages" },
  { name: "Python", pct: 75, group: "Languages" },
  { name: "JavaScript", pct: 88, group: "Languages" },
  { name: "React", pct: 85, group: "Frontend" },
  { name: "Three.js", pct: 70, group: "Frontend" },
  { name: "HTML / CSS", pct: 88, group: "Frontend" },
  { name: "Node.js", pct: 78, group: "Backend" },
  { name: "REST APIs", pct: 82, group: "Backend" },
  { name: "PostgreSQL", pct: 68, group: "Backend" },
  { name: "Docker", pct: 60, group: "DevOps" },
  { name: "Git / GitHub", pct: 85, group: "DevOps" },
  { name: "AWS", pct: 55, group: "DevOps" },
];

const SKILL_GROUPS = ["Languages", "Frontend", "Backend", "DevOps"];

const INTERESTS = [
  {
    icon: "🎌",
    label: "Anime & Manga",
    detail: "JJK, Bleach, HxH, Demon Slayer, Naruto",
  },
  {
    icon: "🎮",
    label: "Gaming",
    detail: "Story-driven RPGs and competitive shooters",
  },
  { icon: "🍳", label: "Cooking", detail: "Experimenting with new recipes" },
  {
    icon: "🏋️",
    label: "Working Out",
    detail: "Gym regular — consistency over intensity",
  },
  {
    icon: "🛠",
    label: "Building Things",
    detail: "If it seems weird to build, I probably want to build it",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontWeight: "bold",
        fontSize: 11,
        color: "#000080",
        borderBottom: "1px solid #c0c0c0",
        paddingBottom: 2,
        marginBottom: 8,
        marginTop: 14,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <>
      <div
        style={{ margin: "12px 16px 0", height: 1, background: "#c0c0c0" }}
      />
      <div style={{ margin: "0 16px 0", height: 1, background: "#fff" }} />
    </>
  );
}

function SkillBar({ name, pct }: { name: string; pct: number }) {
  const label =
    pct >= 85
      ? "Strong"
      : pct >= 70
        ? "Comfortable"
        : pct >= 55
          ? "Proficient"
          : "Learning";

  return (
    <div style={{ marginBottom: 7 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
          fontSize: 11,
        }}
      >
        <span>{name}</span>
        <span style={{ color: "#666", fontSize: 10 }}>{label}</span>
      </div>
      {/* Win95 sunken track */}
      <div
        style={{
          height: 10,
          background: "#fff",
          boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #fff",
          border: "1px solid #c0c0c0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Filled portion — chunky Win95 blocks */}
        <div
          style={{
            position: "absolute",
            top: 1,
            left: 1,
            bottom: 1,
            width: `calc(${pct}% - 2px)`,
            background:
              "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #1a1aaa 8px, #1a1aaa 10px)",
          }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

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
      {/* ── Identity header ─────────────────────────────────────────────────── */}
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
        <div
          style={{
            width: 54,
            height: 54,
            background: "#000080",
            flexShrink: 0,
            boxShadow: "inset -2px -2px 0 #000060, inset 2px 2px 0 #4444cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: "#fff",
            letterSpacing: "0.05em",
            userSelect: "none",
          }}
        >
          TD
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
          <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>
            Software Engineer · Lewis University '27
          </div>
          <div style={{ marginTop: 4, display: "flex", gap: 4 }}>
            {["Full-Stack", "Dev Tools", "AI"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 9,
                  padding: "1px 5px",
                  background: "#000080",
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
        {/* Quick facts */}
        <div style={{ padding: "12px 16px 0" }}>
          <SectionHeader>Info</SectionHeader>
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
                      width: 60,
                      whiteSpace: "nowrap",
                      verticalAlign: "top",
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

        <Divider />

        {/* Bio */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader>About Me</SectionHeader>
          <p style={{ margin: "0 0 10px", lineHeight: 1.7, color: "#222" }}>
            Hey, I'm Taahirah — a Junior CS student at Lewis University and a
            software engineer who builds full-stack apps, developer tools, and
            AI-powered platforms. I'm drawn to projects that feel ambitious or
            slightly unreasonable, which is how I ended up building a Windows 95
            portfolio with a live 3D room inside it.
          </p>
          <p style={{ margin: "0 0 10px", lineHeight: 1.7, color: "#222" }}>
            I care about the craft — clean code, intentional UX, and shipping
            things that actually work. When I'm not in the editor I'm at the
            gym, watching anime, or cooking something new.
          </p>
        </div>

        <Divider />

        {/* Education */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader>Education</SectionHeader>
          {EDUCATION.map((e) => (
            <div
              key={e.school}
              style={{
                padding: "8px 10px",
                background: "#f0f0f0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
                marginBottom: 8,
              }}
            >
              <div
                style={{ fontWeight: "bold", fontSize: 12, color: "#000080" }}
              >
                {e.school}
              </div>
              <div style={{ fontWeight: "bold", fontSize: 11, marginTop: 2 }}>
                {e.degree}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 4,
                  fontSize: 10,
                  color: "#555",
                }}
              >
                <span>📅 {e.period}</span>
                <span>📍 {e.notes}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#000080",
                    color: "#fff",
                    padding: "0 5px",
                    fontSize: 9,
                  }}
                >
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Skills */}
        <div style={{ padding: "0 16px" }}>
          <SectionHeader>Skills</SectionHeader>
          {SKILL_GROUPS.map((group) => (
            <div key={group} style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  color: "#666",
                  fontWeight: "bold",
                  marginBottom: 6,
                  letterSpacing: "0.05em",
                }}
              >
                {group.toUpperCase()}
              </div>
              {SKILLS.filter((s) => s.group === group).map((s) => (
                <SkillBar key={s.name} name={s.name} pct={s.pct} />
              ))}
            </div>
          ))}
          {/* Legend */}
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 9,
              color: "#888",
              marginTop: 4,
              paddingTop: 4,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            {["Learning", "Proficient", "Comfortable", "Strong"].map((l) => (
              <span key={l}>· {l}</span>
            ))}
          </div>
        </div>

        <Divider />

        {/* Interests */}
        <div style={{ padding: "0 16px 16px" }}>
          <SectionHeader>Interests</SectionHeader>
          {INTERESTS.map(({ icon, label, detail }) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 8,
                padding: "5px 8px",
                background: "#f8f8f8",
                border: "1px solid #e0e0e0",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1.2 }}>
                {icon}
              </span>
              <div>
                <div style={{ fontWeight: "bold", fontSize: 11 }}>{label}</div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>
                  {detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "1px solid #808080",
          padding: "2px 8px",
          boxShadow: "inset 0 1px 0 #fff",
          fontSize: 10,
          color: "#444",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>taahirah.exe · About</span>
        <span>Lewis University · CS · Class of 2027</span>
      </div>
    </div>
  );
}
