# Prediction

A [Next.js](https://nextjs.org) project built with React 19 and TypeScript.

## Prerequisites

- Node.js 22+
- pnpm (install globally with `npm install -g pnpm` if you don't have it)

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

3. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

   The page will auto-update as you edit files in the project.

## Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality
- `pnpm generate:icons` - Generate icon components from SVG files

## Cursor Commands

Access commands via Cursor's command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for the command name.

### Examples

- **`gen-figma`** - Generate component from Figma link

  ```
  @gen-figma https://www.figma.com/file/...
  ```

- **`multi-figma`** - Generate multiple components from Figma links

  ```
  @multi-figma https://www.figma.com/file/... https://www.figma.com/file/...
  ```

- **`gen-interface`** - Generate TypeScript interfaces from API response

  ```
  @gen-interface { "id": "123", "name": "Example" }
  ```

- **`api-defining`** - Generate API functions from cURL command examples

  ```
  @api-defining [paste cURL command examples]
  response: []
  ```

  **Note:** At least one valid cURL command is required. The command will generate TypeScript API functions and interfaces based on the provided cURL examples.

- **`responsive`** - Add responsive support to component
  ```
  @responsive [component file path]
  ```
