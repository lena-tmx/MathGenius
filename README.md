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
- `lib/` - frontend/client utilities, API client, validation helpers;
- `types/` - shared API-facing types;
- `src/` - backend domain logic, stores, database providers, security helpers, seed content;
- `backend/` - database schema and seed files.

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
- TypeScript domain models and typed store contracts.

In progress:

- dynamic Next.js pages;
- authenticated dashboard;
- backend-backed progress state instead of localStorage;
- protected routes;
- API client layer;
- server-side validation and form validation;
- loading and error states;
- mock exam timer/session flow;
- user-specific recommendations;
- future parent/teacher/admin roles.

## Project Structure

```text
app/
  Dynamic Next.js pages and future route handlers

components/
  Reusable React components

lib/
  API client, auth helpers, validation helpers

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
```
