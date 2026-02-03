# 🎨 Figma-to-Component Generation Task

I have a **list of Figma design links**, and I want you to **generate React components** based on each design.

---

## 🧩 Workflow

1. **Process each Figma link in sequence:**
   - Read the **first link**, generate its component.
   - Then move to the **next link**, generate the next component.
   - Continue until all Figma links are completed.

---

## 🧱 Development Requirements

- **Styling:**
  - Use **color variables** (`background`, `border`, `text`, etc.) defined in `tailwind.config.js`.
  - Use **font size classes** defined in `tailwind.config.js` (e.g., `text-display-lg`, `text-heading-md`, `text-body-sm`, etc.) for typography styling.
- **UI Components:**
  - If the design includes **common UI patterns**, check the `src/components/ui` directory.
  - **Reuse existing components** from `src/components` wherever possible to maintain consistency.
- **Icons:**
  - Check if icons from the Figma design already exist in the `src/components/icons` folder.
  - If icons exist, import and use them from the icons index file (e.g., `import { GoogleIcon, MailIcon } from "@/components/icons";`).
  - If icons don't exist, download SVGs from Figma and add them to the `src/components/icons` folder, then update the `index.tsx` file to export them.
  - If icons can't be downloaded, create placeholder SVG files with appropriate names and update the component to use them.

---

## 🧭 Output

For each Figma link:

- Generate a **separate, reusable React component**.
- Each component must be:
  - **Cleanly structured**
  - **Aligned with the design system** (fonts, colors, spacing)
  - **Responsive** and consistent with the design system
- Follow the existing **project folder conventions** (e.g., `components/[category]/[ComponentName].tsx`).

---

## 🎨 Figma Links

Here are the design references:
