# Albert Womga — Portfolio

Data Scientist & AI/ML Specialist portfolio website.

**Live at [albwt.com](https://albwt.com)**

## About

This is a React + Vite portfolio showcasing data science projects, blog posts, an AI sandbox, and contact information.

## Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS
- **UI:** shadcn/ui (Radix UI), Framer Motion
- **Charts:** Recharts
- **Routing:** React Router v6
- **Backend:** Supabase (blog, comments, auth)
- **Payments:** Stripe
- **Icons:** Lucide React

## Features

- Project showcase with interactive demos
- Blog with CMS-backed posts and comments
- AI sandbox playground
- Contact form & newsletter
- Responsive design with dark mode

## Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
src/
  components/     # UI components (shadcn) + portfolio components
  pages/          # Page components (Home, About, Services, etc.)
  data/           # Static data (blog posts, comment store)
  lib/            # Utilities, context, sanitization
  hooks/          # Custom hooks
```

## Deployment

Static site — build with `npm run build` and serve `dist/` from any static host.

## Contact

Email: **contact@albwt.com**
GitHub: [womgaalbert](https://github.com/womgaalbert)
LinkedIn: [albert-womga](https://linkedin.com/in/albert-womga-009a7931/)
