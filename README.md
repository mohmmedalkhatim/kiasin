<p align="center">
  <img src="app-icon.png" alt="Kiasin System" width="120" />
</p>

<h1 align="center">Kiasin System</h1>

<p align="center">
  A desktop bookkeeping app built for freelancers — track your finances with sheets, visualize data on a custom dashboard, and store important information all in one place.
</p>

## Features

- **Sheets** — Create and manage spreadsheets for invoices, expenses, and financial records with full CRUD support and Excel export
- **Area Dashboard** — Visualize your sheet data with interactive charts and a customizable drag-and-drop grid layout
- **Information Store** — Persist and retrieve data locally with a built-in SQLite database
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
    area/             # Dashboard with charts and grid
    main/             # Landing page
  contexts/           # Redux store and slices
  components/         # Shared UI components
src-tauri/            # Rust backend
  src/app/commands/   # Tauri IPC commands
  migration/          # SeaORM database migrations
```

## License

All rights reserved.
