import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { playWindowOpen } from "../sounds";
import OsWindow from "./OsWindow";
import Clock from "./Clock";
import Clippy from "./Clippy";
import ProjectsWindow from "./ProjectsWindow";
import {
  IconMyComputer,
  IconNotepad,
  IconBriefcase,
  IconFolder,
  IconEnvelope,
  IconWindowsLogo,
  IconWolfenstein,
  IconBlog,
  IconNetflix,
  IconInternetExplorer,
} from "./Win95Icons";
import type { ProjectData } from "./ProjectDetailWindow";

const ShowcaseWindow      = lazy(() => import("./ShowcaseWindow"));
const AboutWindow         = lazy(() => import("./AboutWindow"));
const ExperienceWindow    = lazy(() => import("./ExperienceWindow"));
const ProjectDetailWindow = lazy(() => import("./ProjectDetailWindow"));
const ContactWindow       = lazy(() => import("./ContactWindow"));
const Blog                = lazy(() => import("./Blog"));
const WolfensteinWindow   = lazy(() => import("./WolfensteinWindow"));
const NetflixWindow       = lazy(() => import("./NetflixWindow"));
const MSNWindow           = lazy(() => import("./MSNWindow"));
const NotepadWindow       = lazy(() => import("./Notepad"));
const SettingsWindow      = lazy(() => import("./Settings"));
const RunDialog                = lazy(() => import("./Rundialog"));
const InternetExplorerWindow  = lazy(() => import("./InternetExplorerWindow"));

type WindowId =
  | "showcase"
  | "about"
  | "experience"
  | "projects"
  | "project-detail"
  | "contact"
  | "wolfenstein"
  | "blog"
  | "netflix"
  | "msn"
  | "notepad"
  | "settings"
  | "run"
  | "internet-explorer";

interface WindowState {
  id: WindowId;
  zIndex: number;
  x: number;
  y: number;
  minimized: boolean;
}

interface CtxMenu { x: number; y: number }
interface PersistedDesktopState { openWindows: WindowState[]; activeId: WindowId | null }
type ShutdownAction = "shutdown" | "restart" | "dos";

export const OWNER_NAME  = "Taahirah Denmark";
export const OWNER_TITLE = "Software Engineer";

// Bumped to v3 to clear stale state that has old WindowIds
const DESKTOP_STATE_STORAGE_KEY = "portfolio.desktop.state.v3";

interface IconConfig { id: WindowId; label: string; Icon: ComponentType<{ size?: number }> }

const ICONS: IconConfig[] = [
  { id: "showcase",    label: "My Computer",   Icon: IconMyComputer  },
  { id: "about",       label: "About Me",      Icon: IconNotepad     },
  { id: "experience",  label: "Experience",    Icon: IconBriefcase   },
  { id: "projects",    label: "Projects",      Icon: IconFolder      },
  { id: "contact",     label: "Contact.txt",   Icon: IconEnvelope    },
  { id: "wolfenstein", label: "Wolf3D.exe",    Icon: IconWolfenstein },
  { id: "blog",        label: "Blog.txt",      Icon: IconBlog        },
  { id: "netflix",     label: "Netflix 95",    Icon: IconNetflix     },
  { id: "msn",         label: "MSN Chat",      Icon: IconEnvelope    },
  { id: "notepad",     label: "Notepad",       Icon: IconNotepad     },
  { id: "settings",          label: "Settings",            Icon: IconMyComputer       },
  { id: "internet-explorer", label: "Internet Explorer",   Icon: IconInternetExplorer },
];

interface WindowConfig { title: string; Icon: ComponentType<{ size?: number }>; width: number; height: number }

const WINDOW_CONFIG: Record<WindowId, WindowConfig> = {
  showcase:         { title: "Welcome",            Icon: IconMyComputer,  width: 520, height: 500 },
  about:            { title: "About Me",            Icon: IconNotepad,     width: 500, height: 560 },
  experience:       { title: "Experience.log",      Icon: IconBriefcase,   width: 540, height: 480 },
  projects:         { title: "Projects.dir",        Icon: IconFolder,      width: 560, height: 500 },
  "project-detail": { title: "Project Details",     Icon: IconFolder,      width: 460, height: 420 },
  contact:          { title: "Contact.txt",         Icon: IconEnvelope,    width: 480, height: 460 },
  wolfenstein:      { title: "Wolf3D.exe",          Icon: IconWolfenstein, width: 680, height: 520 },
  blog:             { title: "Blog.txt",            Icon: IconBlog,        width: 680, height: 480 },
  netflix:          { title: "Netflix 95",          Icon: IconNetflix,     width: 760, height: 560 },
  msn:              { title: "MSN Messenger",       Icon: IconEnvelope,    width: 420, height: 500 },
  notepad:          { title: "Notepad",             Icon: IconNotepad,     width: 500, height: 420 },
  settings:         { title: "Display Properties",  Icon: IconMyComputer,  width: 400, height: 440 },
  run:              { title: "Run",                 Icon: IconMyComputer,        width: 380, height: 210 },
  "internet-explorer": { title: "Blog - Internet Explorer", Icon: IconInternetExplorer, width: 760, height: 540 },
};

const WINDOW_INITIAL: Record<WindowId, { x: number; y: number }> = {
  showcase:         { x: 120, y: 40  },
  about:            { x: 160, y: 60  },
  experience:       { x: 180, y: 70  },
  projects:         { x: 200, y: 80  },
  "project-detail": { x: 240, y: 100 },
  contact:          { x: 150, y: 65  },
  wolfenstein:      { x: 100, y: 30  },
  blog:             { x: 140, y: 50  },
  netflix:          { x: 170, y: 45  },
  msn:              { x: 300, y: 80  },
  notepad:          { x: 220, y: 90  },
  settings:         { x: 260, y: 70  },
  run:              { x: 280, y: 200 },
  "internet-explorer": { x: 130, y: 45 },
};

let topZ = 10;

const WINDOW_IDS: WindowId[] = [
  "showcase","about","experience","projects","project-detail",
  "contact","wolfenstein","blog","netflix","msn","notepad","settings","run","internet-explorer",
];
const WINDOW_ID_SET = new Set<WindowId>(WINDOW_IDS);

function isWindowId(value: unknown): value is WindowId {
  return typeof value === "string" && WINDOW_ID_SET.has(value as WindowId);
}

function getDefaultDesktopState(): PersistedDesktopState {
  return {
    openWindows: [{ id: "showcase", zIndex: topZ, x: WINDOW_INITIAL.showcase.x, y: WINDOW_INITIAL.showcase.y, minimized: false }],
    activeId: "showcase",
  };
}

function restoreDesktopState(): PersistedDesktopState {
  const fallback = getDefaultDesktopState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(DESKTOP_STATE_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedDesktopState>;
    if (!Array.isArray(parsed.openWindows)) return fallback;
    const seen = new Set<WindowId>();
    const openWindows = parsed.openWindows.flatMap((win) => {
      if (!win || typeof win !== "object") return [];
      const c = win as Partial<WindowState>;
      if (!isWindowId(c.id) || seen.has(c.id)) return [];
      if (typeof c.x !== "number" || typeof c.y !== "number" || typeof c.zIndex !== "number" ||
          typeof c.minimized !== "boolean" || !Number.isFinite(c.x) || !Number.isFinite(c.y) || !Number.isFinite(c.zIndex)) return [];
      seen.add(c.id);
      return [{ id: c.id, x: c.x, y: c.y, zIndex: c.zIndex, minimized: c.minimized }];
    });
    if (openWindows.length === 0) return fallback;
    topZ = Math.max(10, ...openWindows.map((w) => w.zIndex));
    return {
      openWindows,
      activeId: parsed.activeId !== null && isWindowId(parsed.activeId) && seen.has(parsed.activeId) ? parsed.activeId : null,
    };
  } catch { return fallback; }
}

function WindowLoadingFallback() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12, background: "#fff", color: "#555" }}>
      Loading...
    </div>
  );
}

interface DesktopProps { onShutdown?: (action: ShutdownAction) => void }

export default function Desktop({ onShutdown }: DesktopProps) {
  const [desktopState, setDesktopState] = useState<PersistedDesktopState>(() => restoreDesktopState());
  const { openWindows, activeId } = desktopState;
  const [selectedIcon, setSelectedIcon]     = useState<WindowId | null>(null);
  const [startOpen, setStartOpen]           = useState(false);
  const [progOpen, setProgOpen]             = useState(false);
  const [ctxMenu, setCtxMenu]               = useState<CtxMenu | null>(null);
  const [shutdownOpen, setShutdownOpen]     = useState(false);
  const [shutdownAction, setShutdownAction] = useState<ShutdownAction>("shutdown");
  const [activeProject, setActiveProject]   = useState<ProjectData | null>(null);
  const [wallpaper, setWallpaper]           = useState("#008080");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DESKTOP_STATE_STORAGE_KEY, JSON.stringify({ openWindows, activeId }));
  }, [activeId, openWindows]);

  const closeMenus = useCallback(() => { setStartOpen(false); setProgOpen(false); setCtxMenu(null); }, []);

  const openWindow = useCallback((id: string) => {
    if (!isWindowId(id)) return;
    setDesktopState((prev) => {
      const existing = prev.openWindows.find((w) => w.id === id);
      topZ++;
      if (existing) {
        return { openWindows: prev.openWindows.map((w) => w.id === id ? { ...w, zIndex: topZ, minimized: false } : w), activeId: id };
      }
      playWindowOpen();
      return {
        openWindows: [...prev.openWindows, { id, zIndex: topZ, x: WINDOW_INITIAL[id].x + Math.random() * 40, y: WINDOW_INITIAL[id].y + Math.random() * 24, minimized: false }],
        activeId: id,
      };
    });
  }, []);

  const openProjectDetail = useCallback((project: ProjectData) => {
    setActiveProject(project);
    setDesktopState((prev) => {
      const existing = prev.openWindows.find((w) => w.id === "project-detail");
      topZ++;
      if (existing) {
        return { openWindows: prev.openWindows.map((w) => w.id === "project-detail" ? { ...w, zIndex: topZ, minimized: false } : w), activeId: "project-detail" };
      }
      playWindowOpen();
      return {
        openWindows: [...prev.openWindows, { id: "project-detail", zIndex: topZ, x: WINDOW_INITIAL["project-detail"].x + Math.random() * 30, y: WINDOW_INITIAL["project-detail"].y + Math.random() * 20, minimized: false }],
        activeId: "project-detail",
      };
    });
  }, []);

  const closeWindow    = useCallback((id: WindowId) => { setDesktopState((prev) => ({ openWindows: prev.openWindows.filter((w) => w.id !== id), activeId: prev.activeId === id ? null : prev.activeId })); }, []);
  const focusWindow    = useCallback((id: WindowId) => { topZ++; setDesktopState((prev) => ({ openWindows: prev.openWindows.map((w) => w.id === id ? { ...w, zIndex: topZ, minimized: false } : w), activeId: id })); }, []);
  const minimizeWindow = useCallback((id: WindowId) => { setDesktopState((prev) => ({ openWindows: prev.openWindows.map((w) => w.id === id ? { ...w, minimized: true } : w), activeId: prev.activeId === id ? null : prev.activeId })); }, []);
  const moveWindow     = useCallback((id: WindowId, x: number, y: number) => { setDesktopState((prev) => ({ ...prev, openWindows: prev.openWindows.map((w) => w.id === id ? { ...w, x, y } : w) })); }, []);

  const handleTaskbarClick = useCallback((win: WindowState) => {
    if (win.minimized || activeId !== win.id) focusWindow(win.id); else minimizeWindow(win.id);
  }, [activeId, focusWindow, minimizeWindow]);

  const handleDesktopCtx = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenus();
    setSelectedIcon(null);
    setCtxMenu({ x: e.clientX, y: Math.min(e.clientY, window.innerHeight - 160) });
  };

  // ── Window content renderer ────────────────────────────────────────────────
  const renderWindowContent = useCallback((id: WindowId): ReactNode => {
    switch (id) {
      case "showcase":
        // ✅ Fixed: removed ownerName/ownerTitle — new ShowcaseWindow only takes onOpen
        return <ShowcaseWindow onOpen={openWindow} />;
      case "about":
        return <AboutWindow />;
      case "experience":
        return <ExperienceWindow />;
      case "projects":
        return <ProjectsWindow />;
      case "project-detail":
        return activeProject ? <ProjectDetailWindow {...activeProject} /> : null;
      case "contact":
        return <ContactWindow />;
      case "wolfenstein":
        return <WolfensteinWindow />;
      case "blog":
        return <Blog />;
      case "netflix":
        return <NetflixWindow />;
      case "msn":
        return <MSNWindow />;
      case "notepad":
        return <NotepadWindow />;
      case "settings":
        return <SettingsWindow onWallpaperChange={(wp) => setWallpaper(wp.value)} />;
      case "run":
        return <RunDialog onOpen={openWindow} onClose={() => closeWindow("run")} />;
      case "internet-explorer":
        return <InternetExplorerWindow />;
      default:
        return null;
    }
  }, [openWindow, openProjectDetail, closeWindow, activeProject]);

  return (
    <div
      className="desktop-root"
      style={{ background: wallpaper }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) setSelectedIcon(null); closeMenus(); }}
      onContextMenu={handleDesktopCtx}
    >
      {/* ── Icons ─────────────────────────────────────────────────────────── */}
      <div className="desktop-icons-col">
        {ICONS.map(({ id, label, Icon }) => (
          <div key={id} className={`desktop-icon${selectedIcon === id ? " selected" : ""}`}
            role="button" tabIndex={0}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon(id); }}
            onDoubleClick={(e) => { e.stopPropagation(); setSelectedIcon(id); openWindow(id); closeMenus(); }}
            onFocus={() => setSelectedIcon(id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedIcon(id); openWindow(id); closeMenus(); } }}
          >
            <div className="icon-image"><Icon size={32} /></div>
            <div className="icon-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Windows ───────────────────────────────────────────────────────── */}
      {openWindows.map((win) => {
        const config = WINDOW_CONFIG[win.id];
        const title = win.id === "project-detail" && activeProject ? activeProject.name : config.title;
        const { Icon, width, height } = config;
        return (
          <OsWindow key={win.id} title={title} icon={<Icon size={14} />}
            onClose={() => closeWindow(win.id)} onMinimize={() => minimizeWindow(win.id)}
            x={win.x} y={win.y} width={width} height={height} zIndex={win.zIndex}
            onFocus={() => focusWindow(win.id)} onMove={(x, y) => moveWindow(win.id, x, y)}
            isActive={activeId === win.id && !win.minimized} minimized={win.minimized}
            className={win.id === "wolfenstein" ? "os-win-game" : ""}
          >
            <Suspense fallback={<WindowLoadingFallback />}>
              {renderWindowContent(win.id)}
            </Suspense>
          </OsWindow>
        );
      })}

      {/* ── Clippy ────────────────────────────────────────────────────────── */}
      <Clippy />

      {/* ── Taskbar ───────────────────────────────────────────────────────── */}
      <header className="header os-taskbar">
        <button
          className={`btn logo os-start-btn${startOpen ? " start-active" : ""}`}
          onClick={(e) => { e.stopPropagation(); setStartOpen((v) => !v); setProgOpen(false); setCtxMenu(null); }}
        >
          <IconWindowsLogo size={16} />
          Start
        </button>
        <div className="os-taskbar-sep" />
        {openWindows.map((win) => {
          const config = WINDOW_CONFIG[win.id];
          const title = win.id === "project-detail" && activeProject ? activeProject.name : config.title;
          const { Icon } = config;
          const isActive = activeId === win.id && !win.minimized;
          return (
            <button key={win.id} className={`nav-item os-titem${isActive ? " is-active" : ""}`}
              onClick={(e) => { e.stopPropagation(); handleTaskbarClick(win); }}
            >
              <span className="os-titem-icon"><Icon size={16} /></span>
              <span className="os-titem-label">{title}</span>
            </button>
          );
        })}
        <div className="os-taskbar-spacer" />
        <div className="os-taskbar-clock"><Clock /></div>
      </header>

      {/* ── Start Menu ────────────────────────────────────────────────────── */}
      {startOpen && (
        <div className="start-menu" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-sidebar"><span className="start-menu-brand">Windows 95</span></div>
          <div className="start-menu-items" onMouseLeave={() => setProgOpen(false)}>
            <div className="start-menu-item has-submenu" onMouseEnter={() => setProgOpen(true)}>
              <span className="start-item-icon"><IconFolder size={16} /></span>
              <span className="start-item-label">Programs</span>
              <span className="start-item-arrow">▶</span>
              {progOpen && (
                <div className="start-submenu">
                  {ICONS.map(({ id, label, Icon }) => (
                    <div key={id} className="start-menu-item" onClick={() => { openWindow(id); closeMenus(); }}>
                      <span className="start-item-icon"><Icon size={16} /></span>
                      <span className="start-item-label">{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="start-menu-sep" />
            <div className="start-menu-item" onMouseEnter={() => setProgOpen(false)} onClick={() => { openWindow("run"); closeMenus(); }}>
              <span className="start-item-icon">🖥</span>
              <span className="start-item-label">Run...</span>
            </div>
            <div className="start-menu-item" onMouseEnter={() => setProgOpen(false)} onClick={() => { openWindow("settings"); closeMenus(); }}>
              <span className="start-item-icon">⚙️</span>
              <span className="start-item-label">Settings</span>
            </div>
            <div className="start-menu-sep" />
            <div className="start-menu-item" onMouseEnter={() => setProgOpen(false)} onClick={() => { closeMenus(); setShutdownOpen(true); }}>
              <span className="start-item-icon">⏻</span>
              <span className="start-item-label">Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Context Menu ──────────────────────────────────────────────────── */}
      {ctxMenu && (
        <div className="ctx-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}
          onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <div className="ctx-menu-item" onClick={closeMenus}>Arrange Icons</div>
          <div className="ctx-menu-item" onClick={closeMenus}>Refresh</div>
          <div className="ctx-menu-sep" />
          <div className="ctx-menu-item" onClick={() => { closeMenus(); openWindow("projects"); }}>Open Projects</div>
          <div className="ctx-menu-item" onClick={() => { closeMenus(); openWindow("blog"); }}>Open Blog</div>
          <div className="ctx-menu-item" onClick={() => { closeMenus(); openWindow("run"); }}>Run...</div>
          <div className="ctx-menu-sep" />
          <div className="ctx-menu-item" onClick={() => { closeMenus(); openWindow("settings"); }}>Display Properties</div>
          <div className="ctx-menu-item" onClick={() => { closeMenus(); openWindow("about"); }}>About This Site</div>
        </div>
      )}

      {/* ── Shutdown Dialog ───────────────────────────────────────────────── */}
      {shutdownOpen && (
        <div className="shutdown-overlay" onClick={() => setShutdownOpen(false)}>
          <div className="dialog shutdown-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header" style={{ cursor: "default" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconMyComputer size={14} />
                <span style={{ fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12, fontWeight: "bold" }}>
                  Shut Down Windows
                </span>
              </div>
            </div>
            <div className="dialog-body shutdown-body" style={{ background: "var(--color-gray-200)" }}>
              <div className="shutdown-top-row">
                <span className="shutdown-big-icon">⏻</span>
                <div>
                  <div className="shutdown-question">What do you want the computer to do?</div>
                  <div className="shutdown-opts">
                    {(["shutdown", "restart", "dos"] as ShutdownAction[]).map((action) => (
                      <label key={action} className="shutdown-opt">
                        <input type="radio" name="sd" checked={shutdownAction === action} onChange={() => setShutdownAction(action)} />
                        {action === "shutdown" ? "Shut down the computer" : action === "restart" ? "Restart the computer" : "Restart in MS-DOS mode"}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="shutdown-footer">
                <button className="btn" onClick={() => { setShutdownOpen(false); onShutdown?.(shutdownAction); }}>OK</button>
                <button className="btn" onClick={() => setShutdownOpen(false)}>Cancel</button>
                <button className="btn" onClick={() => setShutdownOpen(false)}>Help</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
