---
title: "Performance Optimization Techniques"
description: "This lecture explores performance optimization techniques in functional programming."
layout: lecture
---

# Performance Optimization Techniques

This lecture explores performance optimization techniques in functional programming.

Functional programming does not make performance automatic. Purity and
immutability make some optimizations easier to justify, but measurement still
decides whether memoization, laziness, or structural sharing is worthwhile.

## Memoization

> "Memoization is referential transparency weaponized: if f(x) always equals f(x), cache it. Pure functions make this optimization trivial—React.useMemo, reselect, and lodash.memoize all exploit this property." - AI Insight

### Basic Memoization

Memoization stores the result of a function call and reuses it for an equivalent
input. This is sound only when the function is pure and the cache's equality
rule matches the function's input semantics. The following cache uses `Map`
identity: primitive values compare by value, while objects compare by reference.

```typescript
const memoize = <T, U>(fn: (arg: T) => U) => {
  const cache = new Map<T, U>();
  return (arg: T): U => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};

// Example: Memoized factorial
const factorial = memoize((n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

console.log(factorial(5)); // Computed: 120
console.log(factorial(5)); // Cached: 120
```

This teaching implementation has no eviction policy. Production caches need a
bounded lifetime when the input space can grow indefinitely.

### Multi-Argument Memoization

Serializing arguments is not a general cache-key strategy: serialization can
fail, discard information, or treat semantically equivalent objects as
different. A small and predictable alternative is a one-entry cache. It is
useful when a selector or calculation is commonly called repeatedly with the
same argument references.

```typescript
const memoizeLast = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result
) => {
  let cache: { args: Args; result: Result } | undefined;

  return (...args: Args): Result => {
    const previous = cache;
    if (
      previous !== undefined
      && previous.args.length === args.length
      && args.every((arg, index) => Object.is(arg, previous.args[index]))
    ) {
      return previous.result;
    }

    const result = fn(...args);
    cache = { args, result };
    return result;
  };
};

const add = memoizeLast((a: number, b: number): number => a + b);
```

## Lazy Evaluation

> "Lazy evaluation inverts control: compute only what's needed, when it's needed. Infinite sequences become trivial, and expensive computations happen only if their results are actually used. Haskell's default, JavaScript's generators." - AI Insight

### Lazy Lists

Lazy lists compute a node only when a consumer requests it. Both the node and
its tail must be deferred; accepting an already-built tail would recursively
construct an infinite sequence before a consumer could read its first value.
This implementation also memoizes each forced node so repeated reads do not
repeat the computation.

```typescript
type LazyNode<T> = Readonly<{
  head: T;
  tail: () => LazyList<T>;
}> | null;

class LazyList<T> {
  private forced = false;
  private cached: LazyNode<T> | undefined;

  private constructor(private readonly evaluate: () => LazyNode<T>) {}

  private force(): LazyNode<T> {
    if (!this.forced) {
      this.cached = this.evaluate();
      this.forced = true;
    }
    return this.cached ?? null;
  }

  static empty<T>(): LazyList<T> {
    return new LazyList(() => null);
  }

  static cons<T>(head: T, tail: () => LazyList<T>): LazyList<T> {
    return new LazyList(() => ({ head, tail }));
  }

  static fromArray<T>(
    values: ReadonlyArray<T>,
    index = 0
  ): LazyList<T> {
    if (index >= values.length) return LazyList.empty();
    const head = values[index]!;
    return LazyList.cons(head, () => LazyList.fromArray(values, index + 1));
  }

  head(): T | undefined {
    return this.force()?.head;
  }

  tail(): LazyList<T> | undefined {
    return this.force()?.tail();
  }

  map<U>(fn: (value: T) => U): LazyList<U> {
    return new LazyList<U>(() => {
      const node = this.force();
      return node === null
        ? null
        : {
            head: fn(node.head),
            tail: () => node.tail().map(fn)
          };
    });
  }

  take(n: number): T[] {
    const limit = Math.max(0, Math.floor(n));
    const values: T[] = [];
    let current: LazyList<T> = this;

    while (values.length < limit) {
      const node = current.force();
      if (node === null) break;
      values.push(node.head);
      current = node.tail();
    }

    return values;
  }
}

// Example: Infinite sequence
const naturalsFrom = (n: number): LazyList<number> =>
  LazyList.cons(n, () => naturalsFrom(n + 1));

const naturals = naturalsFrom(0);

console.log(naturals.take(5)); // [0, 1, 2, 3, 4]
```

## Stream Processing

### Efficient Data Processing

JavaScript generators provide a native pull-based stream abstraction. The
following transforms are lazy: they request source values only as the consumer
iterates. Generator objects are single-use, so create a new generator when a
pipeline must run again.

```typescript
function* mapIterable<A, B>(
  source: Iterable<A>,
  transform: (value: A) => B
): Generator<B> {
  for (const value of source) {
    yield transform(value);
  }
}

function* filterIterable<T>(
  source: Iterable<T>,
  predicate: (value: T) => boolean
): Generator<T> {
  for (const value of source) {
    if (predicate(value)) {
      yield value;
    }
  }
}

const take = <T>(source: Iterable<T>, count: number): T[] => {
  const limit = Math.max(0, Math.floor(count));
  const values: T[] = [];
  if (limit === 0) return values;

  for (const value of source) {
    values.push(value);
    if (values.length >= limit) break;
  }
  return values;
};

function* naturalNumbers(): Generator<number> {
  let value = 0;
  while (true) yield value++;
}

const evenSquares = mapIterable(
  filterIterable(naturalNumbers(), (n) => n % 2 === 0),
  (n) => n * n
);

console.log(take(evenSquares, 4)); // [0, 4, 16, 36]
```

## Tail Call Optimization

### Recursive Functions

In a runtime with proper tail calls, a tail-position recursive call can reuse the
current stack frame. Portable JavaScript cannot rely on that optimization, so a
tail-recursive function may still overflow. A trampoline represents each next
step as data and advances it with an ordinary loop.

```typescript
// Non-tail recursive (can cause stack overflow)
const naiveFactorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * naiveFactorial(n - 1);
};

// Tail-position recursion is still not portably stack-safe in JavaScript.
const tailRecursiveFactorial = (n: number, acc = 1): number => {
  if (n <= 1) return acc;
  return tailRecursiveFactorial(n - 1, n * acc);
};

type Bounce<T> =
  | Readonly<{ done: true; value: T }>
  | Readonly<{ done: false; next: () => Bounce<T> }>;

const done = <T>(value: T): Bounce<T> => ({ done: true, value });
const call = <T>(next: () => Bounce<T>): Bounce<T> => ({
  done: false,
  next
});

const trampoline = <T>(initial: Bounce<T>): T => {
  let current = initial;
  while (!current.done) {
    current = current.next();
  }
  return current.value;
};

const factorialBounce = (n: number, acc = 1): Bounce<number> =>
  n <= 1
    ? done(acc)
    : call(() => factorialBounce(n - 1, n * acc));

const factorialTrampoline = (n: number): number =>
  trampoline(factorialBounce(n));

console.log(factorialTrampoline(5)); // 120
```

## Immutable Data Structures

### Efficient Updates

Persistent data structures return a new version while retaining the old one.
They can share unchanged nodes instead of copying the entire structure. A
persistent linked stack is a small, complete example: `push` allocates one node
and shares the previous stack as its tail.

```typescript
type StackNode<T> = Readonly<{
  value: T;
  next: StackNode<T> | null;
}>;

class PersistentStack<T> {
  private constructor(
    private readonly topNode: StackNode<T> | null,
    readonly size: number
  ) {}

  static empty<T>(): PersistentStack<T> {
    return new PersistentStack<T>(null, 0);
  }

  push(value: T): PersistentStack<T> {
    return new PersistentStack(
      { value, next: this.topNode },
      this.size + 1
    );
  }

  peek(): T | undefined {
    return this.topNode?.value;
  }

  toArray(): T[] {
    const values: T[] = [];
    let node = this.topNode;
    while (node !== null) {
      values.push(node.value);
      node = node.next;
    }
    return values;
  }
}

const empty = PersistentStack.empty<number>();
const one = empty.push(1);
const two = one.push(2);

console.log(one.toArray()); // [1] - the old version is unchanged
console.log(two.toArray()); // [2, 1]
```

## Performance Monitoring

### Function Performance

Performance monitoring helps identify bottlenecks before optimization. This
wrapper measures synchronous execution time and reports it even when the
wrapped function throws. Use an async-aware timer for promises and a benchmark
harness for statistically meaningful comparisons.

```typescript
const measurePerformance = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  name: string
) => {
  return (...args: Args): Result => {
    const start = performance.now();
    try {
      return fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`${name} took ${duration}ms`);
    }
  };
};

// Usage
const expensiveOperation = measurePerformance(
  (n: number) => {
    let result = 0;
    for (let i = 0; i < n; i++) {
      result += i;
    }
    return result;
  },
  'Expensive Operation'
);

console.log(expensiveOperation(1000000));
```

### Memory Usage

JavaScript does not expose a portable, deterministic per-function heap metric.
Chromium exposes a non-standard approximation, but garbage collection can make
the delta noisy or negative. Treat this helper as a diagnostic hint and use the
runtime's memory profiler for real analysis.

```typescript
type ChromiumPerformance = Performance & {
  memory?: { usedJSHeapSize: number };
};

const usedHeapSize = (): number | undefined =>
  (performance as ChromiumPerformance).memory?.usedJSHeapSize;

const measureApproximateHeap = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result
) => {
  return (...args: Args): {
    result: Result;
    approximateBytes: number | undefined;
  } => {
    const before = usedHeapSize();
    const result = fn(...args);
    const after = usedHeapSize();
    return {
      result,
      approximateBytes: before === undefined || after === undefined
        ? undefined
        : after - before
    };
  };
};
```

## Exercise

Implement a memoized version of the Fibonacci function that uses a persistent data structure for caching, and compare its performance with a naive recursive implementation.

## Resources

- [Optimizing Functional Programs](https://www.cs.kent.ac.uk/people/staff/dat/miranda/whyfp90.pdf)
