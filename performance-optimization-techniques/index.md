# Performance Optimization Techniques

This lecture explores performance optimization techniques in functional programming.

> "Functional programming enables performance optimizations that imperative code cannot: memoization works because of purity, lazy evaluation works because of immutability, and structural sharing works because data never changes." - AI Insight

## Memoization

### Basic Memoization

Memoization is like having a smart memory that remembers the results of expensive calculations. Since pure functions always return the same result for the same inputs, you can safely store the result and return it immediately the next time you call the function with the same input. This is especially useful for recursive functions like factorial, where the same calculations are repeated many times.
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

### Multi-Argument Memoization

When functions take multiple arguments, you need a way to create a unique key for each combination of arguments. The `JSON.stringify` approach converts the arguments into a string that can be used as a cache key. This lets you memoize functions with any number of arguments, making them much faster when called repeatedly with the same inputs.
```typescript
const memoizeMulti = <T extends any[], U>(fn: (...args: T) => U) => {
  const cache = new Map<string, U>();
  return (...args: T): U => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Example: Memoized addition
const add = memoizeMulti((a: number, b: number): number => a + b);
```

## Lazy Evaluation

### Lazy Lists

Lazy lists are like infinite sequences that only compute values when you actually need them. Instead of creating all the values upfront (which could be infinite and crash your program), lazy lists create a promise to compute each value when it's requested. This is perfect for working with potentially infinite data like number sequences, where you only need a few values at a time.
```typescript
class LazyList<T> {
  private constructor(private thunk: () => { head: T; tail: LazyList<T> } | null) {}

  static empty<T>(): LazyList<T> {
    return new LazyList(() => null);
  }

  static cons<T>(head: T, tail: LazyList<T>): LazyList<T> {
    return new LazyList(() => ({ head, tail }));
  }

  static fromArray<T>(arr: T[]): LazyList<T> {
    if (arr.length === 0) return LazyList.empty();
    return LazyList.cons(arr[0], LazyList.fromArray(arr.slice(1)));
  }

  head(): T | null {
    const result = this.thunk();
    return result ? result.head : null;
  }

  tail(): LazyList<T> | null {
    const result = this.thunk();
    return result ? result.tail : null;
  }

  map<U>(fn: (value: T) => U): LazyList<U> {
    const result = this.thunk();
    if (!result) return LazyList.empty();
    return LazyList.cons(fn(result.head), result.tail.map(fn));
  }

  take(n: number): T[] {
    if (n <= 0) return [];
    const result = this.thunk();
    if (!result) return [];
    return [result.head, ...result.tail.take(n - 1)];
  }
}

// Example: Infinite sequence
const naturals = (() => {
  const generate = (n: number): LazyList<number> => 
    LazyList.cons(n, generate(n + 1));
  return generate(0);
})();

console.log(naturals.take(5)); // [0, 1, 2, 3, 4]
```

## Stream Processing

### Efficient Data Processing

Streams are like lazy lists but optimized for processing large amounts of data efficiently. They only compute the values you actually need, which can save enormous amounts of memory and processing time when working with large datasets. Streams are perfect for data processing pipelines where you might only need the first few results or want to process data one piece at a time.
```typescript
interface Stream<T> {
  head(): T | null;
  tail(): Stream<T>;
  isEmpty(): boolean;
}

class StreamImpl<T> implements Stream<T> {
  private constructor(
    private _head: T | null,
    private _tail: () => Stream<T>
  ) {}

  static empty<T>(): Stream<T> {
    return new StreamImpl<T>(null, () => StreamImpl.empty());
  }

  static cons<T>(head: T, tail: () => Stream<T>): Stream<T> {
    return new StreamImpl(head, tail);
  }

  head(): T | null {
    return this._head;
  }

  tail(): Stream<T> {
    return this._tail();
  }

  isEmpty(): boolean {
    return this._head === null;
  }

  map<U>(fn: (value: T) => U): Stream<U> {
    if (this.isEmpty()) return StreamImpl.empty();
    return StreamImpl.cons(
      fn(this.head()!),
      () => this.tail().map(fn)
    );
  }

  filter(predicate: (value: T) => boolean): Stream<T> {
    if (this.isEmpty()) return StreamImpl.empty();
    const head = this.head()!;
    if (predicate(head)) {
      return StreamImpl.cons(head, () => this.tail().filter(predicate));
    }
    return this.tail().filter(predicate);
  }

  take(n: number): T[] {
    if (n <= 0 || this.isEmpty()) return [];
    return [this.head()!, ...this.tail().take(n - 1)];
  }
}
```

## Tail Call Optimization

### Recursive Functions

Tail call optimization is a technique that prevents stack overflow in recursive functions. A tail call is when a function calls itself as the very last thing it does. In this case, the computer can reuse the same stack frame instead of creating a new one for each recursive call. The trampoline pattern is a way to simulate tail call optimization in languages that don't support it natively.
```typescript
// Non-tail recursive (can cause stack overflow)
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Not tail recursive
};

// Tail recursive (can be optimized)
const factorialTail = (n: number, acc: number = 1): number => {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // Tail recursive
};

// Tail recursive with trampoline
const trampoline = <T>(fn: (...args: any[]) => T | (() => T)) => {
  let result = fn();
  while (typeof result === 'function') {
    result = result();
  }
  return result;
};

const factorialTrampoline = (n: number): number => {
  const factorialHelper = (n: number, acc: number = 1): number | (() => number) => {
    if (n <= 1) return acc;
    return () => factorialHelper(n - 1, n * acc);
  };
  return trampoline(() => factorialHelper(n));
};
```

## Immutable Data Structures

### Efficient Updates

Immutable data structures are designed to be efficient even when you need to make changes. Instead of copying the entire structure, they use clever techniques like tree structures to share unchanged parts between the old and new versions. This gives you the safety of immutability without the performance penalty of copying everything. The persistent vector is a great example of this approach.
```typescript
// Persistent Vector (simplified)
class Vector<T> {
  private constructor(
    private size: number,
    private root: Node<T> | null,
    private tail: T[]
  ) {}

  static empty<T>(): Vector<T> {
    return new Vector(0, null, []);
  }

  push(value: T): Vector<T> {
    if (this.tail.length < 32) {
      const newTail = [...this.tail, value];
      return new Vector(this.size + 1, this.root, newTail);
    }
    // Implementation for larger vectors would use a tree structure
    return new Vector(this.size + 1, this.root, [value]);
  }

  get(index: number): T | undefined {
    if (index < 0 || index >= this.size) return undefined;
    if (index >= this.size - this.tail.length) {
      return this.tail[index - (this.size - this.tail.length)];
    }
    // Implementation for tree traversal would go here
    return undefined;
  }
}

interface Node<T> {
  children: (Node<T> | null)[];
}
```

## Performance Monitoring

### Function Performance

Performance monitoring helps you understand how fast your functions are running and identify bottlenecks. The `measurePerformance` function wraps any function and automatically measures how long it takes to execute. This is essential for optimizing functional programs because it helps you identify which operations are taking the most time and where you should focus your optimization efforts.
```typescript
const measurePerformance = <T extends any[], U>(
  fn: (...args: T) => U,
  name: string
) => {
  return (...args: T): U => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start}ms`);
    return result;
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

Memory monitoring is just as important as performance monitoring, especially in functional programming where you might create many intermediate objects. The `measureMemory` function tracks how much memory your functions use, helping you identify memory leaks or inefficient memory usage patterns. This is crucial for applications that need to run for long periods or handle large amounts of data.
```typescript
const measureMemory = <T extends any[], U>(
  fn: (...args: T) => U
) => {
  return (...args: T): U => {
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const result = fn(...args);
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
    console.log(`Memory used: ${endMemory - startMemory} bytes`);
    return result;
  };
};
```

## Exercise
Implement a memoized version of the Fibonacci function that uses a persistent data structure for caching, and compare its performance with a naive recursive implementation.

## Resources
- [Functional Programming Performance](https://www.functionalprogramming.com/)
- [Optimizing Functional Programs](https://www.cs.kent.ac.uk/people/staff/dat/miranda/whyfp90.pdf)
