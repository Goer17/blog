# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run deploy` — build and deploy to GitHub Pages via gh-pages
- `npm run new -- <post-name>` — scaffold a new post in `public/posts_/`
- `npm run update` — regenerate `public/posts.json` from post frontmatter

## Git

Use `GIT_SSH_COMMAND="ssh -v" git push` to enable verbose SSH output when pushing.

## Architecture

Vue 3 + TypeScript SPA using Vite, with hash-based routing (`createWebHashHistory`). Deployed to GitHub Pages.

### Content pipeline

Posts are markdown files in `public/posts_/` with YAML frontmatter (`title`, `time`, `category`, `image`, optional `z-index` for pinning). The `scripts/update.js` script parses all post frontmatter and writes `public/posts.json`, which the frontend fetches at runtime. Categories are hierarchical arrays (e.g. `["CS", "Algorithms"]`). After adding or editing posts, run `npm run update` to regenerate the index.

### Routing

Four routes defined in `src/router/index.ts`: `/` (Home), `/about`, `/categories`, `/post?name=<filename>`. Posts are loaded by fetching `/posts_/<name>.md` and rendering client-side with markdown-it (with plugins for syntax highlighting, MathJax, and task lists). The frontmatter block is stripped before rendering.

### Key components

- `Navigator.vue` — top nav bar with route links
- `PostLink.vue` — post card used on the home page (image + title + meta)
- `Home.vue` — paginated post list (4 per page, page state in query param)
- `Categories.vue` — expandable tree view built from the `category` arrays
- `Post.vue` — markdown renderer, loads post via `?name=` query param
