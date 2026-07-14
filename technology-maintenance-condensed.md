---
title: "FP and Modern Redux Maintenance Strategy - Quick Reference"
description: "A concise checklist for state ownership, Redux dataflow, RTK Query, side effects, store lifetime, and ECS boundaries."
robots: "noindex, follow"
sitemap: false
canonical_url: "https://seandinwiddie.github.io/lectures/technology-maintenance.html"
---

# FP and Modern Redux Maintenance Strategy: Quick Reference

This non-indexed quick reference summarizes the [canonical maintenance strategy](./technology-maintenance.md). Use the canonical guide when a decision needs examples or tradeoffs.

## Choose the Owner First

| State kind | Owner and tool |
| --- | --- |
| Local form draft or one-tree UI interaction | Component state |
| URL, route parameter, or search filter | Router |
| Shared durable client state | Redux Toolkit slice |
| Reusable server document cache | RTK Query |
| Derived data | Selector, not stored state |
| Browser or third-party authority | Boundary adapter |

Promote local state only when coordination, persistence, or action-history requirements justify the extra global surface.

See [State Ownership](./technology-maintenance.md#state-ownership).

## Follow Redux Dataflow

1. Dispatch an event that describes what happened.
2. Let the reducer combine the event with current slice state.
3. Derive view data with selectors.
4. Render through typed React-Redux hooks.

Avoid generic setter actions, state mutation outside reducers, and duplicate derived fields.

See [Redux Dataflow](./technology-maintenance.md#redux-dataflow).

## Match Effects to the Job

| Need | Tool |
| --- | --- |
| Cached request/response data | RTK Query |
| Imperative workflow from one call site | Thunk |
| Reaction to later events or state changes | Listener middleware |
| Pure calculation | Function or selector |

Reducers do not perform effects. Component effects remain appropriate for synchronization with external systems; they are not a substitute for selectors, event handlers, router ownership, or RTK Query caching.

See the [Side-Effect Decision Table](./technology-maintenance.md#side-effect-decision-table).

## RTK Query Checklist

- [ ] One `createApi` root exists per base URL.
- [ ] Feature files add endpoints with `injectEndpoints`.
- [ ] The API reducer and middleware are installed once.
- [ ] Queries provide tags and mutations invalidate the narrowest useful tags.
- [ ] Optimistic updates live in endpoint lifecycle handlers.
- [ ] The team understands that inactive invalidated entries are removed rather than refetched immediately.
- [ ] A different cache model is chosen when a normalized graph is the real requirement.

See [Server Data with RTK Query](./technology-maintenance.md#server-data-with-rtk-query).

## React and Store Checklist

- [ ] Editable fields and transient local interactions stay local by default.
- [ ] URL state is read from router APIs instead of mirrored into Redux.
- [ ] Shared transitions use event-oriented slices.
- [ ] Components use `useAppDispatch` and `useAppSelector`.
- [ ] A browser SPA uses one store, while an SSR-heavy app creates a store per request and keeps it stable during client renders.
- [ ] Components do not import the store directly.

See [Typed Hooks and Store Lifetime](./technology-maintenance.md#typed-hooks-and-store-lifetime).

## ECS Boundary

Use an entity-component-system only when the domain has stable entity identities, composable data components, and systems that process component sets. Games, simulations, and spatial editors often qualify. Forms, routing, ordinary CRUD, and server document caching generally do not.

See [ECS Only for ECS-Shaped Domains](./technology-maintenance.md#ecs-only-for-ecs-shaped-domains).

## Migration Order

1. Inventory state and authority boundaries.
2. Remove duplicated derived state.
3. Establish typed hooks and correct store lifetime.
4. Consolidate RTK Query roots by base URL.
5. Split imperative thunks from reactive listeners.
6. Migrate one vertical feature with tests.
7. Reassess slice boundaries after real usage.

See the [Implementation Roadmap](./technology-maintenance.md#implementation-roadmap).

## Verification

- [ ] Reducer and selector tests cover domain transitions.
- [ ] Endpoint tests cover cache and invalidation behavior.
- [ ] Listener tests cover cancellation and event matching.
- [ ] Component tests cover local interactions and user-visible outcomes.
- [ ] Documentation checks cover internal links, rendered HTML, schema, sitemap, and heading structure.

See the [Testing Strategy](./technology-maintenance.md#testing-strategy) and [Debugging Strategies](./technology-maintenance.md#debugging-strategies).
