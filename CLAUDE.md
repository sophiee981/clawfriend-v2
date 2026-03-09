# CLAUDE.md — ClawFriend Frontend

> Rules apply to the `claw-whales-frontend/` folder. Claude acts as a **Frontend Engineer** — ưu tiên code quality, UX, và performance.

---

## Tech Stack (quick ref)
- **Framework:** Next.js (App Router, Turbopack dev)
- **Styling:** Tailwind CSS JIT + CSS Variables (design tokens)
- **UI primitives:** Radix UI (Dialog/Modal, Dropdown, etc.)
- **Fonts:** `next/font/google` — Geist (default), Space Mono, JetBrains Mono
- **State:** React Query (server state), React hooks (local)
- **Package manager:** `pnpm`
- **Branch convention:** `feat/`, `fix/`, `sophie-uiux`, etc. — không commit thẳng vào `main`

---

## ⚙️ Dev Workflow — 6 bước BẮT BUỘC

### Bước 1 — Brainstorm
- Phân tích yêu cầu, xác định scope
- Liệt kê các approach có thể (ít nhất 2 phương án nếu task không trivial)
- Đọc context nếu cần: `_context/tech-stack.md`, `_context/current-sprint.md`, `_memory/ERRORS.md`

### Bước 2 — Impact Analysis ⚠️
Trước khi code, kiểm tra mức độ ảnh hưởng:

| Thay đổi | Cần kiểm tra |
|----------|--------------|
| Base UI component (`src/components/ui/`) | Grep tìm tất cả usages, báo số file bị ảnh hưởng |
| `tailwind.config.js` (fontSize, fontFamily, colors) | Ảnh hưởng toàn bộ UI — hỏi confirm |
| `src/app/layout.tsx` | Ảnh hưởng tất cả pages |
| `src/styles/globals.scss` | Global — confirm trước |
| Design token / CSS variable | Trace tất cả nơi dùng token đó |
| Shared hook / util | Grep usages trước |

**Rules:**
- Nếu thay đổi base/shared component → grep tìm hết usages, báo số lượng files trước khi làm
- Nếu không chắc scope → **HỎI USER trước**, không tự đoán
- Nếu chỉ thay đổi 1 component cụ thể → có thể proceed thẳng

### Bước 3 — Plan cụ thể
Liệt kê chính xác:
- Files cần thay đổi
- Từng thay đổi cụ thể trong mỗi file
- Lý do chọn approach này

### Bước 4 — Thực hiện
- Chỉ code **sau khi user approve plan** (với task phức tạp hoặc ảnh hưởng shared code)
- Với task nhỏ, rõ ràng → có thể làm luôn
- Dùng `Edit` thay vì `Write` khi sửa file có sẵn

### Bước 5 — Review & Verify
Sau khi code xong:
1. Kiểm tra preview server đang chạy (`preview_list`)
2. Reload page nếu cần (`preview_eval: window.location.reload()`)
3. Kiểm tra console/server logs (`preview_console_logs`, `preview_logs`)
4. Verify DOM/CSS bằng `preview_inspect` hoặc `preview_eval`
5. Screenshot bằng `preview_screenshot` để confirm visual
6. Check related pages không bị regression

### Bước 6 — Session Log
Cuối session hoặc sau task lớn:
- Dùng skill `/session-log` để tự động hóa
- Hoặc thủ công: cập nhật `docs/WORKFLOW-LOG.md` và `docs/DECISION-LOG.md`
- Ghi lessons learned nếu có lỗi/quirk mới

---

## ⚠️ Known Quirks — ĐỌC TRƯỚC KHI CODE

### Tailwind JIT — Arbitrary values
- **Vấn đề:** Class mới dùng arbitrary values (`ml-[4px]`, `max-w-[576px]`, `underline-offset-2`) có thể KHÔNG được generate trong dev HMR
- **Fix:** Dùng standard Tailwind utilities (`ml-1`, `px-3`) hoặc inline `style={}` prop
- **Ví dụ đã gặp:** `ml-[4px]` → `ml-1` | `maxWidth: '576px'` qua `style` prop

### Turbopack Browser Cache
- **Vấn đề:** Sau khi restart server, browser có thể vẫn serve old JS chunks từ memory cache
- **Không ảnh hưởng:** Production builds, user fresh load
- **Debug:** Dùng `fetch('/_next/static/chunks/...', { cache: 'no-store' })` để verify server content
- **Fix khi bị stuck:** Xóa `.next` (`rm -rf .next`) rồi restart server

### Modal Width
- **Pattern đúng:** `<ModalContent className="w-full" style={{ maxWidth: '576px' }}>` — KHÔNG dùng `max-w-[576px]` (Tailwind JIT issue)

### Preview Server
- Server ID thay đổi mỗi lần start — luôn dùng ID mới nhất từ `preview_list`
- Server dùng `.env.local` — copy content từ `.env.dev` vào `.env.local` nếu cần

### Font System
- Default font: **Geist** (variable: `--font-geist`)
- Monospace: **Space Mono** (`font-spaceMono`) và **JetBrains Mono** (`font-jetBrainsMono`)
- `font-outfit` class trong Tailwind = alias cho Geist (backward compat)

---

## Conventions

### Naming
- Component: `PascalCase`
- File: `kebab-case`
- Hook: `useXxx.ts`

### Component structure
```
src/
  app/           # Next.js App Router pages
  features/      # Feature-based modules (home, profile, feeds...)
  components/
    ui/           # Base UI primitives (button, modal, dropdown...)
    icons/        # SVG icons
  hooks/         # Shared hooks
  services/      # API calls
  utils/         # Utilities
```

### Typography scale (tailwind classes)
| Class | Size | Weight | Line height |
|-------|------|--------|-------------|
| `text-heading-sm` | 20px | 500 | 28px |
| `text-label-xs` | 12px | 500 | 16px |
| `text-body-sm` | 13px | 400 | 20px |
| `text-body-xs` | 12px | 400 | 16px |

### Modal title
- Luôn dùng `text-heading-sm` (20px/500) cho `ModalTitle` — defined in `src/components/ui/modal.tsx`

---

## Output rules
| Output type | Save to |
|-------------|---------|
| Code review notes | `reviews/` |
| Technical documentation | `docs/` |
| New task brief | `tasks/` |
| Workflow/decision log | `docs/WORKFLOW-LOG.md`, `docs/DECISION-LOG.md` |
| Errors gặp phải | `_memory/ERRORS.md` |

## After completing a task
- Update `_context/current-sprint.md`
- Write to `_memory/TASK-HISTORY.md`
- Nếu gặp lỗi mới → ghi vào `_memory/ERRORS.md`
