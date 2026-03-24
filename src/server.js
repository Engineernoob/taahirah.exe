// server.js — MSN Live Chat WebSocket server
// Deploy to Railway, Render, or Fly.io (all have free tiers)
//
// Install: npm install ws
// Run locally: node server.js
// Then set VITE_MSN_WS_URL=ws://localhost:8080 in your .env

const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

// Simple profanity filter — add words as needed
const BLOCKED = ["spam", "hate"];
const filter = (text) => BLOCKED.some((w) => text.toLowerCase().includes(w));

// Broadcast to all connected clients except sender
const broadcast = (wss, sender, data) => {
  wss.clients.forEach((client) => {
    if (client !== sender && client.readyState === 1) {
      client.send(data);
    }
  });
};

wss.on("connection", (ws) => {
  console.log(`Client connected — ${wss.clients.size} online`);

  // Send current online count to everyone
  const countMsg = JSON.stringify({ type: "count", count: wss.clients.size });
  wss.clients.forEach((c) => c.readyState === 1 && c.send(countMsg));

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      // Validate
      if (!msg.author || !msg.text) return;
      if (msg.text.length > 500) return;
      if (filter(msg.text)) return;

      // Stamp server-side id + ts to prevent spoofing
      const out = JSON.stringify({
        id: Math.random().toString(36).slice(2, 9),
        author: String(msg.author).slice(0, 32),
        text: String(msg.text).slice(0, 500),
        ts: Date.now(),
      });

      broadcast(wss, ws, out);
    } catch (e) {
      // Ignore malformed messages
    }
  });

  ws.on("close", () => {
    console.log(`Client left — ${wss.clients.size} online`);
    const countMsg = JSON.stringify({ type: "count", count: wss.clients.size });
    wss.clients.forEach((c) => c.readyState === 1 && c.send(countMsg));
  });
});

console.log(`MSN WS server running on ws://localhost:${PORT}`);
