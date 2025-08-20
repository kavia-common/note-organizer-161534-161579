# Notes Frontend (Nuxt 3)

A modern, light-themed notes application with:
- User authentication (localStorage demo auth)
- Create, edit, delete notes
- List and search notes
- Sidebar layout with main editing area
- Pin/unpin notes

This project uses Nuxt 3 + Pinia.

## Getting Started

Install dependencies:

```bash
npm install
# or yarn install / pnpm install / bun install
```

Run dev server:

```bash
npm run dev
# http://localhost:3000
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Notes

- Auth and data are stored in `localStorage` for demonstration purposes and to avoid backend coupling.
- Replace `utils/api.ts` with real API calls when a backend is available.

## Structure

- `components/` layout, editor, list items, icons
- `pages/` auth pages, index, notes routes
- `stores/` Pinia stores for auth and notes
- `assets/styles.css` theme tokens and global styles
