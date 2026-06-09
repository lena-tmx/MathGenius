# MathGenius

MathGenius is a web application prototype for helping children learn mathematics through three core learning flows:

- a school math topic library with theory and practice;
- personalized study plans with saved progress;
- a dedicated Gymi Kurz/Lang preparation area with diagnostics and mock exams.

## Architecture Direction

The project is moving toward a **Next.js full-stack web application**.

The intended architecture is:

- `app/` - Next.js dynamic pages and route handlers;
- `components/` - reusable UI components;
- `lib/` - frontend/client utilities, API client, validation helpers, learning helpers;
- `types/` - shared API-facing types;
- `src/` - backend domain logic, stores, database providers, security helpers, seed content;
- `backend/` - database schema and seed files;
- `docs/` - implementation notes and PR roadmaps.

The previous Express backend remains as a transition layer while the application is migrated to Next.js route handlers.

## Current Status

Implemented:

- topic catalog data model;
- Gymi tracks and mock exam data model;
- authentication backend endpoints;
- study plan backend endpoints;
- progress tracking backend endpoints;
- activity tracing backend endpoints;
- PostgreSQL, MongoDB, and in-memory store support;
- TypeScript domain models and typed store contracts;
- API client layer;
- dynamic Kurz/Lang topic pages;
- dashboard route with progress summary and recommendations;
- dashboard loading and error states;
- mock exam session skeleton.

In progress:

- authenticated dashboard wired to real learner sessions;
- backend-backed progress state replacing demo/local state;
- protected SSR-compatible cookie auth;
- server-side validation and form validation;
- mock exam timer/session persistence;
- parent/teacher/admin roles and RBAC.

## Project Structure

```text
app/
  Dynamic Next.js pages and future route handlers

components/
  Reusable React components

lib/
  API client, auth helpers, validation helpers, learning helpers

types/
  Shared API request/response types

src/
  Backend domain code:
  - config
  - content
  - db providers
  - security
  - store implementations
  - domain types

backend/
  PostgreSQL schema and seed files

docs/
  Implementation notes and PR roadmaps
```

## Development

```bash
npm install
npm run check
npm run build
npm run dev
```

## Recommended next steps

1. Replace dashboard demo progress with `GET /api/me/progress` data.
2. Add cookie-based login/register flows for SSR-compatible protected routes.
3. Convert the mock session skeleton into a client timer with answer autosave.
4. Add role model and RBAC for parent, teacher, and admin dashboards.
