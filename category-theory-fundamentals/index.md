# Category Theory Fundamentals

This lecture introduces the mathematical foundations of functional programming through category theory.

## What is Category Theory?

Category theory is a branch of mathematics that studies abstract structures and relationships between them. It provides a unified language for understanding functional programming concepts.

### Basic Concepts

#### Objects and Morphisms
```typescript
// In programming, objects are types and morphisms are functions
interface Category<A, B> {
  // Objects: A, B (types)
  // Morphisms: functions from A to B
  morphism: (a: A) => B;
}

// Example: Category of types and functions
const stringToNumber: Category<string, number> = {
  morphism: (str: string) => parseInt(str)
};
```

#### Identity Morphism
```typescript
// Every object has an identity morphism
const identity = <A>(a: A): A => a;

// Identity laws
const leftIdentity = <A, B>(f: (a: A) => B, a: A): boolean => {
  return compose(f, identity)(a) === f(a);
};

const rightIdentity = <A, B>(f: (a: A) => B, a: A): boolean => {
  return compose(identity, f)(a) === f(a);
};
```

#### Composition
```typescript
// Morphisms can be composed
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A): C => f(g(a));

// Composition must be associative
const associativity = <A, B, C, D>(
  f: (c: C) => D,
  g: (b: B) => C,
  h: (a: A) => B,
  a: A
): boolean => {
  const lhs = compose(compose(f, g), h)(a);
  const rhs = compose(f, compose(g, h))(a);
  return lhs === rhs;
};
```

## Functors

Functors are mappings between categories that preserve structure.

### Functor Laws
```typescript
interface Functor<F> {
  map<A, B>(f: (a: A) => B, fa: F<A>): F<B>;
}

// Identity law: map(id) = id
const functorIdentity = <F, A>(fa: F<A>, functor: Functor<F>): boolean => {
  return functor.map(identity, fa) === fa;
};

// Composition law: map(f ∘ g) = map(f) ∘ map(g)
const functorComposition = <F, A, B, C>(
  fa: F<A>,
  f: (b: B) => C,
  g: (a: A) => B,
  functor: Functor<F>
): boolean => {
  const lhs = functor.map(compose(f, g), fa);
  const rhs = compose(
    (fb: F<B>) => functor.map(f, fb),
    (fa: F<A>) => functor.map(g, fa)
  )(fa);
  return lhs === rhs;
};
```

### Array Functor
```typescript
const arrayFunctor: Functor<Array> = {
  map: <A, B>(f: (a: A) => B, fa: A[]): B[] => fa.map(f)
};

// Example usage
const numbers = [1, 2, 3, 4, 5];
const doubled = arrayFunctor.map(x => x * 2, numbers);
console.log(doubled); // [2, 4, 6, 8, 10]
```

## Natural Transformations

Natural transformations are mappings between functors.

```typescript
interface NaturalTransformation<F, G> {
  transform<A>(fa: F<A>): G<A>;
}

// Example: Maybe to Array transformation
const maybeToArray: NaturalTransformation<Maybe, Array> = {
  transform: <A>(ma: Maybe<A>): A[] => {
    return ma.isJust() ? [ma.getOrElse(null!)] : [];
  }
};
```

## Monads as Monoids

Monads can be understood as monoids in the category of endofunctors.

```typescript
interface Monad<M> extends Functor<M> {
  unit<A>(a: A): M<A>;
  join<A>(mma: M<M<A>>): M<A>;
}

// Monad laws
const monadLeftIdentity = <M, A, B>(
  a: A,
  f: (a: A) => M<B>,
  monad: Monad<M>
): boolean => {
  const lhs = monad.join(monad.map(f, monad.unit(a)));
  const rhs = f(a);
  return lhs === rhs;
};

const monadRightIdentity = <M, A>(
  ma: M<A>,
  monad: Monad<M>
): boolean => {
  const lhs = monad.join(monad.map(monad.unit, ma));
  const rhs = ma;
  return lhs === rhs;
};
```

## Real-World Applications

### Type-Safe Data Processing
```typescript
// Using category theory concepts for safe data transformation
interface User {
  id: number;
  name: string;
  email: string;
}

// Functor for safe property access
const safeProp = <T, K extends keyof T>(key: K) => (obj: T): Maybe<T[K]> => {
  return obj[key] !== undefined ? Maybe.just(obj[key]) : Maybe.nothing();
};

// Natural transformation for validation
const validateUser = (user: any): Either<string, User> => {
  if (!user.name) return Either.left('Name is required');
  if (!user.email) return Either.left('Email is required');
  return Either.right(user as User);
};

// Composition of transformations
const processUser = pipe(
  validateUser,
  userEither => userEither.map(user => ({
    ...user,
    name: user.name.toUpperCase()
  }))
);
```

## Exercise
Implement a Kleisli category for monadic composition and prove the monad laws.

## Resources
- [Category Theory for Programmers](https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/)
- [Category Theory in Context](https://math.jhu.edu/~eriehl/context.pdf)
