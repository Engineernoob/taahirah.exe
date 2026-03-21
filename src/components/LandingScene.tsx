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
  shadow.position.set(px + 0.014, py - 0.012, pz - 0.003);
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

  const ambient = new THREE.AmbientLight("#b0a898", 0.55); // warmer, brighter for white walls
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight("#ffe8c8", 1.4);
  dirLight.position.set(4, 8, 4);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  const screenGlow = new THREE.PointLight("#22cc44", 2.0, 7.0);
  screenGlow.position.set(0.1, 1.7, 0.18);
  scene.add(screenGlow);

  const lampGlow = new THREE.PointLight("#ffe8a0", 0.7, 2.2);
  lampGlow.position.set(1.08, 1.52, -0.38);
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

  const wood = mat("#5c3418", 0.82, 0);
  const charcoal = mat("#1a1a1a", 0.9, 0);
  const darkGrey = mat("#252525", 0.6, 0.1);
  const ivory = mat("#d8d0bc", 0.9, 0);

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
  // Eggshell: warm off-white, slightly creamy, not pure white
  const wallColor = "#e8e0d0";
  const sideWallColor = "#e2dace";
  add(box(20, 10, 0.14), mat(wallColor, 0.92, 0), 0, 5, -4); // back wall
  add(
    box(12, 10, 0.14),
    mat(sideWallColor, 0.92, 0),
    -5,
    5,
    0,
    0,
    Math.PI / 2,
    0,
  ); // side wall

  // ── Desk ──────────────────────────────────────────────────────────────────
  add(box(2.8, 0.07, 1.6), wood, 0, 0.82, 0.3);
  add(box(2.8, 0.12, 0.06), wood, 0, 0.78, 1.08);
  add(box(0.06, 0.85, 1.6), wood, -1.37, 0.42, 0.3);
  add(box(0.06, 0.85, 1.6), wood, 1.37, 0.42, 0.3);
  add(box(2.68, 0.85, 0.06), wood, 0, 0.42, -0.47);
  add(box(0.58, 0.7, 1.35), charcoal, -0.8, 0.42, 0.3);
  add(box(0.58, 0.7, 1.35), charcoal, 0.8, 0.42, 0.3);

  // ── Monitor ───────────────────────────────────────────────────────────────
  add(box(0.38, 0.04, 0.32), darkGrey, 0.1, 0.87, -0.05);
  add(box(0.07, 0.42, 0.07), darkGrey, 0.1, 1.08, -0.05);

  const monGrp = new THREE.Group();
  monGrp.position.set(0.1, 1.55, -0.07);
  monGrp.rotation.x = 0.06;
  scene.add(monGrp);

  const bezel = new THREE.Mesh(box(0.88, 0.72, 0.22), darkGrey);
  bezel.castShadow = true;
  monGrp.add(bezel);

  const innerBezel = new THREE.Mesh(box(0.76, 0.6, 0.04), charcoal);
  innerBezel.position.set(0, 0, 0.095);
  monGrp.add(innerBezel);

  const { tex: screenTex, update: updateScreen } = makeScreenUpdater();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const screen = new THREE.Mesh(box(0.7, 0.54, 0.005), screenMat);
  screen.position.set(0, 0, 0.115);
  monGrp.add(screen);

  const btnMat = mat("#151515", 0.9, 0);
  for (let i = 0; i < 2; i++) {
    const btn = new THREE.Mesh(cyl(0.012, 0.012, 0.015, 8), btnMat);
    btn.position.set(0.3 - i * 0.06, -0.28, 0.112);
    btn.rotation.x = Math.PI / 2;
    monGrp.add(btn);
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const kbdGrp = new THREE.Group();
  kbdGrp.position.set(0.05, 0.895, 0.48);
  scene.add(kbdGrp);
  const kbdBase = new THREE.Mesh(box(0.62, 0.025, 0.22), ivory);
  kbdBase.castShadow = true;
  kbdGrp.add(kbdBase);
  for (const z of [-0.08, -0.025, 0.03, 0.082]) {
    const row = new THREE.Mesh(box(0.56, 0.005, 0.038), charcoal);
    row.position.set(0, 0.015, z);
    kbdGrp.add(row);
  }
  const spacebar = new THREE.Mesh(box(0.22, 0.005, 0.036), charcoal);
  spacebar.position.set(0.02, 0.015, 0.082);
  kbdGrp.add(spacebar);

  // ── Mouse + pad ───────────────────────────────────────────────────────────
  add(box(0.09, 0.035, 0.14), mat("#c0b8a8", 0.8, 0), 0.72, 0.895, 0.48);
  add(box(0.28, 0.003, 0.32), charcoal, 0.72, 0.878, 0.48);

  // ── Coffee mug ────────────────────────────────────────────────────────────
  const mugMat = mat("#e8d5b0", 0.8, 0);
  add(cyl(0.065, 0.055, 0.13, 12), mugMat, -0.88, 0.958, -0.05);
  const torusGeo = new THREE.TorusGeometry(0.038, 0.012, 6, 12, Math.PI);
  const handle = new THREE.Mesh(torusGeo, mugMat);
  handle.position.set(-0.798, 0.958, -0.05);
  handle.rotation.set(0, 0, Math.PI / 2);
  scene.add(handle);
  add(cyl(0.058, 0.058, 0.005, 12), mat("#0a0704", 0.9, 0), -0.88, 1.02, -0.05);

  // ── Books ─────────────────────────────────────────────────────────────────
  const bookColors = ["#8b1a1a", "#1a4a8b", "#1a6a2a"];
  const bookH = [0.03, 0.025, 0.02];
  let by = 0;
  for (let i = 0; i < 3; i++) {
    add(
      box(0.22 - i * 0.01, bookH[i], 0.16),
      mat(bookColors[i], 0.9, 0),
      -0.88,
      0.895 + by + bookH[i] / 2,
      0.25,
    );
    by += bookH[i];
  }

  // ── Plant ─────────────────────────────────────────────────────────────────
  const potMat = mat("#8b4513", 0.8, 0);
  const plantMat = mat("#1a3a1a", 1, 0);
  add(cyl(0.06, 0.05, 0.1, 10), potMat, 1.05, 0.945, -0.12);
  add(cyl(0.055, 0.055, 0.008, 10), charcoal, 1.05, 0.998, -0.12);
  add(cyl(0.01, 0.01, 0.09, 6), plantMat, 1.05, 1.08, -0.12);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    add(
      box(0.12, 0.005, 0.055),
      plantMat,
      1.05 + Math.sin(angle) * 0.075,
      1.14 + (i % 2) * 0.02,
      -0.12 + Math.cos(angle) * 0.075,
      Math.sin(i) * 0.4 - 0.3,
      angle,
      Math.cos(i) * 0.3,
    );
  }

  // ── Desk lamp ─────────────────────────────────────────────────────────────
  add(cyl(0.08, 0.1, 0.025, 10), charcoal, 1.1, 0.873, -0.1);
  add(box(0.02, 0.38, 0.02), charcoal, 1.1, 1.065, -0.09, 0.25, 0, 0);
  add(box(0.02, 0.32, 0.02), charcoal, 1.12, 1.36, -0.2, -0.6, 0, 0);
  add(
    new THREE.ConeGeometry(0.09, 0.14, 10, 1, true),
    charcoal,
    1.08,
    1.52,
    -0.38,
    0.9,
    0,
    0,
  );

  // ── Chair ─────────────────────────────────────────────────────────────────
  const chairFabric = mat("#2a2030", 1, 0);
  const chairFrame = mat("#1c1c1c", 0.8, 0.05);
  const metal = mat("#555555", 0.3, 0.8);
  const cx = 0.1,
    cz = 1.8;
  add(box(0.58, 0.07, 0.55), chairFabric, cx, 0.58, cz);
  add(box(0.62, 0.04, 0.58), chairFrame, cx, 0.545, cz);
  add(box(0.56, 0.55, 0.07), chairFabric, cx, 1.06, cz - 0.27, -0.12, 0, 0);
  add(box(0.6, 0.58, 0.04), chairFrame, cx, 1.06, cz - 0.31, -0.12, 0, 0);
  add(box(0.05, 0.06, 0.45), chairFrame, cx - 0.29, 0.8, cz - 0.05);
  add(box(0.05, 0.06, 0.45), chairFrame, cx + 0.29, 0.8, cz - 0.05);
  add(cyl(0.045, 0.065, 0.5, 8), metal, cx, 0.25, cz);
  add(cyl(0.06, 0.06, 0.06, 8), metal, cx, 0.03, cz);
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2;
    add(
      box(0.28, 0.03, 0.04),
      metal,
      cx + Math.sin(ang) * 0.28,
      0.025,
      cz + Math.cos(ang) * 0.28,
      0,
      ang,
      0,
    );
  }

  // ── Posters on the back wall ───────────────────────────────────────────────
  // The back wall is at z = -4 (face at z ≈ -3.93). Posters sit just in front.
  // Slight random tilts for the casually-pinned feel.
  const WALL_Z = -3.88;

  // Poster 1: Isekai — left side of wall, slightly tilted right
  addPoster(
    scene,
    makePoster_Isekai(),
    -2.1,
    2.8,
    WALL_Z, // x, y, z
    0, // ry
    0.035, // tiltZ (slight clockwise)
    0, // tiltX
  );

  // Poster 2: Shonen action — center-left, slight counter-clockwise tilt
  addPoster(scene, makePoster_Shonen(), -0.55, 2.65, WALL_Z, 0, -0.045, 0);

  // Poster 3: Fantasy dragon — center-right, gentle clockwise lean
  addPoster(scene, makePoster_Fantasy(), 1.0, 2.75, WALL_Z, 0, 0.02, 0);

  // Poster 4: Tournament arc — right side, noticeably tilted
  addPoster(scene, makePoster_Tournament(), 2.4, 2.6, WALL_Z, 0, -0.065, 0);

  return { scene, screenGlow, updateScreen };
}

// ─── Camera rig ────────────────────────────────────────────────────────────────
const IDLE = {
  lookAt: new THREE.Vector3(0, 1.0, 0),
  azimuth: 0.63,
  elevation: 0.34,
  radius: 6.84,
};

const ZOOM_END = {
  lookAt: new THREE.Vector3(0.1, 1.55, -0.07),
  azimuth: 0.0,
  elevation: 0.012,
  radius: 1.92,
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
 