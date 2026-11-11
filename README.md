<p align="center">
  <img src="app-icon.png" alt="Kiasin System" width="120" />
</p>

<h1 align="center">Kiasin System</h1>

<p align="center">
  A desktop data management app built for freelancers — track finances, visualize data on custom dashboards, manage workflows with kanban boards, and build forms, all in one place.
</p>

## Features

- **Sheets** — Create and manage spreadsheets for invoices, expenses, and financial records with full CRUD support and Excel export
- **Dashboard** — Visualize your data with interactive charts, KPIs, progress trackers, and a customizable drag-and-drop grid layout
- **Kanban** — Organize tasks and workflows with drag-and-drop board views
- **Form Builder** — Design custom data entry forms with a visual drag-and-drop field editor
- **Offline-first** — Runs entirely on your machine with no cloud dependency

## Tech Stack

| Layer    | Technology                              |
| -------- | --------------------------------------- |
| Frontend | React 19, TypeScript, Tailwind CSS v4   |
| Backend  | Rust, Tauri v2, SeaORM                  |
| Database | SQLite                                  |
| State    | Redux Toolkit                           |
| Charts   | ApexCharts                              |
| Motion   | GSAP, Motion (Framer Motion)            |
| DnD      | dnd-kit                                 |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/)

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

## Project Structure

```
src/                  # React frontend
  pages/
    sheets/           # Sheet management and editor
    dashboard/        # Dashboard with charts and grid
    kanban/           # Kanban board
    form_builder/     # Form builder
    main/             # Landing page
  contexts/           # Redux store and slices
  components/         # Shared UI components
src-tauri/            # Rust backend
  src/app/commands/   # Tauri IPC commands
  migration/          # SeaORM database migrations
```

## License

All rights reserved.
