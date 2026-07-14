---
title: "Practical Applications of Functional Programming"
description: "Apply functional cores, explicit decoding, modern Redux Toolkit, property tests, memoization, and immutable configuration in production TypeScript."
layout: lecture
---

# Practical Applications of Functional Programming

Functional programming is most useful when it gives ordinary application code
clear boundaries. Pure functions transform trusted values. Small adapters own
network, storage, clock, and engine effects. The boundary between them validates
untrusted data instead of pretending that a type annotation changed runtime
input.

## Learning Goals

By the end of this lecture, you should be able to:

- separate a functional core from an imperative shell;
- assign local, server, shared client, and simulation state to the right owner;
- decode `unknown` data before feature code uses it;
- model recoverable failure with serializable tagged data;
- test laws and postconditions of pure functions; and
- state the policies that make memoization, laziness, and configuration safe.

## Start with Ownership and Boundaries

A practical application commonly contains this flow:

```text
external input -> effectful adapter -> decoder -> pure domain transformation
                                      |
                                      +-> explicit error value

pure result -> RTK event, RTK Query cache, ECS command, UI, or output adapter
```

Keep the functional layer independent of the systems that consume it:

```text
        functional core
         /          \
Redux Toolkit      ECS
client workflow    frame simulation
```

The functional core may define parsers, validators, predicates, and
transformations. Redux Toolkit and ECS may call those functions. The core
should not import a store, reducer, world, entity, component, or system.

Choose an owner before choosing an abstraction:

| Kind of state | Normal owner |
| --- | --- |
| One component's open panel | React component state |
| Shareable navigation or filters | URL or router |
| Server-owned documents and request status | RTK Query |
| Shared durable client workflow | Redux Toolkit slice |
| High-frequency spatial or simulation data | ECS world |
| Intermediate values inside a transformation | Local function scope |

## Represent Expected Failure as Plain Data

The examples in this lecture share a small `Either` representation. It uses no
custom class instance or function-valued methods, so it remains suitable for
Redux state or actions when its error and success values are recursively plain
serializable data.

```ts
export type Either<E, T> =
  | { readonly _tag: 'Left'; readonly error: E }
  | { readonly _tag: 'Right'; readonly value: T }

export const left = <E>(error: E): Either<E, never> => ({
  _tag: 'Left',
  error,
})

export const right = <T>(value: T): Either<never, T> => ({
  _tag: 'Right',
  value,
})

export interface User {
  readonly id: string
  readonly name: string
  readonly email: string
}

export type DecodeError = {
  readonly kind: 'decode'
  readonly message: string
}

export const decodeUser = (input: unknown): Either<DecodeError, User> => {
  if (typeof input !== 'object' || input === null) {
    return left({ kind: 'decode', message: 'Expected a user object' })
  }

  if (
    !('id' in input) ||
    typeof input.id !== 'string' ||
    !('name' in input) ||
    typeof input.name !== 'string' ||
    !('email' in input) ||
    typeof input.email !== 'string'
  ) {
    return left({
      kind: 'decode',
      message: 'Expected string id, name, and email fields',
    })
  }

  return right({ id: input.id, name: input.name, email: input.email })
}

export const decodeUsers = (
  input: unknown,
): Either<DecodeError, readonly User[]> => {
  if (!Array.isArray(input)) {
    return left({ kind: 'decode', message: 'Expected an array of users' })
  }

  const users: User[] = []

  for (const [index, value] of input.entries()) {
    const decoded = decodeUser(value)

    if (decoded._tag === 'Left') {
      return left({
        kind: 'decode',
        message: `users[${index}]: ${decoded.error.message}`,
      })
    }

    users.push(decoded.value)
  }

  return right(users)
}
```

A TypeScript generic describes a compile-time contract. Only a decoder checks
whether an HTTP response, saved file, message, or engine payload satisfies that
contract at runtime.

## Web Development

### React and RTK Query

React components describe UI from props, state, and context. Keep a
presentational component unaware of data fetching. Use RTK Query as the default
owner for server data, and ensure its endpoint validates the response before a
component receives `User`.

```tsx
import { useGetUserQuery } from '../services/api'
import type { User } from '../domain/user'

export const UserCard = ({ user }: { user: User }) => (
  <article className="user-card">
    <h3>{user.name}</h3>
    <p>{user.email}</p>
  </article>
)

export const UserPanel = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, isError } = useGetUserQuery(userId)

  if (isLoading) return <p>Loading…</p>
  if (isError || user === undefined) {
    return <p>Unable to load this user.</p>
  }

  return <UserCard user={user} />
}
```

For one backend, prefer one `createApi` root and split feature endpoints with
`injectEndpoints`. Register both the API reducer and middleware. Use tags for
normal invalidation and keep optimistic cache patches in endpoint lifecycle
handlers, where rollback remains coupled to the request.

Do not copy query results and loading flags into an ordinary slice. That creates
two authorities for the same server document.

### Shared Client State with Redux Toolkit

Redux Toolkit slices are appropriate for shared, durable client state. Actions
should describe events. Reducers own transitions from current state plus event
data, and selectors derive views instead of storing duplicate values.

```ts
import {
  configureStore,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../services/api'

interface Todo {
  readonly id: string
  readonly title: string
  readonly completed: boolean
}

interface TodoState {
  readonly items: readonly Todo[]
}

const initialState: TodoState = { items: [] }

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(
      state,
      action: PayloadAction<{ readonly id: string; readonly title: string }>,
    ) {
      state.items.push({ ...action.payload, completed: false })
    },
    todoToggled(state, action: PayloadAction<{ readonly id: string }>) {
      const todo = state.items.find((item) => item.id === action.payload.id)
      if (todo) todo.completed = !todo.completed
    },
  },
})

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

const selectTodos = (state: RootState) => state.todos.items

export const selectCompletedCount = createSelector(
  [selectTodos],
  (todos) => todos.filter((todo) => todo.completed).length,
)

export const { todoAdded, todoToggled } = todosSlice.actions
```

Immer lets a slice reducer use mutation syntax while producing immutable state.
That does not make effects legal in a reducer: no HTTP calls, clocks, random ID
generation, logging, or mutation of values outside the draft.

Keep Redux actions and state as plain serializable data. A tagged `Either` value
can cross that boundary if both branches contain serializable data. An object
whose `.map()` method is a function cannot.

## Data Processing

### A Pure ETL Core

A CSV library might produce string-valued rows. Once that adapter has done I/O,
the domain can validate and transform each row with a pure function.

```ts
type CsvRow = Readonly<Record<string, string | undefined>>

interface ProcessedData {
  readonly id: number
  readonly name: string
  readonly value: number
  readonly timestamp: string
}

type RowError = {
  readonly kind: 'invalid-row'
  readonly message: string
}

const processRow = (row: CsvRow): Either<RowError, ProcessedData> => {
  const idText = row.id?.trim()
  const name = row.name?.trim()
  const valueText = row.value?.trim()
  const timestamp = row.timestamp?.trim()

  if (!idText || !name || !valueText || !timestamp) {
    return left({ kind: 'invalid-row', message: 'Missing a required field' })
  }

  if (!/^-?\d+$/.test(idText)) {
    return left({ kind: 'invalid-row', message: `Invalid id: ${idText}` })
  }

  const id = Number(idText)
  const value = Number(valueText)
  const milliseconds = Date.parse(timestamp)

  if (!Number.isSafeInteger(id)) {
    return left({ kind: 'invalid-row', message: `Unsafe id: ${idText}` })
  }

  if (!Number.isFinite(value)) {
    return left({ kind: 'invalid-row', message: `Invalid value: ${valueText}` })
  }

  if (Number.isNaN(milliseconds)) {
    return left({ kind: 'invalid-row', message: `Invalid date: ${timestamp}` })
  }

  return right({
    id,
    name,
    value,
    timestamp: new Date(milliseconds).toISOString(),
  })
}

interface RejectedRow {
  readonly row: CsvRow
  readonly error: RowError
}

interface BatchResult {
  readonly accepted: readonly ProcessedData[]
  readonly rejected: readonly RejectedRow[]
}

const processBatch = (rows: readonly CsvRow[]): BatchResult => {
  const accepted: ProcessedData[] = []
  const rejected: RejectedRow[] = []

  for (const row of rows) {
    const result = processRow(row)

    if (result._tag === 'Right') {
      accepted.push(result.value)
    } else {
      rejected.push({ row, error: result.error })
    }
  }

  return { accepted, rejected }
}
```

This batch deliberately accumulates rejected rows. A command-validation
pipeline might instead return the first `Left`. Neither behavior is universally
correct; collection versus fail-fast is part of the contract. Its local arrays
never escape until the final return, so this implementation stays observable as
a pure function without repeatedly copying a growing batch.

Reading the CSV and writing accepted records remain effects:

```ts
interface ImportPorts {
  readRows: () => Promise<readonly CsvRow[]>
  writeRows: (rows: readonly ProcessedData[]) => Promise<void>
}

const runImport = async (
  ports: ImportPorts,
): Promise<readonly RejectedRow[]> => {
  const rows = await ports.readRows()
  const batch = processBatch(rows)
  await ports.writeRows(batch.accepted)
  return batch.rejected
}
```

This is a functional core inside an imperative shell. Tests for `processRow`
need no database mock; integration tests for `runImport` can supply small port
implementations.

### An API Client That Decodes `unknown`

If an application does not use RTK Query for a request, the same boundary rule
still applies. Pass a decoder to the effectful client instead of writing
`request<User>()`, which would only assert an expectation.

```ts
type ApiError =
  | { readonly kind: 'network'; readonly message: string }
  | { readonly kind: 'http'; readonly status: number; readonly message: string }
  | { readonly kind: 'decode'; readonly message: string }

type Decoder<T> = (input: unknown) => Either<DecodeError, T>

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Unknown failure'

class ApiClient {
  private async request<T>(
    url: string,
    decode: Decoder<T>,
    options?: RequestInit,
  ): Promise<Either<ApiError, T>> {
    let response: Response

    try {
      response = await fetch(url, options)
    } catch (error: unknown) {
      return left({ kind: 'network', message: errorMessage(error) })
    }

    if (!response.ok) {
      return left({
        kind: 'http',
        status: response.status,
        message: response.statusText,
      })
    }

    let payload: unknown

    try {
      payload = await response.json()
    } catch (error: unknown) {
      return left({
        kind: 'decode',
        message: `Invalid JSON: ${errorMessage(error)}`,
      })
    }

    const decoded = decode(payload)
    return decoded._tag === 'Right'
      ? right(decoded.value)
      : left({ kind: 'decode', message: decoded.error.message })
  }

  getUsers(): Promise<Either<ApiError, readonly User[]>> {
    return this.request('/api/users', decodeUsers)
  }

  createUser(user: Omit<User, 'id'>): Promise<Either<ApiError, User>> {
    return this.request('/api/users', decodeUser, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
  }
}
```

This client distinguishes transport, HTTP, and decoding failures. Domain rules
can add another error vocabulary after decoding instead of collapsing every
failure into one string.

## Test Laws and Boundaries

Pure functions support example tests and broader properties. State the input
domain so the property is actually true; JavaScript number arithmetic is not
mathematical real-number arithmetic.

```ts
import * as fc from 'fast-check'
import { describe, expect, it } from 'vitest'

const normalizeName = (value: string): string =>
  value.trim().replace(/\s+/gu, ' ')

describe('functional core', () => {
  it('normalizes names idempotently', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const once = normalizeName(value)
        return normalizeName(once) === once
      }),
    )
  })

  it('rejects malformed users at the boundary', () => {
    expect(decodeUser({ id: 'u1', name: 'Ada' })).toEqual({
      _tag: 'Left',
      error: {
        kind: 'decode',
        message: 'Expected string id, name, and email fields',
      },
    })
  })

  it('parses a valid CSV row', () => {
    expect(
      processRow({
        id: '7',
        name: 'Ada',
        value: '2.5',
        timestamp: '2026-01-02T00:00:00.000Z',
      }),
    ).toEqual(
      right({
        id: 7,
        name: 'Ada',
        value: 2.5,
        timestamp: '2026-01-02T00:00:00.000Z',
      }),
    )
  })
})
```

Test both branches of a decoder, reducer, or tagged value. Avoid extracting a
success with a fake `null` default or a non-null assertion; branch on the tag so
TypeScript and the test both prove which value exists.

## Performance Policies

### Memoize Only Pure Work

Memoization is sound when output depends only on the key and retained entries
remain valid. Wrapping the cached value avoids a non-null assertion and still
supports functions whose result is `undefined`.

```ts
const memoize = <A, R>(transform: (argument: A) => R) => {
  const cache = new Map<A, { readonly value: R }>()

  return (argument: A): R => {
    const cached = cache.get(argument)
    if (cached) return cached.value

    const entry = { value: transform(argument) }
    cache.set(argument, entry)
    return entry.value
  }
}

const cube = memoize((value: number) => value * value * value)

cube(5) // computes 125
cube(5) // reuses 125
```

This cache is intentionally simple, not universally safe:

- `Map` compares object keys by identity, not structural value;
- mutable arguments can make a retained result stale;
- entries have no size, lifetime, or eviction policy; and
- an effect such as `fetch()` must not be disguised as a pure calculation.

Use `createSelector` for derived Redux views. Use RTK Query for server request
deduplication, subscription lifetimes, errors, and invalidation. Use a bounded
cache with an explicit key and eviction policy for general application work.

### Lazy Values Hide a Small Effect

A memoized lazy value defers a synchronous computation and runs it at most once
after a successful evaluation.

```ts
class Lazy<T> {
  private state:
    | { status: 'pending'; evaluate: () => T }
    | { status: 'ready'; value: T }

  private constructor(evaluate: () => T) {
    this.state = { status: 'pending', evaluate }
  }

  static of<T>(value: T): Lazy<T> {
    return new Lazy(() => value)
  }

  static from<T>(evaluate: () => T): Lazy<T> {
    return new Lazy(evaluate)
  }

  map<U>(transform: (value: T) => U): Lazy<U> {
    return Lazy.from(() => transform(this.get()))
  }

  get(): T {
    if (this.state.status === 'pending') {
      const value = this.state.evaluate()
      this.state = { status: 'ready', value }
      return value
    }

    return this.state.value
  }
}

const answer = Lazy.from(() => 21).map((value) => value * 2)
answer.get() // 42
answer.get() // the cached 42
```

The state transition inside `get()` is an effect hidden behind the abstraction.
This version is synchronous, retries if evaluation throws, has no cancellation,
and makes no cross-thread guarantee. An asynchronous workflow needs a real
Promise, task, or runtime policy rather than a renamed callback registry.

## Immutable Configuration

Configuration builders are useful when defaults and override precedence are
explicit. `Partial<Config>` is not enough for nested overrides because it still
requires a complete `features` object, so define the boundary shape directly.

```ts
interface Config {
  readonly apiUrl: string
  readonly timeout: number
  readonly retries: number
  readonly features: {
    readonly caching: boolean
    readonly logging: boolean
  }
}

type ConfigOverrides = Partial<Omit<Config, 'features'>> & {
  readonly features?: Partial<Config['features']>
}

const createConfig = (overrides: ConfigOverrides = {}): Config => {
  const { features, ...topLevel } = overrides

  return Object.freeze({
    apiUrl: 'https://api.example.com',
    timeout: 5_000,
    retries: 3,
    ...topLevel,
    features: Object.freeze({
      caching: true,
      logging: false,
      ...features,
    }),
  })
}

const development = createConfig({
  apiUrl: 'https://dev-api.example.com',
  features: { logging: true },
})

const production = createConfig({ timeout: 10_000, retries: 5 })
```

The ordering is intentional: caller overrides win over defaults, and nested
feature overrides win only inside `features`. `readonly` protects TypeScript
callers; `Object.freeze` also protects these two object levels at runtime.

## Exercise

Build an import workflow that reads CSV rows, decodes and validates them with a
pure core, and writes accepted records through an effectful port. Then expose
the latest import summary as shared client state with an event-style RTK action.
Keep raw server documents in RTK Query and high-frequency progress particles in
an ECS world. Test the core separately from the adapters.

## Resources

- [Redux Style Guide](https://redux.js.org/style-guide/)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [Property-Based Testing with fast-check](https://fast-check.dev/docs/introduction/getting-started/)
