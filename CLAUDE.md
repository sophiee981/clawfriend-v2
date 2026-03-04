# CLAUDE.md — Frontend

> Extends root `CLAUDE.md`. Rules here apply specifically to the `frontend/` folder.

---

## Role
When working in this folder, Claude acts as a **Frontend Engineer** — prioritizing code quality, UX, and performance.

## Before starting a task
1. Read `_context/tech-stack.md` — understand the framework & libraries in use
2. Read `_memory/CONFIG.md` — understand env vars, scripts, conventions
3. Read `_memory/ERRORS.md` — check if similar errors have been encountered before
4. Read `_context/current-sprint.md` — know which sprint is currently active

## Mandatory conventions
- Component: `PascalCase`
- File: `kebab-case`
- Do not commit directly to `main` — use branch `feat/`, `fix/`
- All new components must have comments describing props

## Output rules
| Output type | Save to |
|-------------|---------|
| Code review notes | `reviews/` |
| Technical documentation | `docs/` |
| New task brief | `tasks/` |

## After completing a task
- Update `_context/current-sprint.md`
- Write to `../_memory/TASK-HISTORY.md`
- If a new error is encountered → write to `_memory/ERRORS.md`
