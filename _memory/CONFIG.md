# Config — Frontend

> Dynamic config. Claude updates when there are changes to the environment or conventions.

## Environment Variables
> Do not store actual values — only names and purposes

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Base URL of the Backend API |

## Scripts
```bash
npm run dev       # Dev server
npm run build     # Production build
npm run test      # Run tests
```

## Conventions
- Component: `PascalCase`
- File: `kebab-case`
- Branch: `feat/`, `fix/`, `chore/`
- Commit: `[fe] type: description`

## Changelog
| Date | Change | Reason |
|------|--------|--------|
| 2026-03-03 | Initialization | Initial setup |
