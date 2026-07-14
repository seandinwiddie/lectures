---
title: "FP and Modern Redux Maintenance Strategy"
description: "A practical maintenance guide for functional TypeScript applications using modern Redux Toolkit, RTK Query, typed hooks, and explicit state ownership."
---

# FP and Modern Redux Maintenance Strategy

This is the canonical maintenance guide for the curriculum. It combines functional programming with current Redux Toolkit practices while keeping authority boundaries explicit. Choose the owner of data first, then choose the tool.

## Purpose

Use this guide to keep a TypeScript application predictable as it grows:

- express domain transitions as pure functions or pure reducers;
- keep one authoritative owner for each kind of state;
- describe events instead of dispatching generic setters;
- derive view data with selectors instead of storing duplicates;
- isolate effects at deliberate boundaries;
- test behavior at the narrowest useful level.

Redux Toolkit is the standard way to write Redux logic. It is not a requirement to put every value in Redux.

## State Ownership

| State kind | Default owner | Typical tool |
| --- | --- | --- |
| Editable fields and temporary UI state used by one component tree | React component | `useState` or `useReducer` |
| Pathname, route parameters, query string, and navigation history | Router | Router APIs, passed into selectors when needed |
| Shared durable client state with domain transitions | Redux | `createSlice` and event-oriented actions |
| Reusable request/response server data | RTK Query | One `createApi` instance per base URL |
| Browser authority such as storage, media, or connection state | Browser API | Read or subscribe at a boundary, then dispatch domain events if the app needs a snapshot |
| Derived view data | No stored owner | Plain or memoized selectors |

### Keep local editing local

Form fields normally belong to the component until the user commits them. Dispatch the meaningful domain event, not each keystroke.

```tsx
export function ProfileForm() {
  const [displayName, setDisplayName] = useState('')
  const dispatch = useAppDispatch()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch(profileSaved({ displayName }))
      }}
    >
      <input
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  )
}
```

Move editing state to Redux only when multiple distant consumers genuinely coordinate on the same draft, or when the action history is part of the product requirement.

### Keep URL state with the router

Do not synchronize route filters into a slice. Read the router's value and pass it to a selector.

```tsx
const selectVisiblePosts = createSelector(
  [selectPosts, (_state: RootState, filter: string) => filter],
  (posts, filter) =>
    filter === 'published'
      ? posts.filter((post) => post.published)
      : posts,
)

export function PostsPage() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') ?? 'all'
  const posts = useAppSelector((state) => selectVisiblePosts(state, filter))

  return <PostsList posts={posts} />
}
```

## Redux Dataflow

Use the event → reducer → selector → render loop:

1. A user interaction, server response, or integration boundary produces an event.
2. A reducer owns the transition from the previous state to the next state.
3. Selectors derive the view shape from authoritative state.
4. Components render selected data and dispatch new events.

Reducers stay pure. Immer-backed mutation syntax inside `createSlice` is safe because Redux Toolkit produces immutable updates.

```ts
const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [] as Post[], filter: 'all' as PostFilter },
  reducers: {
    postAdded(state, action: PayloadAction<Post>) {
      state.items.push(action.payload)
    },
    postPublished(state, action: PayloadAction<{ id: string }>) {
      const post = state.items.find((item) => item.id === action.payload.id)
      if (post) post.published = true
    },
    filterChanged(state, action: PayloadAction<PostFilter>) {
      state.filter = action.payload
    },
  },
})
```

Prefer `postAdded`, `postPublished`, and `checkoutCompleted` to setter-style actions such as `setPosts` or `setStatus`. When a transition combines current store state with new input, dispatch the new input and let the reducer perform the merge.

## Typed Hooks and Store Lifetime

Centralize application wiring and export inferred types.

```ts
export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Use one module-level store for a client-only single-page application. In an SSR-heavy framework, create a store per request and keep the client instance stable inside a provider. React components read through typed hooks rather than importing the store directly.

## Server Data with RTK Query

RTK Query is the default for reusable request/response data that benefits from document caching. Create one API slice per base URL, then split feature endpoint definitions with `injectEndpoints`.

```ts
// services/api.ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Post'],
  endpoints: () => ({}),
})

// features/posts/postsApi.ts
export const postsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => 'posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
              'Post',
            ]
          : ['Post'],
    }),
    updatePost: build.mutation<Post, Pick<Post, 'id' | 'title'>>({
      query: ({ id, title }) => ({
        url: `posts/${id}`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
    }),
  }),
})
```

Use tags as the normal invalidation path. Put optimistic updates in endpoint lifecycle handlers so rollback remains tied to the request. Remember that invalidation refetches active subscriptions; inactive entries are removed and fetched when a consumer subscribes again.

RTK Query is a document cache, not a normalized graph cache. If the real requirement is a normalized entity graph, use a purpose-built client or a slice plus an entity adapter when that better matches the domain.

## Side-Effect Decision Table

| Need | Tool |
| --- | --- |
| Cached server data shared by consumers | RTK Query |
| One imperative async workflow that needs `dispatch` or `getState` | `createAsyncThunk` or a handwritten thunk |
| A workflow that reacts to later actions or state transitions | Listener middleware |
| A calculation with no observable effect | Plain function or selector |
| Synchronization with a browser or third-party API | A boundary adapter, often triggered by a thunk or listener |

Use thunks to drive a workflow from one call site. Use listeners when the behavior reacts to events over time, such as debouncing a search event, canceling stale work, responding to authentication changes, or coordinating notifications after another feature succeeds.

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

Do not run network calls, timers, logging, random-number generation, or storage writes inside reducers.

## Components and Hooks

Components may own view-specific behavior. Local state, refs, memoization, and effects are valid when they synchronize React with an external system or manage a local interaction.

Avoid using an effect to derive data that can be calculated during render, to mirror URL state into Redux, or to perform cached data fetching that RTK Query already owns. Prefer event handlers for user-driven work and selectors for derived store data.

The boundary is responsibility, not file extension: domain rules should be testable outside a component, while component-local interaction state can remain local.

## Directory Structure

Organize by application wiring and domain features:

```text
src/
  app/
    store.ts
    hooks.ts
    listenerMiddleware.ts
  services/
    api.ts
  features/
    posts/
      postsSlice.ts
      postsSelectors.ts
      postsApi.ts
      PostsList.tsx
      __tests__/
  routes/
    PostsPage.tsx
```

Keep API configuration shared by base URL, feature logic colocated, and cross-cutting wiring small. Revisit slice boundaries as access patterns change.

## ECS Only for ECS-Shaped Domains

Entity-component-system architecture fits domains where:

- entities are stable identities;
- components are data attached by capability;
- systems operate over matching component sets;
- composition changes more often than inheritance hierarchies.

Games, simulations, spatial editors, and high-volume behavior engines often fit. Forms, routing, ordinary CRUD screens, and RTK Query's server document cache usually do not.

When ECS is appropriate, keep component data plain and systems deterministic where practical. Treat the ECS world as a domain authority; expose projections or events to Redux only when the wider application needs them. Do not duplicate the full ECS world in slices.

## Testing Strategy

- Test pure functions and reducers with direct inputs and outputs.
- Test selectors against representative state, including memoization only when it matters.
- Test RTK Query endpoints with a controlled test server or request boundary and verify cache invalidation behavior.
- Test thunks as imperative workflows and listeners as reactions to events.
- Test components at the user boundary, including legitimate local form and UI state.
- Keep a small rendered-site verification suite for documentation, links, schema, sitemap, and accessibility structure.

Mocks are a tool, not a goal. Prefer realistic boundaries where practical, but do not require a production backend for every unit test.

## Implementation Roadmap

1. Inventory each state value and assign its authoritative owner.
2. Move reusable server documents to one RTK Query API per base URL.
3. Convert shared durable client transitions to event-oriented slices.
4. Keep local drafts and UI affordances local unless coordination requirements justify promotion.
5. Remove duplicated derived state and expose selectors.
6. Classify effects as cached server data, imperative workflows, or reactive workflows.
7. Add typed hooks and verify store lifetime for the rendering environment.
8. Introduce ECS only after the domain passes the ECS-shape test.
9. Migrate one vertical feature at a time and keep behavior covered by tests.

## Debugging Strategies

Follow the dataflow in order:

1. Confirm the expected event was dispatched with the intended payload.
2. Inspect the reducer transition and current state guards.
3. Evaluate selectors with the same inputs the component receives.
4. Check whether the component subscribes to the narrowest useful result.
5. For RTK Query, inspect cache keys, active subscriptions, tags, and invalidation.
6. For listeners, inspect match conditions, cancellation, and concurrent instances.
7. For thunks, inspect the imperative control flow and rejected result handling.

Use Redux DevTools for action history and state transitions. Use focused logs at effect boundaries, then remove noisy diagnostics after the problem is understood.

## Maintenance Checklist

- [ ] Every state value has one authoritative owner.
- [ ] Reducers are pure and own transitions that depend on previous store state.
- [ ] Actions describe events rather than generic setters.
- [ ] Derived values come from selectors.
- [ ] React uses typed dispatch and selector hooks.
- [ ] Server data uses an appropriate cache model.
- [ ] Each base URL has one RTK Query API root with injected feature endpoints.
- [ ] Imperative and reactive workflows use the tool that matches the job.
- [ ] Store lifetime matches SPA or SSR requirements.
- [ ] ECS appears only in an ECS-shaped domain.
- [ ] Tests cover ownership boundaries and user-visible behavior.

## Related Curriculum

- [Redux Toolkit and Functional Programming](./redux-toolkit-and-functional-programming/)
- [Redux Toolkit and RTK Query Best Practices](./redux-toolkit-and-rtk-query-best-practices/)
- [Modern Redux Architecture Patterns](./modern-redux-architecture-patterns/)
- [Functional Programming Maintenance Strategy](./functional-programming-maintenance-strategy/)
