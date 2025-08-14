# Monads in Functional Programming

This lecture introduces monads as a way to handle side effects and complex computations in functional programming.

## What are Monads?

Monads are a way to wrap values and provide a consistent interface for operations that might fail, have side effects, or produce multiple results.

### Maybe Monad
```typescript
class Maybe<T> {
  private constructor(private value: T | null) {}

  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing<U>()
      : Maybe.just(fn(this.value));
  }

  bind<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing<U>()
      : fn(this.value);
  }

  getOrElse(defaultValue: T): T {
    return this.value === null ? defaultValue : this.value;
  }
}
```

### Either Monad
```typescript
class Either<L, R> {
  private constructor(
    private leftValue: L | null,
    private rightValue: R | null,
    private isLeft: boolean
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either(value, null, true);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(null, value, false);
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isLeft 
      ? Either.left<L, U>(this.leftValue!)
      : Either.right<L, U>(fn(this.rightValue!));
  }

  bind<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isLeft 
      ? Either.left<L, U>(this.leftValue!)
      : fn(this.rightValue!);
  }
}
```

## Monad Laws

### Left Identity
```typescript
// return a >>= f ≡ f a
const leftIdentity = <T, U>(a: T, f: (x: T) => Maybe<U>): boolean => {
  const lhs = Maybe.just(a).bind(f);
  const rhs = f(a);
  return lhs.getOrElse(null) === rhs.getOrElse(null);
};
```

### Right Identity
```typescript
// m >>= return ≡ m
const rightIdentity = <T>(m: Maybe<T>): boolean => {
  const lhs = m.bind(x => Maybe.just(x));
  return lhs.getOrElse(null) === m.getOrElse(null);
};
```

### Associativity
```typescript
// (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g)
const associativity = <T, U, V>(
  m: Maybe<T>,
  f: (x: T) => Maybe<U>,
  g: (x: U) => Maybe<V>
): boolean => {
  const lhs = m.bind(f).bind(g);
  const rhs = m.bind(x => f(x).bind(g));
  return lhs.getOrElse(null) === rhs.getOrElse(null);
};
```

## Real-World Examples

### Safe Division
```typescript
const safeDivide = (a: number, b: number): Maybe<number> => {
  return b === 0 ? Maybe.nothing() : Maybe.just(a / b);
};

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .bind(x => safeDivide(x, 5))
  .getOrElse(0);

console.log(result); // 1
```

### Error Handling
```typescript
const parseNumber = (str: string): Either<string, number> => {
  const num = parseInt(str);
  return isNaN(num) 
    ? Either.left('Invalid number')
    : Either.right(num);
};

const result = parseNumber('123')
  .map(x => x * 2)
  .fold(
    error => `Error: ${error}`,
    value => `Result: ${value}`
  );

console.log(result); // "Result: 246"
```

## Exercise
Implement a List monad that can handle computations that produce multiple results.

## Resources
- [Monads in JavaScript](https://blog.klipse.tech/javascript/2016/08/31/monads-javascript.html)
- [Functional Programming with Monads](https://en.wikibooks.org/wiki/Haskell/Understanding_monads)
