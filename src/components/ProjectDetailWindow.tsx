export interface ProjectData {
  name: string;
  description: string;
  tech: string[];
  icon: string;
  githubUrl?: string;
  liveUrl?: string;
  status?: string;
}

export default function ProjectDetailWindow({
  name,
  description,
  tech,
  icon,
  githubUrl,
  liveUrl,
  status = "Completed",
}: ProjectData) {
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
      {/* ── Header ────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          boxShadow: "inset 0 -1px 0 var(--color-gray-300)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: "var(--color-blue)",
            flexShrink: 0,
            boxShadow: "var(--shadow-outer-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: 14,
              color: "#000",
              lineHeight: 1.2,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--color-gray-300)",
              marginTop: 3,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                background:
                  status === "Live"
                    ? "#1a4a8b"
                    : status === "In Progress"
                      ? "#5a3a00"
                      : "#1a5a1a",
                color: "#fff",
                padding: "0 5px",
                fontSize: 9,
                letterSpacing: "0.08em",
              }}
            >
              {status}
            </span>
            <span>{tech.length} technologies</span>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {/* Overview */}
        <div className="section-header">Overview</div>
        <p className="content-p" style={{ marginTop: 0 }}>
          {description}
        </p>

        <div
          style={{
            height: 1,
            background: "var(--color-gray-300)",
            margin: "0 0 1px",
          }}
        />
        <div style={{ height: 1, background: "#fff", marginBottom: 12 }} />

        {/* Tech stack */}
        <div className="section-header">Tech Stack</div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {tech.map((t) => (
            <span
              key={t}
              style={{
                border: "1px solid var(--color-blue)",
                color: "var(--color-blue)",
                padding: "3px 10px",
                fontSize: 11,
                background: "#f0f0ff",
                fontFamily: "Tahoma, Arial, sans-serif",
                boxShadow: "var(--shadow-outer-1)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: "var(--color-gray-300)",
            margin: "0 0 1px",
          }}
        />
        <div style={{ height: 1, background: "#fff", marginBottom: 12 }} />

        {/* Links */}
        <div className="section-header">Links</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* GitHub */}
          {githubUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "var(--color-gray-200)",
                boxShadow: "var(--shadow-outer-1)",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>📁</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{ fontWeight: "bold", fontSize: 11, marginBottom: 1 }}
                >
                  GitHub Repository
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--color-blue)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {githubUrl.replace("https://", "")}
                </div>
              </div>
              <button
                className="btn"
                style={{
                  fontSize: 10,
                  fontFamily: "Tahoma, Arial, sans-serif",
                  padding: "1px 10px",
                  flexShrink: 0,
                }}
                onClick={() =>
                  window.open(githubUrl, "_blank", "noopener,noreferrer")
                }
              >
                Open ↗
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "8px 10px",
                background: "var(--color-gray-100)",
                color: "#888",
                fontSize: 11,
                boxShadow: "var(--shadow-inner-1)",
              }}
            >
              📁 GitHub — Private / Not available
            </div>
          )}

          {/* Live */}
          {liveUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "var(--color-gray-200)",
                boxShadow: "var(--shadow-outer-1)",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>🌐</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{ fontWeight: "bold", fontSize: 11, marginBottom: 1 }}
                >
                  Live Demo
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--color-blue)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {liveUrl.replace("https://", "")}
                </div>
              </div>
              <button
                className="btn"
                style={{
                  fontSize: 10,
                  fontFamily: "Tahoma, Arial, sans-serif",
                  padding: "1px 10px",
                  flexShrink: 0,
                }}
                onClick={() =>
                  window.open(liveUrl, "_blank", "noopener,noreferrer")
                }
              >
                Open ↗
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "8px 10px",
                background: "var(--color-gray-100)",
                color: "#888",
                fontSize: 11,
                boxShadow: "var(--shadow-inner-1)",
              }}
            >
              🌐 Live Demo — Not deployed
            </div>
          )}
        </div>
      </div>

      {/* ── Status bar ────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-gray-200)",
          borderTop: "1px solid var(--color-gray-300)",
          padding: "2px 12px",
          fontSize: 10,
          color: "#555",
          flexShrink: 0,
          boxShadow: "inset 0 1px 0 #fff",
          display: "flex",
          gap: 16,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <span style={{ flexShrink: 0 }}>{name}</span>
        <span style={{ flexShrink: 0 }}>·</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {tech.join(", ")}
        </span>
      </div>
    </div>
  );
}
