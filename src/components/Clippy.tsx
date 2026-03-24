import { useEffect, useState, useCallback } from "react";

// ── Clippy tips ───────────────────────────────────────────────────────────────
const TIPS = [
  {
    trigger: "idle",
    text: "It looks like you're exploring a portfolio! Would you like help finding the Projects window?",
  },
  {
    trigger: "idle",
    text: "Hi! I'm Clippy. Taahirah built this whole desktop from scratch — pretty cool right? 📎",
  },
  {
    trigger: "idle",
    text: "Did you know you can drag these windows anywhere on the desktop?",
  },
  {
    trigger: "idle",
    text: "Try double-clicking the icons on the desktop to open new windows!",
  },
  {
    trigger: "idle",
    text: "Taahirah is open to new opportunities. Check out the Contact window!",
  },
  {
    trigger: "idle",
    text: "Want to see what she's built? Open the Projects window from the taskbar.",
  },
  {
    trigger: "idle",
    text: "The Netflix 95 window is hiding somewhere on this desktop... 👀",
  },
  {
    trigger: "idle",
    text: "It looks like you're reading a blog post! Would you like me to summarise it? (I can't, but I thought I'd offer.)",
  },
  {
    trigger: "idle",
    text: "Fun fact: this room was built with Three.js. Every object on that desk is hand-coded geometry.",
  },
  {
    trigger: "idle",
    text: "You can resize and minimize any window using the buttons in the top-right corner.",
  },
];

// ── Clippy SVG (simplified paperclip shape) ───────────────────────────────────
function ClippySVG() {
  return (
    <svg
      width="48"
      height="64"
      viewBox="0 0 48 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse
        cx="24"
        cy="32"
        rx="10"
        ry="26"
        fill="#e8c840"
        stroke="#b89820"
        strokeWidth="2"
      />
      {/* Eyes */}
      <ellipse
        cx="20"
        cy="26"
        rx="3"
        ry="3.5"
        fill="#fff"
        stroke="#333"
        strokeWidth="1"
      />
      <ellipse
        cx="28"
        cy="26"
        rx="3"
        ry="3.5"
        fill="#fff"
        stroke="#333"
        strokeWidth="1"
      />
      {/* Pupils */}
      <circle cx="21" cy="27" r="1.5" fill="#333" />
      <circle cx="29" cy="27" r="1.5" fill="#333" />
      {/* Smile */}
      <path
        d="M18 34 Q24 39 30 34"
        stroke="#333"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Paper clip wire */}
      <path
        d="M14 8 Q14 2 24 2 Q34 2 34 12 Q34 20 24 20 Q16 20 16 28 Q16 40 28 40"
        stroke="#b89820"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Eyebrows — neutral */}
      <path
        d="M17 22 Q20 20 23 22"
        stroke="#333"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M25 22 Q28 20 31 22"
        stroke="#333"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Clippy() {
  const [visible, setVisible] = useState(false);
  const [tipText, setTipText] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [waving, setWaving] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  const showTip = useCallback((text: string) => {
    setTipText(text);
    setVisible(true);
    setWaving(true);
    setTimeout(() => setWaving(false), 600);
  }, []);

  // Show first tip after 6 seconds, then every 30s
  useEffect(() => {
    if (dismissed) return;
    const first = setTimeout(() => {
      showTip(TIPS[0].text);
      setTipIdx(1);
    }, 6000);
    return () => clearTimeout(first);
  }, [dismissed, showTip]);

  useEffect(() => {
    if (dismissed || !visible) return;
    const interval = setInterval(() => {
      const next = tipIdx % TIPS.length;
      showTip(TIPS[next].text);
      setTipIdx((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, [dismissed, visible, tipIdx, showTip]);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 52,
        right: 16,
        zIndex: 8000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
        userSelect: "none",
      }}
    >
      {/* Speech bubble */}
      {visible && (
        <div
          style={{
            maxWidth: 220,
            padding: "8px 10px",
            background: "#2e2d2d",
            border: "2px solid",
            borderColor: "#808080 #fff #fff #808080",
            fontSize: 11,
            fontFamily: "Tahoma, Arial, sans-serif",
            lineHeight: 1.6,
            position: "relative",
            boxShadow: "2px 2px 0 #808080",
          }}
        >
          {tipText}

          {/* Bubble tail */}
          <div
            style={{
              position: "absolute",
              bottom: -8,
              right: 20,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "8px solid #ffffc0",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -10,
              right: 19,
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "9px solid #808080",
              zIndex: -1,
            }}
          />

          {/* Button row */}
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            <button
              style={{
                fontSize: 10,
                padding: "2px 6px",
                fontFamily: "Tahoma",
                cursor: "pointer",
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
              }}
              onClick={() => {
                const next = tipIdx % TIPS.length;
                showTip(TIPS[next].text);
                setTipIdx((prev) => prev + 1);
              }}
            >
              Next tip
            </button>
            <button
              style={{
                fontSize: 10,
                padding: "2px 6px",
                fontFamily: "Tahoma",
                cursor: "pointer",
                background: "#c0c0c0",
                border: "2px solid",
                borderColor: "#fff #808080 #808080 #fff",
              }}
              onClick={() => setVisible(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Clippy body */}
      <div
        title="Clippy"
        onClick={() => {
          if (!visible) {
            const next = tipIdx % TIPS.length;
            showTip(TIPS[next].text);
            setTipIdx((prev) => prev + 1);
          } else {
            setVisible(false);
          }
        }}
        style={{
          cursor: "pointer",
          transform: waving ? "rotate(-15deg)" : "rotate(0deg)",
          transition: "transform 0.15s ease",
          position: "relative",
        }}
      >
        <ClippySVG />
        {/* Dismiss X */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 14,
            height: 14,
            fontSize: 9,
            lineHeight: 1,
            padding: 0,
            cursor: "pointer",
            background: "#c0c0c0",
            border: "1px solid #808080",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Dismiss Clippy"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
