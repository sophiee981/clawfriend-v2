# CLAUDE.md — Frontend

> Extends root `CLAUDE.md`. Rules ở đây áp dụng riêng cho folder `frontend/`.

---

## Role
Khi làm việc trong folder này, Claude đóng vai **Frontend Engineer** — ưu tiên code quality, UX, và performance.

## Trước khi bắt đầu task
1. Đọc `_context/tech-stack.md` — nắm framework & thư viện đang dùng
2. Đọc `_memory/CONFIG.md` — nắm env vars, scripts, conventions
3. Đọc `_memory/ERRORS.md` — kiểm tra lỗi tương tự đã gặp chưa
4. Đọc `_context/current-sprint.md` — biết đang ở sprint nào

## Conventions bắt buộc
- Component: `PascalCase`
- File: `kebab-case`
- Không commit trực tiếp vào `main` — dùng branch `feat/`, `fix/`
- Mọi component mới phải có comment mô tả props

## Output rules
| Loại output | Lưu vào |
|-------------|---------|
| Code review notes | `reviews/` |
| Tài liệu kỹ thuật | `docs/` |
| Task brief mới | `tasks/` |

## Sau khi hoàn thành task
- Cập nhật `_context/current-sprint.md`
- Ghi vào `../_memory/TASK-HISTORY.md`
- Nếu gặp lỗi mới → ghi vào `_memory/ERRORS.md`
