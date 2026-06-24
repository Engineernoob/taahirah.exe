import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const hours = time.getHours() % 12 || 12;
  const mins = pad(time.getMinutes());
  const secs = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const fullDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      title={fullDate}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "Tahoma, Arial, sans-serif",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 11 }}>🕒</span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          lineHeight: 1.05,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500 }}>
          {hours}:{mins}:{secs} {ampm}
        </span>

        <span
          style={{
            fontSize: 9,
            opacity: 0.8,
          }}
        >
          {time.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
