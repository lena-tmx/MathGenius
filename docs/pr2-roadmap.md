# PR2 Roadmap: Dynamic Learning Layer

## What this PR adds

- Learner dashboard page with progress summary.
- Backend-ready progress model helper.
- User-specific recommendation helper.
- Loading and error states for the dashboard route.
- Mock exam session skeleton with timer/session UX placeholders.

## Self-review questions

### Should PR2 implement the full authenticated dashboard?

No. The authentication endpoints and middleware exist, but the UI still needs a deliberate cookie-based auth strategy for SSR-compatible protected routes. PR2 should avoid mixing auth migration with dynamic learning pages.

### Should PR2 migrate all legacy static client state away from localStorage?

No. This should be done incrementally. PR2 introduces a backend-ready progress model and dashboard view, but the actual mutation flow should be added after the API route strategy is finalized.

### Should PR2 add parent, teacher, and admin roles?

Not yet. Roles need schema changes, API authorization checks, navigation changes, and role-specific dashboards. PR2 documents this as a future RBAC milestone.

### What should come next?

1. Add cookie-based login/register pages.
2. Replace demo progress with `GET /api/me/progress` data.
3. Add client-side timer controls for mock exam sessions.
4. Persist mock exam answers and score results.
5. Add role type and RBAC checks for parent, teacher, and admin workflows.
