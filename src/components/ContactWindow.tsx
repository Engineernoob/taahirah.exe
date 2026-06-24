import { useState } from "react";
import {
  downloadResumePdf,
  openResumePdf,
  RESUME_LAST_UPDATED,
} from "../resume";

const OWNER_EMAIL = "taahirah.engineer@proton.me";

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
    label: "X",
    href: "https://twitter.com/shebuildsfire",
    display: "@shebuildsfire",
  },
];

const CONTACT_STATS = [
  { label: "Response Goal", value: "24-48 hrs" },
  { label: "Focus", value: "AI + DevTools" },
  { label: "Open To", value: "Internships" },
  { label: "Resume", value: "Current" },
];

type FormStatus = "idle" | "sending" | "success" | "error";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

export default function ContactWindow() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  const canSend = name.trim() && email.trim() && message.trim();

  const handleSend = async () => {
    if (!canSend) return;

    if (FORM_ENDPOINT) {
      setStatus("sending");
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            message: message.trim(),
          }),
        });
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    } else {
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`,
      );
      window.open(
        `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`,
        "_blank",
      );
      setStatus("success");
    }
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
            Contact Terminal
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {CONTACT_STATS.map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "8px",
                background: "var(--color-gray-100)",
                border: "1px solid var(--color-gray-300)",
                boxShadow: "inset 1px 1px 0 #fff",
              }}
            >
              <div style={{ fontSize: 10, color: "#666" }}>{stat.label}</div>
              <div
                style={{
                  marginTop: 3,
                  fontWeight: "bold",
                  color: "var(--color-blue)",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 12px",
            background: "linear-gradient(90deg, #eef4ff, #ffffff)",
            border: "1px solid #b8c7e6",
            marginBottom: 14,
            lineHeight: 1.6,
          }}
        >
          Interested in AI engineering, developer tools, internships, contract
          work, or collaboration? Send a message and I'll get back to you as
          soon as possible.
        </div>

        {/* Message form */}
        <div className="section-header">Send a Message</div>

        {status === "success" ? (
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
            ✅ Thanks for reaching out
            {FORM_ENDPOINT
              ? ", I'll get back to you soon"
              : " — your mail client should have opened"}
            !{" "}
            <button
              className="inline-link"
              onClick={() => {
                setStatus("idle");
                setName("");
                setEmail("");
                setCompany("");
                setMessage("");
              }}
            >
              Send another
            </button>
          </div>
        ) : status === "error" ? (
          <div
            style={{
              padding: "12px 14px",
              background: "#fff0f0",
              border: "1px solid #c00",
              color: "#800",
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            ❌ Something went wrong.{" "}
            <button className="inline-link" onClick={() => setStatus("idle")}>
              Try again
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
                disabled={!canSend || status === "sending"}
                onClick={handleSend}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
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
        <div className="section-header">Find Me Online</div>
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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn"
            style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12 }}
            onClick={openResumePdf}
          >
            Open Resume
          </button>

          <button
            className="btn"
            style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12 }}
            onClick={downloadResumePdf}
          >
            Download PDF
          </button>

          <span style={{ fontSize: 10, color: "#666" }}>
            Updated {RESUME_LAST_UPDATED}
          </span>
        </div>
      </div>
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
        <span>Contact terminal ready</span>
        <span>{OWNER_EMAIL}</span>
      </div>
    </div>
  );
}
