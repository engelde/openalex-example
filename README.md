# OpenAlex Explorer

A web app for searching, sorting, and filtering scholarly works using the [OpenAlex API](https://openalex.org) — a fully open catalog of the global research system with hundreds of millions of academic works, authors, institutions, and more.

## Features

- **Author Search** — Find academic works by author name via the OpenAlex authors API
- **Date Filtering** — Narrow results by publication year range (start and/or end year)
- **Sortable Data Table** — Browse results in a paginated table powered by [TanStack Table](https://tanstack.com/table)
- **Rich Metadata** — View title, type, language, publication date, citation count, and direct links to works
- **Form Validation** — Input validated with [Zod](https://zod.dev) schemas via [React Hook Form](https://react-hook-form.com)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Data Table | [TanStack Table](https://tanstack.com/table) |
| Validation | [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com) |
| Language | TypeScript |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Build

```bash
pnpm build
pnpm start
```

## How It Works

1. Enter an author name in the search form
2. Optionally set a publication year range to filter results
3. The app queries the [OpenAlex API](https://docs.openalex.org) to find matching authors and their works
4. Results are displayed in a paginated, sortable data table

## What is OpenAlex?

[OpenAlex](https://openalex.org) is a free and open index of the world's research system. It catalogs scholarly works, authors, institutions, sources, topics, publishers, and funders — forming a graph of hundreds of millions of entities. OpenAlex serves as an open alternative to paywalled services like Scopus and Web of Science, with roughly twice the coverage and significantly better representation of non-English works and the Global South.

## License

This project is provided as an example application for learning and reference.
