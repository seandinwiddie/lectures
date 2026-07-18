---
name: fp
description: Functional programming standard for Sean Dinwiddie's codebases — Wadler's laws, Elliott's composition, Sinclair's practical monads. Use when writing or reviewing any code in the fp/rtk/ecs tri-core repos (therapy-one, therapy-12, magik-lux, sdk, sdk-ue-5, Lanternbough, frontier-of-jefferson), when adding to a functional core, when choosing an error representation, or when replacing branching/loops/classes. Covers Maybe, Either, Validation, Functor/Applicative/Monad/Monoid/Traversable, lenses, transducers, and the branching + arity policies the conformance gates enforce.
---

# FP

The standard for functional work across the tri-core repos. This is a **working
contract**, not an introduction. It assumes the decision to use FP is settled and
governs *how*.

## Canon

Three sources are authoritative. When guidance conflicts, prefer them in this order
for the question at hand:

| Source | Governs | Key works |
|---|---|---|
| **Philip Wadler** | Laws, algebraic structure, types | *Monads for Functional Programming*; *Theorems for Free!*; *The Expression Problem* |
| **Eric Elliott** | Composition, factories, arity | *Composing Software* |
| **James Sinclair** | Practical monads, effects, optics | *Elegant Error Handling with the JavaScript Either Monad*; *Transducers* |

**Reject generic FP advice.** Material pitched at teams deciding *whether* to adopt FP
— "consider using map", "don't be a zealot", "FP is wrong for games" — is noise here and
contradicts the conformance gates. If a source stops at explaining what a monad is, it
is below the floor of this codebase.

---

## Non-negotiables

These are enforced mechanically. Violating them fails CI.

1. **Zero classes.** Factory functions returning data + closures. No `new`, no `self`,
   no inheritance. (Elliott: composition over class inheritance.) UE reflection types
   and engine boundaries are the documented exception and stay thin.
2. **Two data parameters maximum.** Over-arity is fixed by *splitting the function*,
   not by bundling arguments into a payload struct — a struct hides the arity, it does
   not reduce the work. Use currying, partial application, functions-as-arguments,
   `compose`/`pipe3`/`pipe4`/`converge2`, and folds.
3. **No statement-level `if`/`for`/`while`/`switch`** in first-party runtime source.
   See Branching Policy below.
4. **`fp` is the import root.** `rtk` and `ecs` may depend on `fp`; `fp` depends on
   nothing. `ecs` never imports `rtk`.
5. **No lazy wrapper nouns** — `Manager`, `Helper`, `Util(s)`, `Bag`, `Fixture`. They
   hide the role. Name the composition boundary.

---

## Branching Policy

Do not mechanically replace `if` with ternary chains. A ternary chain is an `if` that
learned to hide. Branch replacement uses exactly one of these shapes:

1. **`match`** on `Maybe`, `Either`, or a small result struct.
2. **Dispatchers / `multi_match` case tables** for enum or string routing.
3. **`map` / `filter` / `fold` / `find` / `traverse`** for collection decisions.

Ternaries are acceptable only for small leaf value expressions. They are not the answer
for domain alternatives, validation, macros, logging, or effectful boundary code.

Decompose by **data shape**, not boolean condition. "What shape is this?" → pattern
match. "What property does this value have?" → predicate composed from `both`/
`either_pred`/`all_pass`/`complement`.

---

## The Primitive Ladder

Pick the weakest abstraction that solves the problem. Weaker means more laws, more
guarantees, more reuse.

| Need | Abstraction | Status in cores |
|---|---|---|
| Transform inside a container | **Functor** (`map`/`fmap`) | ✅ present |
| Combine N independent containers, collect all failures | **Applicative** (`ap`/`Validation`) | ❌ **missing** |
| Sequence dependent steps, short-circuit on first failure | **Monad** (`chain`/`bind`) | ✅ present |
| Collapse many same-type values into one | **Monoid** (`concat` + `empty`) | ❌ **missing** |
| Flip `Array<Maybe<T>>` into `Maybe<Array<T>>` | **Traversable** (`traverse`/`sequence`) | ❌ **missing** |
| Focused immutable update, deep structure | **Lens** | ❌ **missing** |
| Fuse map/filter/take without intermediates | **Transducer** | ❌ **missing** |

**Decision tree:**

```
Transforming values inside a container?
  one function, one container        -> Functor
  N independent containers           -> Applicative
  each step depends on the last      -> Monad
Combining same-type values?          -> Monoid
Container-of-containers to flip?     -> Traversable
```

### The Applicative rule

This is the most-violated distinction in the cores.

- **Monad = dependent + short-circuit.** Step 2 needs step 1's *value*. First failure wins.
- **Applicative = independent + accumulate.** All checks run. All failures collected.

Form validation, config validation, and request validation are **applicative**. A
`validation_pipeline` that folds with "if Right, continue; else return the error" is
monadic — it reports one error and discards the rest. That is the wrong shape for
anything a user has to fix.

```ts
// Monadic — short-circuits, reports one error
const validate = (u: User): Either<string, User> =>
  echain(checkName(u), () => echain(checkEmail(u), () => checkAge(u)))

// Applicative — runs all, accumulates every error
const validate = (u: User): Validation<string[], User> =>
  liftA3(mkUser, checkName(u), checkEmail(u), checkAge(u))
// Failure(['name too short', 'email invalid', 'age must be positive'])
```

`Validation` is `Either`'s shape with an accumulating `ap` and **no** `chain` —
omitting `chain` is deliberate. It is what stops the type from silently
short-circuiting.

---

## Error Model

Three classes. Choose deliberately; do not collapse them.

| Situation | Representation | Example |
|---|---|---|
| Expected absence, no diagnostic needed | `Maybe<T>` | Optional target not selected |
| Recoverable failure with useful context | `Either<E, T>` | Command fails domain validation |
| Independent failures, all worth reporting | `Validation<E[], T>` | Form / config / payload validation |
| Broken programmer invariant | assertion at a boundary | Required config never installed |

Do not turn every error into `Nothing` — that discards information. Do not throw for
ordinary domain outcomes — that hides a branch from the type. Do not use `Either` where
the caller needs every error at once.

Represent as plain tagged data, never as a class:

```ts
export type Maybe<T> =
  | { readonly _tag: 'Just'; readonly value: T }
  | { readonly _tag: 'Nothing' }
```

Keep rich functional wrappers **out of serializable state**. Redux state holds plain
data; lift into `Maybe`/`Either` at the selector or reducer edge.

---

## Composition

`pipe` reads left-to-right, `compose` reads right-to-left, execution is identical.
Choose per call site for readability and stay consistent within a module.

**Rules:**
- Prefer one reusable composer fed **grouped declaration data** over repeated typed
  factory families (`BindFloat`, `ComponentField`, `ReadMember`, `READ_FIELD_3`).
  Repeated per-field wrappers are the abstraction leaking.
- No hand-composed nested `compose(compose(...))`. Use `pipe3`/`pipe4`/`fold`.
- Point-free only when it reveals intent. Add the parameter back when it clarifies.
  (Elliott and Sinclair both stop short of tacit-everything; so do we.)
- Currying and partial application to capture stable inputs, not as decoration.

**Effects at the edges.** Pure core, effects pushed to boundaries. `tap`/`tap_mut` mark
an effect inside a pipeline explicitly — they are a *declaration* that something impure
happens here, not a loophole.

---

## Laws

Wadler's point: the laws are what make the abstraction worth having. New core primitives
ship with law tests.

```
Functor:      map(id) == id
              map(f) . map(g) == map(f . g)

Monad:        chain(of(a), f) == f(a)              -- left identity
              chain(m, of) == m                    -- right identity
              chain(chain(m, f), g) == chain(m, x => chain(f(x), g))

Monoid:       concat(empty, a) == a
              concat(a, empty) == a
              concat(concat(a,b), c) == concat(a, concat(b,c))

Applicative:  ap(of(id), v) == v
              -- and: accumulates, never short-circuits
```

Associativity is not pedantry — it is the license to parallelize and to fold in any
order.

---

## Cross-Core Parity

Eight first-party cores share one algebra:

| Repo | Core | Language |
|---|---|---|
| therapy-one | `src/fp.gd` | GDScript |
| therapy-12 | `src/functional.rs` | Rust |
| magik-lux | `core/src/functional.rs` | Rust |
| sdk | `packages/core/src/core/fp.ts` | TypeScript |
| sdk-ue-5 | `Source/.../Public/Core/fp.hpp` | C++11 |
| Lanternbough / frontier-of-jefferson | `fp.js` | JavaScript |
| api/hs | Prelude (no hand-rolled core) | Haskell |

A primitive added to one core is added to all, with matching names and matching law
tests. Naming adapts to host convention (`maybe_map` / `fmap` / `maybeMap`); semantics
do not.

**Reference the Haskell service when in doubt.** It uses `<*>` in 600+ places and has a
dedicated `Validation` surface. The hand-rolled cores are behind it, not ahead of it —
where they disagree, Haskell is right.

---

## Anti-Patterns

| Pattern | Why it fails | Fix |
|---|---|---|
| Payload struct to dodge arity limit | Hides the arity; function still does too much | Split the function; curry the stable inputs |
| `Either` for form validation | Reports one error, discards the rest | `Validation` with accumulating `ap` |
| Ternary chain replacing `if` | Same branch, worse readability | `match` / dispatch table / fold |
| Class wrapping a closure bundle | Reintroduces `new`, `self`, inheritance | Factory returning data + closures |
| `Manager` / `Helper` / `Utils` | Hides the role | Name the composition boundary |
| Everything into `Nothing` | Discards diagnostic information | `Either`/`Validation` with context |
| Rich wrappers in Redux state | Breaks serializability and time-travel | Plain data in state; lift at the edge |
| Nested `compose(compose(...))` | Hand-composed arity plumbing | `pipe3`/`pipe4`/`fold` |
| Manual recursion over a collection | Reimplements a fold, badly | `map`/`filter`/`fold`/`traverse` |

---

## Open Port Targets

The cores currently lack the entire applicative-and-above layer. In priority order:

1. **`Validation<E[], T>`** — accumulating `ap`, no `chain`. Highest value: fixes
   short-circuiting validation across all eight cores.
2. **Monoid** — `concat`/`empty` + `foldMap`. Unlocks lawful, parallelizable folds.
3. **`traverse` / `sequence`** — already named as required in the SDK conformance
   contract but absent from the Rust core; a real parity hole.
4. **Lenses** — `view`/`set`/`over` for deep immutable update.
5. **Transducers** — fuse map/filter/take without intermediate collections.
