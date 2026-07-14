---
title: "Monads in Functional Programming"
description: "Model expected absence and recoverable failure with lawful, serializable Maybe and Either values derived from production functional cores."
layout: lecture
---

# Monads in Functional Programming

`Maybe` and `Either` make control flow explicit in data. Their value is not the vocabulary alone; it is the guarantee that mapping, chaining, and matching behave consistently across every branch.

This lecture uses the shared contract implemented by the ForbocAI Rust, TypeScript, GDScript, and Unreal C++ functional cores.

## Learning Goals

By the end of this lecture, you should be able to:

- choose between absence, recoverable failure, and a broken invariant;
- implement `map`, `chain`, and exhaustive `match` over tagged data;
- state and test the functor and monad laws;
- traverse collections without sentinel values; and
- keep rich functional helpers out of serializable Redux state.

## Three Failure Classes

| Situation | Representation | Example |
| --- | --- | --- |
| Expected absence with no diagnostic | `Maybe<T>` | An optional target is not selected. |
| Recoverable failure with useful context | `Either<E, T>` | A command fails domain validation. |
| Broken programmer invariant | assertion or exception at a boundary | Required configuration was never installed. |

Do not turn every error into `Nothing`; that discards information. Do not throw for ordinary domain outcomes; that hides a branch from the type.

## Model Maybe as Plain Tagged Data

```ts
export type Maybe<T> =
  | { readonly _tag: 'Just'; readonly value: T }
  | { readonly _tag: 'Nothing' }

export const just = <T>(value: T): Maybe<T> => ({
  _tag: 'Just',
  value,
})

export const nothing = <T>(): Maybe<T> => ({
  _tag: 'Nothing',
})

export const maybeMap = <A, B>(
  value: Maybe<A>,
  transform: (value: A) => B,
): Maybe<B> =>
  value._tag === 'Just' ? just(transform(value.value)) : nothing<B>()

export const maybeChain = <A, B>(
  value: Maybe<A>,
  next: (value: A) => Maybe<B>,
): Maybe<B> =>
  value._tag === 'Just' ? next(value.value) : nothing<B>()

export const maybeMatch = <A, R>(
  value: Maybe<A>,
  cases: {
    just: (value: A) => R
    nothing: () => R
  },
): R =>
  value._tag === 'Just' ? cases.just(value.value) : cases.nothing()
```

The tagged union is serializable only when `T` is recursively serializable; the
same rule applies to both `E` and `T` in `Either<E, T>`. A production TypeScript
core may wrap the same behavior in factory objects with `.map()`, `.chain()`,
and `.match()` methods, but those function-valued wrappers should remain
ephemeral rather than enter Redux state or actions.

### Map versus chain

Use `map` when the next step cannot add absence:

```ts
const displayName = maybeMap(selectedUser, (user) => user.name.trim())
```

Use `chain` when the next step already returns `Maybe`:

```ts
const safeDivide = (numerator: number, denominator: number): Maybe<number> =>
  denominator === 0 ? nothing<number>() : just(numerator / denominator)

const result = maybeChain(just(10), (value) => safeDivide(value, 2))
```

Using `map` for `safeDivide` would produce `Maybe<Maybe<number>>`. `chain` flattens that repeated context by one level.

### Collapse at a boundary

```ts
const label = maybeMatch(result, {
  just: (value) => `Result: ${value}`,
  nothing: () => 'No result',
})
```

Keep transformations inside the context. Collapse with `match` when a UI, protocol, log, or other boundary needs a concrete output.

## Model Recoverable Failure with Either

```ts
export type Either<E, T> =
  | { readonly _tag: 'Left'; readonly error: E }
  | { readonly _tag: 'Right'; readonly value: T }

export const left = <E, T>(error: E): Either<E, T> => ({
  _tag: 'Left',
  error,
})

export const right = <E, T>(value: T): Either<E, T> => ({
  _tag: 'Right',
  value,
})

export const eitherMap = <E, A, B>(
  result: Either<E, A>,
  transform: (value: A) => B,
): Either<E, B> =>
  result._tag === 'Right'
    ? right<E, B>(transform(result.value))
    : left<E, B>(result.error)

export const eitherMapLeft = <E, F, T>(
  result: Either<E, T>,
  transformError: (error: E) => F,
): Either<F, T> =>
  result._tag === 'Left'
    ? left<F, T>(transformError(result.error))
    : right<F, T>(result.value)

export const eitherChain = <E, A, B>(
  result: Either<E, A>,
  next: (value: A) => Either<E, B>,
): Either<E, B> =>
  result._tag === 'Right' ? next(result.value) : left<E, B>(result.error)
```

`eitherMapLeft` is a boundary tool. It can translate a parser error, engine error, or transport error into the domain's error vocabulary before feature logic sees it.

```ts
type ParseError = { kind: 'invalid-number'; input: string }

const parseInteger = (input: string): Either<ParseError, number> => {
  const value = Number.parseInt(input, 10)
  return Number.isNaN(value)
    ? left({ kind: 'invalid-number', input })
    : right(value)
}

const doubled = eitherMap(parseInteger('21'), (value) => value * 2)
```

## Laws Make Refactoring Safe

An implementation is not lawful because its methods have familiar names. Test the equations.

### Functor identity

```text
map(value, identity) == value
```

### Functor composition

```text
map(value, x => g(f(x))) == map(map(value, f), g)
```

### Monad left identity

```text
chain(just(x), f) == f(x)
```

### Monad right identity

```text
chain(value, just) == value
```

### Monad associativity

```text
chain(chain(value, f), g)
==
chain(value, x => chain(f(x), g))
```

Use branch-aware equality in tests instead of extracting with a fake `null` default:

```ts
const maybeEquals = <T>(
  leftValue: Maybe<T>,
  rightValue: Maybe<T>,
  equals: (left: T, right: T) => boolean = Object.is,
): boolean => {
  if (leftValue._tag === 'Nothing') return rightValue._tag === 'Nothing'
  if (rightValue._tag === 'Nothing') return false
  return equals(leftValue.value, rightValue.value)
}

it('obeys Maybe left identity', () => {
  const reciprocal = (value: number): Maybe<number> =>
    value === 0 ? nothing<number>() : just(1 / value)

  expect(
    maybeEquals(maybeChain(just(4), reciprocal), reciprocal(4)),
  ).toBe(true)
})
```

Property-based tests are stronger than one example: generate present and absent values, arbitrary pure transformations, and functions that return both branches.

## Traverse a Collection

`traverse` turns many local optional computations into one collection-level decision:

```ts
export const traverseMaybe = <A, B>(
  values: readonly A[],
  transform: (value: A) => Maybe<B>,
): Maybe<B[]> =>
  values.reduce<Maybe<B[]>>(
    (accumulator, value) =>
      maybeChain(accumulator, (results) =>
        maybeMap(transform(value), (result) => [...results, result]),
      ),
    just<B[]>([]),
  )

const parsed = traverseMaybe(['10', '20', '30'], (input) => {
  const value = Number.parseInt(input, 10)
  return Number.isNaN(value) ? nothing<number>() : just(value)
})
```

The output is `Just([10, 20, 30])` only if every element succeeds. There are no `undefined` holes or sentinel values.

The Unreal core provides this behavior for both standard vectors and `TArray`; Rust naturally expresses it with `Option`, `Result`, and iterators; GDScript must enforce its tagged dictionary shapes at runtime.

## Validation: Fail Fast or Accumulate?

The production functional cores use validators shaped like:

```text
T -> Either<E, T>
```

They thread each successful value into the next validator and preserve the first `Left`. This is ordered, fail-fast validation.

If a form must show every error at once, an accumulating validation type is a different abstraction. Do not silently change an `Either` pipeline's contract by concatenating errors in one implementation but not the others.

## Native Carrier or Custom ADT?

The two Rust cores illustrate a real design decision.

| Strategy | Benefit | Cost |
| --- | --- | --- |
| Alias `Maybe<T> = Option<T>` and `Either<E,T> = Result<T,E>` | Native interop and zero conversion | Callers can bypass the shared vocabulary. |
| Define `Just/Nothing` and `Left/Right` enums | Stable cross-language naming and controlled surface | More code and explicit boundary conversion. |

Neither is universally superior. Choose the authority boundary, document it, and test the same public behavior.

## Keep Effects out of the Carrier Laws

Mapping and chaining are predictable only when callbacks obey the intended contract. Types cannot guarantee that a callback is pure.

- Memoizers mutate hidden caches.
- `tap` deliberately runs an observation or effect.
- Async executors invoke callbacks and require cancellation and settlement rules.
- A configuration interpreter may mutate a fresh local result.

These are useful tools, but they do not make reducers or selectors safe places for network requests, logging, current timestamps, random IDs, or engine calls.

In an RTK application:

- keep serializable tagged data in slices;
- derive views with selectors;
- use RTK Query for reusable server documents;
- use thunks for imperative workflows;
- use listener middleware for reactions over time; and
- keep an ECS world authoritative for ECS-shaped domain state.

## Exercise

Implement the same target-selection workflow with `Maybe` and `Either` in two host languages:

1. lift a nullable target ID into `Maybe`;
2. chain a lookup that may return `Nothing`;
3. validate distance and visibility with fail-fast `Either`;
4. traverse a party of targets so one invalid member fails the whole operation;
5. collapse the result to a UI label with exhaustive matching; and
6. property-test the functor and monad laws.

Document which values are safe to store in Redux and which remain host-only wrappers.

## Resources

- [Rust Option](https://doc.rust-lang.org/std/option/enum.Option.html)
- [Rust Result](https://doc.rust-lang.org/std/result/enum.Result.html)
- [Discriminated Unions in TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Functional Programming in Other Languages](../functional-programming-in-other-languages/)
- [Advanced Monad Transformers](../advanced-monad-transformers/)
