import { useEffect } from "react";
import { playStartup } from "../sounds";

interface WindowsSplashProps {
  onComplete: () => void;
}

export default function WindowsSplash({ onComplete }: WindowsSplashProps) {
  useEffect(() => {
    playStartup();
    const timer = setTimeout(() => onComplete(), 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="win95-splash">
      <div className="scanlines" />
      <div className="win95-splash-inner">
        <div className="win95-flag" aria-hidden="true">
          <span className="win95-pane win95-red" />
          <span className="win95-pane win95-green" />
          <span className="win95-pane win95-blue" />
          <span className="win95-pane win95-yellow" />
        </div>
        <div className="win95-wordmark">
          <span className="win95-wordmark-windows">Microsoft Windows</span>
          <span className="win95-wordmark-version">95</span>
        </div>
        <div className="win95-tagline">Starting portfolio desktop...</div>
        <div className="win95-progress" aria-hidden="true">
          <span className="win95-progress-bar" />
        </div>
      </div>
    </div>
  );
}
