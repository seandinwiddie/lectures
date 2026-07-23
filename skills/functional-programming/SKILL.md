---
name: fp
description: >
  Use this when writing or reviewing functional code — adding to a functional
  core, choosing how to represent an error, or replacing branching, loops, or
  classes with composition. Language-independent (C, Rust, TypeScript, and more;
  TypeScript is the default for examples). Covers Maybe, Either, and Validation;
  the Functor / Applicative / Monad / Monoid / Traversable ladder; match,
  dispatch tables, predicate combinators, and the trampoline; lenses and
  transducers; and the branching and arity policies that keep a functional core
  lawful.
type: core
sources:
  - "Philip Wadler — Monads for Functional Programming"
  - "Philip Wadler — Theorems for Free!"
  - "Philip Wadler — The Expression Problem"
  - "Eric Elliott — Composing Software"
  - "James Sinclair — Elegant Error Handling with the JavaScript Either Monad"
  - "James Sinclair — A Gentle Introduction to Transducers"
  - "Reginald Braithwaite — JavaScript Allongé (combinators, trampolining)"
---

# FP

A working contract for functional code, not an introduction. It assumes the
decision to use FP is settled and governs *how*. It is **language-independent**:
the same algebra is used in C, Rust, TypeScript, and others. Examples are in
TypeScript for readability and as the default target; every construct ports —
only the naming adapts to host convention (see Portability).

## Canon

Three bodies of work are authoritative. When guidance conflicts, prefer them in
this order for the question at hand.

| Source | Governs | Key works |
|---|---|---|
| **Philip Wadler** | Laws, algebraic structure, types | *Monads for Functional Programming*; *Theorems for Free!*; *The Expression Problem* |
| **Eric Elliott** | Composition, factories, arity | *Composing Software* |
| **James Sinclair** | Practical monads, effects, optics | *Elegant Error Handling with the JS Either Monad*; *Transducers* |

**Reject generic FP advice.** Material pitched at teams deciding *whether* to
adopt FP — "consider using map", "don't be a zealot", "monads are just burritos"
— is below the floor of this standard. If a source stops at explaining what a
monad *is*, it is not governing how to build one.

## Non-negotiables

Not stylistic. Everything else in this document elaborates these.

1. **Zero classes.** Factory functions returning data plus closures. No `new`,
   no `this`/`self`, no inheritance. Framework and reflection boundaries that
   require a class are the documented exception and stay thin.
2. **Two data parameters maximum.** Over-arity is fixed by *splitting the
   function*, not by bundling arguments into a payload object — an object hides
   the arity, it does not reduce the work. Reach for currying, partial
   application, functions-as-arguments, and folds.
3. **No `if` / `for` / `while` / `loop` / `switch` statements** in core runtime
   code. A branch is routed by shape (`match`), by key (dispatch table), or by
   predicate combinator; iteration is a fold; unbounded iteration is a
   trampoline. Statements that *do* something and return nothing have no place
   in a pipeline. See *Replace branches by data shape* and *Replace loops with
   folds and a trampoline*.
4. **The functional core depends on nothing.** Other layers may depend on it; it
   depends on no other layer. Keep it importable in isolation.
5. **No lazy wrapper nouns** — `Manager`, `Helper`, `Util(s)`, `Bag`, `Fixture`.
   They hide the role. Name the composition boundary instead.

## Setup

Represent the error primitives as plain tagged data — never as classes — so they
stay serializable and pattern-matchable. `match` is the single branching
primitive: a leaf expression on the tag, and the only sanctioned form of
conditional.

```ts
// file: maybe.ts
export type Maybe<T> =
  | { readonly _tag: 'Just'; readonly value: T }
  | { readonly _tag: 'Nothing' }

export const just = <T>(value: T): Maybe<T> => ({ _tag: 'Just', value })
export const nothing: Maybe<never> = { _tag: 'Nothing' }

export const match = <T, R>(
  m: Maybe<T>,
  onJust: (value: T) => R,
  onNothing: () => R,
): R => (m._tag === 'Just' ? onJust(m.value) : onNothing())

export const fromNullable = <T>(x: T | null | undefined): Maybe<T> =>
  x === null || x === undefined ? nothing : just(x)

// file: either.ts
export type Either<E, T> =
  | { readonly _tag: 'Left'; readonly left: E }
  | { readonly _tag: 'Right'; readonly right: T }

export const left = <E>(e: E): Either<E, never> => ({ _tag: 'Left', left: e })
export const right = <T>(t: T): Either<never, T> => ({ _tag: 'Right', right: t })

export const ematch = <E, T, R>(
  e: Either<E, T>,
  onLeft: (e: E) => R,
  onRight: (t: T) => R,
): R => (e._tag === 'Left' ? onLeft(e.left) : onRight(e.right))
```

`Validation<E, T>` shares `Either`'s shape but its `ap` **accumulates** errors and
it has **no** `chain`. Omitting `chain` is deliberate — it is what stops the type
from silently short-circuiting.

```ts
// file: validation.ts
export type Validation<E, T> =
  | { readonly _tag: 'Failure'; readonly errors: readonly E[] }
  | { readonly _tag: 'Success'; readonly value: T }

export const success = <T>(value: T): Validation<never, T> =>
  ({ _tag: 'Success', value })
export const failure = <E>(...errors: E[]): Validation<E, never> =>
  ({ _tag: 'Failure', errors })

const errorsOf = <E>(...vs: readonly Validation<E, unknown>[]): readonly E[] =>
  vs.flatMap((v) => (v._tag === 'Failure' ? v.errors : []))

// Combine two independent checks, collecting every error. No branch statement:
// a leaf condition selects success or the accumulated failure.
export const ap = <E, A, B>(
  vf: Validation<E, (a: A) => B>,
  va: Validation<E, A>,
): Validation<E, B> =>
  vf._tag === 'Success' && va._tag === 'Success'
    ? success(vf.value(va.value))
    : failure(...errorsOf(vf, va))
```

## Portability

The algebra is identical across languages; only the surface name changes. C uses
tagged `struct`s + function pointers; Rust uses `enum` + `impl`; TypeScript uses
discriminated unions. A primitive added to one core is added to every core with
the same semantics and matching law tests.

| Concept | TypeScript | Rust / C | Note |
|---|---|---|---|
| wrap present / transform | `just` / `map`, `fmap` | `just` / `maybe_map` | Functor |
| dependent step | `chain`, `mbind` | `maybe_chain`, `mbind` | Monad |
| exhaustive branch | `match`, `ematch` | `maybe_match`, `ematch` | the branch primitive |
| left-to-right composition | `pipe` | `pipe!` / `pipe` | |
| fix arity | `curry`, `partial` | `curry2`, `partial_apply` | |
| predicate routing | `multiMatch` | `multi_match` | with wildcard fallthrough |
| key routing | `createDispatcher` | `Dispatcher` | |
| unbounded iteration | `trampoline` | `trampoline` (`Bounce`) | the one sanctioned loop |

Because the semantics are fixed and only names move, a review comment written
against the TypeScript examples applies verbatim to the C and Rust cores.

## Core Patterns

### Pick the weakest abstraction that solves the problem

Weaker means more laws, more guarantees, more reuse. Climb only when the problem
forces it.

| Need | Abstraction |
|---|---|
| Transform inside a container | **Functor** (`map`) |
| Combine N independent containers, collect all failures | **Applicative** (`ap` / `Validation`) |
| Sequence dependent steps, short-circuit on first failure | **Monad** (`chain`) |
| Collapse many same-type values into one | **Monoid** (`concat` + `empty`) |
| Flip `Array<Maybe<T>>` into `Maybe<Array<T>>` | **Traversable** (`traverse` / `sequence`) |
| Focused immutable update of deep structure | **Lens** (`view` / `set` / `over`) |
| Fuse map/filter/take with no intermediate collections | **Transducer** |

```
Transforming values inside a container?
  one function, one container   -> Functor
  N independent containers      -> Applicative
  each step depends on the last -> Monad
Combining same-type values?     -> Monoid
Container-of-containers to flip? -> Traversable
```

The whole applicative-and-above layer (Validation, Monoid, Traversable, lenses,
transducers) is the high-value frontier of most functional cores — port those
before adding more one-off helpers.

### Applicative for independent validation, Monad for dependent steps

The most-violated distinction.

- **Monad = dependent + short-circuit.** Step 2 needs step 1's *value*; first
  failure wins.
- **Applicative = independent + accumulate.** All checks run; all failures
  collected.

Form, config, and request validation are **applicative**. A pipeline that folds
with "if Right, continue; else return the error" is monadic — it reports one
error and discards the rest, which is the wrong shape for anything a user has to
fix.

```ts
// Monadic — dependent steps, short-circuits, reports one error
const parse = (raw: string): Either<string, Config> =>
  ebind(readFile(raw), (text) => ebind(toJson(text), validateSchema))

// Applicative — independent checks, runs all, accumulates every error
const validate = (u: User): Validation<string, User> =>
  liftA3(mkUser, checkName(u), checkEmail(u), checkAge(u))
// Failure(['name too short', 'email invalid', 'age must be positive'])
```

### Chain a null-guarded pipeline instead of nested guards

The most common `if` in imperative code is a null check. Wrap the value once and
map through it; the pipeline skips itself when the value is absent.

```ts
const discountFor = (user: User): number =>
  match(
    mbind(fromNullable(user.discountCode), lookupDiscount), // Maybe<number>
    (rate) => rate,
    () => 0,
  )
```

### Replace branches by data shape, not boolean condition

A ternary chain is an `if` that learned to hide. Branch replacement uses exactly
one of these, in preference order:

1. **`match`** on `Maybe`, `Either`, or a small result type — routing by *shape*.
2. **A dispatch table** for enum or string routing — routing by *key*.
3. **`multiMatch`** — an ordered list of predicate/handler pairs with a wildcard
   fallthrough, for conditions that are not a single key.
4. **`map` / `filter` / `fold` / `find` / `traverse`** for collection decisions.

Ask "what shape is this?" → `match`. "What key is this?" → dispatch table. "What
property does this value have?" → a predicate composed from `both` / `either` /
`allPass` / `complement`, fed to `filter` or `multiMatch`. Ternaries are for
small leaf value expressions only.

```ts
// Key routing: a table replaces a switch/if-chain over a tag.
const area: Record<Shape['kind'], (s: Shape) => number> = {
  circle: (s) => Math.PI * (s as Circle).r ** 2,
  rect: (s) => (s as Rect).w * (s as Rect).h,
}
const areaOf = (s: Shape): number => area[s.kind](s)

// Predicate routing: multiMatch runs the first matching case, else the wildcard.
const classify = (o: Order): Tier =>
  multiMatch(o, [
    [allPass([isPaid, both(isDomestic, isLarge)]), () => 'priority'],
    [isPaid, () => 'standard'],
  ], () => 'unpaid')
```

### Replace loops with folds, and unbounded loops with a trampoline

Bounded iteration is a fold; there is no `for`. Unbounded iteration (game loops,
work queues, recursive walks that could blow the stack) is expressed as data —
`Call` to continue, `Done` to stop — and handed to the trampoline, the single
sanctioned loop that lives once in the core.

```ts
const totalPrice = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.price, 0) // fold, not `for`

// Unbounded, stack-safe, no `while`: express the step as a Bounce value.
type Bounce<T> =
  | { readonly _tag: 'Call'; readonly next: () => Bounce<T> }
  | { readonly _tag: 'Done'; readonly value: T }

const call = <T>(next: () => Bounce<T>): Bounce<T> => ({ _tag: 'Call', next })
const done = <T>(value: T): Bounce<T> => ({ _tag: 'Done', value })

const sumTo = (n: number, acc = 0): Bounce<number> =>
  n === 0 ? done(acc) : call(() => sumTo(n - 1, acc + n))

const total = trampoline(sumTo(1_000_000)) // driver provided by the core
```

### Compose conditions as functions

Do not inline boolean logic into a branch. Compose named predicates with
combinators and pass the result where a predicate is expected.

```ts
const canEnter = both(isAdult, isMember)          // p && q
const isEdgeCase = either(isEmpty, isOverflow)     // p || q
const isInactive = complement(isActive)            // !p
const admissible = allPass([isPaid, isVerified, isInStock])
```

### Compose with `pipe` / `fold`, and keep effects at the edges

```ts
// pipe reads left-to-right; compose reads right-to-left; execution is identical.
const slugify = (s: string): string => pipe(s, trim, toLowerCase, dashSpaces)
```

- Prefer one reusable composer fed **grouped declaration data** over repeated
  typed factory families (`bindFloat`, `readField3`, `componentField`). Repeated
  per-field wrappers are the abstraction leaking.
- No hand-composed `compose(compose(...))`. Use `pipe` / `fold`.
- Point-free only when it reveals intent; add the parameter back when it
  clarifies. Curry to capture stable inputs, not as decoration.
- Pure core, effects pushed to boundaries. `tap` marks an effect inside a
  pipeline explicitly — a *declaration* that something impure happens here, not a
  loophole.

### Ship new primitives with law tests

A primitive without its laws is just a function with a fancy name. New core
primitives ship with law tests (see Laws).

## Common Mistakes

### CRITICAL Rich functional wrappers in serializable state

Wrong:

```ts
// A Maybe stored in a serializable store (e.g. a Redux slice).
const initialState = { selected: nothing as Maybe<Id> }
```

Correct:

```ts
const initialState = { selected: null as Id | null }
// Lift into Maybe at the selector/reducer edge:
const selectSelected = (s: State): Maybe<Id> => fromNullable(s.selected)
```

Tagged wrappers in serializable state break serialization, hydration, and
time-travel. Keep plain data in state and lift at the edge.

Source: serializable-state invariant; Sinclair — Either Monad

### CRITICAL A `while` / `for` loop for unbounded iteration

Wrong:

```ts
function run(state: State): State {
  while (!state.done) {
    state = step(state) // stack of mutable state, no value out until it ends
  }
  return state
}
```

Correct:

```ts
const run = (state: State): Bounce<State> =>
  state.done ? done(state) : call(() => run(step(state)))

const final = trampoline(run(initial)) // stack-safe, no `while`
```

A loop with mutation is a statement pretending to be a value. Express the step as
`Call` / `Done` and let the trampoline — the one sanctioned loop, written once in
the core — drive it.

Source: Braithwaite — JavaScript Allongé (trampolining); FP loop policy

### HIGH Nested `if` null-guards

Wrong:

```ts
function discountFor(user: User): number {
  if (user != null) {
    if (user.discountCode != null) {
      return lookupDiscount(user.discountCode)
    }
  }
  return 0
}
```

Correct:

```ts
const discountFor = (user: User): number =>
  match(mbind(fromNullable(user.discountCode), lookupDiscount), (r) => r, () => 0)
```

Null-guard ladders are the branch a Maybe pipeline exists to erase. Wrap once,
map through, default at the end.

Source: FP branching policy; Sinclair — Either Monad

### HIGH A payload object to dodge the arity limit

Wrong:

```ts
const renderRow = (opts: {
  row: Row; theme: Theme; locale: Locale; onClick: Handler
}) => { /* still does four jobs */ }
```

Correct:

```ts
// Curry the stable inputs; split the independent responsibility out.
const renderRow =
  (theme: Theme, locale: Locale) =>
  (row: Row): VNode =>
    layout(theme, format(locale, row))
```

An options object hides the arity; it does not reduce the work. Split the
function and curry the stable inputs. (A grouping struct is not the fix.)

Source: Elliott — Composing Software (arity, curry, partial application)

### HIGH `Either` for form or config validation

Wrong:

```ts
const validate = (u: User): Either<string, User> =>
  ebind(checkName(u), () => ebind(checkEmail(u), () => checkAge(u)))
// Stops at the first failure; the user fixes one error at a time.
```

Correct:

```ts
const validate = (u: User): Validation<string, User> =>
  liftA3(mkUser, checkName(u), checkEmail(u), checkAge(u))
// Reports every failing field at once.
```

`Either`'s `chain` short-circuits. Independent checks are applicative — use
`Validation` with an accumulating `ap`.

Source: Wadler — Monads for Functional Programming; Sinclair — Either Monad

### HIGH A ternary chain replacing an `if` chain

Wrong:

```ts
const label = kind === 'a' ? 'Alpha'
  : kind === 'b' ? 'Beta'
  : kind === 'c' ? 'Gamma'
  : 'Unknown'
```

Correct:

```ts
const labels: Record<string, string> = { a: 'Alpha', b: 'Beta', c: 'Gamma' }
const label = labels[kind] ?? 'Unknown'
```

Same branch, worse readability. Route with a dispatch table; `match` on shape for
domain alternatives; `multiMatch` for predicate conditions.

Source: The Expression Problem (Wadler); dispatch over conditionals

### HIGH A class wrapping a closure bundle

Wrong:

```ts
class Counter {
  private n = 0
  inc() { this.n += 1; return this.n }
}
```

Correct:

```ts
const makeCounter = () => {
  let n = 0
  return { inc: () => (n += 1) }
}
```

A class reintroduces `new`, `this`, and inheritance. A factory returning data
plus closures composes without any of them.

Source: Elliott — Composing Software (composition over class inheritance)

### MEDIUM Collapsing every error into `Nothing`

Wrong:

```ts
const parseConfig = (raw: string): Maybe<Config> =>
  tryParse(raw) // Nothing on any failure — but why did it fail?
```

Correct:

```ts
const parseConfig = (raw: string): Either<ConfigError, Config> =>
  tryParse(raw) // Left carries the reason the caller needs.
```

`Nothing` is right only for expected absence with no diagnostic. When the caller
needs to know *why*, use `Either` or `Validation`.

Source: Sinclair — Elegant Error Handling

### MEDIUM Manual recursion over a collection

Wrong:

```ts
function sumPrices(items: Item[], i = 0): number {
  if (i >= items.length) return 0
  return items[i].price + sumPrices(items, i + 1)
}
```

Correct:

```ts
const sumPrices = (items: Item[]): number =>
  items.reduce((total, item) => total + item.price, 0)
```

Hand-rolled recursion over a bounded collection reimplements a fold, badly. Use
`map` / `filter` / `fold` / `traverse`.

Source: Wadler — Monads for Functional Programming (folds)

## Laws

The laws are what make an abstraction worth having. Every new core primitive
ships with tests for them.

```
Functor:      map(id) == id
              map(f) . map(g) == map(f . g)

Monad:        chain(of(a), f) == f(a)              -- left identity
              chain(m, of) == m                    -- right identity
              chain(chain(m, f), g) == chain(m, x => chain(f(x), g))

Monoid:       concat(empty, a) == a
              concat(a, empty) == a
              concat(concat(a, b), c) == concat(a, concat(b, c))

Applicative:  ap(of(id), v) == v
              -- and: accumulates, never short-circuits
```

Associativity is not pedantry — it is the license to fold in any order and to
parallelize.
