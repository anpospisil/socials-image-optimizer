# ADR #5 — Testing strategy

**Date:** 2026  
**Status:** Accepted

## Context

We needed to decide what to test, at what level, and why — rather than writing tests for coverage's sake.

## Decision

Three Jest unit test suites targeting the areas most likely to regress silently and most damaging in production: the analytics event schema, the platform preset config, and the useProcessor hook state transitions.

## Reasoning

**Why test analytics events specifically?**  
Analytics failures are invisible to users and silent in the codebase — a broken dataLayer push doesn't throw an error, it just stops sending data to GA4. By the time someone notices in the dashboard, the data gap is already there. Testing that the correct event shape reaches the dataLayer, and that the GTM `event` key is always present, catches these regressions at commit time rather than weeks later.

**Why test platform presets?**  
The TypeScript presets mirror the Python API presets. If someone updates one without the other, images will be generated at wrong dimensions with no runtime error. A simple test that validates all presets have positive, non-zero dimensions is cheap insurance.

**Why test useProcessor hook state?**  
The hook is the core of the application — it owns all state transitions, API calls, and business logic. Testing it in isolation (mocking the API layer) verifies that state behaves correctly regardless of UI changes, and makes the hook safe to refactor.

**Why not more coverage?**  
UI component tests against static markup have low signal-to-noise ratio and break constantly during iteration. E2E tests (Playwright) cover the full user journey more meaningfully than component snapshots. The three suites chosen represent the highest-value, lowest-maintenance tests for this project at this stage.

## Alternatives Considered

**Full component testing with React Testing Library:** Rejected as the primary strategy. Useful for complex interactive components but adds brittleness for simple presentational components.

**Coverage targets:** Rejected. Optimising for a coverage number incentivises low-value tests. We test what matters, not what's measurable.

## Consequences

- 31 tests across 3 suites, all fast (under 2 seconds total)
- Analytics regressions caught at commit time
- Hook logic is safely refactorable
- UI components remain largely untested at unit level — covered by Playwright E2E in Phase 5