import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SettingsWindowProps {
  onWallpaperChange?: (wallpaper: WallpaperOption) => void;
}

export interface WallpaperOption {
  id: string;
  label: string;
  value: string; // CSS background value
  textColor: string;
}

// ── Wallpaper options ─────────────────────────────────────────────────────────
export const WALLPAPERS: WallpaperOption[] = [
  {
    id: "default",
    label: "Teal (Default)",
    value: "#008080",
    textColor: "#fff",
  },
  {
    id: "navy",
    label: "Navy Blue",
    value: "#000080",
    textColor: "#fff",
  },
  {
    id: "black",
    label: "Black",
    value: "#000000",
    textColor: "#fff",
  },
  {
    id: "purple",
    label: "Deep Purple",
    value: "linear-gradient(135deg, #1a0030 0%, #2d0060 100%)",
    textColor: "#fff",
  },
  {
    id: "midnight",
    label: "Midnight",
    value: "linear-gradient(180deg, #0a0a1a 0%, #0d0d2e 100%)",
    textColor: "#fff",
  },
  {
    id: "forest",
    label: "Forest",
    value: "linear-gradient(135deg, #0a1f0a 0%, #1a3a1a 100%)",
    textColor: "#fff",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    value: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
    textColor: "#fff",
  },
  {
    id: "crimson",
    label: "Crimson",
    value: "linear-gradient(135deg, #1a0000 0%, #3a0010 100%)",
    textColor: "#fff",
  },
  {
    id: "storm",
    label: "Storm",
    value: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    textColor: "#fff",
  },
  {
    id: "custom",
    label: "Custom Color...",
    value: "#008080",
    textColor: "#fff",
  },
];

const SETTINGS_KEY = "win95-settings";

export function loadSettings(): { wallpaperId: string; customColor: string } {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    return { wallpaperId: "default", customColor: "#008080" };
  }
}

// ── Tab type ──────────────────────────────────────────────────────────────────
type Tab = "display" | "appearance" | "screensaver";

export default function SettingsWindow({
  onWallpaperChange,
}: SettingsWindowProps) {
  const [tab, setTab] = useState<Tab>("display");
  const [selectedId, setSelectedId] = useState(
    () => loadSettings().wallpaperId || "default",
  );
  const [customColor, setCustomColor] = useState(
    () => loadSettings().customColor || "#008080",
  );
  const [applied, setApplied] = useState(false);

  const selectedWallpaper =
    WALLPAPERS.find((w) => w.id === selectedId) ?? WALLPAPERS[0];
  const effectiveWallpaper: WallpaperOption =
    selectedId === "custom"
      ? { ...selectedWallpaper, value: customColor }
      : selectedWallpaper;

  const apply = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ wallpaperId: selectedId, customColor }),
    );
    onWallpaperChange?.(effectiveWallpaper);
    setApplied(true);
    setTimeout(() => setApplied(false), 1500);
  };

  // Apply on first load
  useEffect(() => {
    const saved = loadSettings();
    if (saved.wallpaperId) {
      const wp = WALLPAPERS.find((w) => w.id === saved.wallpaperId);
      if (wp) {
        const effective =
          saved.wallpaperId === "custom"
            ? { ...wp, value: saved.customColor || wp.value }
            : wp;
        onWallpaperChange?.(effective);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "display", label: "Background" },
    { id: "appearance", label: "Appearance" },
    { id: "screensaver", label: "Screen Saver" },
  ];

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
      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "6px 8px 0",
          borderBottom: "2px solid #808080",
          flexShrink: 0,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "4px 12px",
              fontFamily: "Tahoma",
              fontSize: 12,
              background: tab === t.id ? "#c0c0c0" : "#a0a0a0",
              border: "2px solid",
              borderColor:
                tab === t.id
                  ? "#fff #808080 #c0c0c0 #fff"
                  : "#808080 #fff #fff #808080",
              borderBottom:
                tab === t.id ? "2px solid #c0c0c0" : "2px solid #808080",
              marginBottom: tab === t.id ? -2 : 0,
              cursor: "pointer",
              position: "relative",
              zIndex: tab === t.id ? 1 : 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
        {/* Background tab */}
        {tab === "display" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Preview monitor */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 160,
                  height: 110,
                  background: "#333",
                  border: "3px solid #555",
                  padding: 4,
                  boxShadow: "inset 2px 2px 0 #222",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: effectiveWallpaper.value,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.4)",
                    fontFamily: "Tahoma",
                  }}
                >
                  Preview
                </div>
              </div>
            </div>

            {/* Wallpaper list */}
            <div>
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                Select a background:
              </div>
              <div
                style={{
                  height: 160,
                  overflowY: "auto",
                  background: "#fff",
                  border: "2px solid",
                  borderColor: "#808080 #fff #fff #808080",
                }}
              >
                {WALLPAPERS.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedId(wp.id)}
                    style={{
                      padding: "4px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background:
                        selectedId === wp.id ? "#000080" : "transparent",
                      color: selectedId === wp.id ? "#fff" : "#000",
                      cursor: "pointer",
                    }}
                  >
                    {/* Colour swatch */}
                    <div
                      style={{
                        width: 20,
                        height: 14,
                        flexShrink: 0,
                        background: wp.value,
                        border: "1px solid #808080",
                      }}
                    />
                    {wp.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom colour picker */}
            {selectedId === "custom" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ fontSize: 12 }}>Custom colour:</label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  style={{
                    width: 48,
                    height: 28,
                    cursor: "pointer",
                    border: "1px solid #808080",
                  }}
                />
                <span style={{ fontSize: 11, color: "#555" }}>
                  {customColor}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Appearance tab */}
        {tab === "appearance" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: "bold" }}>Color scheme</div>
            <div
              style={{
                padding: 10,
                background: "#fff",
                border: "2px solid",
                borderColor: "#808080 #fff #fff #808080",
                fontSize: 11,
                color: "#555",
                lineHeight: 1.8,
              }}
            >
              <div>
                🎨 Windows Classic — <b>Active</b>
              </div>
              <div style={{ marginTop: 8, color: "#808080" }}>
                Additional themes coming soon.
              </div>
            </div>
            <div style={{ fontWeight: "bold" }}>Font size</div>
            <div
              style={{
                padding: 10,
                background: "#fff",
                border: "2px solid",
                borderColor: "#808080 #fff #fff #808080",
                fontSize: 11,
                color: "#555",
              }}
            >
              Small fonts — <b>Active</b>
            </div>
          </div>
        )}

        {/* Screen saver tab */}
        {tab === "screensaver" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: "bold" }}>Screen Saver</div>
            <div
              style={{
                padding: 10,
                background: "#fff",
                border: "2px solid",
                borderColor: "#808080 #fff #fff #808080",
                fontSize: 11,
                color: "#555",
                lineHeight: 1.8,
              }}
            >
              <div>
                🌀 (None) — <b>Active</b>
              </div>
              <div style={{ marginTop: 8, color: "#808080" }}>
                Screen savers are not yet implemented.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer buttons ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "2px solid #808080",
          padding: "8px 12px",
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {applied && (
          <span
            style={{
              fontSize: 11,
              color: "#007700",
              alignSelf: "center",
              marginRight: 8,
            }}
          >
            ✓ Applied
          </span>
        )}
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 64 }}
          onClick={apply}
        >
          Apply
        </button>
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 64 }}
          onClick={() => {
            apply();
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
