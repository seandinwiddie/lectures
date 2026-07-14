---
title: "Functional Programming in Other Languages"
description: "Compare one production functional core across Rust, TypeScript, GDScript, and Unreal C++11, then separate portable laws from host-language representation."
layout: lecture
---

# Functional Programming in Other Languages

Functional programming travels best as a behavioral contract, not a literal port. This lecture compares five functional-core implementations from the same production ecosystem: two Rust designs, a TypeScript package, a GDScript port, and an Unreal C++11 header.

The implementations share names and laws while making different decisions about native types, serialization, ownership, allocation, and effects.

## Learning Goals

By the end of this lecture, you should be able to:

- port the behavior of `Maybe`, `Either`, composition, dispatch, and validation without forcing one language's representation onto another;
- distinguish an algebraic law from an implementation convenience;
- keep FP below RTK and ECS in the dependency graph;
- identify serialization, mutability, async, and performance boundaries in each host language; and
- design conformance tests that verify semantics across SDKs.

## The Shared Dependency Rule

All five cores establish the same architecture:

```text
           Functional primitives
          /                     \
Redux Toolkit / RTK        ECS data and systems
          \                     /
                Feature code
```

The functional layer may know about values, functions, optionality, errors, validation, and collections. It must not know about stores, reducers, queries, entities, worlds, components, or systems.

RTK and ECS may both depend on FP. FP must not depend on either one. That direction prevents circular architecture and gives reducers, selectors, and systems a neutral vocabulary.

## Source Case Study

| Host | Source | Design choice |
| --- | --- | --- |
| Rust | `therapy-12/src/functional.rs` | Aliases `Maybe` to `Option` and `Either` to `Result` for native interop. |
| Rust | `magik-lux/core/src/functional.rs` | Defines explicit `Just/Nothing` and `Left/Right` enums for a stable cross-SDK vocabulary. |
| TypeScript | `sdk/packages/core/src/functional_core.ts` | Uses tagged factory objects with methods and type guards. |
| GDScript | `therapy-one/src/fp.gd` | Uses tagged `Dictionary` values and factory closures because the host type system is dynamic. |
| Unreal C++11 | `sdk-ue-5/.../Core/ue_fp.hpp` | Uses data structs, free functions, value semantics, C++11 backports, and `TArray`/`TMap` adapters. |

The Unreal source was formerly named `functional_core.hpp`; the current checkout names its canonical successor `ue_fp.hpp`.

## Port the Algebra, Adapt the Representation

### Maybe

The common contract is:

- `just(value)` represents presence;
- `nothing()` represents expected absence;
- `map` transforms only a present value;
- `chain` sequences another optional computation;
- `match` collapses both branches into one output type; and
- `fromNullable` adapts a host boundary.

The representation should fit the language.

```rust
// Native-carrier strategy
pub type Maybe<T> = Option<T>;

pub fn just<T>(value: T) -> Maybe<T> {
    Some(value)
}
```

```rust
// Portable-vocabulary strategy
pub enum Maybe<T> {
    Just(T),
    Nothing,
}
```

```gdscript
static func just(value: Variant) -> Dictionary:
    return { "_tag": "Just", "value": value }

static func nothing() -> Dictionary:
    return { "_tag": "Nothing" }
```

```cpp
template <typename T>
struct Maybe {
  bool hasValue;
  T value;
};
```

Rust's alias is a zero-conversion bridge to the standard library, but callers can bypass the shared vocabulary with `Some` and `None`. The explicit Rust enum preserves the ecosystem's names but requires conversion at library boundaries.

The C++11 representation deliberately default-constructs the inactive payload, so `T` must be default-constructible. The GDScript representation can express the same tag with less ceremony, but an arbitrary dictionary can violate the shape at runtime.

### Either

`Either<E, T>` separates recoverable failure from success:

- `Left(error)` preserves a diagnostic error;
- `Right(value)` carries a successful value;
- `map` transforms only `Right`;
- `chain` preserves one error algebra while changing the success type; and
- `match` handles both branches explicitly.

Several hosts also expose `mapLeft` to translate only `Left` at a boundary.
The examined TypeScript core omits that convenience, so its callers must use
`match` or add an equivalent adapter. Port the behavior deliberately; do not
assume every surface exports every helper.

Use `Maybe` when absence needs no explanation. Use `Either` when the caller needs to know why the operation failed. Reserve exceptions, assertions, and `requireJust` for broken invariants or explicit application boundaries.

## Laws Are the Portability Specification

Surface names can differ—`maybe_map`, `fmap`, and `.map()` all appear in the cores. The laws determine whether they mean the same thing.

### Functor laws

```text
map(value, identity) == value
map(value, x => f(g(x))) == map(map(value, g), f)
```

### Monad laws

```text
chain(just(x), f) == f(x)
chain(value, just) == value
chain(chain(value, f), g) == chain(value, x => chain(f(x), g))
```

### Branch invariants

```text
map(nothing(), f) == nothing()
map(left(error), f) == left(error)
chain(left(error), f) never calls f
```

Do not compare hidden closures or object identity in conformance tests. Compare public observations: tags, matched values, emitted errors, handler calls, and ordering.

## Data-Only Values at Redux Boundaries

The TypeScript core's `Maybe` and `Either` factory objects contain functions such as `map`, `chain`, and `match`. They are useful ephemeral values, but functions are not valid ordinary Redux state or action payloads.

Project them to plain tagged data before dispatching or storing them:

```ts
type MaybeData<T> =
  | { readonly _tag: 'Just'; readonly value: T }
  | { readonly _tag: 'Nothing' }

type EitherData<E, T> =
  | { readonly _tag: 'Left'; readonly error: E }
  | { readonly _tag: 'Right'; readonly value: T }
```

The container shape is plain data, but the whole value is Redux-safe only when
its `E` and `T` payloads are recursively serializable too.

Keep closures, `Map`, `Set`, `Symbol`, C++ pointers, Godot `Callable` values, and engine objects outside Redux state. A selector can lift plain data into richer helpers for a local calculation, then return a serializable view.

## Composition across Type Systems

The cores converge on left-to-right value threading and right-to-left
composition semantics, but not on an identical API. The TypeScript core
exports `compose` without a separate `pipe`; GDScript and C++ include
value-threading pipeline forms rather than only curried function composition.

```text
pipe(f, g)(x) == g(f(x))
compose(g, f)(x) == g(f(x))
```

The equality is semantic; the type machinery is not portable.

- Rust currying uses `Arc` and boxed closures to capture cloned arguments.
- TypeScript uses overloads and runtime `fn.length`, which is fragile for default, rest, or bound parameters.
- GDScript exposes fixed `curry2` and `curry3` functions because runtime arity reflection would weaken the contract.
- C++11 uses templates, tuple expansion, and backported index sequences because newer standard helpers are unavailable.

Currying is useful when it produces a reusable unary function for a pipeline. It is not automatically clearer, and its closure allocation can matter in a hot ECS or rendering loop.

## Choose the Right Branching Abstraction

The cores offer three different routing shapes.

| Shape | Use it for | Result on no match |
| --- | --- | --- |
| `match` on Maybe/Either | A closed sum type with known branches | Every branch is handled. |
| `Dispatcher<K, R>` | An open keyed handler table | Fallback value or `Nothing`. |
| `multiMatch` | Ordered predicate or literal cases | First match; misses use a wildcard, `Nothing`, or a host null-like result, depending on the port. |

A functional dispatcher is not Redux dispatch. A dispatcher selects one handler by key. Redux broadcasts an event through the reducer tree, middleware, subscriptions, and DevTools history.

First-match behavior also needs an evaluation contract. The TypeScript implementation short-circuits but recursively allocates sliced arrays. The GDScript implementation selects the first result after filtering, so every predicate runs. If predicates are expensive or effectful, those implementations are observably different despite producing the same simple examples.

## Validation Is Ordered and Fail-Fast

The Rust, GDScript, and C++ cores build validation as an ordered sequence of functions:

```text
T -> Either<E, T>
```

Each `Right` value feeds the next validator. The first `Left` stops the pipeline. This is fail-fast validation, not error accumulation.

```ts
type Validator<T, E> = (value: T) => EitherData<E, T>

const runValidation = <T, E>(
  value: T,
  validators: readonly Validator<T, E>[],
): EitherData<E, T> =>
  validators.reduce<EitherData<E, T>>(
    (result, validate) =>
      result._tag === 'Right' ? validate(result.value) : result,
    { _tag: 'Right', value },
  )
```

If a product needs all validation errors at once, use a different algebra that accumulates errors. Do not claim a fail-fast `Either` pipeline provides accumulation.

## Functional Core, Imperative Shell

A module can contain functional combinators without every operation being pure.

- Lazy values and memoizers mutate hidden caches.
- `tap` deliberately runs logging, assertions, or another observation.
- `tapMut` deliberately exposes mutation.
- Async executors register handlers and invoke callbacks.
- Configuration builders may mutate a fresh output while they interpret an immutable list of setters.

The useful boundary is explicit:

```text
Pure or deterministic core
  parse -> validate -> transform -> derive
                         |
                         v
Imperative shell
  RTK Query, thunk, listener, engine API, filesystem, network, logging
```

RTK reducers and selectors remain deterministic consumers in the RTK layer;
they may call FP primitives, but they do not move into the dependency-root FP
package. RTK Query owns reusable server documents. Thunks own imperative
workflows. Listener middleware owns reactions to events over time. ECS systems
may perform domain work at their scheduled boundary, while the ECS world
remains its own authority.

Callback-style `AsyncResult` implementations in the source case study are useful for learning effect description and interpretation. They are not substitutes for a production async runtime: cancellation, exactly-once settlement, exception conversion, concurrency, and repeated execution all need explicit semantics.

## Memoization Is a Policy

The cores expose both full caches and last-input caches.

| Cache | Benefit | Risk |
| --- | --- | --- |
| Unbounded memoization | Reuses every prior input/result pair | Memory growth, key collisions, stale mutable results |
| Last-input memoization | Bounded and selector-friendly | Equality semantics determine every cache hit |
| Lazy single value | Defers work until demanded | Hidden mutation and re-entrancy must be correct |

Memoization is valid only for referentially transparent calculations. Decide whether keys use value equality, reference identity, hashing, or serialization. A stringified argument list is not a safe general-purpose cache key.

RTK's `createSelector` is a memoized derivation tool with its own input and reference contract. It is not interchangeable with a full hash cache or GDScript's deep-value comparison.

## Host-Specific Collection Adapters

The portable operations are `map`, `filter`, `fold`, `find`, `traverse`, and `sequence`. The Unreal core gives `TArray` and `TMap` first-class overloads; Rust uses `Vec`, iterators, or explicit recursion; GDScript uses `Array` and `Dictionary`.

`traverse` is especially important:

```text
Array<A> + (A -> Maybe<B>) -> Maybe<Array<B>>
```

The result contains every transformed value only when every input succeeds. This converts many local optional decisions into one collection-level decision without sentinel elements.

Do not assume recursive implementations are stack-safe. Rust and C++ do not guarantee tail-call optimization. For unbounded collections, use iterator folds or loops. Use a `Call | Done` trampoline when the recursive control flow itself must remain explicit and stack-safe.

## Ownership Is Part of the C++ API

The Unreal core makes choices that a garbage-collected port can easily hide.

| API shape | Meaning |
| --- | --- |
| `Maybe<Value>` map lookup | Owns a copied value. |
| `Maybe<const Value*>` map lookup | Borrows storage from the original `TMap`. |
| `from_nullable(const T*) -> Maybe<T>` | Copies the pointee; it does not preserve pointer identity or ownership. |
| lazy or memoized `const T&` | Borrows a cache-owned result whose lifetime and replacement rules matter. |

A borrowed pointer or reference must not outlive the container or cache that owns it. Mutation can invalidate a `TMap` pointer. A memoized-last cache can replace its internal result, so retaining a reference across another call may observe a different value.

These are not implementation trivia. They belong in the public contract and in tests.

The C++11 sum types also store inactive fields physically and default-construct them. Semantic equality should compare the tag and active branch, not irrelevant dummy payloads.

## Group Repeated Declarations as Data

The Unreal core contains catalog and zipped-fold helpers for a recurring architecture problem: many parallel declarations that differ only by a name, path, conversion, or predicate.

Prefer one grouped atom:

```ts
type FieldDeclaration<Input, Output> = {
  readonly name: string
  readonly read: (input: Input) => unknown
  readonly convert: (value: unknown) => Output
  readonly validate: (value: Output) => boolean
}
```

Then fold a catalog of declarations through one generic composer. Parallel arrays of names, readers, and validators can silently drift out of alignment. Use a request struct instead when the inputs form one genuine domain operation rather than a catalog entry.

## Cross-Language Conformance Tests

Test the shared contract in every host:

1. `Nothing` and `Left` short-circuit mapping and chaining.
2. `match` handles every branch and returns one output type.
3. Functor and monad laws hold for representative generators.
4. Dispatch misses are distinct from a handler that returns an empty value.
5. `multiMatch` documents ordering and predicate-evaluation behavior.
6. Validation stops at the first failure and threads transformed successes.
7. Lazy evaluation runs once, including when the cached result is null-like.
8. Memoization tests count underlying calls and exercise distinct keys.
9. Documented postconditions are property-tested, not inferred from one example.
10. Boundary effects execute only when the explicit interpreter is invoked.

The same test names and fixtures can be shared even when the implementations cannot.

## Exercise

Define a portable NPC-targeting contract in Rust, TypeScript, GDScript, and C++:

1. lift an optional target ID into `Maybe`;
2. validate the target with fail-fast `Either` rules;
3. derive both a display label and distance from the same input;
4. dispatch an action by a keyed handler table;
5. keep the serializable projection in Redux;
6. keep spatial components authoritative in ECS; and
7. perform logging and engine calls only in the imperative shell.

Write one language-neutral conformance table before writing any host-specific implementation.

## Resources

- [Rust Option](https://doc.rust-lang.org/std/option/enum.Option.html)
- [Rust Result](https://doc.rust-lang.org/std/result/enum.Result.html)
- [TypeScript Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Godot GDScript Reference](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html)
- [Unreal Engine TArray](https://dev.epicgames.com/documentation/en-us/unreal-engine/array-containers-in-unreal-engine)
- [Monads in Functional Programming](../monads-in-functional-programming/)
- [Modern Redux Architecture Patterns](../modern-redux-architecture-patterns/)
