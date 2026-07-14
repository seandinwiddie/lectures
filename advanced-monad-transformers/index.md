---
title: "Advanced Monad Transformers"
description: "Combine environment, asynchrony, absence, and typed failure without fake generic abstractions, then place effects at the correct RTK or engine boundary."
layout: lecture
---

# Advanced Monad Transformers

Real workflows often combine more than one context: a dependency environment, an asynchronous operation, and a recoverable domain failure. Monad transformers provide a principled way to stack those contexts.

In TypeScript and engine SDKs, an explicit composite type is often clearer than pretending the language supports a fully generic higher-kinded transformer interface.

## Learning Goals

By the end of this lecture, you should be able to:

- explain what a transformer adds to an existing carrier;
- implement lawful mapping and chaining for `Promise<Either<E, A>>`;
- add dependency injection with a Reader-style function;
- distinguish transport status, domain failure, and cancellation;
- audit callback-based async wrappers for missing runtime semantics; and
- choose RTK Query, a thunk, listener middleware, or a local effect type by responsibility.

## A Transformer Changes the Shape

`MaybeT<M, A>` conceptually wraps:

```text
M<Maybe<A>>
```

`EitherT<M, E, A>` conceptually wraps:

```text
M<Either<E, A>>
```

The transformer supplies `map`, `chain`, and lifting rules for the combined shape. A class with an unconstrained generic `M` and calls to `M.map()` is not a valid TypeScript implementation; TypeScript cannot express that higher-kinded capability merely by naming a type parameter `M`.

Start with a concrete carrier whose operations are known.

## AsyncEither: Promise plus Typed Failure

Assume the plain tagged `Either` type from the previous lecture. The value is
serializable only when its `E` and `A` payloads are recursively serializable:

```ts
type Either<E, A> =
  | { readonly _tag: 'Left'; readonly error: E }
  | { readonly _tag: 'Right'; readonly value: A }

const left = <E, A>(error: E): Either<E, A> => ({ _tag: 'Left', error })
const right = <E, A>(value: A): Either<E, A> => ({ _tag: 'Right', value })

type AsyncEither<E, A> = Promise<Either<E, A>>

const tryPromise = async <E, A>(
  operation: () => Promise<A>,
  onRejected: (reason: unknown) => E,
): AsyncEither<E, A> => {
  try {
    return right<E, A>(await operation())
  } catch (reason) {
    return left<E, A>(onRejected(reason))
  }
}
```

The thunk lets `tryPromise` catch both a synchronous throw while starting the
operation and a later promise rejection. `onRejected` must be a total boundary
function that converts `unknown` into the feature's error algebra.

### Map the success branch

```ts
const mapAsyncEither = async <E, A, B>(
  operation: AsyncEither<E, A>,
  transform: (value: A) => B,
  onUnexpected: (reason: unknown) => E,
): AsyncEither<E, B> => {
  try {
    const result = await operation
    return result._tag === 'Right'
      ? right<E, B>(transform(result.value))
      : left<E, B>(result.error)
  } catch (reason) {
    return left<E, B>(onUnexpected(reason))
  }
}
```

### Chain another asynchronous failing operation

```ts
const chainAsyncEither = async <E, A, B>(
  operation: AsyncEither<E, A>,
  next: (value: A) => AsyncEither<E, B>,
  onUnexpected: (reason: unknown) => E,
): AsyncEither<E, B> => {
  try {
    const result = await operation
    return result._tag === 'Right'
      ? await next(result.value)
      : left<E, B>(result.error)
  } catch (reason) {
    return left<E, B>(onUnexpected(reason))
  }
}
```

The continuation never runs after `Left`. Rejections and thrown callbacks are
translated into the same error type rather than becoming an untyped second
failure channel. The ordinary map and monad laws still assume pure, total
callbacks; TypeScript cannot prove that requirement.

This corrects a common mistake:

```ts
// Wrong shape: bind expects Either, but the callback returns Promise<Either>.
// @ts-expect-error Async continuation has the wrong carrier.
eitherChain(result, async (value) => updateValue(value))

// Correct shape: chain the combined Promise<Either> carrier.
chainAsyncEither(Promise.resolve(result), updateValue, toWorkflowError)
```

## ReaderAsyncEither: Add Dependencies

A Reader is a function from an environment to a value. Combining it with `AsyncEither` gives:

```ts
type ReaderAsyncEither<Environment, Error, Value> = (
  environment: Environment,
) => AsyncEither<Error, Value>
```

```ts
const chainReaderAsyncEither = <Environment, Error, A, B>(
  operation: ReaderAsyncEither<Environment, Error, A>,
  next: (value: A) => ReaderAsyncEither<Environment, Error, B>,
  onUnexpected: (reason: unknown) => Error,
): ReaderAsyncEither<Environment, Error, B> =>
  async (environment) => {
    try {
      const result = await operation(environment)
      return result._tag === 'Right'
        ? await next(result.value)(environment)
        : left<Error, B>(result.error)
    } catch (reason) {
      return left<Error, B>(onUnexpected(reason))
    }
  }
```

The environment is supplied once at the edge and threaded through every step without importing a global singleton.

```ts
type User = {
  id: string
  displayName: string
}

type UserError =
  | { kind: 'not-found'; id: string }
  | { kind: 'update-rejected'; reason: string }
  | { kind: 'repository-failed'; message: string }

type Environment = {
  users: {
    findById(id: string): Promise<User | null>
    save(user: User): Promise<void>
  }
}

const findUser = (
  id: string,
): ReaderAsyncEither<Environment, UserError, User> =>
  async ({ users }) => {
    const loaded = await tryPromise<UserError, User | null>(
      () => users.findById(id),
      (reason) => ({
        kind: 'repository-failed',
        message: reason instanceof Error ? reason.message : String(reason),
      }),
    )

    if (loaded._tag === 'Left') return loaded

    return loaded.value
      ? right<UserError, User>(loaded.value)
      : left<UserError, User>({ kind: 'not-found', id })
  }
```

This is a practical ReaderT-like shape. It is explicit about the actual carriers and remains easy to test with a fake environment.

## Lift at Boundaries

Lifting moves a value from one context into the combined context.

```ts
const fromEither = async <E, A>(result: Either<E, A>): AsyncEither<E, A> =>
  result

const fromNullable = <E, A>(
  value: A | null | undefined,
  onNothing: () => E,
): Either<E, A> =>
  value == null ? left<E, A>(onNothing()) : right<E, A>(value)

const fromAsyncNullable = async <MissingError, RejectedError, A>(
  operation: () => Promise<A | null | undefined>,
  onNothing: () => MissingError,
  onRejected: (reason: unknown) => RejectedError,
): AsyncEither<MissingError | RejectedError, A> => {
  const loaded = await tryPromise<RejectedError, A | null | undefined>(
    operation,
    onRejected,
  )

  return loaded._tag === 'Left'
    ? left<MissingError | RejectedError, A>(loaded.error)
    : fromNullable<MissingError | RejectedError, A>(
        loaded.value,
        onNothing,
      )
}
```

`tryPromise` is the raw asynchronous lift: it requires an explicit translation
for rejection. `fromEither` cannot add a new failure, so it needs no mapper.
`fromAsyncNullable` then combines asynchrony, expected absence, and typed
failure without nesting `Promise<Maybe<Either<...>>>`. Be deliberate about
information loss. Lifting `null` into `Maybe` says the absence needs no
diagnostic. Lifting it into `Either` requires an error value and preserves the
reason.

## Separate Transport from Domain Failure

The production cores include `HttpResult` alongside generic `Either`. That separation is useful:

```ts
type HttpResult<A> =
  | { ok: true; status: number; data: A }
  | { ok: false; status: number; message: string }

type DomainError =
  | { kind: 'unauthorized' }
  | { kind: 'invalid-user'; reason: string }
```

Translate the transport result at the boundary:

```text
HTTP response -> decode -> Either<DomainError, DomainValue>
```

Do not let HTTP status codes become the domain's permanent error algebra. Conversely, do not discard useful transport details before logging or retry policy has consumed them.

## Concurrency Is Not Ordinary Chain

Sequential `chain` stops before starting the next effect after a failure. Concurrent work is different:

```ts
const results = await Promise.all(operations)
```

Every operation has already started, so finding the first `Left` in the result array cannot cancel the others. Specify:

- whether work is sequential or concurrent;
- whether failure is fail-fast or accumulated;
- whether in-flight work is cancelled;
- whether result order follows input order or completion order; and
- how many operations may run at once.

A type such as `AsyncEither` does not answer those policy questions by itself.

## Cancellation Belongs in the Effect Contract

```ts
type AbortableAsyncEither<E, A> = (
  signal: AbortSignal,
) => AsyncEither<E, A>
```

Propagate the signal through every nested operation. Decide whether cancellation becomes a typed `Left`, a rejected promise handled by infrastructure, or a separate state. Do not silently mix the policies across platforms.

RTK Query and `createAsyncThunk` already provide cancellation-related lifecycle behavior. Prefer those tools when the workflow belongs to Redux rather than rebuilding a private runtime.

## Audit a Callback-Based AsyncResult

The Rust, GDScript, and Unreal cores include promise-like `AsyncResult` values built from an executor plus success and error handlers. They are useful for understanding effect descriptions, but the abstraction is incomplete unless it specifies:

1. exactly-once settlement;
2. whether repeated `execute` calls rerun the executor;
3. exception-to-error conversion;
4. cancellation and timeout behavior;
5. handler registration after settlement;
6. scheduler and thread affinity;
7. re-entrancy and handler mutation during delivery; and
8. whether copied values share mutable state.

The examined implementations use shared callback state and explicit repeatable execution. They should not be described as equivalent to a JavaScript `Promise`, Rust `Future`, or thread-safe Unreal task without adding those semantics.

Constructing an effect description may be deterministic. Executing arbitrary callbacks is effectful.

## Choose the Application Tool First

| Job | Default tool |
| --- | --- |
| Reusable server documents, request deduplication, cache lifetime | RTK Query |
| One imperative sequence using `dispatch` or `getState` | `createAsyncThunk` or a thunk |
| Reaction to later actions or state transitions | Listener middleware |
| Synchronous absence | `Maybe` |
| Synchronous recoverable domain failure | `Either` |
| Local environment-dependent calculation | Reader-style function |
| Engine-owned scheduled world transition | ECS system boundary |

Do not wrap RTK Query's cache in a second `AsyncEither` store. Let RTK Query own its lifecycle and translate data or errors at the feature boundary when the domain needs a different representation.

## Test Combined Effects

Test more than the happy-path value:

- `map` never transforms `Left`;
- `chain` never starts the next operation after `Left`;
- the environment is threaded to every step;
- transport errors are translated once;
- cancellation reaches nested operations;
- concurrent policies match their documented ordering;
- effect interpreters execute at most as often as specified; and
- retries do not duplicate registered handlers or domain events.

Use fake environments and controlled promises. A deterministic test should decide exactly when every operation resolves.

## Exercise

Implement a profile update as `ReaderAsyncEither<Environment, ProfileError, Profile>`:

1. find the profile;
2. validate an update synchronously with `Either`;
3. save it through the injected repository;
4. translate transport failures to domain errors;
5. propagate an `AbortSignal`;
6. prove the save does not run after validation fails; and
7. explain whether the production application should keep this local abstraction or use an RTK Query mutation.

## Resources

- [Monads in Functional Programming](../monads-in-functional-programming/)
- [Functional Programming in Other Languages](../functional-programming-in-other-languages/)
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Listener Middleware](https://redux-toolkit.js.org/api/createListenerMiddleware)
