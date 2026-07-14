---
title: "Redux Toolkit and RTK Query Best Practices"
description: "Assign state to the right owner, build event-oriented slices, and use one RTK Query API per base URL with injected feature endpoints."
layout: lecture
---

# Redux Toolkit and RTK Query Best Practices

Modern Redux starts with ownership. Redux Toolkit handles shared durable client state; RTK Query handles reusable server documents; React owns local editing and interaction state; the router owns the URL.

## Decide Who Owns the State

| State | Default owner |
| --- | --- |
| Input draft, open disclosure, focused item | Component state |
| Path, route parameter, search parameter | Router |
| Shared client state with meaningful transitions | Redux slice |
| Request/response data reused by consumers | RTK Query |
| Calculated view data | Selector |

The owner is the source of truth. Avoid copying query data into a slice or synchronizing router state into Redux.

## Event-Oriented Slices

Use `createSlice` and name actions after events.

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type PreferencesState = {
  theme: 'light' | 'dark'
  compactMode: boolean
}

const initialState: PreferencesState = {
  theme: 'light',
  compactMode: false,
}

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    themeSelected(state, action: PayloadAction<PreferencesState['theme']>) {
      state.theme = action.payload
    },
    compactModeToggled(state) {
      state.compactMode = !state.compactMode
    },
  },
})
```

Immer lets reducers use mutation syntax while Redux Toolkit produces an immutable result. Reducers still need to be deterministic and free of effects.

### Derive views with selectors

```ts
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

const selectUsers = (state: RootState) => state.users.items
const selectRole = (_state: RootState, role: string) => role

export const selectUsersByRole = createSelector(
  [selectUsers, selectRole],
  (users, role) => users.filter((user) => user.role === role),
)
```

Do not store `usersByRole`, counts, totals, or labels when they can be derived from authoritative state.

## Create One API per Base URL

Create the shared API root once.

```ts
// services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['User'],
  endpoints: () => ({}),
})
```

Add feature endpoints with `injectEndpoints`. The first enhanced API type knows
about `getUsers`; the second injection can safely patch that cache from a
mutation lifecycle without creating another API root.

```ts
// features/users/usersApi.ts
import { api } from '../../services/api'

type User = {
  id: string
  name: string
  role: string
}

export const usersReadApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              'User',
            ]
          : ['User'],
    }),
  }),
})

export const usersApi = usersReadApi.injectEndpoints({
  endpoints: (build) => ({
    renameUser: build.mutation<User, Pick<User, 'id' | 'name'>>({
      query: ({ id, name }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
      async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          usersReadApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const user = draft.find((item) => item.id === id)
            if (user) user.name = name
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo()
        }
      },
    }),
  }),
})

export const { useGetUsersQuery, useRenameUserMutation } = usersApi
```

Multiple API roots for the same base URL fragment invalidation and add middleware overhead. Independent base URLs can use independent roots.

Tags are the normal invalidation path. `onQueryStarted` is appropriate when the
interface needs an immediate optimistic result; keep the patch and rollback
inside the mutation lifecycle rather than a component.

## Generate Endpoints from OpenAPI

For a large schema, generate endpoints into the same empty API root rather than
maintaining request types and hooks by hand.

```ts
// openapi-config.ts
import type { ConfigFile } from '@rtk-query/codegen-openapi'

const config = {
  schemaFile: './openapi.json',
  apiFile: './src/services/api.ts',
  apiImport: 'api',
  outputFile: './src/features/users/generatedUsersApi.ts',
  exportName: 'generatedUsersApi',
  hooks: true,
  tag: true,
  filterEndpoints: [/User/],
  endpointOverrides: [
    {
      pattern: 'updateUser',
      type: 'mutation',
    },
    {
      pattern: /.*/,
      parameterFilter: (_name, parameter) => parameter.in !== 'header',
    },
    {
      pattern: 'getUserById',
      providesTags: ['User'],
    },
  ],
} satisfies ConfigFile

export default config
```

```bash
npx @rtk-query/codegen-openapi openapi-config.ts
```

Treat generated code as reviewed source:

- filter a broad schema to the endpoints the feature actually owns;
- correct query-versus-mutation mistakes with `endpointOverrides`;
- remove parameters the application boundary should supply itself;
- inspect generated tags, which may be broader than the cache contract needs;
- regenerate after configuration or schema changes instead of hand-editing output; and
- confirm every generated endpoint extends the shared API root.

Code generation removes mechanical drift, not architectural judgment.

## Configure the Store Once

```ts
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { api } from '../services/api'
import { preferencesSlice } from '../features/preferences/preferencesSlice'

export const listenerMiddleware = createListenerMiddleware()

export const store = configureStore({
  reducer: {
    preferences: preferencesSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const startAppListening =
  listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()
```

Prepend listener middleware because listener registration actions may contain functions. Concatenate RTK Query middleware after the default middleware.

## Export Typed Hooks

```ts
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

React components should read through context and typed hooks rather than importing the store.

## Use Query and Mutation Hooks

```tsx
export function UsersPanel() {
  const { data: users = [], isLoading, error } = useGetUsersQuery()
  const [renameUser, renameState] = useRenameUserMutation()

  if (isLoading) return <p>Loading users…</p>
  if (error) return <p>Could not load users.</p>

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
          <button
            disabled={renameState.isLoading}
            onClick={() => renameUser({ id: user.id, name: `${user.name}!` })}
          >
            Update
          </button>
        </li>
      ))}
    </ul>
  )
}
```

Local input drafts can stay in `useState`; commit them through a mutation or domain event when the user submits.

## Understand Invalidation

Queries declare which documents they provide. Mutations invalidate the smallest useful set of tags. Active subscribers refetch; inactive invalidated entries are removed and fetch again when another consumer subscribes.

Invalidation is not a background "refresh everything" command. If a mutation appears not to refetch, first verify that the affected query provided the invalidated tag and still has an active subscriber.

## Choose the Side-Effect Tool

| Need | Tool |
| --- | --- |
| Cached server documents | RTK Query |
| One imperative sequence using `dispatch` or `getState` | `createAsyncThunk` or a thunk |
| Reaction to future actions or state changes | Listener middleware |

`createAsyncThunk` remains useful for workflows that are not a reusable server cache, such as exporting a report assembled from current state or coordinating a multi-step native API.

Listener middleware fits event reactions, cancellation, debouncing, and workflows that wait for later actions.

```ts
startAppListening({
  actionCreator: searchRequested,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    await listenerApi.delay(250)
    listenerApi.dispatch(searchStarted(action.payload))
  },
})
```

## Store Lifetime

- Client-only SPA: one module-level store matches one browser session.
- SSR-heavy application: create one store per request, then keep the client instance stable in a provider.
- Non-React integration: direct store access can be an explicit boundary, not the default component pattern.

## Cache Boundaries

RTK Query is a document cache. It does not merge every response into a single normalized graph. When graph identity is a core requirement, use an appropriate normalized client or a domain slice with `createEntityAdapter`.

Browser cache persistence is not a default. Persisting RTK Query state can retain stale documents longer than users expect.

## Debug Query Behavior Systematically

When cached data looks wrong, inspect the request and cache boundaries before
adding another effect:

1. confirm the endpoint and serialized argument identify the expected cache key;
2. inspect whether the query is pending, fulfilled, rejected, or skipped;
3. compare the query's `providesTags` with the mutation's `invalidatesTags`;
4. check whether an active subscriber exists when invalidation occurs; and
5. verify that selection code returns stable references.

RTK Query deduplicates identical active query subscriptions. Handwritten fetch
thunks dispatched from effects need their own thunk-level guard because React
StrictMode can run an effect twice during development.

```ts
import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { exportReport } from './exportReport'

export const reportExportRequested = createAsyncThunk(
  'reports/exportRequested',
  exportReport,
  {
    condition(_request, { getState }) {
      const state = getState() as RootState
      return state.reports.status === 'idle'
    },
  },
)
```

Keep fallback references stable when selecting part of a query result:

```tsx
const EMPTY_USERS: User[] = []

const { users } = useGetUsersQuery(undefined, {
  selectFromResult: ({ data }) => ({
    users: data ?? EMPTY_USERS,
  }),
})
```

Creating a new array with `[...data]` on every selection defeats memoization.
Likewise, keep dates, sets, class instances, promises, and other non-serializable
values out of ordinary Redux state; store a serializable representation instead.

## Testing

- Test reducers with event sequences and invariant cases.
- Test selectors with representative inputs.
- Test RTK Query endpoints against a controlled request boundary.
- Verify tag invalidation, optimistic rollback, and active-subscription behavior.
- Regenerate OpenAPI output and review the diff when the schema changes.
- Test thunks as imperative workflows.
- Test listeners for matching, cancellation, and dispatched results.
- Test components through visible outcomes rather than implementation details.

## Exercise

Build a user-management feature that:

1. keeps a search string in the URL;
2. keeps an edit form draft local until submit;
3. stores a shared client-only selection in a slice;
4. injects user endpoints into one shared API root;
5. uses tags for update invalidation;
6. debounces a user-requested search event with listener middleware;
7. exposes typed hooks and selectors;
8. generates a reviewed subset of endpoints from an OpenAPI schema;
9. diagnoses one invalidation with and without an active subscriber; and
10. tests each owner at its boundary.

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [RTK Query Code Generation](https://redux-toolkit.js.org/rtk-query/usage/code-generation)
- [Automated Re-fetching](https://redux-toolkit.js.org/rtk-query/usage/automated-refetching)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Canonical Maintenance Strategy](../technology-maintenance.md)
