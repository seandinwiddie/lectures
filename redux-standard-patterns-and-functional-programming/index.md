---
title: "Redux Standard Patterns and Functional Programming"
description: "Trace Redux's event, reducer, selector, and render dataflow, then connect those foundations to modern Redux Toolkit patterns."
layout: lecture
---

# Redux Standard Patterns and Functional Programming

Redux applies functional programming to state transitions: events are plain data, reducers calculate the next state, and selectors derive the view. Redux Toolkit (RTK) is the standard way to write that model in modern applications.

## Learning Goals

By the end of this lecture, you should be able to:

- trace an event through dispatch, a reducer, a selector, and a render;
- design event-oriented actions instead of generic setters;
- keep state transitions inside reducers and derived values inside selectors;
- identify which state belongs to React, the router, Redux, or RTK Query; and
- debug the dataflow in a repeatable order.

## The One-Way Dataflow

```text
User or external system
        |
        v
dispatch(domainEvent(payload))
        |
        v
reducer(previousState, event) -> nextState
        |
        v
selector(nextState) -> view data
        |
        v
React renders and emits the next event
```

Every arrow has one responsibility. Events describe what happened. Reducers own legal transitions. Selectors translate authoritative state into the shape a consumer needs.

## Model Events and Transitions with a Slice

```ts
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

type Todo = {
  id: string
  text: string
  completed: boolean
}

type TodosState = {
  items: Todo[]
  visibility: 'all' | 'active' | 'completed'
}

const initialState: TodosState = {
  items: [],
  visibility: 'all',
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action: PayloadAction<Pick<Todo, 'id' | 'text'>>) {
      state.items.push({ ...action.payload, completed: false })
    },
    todoToggled(state, action: PayloadAction<{ id: string }>) {
      const todo = state.items.find((item) => item.id === action.payload.id)
      if (todo) todo.completed = !todo.completed
    },
    visibilityChanged(
      state,
      action: PayloadAction<TodosState['visibility']>,
    ) {
      state.visibility = action.payload
    },
    todosReceived(state, action: PayloadAction<Todo[]>) {
      for (const incoming of action.payload) {
        const current = state.items.find((item) => item.id === incoming.id)
        if (current) Object.assign(current, incoming)
        else state.items.push(incoming)
      }
    },
  },
  selectors: {
    selectTodos: (state) => state.items,
    selectVisibility: (state) => state.visibility,
  },
})

export const {
  todoAdded,
  todoToggled,
  todosReceived,
  visibilityChanged,
} = todosSlice.actions

export const { selectTodos, selectVisibility } = todosSlice.selectors

export const selectVisibleTodos = createSelector(
  [selectTodos, selectVisibility],
  (todos, visibility) => {
    if (visibility === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (visibility === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  },
)
```

The action names are events: a todo was added, a todo was toggled, or a visibility preference changed. Compare that with vague commands such as `setData` or `updateState`, which hide the domain meaning.

`todosReceived` also demonstrates reducer ownership. A caller dispatches only the new outside data. The reducer combines that payload with the current store state and preserves the collection invariant.

## Understand the Immer Boundary

The case reducers above appear to mutate `state`. They are safe because `createSlice` runs them against an Immer draft and returns an immutable next state.

Mutation syntax is not safe everywhere:

```ts
const selectedTodo = selectTodos(store.getState())[0]

// Wrong: selectedTodo is still Redux state.
selectedTodo.completed = true

// Correct: describe the event and let the reducer transition the state.
store.dispatch(todoToggled({ id: selectedTodo.id }))
```

Reducers remain deterministic and effect-free. Network requests, storage writes, timers, random IDs, and current timestamps belong outside reducers. Generate those values before dispatch or coordinate them with RTK Query, a thunk, or listener middleware.

## Compose the Store

```ts
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

`configureStore` composes reducers and includes the recommended middleware and development checks. A handwritten `createStore`, `combineReducers`, and middleware stack is useful history, not the baseline for new code.

## Select Close to the Render

```tsx
import { todoToggled, selectVisibleTodos } from './todosSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export function TodoList() {
  const todos = useAppSelector(selectVisibleTodos)
  const dispatch = useAppDispatch()

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <button onClick={() => dispatch(todoToggled({ id: todo.id }))}>
            {todo.completed ? 'Reopen' : 'Complete'} {todo.text}
          </button>
        </li>
      ))}
    </ul>
  )
}
```

Components subscribe to the smallest values they render. Do not import the store directly into React components, select an entire slice in a distant parent, or store `visibleTodos` as a second source of truth.

## Choose the State Owner First

| State | Default owner |
| --- | --- |
| Unsaved input draft or open disclosure | React component |
| Path, route parameter, or search parameter | Router |
| Shared client state with meaningful transitions | Redux slice |
| Reusable request/response data | RTK Query |
| Count, filtered list, or other calculated value | Selector |
| ECS world, storage, or browser API | That external authority |

If visibility is represented in the URL, the router should own it and pass it to a selector as an argument. The slice field in this lecture represents a shared client preference that is not encoded in the URL.

An ECS world is also its own authority. Publish domain events or selected projections when the application needs them; do not mirror every ECS component into Redux.

## Debug in Dataflow Order

When the UI is wrong, inspect the boundaries in this order:

1. Was the intended action dispatched with the expected payload?
2. Did the reducer accept that event from the current state?
3. Does the selector return the expected value?
4. Is the component subscribed to that selector result?
5. Did an effect, query, or external authority produce a later event?

Redux DevTools is most useful when actions describe real events. The log becomes a domain history instead of a stream of anonymous setters.

## Historical Pattern versus Modern Default

| Concern | Historical teaching form | Modern default |
| --- | --- | --- |
| Store | `createStore` plus manual middleware | `configureStore` |
| Reducer | handwritten `switch` | `createSlice` |
| Action creator | handwritten object factory | generated slice action |
| React binding | `connect` wrappers | typed hooks |
| Server cache | thunk plus loading flags | RTK Query |

A legacy reducer can run inside `configureStore`, so migration can start at the store and proceed feature by feature. New work should not add more legacy boilerplate.

## Exercise

Build a notification feature that:

1. dispatches `notificationReceived` and `notificationRead` events;
2. keeps the unread count derived in a selector;
3. lets the reducer merge repeated notifications by ID;
4. renders through typed hooks; and
5. uses Redux DevTools to explain one complete event-to-render cycle.

## Resources

- [Redux Fundamentals: State, Actions, and Reducers](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Redux Toolkit Quick Start](https://redux-toolkit.js.org/tutorials/quick-start)
- [Redux Toolkit and Functional Programming](../redux-toolkit-and-functional-programming/)
