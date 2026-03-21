import { useState } from "react";
import { openResumePdf } from "../resume";

const OWNER_EMAIL = "taahirah_d@icloud.com";

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Engineernoob",
    display: "github.com/Engineernoob",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/taahirah-denmark-4b1441196",
    display: "linkedin.com/in/taahirah-denmark-4b1441196",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/shebuildsfire",
    display: "@shebuildsfire",
  },
];

export default function ContactWindow() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const canSend = name.trim() && email.trim() && message.trim();

  const handleSend = () => {
    if (!canSend) return;
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`,
    );
    window.open(
      `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`,
      "_blank",
    );
    setSent(true);
  };

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
            width: 40,
            height: 40,
            background: "var(--color-blue)",
            flexShrink: 0,
            boxShadow: "var(--shadow-outer-1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          ✉️
        </div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 13, color: "#000" }}>
            Get In Touch
          </div>
          <a
            href={`mailto:${OWNER_EMAIL}`}
            style={{
              color: "var(--color-blue)",
              fontSize: 11,
              textDecoration: "none",
            }}
          >
            {OWNER_EMAIL}
          </a>
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
        {/* Message form */}
        <div className="section-header">Send a Message</div>

        {sent ? (
          <div
            style={{
              padding: "12px 14px",
              background: "var(--color-gray-200)",
              boxShadow: "var(--shadow-outer-1)",
              color: "#000",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            ✅ Your mail client should have opened — thanks for reaching out!{" "}
            <button className="inline-link" onClick={() => setSent(false)}>
              Send another
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {/* Name + Email side by side */}
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <label style={{ fontSize: 11, color: "#555" }}>
                  Name <span style={{ color: "var(--color-blue)" }}>*</span>
                </label>
                <input
                  className="field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={{
                    fontFamily: "Tahoma, Arial, sans-serif",
                    fontSize: 12,
                    width: "100%",
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <label style={{ fontSize: 11, color: "#555" }}>
                  Email <span style={{ color: "var(--color-blue)" }}>*</span>
                </label>
                <input
                  className="field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  style={{
                    fontFamily: "Tahoma, Arial, sans-serif",
                    fontSize: 12,
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label style={{ fontSize: 11, color: "#555" }}>
                Company <span style={{ color: "#aaa" }}>(optional)</span>
              </label>
              <input
                className="field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                style={{
                  fontFamily: "Tahoma, Arial, sans-serif",
                  fontSize: 12,
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <label style={{ fontSize: 11, color: "#555" }}>
                Message <span style={{ color: "var(--color-blue)" }}>*</span>
              </label>
              <textarea
                className="field"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Your message..."
                style={{
                  resize: "vertical",
                  minHeight: 72,
                  fontFamily: "Tahoma, Arial, sans-serif",
                  fontSize: 12,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingTop: 4,
              }}
            >
              <button
                className="btn"
                style={{
                  fontFamily: "Tahoma, Arial, sans-serif",
                  fontSize: 12,
                  minWidth: 110,
                }}
                disabled={!canSend}
                onClick={handleSend}
              >
                Send Message
              </button>
              <span style={{ fontSize: 10, color: "#aaa" }}>* required</span>
            </div>
          </div>
        )}

        {/* Separator */}
        <div
          style={{
            height: 1,
            background: "var(--color-gray-300)",
            margin: "4px 0 1px",
          }}
        />
        <div style={{ height: 1, background: "#fff", marginBottom: 12 }} />

        {/* Links */}
        <div className="section-header">Links</div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 14,
          }}
        >
          <tbody>
            {LINKS.map(({ label, href, display }) => (
              <tr key={label}>
                <td
                  style={{
                    padding: "4px 12px 4px 0",
                    fontWeight: "bold",
                    color: "var(--color-blue)",
                    width: 72,
                    fontSize: 11,
                    verticalAlign: "top",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </td>
                <td style={{ padding: "4px 0" }}>
                  <a
                    className="content-link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12 }}
                  >
                    {display}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Separator */}
        <div
          style={{
            height: 1,
            background: "var(--color-gray-300)",
            margin: "4px 0 1px",
          }}
        />
        <div style={{ height: 1, background: "#fff", marginBottom: 12 }} />

        {/* Resume */}
        <div className="section-header">Resume</div>
        <button
          className="btn"
          style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12 }}
          onClick={openResumePdf}
        >
          📄 Download Resume
        </button>
      </div>
    </div>
  );
}
