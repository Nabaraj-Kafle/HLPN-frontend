# Kit Ecom

A React + TypeScript + Vite ecommerce frontend with reusable components and page-based routing.

## Requirements

- Node.js 20+ (LTS recommended)
- npm 10+

## Quick Start

```bash
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - start local development server on all interfaces
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally

## Project Structure

```text
kit-ecom/
  public/                Static assets
  src/
    app/
      components/        Shared UI components
      data/              Local data and constants
      pages/             Route-level page components
      App.tsx            App shell and routing composition
    lib/                 Utilities and service helpers
    styles/              Global and feature styles
    main.tsx             React bootstrap entrypoint
  index.html             HTML template for Vite
  vite.config.ts         Vite configuration
  tsconfig*.json         TypeScript configuration
  eslint.config.js       Lint configuration
```

## Troubleshooting

If `npm run dev` fails with `vite: not found`, your local install may be incomplete. Reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
