# taahirah.exe

> A portfolio that boots like a computer.

**[Live Demo → taahirah-exe.vercel.app](https://taahirah-exe.vercel.app)**

---

## What is this

Instead of building another scroll-down portfolio with a hero section and a gradient, I built mine as a Windows 95 machine. You click anywhere to boot it, watch a BIOS POST sequence, see the Windows splash screen, and land on a fully interactive desktop with draggable windows, a taskbar, a start menu, and a right-click context menu.

Everything is synthesised in-browser — no audio files, no video assets. The 3D landing scene is built in Three.js. The sounds are Web Audio API. The whole thing is one Vite + React app.

---

## Features

**Landing scene**

- 3D isometric bedroom desk scene built entirely in Three.js — eggshell white walls, anime and fantasy posters pinned to the wall, a bookshelf with your actual books (48 Laws, Naruto, Bleach, HxH, Demon Slayer, Art of War, Thinking Fast & Slow), Itachi and Sukuna Funko Pops, sticky notes on the monitor, open notebook, cork board, whiteboard, wall clock, floor lamp, and a trash can
- Scrolling BIOS text on the monitor screen
- Mouse parallax and idle camera oscillation
- Click anywhere to zoom into the monitor and transition to boot

**Boot sequence**

- BIOS POST screen with synthesised PC speaker beep
- Windows 95 splash with animated flag and progress bar
- Startup jingle (Web Audio — no files)

**Desktop**

- Draggable, minimisable, maximisable Win95 windows
- Taskbar with running window buttons and live clock
- Start menu with Programs submenu
- Right-click context menu
- Window state persisted to localStorage across sessions
- Custom Win95 arrow cursor via inline SVG data URIs

**Windows**
| Window | What it does |
|---|---|
| My Computer | Explorer-style file tree — projects, blog, resume |
| About Me | Bio, quick facts, skills grid |
| Experience.log | Work history and education |
| Projects.dir | File list of projects — double-click any row to open a detail window with tech stack and links |
| Contact.txt | Contact form (mailto), social links, resume download |
| Blog.txt | Split-pane blog reader with search |
| Wolf3D.exe | Playable Wolfenstein 3D (shareware Episode 1) in an iframe |
| Netflix 95 | Full Netflix UI — hero banner, horizontal show rows, now playing screen with synthesised ta-dum — Childhood, Anime, and Adult Dramas watchlists |

---

## Tech stack

| Layer      | Tech                                                |
| ---------- | --------------------------------------------------- |
| Framework  | React 18 + TypeScript                               |
| Build      | Vite                                                |
| 3D scene   | Three.js                                            |
| Styling    | 95css (Win95 component library) + custom CSS        |
| Audio      | Web Audio API — fully synthesised, zero audio files |
| Deployment | Vercel                                              |

---

## Project structure

```
src/
├── components/
│   ├── LandingScene.tsx       # Three.js 3D scene + camera rig
│   ├── BootScreen.tsx         # BIOS POST sequence
│   ├── WindowsSplash.tsx      # Win95 splash screen
│   ├── Desktop.tsx            # Window manager, taskbar, start menu
│   ├── OsWindow.tsx           # Draggable/resizable window chrome
│   ├── ShowcaseWindow.tsx     # My Computer explorer
│   ├── AboutWindow.tsx        # About me
│   ├── ExperienceWindow.tsx   # Work history
│   ├── ProjectsWindow.tsx     # Projects file list
│   ├── ProjectDetailWindow.tsx# Per-project detail panel
│   ├── ContactWindow.tsx      # Contact form + links
│   ├── Blog.tsx               # Blog reader
│   ├── WolfensteinWindow.tsx  # Wolf3D iframe wrapper
│   ├── NetflixWindow.tsx      # Netflix 95 UI
│   ├── Clock.tsx              # Live taskbar clock
│   └── Win95Icons.tsx         # SVG icon components
├── sounds.ts                  # All audio — Web Audio synthesis engine
├── resume.ts                  # Resume PDF path helper
├── App.tsx                    # App state machine (landing → bios → splash → desktop)
└── index.css                  # 95css + all custom Win95 styles
```

---

## Running locally

```bash
git clone https://github.com/Engineernoob/taahirah.exe
cd taahirah.exe
npm install
npm run dev
```

Requires Node 18+. The Wolf3D game requires the browser build files at `public/wolf3d-browser/` — these are not included in the repo.

---

## Design decisions

**Why Three.js for the landing instead of CSS/canvas?**
The isometric desk scene needed real lighting, shadows, and a smooth camera zoom into the monitor. Three.js gave that in a way that would have been painful to fake with 2D.

**Why synthesise all audio instead of using files?**
Zero network requests, zero CORS issues, instant playback. The BIOS beep, window sounds, startup jingle, and Netflix ta-dum are all procedurally generated with the Web Audio API at runtime.

**Why Win95?**
Because every other portfolio looks the same. The constraint of working inside a retro OS forces every piece of content to have a reason to exist. The windows, the boot sequence, the file explorer metaphor — it all creates a consistent world instead of a scrolling brochure.

---

## License

Personal portfolio — not intended as a template. Feel free to draw inspiration but please don't copy it wholesale.

---

_Built by [Taahirah Denmark](https://taahirah-exe.vercel.app) · 2026_
