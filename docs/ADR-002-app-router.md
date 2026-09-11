# ADR #2 — Next.js App Router over Pages Router

**Date:** 2026  
**Status:** Accepted

## Context

When scaffolding the Next.js frontend we needed to choose between the App Router (introduced in Next.js 13, stable in 14) and the legacy Pages Router.

## Decision

Use the App Router.

## Reasoning

The App Router is the direction Next.js is actively investing in — Pages Router is in maintenance mode. For a new project with no migration cost, defaulting to the current architecture is the obvious choice.

More specifically, the App Router's React Server Component model is meaningful for this project: the platform presets fetched from the API on mount are a good candidate for server-side data fetching, reducing client bundle size. The layout system also makes it straightforward to add GTM at the root level without prop drilling.

## Alternatives Considered

**Pages Router:** Rejected. More familiar to developers coming from older Next.js projects, but no functional advantage for a new build. The ecosystem is moving to App Router and learning the current model is more valuable.

## Consequences

- `"use client"` directives required on any component using hooks or browser APIs
- Server Components are the default — components must opt into client rendering explicitly
- Some third-party libraries that rely on older Next.js patterns may need workarounds