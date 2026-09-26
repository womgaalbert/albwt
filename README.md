# Albert Womga — Portfolio

Data Scientist & AI/ML Specialist portfolio website.

**Live at [albwt.com](https://albwt.com)**

## About

A React + Vite portfolio showcasing data science projects, blog posts, an AI sandbox, and contact information. Bilingual (English/French) with light/dark themes.

## Tech Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS
- **UI:** shadcn/ui, Framer Motion
- **Theming:** next-themes (light/dark toggle)
- **i18n:** Custom FR/EN context (`src/lib/LanguageContext.jsx`)
- **Routing:** React Router v6
- **Backend:** Supabase (blog posts, project comments, contact messages)
- **Icons:** Lucide React

## Features

- Bilingual FR/EN with persisted language preference
- Light/dark theme toggle (dark navy by default)
- Project showcase with per-project comments
- Blog backed by Supabase with search + category filters
- AI sandbox playground (mock demos)
- Contact form with rate limiting, input sanitization, and mailto fallback
- Responsive design

## Development

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Environment

Create `.env.local` with your Supabase credentials:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Supabase Migrations

Run the SQL files in `supabase/migrations/` in order (schema, seed, blog cover update) via the Supabase dashboard SQL editor.

## Project Structure

```
src/
  components/     # portfolio, sandbox, projects + minimal ui components
  pages/          # Page components (Home, About, Services, etc.)
  lib/            # Utilities, contexts, sanitization
  utils/          # URL helpers
public/images/    # Generated brand covers (projects + blog)
supabase/         # SQL migrations
```

## Deployment

Static site — build with `npm run build` and serve `dist/` from any static host.

## Contact

Email: **contact@albwt.com**
GitHub: [womgaalbert](https://github.com/womgaalbert)
LinkedIn: [albert-womga](https://linkedin.com/in/albert-womga-009a7931/)  
X: [@albtchap](https://x.com/albtchap)
