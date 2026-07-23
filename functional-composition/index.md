---
title: "Functional Composition"
description: "Compose typed transformations, predicates, projections, dispatch tables, and explicit effect boundaries using patterns proven across production functional cores."
layout: lecture
---

# Functional Composition

Composition turns small functions into a larger function while keeping each stage independently testable. The ForbocAI functional cores use the same algebra in Rust, TypeScript, GDScript, and Unreal C++11, but adapt the types and runtime costs to each host.

## Learning Goals

By the end of this lecture, you should be able to:

- distinguish left-to-right pipelines from mathematical composition;
- build reusable predicates and projections from smaller functions;
- decide between matching, dispatch tables, and reducer events;
- use currying and partial application only when they clarify a call site;
- mark memoization and effects as explicit policies; and
- test composition laws and documented postconditions.

## Pipe and Compose

```ts
export const pipe2 = <A, B, C>(
  first: (value: A) => B,
  second: (value: B) => C,
) => (value: A): C => second(first(value))

export const compose2 = <A, B, C>(
  second: (value: B) => C,
  first: (value: A) => B,
) => (value: A): C => second(first(value))
```

The execution is identical. The declaration order differs:

```text
pipe2(parse, validate)       reads left to right
compose2(validate, parse)    reads right to left
```

Use typed arity helpers when the language cannot infer a heterogeneous variadic pipeline safely:

```ts
export const pipe3 = <A, B, C, D>(
  first: (value: A) => B,
  second: (value: B) => C,
  third: (value: C) => D,
) => (value: A): D => third(second(first(value)))
```

A same-type signature such as `(...functions: Array<(value: T) => T>)` is simpler but cannot represent `string -> number -> boolean`. Do not advertise it as general composition.

## The Small Unary Vocabulary

The production Rust and C++ cores build larger combinators from a small set of arrows.

```ts
export const identity = <T>(value: T): T => value

export const constant = <T, A>(result: T) => (_value: A): T => result

export const flip = <A, B, R>(
  operation: (left: A, right: B) => R,
) => (right: B, left: A): R => operation(left, right)

export const complement = <T>(
  predicate: (value: T) => boolean,
) => (value: T): boolean => !predicate(value)

export const both = <T>(
  left: (value: T) => boolean,
  right: (value: T) => boolean,
) => (value: T): boolean => left(value) && right(value)

export const eitherPredicate = <T>(
  left: (value: T) => boolean,
  right: (value: T) => boolean,
) => (value: T): boolean => left(value) || right(value)
```

These names matter less than their laws. `identity` is the neutral function for composition. `both` and `eitherPredicate` preserve left-to-right short-circuiting.

### Fold a rule set

```ts
export const allPass = <T>(
  predicates: readonly ((value: T) => boolean)[],
) => (value: T): boolean =>
  predicates.every((predicate) => predicate(value))

export const anyPass = <T>(
  predicates: readonly ((value: T) => boolean)[],
) => (value: T): boolean =>
  predicates.some((predicate) => predicate(value))
```

The empty identities are intentional:

```text
allPass([])(value) == true
anyPass([])(value) == false
```

Document those cases; they often decide how a configurable rule set behaves before any rules are installed.

## Project One Input in Multiple Ways

`juxt` keeps independent projections together. `converge` combines them.

```ts
export const juxt2 = <A, B, C>(
  first: (value: A) => B,
  second: (value: A) => C,
) => (value: A): readonly [B, C] => [first(value), second(value)]

export const converge2 = <A, B, C, R>(
  combine: (first: B, second: C) => R,
  first: (value: A) => B,
  second: (value: A) => C,
) => (value: A): R => combine(first(value), second(value))
```

This is useful in selectors, layout calculations, and ECS admission rules.

### Derive a clamped meter value

```ts
type Meter = readonly [current: number, maximum: number]

const selectFillRatio = converge2<Meter, number, number, number>(
  (current, maximum) => {
    const ratio = maximum > 0 ? current / maximum : 0
    return Number.isNaN(ratio) ? 0 : Math.min(1, Math.max(0, ratio))
  },
  ([current]) => current,
  ([, maximum]) => maximum,
)
```

The postcondition is actually `0 <= result <= 1`: the implementation guards a
zero or negative maximum, normalizes a `NaN` ratio, and clamps both ends. A
division-by-zero guard alone would not satisfy that contract.

Note the shape of the guard: a leaf ternary (`maximum > 0 ? current / maximum : 0`),
not a statement `if`. A ratio is a small value selection, which is exactly where a
ternary is the right tool. Statement-level `if`/`for`/`while` do not belong inside
a composed transformation — the next section is about the constructs that replace
them for anything larger than a leaf value.

### Compose an ECS admission predicate

```ts
type Visibility = {
  alive: boolean
  onScreen: boolean
}

const isAlive = (value: Visibility) => value.alive
const isOnScreen = (value: Visibility) => value.onScreen

export const isRenderable = both(isAlive, isOnScreen)
```

The predicate is neutral FP. An ECS system can apply it to its query results; Redux does not need to mirror those components.

## Partial Application versus Currying

Partial application supplies some arguments now and returns a function for the rest:

```ts
export const partialApply = <A, B, R>(
  operation: (first: A, second: B) => R,
  first: A,
) => (second: B): R => operation(first, second)

const hasMinimumLength = partialApply(
  (minimum: number, value: string) => value.length >= minimum,
  3,
)
```

Currying converts an arity-N function into a chain of unary functions. Use it when callers repeatedly configure earlier arguments or need a unary function for `map`, `filter`, or another pipeline stage.

Host constraints matter:

- Rust may allocate `Arc` and boxed closures to hold cloned arguments.
- C++11 stores decayed callable and tuple state through templates.
- TypeScript implementations based on `fn.length` are unreliable for default, rest, and bound parameters.
- GDScript's fixed `curry2` and `curry3` are less magical and easier to specify.

In a hot ECS or rendering path, measure closure allocation and dynamic dispatch before adopting a point-free style.

### Arity: split, don't bundle

Keep functions to two data parameters. When a function grows a third, the fix is
to *split it*, not to bundle the arguments into one payload object — an object
hides the arity behind a wrapper while the function still does too much work.

```ts
// Wrong — an options bag disguises a four-job function.
const renderRow = (opts: {
  row: Row; theme: Theme; locale: Locale; onClick: Handler
}) => { /* ... */ }

// Right — curry the stable inputs, split the independent responsibility out.
const renderRow =
  (theme: Theme, locale: Locale) =>
  (row: Row): VNode =>
    layout(theme, format(locale, row))
```

Currying, partial application, functions-as-arguments, and folds are the tools
that keep arity honest. A grouping struct is a code smell asking you to find the
smaller functions hiding inside the large one.

## Match, Dispatch, or Broadcast?

Choose a branching model by its semantics. The governing rule first: **do not
mechanically replace an `if` with a ternary chain** — a ternary chain is an `if`
that learned to hide, with the same branching and worse readability. Decompose by
*data shape* ("what shape is this?" → `match`), by *key* ("which handler?" →
dispatch table), or by *predicate* ("what property holds?" → `both`/`allPass`
fed to ordered matching). Reserve ternaries for small leaf value expressions.

### Match a closed value

Use exhaustive `match` for `Maybe`, `Either`, or another closed tagged union.

### Select one keyed handler

Use a dispatcher when keys form an open registry and a missing key is a legitimate `Nothing` or explicit fallback.

```ts
type Handler<K, A, R> = readonly [K, (argument: A) => R]

type Maybe<T> =
  | { readonly _tag: 'Just'; readonly value: T }
  | { readonly _tag: 'Nothing' }

const just = <T>(value: T): Maybe<T> => ({ _tag: 'Just', value })
const nothing = <T>(): Maybe<T> => ({ _tag: 'Nothing' })

export const createDispatcher = <K, A, R>(
  entries: readonly Handler<K, A, R>[],
) => {
  const handlers = new Map<K, (argument: A) => R>(entries)

  return (key: K, argument: A): Maybe<R> => {
    const handler = handlers.get(key)
    return handler ? just(handler(argument)) : nothing<R>()
  }
}
```

This JavaScript version lets a later duplicate replace the earlier handler;
`Map` preserves key insertion order. Rust `HashMap` and C++
`std::unordered_map` do not promise stable presentation order. Specify whether
duplicate handling and key enumeration are part of each dispatcher's public
contract instead of projecting one host's behavior onto every port.

### Select the first matching case

Use ordered predicate matching when precedence is part of the domain:

```ts
type Case<T, R> = readonly [
  predicate: (value: T) => boolean,
  handle: (value: T) => R,
]

export const firstMatch = <T, R>(
  value: T,
  cases: readonly Case<T, R>[],
): R | undefined => {
  const matched = cases.find(([predicate]) => predicate(value))
  return matched?.[1](value)
}
```

Predicates should be pure. An implementation that filters the whole case list may evaluate later predicates even though it returns the first result.

### Broadcast an application event

Redux dispatch is different. An action passes through middleware and the reducer tree and becomes part of the application history. Do not replace Redux events with a private function table or describe a keyed dispatcher as Redux dispatch.

## Memoization and Lazy Evaluation

Memoization changes evaluation, not the mathematical result. It is sound only for referentially transparent functions.

The production cores expose two useful policies:

- full memoization caches every key and needs a bounded domain or eviction;
- last-input memoization keeps one result and resembles a selector cache.

Key equality is part of the public contract. Rust hash/value equality, GDScript deep comparison, TypeScript reference identity, and Reselect input equality can produce different hit rates for the same-looking code.

Lazy values also mutate a hidden cache. A correct implementation must distinguish "not evaluated" from "evaluated to null" and must avoid holding a read borrow while writing the cache.

Use RTK's `createSelector` for Redux derivations because it integrates with immutable state and reference stability. Do not wrap selectors in an unrelated unbounded cache by default.

## `tap` Marks an Effect Boundary

```ts
export const tap = <T>(effect: (value: T) => void) => (value: T): T => {
  effect(value)
  return value
}
```

`tap` preserves the pipeline's value, not its purity. Logging, metrics, mutation, and assertions remain effects. Keep `tap` out of reducers and selectors; use it at an explicit imperative boundary or in diagnostics.

## Prefer Iteration for Unbounded Collections

Some cross-language cores implement maps, dispatch construction, matching, and validation recursively to emphasize composition. Rust and C++ do not guarantee tail-call optimization. Large inputs can overflow even if the function is tail-recursive.

A true trampoline represents the next step as data and interprets it with a loop:

```ts
type Bounce<A, R> =
  | { readonly _tag: 'Call'; readonly argument: A }
  | { readonly _tag: 'Done'; readonly result: R }

export const trampoline = <A, R>(
  initial: A,
  step: (argument: A) => Bounce<A, R>,
): R => {
  let current = step(initial)
  while (current._tag === 'Call') current = step(current.argument)
  return current.result
}
```

Calling the trampoline function recursively is not stack-safe unless the language guarantees tail-call elimination.

The current Unreal `ue_fp.hpp` helper recursively re-enters its trampoline, so
it should not be used for unbounded work until its interpreter is iterative like
the example above.

## Common Pitfalls

### Hand-composed `compose(compose(...))`

```ts
// Wrong — arity plumbing composed by hand.
const run = compose2(h, compose2(g, f))

// Right — a typed arity helper, or a fold over the stages.
const run = pipe3(f, g, h)
```

Nesting composers to reach the arity you need is the plumbing a `pipe3`/`pipe4`
helper — or a `fold` over an array of stages — exists to remove.

### Point-free everything

```ts
// Wrong — tacit style past the point of clarity.
const process = pipe2(flip(concatWith)(suffix), compose2(trim, toLower))

// Right — name the parameter where it reveals intent.
const process = (raw: string) => `${trim(toLower(raw))}${suffix}`
```

Point-free is a tool for revealing intent, not a goal. When removing the
parameter obscures what a stage does, put it back.

### Manual recursion over a bounded collection

```ts
// Wrong — reimplements a fold, badly, and risks the stack.
function sum(xs: number[], i = 0): number {
  if (i >= xs.length) return 0
  return xs[i] + sum(xs, i + 1)
}

// Right — fold over the collection.
const sum = (xs: number[]): number => xs.reduce((total, x) => total + x, 0)
```

Bounded iteration is a fold. Reserve the trampoline for genuinely *unbounded*
work, where expressing the step as `Call`/`Done` data is what keeps it stack-safe.

## Test the Contract

Composition tests should include:

1. `compose2(identity, f)` and `compose2(f, identity)` agree with `f`;
2. `pipe2(f, g)(x)` agrees with `compose2(g, f)(x)`;
3. `allPass([])` and `anyPass([])` use their documented identities;
4. `converge2` evaluates both projections exactly once;
5. the local `firstMatch` helper never invokes later predicates after a match,
   while each cross-language port obeys its separately documented evaluation policy;
6. memoization counts underlying calls for equal and distinct keys;
7. lazy evaluation caches a null-like result correctly; and
8. documented ranges and invariants are property-tested.

## Exercise

Create an NPC render selector from small arrows:

1. combine alive, visible, and distance predicates;
2. derive a label and clamped health ratio from the same snapshot;
3. route render modes through an explicit dispatcher;
4. return `Nothing` for an unknown mode;
5. memoize only the final Redux selector; and
6. measure the same design in a hot ECS loop before keeping its closure-heavy form.

## Resources

- [Functional Programming in Other Languages](../functional-programming-in-other-languages/)
- [Performance Optimization Techniques](../performance-optimization-techniques/)
- [Redux Deriving Data with Selectors](https://redux.js.org/usage/deriving-data-selectors)
- [Reselect](https://reselect.js.org/)
