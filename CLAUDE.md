# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run preview    # Preview production build
npm run typecheck  # TypeScript type checking (no emit)
```

No test runner is configured.

## Architecture

### Application State Flow

`App.tsx` drives a linear state machine:
```
"landing" → "boot" → "desktop"
```
- **landing**: `LandingScene.tsx` — Three.js 3D scene with a CRT monitor rendering a scrolling BIOS POST sequence via canvas text
- **boot**: `BootScreen.tsx` — Animated typing boot sequence
- **desktop**: `Desktop.tsx` — Window manager with draggable OS windows

### Desktop / Window System

`Desktop.tsx` is the core of the app. It maintains an array of open windows with position, z-index, and minimized state. It handles:
- Start menu and programs menu
- Context menus
- Shutdown dialog
- Sound playback on interactions

`OsWindow.tsx` is the reusable draggable/resizable window shell. Content windows (`AboutWindow`, `ExperienceWindow`, `ProjectsWindow`, `ContactWindow`, `ShowcaseWindow`) render inside it.

### Sound System

`sounds.ts` synthesizes all audio procedurally via the Web Audio API — there are no audio files. Call `unlockAudio()` after the first user gesture before playing any sound.

### Styling

Tailwind CSS 4 is configured via the Vite plugin (no `tailwind.config.*` file). Custom retro styles (scanlines, BIOS, window chrome) live in `src/index.css`. The Windows 95 widget styling comes from the `95css` library loaded from CDN in `index.css`. Border radii are globally set to `0px` to maintain the boxy retro aesthetic.

### Path Aliases

`@` resolves to `src/` — use `@/components/...`, `@/lib/utils`, etc.

### shadcn/ui

~57 pre-generated UI primitives are in `src/components/ui/`. The project uses the `new-york` style with `neutral` base color and CSS variables. Add new components with `npx shadcn@latest add <component>`.
