# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tauri desktop application with React frontend and Rust backend. The app manages "sheets" and "areas" with drag-and-drop functionality, stored in a local SQLite database.

**Tech Stack:**
- Frontend: React 19, TypeScript, Vite, TailwindCSS 4, Redux Toolkit, React Router
- Backend: Tauri 2, Rust, SeaORM 2.0-rc with SQLite
- UI Libraries: @dnd-kit (drag-and-drop), GSAP + Motion + Lenis (animations), Tabler Icons
- Tauri Plugins: tauri-plugin-fs, tauri-plugin-sql, tauri-plugin-store, tauri-plugin-opener

**Window Configuration:**
- Custom window decorations (`decorations: false` in tauri.conf.json)
- Custom title bar implemented via `WindowControls` component
- Default size: 800x600

## Development Commands

```bash
# Frontend development
npm run dev              # Start Vite dev server (port 1420)
npm run build            # Build frontend (TypeScript + Vite)
npm run preview          # Preview production build

# Tauri/Desktop app
npm run tauri dev        # Run Tauri in development mode (compiles Rust + runs app)
npm run tauri build      # Build production desktop app
npm run tauri [command]  # Run other Tauri CLI commands

# Rust backend (from src-tauri/)
cargo build              # Build Rust backend
cargo test               # Run Rust tests
cargo run                # Run Rust binary directly (not typical for Tauri)
```

**Development workflow:** Use `npm run tauri dev` to run the full app with hot-reload. Frontend changes hot-reload via Vite; Rust changes require recompilation.

## Architecture

### Frontend Structure (`src/`)

```
src/
├── pages/           # Route pages (main, area, sheets)
├── components/      # Shared UI components (Button, Dialog, Input, etc.)
├── contexts/        # Redux slices and business logic
│   ├── store.ts     # Redux store configuration
│   ├── area/        # Area slice + CRUD functions
│   └── sheets/      # Sheets slice + CRUD functions
├── Router/          # React Router configuration
└── util/            # Shared utilities
```

**State Management:** Redux Toolkit with two main slices:
- `area` slice - manages areas state (includes nested Card structure)
- `database` slice - manages sheets state

Both slices have corresponding Tauri command handlers in the Rust backend.

**Redux Async Pattern:**
Each CRUD operation follows this structure:
1. `createAsyncThunk` defines the async operation (invokes Tauri command)
2. Thunk builder function (`create_thunk_builder`, etc.) handles pending/fulfilled/rejected states
3. Thunk builders registered in slice's `extraReducers`

Example: `src/contexts/area/functions/create.ts` exports both `create_area_async_function` (thunk) and `create_thunk_builder` (state handler).

**Data Model:**
- **Area:** Contains `id`, `name`, `description`, and `structure` (with nested `cards` array and `dense` flag)
- **Card:** Contains `id`, `type` ('areas' | 'value' | 'form'), `store` (with optional `list`), and `size` (columns/rows for grid layout)
- **Sheet:** Database entity managed separately (see sheets slice)

### Backend Structure (`src-tauri/`)

```
src-tauri/
├── src/
│   ├── lib.rs       # App entry point, DB setup, migration runner
│   └── app/
│       ├── commands/    # Tauri command handlers (windows, areas, sheets, notes)
│       ├── structures/  # Shared data structures (DbConnection, etc.)
│       └── util/        # Backend utilities
└── migration/       # Separate workspace for SeaORM entities and migrations
    └── src/
        ├── schema/          # SeaORM entities (area, sheet)
        └── migration_2026/  # Database migrations
```

### Tauri Command Pattern

All Tauri commands follow this pattern:

1. **Frontend** calls command via `invoke()`:
```typescript
import { invoke, Channel } from '@tauri-apps/api/core';

const channel = new Channel<Model[]>();
await invoke('sheets_control', { 
  payload: { command: 'list' },
  channel
});
```

2. **Backend** command handler (`src-tauri/src/app/commands/`):
   - Main handler function (e.g., `sheets_control`, `areas_control`) registered in `lib.rs` via `tauri::generate_handler![]`
   - Accepts `Payload` with: `command` (string), optional `id`, optional `data`
   - Commands: `create`, `retrieve`, `update`, `delete`, `list`
   - Pattern matches on `payload.command` string to route to appropriate function
   - Returns results via IPC `Channel<T>`
   - Example: `sheets_control` routes to `functions::create_sheet()`, `functions::retrieve_sheet()`, etc.

3. **Database access** via `Arc<Mutex<DbConnection>>` shared state injected via Tauri's `State<>` parameter

### Database (SeaORM + SQLite)

- **Location:** `AppData/Database/test.db` (created on first run via `BaseDirectory::AppData`)
- **Temp DB:** `AppData/temp/index.db` (created on startup)
- **Entities:** Defined in `src-tauri/migration/src/schema/` (area, sheet)
- **Migrations:** Auto-run on app startup via `Migrator::up()` in async spawn
- **ORM:** SeaORM 2.0-rc with async runtime (Tokio)
- **Initialization:** Database connection established in `lib.rs` setup hook, stored in Arc<Mutex<DbConnection>>, accessible to all commands via Tauri's state management

**Adding new entities/migrations:**
1. Create entity in `migration/src/schema/`
2. Add migration in `migration/src/migration_2026/`
3. Register in `migration/src/lib.rs` Migrator
4. Create command handler in `src-tauri/src/app/commands/`
5. Register command in `lib.rs` invoke_handler

### Routing

Routes defined in `src/Router/index.tsx`:
- `/` - MainPage
- `/databases` - Sheets list/editor
- `/area/:id` - Individual area view

All routes wrapped in `<App />` layout component.

## Key Patterns

**Frontend-Backend Communication:**
- Use Tauri IPC `invoke()` with channels for async results
- Payload-based command pattern (command string + data/id)
- Redux slices dispatch to Tauri commands, update on channel response

**Drag and Drop:**
- Uses @dnd-kit library
- Implemented in area pages for sortable cards/items

**Animations:**
- GSAP for complex animations
- Motion (Framer Motion) for React component animations
- Lenis for smooth scrolling

## Design System

Custom Tailwind theme defined in `src/index.css` using Tailwind v4 `@theme` directive.

**Color Palette:**
- `primary-*` - Blue brand colors (primary actions, links)
- `dark-*` - Background/surface colors (main bg: `dark-900`)
- `support-*` - Gray/neutral (text, secondary UI)
- `danger-*` - Red (destructive actions, errors)
- `success-*` - Green (success states)
- `warning-*` - Orange (warnings)
- `info-*` - Cyan (informational)
- `border-main/subtle/strong` - Border colors

**Component Variants:**
- Button: `primary` (blue), `secondary` (gray), `danger` (red)
- Sizes: `sm`, `md`, `lg`

See `THEME.md` for complete color reference and usage guidelines.

## Workspace Structure

The project uses a Cargo workspace:
- Main app: `src-tauri/` (binary + library)
- Migration: `src-tauri/migration/` (library)

Both share SeaORM entities from the migration workspace. Main app depends on migration via `path = "migration"`.

## Development Notes

**Debugging:**
- Frontend: Chrome DevTools available in development mode
- Backend: Rust logs appear in terminal running `npm run tauri dev`
- Redux DevTools extension supported via `@redux-devtools/extension`

**Command Structure:**
All Tauri commands in `src-tauri/src/app/commands/` follow the same pattern:
- `mod.rs` - exports public command function
- `objects.rs` - defines Payload and request/response types
- `functions/` - directory with CRUD operation implementations (create.rs, retrieve.rs, update.rs, delete.rs, list.rs)

**Testing:**
No test suite currently configured. When adding tests:
- Frontend: Consider Vitest (already Vite-based)
- Backend: Use `cargo test` with standard Rust testing

**Known Patterns:**
- All text defaults to `support-100` color via global CSS rule
- App container has custom sizing: `md:pl-19 top-10 w-[calc(100%)] min-h-[calc(100%-2.5rem)]`
- Navbar fixed at left, hidden on mobile (`-left-24 md:left-0`)
- Grid layout uses @dnd-kit's SortableContext for drag-and-drop cards
