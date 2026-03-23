import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { unlockAudio } from "../sounds";

// ─── Easing ────────────────────────────────────────────────────────────────────
function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}
function easeInCubic(t: number) {
  return t * t * t;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Monitor screen: scrolling BIOS POST text ─────────────────────────────────
const MONITOR_LINES = [
  "TDBIOS v2.0  (C) 1998 Denmark Hardware Inc.",
  "",
  "CPU  : Intel Pentium MMX 200MHz",
  "FPU  : Installed",
  "Cache: 256KB External",
  "",
  "Memory Test:",
  "  16384K",
  "  32768K",
  "  65536K  OK",
  "",
  "Primary Master   : WDC WD540MB-00CGA0",
  "Primary Slave    : None",
  "Secondary Master : ATAPI 8X CD-ROM",
  "Secondary Slave  : None",
  "",
  "PCI Init ......... OK",
  "USB Init ......... OK",
  "PnP Init ......... OK",
  "IRQ Routing ...... OK",
  "",
  "HIMEM.SYS v3.09 - XMS Driver",
  "EMM386.EXE v4.49",
  "",
  "Loading Windows 95...",
  "",
  "  C:\\> TAAHIRAH.EXE",
  "  Portfolio v1.0 ... OK",
  "  Modules loaded  ... OK",
  "  Welcome, Taahirah.",
  "",
  "  C:\\>_",
  "",
  "",
];

const CANVAS_W = 512;
const CANVAS_H = 384;
const LINE_H = 17;
const VISIBLE_LINES = Math.ceil(CANVAS_H / LINE_H) + 2;

function makeScreenUpdater() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const sCtx = canvas.getContext("2d")!;
  const tex = new THREE.CanvasTexture(canvas);

  function update(t: number) {
    const scrollFrac = (t * 0.55) % MONITOR_LINES.length;
    const startLine = Math.floor(scrollFrac);
    const subPx = (scrollFrac - startLine) * LINE_H;

    sCtx.fillStyle = "#000e00";
    sCtx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    sCtx.font = 'bold 13px "Courier New", Courier, monospace';

    for (let i = 0; i < VISIBLE_LINES; i++) {
      const lineIdx = (startLine + i) % MONITOR_LINES.length;
      const y = i * LINE_H - subPx + LINE_H;
      if (y < -LINE_H || y > CANVAS_H + LINE_H) continue;
      const text = MONITOR_LINES[lineIdx];
      const bright = 0.75 + 0.25 * Math.sin(i * 0.9 + t * 0.4);
      const c = Math.round(lerp(220, 255, bright));
      sCtx.fillStyle = `rgb(${c}, ${c}, ${c})`;
      sCtx.fillText(text, 8, y);
    }

    if (Math.floor(t * 1.5) % 2 === 0) {
      sCtx.fillStyle = "#00e020";
      sCtx.fillRect(8, CANVAS_H - 22, 8, 13);
    }

    sCtx.fillStyle = "rgba(0,0,0,0.18)";
    for (let y = 0; y < CANVAS_H; y += 3) {
      sCtx.fillRect(0, y, CANVAS_W, 1);
    }

    tex.needsUpdate = true;
  }

  return { tex, update };
}

// ─── Poster canvas textures ────────────────────────────────────────────────────

/**
 * Draws a fantasy/isekai-style poster on a canvas:
 * A lone figure silhouetted against a massive glowing moon,
 * with bold Japanese-style title text.
 */
function makePoster_Isekai(): THREE.CanvasTexture {
  const W = 256,
    H = 384;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Deep night-sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#0a0018");
  sky.addColorStop(0.5, "#1a0a2e");
  sky.addColorStop(1, "#0d1a0a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 80; i++) {
    const sx = Math.random() * W;
    const sy = Math.random() * H * 0.7;
    const sr = Math.random() * 1.2 + 0.2;
    ctx.globalAlpha = Math.random() * 0.8 + 0.2;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Giant moon glow (outer halo)
  const moonX = W * 0.52,
    moonY = H * 0.38,
    moonR = 62;
  const moonGlow = ctx.createRadialGradient(
    moonX,
    moonY,
    moonR * 0.5,
    moonX,
    moonY,
    moonR * 2.2,
  );
  moonGlow.addColorStop(0, "rgba(200,160,255,0.38)");
  moonGlow.addColorStop(0.4, "rgba(140,80,220,0.15)");
  moonGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Moon body
  const moonBody = ctx.createRadialGradient(
    moonX - 10,
    moonY - 12,
    5,
    moonX,
    moonY,
    moonR,
  );
  moonBody.addColorStop(0, "#f0e8ff");
  moonBody.addColorStop(0.5, "#d8c0f8");
  moonBody.addColorStop(1, "#9060d0");
  ctx.fillStyle = moonBody;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Moon craters (subtle)
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#6030a0";
  [
    [moonX + 15, moonY - 20, 12],
    [moonX - 22, moonY + 10, 8],
    [moonX + 5, moonY + 30, 6],
  ].forEach(([cx, cy, cr]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Distant mountain silhouettes
  ctx.fillStyle = "#0d0820";
  ctx.beginPath();
  ctx.moveTo(0, H * 0.72);
  ctx.lineTo(W * 0.08, H * 0.52);
  ctx.lineTo(W * 0.18, H * 0.62);
  ctx.lineTo(W * 0.3, H * 0.44);
  ctx.lineTo(W * 0.42, H * 0.58);
  ctx.lineTo(W * 0.55, H * 0.38);
  ctx.lineTo(W * 0.68, H * 0.54);
  ctx.lineTo(W * 0.78, H * 0.46);
  ctx.lineTo(W * 0.88, H * 0.6);
  ctx.lineTo(W, H * 0.5);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Foreground grassy hill
  ctx.fillStyle = "#0a1a08";
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.88, W * 0.7, H * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Standing figure silhouette on the hill
  const figX = W * 0.5,
    figBaseY = H * 0.72;
  ctx.fillStyle = "#050808";
  // Body
  ctx.fillRect(figX - 6, figBaseY - 62, 12, 38);
  // Head
  ctx.beginPath();
  ctx.arc(figX, figBaseY - 70, 9, 0, Math.PI * 2);
  ctx.fill();
  // Cape billowing left
  ctx.beginPath();
  ctx.moveTo(figX - 6, figBaseY - 55);
  ctx.quadraticCurveTo(figX - 38, figBaseY - 35, figX - 28, figBaseY - 22);
  ctx.quadraticCurveTo(figX - 14, figBaseY - 28, figX - 6, figBaseY - 24);
  ctx.closePath();
  ctx.fill();
  // Sword pointing upward
  ctx.strokeStyle = "#c0d8ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(figX + 8, figBaseY - 58);
  ctx.lineTo(figX + 14, figBaseY - 95);
  ctx.stroke();
  ctx.fillStyle = "#c0d8ff";
  ctx.beginPath();
  ctx.moveTo(figX + 14, figBaseY - 99);
  ctx.lineTo(figX + 11, figBaseY - 90);
  ctx.lineTo(figX + 17, figBaseY - 90);
  ctx.closePath();
  ctx.fill();

  // Legs
  ctx.fillStyle = "#050808";
  ctx.fillRect(figX - 5, figBaseY - 24, 5, 18);
  ctx.fillRect(figX + 1, figBaseY - 24, 5, 18);

  // Title block at bottom
  const titleBg = ctx.createLinearGradient(0, H * 0.82, 0, H);
  titleBg.addColorStop(0, "rgba(0,0,0,0)");
  titleBg.addColorStop(0.3, "rgba(0,0,0,0.85)");
  titleBg.addColorStop(1, "rgba(0,0,0,0.95)");
  ctx.fillStyle = titleBg;
  ctx.fillRect(0, H * 0.82, W, H * 0.18);

  ctx.fillStyle = "#e8d8ff";
  ctx.font = "bold 18px serif";
  ctx.textAlign = "center";
  ctx.fillText("異世界の勇者", W / 2, H * 0.915);
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillStyle = "#b090e0";
  ctx.fillText("ISEKAI NO YUUSHA", W / 2, H * 0.955);

  ctx.textAlign = "left";
  return new THREE.CanvasTexture(c);
}

/**
 * Draws an action/shonen-style poster:
 * Dynamic energy blast, chunky manga-style title.
 */
function makePoster_Shonen(): THREE.CanvasTexture {
  const W = 256,
    H = 384;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Dramatic radial speed-lines background
  ctx.fillStyle = "#08080f";
  ctx.fillRect(0, 0, W, H);

  const cx2 = W * 0.5,
    cy2 = H * 0.42;
  const numLines = 80;
  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * Math.PI * 2;
    const bright = i % 3 === 0 ? 0.22 : 0.09;
    ctx.strokeStyle = `rgba(255,220,80,${bright})`;
    ctx.lineWidth = i % 3 === 0 ? 1.5 : 0.8;
    ctx.beginPath();
    ctx.moveTo(cx2 + Math.cos(angle) * 18, cy2 + Math.sin(angle) * 18);
    ctx.lineTo(cx2 + Math.cos(angle) * 400, cy2 + Math.sin(angle) * 400);
    ctx.stroke();
  }

  // Central energy burst
  const burst = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 110);
  burst.addColorStop(0, "rgba(255,255,200,0.95)");
  burst.addColorStop(0.15, "rgba(255,200,30,0.7)");
  burst.addColorStop(0.4, "rgba(255,100,0,0.35)");
  burst.addColorStop(0.7, "rgba(200,20,0,0.15)");
  burst.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = burst;
  ctx.beginPath();
  ctx.arc(cx2, cy2, 110, 0, Math.PI * 2);
  ctx.fill();

  // Figure outline — mid-air battle stance
  ctx.fillStyle = "#0a0a12";
  ctx.strokeStyle = "#ff8800";
  ctx.lineWidth = 2.5;

  // Torso
  ctx.beginPath();
  ctx.roundRect(cx2 - 14, cy2 - 28, 28, 44, 4);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(cx2, cy2 - 38, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Spiky hair
  ctx.fillStyle = "#ff6600";
  const spikes = [
    [-8, -8],
    [-4, -14],
    [2, -16],
    [8, -12],
    [13, -6],
  ];
  spikes.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx2 + dx - 5, cy2 - 44);
    ctx.lineTo(cx2 + dx, cy2 - 44 + dy);
    ctx.lineTo(cx2 + dx + 5, cy2 - 44);
    ctx.fill();
  });

  // Outstretched right arm with energy blast
  ctx.fillStyle = "#0a0a12";
  ctx.strokeStyle = "#ff8800";
  ctx.beginPath();
  ctx.moveTo(cx2 + 14, cy2 - 18);
  ctx.lineTo(cx2 + 55, cy2 - 28);
  ctx.lineTo(cx2 + 58, cy2 - 22);
  ctx.lineTo(cx2 + 18, cy2 - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Energy ball at hand
  const ball = ctx.createRadialGradient(
    cx2 + 62,
    cy2 - 25,
    2,
    cx2 + 62,
    cy2 - 25,
    18,
  );
  ball.addColorStop(0, "#ffffff");
  ball.addColorStop(0.3, "#ffee44");
  ball.addColorStop(0.6, "#ff8800");
  ball.addColorStop(1, "rgba(255,80,0,0)");
  ctx.fillStyle = ball;
  ctx.beginPath();
  ctx.arc(cx2 + 62, cy2 - 25, 18, 0, Math.PI * 2);
  ctx.fill();

  // Left arm raised
  ctx.fillStyle = "#0a0a12";
  ctx.strokeStyle = "#ff8800";
  ctx.beginPath();
  ctx.moveTo(cx2 - 14, cy2 - 18);
  ctx.lineTo(cx2 - 38, cy2 - 50);
  ctx.lineTo(cx2 - 32, cy2 - 56);
  ctx.lineTo(cx2 - 8, cy2 - 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Legs, spread wide
  [
    [cx2 - 8, cy2 + 16, cx2 - 22, cy2 + 60],
    [cx2 + 8, cy2 + 16, cx2 + 28, cy2 + 58],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.fillStyle = "#0a0a12";
    ctx.strokeStyle = "#ff8800";
    ctx.beginPath();
    ctx.moveTo(x1 - 6, y1);
    ctx.lineTo(x2 - 7, y2);
    ctx.lineTo(x2 + 7, y2);
    ctx.lineTo(x1 + 6, y1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Debris / speed marks
  ctx.strokeStyle = "rgba(255,200,80,0.55)";
  ctx.lineWidth = 1.5;
  [
    [-60, -40, -30, -60],
    [50, 60, 80, 40],
    [-70, 20, -45, 30],
    [60, -10, 90, -20],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(cx2 + x1, cy2 + y1);
    ctx.lineTo(cx2 + x2, cy2 + y2);
    ctx.stroke();
  });

  // Title at bottom — bold manga style
  ctx.fillStyle = "#ff6600";
  ctx.font = "bold 26px serif";
  ctx.textAlign = "center";
  // Stroke for outline effect
  ctx.strokeStyle = "#fff700";
  ctx.lineWidth = 4;
  ctx.strokeText("BURST FORCE", W / 2, H * 0.88);
  ctx.fillText("BURST FORCE", W / 2, H * 0.88);

  ctx.font = "bold 10px 'Courier New', monospace";
  ctx.fillStyle = "#ffcc44";
  ctx.strokeStyle = "transparent";
  ctx.fillText("バースト · フォース", W / 2, H * 0.935);

  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.fillStyle = "#ff8800";
  ctx.fillText("VOL. 1  ·  SHONEN EDITION", W / 2, H * 0.968);

  ctx.textAlign = "left";
  return new THREE.CanvasTexture(c);
}

/**
 * Draws a fantasy adventure poster — a dragon soaring over a castle.
 */
function makePoster_Fantasy(): THREE.CanvasTexture {
  const W = 256,
    H = 384;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Sunset gradient sky
  const sky = ctx.createLinearGradient(0, 0, 0, H * 0.75);
  sky.addColorStop(0, "#0f0020");
  sky.addColorStop(0.3, "#2a0840");
  sky.addColorStop(0.6, "#8b1a1a");
  sky.addColorStop(0.85, "#c84820");
  sky.addColorStop(1, "#e87830");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Atmospheric haze bands
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#ff9040" : "#c83010";
    ctx.fillRect(0, H * 0.45 + i * 14, W, 8);
  }
  ctx.globalAlpha = 1;

  // Distant mountains
  ctx.fillStyle = "#1a0830";
  ctx.beginPath();
  ctx.moveTo(0, H * 0.65);
  ctx.lineTo(W * 0.12, H * 0.48);
  ctx.lineTo(W * 0.25, H * 0.56);
  ctx.lineTo(W * 0.38, H * 0.4);
  ctx.lineTo(W * 0.52, H * 0.5);
  ctx.lineTo(W * 0.65, H * 0.38);
  ctx.lineTo(W * 0.78, H * 0.52);
  ctx.lineTo(W * 0.9, H * 0.44);
  ctx.lineTo(W, H * 0.56);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Castle silhouette
  ctx.fillStyle = "#0d0618";
  const castleX = W * 0.35,
    castleY = H * 0.55;
  // Main keep
  ctx.fillRect(castleX, castleY, 60, 80);
  // Battlements
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(castleX + i * 13, castleY - 10, 8, 12);
  }
  // Left tower
  ctx.fillRect(castleX - 15, castleY + 10, 18, 65);
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(castleX - 15 + i * 7, castleY, 5, 12);
  }
  // Right tower
  ctx.fillRect(castleX + 58, castleY + 5, 18, 70);
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(castleX + 58 + i * 7, castleY - 5, 5, 12);
  }
  // Tower spires
  ctx.beginPath();
  ctx.moveTo(castleX - 6, castleY);
  ctx.lineTo(castleX - 15 + 9, castleY - 22);
  ctx.lineTo(castleX + 3, castleY);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(castleX + 58, castleY - 5);
  ctx.lineTo(castleX + 67, castleY - 28);
  ctx.lineTo(castleX + 76, castleY - 5);
  ctx.closePath();
  ctx.fill();
  // Gate
  ctx.fillStyle = "#200838";
  ctx.beginPath();
  ctx.arc(castleX + 30, castleY + 80, 12, Math.PI, 0);
  ctx.fillRect(castleX + 18, castleY + 60, 24, 20);
  ctx.fill();
  // Windows (glowing)
  ctx.fillStyle = "#ff9930";
  [
    [castleX + 10, castleY + 20],
    [castleX + 40, castleY + 18],
    [castleX + 10, castleY + 45],
    [castleX + 40, castleY + 42],
  ].forEach(([wx, wy]) => {
    ctx.globalAlpha = 0.7;
    ctx.fillRect(wx, wy, 8, 10);
  });
  ctx.globalAlpha = 1;

  // Dragon silhouette (large, upper portion)
  ctx.fillStyle = "#0a0015";
  ctx.strokeStyle = "#c84020";
  ctx.lineWidth = 1.5;
  const dx = W * 0.58,
    dy = H * 0.22;

  // Body
  ctx.beginPath();
  ctx.ellipse(dx, dy, 45, 18, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Neck & head
  ctx.beginPath();
  ctx.moveTo(dx + 30, dy - 8);
  ctx.quadraticCurveTo(dx + 55, dy - 30, dx + 70, dy - 18);
  ctx.quadraticCurveTo(dx + 82, dy - 8, dx + 78, dy + 5);
  ctx.quadraticCurveTo(dx + 60, dy + 2, dx + 45, dy - 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.beginPath();
  ctx.moveTo(dx + 78, dy - 10);
  ctx.lineTo(dx + 98, dy - 5);
  ctx.lineTo(dx + 95, dy + 6);
  ctx.lineTo(dx + 76, dy + 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Fire breath
  const fire = ctx.createLinearGradient(dx + 98, dy, dx + 130, dy + 10);
  fire.addColorStop(0, "rgba(255,255,200,0.9)");
  fire.addColorStop(0.3, "rgba(255,160,20,0.75)");
  fire.addColorStop(0.7, "rgba(255,60,0,0.5)");
  fire.addColorStop(1, "rgba(255,30,0,0)");
  ctx.fillStyle = fire;
  ctx.beginPath();
  ctx.moveTo(dx + 98, dy - 2);
  ctx.quadraticCurveTo(dx + 115, dy + 5, dx + 148, dy + 20);
  ctx.quadraticCurveTo(dx + 118, dy + 12, dx + 95, dy + 6);
  ctx.closePath();
  ctx.fill();

  // Left wing (large)
  ctx.fillStyle = "#0a0015";
  ctx.strokeStyle = "#c84020";
  ctx.beginPath();
  ctx.moveTo(dx - 15, dy - 8);
  ctx.quadraticCurveTo(dx - 80, dy - 70, dx - 68, dy - 20);
  ctx.quadraticCurveTo(dx - 60, dy + 5, dx - 25, dy + 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Wing membrane lines
  ctx.strokeStyle = "rgba(200,60,20,0.4)";
  ctx.lineWidth = 0.8;
  [
    [dx - 15, dy - 8, dx - 70, dy - 55],
    [dx - 18, dy, dx - 65, dy - 35],
    [dx - 20, dy + 5, dx - 52, dy - 10],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Right wing (partially behind body)
  ctx.fillStyle = "#0a0015";
  ctx.strokeStyle = "#c84020";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(dx + 15, dy - 12);
  ctx.quadraticCurveTo(dx + 50, dy - 70, dx + 30, dy - 28);
  ctx.quadraticCurveTo(dx + 28, dy - 14, dx + 18, dy - 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(dx - 40, dy + 5);
  ctx.quadraticCurveTo(dx - 62, dy + 28, dx - 55, dy + 44);
  ctx.quadraticCurveTo(dx - 50, dy + 52, dx - 42, dy + 42);
  ctx.strokeStyle = "#c84020";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Ground / foreground dark strip
  ctx.fillStyle = "#08040e";
  ctx.fillRect(0, H * 0.88, W, H * 0.12);

  // Title
  ctx.fillStyle = "#ff6030";
  ctx.font = "bold 20px serif";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#ffcc00";
  ctx.lineWidth = 3;
  ctx.strokeText("CRIMSON REIGN", W / 2, H * 0.935);
  ctx.fillText("CRIMSON REIGN", W / 2, H * 0.935);

  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.fillStyle = "#ffaa40";
  ctx.strokeStyle = "transparent";
  ctx.fillText("THE DRAGON CHRONICLES · VOL. III", W / 2, H * 0.968);

  ctx.textAlign = "left";
  return new THREE.CanvasTexture(c);
}

/**
 * Draws a shonen tournament arc poster — two fighters facing off.
 */
function makePoster_Tournament(): THREE.CanvasTexture {
  const W = 256,
    H = 384;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Black background with diagonal color split
  ctx.fillStyle = "#060610";
  ctx.fillRect(0, 0, W, H);

  // Left side — cool blue
  ctx.fillStyle = "#0a1535";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(W * 0.52, 0);
  ctx.lineTo(W * 0.38, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  // Right side — hot red
  ctx.fillStyle = "#2a0808";
  ctx.beginPath();
  ctx.moveTo(W * 0.52, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, H);
  ctx.lineTo(W * 0.38, H);
  ctx.closePath();
  ctx.fill();

  // Speed lines from center clash point
  const clashX = W * 0.46,
    clashY = H * 0.44;
  for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2;
    const isLeft = Math.cos(angle) < 0;
    ctx.strokeStyle = isLeft ? `rgba(80,140,255,0.3)` : `rgba(255,80,60,0.3)`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(clashX + Math.cos(angle) * 8, clashY + Math.sin(angle) * 8);
    ctx.lineTo(clashX + Math.cos(angle) * 300, clashY + Math.sin(angle) * 300);
    ctx.stroke();
  }

  // Clash burst
  const clashBurst = ctx.createRadialGradient(
    clashX,
    clashY,
    0,
    clashX,
    clashY,
    55,
  );
  clashBurst.addColorStop(0, "rgba(255,255,255,1)");
  clashBurst.addColorStop(0.2, "rgba(255,240,100,0.9)");
  clashBurst.addColorStop(0.5, "rgba(255,120,0,0.5)");
  clashBurst.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = clashBurst;
  ctx.beginPath();
  ctx.arc(clashX, clashY, 55, 0, Math.PI * 2);
  ctx.fill();

  // Left fighter (blue, cool-headed)
  const lx = clashX - 52,
    ly = clashY;
  ctx.fillStyle = "#060a1a";
  ctx.strokeStyle = "#4080ff";
  ctx.lineWidth = 2;
  // Body lean forward
  ctx.save();
  ctx.translate(lx, ly);
  ctx.rotate(0.15);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  // Head
  ctx.beginPath();
  ctx.arc(lx + 4, ly - 32, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Hair
  ctx.fillStyle = "#4080ff";
  ctx.beginPath();
  ctx.moveTo(lx - 6, ly - 38);
  ctx.lineTo(lx + 2, ly - 50);
  ctx.lineTo(lx + 10, ly - 38);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(lx + 8, ly - 40);
  ctx.lineTo(lx + 14, ly - 52);
  ctx.lineTo(lx + 18, ly - 38);
  ctx.fill();
  // Punch arm
  ctx.fillStyle = "#060a1a";
  ctx.strokeStyle = "#4080ff";
  ctx.beginPath();
  ctx.moveTo(lx + 10, ly - 10);
  ctx.lineTo(lx + 44, ly - 22);
  ctx.lineTo(lx + 46, ly - 15);
  ctx.lineTo(lx + 12, ly - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Legs
  ctx.beginPath();
  ctx.moveTo(lx - 8, ly + 22);
  ctx.lineTo(lx - 18, ly + 58);
  ctx.lineTo(lx - 8, ly + 58);
  ctx.lineTo(lx - 2, ly + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lx + 8, ly + 22);
  ctx.lineTo(lx + 5, ly + 58);
  ctx.lineTo(lx + 15, ly + 58);
  ctx.lineTo(lx + 18, ly + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right fighter (red, fierce)
  const rx = clashX + 52,
    ry = clashY;
  ctx.fillStyle = "#1a0606";
  ctx.strokeStyle = "#ff4040";
  ctx.lineWidth = 2;
  ctx.save();
  ctx.translate(rx, ry);
  ctx.rotate(-0.15);
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(rx - 4, ry - 32, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#ff4040";
  ctx.beginPath();
  ctx.moveTo(rx + 6, ry - 38);
  ctx.lineTo(rx - 2, ry - 52);
  ctx.lineTo(rx - 8, ry - 38);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(rx - 10, ry - 40);
  ctx.lineTo(rx - 16, ry - 52);
  ctx.lineTo(rx - 20, ry - 36);
  ctx.fill();
  // Punch arm
  ctx.fillStyle = "#1a0606";
  ctx.strokeStyle = "#ff4040";
  ctx.beginPath();
  ctx.moveTo(rx - 10, ry - 10);
  ctx.lineTo(rx - 44, ry - 22);
  ctx.lineTo(rx - 46, ry - 15);
  ctx.lineTo(rx - 12, ry - 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx + 8, ry + 22);
  ctx.lineTo(rx + 18, ry + 58);
  ctx.lineTo(rx + 8, ry + 58);
  ctx.lineTo(rx + 2, ry + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx - 8, ry + 22);
  ctx.lineTo(rx - 5, ry + 58);
  ctx.lineTo(rx - 15, ry + 58);
  ctx.lineTo(rx - 18, ry + 22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // VS text
  ctx.font = "bold 28px serif";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.strokeText("VS", clashX, clashY + 85);
  ctx.fillStyle = "#ffee00";
  ctx.fillText("VS", clashX, clashY + 85);

  // Title
  ctx.font = "bold 19px serif";
  ctx.strokeStyle = "#ff8800";
  ctx.lineWidth = 3;
  ctx.strokeText("FINAL CLASH", W / 2, H * 0.92);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("FINAL CLASH", W / 2, H * 0.92);

  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.fillStyle = "#aaaacc";
  ctx.strokeStyle = "transparent";
  ctx.fillText("TOURNAMENT ARC  ·  SEASON 3", W / 2, H * 0.958);

  ctx.textAlign = "left";
  return new THREE.CanvasTexture(c);
}

// ─── Add a poster plane to the scene ──────────────────────────────────────────
function addPoster(
  scene: THREE.Scene,
  tex: THREE.CanvasTexture,
  px: number,
  py: number,
  pz: number,
  ry: number = 0,
  tiltZ: number = 0,
  tiltX: number = 0,
) {
  const W = 0.52,
    H = 0.78;

  // Poster plane
  const geo = new THREE.PlaneGeometry(W, H);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0,
    side: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(px, py, pz);
  mesh.rotation.set(tiltX, ry, tiltZ);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Pushpin — a small sphere + cylinder
  const pinMat = new THREE.MeshStandardMaterial({
    color: "#cc3333",
    roughness: 0.5,
    metalness: 0.3,
  });
  const pinHeadGeo = new THREE.SphereGeometry(0.022, 8, 8);
  const pinHead = new THREE.Mesh(pinHeadGeo, pinMat);
  // Offset pin to top-center of poster, slightly in front
  const pinOffset = new THREE.Vector3(0, H / 2 - 0.04, 0.025);
  pinOffset.applyEuler(new THREE.Euler(tiltX, ry, tiltZ));
  pinHead.position.set(px + pinOffset.x, py + pinOffset.y, pz + pinOffset.z);
  scene.add(pinHead);

  const pinStickGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.03, 6);
  const pinStickMat = new THREE.MeshStandardMaterial({
    color: "#888888",
    roughness: 0.4,
    metalness: 0.7,
  });
  const pinStick = new THREE.Mesh(pinStickGeo, pinStickMat);
  pinStick.position.set(
    px + pinOffset.x,
    py + pinOffset.y - 0.02,
    pz + pinOffset.z + 0.01,
  );
  scene.add(pinStick);

  // Subtle drop shadow plane
  const shadowGeo = new THREE.PlaneGeometry(W + 0.04, H + 0.04);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: "#000000",
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.set(px + 0.014, py - 0.012, pz + 0.001);
  shadow.rotation.set(tiltX, ry, tiltZ);
  scene.add(shadow);
}

// ─── Scene builder ─────────────────────────────────────────────────────────────
interface SceneObjects {
  scene: THREE.Scene;
  screenGlow: THREE.PointLight;
  updateScreen: (t: number) => void;
}

function buildScene(): SceneObjects {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050508");
  scene.fog = new THREE.Fog("#050508", 9, 22);

  const ambient = new THREE.AmbientLight("#c8b89a", 1.1);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight("#ffe8c8", 1.8);
  dirLight.position.set(3, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  // Fill light from the left to brighten the desk surface
  const fillLight = new THREE.DirectionalLight("#ffe0b0", 0.9);
  fillLight.position.set(-4, 4, 3);
  scene.add(fillLight);

  // Desk key light — aimed down at the desk to kill the dark bottom
  const deskLight = new THREE.PointLight("#fff5e0", 1.2, 6);
  deskLight.position.set(0, 2.8, 1.2);
  scene.add(deskLight);

  // screenGlow and lampGlow are added after monitors are built below
  const screenGlow = new THREE.PointLight("#22cc44", 1.8, 5.5);
  scene.add(screenGlow);

  const lampGlow = new THREE.PointLight("#1a3a6a", 0.7, 4.0);
  scene.add(lampGlow);

  const accentLight = new THREE.PointLight("#4060ff", 0.35, 9);
  accentLight.position.set(-1.5, 2.5, 1.5);
  scene.add(accentLight);

  // Warmer wall glow to complement eggshell
  const wallGlow = new THREE.PointLight("#ff9060", 0.2, 10);
  wallGlow.position.set(0, 2.8, -3.2);
  scene.add(wallGlow);

  const mat = (color: string, rough = 0.8, metal = 0) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness: rough,
      metalness: metal,
    });
  const box = (w: number, h: number, d: number) =>
    new THREE.BoxGeometry(w, h, d);
  const cyl = (rt: number, rb: number, h: number, seg = 10) =>
    new THREE.CylinderGeometry(rt, rb, h, seg);

  const add = (
    geo: THREE.BufferGeometry,
    material: THREE.Material,
    px: number,
    py: number,
    pz: number,
    rx = 0,
    ry = 0,
    rz = 0,
  ) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px, py, pz);
    m.rotation.set(rx, ry, rz);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };

  // ── Materials ─────────────────────────────────────────────────────────────
  // Dark walnut desk — lighter so it reads as walnut not black
  const walnut = mat("#3d2210", 0.72, 0);
  const walnutEdge = mat("#2a1608", 0.78, 0);
  const charcoal = mat("#1a1a1a", 0.9, 0);
  const mattBlack = mat("#141414", 0.55, 0.15);
  const darkGrey = mat("#1e1e1e", 0.5, 0.2);
  const metalDark = mat("#222222", 0.35, 0.75);

  // ── Floor ─────────────────────────────────────────────────────────────────
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    mat("#100c08", 1, 0),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);

  // ── Walls — eggshell white ────────────────────────────────────────────────
  const wallColor = "#e8e0d0";
  const sideWallColor = "#e2dace";
  add(box(20, 10, 0.14), mat(wallColor, 0.92, 0), 0, 5, -4);
  add(
    box(12, 10, 0.14),
    mat(sideWallColor, 0.92, 0),
    -5,
    5,
    0,
    0,
    Math.PI / 2,
    0,
  );

  // ── Upgraded Desk — dark walnut, wide L-ish surface, metal legs ───────────
  // Main surface — wider and deeper for dual monitor setup
  const DESK_W = 3.6,
    DESK_D = 1.7,
    DESK_Y = 0.82;
  add(box(DESK_W, 0.055, DESK_D), walnut, 0, DESK_Y, 0.22);
  // Front apron
  add(box(DESK_W, 0.06, 0.04), walnutEdge, 0, DESK_Y - 0.058, 1.04);
  // Rear cable management bar
  add(box(DESK_W, 0.04, 0.035), mattBlack, 0, DESK_Y - 0.04, -0.61);
  // Four sleek square metal legs
  const legMat = mat("#1a1a1a", 0.4, 0.7);
  const legPositions: [number, number][] = [
    [-1.72, -0.61],
    [1.72, -0.61],
    [-1.72, 1.0],
    [1.72, 1.0],
  ];
  legPositions.forEach(([lx, lz]) => {
    add(box(0.055, DESK_Y, 0.055), legMat, lx, DESK_Y / 2, lz);
    // Foot pad
    add(box(0.075, 0.012, 0.075), mat("#111", 0.9, 0), lx, 0.006, lz);
  });
  // Under-desk drawer unit (right side)
  add(box(0.52, 0.46, 0.52), mattBlack, 1.5, 0.3, 0.28);
  add(box(0.48, 0.008, 0.5), mat("#2a2a2a", 0.6, 0.3), 1.5, 0.535, 0.28); // drawer top cap
  // Drawer handle
  add(box(0.18, 0.012, 0.012), mat("#333", 0.4, 0.7), 1.5, 0.3, 0.555);

  // ── Dual Monitors — matte black, slim bezels, proper stands ──────────────
  const standMat = mat("#111111", 0.45, 0.55);

  const DESK_TOP = DESK_Y + 0.0275;
  const BEZEL_H = 0.52; // monitor panel height
  const BEZEL_W = 0.9; // monitor panel width
  const BEZEL_D = 0.045; // monitor depth
  // Raise monitor so stand neck is visible below it
  const MON_Y = DESK_TOP + 0.38; // centre height — leaves ~12cm gap under panel
  const MON_Z = -0.15; // monitor Z centre
  const MON_FRONT_Z = MON_Z + BEZEL_D / 2; // front face
  const MON_BACK_Z = MON_Z - BEZEL_D / 2; // back face
  const MON_BOT_Y = MON_Y - BEZEL_H / 2; // bottom edge of panel

  // Stand geometry — think of a real Dell/LG monitor stand:
  // 1. Wide flat base on desk, centred behind-and-under the monitor
  // 2. Short thick neck rising from base up to underside of monitor
  // 3. A small hinge/mount bracket at the top connecting neck to VESA
  const BASE_Z = MON_BACK_Z - 0.08; // base centred just behind panel
  const NECK_H = MON_BOT_Y - DESK_TOP; // neck fills gap from desk to panel bottom
  const NECK_MID_Y = DESK_TOP + NECK_H / 2;
  const NECK_Z = MON_BACK_Z - 0.01; // neck flush against panel back

  const buildStand = (mx: number) => {
    // Base: wide flat foot pad visible from front
    add(box(0.38, 0.02, 0.3), standMat, mx, DESK_TOP + 0.01, BASE_Z);
    add(box(0.24, 0.03, 0.18), standMat, mx, DESK_TOP + 0.025, BASE_Z);
    // Neck: rises from base to bottom of panel, behind the bezel
    add(box(0.06, NECK_H, 0.04), standMat, mx, NECK_MID_Y, NECK_Z);
    // Hinge bracket at top of neck — wider block that spreads into VESA
    add(
      box(0.09, 0.06, 0.055),
      standMat,
      mx,
      MON_BOT_Y + 0.03,
      MON_BACK_Z - 0.025,
    );
    // VESA plate on panel back
    add(box(0.13, 0.1, 0.014), standMat, mx, MON_Y - 0.08, MON_BACK_Z - 0.007);
  };

  // ── Left monitor ──────────────────────────────────────────────────────────
  const lMonX = -0.88;
  buildStand(lMonX);

  const lMonGrp = new THREE.Group();
  lMonGrp.position.set(lMonX, MON_Y, MON_Z);
  lMonGrp.rotation.x = 0.05;
  scene.add(lMonGrp);

  // Outer bezel
  const lBezel = new THREE.Mesh(box(0.96, BEZEL_H, BEZEL_D), mattBlack);
  lBezel.castShadow = true;
  lMonGrp.add(lBezel);
  // Inner recessed ring
  const lInnerBezel = new THREE.Mesh(
    box(BEZEL_W, BEZEL_H - 0.06, 0.01),
    darkGrey,
  );
  lInnerBezel.position.set(0, 0, BEZEL_D / 2 - 0.005);
  lMonGrp.add(lInnerBezel);
  // Screen — sits on the FRONT face (+Z side) of bezel
  const lScreenC = document.createElement("canvas");
  lScreenC.width = 512;
  lScreenC.height = 300;
  const lCtx = lScreenC.getContext("2d")!;
  lCtx.fillStyle = "#0d1117";
  lCtx.fillRect(0, 0, 512, 300);
  lCtx.fillStyle = "#161b22";
  lCtx.fillRect(0, 0, 80, 300);
  lCtx.fillStyle = "#1f2937";
  lCtx.fillRect(80, 0, 432, 22);
  lCtx.fillStyle = "#58a6ff";
  lCtx.fillRect(82, 3, 80, 16);
  lCtx.fillStyle = "#f8f8f2";
  lCtx.font = "bold 9px 'Courier New'";
  lCtx.fillText("LandingScene.tsx", 86, 14);
  const codeLines = [
    { col: "#ff7b72", t: "function buildScene() {" },
    { col: "#8b949e", t: "  // dark walnut desk" },
    { col: "#79c0ff", t: "  const walnut = mat('#3d2210');" },
    { col: "#e3b341", t: "  const monitors = dualSetup();" },
    { col: "#79c0ff", t: "  const chair = highBack();" },
    { col: "#f8f8f2", t: "  addPosters(scene);" },
    { col: "#8b949e", t: "  // eggshell walls ✓" },
    { col: "#f8f8f2", t: "}" },
  ];
  codeLines.forEach((l, i) => {
    lCtx.fillStyle = l.col;
    lCtx.font = "11px 'Courier New'";
    lCtx.fillText(l.t, 88, 48 + i * 22);
  });
  for (let ln = 0; ln < 10; ln++) {
    lCtx.fillStyle = "#3d444d";
    lCtx.font = "10px monospace";
    lCtx.fillText(String(ln + 1).padStart(2), 58, 48 + ln * 22);
  }
  lCtx.fillStyle = "rgba(0,0,0,0.08)";
  for (let sy = 0; sy < 300; sy += 3) lCtx.fillRect(0, sy, 512, 1);
  const lScreenTex = new THREE.CanvasTexture(lScreenC);
  lScreenTex.needsUpdate = true;
  const lScreen = new THREE.Mesh(
    box(0.86, 0.48, 0.002),
    new THREE.MeshBasicMaterial({ map: lScreenTex }),
  );
  // Place screen flush on front face of bezel
  lScreen.position.set(0, 0, BEZEL_D / 2 + 0.001);
  lMonGrp.add(lScreen);
  // Power LED bottom-right corner
  const lLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.005, 6, 6),
    new THREE.MeshBasicMaterial({ color: "#00ff88" }),
  );
  lLed.position.set(0.43, -0.27, BEZEL_D / 2);
  lMonGrp.add(lLed);
  lampGlow.position.set(lMonX, MON_Y, MON_Z + 0.5);

  // ── Right monitor — BIOS animated screen ──────────────────────────────────
  const rMonX = 0.88;
  buildStand(rMonX);
  screenGlow.position.set(rMonX, MON_Y, MON_Z + 0.5);

  const monGrp = new THREE.Group();
  monGrp.position.set(rMonX, MON_Y, MON_Z);
  monGrp.rotation.x = 0.05; // same slight backward tilt, NO Y-rotation
  scene.add(monGrp);

  const bezel = new THREE.Mesh(box(0.96, BEZEL_H, BEZEL_D), mattBlack);
  bezel.castShadow = true;
  monGrp.add(bezel);
  const innerBezel = new THREE.Mesh(
    box(BEZEL_W, BEZEL_H - 0.06, 0.01),
    darkGrey,
  );
  innerBezel.position.set(0, 0, BEZEL_D / 2 - 0.005);
  monGrp.add(innerBezel);
  const { tex: screenTex, update: updateScreen } = makeScreenUpdater();
  screenTex.needsUpdate = true;
  const screen = new THREE.Mesh(
    box(0.86, 0.48, 0.002),
    new THREE.MeshBasicMaterial({ map: screenTex }),
  );
  screen.position.set(0, 0, BEZEL_D / 2 + 0.001);
  monGrp.add(screen);
  const rLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.005, 6, 6),
    new THREE.MeshBasicMaterial({ color: "#00ff88" }),
  );
  rLed.position.set(0.43, -0.27, BEZEL_D / 2);
  monGrp.add(rLed);

  // ── Mechanical Keyboard — centered on desk mat ────────────────────────────
  const kbdGrp = new THREE.Group();
  kbdGrp.position.set(0.0, DESK_TOP + 0.005, 0.55);
  kbdGrp.rotation.y = 0.0;
  scene.add(kbdGrp);

  const kbdBase = new THREE.Mesh(box(0.72, 0.032, 0.26), mattBlack);
  kbdBase.castShadow = true;
  kbdGrp.add(kbdBase);

  const kbdPcb = new THREE.Mesh(box(0.68, 0.01, 0.22), mat("#141414", 0.8, 0));
  kbdPcb.position.set(0, 0.021, -0.005);
  kbdGrp.add(kbdPcb);

  // Draw keycap texture on canvas
  const kcCanvas = document.createElement("canvas");
  kcCanvas.width = 512;
  kcCanvas.height = 192;
  const kcCtx = kcCanvas.getContext("2d")!;
  kcCtx.fillStyle = "#111111";
  kcCtx.fillRect(0, 0, 512, 192);
  // Key rows — 5 rows, each key is a rounded rect
  const rows = [
    { y: 8, keys: 14, w: 34, gap: 2, offsetX: 4 }, // number row
    { y: 54, keys: 14, w: 34, gap: 2, offsetX: 24 }, // QWERTY
    { y: 100, keys: 13, w: 36, gap: 2, offsetX: 34 }, // ASDF
    { y: 146, keys: 12, w: 38, gap: 2, offsetX: 50 }, // ZXCV
  ];
  const legends = ["1234567890-=", "QWERTYUIOP[]", "ASDFGHJKL;'", "ZXCVBNM,./"];
  rows.forEach((row, ri) => {
    for (let k = 0; k < row.keys; k++) {
      const kx = row.offsetX + k * (row.w + row.gap);
      // Key body
      kcCtx.fillStyle = "#1e1e1e";
      kcCtx.beginPath();
      kcCtx.roundRect(kx, row.y, row.w, 38, 3);
      kcCtx.fill();
      // Key top face (slightly lighter, gives height illusion)
      kcCtx.fillStyle = "#2a2a2a";
      kcCtx.beginPath();
      kcCtx.roundRect(kx + 2, row.y + 2, row.w - 4, 30, 2);
      kcCtx.fill();
      // White legend
      const leg = legends[ri]?.[k];
      if (leg) {
        kcCtx.fillStyle = "#e8e8e8";
        kcCtx.font = "bold 11px 'Courier New', monospace";
        kcCtx.textAlign = "center";
        kcCtx.fillText(leg, kx + row.w / 2, row.y + 21);
      }
    }
  });
  // Spacebar
  kcCtx.fillStyle = "#1e1e1e";
  kcCtx.beginPath();
  kcCtx.roundRect(140, 150, 200, 38, 3);
  kcCtx.fill();
  kcCtx.fillStyle = "#2a2a2a";
  kcCtx.beginPath();
  kcCtx.roundRect(143, 152, 194, 30, 2);
  kcCtx.fill();
  kcCtx.textAlign = "left";

  const kcTex = new THREE.CanvasTexture(kcCanvas);
  const kcPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.66, 0.22),
    new THREE.MeshBasicMaterial({ map: kcTex }),
  );
  kcPlane.rotation.x = -Math.PI / 2;
  kcPlane.position.set(0, 0.028, -0.005);
  kbdGrp.add(kcPlane);

  // USB-C cable from keyboard
  add(
    box(0.006, 0.006, 0.1),
    mat("#1a1a1a", 0.9, 0),
    0.32,
    DESK_TOP + 0.018,
    0.44,
  );

  // ── Premium Mouse — right of keyboard ─────────────────────────────────────
  const mouseX = 0.55,
    mouseY = DESK_TOP + 0.018,
    mouseZ = 0.52;
  // Mouse body — ergonomic shape using scaled sphere
  const mouseBodyGeo = new THREE.SphereGeometry(0.052, 12, 10);
  const mouseBody = new THREE.Mesh(mouseBodyGeo, mattBlack);
  mouseBody.scale.set(1, 0.42, 1.4);
  mouseBody.position.set(mouseX, mouseY, mouseZ);
  mouseBody.castShadow = true;
  scene.add(mouseBody);
  // Left/right click split line
  add(
    box(0.003, 0.012, 0.072),
    mat("#0a0a0a", 0.9, 0),
    mouseX,
    mouseY + 0.018,
    mouseZ - 0.02,
  );
  // Scroll wheel
  add(
    cyl(0.009, 0.009, 0.038, 10),
    mat("#333333", 0.5, 0.3),
    mouseX,
    mouseY + 0.024,
    mouseZ - 0.01,
    0,
    0,
    Math.PI / 2,
  );
  // Side buttons
  add(
    box(0.008, 0.012, 0.028),
    mat("#1a1a1a", 0.8, 0),
    mouseX - 0.054,
    mouseY + 0.005,
    mouseZ - 0.01,
  );
  // Mouse logo dot (subtle)
  add(
    new THREE.SphereGeometry(0.005, 6, 6),
    mat("#222222", 0.4, 0.5),
    mouseX,
    mouseY + 0.024,
    mouseZ + 0.03,
  );

  // ── Large desk mat — black, covers center of desk ─────────────────────────
  add(
    box(1.6, 0.003, 0.75),
    mat("#0a0a0a", 0.98, 0),
    0.18,
    DESK_TOP + 0.002,
    0.5,
  );
  add(
    box(1.6, 0.003, 0.01),
    mat("#1a1a1a", 0.9, 0),
    0.18,
    DESK_TOP + 0.003,
    0.12,
  );
  add(
    box(1.6, 0.003, 0.01),
    mat("#1a1a1a", 0.9, 0),
    0.18,
    DESK_TOP + 0.003,
    0.87,
  );

  // ── Coffee mug — left of keyboard ─────────────────────────────────────────
  const mugMat = mat("#e8d5b0", 0.8, 0);
  add(cyl(0.055, 0.048, 0.11, 12), mugMat, -0.62, DESK_TOP + 0.062, 0.52);
  const torusGeo = new THREE.TorusGeometry(0.033, 0.01, 6, 12, Math.PI);
  const handle = new THREE.Mesh(torusGeo, mugMat);
  handle.position.set(-0.562, DESK_TOP + 0.062, 0.52);
  handle.rotation.set(0, 0, Math.PI / 2);
  scene.add(handle);
  add(
    cyl(0.048, 0.048, 0.005, 12),
    mat("#0a0704", 0.9, 0),
    -0.62,
    DESK_TOP + 0.114,
    0.52,
  );

  // ── Books stacked — left rear corner of desk ───────────────────────────────
  const bookColors = ["#8b1a1a", "#1a4a8b", "#1a6a2a"];
  const bookH = [0.028, 0.022, 0.018];
  let by = 0;
  for (let i = 0; i < 3; i++) {
    add(
      box(0.2 - i * 0.01, bookH[i], 0.15),
      mat(bookColors[i], 0.9, 0),
      -1.1,
      DESK_TOP + 0.002 + by + bookH[i] / 2,
      0.1,
    );
    by += bookH[i];
  }

  // ── Plant — far right rear corner ─────────────────────────────────────────
  const potMat = mat("#8b4513", 0.8, 0);
  const plantMat = mat("#1a4a1a", 1, 0);
  add(cyl(0.055, 0.045, 0.09, 10), potMat, 1.55, DESK_TOP + 0.052, 0.1);
  add(cyl(0.05, 0.05, 0.007, 10), charcoal, 1.55, DESK_TOP + 0.098, 0.1);
  add(cyl(0.009, 0.009, 0.08, 6), plantMat, 1.55, DESK_TOP + 0.178, 0.1);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    add(
      box(0.11, 0.004, 0.048),
      plantMat,
      1.55 + Math.sin(angle) * 0.065,
      DESK_TOP + 0.235 + (i % 2) * 0.018,
      0.1 + Math.cos(angle) * 0.065,
      Math.sin(i) * 0.35 - 0.28,
      angle,
      Math.cos(i) * 0.25,
    );
  }

  // ── Chair — centered behind desk, pulled closer so it's visible ──────────
  const chairLeather = mat("#0e0e0e", 0.75, 0.05);
  const chairStitch = mat("#1a1a1a", 0.85, 0);
  const chairMetal = mat("#1c1c1c", 0.35, 0.8);
  const cx = 0.0,
    cz = 1.75; // closer to desk so it's in frame

  // Seat cushion
  add(box(0.62, 0.08, 0.58), chairLeather, cx, 0.56, cz);
  add(box(0.58, 0.02, 0.54), chairStitch, cx, 0.602, cz);
  // Seat frame
  add(box(0.66, 0.04, 0.62), chairMetal, cx, 0.535, cz);

  // Lower back
  add(box(0.6, 0.42, 0.08), chairLeather, cx, 0.88, cz - 0.28, -0.1, 0, 0);
  // Upper back (taller for high-back)
  add(box(0.58, 0.38, 0.07), chairLeather, cx, 1.26, cz - 0.32, -0.08, 0, 0);
  // Back frame
  add(box(0.64, 0.82, 0.04), chairMetal, cx, 1.04, cz - 0.34, -0.09, 0, 0);

  // Lumbar support bulge
  add(
    box(0.44, 0.12, 0.03),
    mat("#141414", 0.8, 0),
    cx,
    0.82,
    cz - 0.31,
    -0.1,
    0,
    0,
  );

  // Headrest
  add(box(0.38, 0.2, 0.07), chairLeather, cx, 1.58, cz - 0.36, -0.06, 0, 0);
  // Headrest support post
  add(
    box(0.025, 0.16, 0.025),
    chairMetal,
    cx - 0.12,
    1.47,
    cz - 0.33,
    -0.06,
    0,
    0,
  );
  add(
    box(0.025, 0.16, 0.025),
    chairMetal,
    cx + 0.12,
    1.47,
    cz - 0.33,
    -0.06,
    0,
    0,
  );

  // Armrests — padded, matte black
  const armY = 0.72,
    armZ = cz - 0.06;
  add(box(0.08, 0.025, 0.32), chairLeather, cx - 0.32, armY, armZ);
  add(box(0.08, 0.025, 0.32), chairLeather, cx + 0.32, armY, armZ);
  add(box(0.06, 0.14, 0.06), chairMetal, cx - 0.32, armY - 0.09, armZ + 0.04);
  add(box(0.06, 0.14, 0.06), chairMetal, cx + 0.32, armY - 0.09, armZ + 0.04);

  // Gas lift cylinder
  const metal = chairMetal;
  add(cyl(0.042, 0.058, 0.52, 10), metal, cx, 0.26, cz);
  add(cyl(0.065, 0.065, 0.055, 10), metal, cx, 0.028, cz);
  // 5-star base
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    add(
      box(0.32, 0.022, 0.048),
      metal,
      cx + Math.sin(ang) * 0.3,
      0.018,
      cz + Math.cos(ang) * 0.3,
      0,
      ang,
      0,
    );
    // Castor wheel
    add(
      cyl(0.028, 0.028, 0.028, 8),
      mat("#0a0a0a", 0.9, 0),
      cx + Math.sin(ang) * 0.44,
      0.014,
      cz + Math.cos(ang) * 0.44,
      Math.PI / 2,
      ang,
      0,
    );
  }

  // ── Trash can — under desk right side ─────────────────────────────────────
  add(cyl(0.12, 0.095, 0.26, 10), mat("#1e1e1e", 0.7, 0.1), 1.55, 0.13, 1.55);
  add(
    cyl(0.125, 0.125, 0.016, 10),
    mat("#2a2a2a", 0.5, 0.3),
    1.55,
    0.258,
    1.55,
  );
  add(
    new THREE.SphereGeometry(0.05, 6, 5),
    mat("#d8d0b8", 0.95, 0),
    1.55,
    0.295,
    1.55,
  );

  // ── Floor lamp (right back corner — away from monitors) ───────────────────
  const floorLampX = 3.8,
    floorLampZ = -2.6;
  // base
  add(
    cyl(0.18, 0.22, 0.04, 12),
    mat("#222222", 0.5, 0.4),
    floorLampX,
    0.02,
    floorLampZ,
  );
  // pole
  add(
    cyl(0.025, 0.025, 3.2, 8),
    mat("#2a2a2a", 0.4, 0.6),
    floorLampX,
    1.62,
    floorLampZ,
  );
  // shade arm
  add(
    box(0.02, 0.02, 0.42),
    mat("#2a2a2a", 0.4, 0.6),
    floorLampX,
    3.18,
    floorLampZ - 0.18,
    0,
    0,
    0,
  );
  // shade
  add(
    new THREE.ConeGeometry(0.28, 0.32, 12, 1, true),
    mat("#c8a060", 0.6, 0),
    floorLampX,
    3.08,
    floorLampZ - 0.38,
    Math.PI,
    0,
    0,
  );
  // floor lamp warm glow
  const floorLampGlow = new THREE.PointLight("#ffcc88", 0.9, 5.5);
  floorLampGlow.position.set(floorLampX, 2.85, floorLampZ - 0.38);
  scene.add(floorLampGlow);

  // ── Sticky notes on right monitor bezel ───────────────────────────────────
  const stickyData = [
    {
      color: "#ffe066",
      x: -0.28,
      y: 0.14,
      rz: -0.08,
      text: ["fix auth bug", "!!"],
    },
    {
      color: "#a8e6a3",
      x: 0.28,
      y: 0.1,
      rz: 0.06,
      text: ["deploy fri", "✓ tests"],
    },
    { color: "#ffb3ba", x: -0.26, y: -0.12, rz: 0.1, text: ["call mom", "🙂"] },
  ];
  stickyData.forEach(({ color, x, y, rz, text }) => {
    const sc = document.createElement("canvas");
    sc.width = 128;
    sc.height = 128;
    const sctx = sc.getContext("2d")!;
    sctx.fillStyle = color;
    sctx.fillRect(0, 0, 128, 128);
    sctx.fillStyle = "rgba(0,0,0,0.12)";
    sctx.beginPath();
    sctx.moveTo(96, 128);
    sctx.lineTo(128, 96);
    sctx.lineTo(128, 128);
    sctx.closePath();
    sctx.fill();
    sctx.fillStyle = "rgba(255,255,255,0.25)";
    sctx.beginPath();
    sctx.moveTo(96, 128);
    sctx.lineTo(128, 96);
    sctx.lineTo(110, 114);
    sctx.closePath();
    sctx.fill();
    sctx.fillStyle = "#333";
    sctx.font = "bold 18px 'Courier New', monospace";
    text.forEach((line, i) => sctx.fillText(line, 10, 32 + i * 26));
    const stex = new THREE.CanvasTexture(sc);
    const smat = new THREE.MeshBasicMaterial({
      map: stex,
      side: THREE.FrontSide,
    });
    const smesh = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), smat);
    smesh.position.set(
      monGrp.position.x + x,
      monGrp.position.y + y,
      monGrp.position.z + BEZEL_D / 2 + 0.002,
    );
    smesh.rotation.set(monGrp.rotation.x, monGrp.rotation.y, rz);
    scene.add(smesh);
  });

  // ── Open notebook — left of keyboard ──────────────────────────────────────
  const nbW = 0.36,
    nbH = 0.005,
    nbD = 0.26;
  const nbX = -0.42,
    nbY = DESK_TOP + 0.004,
    nbZ = 0.3;
  // Left page
  add(box(nbW / 2, nbH, nbD), mat("#f5f0e8", 0.9, 0), nbX - nbW / 4, nbY, nbZ);
  // Right page
  add(box(nbW / 2, nbH, nbD), mat("#f0ece0", 0.9, 0), nbX + nbW / 4, nbY, nbZ);
  // Spine
  add(box(0.012, nbH + 0.004, nbD), mat("#2a1a0a", 0.85, 0), nbX, nbY, nbZ);
  // Cover edge peeking under
  add(
    box(nbW + 0.01, 0.003, nbD + 0.01),
    mat("#1a1008", 0.9, 0),
    nbX,
    nbY - 0.004,
    nbZ,
  );

  // Doodles drawn on canvas texture for right page
  const nbCanvas = document.createElement("canvas");
  nbCanvas.width = 256;
  nbCanvas.height = 256;
  const nctx = nbCanvas.getContext("2d")!;
  nctx.fillStyle = "#f0ece0";
  nctx.fillRect(0, 0, 256, 256);
  // Ruled lines
  nctx.strokeStyle = "#c8c0b0";
  nctx.lineWidth = 1;
  for (let ly = 28; ly < 256; ly += 22) {
    nctx.beginPath();
    nctx.moveTo(8, ly);
    nctx.lineTo(248, ly);
    nctx.stroke();
  }
  // Red margin line
  nctx.strokeStyle = "#e8a0a0";
  nctx.lineWidth = 1.5;
  nctx.beginPath();
  nctx.moveTo(38, 0);
  nctx.lineTo(38, 256);
  nctx.stroke();
  // Handwritten-style notes
  nctx.fillStyle = "#2244aa";
  nctx.font = "italic 13px serif";
  nctx.fillText("portfolio ideas:", 44, 26);
  nctx.font = "12px serif";
  nctx.fillStyle = "#223388";
  [
    "- 3D landing ✓",
    "- projects page",
    "- blog section",
    "- contact form",
  ].forEach((line, i) => {
    nctx.fillText(line, 44, 50 + i * 22);
  });
  // Little star doodle
  nctx.fillStyle = "#cc4444";
  nctx.font = "bold 22px serif";
  nctx.fillText("★", 44, 145);
  // Tiny face sketch
  nctx.strokeStyle = "#556677";
  nctx.lineWidth = 1.5;
  nctx.beginPath();
  nctx.arc(180, 185, 22, 0, Math.PI * 2);
  nctx.stroke();
  nctx.beginPath();
  nctx.arc(172, 179, 3, 0, Math.PI * 2);
  nctx.stroke();
  nctx.beginPath();
  nctx.arc(188, 179, 3, 0, Math.PI * 2);
  nctx.stroke();
  nctx.beginPath();
  nctx.arc(180, 190, 12, 0.1, Math.PI - 0.1);
  nctx.stroke();
  // Arrow doodle
  nctx.strokeStyle = "#338844";
  nctx.lineWidth = 2;
  nctx.beginPath();
  nctx.moveTo(60, 165);
  nctx.lineTo(110, 165);
  nctx.stroke();
  nctx.beginPath();
  nctx.moveTo(104, 159);
  nctx.lineTo(112, 165);
  nctx.lineTo(104, 171);
  nctx.stroke();
  const nbTex = new THREE.CanvasTexture(nbCanvas);
  const nbPageMat = new THREE.MeshBasicMaterial({ map: nbTex });
  const nbPage = new THREE.Mesh(
    new THREE.PlaneGeometry(nbW / 2 - 0.01, nbD - 0.01),
    nbPageMat,
  );
  nbPage.rotation.x = -Math.PI / 2;
  nbPage.position.set(nbX + nbW / 4, nbY + 0.004, nbZ);
  scene.add(nbPage);

  // ── Phone face-down — right rear of desk ──────────────────────────────────
  const phoneX = 0.82,
    phoneY = DESK_TOP + 0.005,
    phoneZ = 0.22;
  // Body
  add(
    box(0.08, 0.008, 0.155),
    mat("#111111", 0.3, 0.6),
    phoneX,
    phoneY,
    phoneZ,
    0,
    0.3,
    0,
  );
  // Back glass sheen
  add(
    box(0.075, 0.009, 0.15),
    mat("#1a1a2e", 0.2, 0.8),
    phoneX,
    phoneY + 0.001,
    phoneZ,
    0,
    0.3,
    0,
  );
  // Camera bump
  add(
    box(0.022, 0.005, 0.022),
    mat("#0a0a0a", 0.4, 0.5),
    phoneX - 0.02,
    phoneY + 0.006,
    phoneZ - 0.048,
    0,
    0.3,
    0,
  );
  // Camera lenses (two)
  add(
    cyl(0.006, 0.006, 0.006, 8),
    mat("#080808", 0.1, 0.9),
    phoneX - 0.016,
    phoneY + 0.009,
    phoneZ - 0.042,
    0,
    0.3,
    0,
  );
  add(
    cyl(0.006, 0.006, 0.006, 8),
    mat("#080808", 0.1, 0.9),
    phoneX - 0.026,
    phoneY + 0.009,
    phoneZ - 0.054,
    0,
    0.3,
    0,
  );

  // ── Itachi Funko Pop — right rear corner of desk ─────────────────────────
  const itachiX = 1.42,
    itachiY = DESK_TOP,
    itachiZ = 0.08;
  // Base
  add(
    box(0.09, 0.015, 0.09),
    mat("#111111", 0.6, 0.2),
    itachiX,
    itachiY,
    itachiZ,
  );
  // Body — Akatsuki black robe
  add(
    box(0.055, 0.1, 0.048),
    mat("#111111", 0.9, 0),
    itachiX,
    itachiY + 0.057,
    itachiZ,
  );
  // Red cloud details on robe (tiny red planes)
  add(
    box(0.056, 0.03, 0.002),
    mat("#cc2222", 0.8, 0),
    itachiX,
    itachiY + 0.065,
    itachiZ + 0.025,
  );
  // Head — oversized Funko style
  add(
    box(0.068, 0.072, 0.06),
    mat("#c8956c", 0.85, 0),
    itachiX,
    itachiY + 0.148,
    itachiZ,
  );
  // Hair — black, spiky swept back
  add(
    box(0.072, 0.018, 0.065),
    mat("#111111", 0.9, 0),
    itachiX,
    itachiY + 0.182,
    itachiZ,
  );
  add(
    box(0.025, 0.038, 0.012),
    mat("#111111", 0.9, 0),
    itachiX - 0.026,
    itachiY + 0.17,
    itachiZ - 0.028,
    -0.3,
    0,
    0.25,
  );
  add(
    box(0.025, 0.038, 0.012),
    mat("#111111", 0.9, 0),
    itachiX + 0.026,
    itachiY + 0.17,
    itachiZ - 0.028,
    -0.3,
    0,
    -0.25,
  );
  // Headband
  add(
    box(0.072, 0.014, 0.01),
    mat("#444444", 0.5, 0.3),
    itachiX,
    itachiY + 0.158,
    itachiZ + 0.026,
  );
  // Scratched Konoha symbol (tiny silver rect)
  add(
    box(0.016, 0.012, 0.002),
    mat("#aaaaaa", 0.3, 0.7),
    itachiX,
    itachiY + 0.158,
    itachiZ + 0.032,
  );
  // Eyes — Sharingan red dots
  add(
    box(0.01, 0.008, 0.002),
    mat("#cc0000", 0.4, 0),
    itachiX - 0.014,
    itachiY + 0.148,
    itachiZ + 0.031,
  );
  add(
    box(0.01, 0.008, 0.002),
    mat("#cc0000", 0.4, 0),
    itachiX + 0.014,
    itachiY + 0.148,
    itachiZ + 0.031,
  );
  // Legs
  add(
    box(0.022, 0.055, 0.038),
    mat("#111111", 0.9, 0),
    itachiX - 0.017,
    itachiY + 0.027,
    itachiZ,
  );
  add(
    box(0.022, 0.055, 0.038),
    mat("#111111", 0.9, 0),
    itachiX + 0.017,
    itachiY + 0.027,
    itachiZ,
  );

  // ── Sukuna Funko Pop — left rear corner of desk ───────────────────────────
  const sukunaX = -1.42,
    sukunaY = DESK_TOP,
    sukunaZ = 0.08;
  // Base
  add(
    box(0.09, 0.015, 0.09),
    mat("#111111", 0.6, 0.2),
    sukunaX,
    sukunaY,
    sukunaZ,
  );
  // Body — dark grey kimono
  add(
    box(0.058, 0.1, 0.05),
    mat("#1a1a1a", 0.9, 0),
    sukunaX,
    sukunaY + 0.057,
    sukunaZ,
  );
  // Kimono accent stripe (red)
  add(
    box(0.01, 0.1, 0.052),
    mat("#aa1111", 0.8, 0),
    sukunaX,
    sukunaY + 0.057,
    sukunaZ,
  );
  // Head — Funko big head, pale skin
  add(
    box(0.072, 0.074, 0.063),
    mat("#e8c8b0", 0.85, 0),
    sukunaX,
    sukunaY + 0.15,
    sukunaZ,
  );
  // Hair — white/silver
  add(
    box(0.076, 0.022, 0.068),
    mat("#e0e0e0", 0.85, 0),
    sukunaX,
    sukunaY + 0.184,
    sukunaZ,
  );
  // Tattoo lines on face (dark pink)
  add(
    box(0.004, 0.032, 0.002),
    mat("#cc5588", 0.7, 0),
    sukunaX - 0.018,
    sukunaY + 0.15,
    sukunaZ + 0.032,
  );
  add(
    box(0.004, 0.032, 0.002),
    mat("#cc5588", 0.7, 0),
    sukunaX + 0.018,
    sukunaY + 0.15,
    sukunaZ + 0.032,
  );
  // Extra eyes (Sukuna's 4 eyes — top pair)
  add(
    box(0.009, 0.007, 0.002),
    mat("#220000", 0.4, 0),
    sukunaX - 0.014,
    sukunaY + 0.162,
    sukunaZ + 0.033,
  );
  add(
    box(0.009, 0.007, 0.002),
    mat("#220000", 0.4, 0),
    sukunaX + 0.014,
    sukunaY + 0.162,
    sukunaZ + 0.033,
  );
  // Bottom pair
  add(
    box(0.009, 0.007, 0.002),
    mat("#220000", 0.4, 0),
    sukunaX - 0.014,
    sukunaY + 0.142,
    sukunaZ + 0.033,
  );
  add(
    box(0.009, 0.007, 0.002),
    mat("#220000", 0.4, 0),
    sukunaX + 0.014,
    sukunaY + 0.142,
    sukunaZ + 0.033,
  );
  // Arms slightly raised (menacing pose)
  add(
    box(0.06, 0.018, 0.022),
    mat("#1a1a1a", 0.9, 0),
    sukunaX - 0.052,
    sukunaY + 0.072,
    sukunaZ,
    0,
    0,
    0.35,
  );
  add(
    box(0.06, 0.018, 0.022),
    mat("#1a1a1a", 0.9, 0),
    sukunaX + 0.052,
    sukunaY + 0.072,
    sukunaZ,
    0,
    0,
    -0.35,
  );
  // Legs
  add(
    box(0.024, 0.055, 0.04),
    mat("#1a1a1a", 0.9, 0),
    sukunaX - 0.018,
    sukunaY + 0.027,
    sukunaZ,
  );
  add(
    box(0.024, 0.055, 0.04),
    mat("#1a1a1a", 0.9, 0),
    sukunaX + 0.018,
    sukunaY + 0.027,
    sukunaZ,
  );

  // ── Bookshelf on left side wall ────────────────────────────────────────────
  // Side wall is at x = -5, faces +x direction.
  // Shelf sits against it, rotated so it faces into the room.
  const shelfX = -4.62;
  const shelfMat = mat("#6b3a1f", 0.82, 0);
  // Back panel
  add(box(0.06, 1.55, 1.35), shelfMat, shelfX - 0.02, 1.22, -1.1, 0, 0, 0);
  // Top, bottom, middle shelves
  add(box(0.38, 0.04, 1.35), shelfMat, shelfX + 0.16, 1.97, -1.1);
  add(box(0.38, 0.04, 1.35), shelfMat, shelfX + 0.16, 0.47, -1.1);
  add(box(0.38, 0.04, 1.35), shelfMat, shelfX + 0.16, 1.22, -1.1);
  // Left + right side panels
  add(box(0.38, 1.55, 0.04), shelfMat, shelfX + 0.16, 1.22, -1.74);
  add(box(0.38, 1.55, 0.04), shelfMat, shelfX + 0.16, 1.22, -0.44);

  // Books on bottom shelf (y ≈ 0.47 + 0.02 = 0.49 base)
  // Manga spines: JJK (purple/black), Bleach (orange/white), Naruto (orange),
  //               HxH (teal), Demon Slayer (dark teal/green)
  const mangaBooks = [
    { title: "JJK", color: "#3a1a5a", accent: "#9933cc", tw: 0.055, th: 0.22 },
    { title: "BLCH", color: "#e8680a", accent: "#ffffff", tw: 0.05, th: 0.22 },
    { title: "NRT", color: "#e85a00", accent: "#ffcc00", tw: 0.055, th: 0.22 },
    { title: "HxH", color: "#1a6a70", accent: "#88dddd", tw: 0.05, th: 0.22 },
    { title: "DS", color: "#1a3a2a", accent: "#66cc88", tw: 0.055, th: 0.22 },
  ];
  let mz = -1.62;
  mangaBooks.forEach(({ title, color, accent, tw, th }) => {
    const bmc = document.createElement("canvas");
    bmc.width = 64;
    bmc.height = 256;
    const bmx = bmc.getContext("2d")!;
    bmx.fillStyle = color;
    bmx.fillRect(0, 0, 64, 256);
    bmx.fillStyle = accent;
    bmx.fillRect(4, 0, 6, 256);
    bmx.fillStyle = accent;
    bmx.font = "bold 14px serif";
    bmx.save();
    bmx.translate(38, 200);
    bmx.rotate(-Math.PI / 2);
    bmx.fillText(title, 0, 0);
    bmx.restore();
    const btex = new THREE.CanvasTexture(bmc);
    const bmesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 0.006), [
      new THREE.MeshStandardMaterial({ map: btex, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: "#f0e8d8", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: "#e8dfc8", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
    ]);
    bmesh.position.set(shelfX + 0.19, 0.49 + th / 2, mz);
    bmesh.rotation.y = Math.PI / 2;
    bmesh.castShadow = true;
    scene.add(bmesh);
    mz += tw + 0.01;
  });

  // Books on top shelf (y ≈ 1.22 + 0.02 = 1.24 base)
  // 48 Laws of Power (black/gold), Art of War (red/gold), Thinking F&S (blue/white)
  const topBooks = [
    {
      title: "48 LAWS",
      subtitle: "OF POWER",
      color: "#0a0a0a",
      accent: "#c8a020",
      tw: 0.07,
      th: 0.26,
    },
    {
      title: "ART",
      subtitle: "OF WAR",
      color: "#8b1010",
      accent: "#e8cc60",
      tw: 0.055,
      th: 0.22,
    },
    {
      title: "THINKING",
      subtitle: "FAST&SLOW",
      color: "#1a3060",
      accent: "#e8e8e8",
      tw: 0.075,
      th: 0.26,
    },
  ];
  let tz = -1.65;
  topBooks.forEach(({ title, subtitle, color, accent, tw, th }) => {
    const tbc = document.createElement("canvas");
    tbc.width = 64;
    tbc.height = 256;
    const tbx = tbc.getContext("2d")!;
    tbx.fillStyle = color;
    tbx.fillRect(0, 0, 64, 256);
    tbx.fillStyle = accent;
    tbx.fillRect(0, 0, 64, 8);
    tbx.fillRect(0, 248, 64, 8);
    tbx.font = "bold 13px serif";
    tbx.fillStyle = accent;
    tbx.save();
    tbx.translate(38, 195);
    tbx.rotate(-Math.PI / 2);
    tbx.fillText(title, 0, 0);
    tbx.restore();
    tbx.font = "10px serif";
    tbx.save();
    tbx.translate(22, 195);
    tbx.rotate(-Math.PI / 2);
    tbx.fillText(subtitle, 0, 0);
    tbx.restore();
    const ttex = new THREE.CanvasTexture(tbc);
    const tmesh = new THREE.Mesh(new THREE.BoxGeometry(tw, th, 0.006), [
      new THREE.MeshStandardMaterial({ map: ttex, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: "#f0e8d8", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: "#e0d8c0", roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
      new THREE.MeshStandardMaterial({ color, roughness: 0.85 }),
    ]);
    tmesh.position.set(shelfX + 0.19, 1.24 + th / 2, tz);
    tmesh.rotation.y = Math.PI / 2;
    tmesh.castShadow = true;
    scene.add(tmesh);
    tz += tw + 0.012;
  });

  // Small knick-knacks on middle shelf
  // Mini succulent pot
  add(
    cyl(0.042, 0.036, 0.07, 8),
    mat("#7a3a10", 0.8, 0),
    shelfX + 0.19,
    1.26,
    -0.72,
  );
  add(
    cyl(0.038, 0.038, 0.005, 8),
    mat("#1a1a1a", 0.9, 0),
    shelfX + 0.19,
    1.298,
    -0.72,
  );
  add(
    cyl(0.006, 0.006, 0.055, 6),
    mat("#1a4a18", 1, 0),
    shelfX + 0.19,
    1.345,
    -0.72,
  );
  // Small figurine / trophy shape
  add(
    cyl(0.025, 0.03, 0.065, 8),
    mat("#c8a020", 0.4, 0.6),
    shelfX + 0.19,
    1.264,
    -0.58,
  );
  add(
    new THREE.SphereGeometry(0.028, 8, 8),
    mat("#c8a020", 0.4, 0.6),
    shelfX + 0.19,
    1.326,
    -0.58,
  );

  // ── Wall layout — back wall front face is at z = -3.93 ────────────────────
  // Horizontal zones (camera sees roughly x = -4.5 to +4.5):
  //  Poster | Poster | CorkBoard | Clock | Whiteboard | Poster | Poster
  const WALL_Z = -3.93;
  const WALL_FACE = WALL_Z; // items sit flush here + tiny z offset

  // ── Cork board — left of centre ────────────────────────────────────────────
  const cbW = 0.95,
    cbH = 0.65;
  const cbX = -1.0,
    cbY = 2.25;
  // Cork board frame (sits flush on wall)
  add(
    box(cbW + 0.06, cbH + 0.06, 0.032),
    mat("#5a3010", 0.9, 0),
    cbX,
    cbY,
    WALL_FACE + 0.016,
  );
  // Cork surface
  const corkC = document.createElement("canvas");
  corkC.width = 512;
  corkC.height = 340;
  const corkCtx = corkC.getContext("2d")!;
  // Cork texture base
  corkCtx.fillStyle = "#c8914a";
  corkCtx.fillRect(0, 0, 512, 340);
  // Cork grain dots
  for (let i = 0; i < 320; i++) {
    corkCtx.fillStyle = `rgba(${100 + Math.random() * 60},${55 + Math.random() * 40},${20 + Math.random() * 20},0.35)`;
    corkCtx.beginPath();
    corkCtx.ellipse(
      Math.random() * 512,
      Math.random() * 340,
      Math.random() * 6 + 1,
      Math.random() * 3 + 1,
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    corkCtx.fill();
  }
  const corkTex = new THREE.CanvasTexture(corkC);
  const corkMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(cbW, cbH),
    new THREE.MeshStandardMaterial({ map: corkTex, roughness: 0.95 }),
  );
  corkMesh.position.set(cbX, cbY, WALL_FACE + 0.034);
  scene.add(corkMesh);

  // Pinned notes on cork board
  const corkNotes = [
    {
      x: cbX - 0.35,
      y: cbY + 0.18,
      color: "#ffe066",
      rz: -0.07,
      lines: ["Sprint Goals", "✓ landing pg", "→ projects"],
    },
    {
      x: cbX + 0.05,
      y: cbY + 0.2,
      color: "#b8f0b8",
      rz: 0.05,
      lines: ["TODO", "résumé pdf", "dark mode"],
    },
    {
      x: cbX + 0.38,
      y: cbY + 0.15,
      color: "#ffc8c8",
      rz: -0.04,
      lines: ["inspo:", "awwwards.com", "lottiefiles"],
    },
    {
      x: cbX - 0.28,
      y: cbY - 0.18,
      color: "#c8e8ff",
      rz: 0.09,
      lines: ["remember:", "ship it!", "done > perfect"],
    },
    {
      x: cbX + 0.22,
      y: cbY - 0.15,
      color: "#ffe066",
      rz: -0.06,
      lines: ["reading:", "48 Laws ✓", "Clean Code →"],
    },
  ];
  corkNotes.forEach(({ x, y, color, rz, lines }) => {
    const nc = document.createElement("canvas");
    nc.width = 160;
    nc.height = 160;
    const nctx2 = nc.getContext("2d")!;
    nctx2.fillStyle = color;
    nctx2.fillRect(0, 0, 160, 160);
    nctx2.fillStyle = "rgba(0,0,0,0.07)";
    nctx2.fillRect(0, 148, 160, 12);
    nctx2.fillStyle = "#333";
    nctx2.font = "bold 16px 'Courier New', monospace";
    nctx2.fillText(lines[0], 10, 26);
    nctx2.font = "13px 'Courier New', monospace";
    nctx2.fillStyle = "#444";
    lines.slice(1).forEach((l, i) => nctx2.fillText(l, 10, 52 + i * 22));
    const ntex = new THREE.CanvasTexture(nc);
    const nmesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.18),
      new THREE.MeshBasicMaterial({ map: ntex }),
    );
    nmesh.position.set(x, y, WALL_FACE + 0.052);
    nmesh.rotation.z = rz;
    scene.add(nmesh);
    // Pushpin
    const ppin = new THREE.Mesh(
      new THREE.SphereGeometry(0.014, 6, 6),
      new THREE.MeshStandardMaterial({
        color: "#dd3333",
        roughness: 0.5,
        metalness: 0.3,
      }),
    );
    ppin.position.set(x, y + 0.085, WALL_FACE + 0.065);
    scene.add(ppin);
  });

  // ── Whiteboard — right of centre ──────────────────────────────────────────
  const wbW = 0.95,
    wbH = 0.65;
  const wbX = 1.0,
    wbY = 2.25;
  // Frame
  add(
    box(wbW + 0.06, wbH + 0.06, 0.035),
    mat("#888888", 0.4, 0.5),
    wbX,
    wbY,
    WALL_Z + 0.01,
  );
  // Whiteboard surface with writing
  const wbC = document.createElement("canvas");
  wbC.width = 512;
  wbC.height = 320;
  const wbCtx = wbC.getContext("2d")!;
  wbCtx.fillStyle = "#f8f8f6";
  wbCtx.fillRect(0, 0, 512, 320);
  // Faint marker ghost marks
  wbCtx.fillStyle = "rgba(180,180,200,0.15)";
  wbCtx.fillRect(20, 60, 200, 3);
  wbCtx.fillRect(20, 100, 160, 3);
  // Marker writing
  wbCtx.strokeStyle = "#1144cc";
  wbCtx.lineWidth = 3;
  wbCtx.font = "bold 28px serif";
  wbCtx.fillStyle = "#1144cc";
  wbCtx.fillText("System Design", 20, 48);
  wbCtx.lineWidth = 2;
  wbCtx.beginPath();
  wbCtx.moveTo(20, 56);
  wbCtx.lineTo(290, 56);
  wbCtx.stroke();
  wbCtx.font = "20px serif";
  wbCtx.fillStyle = "#222222";
  wbCtx.fillText("Client  →  API  →  DB", 30, 88);
  // Arrow
  wbCtx.strokeStyle = "#cc2222";
  wbCtx.lineWidth = 2.5;
  wbCtx.beginPath();
  wbCtx.moveTo(30, 110);
  wbCtx.lineTo(30, 170);
  wbCtx.lineTo(120, 170);
  wbCtx.stroke();
  wbCtx.beginPath();
  wbCtx.moveTo(112, 163);
  wbCtx.lineTo(122, 170);
  wbCtx.lineTo(112, 177);
  wbCtx.stroke();
  // Box diagram
  wbCtx.strokeStyle = "#338833";
  wbCtx.lineWidth = 2;
  wbCtx.strokeRect(140, 110, 100, 50);
  wbCtx.font = "16px serif";
  wbCtx.fillStyle = "#338833";
  wbCtx.fillText("Cache", 165, 140);
  wbCtx.strokeRect(260, 110, 100, 50);
  wbCtx.fillStyle = "#884400";
  wbCtx.fillText("Queue", 283, 140);
  // Bottom note
  wbCtx.font = "italic 15px serif";
  wbCtx.fillStyle = "#aa2222";
  wbCtx.fillText("* revisit auth flow tmrw", 20, 240);
  // Erased smudge
  wbCtx.fillStyle = "rgba(220,220,210,0.6)";
  wbCtx.fillRect(380, 80, 110, 60);
  const wbTex = new THREE.CanvasTexture(wbC);
  const wbMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(wbW, wbH),
    new THREE.MeshStandardMaterial({
      map: wbTex,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );
  wbMesh.position.set(wbX, wbY, WALL_Z + 0.03);
  scene.add(wbMesh);
  // Marker tray at bottom of whiteboard
  add(
    box(wbW, 0.025, 0.045),
    mat("#777777", 0.4, 0.5),
    wbX,
    wbY - wbH / 2 - 0.01,
    WALL_Z + 0.04,
  );
  // Marker on tray
  add(
    box(0.12, 0.018, 0.018),
    mat("#1144cc", 0.6, 0),
    wbX - 0.28,
    wbY - wbH / 2 + 0.01,
    WALL_Z + 0.06,
  );

  // ── Wall clock — dead centre between cork board and whiteboard ─────────────
  const clockX = 0.0,
    clockY = 2.3;
  const clockFaceC = document.createElement("canvas");
  clockFaceC.width = 256;
  clockFaceC.height = 256;
  const cfCtx = clockFaceC.getContext("2d")!;
  // Face
  cfCtx.fillStyle = "#f5f0e8";
  cfCtx.beginPath();
  cfCtx.arc(128, 128, 122, 0, Math.PI * 2);
  cfCtx.fill();
  cfCtx.strokeStyle = "#222222";
  cfCtx.lineWidth = 6;
  cfCtx.beginPath();
  cfCtx.arc(128, 128, 122, 0, Math.PI * 2);
  cfCtx.stroke();
  // Hour markers
  cfCtx.fillStyle = "#1a1a1a";
  for (let h = 0; h < 12; h++) {
    const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
    const isMajor = h % 3 === 0;
    const r1 = isMajor ? 96 : 105;
    cfCtx.beginPath();
    cfCtx.arc(
      128 + Math.cos(a) * r1,
      128 + Math.sin(a) * r1,
      isMajor ? 6 : 3,
      0,
      Math.PI * 2,
    );
    cfCtx.fill();
  }
  // Hour numbers
  cfCtx.font = "bold 20px serif";
  cfCtx.fillStyle = "#1a1a1a";
  cfCtx.textAlign = "center";
  [
    [12, 128, 22],
    [3, 234, 134],
    [6, 128, 242],
    [9, 24, 134],
  ].forEach(([n, x, y]) => cfCtx.fillText(String(n), x, y));
  cfCtx.textAlign = "left";
  // Hands — show ~10:10 (classic watch pose)
  const drawHand = (
    angleDeg: number,
    length: number,
    width: number,
    color: string,
  ) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    cfCtx.strokeStyle = color;
    cfCtx.lineWidth = width;
    cfCtx.lineCap = "round";
    cfCtx.beginPath();
    cfCtx.moveTo(128, 128);
    cfCtx.lineTo(128 + Math.cos(a) * length, 128 + Math.sin(a) * length);
    cfCtx.stroke();
  };
  drawHand(300, 72, 7, "#1a1a1a"); // hour ~10
  drawHand(60, 95, 5, "#1a1a1a"); // minute ~2
  drawHand(180, 100, 2, "#cc2222"); // second
  // Center dot
  cfCtx.fillStyle = "#cc2222";
  cfCtx.beginPath();
  cfCtx.arc(128, 128, 7, 0, Math.PI * 2);
  cfCtx.fill();
  cfCtx.fillStyle = "#111";
  cfCtx.beginPath();
  cfCtx.arc(128, 128, 3, 0, Math.PI * 2);
  cfCtx.fill();
  const clockTex = new THREE.CanvasTexture(clockFaceC);
  // Clock rim
  add(
    new THREE.CylinderGeometry(0.24, 0.24, 0.04, 24),
    mat("#2a2a2a", 0.3, 0.6),
    clockX,
    clockY,
    WALL_Z + 0.04,
    Math.PI / 2,
    0,
    0,
  );
  const clockMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 32),
    new THREE.MeshBasicMaterial({ map: clockTex }),
  );
  clockMesh.position.set(clockX, clockY, WALL_Z + 0.065);
  scene.add(clockMesh);

  // ── Posters — evenly spread across back wall, staggered Z to avoid fighting ─
  addPoster(scene, makePoster_Isekai(), -3.2, 2.0, WALL_Z + 0.0, 0, 0.02, 0);
  addPoster(scene, makePoster_Shonen(), -2.1, 2.0, WALL_Z + 0.002, 0, -0.02, 0);
  addPoster(scene, makePoster_Fantasy(), 2.1, 2.0, WALL_Z + 0.0, 0, 0.02, 0);
  addPoster(
    scene,
    makePoster_Tournament(),
    3.2,
    2.0,
    WALL_Z + 0.002,
    0,
    -0.02,
    0,
  );

  return { scene, screenGlow, updateScreen };
}

// ─── Camera rig ────────────────────────────────────────────────────────────────
const IDLE = {
  lookAt: new THREE.Vector3(0, 1.1, 0),
  azimuth: 0.55,
  elevation: 0.38,
  radius: 6.2,
};

const ZOOM_END = {
  lookAt: new THREE.Vector3(0.88, 1.23, -0.15),
  azimuth: -0.12,
  elevation: 0.08,
  radius: 1.75,
};

// ─── Component ────────────────────────────────────────────────────────────────
interface LandingSceneProps {
  onStart: () => void;
  mode?: "intro" | "shutdown";
}

type ScenePhase = "idle" | "zoomingIn" | "pullingBack";

export default function LandingScene({
  onStart,
  mode = "intro",
}: LandingSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const isShutdownMode = mode === "shutdown";
  const phaseRef = useRef<ScenePhase>(isShutdownMode ? "pullingBack" : "idle");
  const [phase, setPhase] = useState<ScenePhase>(phaseRef.current);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [webglFailed, setWebglFailed] = useState(false);
  const promptText = isShutdownMode
    ? "Click anywhere to power on"
    : "Click anywhere to begin";

  const setScenePhase = (next: ScenePhase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    const id = setInterval(() => setCursorVisible((v) => !v), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouseRef.current.x = (t.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((t.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    if (!isShutdownMode || !webglFailed) return;
    const timer = setTimeout(() => setScenePhase("idle"), 2200);
    return () => clearTimeout(timer);
  }, [isShutdownMode, webglFailed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const testCtx =
      document.createElement("canvas").getContext("webgl") ||
      document.createElement("canvas").getContext("experimental-webgl");
    if (!testCtx) {
      setWebglFailed(true);
      return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      60,
    );

    const { scene, screenGlow, updateScreen } = buildScene();

    let curAzimuth = isShutdownMode ? ZOOM_END.azimuth : IDLE.azimuth;
    let curElevation = isShutdownMode ? ZOOM_END.elevation : IDLE.elevation;
    let curRadius = isShutdownMode ? ZOOM_END.radius : IDLE.radius;
    const curLookAt = (isShutdownMode ? ZOOM_END.lookAt : IDLE.lookAt).clone();
    let zoomProgress = isShutdownMode ? 1 : 0;

    let rafId = 0;
    let startTime = performance.now();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const t = (now - startTime) / 1000;

      if (phaseRef.current === "zoomingIn" && zoomProgress < 1) {
        zoomProgress = Math.min(1, zoomProgress + 0.016 * 0.55);
      }
      if (phaseRef.current === "pullingBack" && zoomProgress > 0) {
        zoomProgress = Math.max(0, zoomProgress - 0.016 * 0.6);
        if (zoomProgress === 0) setScenePhase("idle");
      }
      const zoomT = easeInOutQuint(zoomProgress);

      const idleAzOscil = Math.sin(t * 0.07) * 0.09;
      const idleElOscil = Math.sin(t * 0.05 + 1.2) * 0.018;
      const parallaxWeight = Math.max(0, 1 - zoomT * 2);
      const mouseAz = mouseRef.current.x * 0.08 * parallaxWeight;
      const mouseEl = mouseRef.current.y * 0.035 * parallaxWeight;

      const desiredAz = IDLE.azimuth + idleAzOscil + mouseAz;
      const desiredEl = IDLE.elevation + idleElOscil + mouseEl;

      const targetAz = lerp(desiredAz, ZOOM_END.azimuth, zoomT);
      const targetEl = lerp(desiredEl, ZOOM_END.elevation, zoomT);
      const targetRadius = lerp(IDLE.radius, ZOOM_END.radius, zoomT);
      const targetLookAt = IDLE.lookAt.clone().lerp(ZOOM_END.lookAt, zoomT);

      const followSpeed =
        phaseRef.current === "zoomingIn"
          ? 6.0
          : phaseRef.current === "pullingBack"
            ? 4.2
            : 2.5;
      const dt = 0.016;
      curAzimuth += (targetAz - curAzimuth) * Math.min(1, followSpeed * dt);
      curElevation += (targetEl - curElevation) * Math.min(1, followSpeed * dt);
      curRadius += (targetRadius - curRadius) * Math.min(1, followSpeed * dt);
      curLookAt.lerp(targetLookAt, Math.min(1, followSpeed * dt));

      const cosEl = Math.cos(curElevation);
      camera.position.set(
        curLookAt.x + curRadius * cosEl * Math.sin(curAzimuth),
        curLookAt.y + curRadius * Math.sin(curElevation),
        curLookAt.z + curRadius * cosEl * Math.cos(curAzimuth),
      );
      camera.lookAt(curLookAt);

      updateScreen(t);
      const pulse = 0.9 + Math.sin(t * 2.1) * 0.1;
      screenGlow.intensity = lerp(1.2, 2.4, zoomT) * pulse;

      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    const onResize = () => {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [isShutdownMode]);

  const handleClick = () => {
    if (phaseRef.current !== "idle") return;
    unlockAudio();
    setScenePhase("zoomingIn");
    setTimeout(() => setFadeOpacity(1), 1100);
    setTimeout(() => onStart(), 2500);
  };

  if (webglFailed) {
    return (
      <div
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background:
            "radial-gradient(ellipse at 40% 50%, #1a2a1a 0%, #050508 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: phase === "idle" ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 64,
              marginBottom: 16,
              filter: "drop-shadow(0 0 20px rgba(0,200,80,0.5))",
            }}
          >
            🖥️
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#e8ffe8",
              letterSpacing: "0.06em",
              fontFamily: "'Courier New', monospace",
              marginBottom: 6,
              textShadow: "0 0 18px rgba(0,220,80,0.55)",
            }}
          >
            TAAHIRAH DENMARK
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#4db870",
              letterSpacing: "0.22em",
              fontFamily: "'Courier New', monospace",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            Software Engineer
          </div>
          {phase === "idle" && (
            <div
              style={{
                color: "#909898",
                fontFamily: "'Courier New', monospace",
                fontSize: 15,
                letterSpacing: "0.14em",
                textShadow: "0 0 14px rgba(0,200,80,0.45)",
              }}
            >
              {promptText} {cursorVisible ? "█" : "\u00a0"}
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: fadeOpacity,
            transition: "opacity 1.4s ease-in",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#050508",
        cursor: phase === "idle" ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 28,
          left: 36,
          zIndex: 3,
          fontFamily: "'Courier Prime', 'Courier New', monospace",
          pointerEvents: "none",
          opacity: phase === "idle" ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#e8ffe8",
            letterSpacing: "0.06em",
            textShadow:
              "0 0 18px rgba(0,220,80,0.55), 0 0 40px rgba(0,180,60,0.25)",
            lineHeight: 1.1,
          }}
        >
          TAAHIRAH DENMARK
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#4db870",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginTop: 5,
            textShadow: "0 0 10px rgba(0,200,80,0.4)",
          }}
        >
          Software Engineer
        </div>
      </div>

      {phase === "idle" && (
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#909898",
            fontFamily: "'Courier Prime', 'Courier New', monospace",
            fontSize: 15,
            letterSpacing: "0.14em",
            zIndex: 3,
            textShadow: "0 0 14px rgba(0,200,80,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {promptText} {cursorVisible ? "█" : "\u00a0"}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: fadeOpacity,
          transition: "opacity 1.4s ease-in",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  );
}
