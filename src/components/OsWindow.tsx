import {
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const clampPosition = useCallback(
    (nextX: number, nextY: number) => {
      const minVisible = Math.min(width, 140);
      const taskbarHeight = 32;
      const titlebarSafeZone = 24;

      return {
        x: Math.min(
          window.innerWidth - minVisible,
          Math.max(-(width - minVisible), nextX),
        ),
        y: Math.min(
          window.innerHeight - taskbarHeight - titlebarSafeZone,
          Math.max(0, nextY),
        ),
      };
    },
    [width],
  );

  const stopDragging = useCallback(() => {
    dragging.current = false;
    setIsDragging(false);
  }, []);

  const onTitlebarPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (maximized) return;
      dragging.current = true;
      setIsDragging(true);
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

  const toggleMaximized = useCallback(() => {
    playClick();
    setMaximized((current) => !current);
    onFocus?.();
  }, [onFocus]);

  const windowStyle = maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 32px)",
        zIndex,
      }
    : { left: x, top: y, width, height, zIndex };

  return (
    <div
      className={`dialog os-win${isActive ? " os-win-active" : " os-win-inactive"}${
        maximized ? " os-win-maximized" : ""
      }${isDragging ? " os-win-dragging" : ""}${minimized ? " os-win-min" : ""}${
        className ? ` ${className}` : ""
      }`}
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
        onDoubleClick={toggleMaximized}
      >
        <div className="os-title-left" title={title}>
          <span className="os-title-icon" aria-hidden="true">
            {icon}
          </span>
          <span className="os-title-text">{title}</span>
          {isDragging && <span className="os-title-dragging">moving</span>}
        </div>
        <div
          className="os-window-controls"
          style={{ display: "flex", gap: 2, flexShrink: 0, marginLeft: 4 }}
        >
          <button
            className="btn os-ctrl-btn"
            title="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              onMinimize?.();
            }}
          >
            ─
          </button>
          <button
            className="btn os-ctrl-btn"
            title={maximized ? "Restore" : "Maximize"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximized();
            }}
          >
            {maximized ? "❐" : "□"}
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
      <div className="dialog-body os-window-body">{children}</div>
    </div>
  );
}
