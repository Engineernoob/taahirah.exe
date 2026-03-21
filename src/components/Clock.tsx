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
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  return (
    <span>
      {hours}:{mins} {ampm}
    </span>
  );
}
