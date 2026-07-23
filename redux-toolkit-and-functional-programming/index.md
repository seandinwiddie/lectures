---
title: "Redux Toolkit and Functional Programming"
description: "Build a complete typed Redux Toolkit feature with event-oriented slices, selectors, hooks, React integration, async workflows, and tests."
layout: lecture
---

# Redux Toolkit and Functional Programming

Redux Toolkit keeps Redux's functional contract while removing handwritten boilerplate. This lecture builds one vertical feature from domain events through a typed React boundary, then introduces the RTK 2 tools used by larger applications.

## Learning Goals

By the end of this lecture, you should be able to:

- build an event-oriented slice with typed payloads and slice selectors;
- configure a store and infer its state and dispatch types;
- wire `<Provider>`, typed hooks, selectors, and React components;
- choose between RTK Query, thunks, and listener middleware;
- normalize a client-owned collection with `createEntityAdapter`; and
- recognize current RTK 2 patterns during migration.

## Organize by Feature

```text
src/
  app/
    store.ts
    hooks.ts
    createAppSlice.ts
  features/
    todos/
      todosSlice.ts
      TodoList.tsx
      todosSlice.test.ts
  main.tsx
```

Application wiring belongs in `app/`. Domain events, state transitions, selectors, UI, and tests stay with the feature that owns them.

## The One-Way Data-Flow Loop

Every feature in this lecture is one turn of the same loop. Hold it in mind as
you read the code:

```text
UI event  ->  dispatch(action)  ->  reducer  ->  new state  ->  selector  ->  render
   ^                                                                            |
   +----------------------------------------------------------------------------+
```

Each stage is a pure function of its input, and only the reducer changes state.
Two consequences drive every decision below:

- **Actions describe events, not setters.** `todoToggled({ id })` says *what
  happened*; the reducer decides the resulting state. A `setTodos(nextArray)`
  action pushes that decision into the UI and throws away the intent.
- **State holds facts; selectors derive views.** If a value can be computed from
  existing state, compute it in a selector instead of storing a second copy that
  can drift.

The reducer is the one place that combines current state with incoming data, so
if a transition depends on what is already in the store, dispatch the new data
and let the reducer own the merge — never merge in the component and dispatch the
result.

## Build a Typed Slice

```ts
// features/todos/todosSlice.ts
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

export type Todo = {
  id: string
  text: string
  completed: boolean
  ownerId: string
}

type TodosState = {
  items: Todo[]
  selectedId: string | null
}

const initialState: TodosState = {
  items: [],
  selectedId: null,
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(
      state,
      action: PayloadAction<Pick<Todo, 'id' | 'text' | 'ownerId'>>,
    ) {
      state.items.push({ ...action.payload, completed: false })
    },
    todoToggled(state, action: PayloadAction<{ id: string }>) {
      const todo = state.items.find((item) => item.id === action.payload.id)
      if (todo) todo.completed = !todo.completed
    },
    todoSelected(state, action: PayloadAction<{ id: string | null }>) {
      state.selectedId = action.payload.id
    },
  },
  selectors: {
    selectTodos: (state) => state.items,
    selectSelectedTodoId: (state) => state.selectedId,
  },
})

export const { todoAdded, todoSelected, todoToggled } = todosSlice.actions
export const { selectSelectedTodoId, selectTodos } = todosSlice.selectors

export const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter((todo) => todo.completed),
)
```

Immer makes mutation syntax safe inside slice reducers. The generated reducer still returns immutable state and must remain deterministic. Mutation syntax is not safe in components, selectors, thunks, or ordinary utility functions.

Slice selectors keep knowledge of the mounted state path close to the slice. Use an external selector factory when each consumer needs its own memoized selector with caller-specific arguments:

```ts
export const makeSelectTodosByOwner = () =>
  createSelector(
    [selectTodos, (_state, ownerId: string) => ownerId],
    (todos, ownerId) => todos.filter((todo) => todo.ownerId === ownerId),
  )
```

## Configure the Store and Typed Hooks

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { todosSlice } from '../features/todos/todosSlice'

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

```ts
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

Keep React components on context and typed hooks. Importing the store directly into a component bypasses the React-Redux subscription boundary.

## Provide the Store Once

```tsx
// main.tsx
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { TodoList } from './features/todos/TodoList'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <TodoList />
  </Provider>,
)
```

A module-level store is correct for a client-only SPA. In an SSR-heavy framework, create a store per request and keep that instance stable inside a client provider with `useState(makeStore)`.

## Complete the Render Boundary

```tsx
// features/todos/TodoList.tsx
import { selectTodos, todoToggled } from './todosSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export function TodoList() {
  const todos = useAppSelector(selectTodos)
  const dispatch = useAppDispatch()

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(todoToggled({ id: todo.id }))}
            />
            {todo.text}
          </label>
        </li>
      ))}
    </ul>
  )
}
```

The component selects only the value it renders and dispatches a domain event. The reducer owns the state transition, and the next selector result drives the next render.

## Choose the Async Tool by Responsibility

| Job | Default tool |
| --- | --- |
| Reusable server documents and cache lifecycles | RTK Query |
| One imperative workflow using `dispatch` or `getState` | `createAsyncThunk` or a thunk |
| Reaction to later actions or state changes | Listener middleware |

Do not teach a hand-written fetch thunk as the default server-data layer. RTK Query already owns request deduplication, subscriptions, cache lifetimes, and invalidation.

### Keep an Imperative Lifecycle with Its Slice

RTK 2 can define a slice-local async thunk through a customized slice creator:

```ts
// app/createAppSlice.ts
import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit'

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})
```

```ts
// features/exports/exportsSlice.ts
import { createAppSlice } from '../../app/createAppSlice'
import { downloadReport } from './downloadReport'

type ExportRequest = {
  format: 'csv' | 'json'
  contents: string
}

type ExportState = {
  status: 'idle' | 'pending' | 'failed'
}

const initialState: ExportState = {
  status: 'idle',
}

export const exportsSlice = createAppSlice({
  name: 'exports',
  initialState,
  reducers: (create) => ({
    reportExportRequested: create.asyncThunk(
      async (request: ExportRequest) => downloadReport(request),
      {
        pending: (state) => {
          state.status = 'pending'
        },
        fulfilled: (state) => {
          state.status = 'idle'
        },
        rejected: (state) => {
          state.status = 'failed'
        },
      },
    ),
  }),
})
```

This workflow represents an imperative browser export, not a reusable server cache. A normal `createAsyncThunk` remains valid when lifecycle handlers do not naturally belong inside one slice.

## Normalize Client-Owned Collections

Use `createEntityAdapter` when a slice owns a collection that benefits from normalized lookup and standard CRUD reducers:

```ts
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

type Book = {
  bookId: string
  title: string
}

const booksAdapter = createEntityAdapter<Book, string>({
  selectId: (book) => book.bookId,
})

export const booksSlice = createSlice({
  name: 'books',
  initialState: booksAdapter.getInitialState(),
  reducers: {
    booksReceived: booksAdapter.setAll,
    bookUpdated: booksAdapter.updateOne,
  },
})

type BooksState = ReturnType<typeof booksSlice.reducer>
type BooksRootState = { books: BooksState }

export const booksSelectors = booksAdapter.getSelectors(
  (state: BooksRootState) => state.books,
)
```

Adapters assume `entity.id` unless `selectId` says otherwise. Do not normalize RTK Query responses merely by habit: RTK Query is a document cache, and a normalized graph should be an explicit requirement.

## Inject a Lazy Feature Safely

```ts
// app/rootReducer.ts
import { combineSlices } from '@reduxjs/toolkit'
import { todosSlice } from '../features/todos/todosSlice'

export interface LazyLoadedSlices {}

export const rootReducer = combineSlices(todosSlice)
  .withLazyLoadedSlices<LazyLoadedSlices>()
```

```ts
// features/books/booksSlice.ts
import type { WithSlice } from '@reduxjs/toolkit'
import { rootReducer } from '../../app/rootReducer'
import { booksSlice } from './booksSliceDefinition'

declare module '../../app/rootReducer' {
  export interface LazyLoadedSlices extends WithSlice<typeof booksSlice> {}
}

export const injectedBooksSlice = booksSlice.injectInto(rootReducer)
```

`withLazyLoadedSlices` keeps `RootState` aware of future features. `injectInto` returns a slice whose selectors know the injected location.

## Test Transitions and Derivations

```ts
import {
  selectCompletedTodos,
  todoAdded,
  todoToggled,
  todosSlice,
} from './todosSlice'

it('adds and completes a todo through events', () => {
  const added = todosSlice.reducer(
    undefined,
    todoAdded({ id: 't1', text: 'Learn RTK', ownerId: 'u1' }),
  )

  const completed = todosSlice.reducer(added, todoToggled({ id: 't1' }))

  expect(added.items[0].completed).toBe(false)
  expect(completed.items[0].completed).toBe(true)
  expect(selectCompletedTodos({ todos: completed })).toHaveLength(1)
})
```

The assertion against `added` also proves that Immer did not mutate the previous state. Selector tests verify the public read model independently of React.

## Migrate Forward to RTK 2

Modernization can be incremental, but each touched feature should move forward:

1. replace `createStore` with `configureStore` first;
2. migrate touched switch reducers to `createSlice`;
3. replace touched `connect` wrappers with typed hooks;
4. move reusable server data to RTK Query; and
5. use the official RTK codemods for mechanical builder updates, then review the result.

RTK 2 removed several older configuration forms:

```ts
// Wrong in RTK 2
configureStore({ reducer, middleware: [logger] })

// Current form
configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
})
```

Use the builder callback for `extraReducers`; the object form is no longer supported. Avoid compatibility shims that preserve obsolete imports when callers can move directly to the new source of truth.

## Common Mistakes

These are the recurring errors this feature's structure is designed to prevent.
Each pairs the wrong shape with the current one.

### Mutating selected state outside a reducer

```ts
// Wrong — objects read from the store are still store state.
const todo = selectSelectedTodo(store.getState())
if (todo) todo.completed = true

// Correct — dispatch an event; the reducer owns the transition.
store.dispatch(todoToggled({ id: 't1' }))
```

Immer's mutation syntax is safe *only* inside slice reducers. Mutating a selected
object anywhere else breaks immutability and the assumptions React-Redux makes
about when to re-render.

Source: Redux style guide; RTK `immer-reducers`

### Setter-style actions instead of event-style actions

```ts
// Wrong — the component computed the next state and the action just carries it.
const next = [...selectTodos(store.getState()), newTodo]
store.dispatch(setTodos(next))

// Correct — describe the event; the reducer computes the next state.
store.dispatch(todoAdded({ id, text, ownerId }))
```

Event actions record intent and keep the transition testable in one place.
Setter actions scatter that logic across every caller.

Source: Redux style guide (model actions as events)

### Reading the store directly in a component

```tsx
// Wrong — bypasses the subscription boundary; the component will not re-render.
import { store } from '../../app/store'
const todos = store.getState().todos.items

// Correct — subscribe through the typed hook.
const todos = useAppSelector(selectTodos)
```

Direct store access is an escape hatch for non-React integrations, not the UI
default.

Source: Redux style guide; RTK `migrating-to-modern-redux`

### Storing derived values in state

```ts
// Wrong — completedTodos drifts the moment items changes.
type TodosState = { items: Todo[]; completedTodos: Todo[] }

// Correct — keep the raw facts; derive the view with a memoized selector.
export const selectCompletedTodos = createSelector([selectTodos], (todos) =>
  todos.filter((todo) => todo.completed))
```

Derived state is a second source of truth that will eventually disagree with the
first.

Source: Redux style guide (keep state minimal, derive the rest)

### `connect` and `createStore` in new code

```ts
// Wrong — legacy wiring; throws away RTK's defaults and typing ergonomics.
export default connect(mapState, mapDispatch)(TodoList)
export const store = createStore(rootReducer, applyMiddleware(thunk))

// Correct — hooks + configureStore are the RTK 2 baseline.
export const store = configureStore({ reducer: { todos: todosSlice.reducer } })
// ...and read/write through useAppSelector / useAppDispatch.
```

`connect` and manual `createStore` still run, but they are migration history, not
the baseline for new features.

Source: RTK `migrating-to-modern-redux`

## Exercise

Extend the todo feature so that it:

1. keeps an edit draft local until submit;
2. dispatches past-tense domain events;
3. derives completed and owner-filtered views with selectors;
4. uses an entity adapter after the collection justifies normalized lookup;
5. exports a report through an imperative async workflow; and
6. tests reducer invariants and selector outputs.

Then continue to RTK Query for server-owned todo documents.

## Resources

- [Redux Toolkit TypeScript Quick Start](https://redux-toolkit.js.org/tutorials/typescript)
- [Writing Reducers with Immer](https://redux-toolkit.js.org/usage/immer-reducers)
- [createSlice](https://redux-toolkit.js.org/api/createSlice)
- [createEntityAdapter](https://redux-toolkit.js.org/api/createEntityAdapter)
- [Migrating to Modern Redux](https://redux-toolkit.js.org/usage/migrating-to-modern-redux)
- [Redux Toolkit and RTK Query Best Practices](../redux-toolkit-and-rtk-query-best-practices/)
