import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  author: string;
  text: string;
  ts: number;
  self?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const uid = () => Math.random().toString(36).slice(2, 9);

// Polite bot auto-replies when no server is connected
const BOT_REPLIES = [
  "Hey! 👋 Taahirah's portfolio is pretty cool right?",
  "Feel free to check out the Projects window!",
  "You can find her résumé in the taskbar.",
  "She's open to opportunities — hit the Contact window!",
  "Built with React, Three.js, and a lot of caffeine ☕",
  "Nice to meet you! I'm the MSN bot 🤖",
];
let botIdx = 0;

export default function MSNWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      author: "MSN Bot",
      text: "Welcome to MSN Messenger! Say hi 👋",
      ts: Date.now(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const [name, setName] = useState(
    () => localStorage.getItem("msn-name") || "",
  );
  const [nameSet, setNameSet] = useState(
    () => !!localStorage.getItem("msn-name"),
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  // ── Try WebSocket connection (gracefully degrades to bot mode) ─────────────
  useEffect(() => {
    // Replace with your own WS server URL if you have one
    const WS_URL = import.meta.env.VITE_MSN_WS_URL as string | undefined;
    if (!WS_URL) return; // bot-only mode

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as Message;
        setMessages((prev) => [...prev, msg]);
      } catch {}
    };

    return () => ws.close();
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ───────────────────────────────────────────────────────────────────
  const send = () => {
    const text = draft.trim();
    if (!text) return;

    const msg: Message = {
      id: uid(),
      author: name,
      text,
      ts: Date.now(),
      self: true,
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");

    if (connected && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ author: name, text, ts: msg.ts }));
    } else {
      // Bot reply after short delay
      setTimeout(
        () => {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              author: "MSN Bot",
              text: BOT_REPLIES[botIdx % BOT_REPLIES.length],
              ts: Date.now(),
            },
          ]);
          botIdx++;
        },
        800 + Math.random() * 600,
      );
    }
  };

  // ── Name-entry screen ──────────────────────────────────────────────────────
  if (!nameSet) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          fontFamily: "Tahoma, Arial, sans-serif",
          gap: 12,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/MSN_Messenger_6_logo.svg/120px-MSN_Messenger_6_logo.svg.png"
          width={60}
          alt="MSN"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div style={{ fontWeight: "bold", fontSize: 14 }}>MSN Messenger</div>
        <div style={{ fontSize: 12, color: "#555" }}>
          Enter your display name to chat
        </div>
        <input
          className="field"
          style={{ width: 200, fontFamily: "Tahoma", fontSize: 12 }}
          placeholder="Display name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              localStorage.setItem("msn-name", name.trim());
              setName(name.trim());
              setNameSet(true);
            }
          }}
          autoFocus
        />
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12 }}
          onClick={() => {
            if (!name.trim()) return;
            localStorage.setItem("msn-name", name.trim());
            setName(name.trim());
            setNameSet(true);
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 12,
        background: "#fff",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(180deg, #0078d7 0%, #000080 100%)",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>
            MSN Messenger
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10 }}>
            Signed in as <b>{name}</b>
          </div>
        </div>
        <div
          style={{
            fontSize: 9,
            padding: "2px 6px",
            background: connected ? "#00aa00" : "#888",
            color: "#fff",
          }}
        >
          {connected ? "● LIVE" : "● BOT MODE"}
        </div>
      </div>

      {/* ── Message list ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 10px",
          background: "#fff",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: msg.self ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#888",
                marginBottom: 2,
                display: "flex",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: msg.self ? "#000080" : "#8b0000",
                }}
              >
                {msg.author}
              </span>
              <span>{fmt(msg.ts)}</span>
            </div>
            <div
              style={{
                maxWidth: "80%",
                padding: "5px 9px",
                background: msg.self ? "#dce8ff" : "#f0f0f0",
                border: "1px solid",
                borderColor: msg.self ? "#a0b8e0" : "#c8c8c8",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div style={{ height: 1, background: "#c0c0c0" }} />

      {/* ── Input area ─────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "6px 8px",
          background: "#f0f0f0",
          display: "flex",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <input
          className="field"
          style={{ flex: 1, fontFamily: "Tahoma", fontSize: 12 }}
          placeholder="Type a message... (Enter to send)"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          className="btn"
          style={{ fontFamily: "Tahoma", fontSize: 12, minWidth: 56 }}
          onClick={send}
        >
          Send
        </button>
      </div>

      {/* ── Status bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#c0c0c0",
          borderTop: "1px solid #808080",
          padding: "2px 8px",
          fontSize: 10,
          color: "#444",
          boxShadow: "inset 0 1px 0 #fff",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
        <span
          style={{
            cursor: "pointer",
            color: "#000080",
            textDecoration: "underline",
          }}
          onClick={() => {
            localStorage.removeItem("msn-name");
            setNameSet(false);
            setName("");
          }}
        >
          Change name
        </span>
      </div>
    </div>
  );
}
