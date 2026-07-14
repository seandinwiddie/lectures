---
title: "Modern Redux Architecture Patterns"
description: "Design typed Redux Toolkit applications around state ownership, feature boundaries, RTK Query, thunks, listeners, and correct store lifetime."
layout: lecture
---

# Modern Redux Architecture Patterns

Modern Redux architecture is less about putting data in one store and more about making authority, events, effects, and feature boundaries obvious.

## Architecture at a Glance

```text
User or integration event
        ↓
Event-oriented action
        ↓
Pure reducer transition
        ↓
Selector-derived view
        ↓
React render and next event
```

RTK Query owns reusable server documents alongside this loop. Thunks drive imperative workflows, and listener middleware reacts to events over time.

## State Ownership Boundaries

Before creating a slice, classify the state:

- Component: local drafts, disclosure state, focus, and one-tree interactions.
- Router: pathname, route params, and query params.
- Redux slice: shared durable client state and transitions with domain history.
- RTK Query: request/response data shared by consumers.
- Selector: values derived from other authoritative inputs.
- External source: storage, browser APIs, devices, or specialized engines.

Duplicating authority is more dangerous than choosing the "wrong" library. Keep URL filters in the router and pass them into selectors. Keep an input draft local until the user submits it.

## Feature-Oriented Structure

```text
src/
  app/
    store.ts
    hooks.ts
    listenerMiddleware.ts
    StoreProvider.tsx
  services/
    api.ts
  features/
    users/
      usersSlice.ts
      usersSelectors.ts
      usersApi.ts
      UsersList.tsx
      __tests__/
    notifications/
      notificationsSlice.ts
      notificationsListeners.ts
  routes/
    UsersPage.tsx
```

Application wiring stays small. Feature folders contain domain logic, selectors, feature endpoints, UI, and tests. Shared API configuration lives near application infrastructure, while endpoints remain colocated with the feature that understands them.

## Event-Oriented Slice Design

```ts
type WorkspaceState = {
  activeDocumentId: string | null
  recentDocumentIds: string[]
}

const initialState: WorkspaceState = {
  activeDocumentId: null,
  recentDocumentIds: [],
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    documentOpened(state, action: PayloadAction<{ id: string }>) {
      state.activeDocumentId = action.payload.id
      state.recentDocumentIds = [
        action.payload.id,
        ...state.recentDocumentIds.filter((id) => id !== action.payload.id),
      ].slice(0, 10)
    },
    workspaceClosed(state) {
      state.activeDocumentId = null
    },
  },
})
```

The reducer combines the new event with previous state and preserves the invariant that recent IDs are unique. Computing that merge before dispatch would move reducer responsibility into a caller.

## Selector Layers

Use simple selectors as the public read API for a feature. Compose memoized selectors when derivation is expensive or reference stability matters.

```ts
const selectWorkspace = (state: RootState) => state.workspace
const selectDocuments = (state: RootState) => state.documents.items

export const selectActiveDocument = createSelector(
  [selectWorkspace, selectDocuments],
  (workspace, documents) =>
    documents.find((item) => item.id === workspace.activeDocumentId) ?? null,
)
```

Do not store `activeDocument` when `activeDocumentId` plus the documents collection is authoritative.

## RTK Query Service Boundaries

Create one API root for one base URL:

```ts
// services/api.ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: () => ({}),
})
```

Inject endpoints from feature files:

```ts
// features/users/usersApi.ts
export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, string>({
      query: (id) => `users/${id}`,
    }),
  }),
})
```

Independent backends may have independent API roots. Multiple roots for the same backend fragment tags, subscriptions, and middleware behavior.

## Side-Effect Architecture

Choose by job:

### RTK Query

Use for server documents that need caching, request deduplication, invalidation, polling, or request-bound lifecycle behavior.

### Thunks

Use for an imperative sequence initiated from one call site, especially when it needs `dispatch` or `getState` and does not represent a reusable server cache.

```ts
export const workspaceExported = createAsyncThunk(
  'workspace/export',
  async (format: ExportFormat, { getState }) => {
    const state = getState() as RootState
    return exportWorkspace(selectWorkspaceForExport(state), format)
  },
)
```

### Listener middleware

Use when behavior reacts to actions or state transitions over time.

```ts
startAppListening({
  actionCreator: documentOpened,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    await listenerApi.delay(100)
    listenerApi.dispatch(recentDocumentRecorded(action.payload))
  },
})
```

Prepend listener middleware before default serializability checks; concatenate RTK Query middleware.

## Typed React Boundary

```ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Components use typed hooks and feature selectors. Direct store imports belong only in explicit non-React integration boundaries.

## Store Lifetime

### Client-only SPA

A module-level singleton represents the single browser session.

```ts
export const store = configureStore({ reducer })
```

### SSR-heavy application

Create one store per request, then keep it stable in the client provider.

```tsx
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore)
  return <Provider store={store}>{children}</Provider>
}
```

A server singleton can leak state across requests. Creating a store during every render loses state.

## Entity Collections

`createEntityAdapter` is useful for a normalized collection owned by a slice:

```ts
type Task = {
  taskId: string
  title: string
}

const tasksAdapter = createEntityAdapter<Task, string>({
  selectId: (task) => task.taskId,
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(),
  reducers: {
    tasksReceived: tasksAdapter.upsertMany,
    taskRemoved: tasksAdapter.removeOne,
  },
})

export const taskSelectors = tasksAdapter.getSelectors(
  (state: RootState) => state.tasks,
)
```

Adapters assume `entity.id` unless `selectId` defines another key. Do not normalize RTK Query documents by reflex. RTK Query is a document cache; use a normalized graph model only when graph identity is an actual requirement.

## Persistence

Persist the smallest stable client state. Avoid persisting transient status, derived data, sensitive values, or browser RTK Query caches by default. Version persisted schemas and define migration behavior.

```ts
type PersistedPreferences = {
  version: 2
  theme: 'light' | 'dark'
}
```

## Lazy Features

Lazy reducer or endpoint injection can reduce initial work in a large application. Keep the root type aware of lazy slices and avoid hiding ownership behind runtime magic.

```ts
// app/rootReducer.ts
import { combineSlices } from '@reduxjs/toolkit'
import { workspaceSlice } from '../features/workspace/workspaceSlice'

export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(workspaceSlice)
  .withLazyLoadedSlices<LazyLoadedSlices>()
```

```ts
// features/tasks/tasksSlice.ts
import type { WithSlice } from '@reduxjs/toolkit'
import { rootReducer } from '../../app/rootReducer'

declare module '../../app/rootReducer' {
  export interface LazyLoadedSlices extends WithSlice<typeof tasksSlice> {}
}

export const injectedTasksSlice = tasksSlice.injectInto(rootReducer)
```

`withLazyLoadedSlices` makes the future state shape explicit. `injectInto` returns a slice whose selectors understand the injected reducer path. RTK Query feature endpoints should likewise extend the existing API root with `injectEndpoints`.

For async lifecycle reducers that genuinely belong to a slice, RTK 2 also offers `buildCreateSlice` with `create.asyncThunk`. Keep reusable server cache in RTK Query; use the slice-local creator for an imperative lifecycle whose pending, fulfilled, and rejected transitions belong to that slice.

## ECS Integration Boundary

An entity-component-system fits a domain with entity identities, composable data components, and systems operating over component sets. Games, simulations, and editors often qualify.

Do not use ECS to model route parameters, ordinary forms, basic CRUD screens, or the RTK Query cache. If an ECS world is authoritative, expose events or selected projections to Redux instead of duplicating the world in slices.

## Debugging Model

1. Was the intended event dispatched?
2. Did the reducer accept the transition from the current state?
3. Does the selector produce the expected view?
4. Is the component subscribed to that selector result?
5. For RTK Query, are the endpoint args, tags, and active subscriptions correct?
6. For listeners, are matching and cancellation correct?
7. For thunks, where did the imperative workflow reject or branch?

### Guard effect-driven thunks at the thunk boundary

React StrictMode can run effects twice during development. If a non-cache thunk
is dispatched from an effect, a component check alone is not enough:

```ts
export const reportPrepared = createAsyncThunk(
  'reports/prepared',
  prepareReport,
  {
    condition(_request, { getState }) {
      const state = getState() as RootState
      return state.reports.status === 'idle'
    },
  },
)
```

RTK Query hooks already deduplicate identical active query subscriptions, so do
not rebuild that cache behavior with effect-driven fetch thunks.

### Treat serializability warnings as design feedback

```ts
// Wrong: Date and Set are not ordinary serializable state.
const wrongState = {
  lastSavedAt: new Date(),
  selectedIds: new Set<string>(),
}

// Correct: store serializable domain values.
const state = {
  lastSavedAtIso: new Date().toISOString(),
  selectedIds: [] as string[],
}
```

The timestamp is generated outside the reducer and carried by an event. Do not
silence a warning until the boundary has been understood.

### Narrow subscriptions and preserve references

Select the values a component renders rather than an entire slice in a parent.
When using RTK Query's `selectFromResult`, avoid returning a freshly copied
array such as `[...data]`; that defeats memoization even when cached data did
not change.

### Interpret invalidation with cache subscriptions

When a mutation invalidates a tag, active query subscribers refetch. Inactive
entries are removed and fetch again only when another consumer subscribes.
Check tag identity and subscription state before concluding that invalidation
failed.

## Migration Architecture

Modernize a legacy application in vertical steps:

1. replace `createStore` with `configureStore` while old reducers still run;
2. migrate each touched reducer to `createSlice`;
3. move touched React components from `connect` to typed hooks;
4. replace hand-written server loading state with RTK Query where its document cache fits; and
5. use RTK codemods for mechanical builder changes, then review semantics by hand.

Do not carry removed RTK 1 configuration forms into new code:

```ts
// Removed forms
configureStore({ reducer, middleware: [logger] })
createSlice({
  name: 'legacy',
  initialState,
  reducers: {},
  extraReducers: {
    [requestFinished.type]: requestReducer,
  },
})

// RTK 2 forms
configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
})

createSlice({
  name: 'current',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(requestFinished, requestReducer)
  },
})
```

Incremental migration means shipping coherent vertical changes, not preserving
obsolete import paths with new compatibility layers.

## Testing Architecture

- Reducer tests exercise event sequences and invariants.
- Selector tests cover derived outputs.
- Endpoint tests cover request contracts, tags, and cache behavior.
- Thunk tests cover imperative orchestration.
- Listener tests cover matching, cancellation, and emitted actions.
- Component tests cover local interactions and rendered outcomes.
- End-to-end tests cover a small number of critical cross-feature journeys.

## Exercise

Design a collaborative editor architecture. Assign ownership for:

- the current route document ID;
- an unsaved title draft;
- shared client preferences;
- server document content;
- a debounced autosave reaction;
- an export command;
- a simulation canvas that may or may not justify ECS.

Document why each owner and tool fits, then implement one vertical feature with typed hooks and tests. Add a lazy task feature, diagnose one duplicate-work or invalidation scenario, and write the forward-only migration order for a legacy version of the feature.

## Resources

- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Redux Toolkit Usage Guide](https://redux-toolkit.js.org/usage/usage-guide)
- [combineSlices and Lazy Injection](https://redux-toolkit.js.org/api/combineSlices)
- [Migrating to Modern Redux](https://redux-toolkit.js.org/usage/migrating-to-modern-redux)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [Canonical Maintenance Strategy](../technology-maintenance.md)
