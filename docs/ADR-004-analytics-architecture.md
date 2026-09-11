# ADR #4 — Centralised analytics hook over inline gtag calls

**Date:** 2026  
**Status:** Accepted

## Context

We needed to instrument the application with GA4 events via GTM. The question was how to structure the analytics calls in the codebase.

## Decision

All analytics events flow through a single typed event schema (`src/lib/analytics.ts`) and a centralised `useAnalytics` hook (`src/hooks/useAnalytics.ts`). No component calls `gtag()`, `dataLayer.push()`, or any analytics API directly.

## Reasoning

**Typed event schema:** Defining every possible event as a TypeScript interface means the compiler catches mismatched event shapes at build time rather than silently sending malformed events to GA4. It also serves as living documentation of exactly what the app tracks.

**Centralised hook:** Keeping all event construction in one place means there is a single location to update when event schemas change, a single location to mock in tests, and no risk of different components pushing slightly different shapes for the same conceptual event.

**GTM as the delivery layer:** Rather than calling GA4 directly, events are pushed to the dataLayer and GTM handles forwarding them to GA4. This keeps the codebase decoupled from the analytics provider — swapping GA4 for another tool requires a GTM config change, not a code change.

## Alternatives Considered

**Inline gtag() calls:** Rejected. Common in tutorial code but produces scattered, untestable, untyped analytics calls that are difficult to audit or refactor.

**Direct GA4 SDK:** Rejected. Couples the codebase to a specific analytics provider and bypasses GTM, which is the standard for managing tags in production marketing environments.

**Third-party analytics abstraction library:** Rejected. Adds a dependency for a problem that a typed hook solves cleanly without the overhead.

## Consequences

- All events are typed — TypeScript catches schema mismatches at compile time
- Analytics calls are testable in isolation by mocking `useAnalytics`
- GTM is the single point of configuration for tag management
- Adding a new event requires updating the union type in `analytics.ts` and adding a method to `useAnalytics` — slightly more ceremony than an inline call, but enforces consistency