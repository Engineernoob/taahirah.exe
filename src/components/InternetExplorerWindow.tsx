import { useState } from "react";
import Blog from "./Blog";
import { IconInternetExplorer } from "./Win95Icons";

const ADDRESS = "http://taahirah.dev/blog";

const FAVORITES = [
  { label: "Blog Home", url: "http://taahirah.dev/blog" },
  { label: "AI Lab", url: "http://taahirah.dev/projects" },
  { label: "Resume", url: "http://taahirah.dev/resume" },
  { label: "Contact", url: "mailto:taahirahdenmark09@gmail.com" },
];

const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Tools", "Help"];

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
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(100);

  const simulateNavigation = (nextAddress = addressValue) => {
    setAddressValue(nextAddress);
    setStatus("Connecting to " + nextAddress + "...");
    setIsLoading(true);
    setProgress(18);

    window.setTimeout(() => {
      setStatus("Requesting page...");
      setProgress(48);
    }, 220);

    window.setTimeout(() => {
      setStatus("Rendering blog archive...");
      setProgress(76);
    }, 520);

    window.setTimeout(() => {
      setStatus("Done");
      setIsLoading(false);
      setProgress(100);
    }, 850);
  };

  const handleGo = () => {
    simulateNavigation(addressValue);
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
      {/* ── Menu bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "2px 8px",
          background: "#c0c0c0",
          borderBottom: "1px solid #808080",
          flexShrink: 0,
          fontSize: 11,
        }}
      >
        {MENU_ITEMS.map((item) => (
          <span
            key={item}
            style={{
              cursor: "default",
              userSelect: "none",
            }}
          >
            <span style={{ textDecoration: "underline" }}>{item[0]}</span>
            {item.slice(1)}
          </span>
        ))}
      </div>

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
            simulateNavigation(addressValue);
          }}
        />
        <IEButton
          label="Home"
          icon="🏠"
          onClick={() => simulateNavigation(ADDRESS)}
        />
        <div
          style={{
            width: 1,
            height: 28,
            background: "#808080",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />
        <IEButton
          label="Search"
          icon="🔍"
          onClick={() => {
            setStatus("Search panel unavailable in this nostalgic build.");
            window.setTimeout(() => setStatus("Done"), 1200);
          }}
        />
        <IEButton
          label="Favorites"
          icon="⭐"
          onClick={() => {
            setStatus("Favorites bar already visible.");
            window.setTimeout(() => setStatus("Done"), 1200);
          }}
        />
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
        <span style={{ fontSize: 13 }} aria-hidden="true">
          🌐
        </span>
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

      {/* ── Favorites bar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 6px",
          background: "#d8d8d8",
          borderBottom: "1px solid #808080",
          flexShrink: 0,
          fontSize: 11,
        }}
      >
        <span style={{ color: "#555", marginRight: 2 }}>Links</span>
        {FAVORITES.map((favorite) => (
          <button
            key={favorite.url}
            type="button"
            onClick={() => simulateNavigation(favorite.url)}
            style={{
              fontFamily: "Tahoma, Arial, sans-serif",
              fontSize: 11,
              background: "transparent",
              border: "none",
              padding: "1px 5px",
              cursor: "pointer",
              color: "#000080",
              textDecoration: "underline",
            }}
          >
            {favorite.label}
          </button>
        ))}
      </div>

      {/* ── Loading progress ────────────────────────────────────────────── */}
      <div
        style={{
          height: 4,
          background: "#fff",
          borderBottom: "1px solid #808080",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: isLoading ? "#000080" : "transparent",
            transition: "width 180ms linear",
          }}
        />
      </div>

      {/* ── Content (Blog) ───────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          background: "#fff",
          border: "2px solid",
          borderColor: "#808080 #fff #fff #808080",
          margin: 4,
          marginTop: 0,
        }}
      >
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
            minWidth: 86,
          }}
        >
          {isLoading ? `${progress}% loaded` : "Ready"}
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
          Blog zone
        </div>
      </div>
    </div>
  );
}
