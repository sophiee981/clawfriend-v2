# Config — Frontend

> Dynamic config. Claude cập nhật khi có thay đổi về môi trường hoặc conventions.

## Environment Variables
> Không lưu giá trị thật — chỉ tên và mục đích

| Variable | Mục đích |
|----------|----------|
| `VITE_API_URL` | Base URL của Backend API |

## Scripts
```bash
npm run dev       # Dev server
npm run build     # Production build
npm run test      # Chạy test
```

## Conventions
- Component: `PascalCase`
- File: `kebab-case`
- Branch: `feat/`, `fix/`, `chore/`
- Commit: `[fe] type: mô tả`

## Changelog
| Ngày | Thay đổi | Lý do |
|------|----------|-------|
| 2026-03-03 | Khởi tạo | Setup ban đầu |
