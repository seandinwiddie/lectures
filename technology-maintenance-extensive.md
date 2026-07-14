---
title: "FP and Modern Redux Maintenance Strategy - Extended Notes"
description: "Extended migration notes for applying functional programming, explicit state ownership, Redux Toolkit, RTK Query, and ECS boundaries."
robots: "noindex, follow"
sitemap: false
canonical_url: "https://seandinwiddie.github.io/lectures/technology-maintenance.html"
---

# FP and Modern Redux Maintenance Strategy: Extended Notes

These non-indexed notes expand on selected tradeoffs in the [canonical maintenance strategy](./technology-maintenance.md). They are retained for maintainers who want migration rationale without creating a competing search document.

## Authority Before Architecture

A state-management decision starts with authority:

- Who can change the value?
- How long must it live?
- Which consumers coordinate through it?
- Does another system already own it?
- Is the value authoritative or derived?

The answers determine the architecture. A form draft that disappears on navigation has different needs from a shared shopping cart. A query string already belongs to the router. A server response usually belongs to a server-data cache rather than a hand-maintained slice.

### Local interaction state

Local state is useful for editable fields, disclosure controls, focus, drag state, temporary selections, and component-scoped workflows. Keeping it local reduces global actions and prevents unrelated screens from depending on implementation details.

Move it only when requirements change: distant consumers coordinate on the value, navigation must preserve it, a domain transition must be audited, or the value becomes shared durable client state.

### Router state

The router owns paths, route parameters, and search parameters. Pass router values into selectors or pure functions at the edge. Synchronizing them into Redux creates two authorities and requires bidirectional update rules.

### Shared client state

Redux slices fit state whose transitions matter across features. Name slices after domains, not components, and name actions after events. The reducer owns transitions that depend on previous store state.

### Server state

RTK Query fits request/response data that can use document caching. It owns loading state, request deduplication, cache lifetimes, and invalidation. A component consumes the cache; it does not copy query results into a second slice.

## Event-Oriented Redux

An event says what happened:

```ts
cartItemAdded({ productId, quantity })
checkoutSubmitted({ paymentMethodId })
profileSaved({ displayName })
```

A setter says how storage should change:

```ts
setCart(nextCart)
setCheckoutStatus('pending')
setProfile(nextProfile)
```

Events preserve intent and let reducers own invariants. Setter-style actions can be appropriate for authoritative replacement snapshots, but they should not be the default vocabulary.

Selectors preserve one source of truth. Store raw domain state, then derive counts, filtered arrays, totals, labels, and view models. Memoize only when reference stability or expensive computation matters.

## Server Cache Architecture

Create the API root once:

```ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Account', 'Post'],
  endpoints: () => ({}),
})
```

Inject feature endpoints:

```ts
export const accountsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAccount: build.query<Account, string>({
      query: (id) => `accounts/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Account', id }],
    }),
  }),
})
```

Multiple `createApi` instances for the same base URL duplicate middleware work and fragment invalidation. Separate roots make sense for genuinely independent base URLs or protocols.

### Invalidation behavior

When a mutation invalidates tags:

- active subscribers refetch;
- inactive cache entries are removed;
- removed entries fetch when a consumer subscribes again.

That lifecycle is deliberate. Invalidation is not a broadcast command to refetch every historical request.

### Endpoint lifecycles

Use `onQueryStarted` for optimistic or pessimistic request-bound updates. Use `onCacheEntryAdded` for long-lived subscriptions tied to a cache entry. Keep those behaviors near the endpoint so cancellation and rollback rules remain visible.

### Cache-model limits

RTK Query stores endpoint documents. It does not automatically maintain one normalized graph across every response. If graph identity and cross-document normalization are central requirements, use a tool designed for that model or explicitly normalize into a domain slice.

## Imperative and Reactive Workflows

Use a thunk when one call site drives a sequence:

```ts
export const exportReport = createAsyncThunk(
  'reports/export',
  async (format: ExportFormat, { getState }) => {
    const report = selectCurrentReport(getState() as RootState)
    return saveReport(report, format)
  },
)
```

Use listener middleware when behavior reacts to events or state changes over time:

```ts
startAppListening({
  actionCreator: checkoutCompleted,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      notificationQueued({ message: `Order ${action.payload.id} completed` }),
    )
  },
})
```

Listener helpers such as `cancelActiveListeners`, `condition`, `take`, and `fork` make concurrency rules explicit. A polling loop inside a thunk is usually a sign that a listener or subscription boundary fits better.

## React Boundaries

React components can contain local interaction logic and hooks. Keep domain decisions in pure functions, reducers, or services so they can be tested without rendering.

Use an effect when synchronizing with an external system, such as a media API, observer, browser event source, or third-party widget. Do not use an effect merely to calculate render data, mirror router values, or reimplement a server-data cache.

Use `useMemo` and `useCallback` when measurement or an API contract requires referential stability. They are performance tools, not correctness tools.

Typed hooks are the normal React-Redux boundary:

```ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

## Store Lifetime

For a client-only SPA, a module-level store matches the single browser session. For an SSR-heavy framework, export `makeStore`, create one instance per request, and keep it stable in the client provider. A module singleton on the server can leak state across requests; recreating the store during every render loses state.

## Feature Boundaries

Start with a small application layer and feature folders:

```text
src/
  app/
    store.ts
    hooks.ts
    listenerMiddleware.ts
  services/
    api.ts
  features/
    account/
      accountSlice.ts
      accountSelectors.ts
      accountApi.ts
      AccountPanel.tsx
```

Split slices when unrelated updates create noise. Merge state when consumers repeatedly reconstruct one invariant outside reducers. Boundaries should follow ownership and access patterns, not a fixed file-count rule.

## ECS Decision Record

Use ECS when the domain can be stated naturally as:

1. entities are identifiers;
2. components are data attached by capability;
3. systems transform matching component sets;
4. runtime composition is more important than class hierarchy.

Good candidates include simulations, games, visualization engines, spatial editors, and behavior systems. Poor candidates include form drafts, route filters, routine account CRUD, and server response caching.

If an ECS world is authoritative, avoid mirroring every component into Redux. Publish domain events or selected projections when the surrounding application needs them. This keeps both stores honest about their responsibilities.

## Migration Playbook

### Phase 1: Inventory

- List state values and current owners.
- Mark duplicated authorities.
- Identify values that are actually derived.
- Group network calls by base URL and protocol.
- Classify side effects as cached, imperative, reactive, or external subscriptions.

### Phase 2: Establish boundaries

- Add typed hooks and correct store lifetime.
- Move URL authority back to the router.
- Keep component-scoped drafts local.
- Create one RTK Query root per base URL.
- Add listener middleware before serializability checks.

### Phase 3: Migrate vertically

- Choose one feature.
- Express its transitions as events.
- Move derived data to selectors.
- Inject its server endpoints.
- Assign each remaining effect to a thunk, listener, or adapter.
- Verify behavior before moving to the next feature.

### Phase 4: Remove obsolete paths

- Delete duplicated cache slices.
- Remove synchronization effects between router and Redux.
- Remove generic setters replaced by domain events.
- Remove stale compatibility layers once callers use the new authority.

## Testing Notes

Test the boundary that owns the behavior:

- pure functions for calculations;
- reducers for transitions and invariants;
- selectors for derived views;
- endpoints for request and cache behavior;
- thunks for imperative sequences;
- listeners for event reactions and cancellation;
- components for local interactions and rendered outcomes;
- end-to-end flows for the smallest set of critical user journeys.

Real integrations are valuable, but requiring a live production dependency for every test makes feedback slow and fragile. Use controlled test services or fakes when they preserve the contract under test.

## Operational Debugging

Start from the event and walk forward. If an event is absent, inspect the UI or integration boundary. If state is wrong, inspect reducer guards. If state is right but the UI is wrong, inspect selectors and subscriptions. If server data is stale, inspect cache keys, tags, subscriptions, and lifecycle handlers. If a listener misbehaves, inspect matching and cancellation.

The [canonical debugging checklist](./technology-maintenance.md#debugging-strategies) provides the short version.
