# What is a function?

This lecture introduces the fundamental concept of functions in TypeScript and how they form the basis of functional programming. This is where your journey into **lean, modular functional programming** begins. You'll learn to write functions that are **pure, testable, and composable** - the building blocks of maintainable codebases.

**Why This Matters for Maintenance:**
- **Pure functions** are the foundation of predictable, debuggable code
- **Type safety** prevents runtime errors and makes refactoring safer
- **Function composition** enables building complex systems from simple parts
- **Immutability** ensures your functions don't have hidden side effects

## Function Fundamentals in TypeScript

### Function Declarations

Functions are like recipes - they take ingredients (parameters), do something with them, and give you back a result. In TypeScript, we can be very specific about what types of ingredients our functions accept and what type of result they return. This helps catch mistakes before your code even runs!
```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - The first number to add
 * @param b - The second number to add
 * @returns The sum of a and b
 * 
 * @example
 * add(2, 3) // returns 5
 * add(-1, 1) // returns 0
 * add(10, 20) // returns 30
 */
function add(a: number, b: number): number {
  return a + b;
}

// Function with optional parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}
/**
 * Creates a personalized greeting message.
 * @param name - The name of the person to greet
 * @param greeting - Optional greeting word (defaults to "Hello")
 * @returns A formatted greeting string
 * 
 * @example
 * greet("Alice") // returns "Hello, Alice!"
 * greet("Bob", "Goodbye") // returns "Goodbye, Bob!"
 * greet("World", "Hi") // returns "Hi, World!"
 */

// Function with rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}
/**
 * Calculates the sum of all provided numbers.
 * @param numbers - Variable number of numbers to sum
 * @returns The total sum of all numbers (0 if no numbers provided)
 * 
 * @example
 * sum(1, 2, 3) // returns 6
 * sum(5) // returns 5
 * sum() // returns 0
 * sum(1, 2, 3, 4, 5) // returns 15
 */
```

### Function Expressions

You can also create functions by assigning them to variables, just like you would with any other value. Arrow functions (using `=>`) are a shorter way to write functions, especially when they're simple. The `identity` function is a special case - it just returns whatever you give it, unchanged.
```typescript
// Function expression with type annotation
const multiply: (a: number, b: number) => number = (a, b) => a * b;
/**
 * Multiplies two numbers together.
 * @param a - The first number to multiply
 * @param b - The second number to multiply
 * @returns The product of a and b
 * 
 * @example
 * multiply(3, 4) // returns 12
 * multiply(0, 5) // returns 0
 * multiply(-2, 3) // returns -6
 */

// Arrow function with explicit types
const divide = (a: number, b: number): number => a / b;
/**
 * Divides the first number by the second number.
 * @param a - The dividend (number to be divided)
 * @param b - The divisor (number to divide by)
 * @returns The quotient of a divided by b (Infinity if b is 0)
 * 
 * @example
 * divide(10, 2) // returns 5
 * divide(15, 3) // returns 5
 * divide(7, 2) // returns 3.5
 * divide(5, 0) // returns Infinity
 */

// Function with generic types
const identity = <T>(value: T): T => value;
/**
 * Returns the input value unchanged (identity function).
 * @param value - Any value to return
 * @returns The same value that was passed in
 * 
 * @example
 * identity(5) // returns 5
 * identity("hello") // returns "hello"
 * identity([1, 2, 3]) // returns [1, 2, 3]
 */
```

### Function Types

Just like we can have types for numbers and strings, we can have types for functions! This is really useful because it lets us be very clear about what kind of function we expect. A `Predicate` is a function that returns true or false, and a `Transformer` is a function that changes one type of data into another.
```typescript
// Function type aliases
type BinaryOperation = (a: number, b: number) => number;
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (item: T) => U;

// Using function types
const add: BinaryOperation = (a, b) => a + b;
/**
 * Adds two numbers together.
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 * 
 * @example
 * add(3, 7) // returns 10
 */
const isEven: Predicate<number> = (n) => n % 2 === 0;
/**
 * Checks if a number is even.
 * @param n - The number to check
 * @returns True if the number is even, false otherwise
 * 
 * @example
 * isEven(4) // returns true
 * isEven(7) // returns false
 */
const double: Transformer<number, number> = (n) => n * 2;
/**
 * Doubles a number by multiplying it by 2.
 * @param n - The number to double
 * @returns The number multiplied by 2
 * 
 * @example
 * double(5) // returns 10
 * double(0) // returns 0
 */
```

## Pure Functions

### Characteristics of Pure Functions

Pure functions are like math functions - they always give you the same answer for the same inputs, and they don't change anything else in your program. This makes them predictable and easy to test. The examples show the difference between pure functions (which are good) and impure functions (which can cause bugs).
```typescript
// ✅ Pure function - same input always produces same output
/**
 * Pure function that adds two numbers together.
 * Always returns the same result for the same inputs with no side effects.
 * @param a - First number to add
 * @param b - Second number to add
 * @returns The sum of a and b
 * 
 * @example
 * add(2, 3) // returns 5
 * add(2, 3) // returns 5 (same result every time)
 * add(0, 0) // returns 0
 */
const add = (a: number, b: number): number => a + b;

// ✅ Pure function - no side effects
const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};
/**
 * Formats a full name by combining first and last names.
 * Trims whitespace and has no side effects.
 * @param firstName - The person's first name
 * @param lastName - The person's last name
 * @returns The formatted full name with trimmed whitespace
 * 
 * @example
 * formatName("John", "Doe") // returns "John Doe"
 * formatName("  Jane  ", "  Smith  ") // returns "Jane Smith"
 */

// ❌ Impure function - depends on external state
let total = 0;
/**
 * Impure function that adds a number to a global total.
 * WARNING: This function mutates external state and is not pure.
 * @param num - The number to add to the total
 * @returns The new total after adding the number
 * 
 * @example
 * addToTotal(5) // returns 5 (first call)
 * addToTotal(3) // returns 8 (second call, depends on previous state)
 * addToTotal(2) // returns 10 (third call, depends on previous state)
 */
const addToTotal = (num: number): number => {
  total += num; // Mutates external state - makes function unpredictable
  return total;
};

/**
 * Impure function that adds two numbers with console logging.
 * WARNING: This function has side effects and is not pure.
 * @param a - First number to add
 * @param b - Second number to add
 * @returns The sum of a and b
 * 
 * @example
 * addWithLogging(2, 3) // logs "Adding numbers", returns 5
 * addWithLogging(10, 5) // logs "Adding numbers", returns 15
 */
const addWithLogging = (a: number, b: number): number => {
  console.log('Adding numbers'); // Side effect: interacts with external system
  return a + b;
};
```

### Benefits of Pure Functions

Pure functions have superpowers! They're easy to test because you know exactly what they'll do. You can also "remember" their results (called memoization) to avoid doing the same work twice. This is especially useful for expensive calculations that you might do multiple times.
```typescript
// 1. Predictable and testable
/**
 * Tests the add function to ensure it works correctly.
 * Demonstrates how pure functions are easy to test.
 * @returns True if all test cases pass, false otherwise
 * 
 * @example
 * testAdd() // returns true (if add function works correctly)
 */
const testAdd = (): boolean => {
  return add(2, 3) === 5 && add(0, 0) === 0;
};

// 2. Memoizable
/**
 * Creates a memoized version of a function that caches results.
 * Pure functions can be safely memoized since same input always produces same output.
 * @param fn - The function to memoize
 * @returns A memoized version of the function that caches results
 * 
 * @example
 * const memoizedAdd = memoize((a: number) => a + 1);
 * memoizedAdd(5) // returns 6 (computed)
 * memoizedAdd(5) // returns 6 (cached)
 */
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

/**
 * Expensive calculation function that computes the cube of a number.
 * This function is memoized to avoid recalculating the same values.
 * @param n - The number to cube
 * @returns The cube of the input number (n³)
 * 
 * @example
 * expensiveCalculation(3) // returns 27 (computed)
 * expensiveCalculation(3) // returns 27 (cached)
 * expensiveCalculation(5) // returns 125 (computed)
 */
const expensiveCalculation = memoize((n: number): number => {
  // Simulate expensive computation
  return n * n * n;
});
```

## Higher-Order Functions

### Functions as Parameters

Functions can take other functions as parameters! This is like having a tool that can use different tools inside it. The `applyOperation` function is flexible - it can add, multiply, or do any other operation you give it. This is a powerful way to make your code more reusable.
```typescript
// Function that takes a function as parameter
const applyOperation = (
  operation: BinaryOperation, 
  a: number, 
  b: number
): number => {
  return operation(a, b);
};
/**
 * Applies a binary operation function to two numbers.
 * @param operation - The function to apply (e.g., add, multiply)
 * @param a - First number
 * @param b - Second number
 * @returns The result of applying the operation to a and b
 * 
 * @example
 * applyOperation(add, 5, 3) // returns 8
 * applyOperation(multiply, 5, 3) // returns 15
 */

// Usage
const add: BinaryOperation = (a, b) => a + b;
const multiply: BinaryOperation = (a, b) => a * b;

console.log(applyOperation(add, 5, 3)); // 8
console.log(applyOperation(multiply, 5, 3)); // 15
```

### Functions that Return Functions

Functions can also return other functions! This is like a factory that creates tools. The `createGreeter` function is a factory that makes greeting functions. You give it a greeting word, and it gives you back a function that uses that greeting. This is called a "function factory."
```typescript
// Function that returns a function
/**
 * Creates a greeting function with a specific greeting word.
 * This is a function factory that returns a new function.
 * @param greeting - The greeting word to use (e.g., "Hello", "Goodbye")
 * @returns A function that takes a name and returns a formatted greeting
 * 
 * @example
 * const sayHello = createGreeter('Hello');
 * sayHello('Alice') // returns "Hello, Alice!"
 * 
 * const sayGoodbye = createGreeter('Goodbye');
 * sayGoodbye('Bob') // returns "Goodbye, Bob!"
 */
const createGreeter = (greeting: string) => {
  return (name: string): string => `${greeting}, ${name}!`;
};

const sayHello = createGreeter('Hello');
const sayGoodbye = createGreeter('Goodbye');

console.log(sayHello('Alice')); // "Hello, Alice!"
console.log(sayGoodbye('Bob')); // "Goodbye, Bob!"
```

## Function Composition

### Basic Composition

Function composition is like connecting pipes - you take the output of one function and feed it into another function. The `compose` function does this automatically. Think of it like a math problem: if you have f(x) and g(x), composition gives you f(g(x)). The `pipe` function does the same thing but reads more naturally from left to right.

Function composition is like connecting pipes - you take the output of one function and feed it into another function. The `compose` function does this automatically. Think of it like a math problem: if you have f(x) and g(x), composition gives you f(g(x)). The `pipe` function does the same thing but reads more naturally from left to right.
```typescript
// Compose two functions - mathematical composition: f(g(x))
/**
 * Composes two functions together (f ∘ g).
 * The result is a function that applies g first, then f to the result.
 * @param f - The outer function to apply
 * @param g - The inner function to apply first
 * @returns A new function that applies g then f
 * 
 * @example
 * const addOne = (x: number) => x + 1;
 * const multiplyByTwo = (x: number) => x * 2;
 * const addOneThenMultiply = compose(multiplyByTwo, addOne);
 * addOneThenMultiply(5) // returns 12 (addOne(5) = 6, then multiplyByTwo(6) = 12)
 */
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x));

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12

// Compose multiple functions - pipeline composition for better readability
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}

const processData = pipe(
  (x: number) => x * 2,    // First: double the number
  (x: number) => x + 1,    // Second: add one
  (x: number) => x.toString() // Third: convert to string
);

console.log(processData(5)); // "11"
```

### Pipeline Composition

Pipeline composition is like an assembly line - data flows through each function in order, getting transformed at each step. The `pipe` function makes this easy by letting you chain functions together. It's often easier to read than regular composition because it flows from left to right, just like reading English.
```typescript
// Pipeline: data flows through functions left to right
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}
/**
 * Creates a pipeline of functions that process data left to right.
 * @param fns - Variable number of functions to compose
 * @returns A new function that applies all functions in sequence
 * 
 * @example
 * pipe(double, addOne, toString)(5) // returns "11"
 * pipe(trim, toUpperCase)("  hello  ") // returns "HELLO"
 */

const processData = pipe(
  (x: number) => x * 2,
  (x: number) => x + 1,
  (x: number) => x.toString()
);

console.log(processData(5)); // "11"
```

## Type-Safe Function Patterns

### Currying
```typescript
// Manual currying
const add = (a: number) => (b: number): number => a + b;
/**
 * Curried function that adds two numbers.
 * @param a - First number to add
 * @returns A function that takes the second number and returns the sum
 * 
 * @example
 * add(5)(3) // returns 8
 * add(10)(2) // returns 12
 */
const addFive = add(5);
console.log(addFive(3)); // 8

// Auto-currying utility
/**
 * Creates a curried version of a function.
 * Currying transforms a multi-argument function into a series of single-argument functions.
 * @param fn - The function to curry
 * @returns A curried version of the function
 * 
 * @example
 * const add = curry((a: number, b: number) => a + b);
 * add(5)(3) // returns 8
 * const addFive = add(5);
 * addFive(3) // returns 8
 */
const curry = <T extends any[], R>(
  fn: (...args: T) => R
) => {
  const arity = fn.length;
  
  const curried = (...args: any[]): any => {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs: any[]) => curried(...args, ...moreArgs);
  };
  
  return curried;
};

const multiply = curry((a: number, b: number): number => a * b);
const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(5)); // 10
```

### Partial Application

Partial application is like "fixing" some of the arguments of a function to create a new, simpler function. Instead of currying (which breaks a function into single-argument functions), partial application lets you provide some arguments now and the rest later. This is useful when you want to create specialized versions of general functions.
```typescript
// Using default parameters for partial application
const add = (a: number, b: number): number => a + b;
const addFive = (b: number): number => add(5, b); // Partially apply first argument

console.log(addFive(3)); // 8

// More flexible partial application utility
const partial = <T extends any[], R>(fn: (...args: T) => R, ...args: Partial<T>) => (...moreArgs: any[]): R => fn(...args, ...moreArgs);
const addFive = partial(add, 5); // Partially apply with utility function
console.log(addFive(3)); // 8
```

### Currying with Arrow Functions

Arrow functions make currying look really clean! The manual currying example shows how you can write a function that returns another function. The auto-currying utility is like a helper that can turn any function into a curried version automatically. This is especially useful when you want to create specialized functions on the fly.
```typescript
// Manual currying - transform multi-argument function into series of single-argument functions
const add = (a: number) => (b: number): number => a + b;
const addFive = add(5); // Returns a function that adds 5 to its argument
console.log(addFive(3)); // 8

// Auto-currying utility - automatically curry any function
const curry = <T extends any[], R>(fn: (...args: T) => R) => {
  const arity = fn.length; // Number of arguments the function expects
  return function curried(...args: any[]): any {
    if (args.length >= arity) {
      return fn(...args); // If we have enough arguments, call the function
    }
    return (...moreArgs: any[]) => curried(...args, ...moreArgs); // Otherwise, return a function that takes more arguments
  };
};

const add = curry((a: number, b: number): number => a + b);
const addFive = add(5);
console.log(addFive(3)); // 8
```

## Real-World Examples

### Data Processing Functions

These examples show how functional programming works in real applications. The `validateUser` function checks if data is correct, and the `formatUser` function transforms data into a readable format. When you combine them with `pipe`, you get a data processing pipeline that validates first, then formats. This is a common pattern in functional programming.
```typescript
// Type-safe data transformation functions
interface User {
  name: string;
  age: number;
  email: string;
}

/**
 * Validates a user object and throws an error if validation fails.
 * @param user - The user object to validate
 * @returns The validated user object if all checks pass
 * @throws {Error} If name is missing, email is missing, or age is negative
 * 
 * @example
 * validateUser({ name: "Alice", age: 25, email: "alice@example.com" }) // returns the user object
 * validateUser({ name: "", age: 25, email: "alice@example.com" }) // throws "Name is required"
 * validateUser({ name: "Alice", age: -1, email: "alice@example.com" }) // throws "Age must be positive"
 */
const validateUser = (user: User): User => {
  if (!user.name) throw new Error('Name is required');
  if (!user.email) throw new Error('Email is required');
  if (user.age < 0) throw new Error('Age must be positive');
  return user;
};

/**
 * Formats a user object into a readable string representation.
 * @param user - The user object to format
 * @returns A formatted string with name, age, and email
 * 
 * @example
 * formatUser({ name: "Alice", age: 25, email: "alice@example.com" }) // returns "Alice (25) - alice@example.com"
 * formatUser({ name: "Bob", age: 30, email: "bob@example.com" }) // returns "Bob (30) - bob@example.com"
 */
const formatUser = (user: User): string => {
  return `${user.name} (${user.age}) - ${user.email}`;
};

const processUser = pipe(validateUser, formatUser);

// Usage
const user: User = { name: 'Alice', age: 25, email: 'alice@example.com' };
console.log(processUser(user)); // "Alice (25) - alice@example.com"
```

### Configuration Functions

Configuration functions help you create and validate settings for your application. The `createConfig` function uses default parameters to make some settings optional, while `validateConfig` ensures all the settings are valid. This pattern is common in applications where you need to set up connections to databases, APIs, or other services.
```typescript
// Function for creating configuration objects
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

/**
 * Creates a configuration object with default values for optional parameters.
 * @param apiUrl - The API URL (required)
 * @param timeout - Request timeout in milliseconds (defaults to 5000)
 * @param retries - Number of retry attempts (defaults to 3)
 * @returns A configuration object with the specified values
 * 
 * @example
 * createConfig("https://api.example.com") // returns { apiUrl: "https://api.example.com", timeout: 5000, retries: 3 }
 * createConfig("https://api.example.com", 10000, 5) // returns { apiUrl: "https://api.example.com", timeout: 10000, retries: 5 }
 */
const createConfig = (
  apiUrl: string, 
  timeout: number = 5000, 
  retries: number = 3
): Config => {
  return { apiUrl, timeout, retries };
};

/**
 * Validates a configuration object and throws an error if validation fails.
 * @param config - The configuration object to validate
 * @returns The validated configuration object if all checks pass
 * @throws {Error} If API URL is missing, timeout is negative, or retries is negative
 * 
 * @example
 * validateConfig({ apiUrl: "https://api.example.com", timeout: 5000, retries: 3 }) // returns the config object
 * validateConfig({ apiUrl: "", timeout: 5000, retries: 3 }) // throws "API URL is required"
 * validateConfig({ apiUrl: "https://api.example.com", timeout: -1, retries: 3 }) // throws "Timeout must be positive"
 */
const validateConfig = (config: Config): Config => {
  if (!config.apiUrl) throw new Error('API URL is required');
  if (config.timeout < 0) throw new Error('Timeout must be positive');
  if (config.retries < 0) throw new Error('Retries must be positive');
  return config;
};

/**
 * Creates and validates a configuration object in one step.
 * Combines createConfig and validateConfig functions.
 * @param apiUrl - The API URL (required)
 * @param timeout - Request timeout in milliseconds (optional, defaults to 5000)
 * @param retries - Number of retry attempts (optional, defaults to 3)
 * @returns A validated configuration object
 * @throws {Error} If validation fails
 * 
 * @example
 * createValidConfig("https://api.example.com") // returns validated config with defaults
 * createValidConfig("https://api.example.com", 10000, 5) // returns validated config with custom values
 * createValidConfig("") // throws "API URL is required"
 */
const createValidConfig = (apiUrl: string, timeout?: number, retries?: number): Config =>
  validateConfig(createConfig(apiUrl, timeout, retries));
```

## Exercise
Implement a small user-processing pipeline using only pure functions:

1. `sanitizeUser(u: { name: string; age: number; email: string }): { name: string; age: number; email: string }` that trims `name`, lowercases `email`, and throws for negative `age` or empty `name`/`email`.
2. `formatUser(u): string` that returns `"<Name> (<age>) - <email>"` with name capitalized.
3. `processUser = pipe(sanitizeUser, formatUser)`.

### Unit tests
```typescript
// Exercise: user-processing pipeline
describe('processUser pipeline', () => {
  it('sanitizes and formats valid users', () => {
    const input = { name: ' alice ', age: 30, email: 'ALICE@EXAMPLE.COM' };
    const result = processUser(input as any);
    expect(result).toBe('Alice (30) - alice@example.com');
  });

  it('throws on invalid users', () => {
    const bad = { name: ' ', age: -1, email: '' };
    expect(() => sanitizeUser(bad as any)).toThrow();
  });
});
```

## Resources
- [TypeScript Functions](https://www.typescriptlang.org/docs/handbook/functions.html)
- [Functional Programming in TypeScript](https://github.com/gcanti/fp-ts)
