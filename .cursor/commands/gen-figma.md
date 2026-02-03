# 🎨 Figma-to-Component Task

I have a **Figma design link**, and I want you to **generate a React component** based on that design.

---

## 🧱 Development Requirements

- **Styling:**
  - Use **color variables** (`background`, `border`, `text`, etc.) defined in `tailwind.config.js`.
  - Use **font size classes** defined in `tailwind.config.js` (e.g., `text-display-lg`, `text-heading-md`, `text-body-sm`, etc.) for typography styling.
- **UI Components:**
  - If the design includes **common UI patterns**, check the `src/components/ui` directory.
  - **Reuse existing components** from `src/components/ui` wherever possible to maintain consistency.
- **Icons:**
  - Check if icons from the Figma design already exist in the `src/components/icons` folder.
  - If icons exist, import and use them from the icons index file (e.g., `import { GoogleIcon, MailIcon } from "@/components/icons";`).
  - If icons don't exist, download SVGs from Figma and add them to the `src/components/icons` folder, then update the `index.tsx` file to export them.
  - If icons can't be downloaded, create placeholder SVG files with appropriate names and update the component to use them.

---

## 🧭 Output

- Generate a **single, reusable React component** based on the provided Figma link.
- The component must be:
- **Cleanly structured**
- **Aligned with the design system** (fonts, colors, spacing)
- Follow the existing **project folder conventions** (e.g., `components/[category]/[ComponentName].tsx`).

---

## 🎨 Figma Link

Paste your design link below:
