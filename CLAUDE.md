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

`App.tsx` drives a state machine with 7 states:
```
"landing" → "bios" → "splash" → "desktop" → "shutdown"
```
- **landing**: `LandingScene.tsx` — Three.js 3D scene with a CRT monitor rendering a scrolling BIOS POST sequence via canvas text
- **bios**: `BootScreen.tsx` — Animated typing boot sequence
- **splash**: `WindowsSplash.tsx` — Windows 95 logo splash
- **desktop**: `Desktop.tsx` — Window manager with draggable OS windows
- **dos**: Easter egg terminal mode
- All major components are `React.lazy()` loaded with `Suspense`

### Desktop / Window System

`Desktop.tsx` is the core of the app (~473 lines). It owns all window state and persists it to localStorage under key `portfolio.desktop.state.v3`. It handles:
- Window stacking (z-index), drag positioning, minimize/maximize
- Start menu, programs menu, context menus, shutdown dialog
- Sound playback on interactions

`OsWindow.tsx` is the reusable draggable/resizable window shell. All content windows render inside it.

**Window IDs** are a union type — only these values are valid:
```typescript
type WindowId = "showcase" | "about" | "experience" | "projects" | "project-detail"
              | "contact" | "wolfenstein" | "netflix" | "msn" | "notepad"
              | "settings" | "run" | "internet-explorer"
```

**Window state shape:**
```typescript
interface WindowState { id: WindowId; zIndex: number; x: number; y: number; minimized: boolean }
```

Smart initial positioning is handled by `getSmartInitialPosition()` — it centers windows or applies base position + jitter, clamped to viewport bounds.

### Sound System

`src/sounds.ts` synthesizes all audio procedurally via the Web Audio API — there are no audio files. Call `unlockAudio()` after the first user gesture before playing any sound. Uses oscillator + gain nodes with envelope shaping and shimmer voices.

### Styling

Tailwind CSS 4 is configured via the Vite plugin (no `tailwind.config.*` file). Custom retro styles (scanlines, BIOS, window chrome) live in `src/index.css`. The Windows 95 widget styling comes from the `95css` library loaded from CDN in `index.css`. Border radii are globally set to `0px` to maintain the boxy retro aesthetic. Custom cursors (default, pointer, move) are SVG data URIs embedded in CSS.

### Path Aliases

`@` resolves to `src/` — use `@/components/...`, `@/lib/utils`, etc.

### shadcn/ui

~57 pre-generated UI primitives are in `src/components/ui/`. The project uses the `new-york` style with `neutral` base color and CSS variables. Add new components with `npx shadcn@latest add <component>`.

### Code Splitting

`vite.config.ts` defines manual chunks: `react-vendor` (React/DOM) and `three-vendor` (Three.js). Content windows are lazy-loaded — keep them that way when adding new windows.
