import { useRef, useState, useCallback, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { playClick, playWindowClose } from "../sounds";

export interface OsWindowProps {
  title: string;
  icon?: ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  children: ReactNode;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zIndex?: number;
  onFocus?: () => void;
  onMove?: (x: number, y: number) => void;
  isActive?: boolean;
  minimized?: boolean;
  className?: string;
}

export default function OsWindow({
  title,
  icon = "🖥",
  onClose,
  onMinimize,
  children,
  x = 80,
  y = 60,
  width = 500,
  height = 400,
  zIndex = 10,
  onFocus,
  onMove,
  isActive = false,
  minimized = false,
  className = "",
}: OsWindowProps) {
  const [maximized, setMaximized] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const clampPosition = useCallback((nextX: number, nextY: number) => ({
    x: Math.min(window.innerWidth - 60, Math.max(0, nextX)),
    y: Math.min(window.innerHeight - 56, Math.max(0, nextY)),
  }), []);

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  const onTitlebarPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (maximized) return;
      dragging.current = true;
      offset.current = { x: e.clientX - x, y: e.clientY - y };
      e.currentTarget.setPointerCapture(e.pointerId);
      playClick();
      onFocus?.();
      e.preventDefault();
    },
    [maximized, onFocus, x, y],
  );

  const onTitlebarPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const nextPos = clampPosition(
        e.clientX - offset.current.x,
        e.clientY - offset.current.y,
      );
      onMove?.(nextPos.x, nextPos.y);
    },
    [clampPosition, onMove],
  );

  const windowStyle = maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100% - 32px)", zIndex }
    : { left: x, top: y, width, height, zIndex };

  return (
    <div
      className={`dialog os-win${minimized ? " os-win-min" : ""}${className ? ` ${className}` : ""}`}
      style={windowStyle as React.CSSProperties}
      onMouseDown={() => onFocus?.()}
    >
      {/* Titlebar — 95CSS .dialog-header + our drag/inactive overrides */}
      <div
        className={`dialog-header${isActive ? "" : " tb-inactive"}`}
        onPointerDown={onTitlebarPointerDown}
        onPointerMove={onTitlebarPointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onLostPointerCapture={stopDragging}
      >
        <div className="os-title-left">
          <span className="os-title-icon">{icon}</span>
          <span className="os-title-text">{title}</span>
        </div>
        <div style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 4 }}>
          <button
            className="btn os-ctrl-btn"
            title="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
          >
            ─
          </button>
          <button
            className="btn os-ctrl-btn"
            title="Maximize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setMaximized((m) => !m); onFocus?.(); }}
          >
            □
          </button>
          <button
            className="btn os-ctrl-btn"
            title="Close"
            style={{ fontWeight: "bold" }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              playWindowClose();
              onClose();
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content — 95CSS .dialog-body + scrollable */}
      <div className="dialog-body">
        {children}
      </div>
    </div>
  );
}
