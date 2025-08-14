# Monads in Functional Programming

This lecture introduces monads as a way to handle side effects and complex computations in functional programming.

## What are Monads?

Monads are like smart containers that wrap values and provide a consistent way to work with operations that might fail, have side effects, or produce multiple results. Think of them as boxes with special rules for how you can interact with what's inside. They help you handle uncertainty and complexity in a predictable way.

### Maybe Monad

The Maybe monad is like a smart box that might or might not contain a value. Instead of using `null` or `undefined` (which can cause errors), Maybe forces you to handle both the success and failure cases explicitly. The `map` function transforms the value if it exists, and `bind` lets you chain operations that might also fail. This makes your code safer and more predictable.
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

The Either monad is like a smart box that can contain either a success value or an error message. It's perfect for operations that might fail, like parsing numbers or making API calls. Instead of throwing errors or returning null, Either makes you handle both success and error cases explicitly. The `map` function transforms success values while preserving errors, and `bind` lets you chain operations that might also fail.
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

Monads follow specific mathematical laws that ensure they work predictably. The left identity law says that if you put a value in a monad and then bind a function to it, it's the same as just calling that function directly with the value. This might sound abstract, but it ensures that monads don't change the meaning of your operations - they just add safety and structure.
```typescript
// return a >>= f ≡ f a
const leftIdentity = <T, U>(a: T, f: (x: T) => Maybe<U>): boolean => {
  const lhs = Maybe.just(a).bind(f);
  const rhs = f(a);
  return lhs.getOrElse(null) === rhs.getOrElse(null);
};
```

### Right Identity

The right identity law says that if you bind a function that just puts a value back into a monad, you get the same result as if you hadn't done anything. This ensures that monads don't add unnecessary complexity - they only add value when you need the extra safety or structure they provide.
```typescript
// m >>= return ≡ m
const rightIdentity = <T>(m: Maybe<T>): boolean => {
  const lhs = m.bind(x => Maybe.just(x));
  return lhs.getOrElse(null) === m.getOrElse(null);
};
```

### Associativity

The associativity law says that the order in which you group your monadic operations doesn't matter - you get the same result either way. This is like how addition is associative: (a + b) + c = a + (b + c). This law ensures that you can chain monadic operations in any order and get predictable results.
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

This example shows how the Maybe monad handles division by zero safely. Instead of throwing an error or returning undefined, the `safeDivide` function returns a Maybe that might contain a result or might be empty. We can chain multiple division operations together, and if any step fails (like division by zero), the whole chain safely returns the default value.
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

This example shows how the Either monad handles parsing errors gracefully. Instead of throwing an exception when parsing fails, the `parseNumber` function returns an Either that contains either a success value or an error message. We can then transform the success value with `map` and handle both success and error cases explicitly with `fold`, making our error handling predictable and safe.
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
