import { useState } from "react";
import Blog from "./Blog";
import { IconInternetExplorer } from "./Win95Icons";

const ADDRESS = "http://taahirah.dev/blog";

// IE toolbar button
function IEButton({
  label,
  icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className="btn"
      disabled={disabled}
      onClick={onClick}
      title={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        padding: "2px 6px",
        minWidth: 36,
        fontSize: 9,
        fontFamily: "Tahoma, Arial, sans-serif",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
        border: "none",
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function InternetExplorerWindow() {
  const [addressValue, setAddressValue] = useState(ADDRESS);
  const [status, setStatus] = useState("Done");

  const handleGo = () => {
    setStatus("Connecting to " + addressValue + "...");
    setTimeout(() => setStatus("Done"), 800);
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#c0c0c0",
      }}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2px 4px",
          borderBottom: "1px solid #808080",
          gap: 2,
          background: "#c0c0c0",
          flexShrink: 0,
        }}
      >
        <IEButton label="Back" icon="◀" disabled />
        <IEButton label="Forward" icon="▶" disabled />
        <IEButton label="Stop" icon="✕" disabled />
        <IEButton
          label="Refresh"
          icon="↻"
          onClick={() => {
            setStatus("Refreshing...");
            setTimeout(() => setStatus("Done"), 600);
          }}
        />
        <IEButton label="Home" icon="🏠" />
        <div
          style={{
            width: 1,
            height: 28,
            background: "#808080",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />
        <IEButton label="Search" icon="🔍" />
        <IEButton label="Favorites" icon="⭐" />
        <div style={{ flex: 1 }} />
        {/* IE logo mark */}
        <div style={{ marginRight: 4 }}>
          <IconInternetExplorer size={22} />
        </div>
      </div>

      {/* ── Address bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "3px 6px",
          gap: 6,
          borderBottom: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          background: "#c0c0c0",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, whiteSpace: "nowrap" }}>Address</span>
        <input
          className="field"
          type="text"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleGo();
          }}
          style={{
            flex: 1,
            fontFamily: "Tahoma, Arial, sans-serif",
            fontSize: 11,
          }}
        />
        <button
          className="btn"
          onClick={handleGo}
          style={{ fontSize: 11, padding: "1px 8px" }}
        >
          Go
        </button>
      </div>

      {/* ── Content (Blog) ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", background: "#fff" }}>
        <Blog />
      </div>

      {/* ── Status bar ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1px 6px",
          borderTop: "1px solid #808080",
          background: "#c0c0c0",
          flexShrink: 0,
          gap: 6,
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "0 4px",
            fontSize: 11,
            height: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          {status}
        </div>
        <div
          style={{
            border: "1px solid",
            borderColor: "#808080 #fff #fff #808080",
            padding: "0 6px",
            fontSize: 11,
            height: 16,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          Internet zone
        </div>
      </div>
    </div>
  );
}
