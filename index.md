# Functional Programming Lectures

## Overview
This series of lectures explores functional programming concepts from fundamentals to advanced applications in modern development. The curriculum is designed with a **lean and modular approach**, emphasizing **separation of concerns** and **functional programming principles** throughout. As you progress, you'll learn how to build maintainable, scalable applications using pure functions, immutable data structures, and modern state management (this is crucial) architecture patterns.

**Key Learning Philosophy:**
- **Functions for Everything**: Every concept is taught through the lens of pure functions
- **Immutability First**: Learn to work with immutable data structures from day one
- **Type Safety**: Learn to use types to their full potential
- **Side Effects at the Edges**: Learn to isolate effects at boundaries and keep core logic pure
- **Composition Over Complexity**: Build complex systems from simple, composable parts
- **Redux Toolkit Priority**: RTK and RTK Query are the definitive choice for state management and data fetching
- **Lean Architecture**: Focus on small, focused files with clear separation of concerns

**Architecture Principles You'll Learn:**
- **Lean and Modular Codebase**: Avoid unnecessary code, duplication, or bloat
- **Separation of Concerns**: UI components focus on rendering, Redux slices handle business logic
- **Multiple Command Dispatchers**: Different handlers for different domains
- **Small, Focused Files**: Preferably one function per file for clarity and testability
- **Boilerplate vs. Business Logic**: Keep setup code separate from core application rules
- **Avoid Over-Centralization**: Distribute feature business logic; centralize only cross-cutting infrastructure

> "All software design is composition: the act of breaking complex problems down into smaller problems and composing those solutions. Learn to do it well." - Eric Elliott

## Glossary

Skip to the bottom of this document to see the glossary of a list of basic programming terms.

## Typescript

TypeScript is a superset of JavaScript that adds static typing to the language.

TypeScript will be the language of choice for this course.

## Learning Path
1. **Fundamentals** (Beginner)
   - The simplest FP TS Hello World
   - Basic TypeScript knowledge
   - What is a function?
   - Basic Functional Programming knowledge
   - ES6+ Features for Functional Programming
   - TypeScript and Functional Programming

2. **Intermediate** (Intermediate)
   - Redux Standard Patterns & Functional Programming
   - Redux Toolkit & Functional Programming
   - Functional Composition

3. **Advanced** (Advanced)
   - Monads in Functional Programming
   - Advanced monad transformers
   - Category theory fundamentals

4. **Applications** (Advanced)
   - Practical Applications of Functional Programming
   - Performance optimization techniques
   - Functional programming in other languages (Haskell, Elm, Clojure)

5. **Maintenance & Architecture** (Advanced)
   - Functional Programming Maintenance Strategy
   - Redux Toolkit & RTK Query Best Practices
   - Modern Redux Architecture Patterns

## Lectures

# The simplest FP TS Hello World

This lecture demonstrates the simplest possible functional programming example in TypeScript - a pure function that processes data without side effects.

## The Simplest Functional Program

### Pure Function Example
```typescript
// The simplest pure function
const greet = (name: string): string => `Hello, ${name}!`;
/**
 * Simple greeting function that returns a personalized message.
 * @param name - The name to greet
 * @returns A greeting string with the provided name
 * 
 * @example
 * greet("World") // returns "Hello, World!"
 * greet("Alice") // returns "Hello, Alice!"
 */

// Usage
console.log(greet('World')); // "Hello, World!"
console.log(greet('Alice')); // "Hello, Alice!"
```

[Run this example in the TypeScript Playground](https://www.typescriptlang.org/play/?&code=//%20The%20simplest%20pure%20functionconst%20greet%20=%20(name:%20string):%20string%20=%3E%20`Hello,%20${name}!`;/**%20*%20Simple%20greeting%20function%20that%20returns%20a%20personalized%20message.%20*%20@param%20name%20-%20The%20name%20to%20greet%20*%20@returns%20A%20greeting%20string%20with%20the%20provided%20name%20*%20%20*%20@example%20*%20greet(%22World%22)%20//%20returns%20%22Hello,%20World!%22%20*%20greet(%22Alice%22)%20//%20returns%20%22Hello,%20Alice!%22%20*///%20Usageconsole.log(greet(%27World%27));%20//%20%22Hello,%20World!%22console.log(greet(%27Alice%27));%20//%20%22Hello,%20Alice!%22#code/PTAEBUAsFNQZwJYFsAOAbacAuoUFcAnWAMzwDsBjLBAezICgK7tQBzI6HAXlAAoyAhkmgAueFgIIyrAJRjsk6aC4A+UAAMAEtDRoaAGlAASAN6DhAXwCE6gNz1gAKkf1Qj0AGVk6WO2icpVlBSSmo6UCxIARwiLEIyOFABXGgCODoBNAQAL2gAE1BhODgBVmgAOld3AAEUAQIhUHNYAFoIGCahWCwaNg4sKtBq2PjEgEE+-2olBUDQAHcESIiOlAIaADcEPPzO4UHB6ugADyEfQb9OXgAiAHUaAjQ865lQEFARggTQa+1dA1A90eeSs1wu-RuYyyFGgLzeYE+31+Oj0hihCBhoKqwHoDjAAFUSmVGMwaBhynpWLxLlheAByIFPOkyGS2eE-P6owEPJ5YpgJMkVSnUiF09Ew5ms9nI-5o6HQUFAA)



# Basic TypeScript knowledge

This lecture gives you just enough TypeScript to move comfortably through the rest of the functional programming curriculum. You will learn the core of the type system, how to type functions precisely, and how strict typing reinforces immutability and pure functions.

## Why This Matters for Functional Programming
- **Type safety enables refactoring**: Strong types make it safe to compose many small functions.
- **Purity and immutability**: Types help prevent accidental mutation and side effects - the leading cause of bugs.
- **Precise function signatures**: Communicate intent and make composition predictable.

## Core Concepts

### Types and Annotations

Think of types as labels that tell TypeScript what kind of data something is. You can be explicit about types (like `const name: string = "Alice"`) or let TypeScript figure it out automatically. In functional programming, we often use `readonly` to make sure data doesn't get changed accidentally. Literal types (like `"light" | "dark"`) are great for things that can only have a few specific values.
```typescript
// Basic type annotations for variables
const appName: string = "FP Lectures";
const initialCount: number = 0;
const isReady: boolean = true;

// Literal types capture exact values - only these specific strings are allowed
type Mode = "light" | "dark";
const defaultMode: Mode = "light";
```

### Type Inference

TypeScript is smart! It can often figure out what type something should be without you telling it. For example, if you write `const count = 5`, TypeScript knows it's a number. This keeps your code shorter and cleaner. You only need to add type annotations when TypeScript can't figure it out or when you want to be extra clear about what something should be.
```typescript
// TypeScript automatically infers types from initializers
const maxRetries = 3; // TypeScript infers this as number

/**
 * Converts a string to uppercase using TypeScript's type inference.
 * @param message - The string to convert to uppercase
 * @returns The uppercase version of the input string
 * 
 * @example
 * toUpper("hello") // returns "HELLO"
 * toUpper("TypeScript") // returns "TYPESCRIPT"
 */
function toUpper(message: string) {
  return message.toUpperCase(); // TypeScript infers return type as string
}
```

### Interfaces and Type Aliases

Both `interface` and `type` let you define what an object should look like. Think of them as blueprints. `interface` is good when you might want to add more properties later (like in libraries), while `type` is great for combining different types together. The cool thing about TypeScript is that it cares about the shape of your data, not what you call it - so if two objects have the same properties, they're compatible!
```typescript
// Interface defines the shape of an object
interface User {
  id: string;
  name: string;
}

// Type alias with readonly properties for immutability
type Coordinates = {
  readonly x: number; // readonly prevents mutation
  readonly y: number;
};

// Structural typing: objects are compatible if they have the required shape
const point: Coordinates = { x: 10, y: 20 };
```

### Unions, Intersections, and Narrowing

A union type means "this could be one of several different things" - like a result that could be loading, success, or an error. Before you can use the specific properties of each type, you need to check which one you have (this is called "narrowing"). Intersections let you combine different types together, like mixing in extra properties to an existing type.
```typescript
// Union types represent one of several possible types
type Loading = { status: "loading" };
type Success<T> = { status: "success"; data: T };
type Failure = { status: "failure"; error: string };

// Result can be Loading, Success, or Failure
type Result<T> = Loading | Success<T> | Failure;

/**
 * Handles different result states and returns appropriate string representations.
 * Demonstrates type narrowing with if statements in TypeScript.
 * @param result - The result object that can be Loading, Success, or Failure
 * @returns A string representation of the result state
 * 
 * @example
 * handleResult({ status: "loading" }) // returns "Loading..."
 * handleResult({ status: "success", data: "hello" }) // returns "Data: \"hello\""
 * handleResult({ status: "failure", error: "Network error" }) // returns "Error: Network error"
 */
function handleResult<T>(result: Result<T>): string {
  if (result.status === "loading") return "Loading...";
  if (result.status === "failure") return `Error: ${result.error}`;
  return `Data: ${JSON.stringify(result.data)}`;
}

// Intersection types combine multiple types
type Identified<T> = T & { id: string };
```

### Type Guards and Predicates

Sometimes you need to check what type something is at runtime (when your code is actually running). Type guards are special functions that help TypeScript understand what type something is after you check it. They're like giving TypeScript a hint: "Hey, I just checked this, and now I know it's definitely a cat, not just any animal."
```typescript
// Union type with different animal kinds - each has specific properties
type Animal = { kind: "cat"; meow: () => string } | { kind: "dog"; bark: () => string };

/**
 * Type guard function that checks if an animal is a cat.
 * The return type 'animal is { kind: "cat"; meow: () => string }' tells TypeScript this is a type guard.
 * @param animal - The animal to check
 * @returns True if the animal is a cat, false otherwise
 * 
 * @example
 * isCat({ kind: "cat", meow: () => "meow" }) // returns true
 * isCat({ kind: "dog", bark: () => "woof" }) // returns false
 */
function isCat(animal: Animal): animal is { kind: "cat"; meow: () => string } {
  return animal.kind === "cat";
}

/**
 * Makes an animal speak using type guard for safe property access.
 * After the type guard check, TypeScript knows the exact type.
 * @param animal - The animal that should speak
 * @returns The sound the animal makes
 * 
 * @example
 * speak({ kind: "cat", meow: () => "meow" }) // returns "meow"
 * speak({ kind: "dog", bark: () => "woof" }) // returns "woof"
 */
function speak(animal: Animal): string {
  return isCat(animal) ? animal.meow() : animal.bark();
}
```

### Function Types and Higher-Order Functions

In functional programming, functions are treated just like any other data - you can pass them around, store them in variables, and return them from other functions. `ReadonlyArray` is a special type that tells TypeScript "this array shouldn't be changed" - it helps prevent bugs by making sure you don't accidentally modify your data. Functions like `map` and `filter` let you transform data without changing the original.
```typescript
// Function type alias for binary operations
type Binary = (a: number, b: number) => number;

// Function that matches the Binary type
const add: Binary = (a, b) => a + b;

/**
 * Higher-order function that transforms each element in an array using a provided function.
 * This is a pure functional implementation of map.
 * @param items - The array of items to transform
 * @param f - The transformation function to apply to each item
 * @returns A new array with transformed items
 * 
 * @example
 * map([1, 2, 3], x => x * 2) // returns [2, 4, 6]
 * map(["hello", "world"], s => s.toUpperCase()) // returns ["HELLO", "WORLD"]
 */
function map<A, B>(items: ReadonlyArray<A>, f: (a: A) => B): B[] {
  const result: B[] = [];
  for (const item of items) result.push(f(item));
  return result;
}
```

### Generics Basics

Generics are like templates that work with different types. Instead of writing the same function multiple times for different types (like one for numbers, one for strings), you write it once and it works with whatever type you give it. The `extends` keyword lets you say "this generic type must have certain properties" - like saying "this function works with any object that has an `id` property."
```typescript
/**
 * Generic function that returns the first element of an array.
 * Works with any array type and returns undefined if the array is empty.
 * @param items - The array to get the first element from
 * @returns The first element or undefined if the array is empty
 * 
 * @example
 * first([1, 2, 3]) // returns 1
 * first(["hello", "world"]) // returns "hello"
 * first([]) // returns undefined
 */
function first<T>(items: ReadonlyArray<T>): T | undefined {
  return items[0];
}

/**
 * Creates an index object from an array of items with string IDs.
 * Generic constraint ensures T must have an 'id' property of type string.
 * @param items - The array of items to index
 * @returns An object where keys are item IDs and values are the items
 * 
 * @example
 * const users = [{ id: "1", name: "Alice" }, { id: "2", name: "Bob" }];
 * indexById(users) // returns { "1": { id: "1", name: "Alice" }, "2": { id: "2", name: "Bob" } }
 */
interface HasId { id: string }
function indexById<T extends HasId>(items: ReadonlyArray<T>): Record<string, T> {
  return items.reduce<Record<string, T>>((acc, item) => {
    acc[item.id] = item; // Safe to access item.id because of the constraint
    return acc;
  }, {});
}
```

### Arrays, Tuples, and Readonly

Arrays are lists of things, and `ReadonlyArray` is a special kind that can't be changed - this helps prevent bugs! Tuples are like arrays but with a fixed number of items, each with a specific type (like RGB colors: red, green, blue). For most things, regular objects with named properties are easier to read than long tuples.
```typescript
// Array syntax variations - both are equivalent
const xs: number[] = [1, 2, 3];
const ys: Array<number> = [4, 5, 6];

// Tuple: fixed-length array with specific types for each position
const rgb: [number, number, number] = [255, 255, 0];

/**
 * Calculates the sum of all numbers in an array.
 * Uses ReadonlyArray to discourage mutation in functional programming.
 * @param values - The array of numbers to sum
 * @returns The sum of all numbers in the array
 * 
 * @example
 * total([1, 2, 3, 4, 5]) // returns 15
 * total([10, 20, 30]) // returns 60
 * total([]) // returns 0
 */
function total(values: ReadonlyArray<number>): number {
  return values.reduce((sum, n) => sum + n, 0);
}
```

### Enums vs. `as const`

Instead of using enums (which create extra objects in your code), you can use `as const` with regular objects. This gives you the same benefits - a set of specific values you can choose from - but without the extra overhead. When you use these with `switch` statements, TypeScript can make sure you've handled all the possible cases.
```typescript
// Prefer union literals via as const for portability/tree-shaking
// This creates a readonly object with literal types
const Status = {
  Idle: "idle",
  Running: "running",
  Done: "done",
} as const;

// Extract the union type from the const object
type Status = typeof Status[keyof typeof Status];

/**
 * Transitions a status to the next state in the cycle.
 * Demonstrates exhaustive switch statements with union types.
 * @param s - The current status state
 * @returns The next status in the cycle
 * 
 * @example
 * next("idle") // returns "running"
 * next("running") // returns "done"
 * next("done") // returns "idle"
 */
function next(s: Status): Status {
  switch (s) {
    case "idle": return "running";
    case "running": return "done";
    case "done": return "idle";
  }
}
```

### Modules and Imports

Modules help you organize your code by splitting it into separate files. Each file can export functions, types, or other things that other files can import and use. It's good practice to keep each file focused on one main idea. When you only need to import types (not actual code), you can use `import type` to keep your final code smaller.
```typescript
// utils/math.ts - Export a function from a module
export const multiply = (a: number, b: number): number => a * b;

// app.ts - Import and use the exported function
import { multiply } from "./utils/math";
const area = multiply(3, 4);
```

### Strictness Essentials (`tsconfig.json`)

TypeScript has different levels of strictness you can turn on. The stricter you make it, the more bugs it can catch before your code even runs! Start with `strict: true` and add more options as you get comfortable. These settings help TypeScript find problems like accessing properties that might not exist or forgetting to handle certain cases.
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "Bundler",
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

If you're adding strictness to an existing project, turn on options one at a time and fix any problems that come up. Start with the basic `strict` setting, then add more specific ones as you get used to them.

## Practice
- Type a `map` and `filter` pair operating on `ReadonlyArray<number>` without mutation
- Define a `Result<T>` union for a fetch operation and write a function to render it
- Write a generic `groupBy` that returns `Record<string, T[]>`

## Check Your Understanding
- Can you choose between `interface` and `type` and explain why?
- Can you write a user-defined type guard and use it to narrow a union?
- Can you write a generic function with a constraint and explain its benefit?
- Can you explain why `ReadonlyArray` parameters help prevent bugs?
- Can you show a `switch` statement that handles all possible cases of a union type?

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
/**
 * Calculates the sum of two numbers.
 * @param a - The first number to add
 * @param b - The second number to add
 * @returns The sum of a and b
 * 
 * @example
 * add(5, 7) // returns 12
 * add(0, 0) // returns 0
 * add(-3, 5) // returns 2
 */

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

# Basic Functional Programming TypeScript Knowledge

This lecture introduces the fundamental concepts of functional programming using TypeScript.

## Core Concepts

### 1. Pure Functions
A pure function always returns the same output for the same input and has no side effects.

```typescript
// ✅ Pure function - same input always produces same output, no side effects
const add = (a: number, b: number): number => a + b;

// ❌ Impure function (side effect) - console.log is a side effect
const addWithLogging = (a: number, b: number): number => {
  console.log('Adding numbers'); // Side effect: interacts with external system
  return a + b;
};

// ❌ Impure function (depends on external state) - mutates global variable
let total = 0;
const addToTotal = (num: number): number => {
  total += num; // Mutates external state - makes function unpredictable
  return total;
};
```

### 2. Immutability
Never modify existing data structures; create new ones instead.

```typescript
// ❌ Mutating arrays - this breaks functional programming principles
const numbers = [1, 2, 3];
numbers.push(4); // Mutation! Changes the original array

// ✅ Immutable array operations - create new arrays instead
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4]; // Spread operator creates new array
const doubledNumbers = numbers.map(n => n * 2); // Map creates new array

// ❌ Mutating objects - this breaks functional programming principles
const user = { name: 'Alice', age: 25 };
user.age = 26; // Mutation! Changes the original object

// ✅ Immutable object updates - create new objects instead
const user = { name: 'Alice', age: 25 };
const updatedUser = { ...user, age: 26 }; // Spread operator creates new object
```

### 3. Higher-Order Functions
Functions that take other functions as arguments or return functions.

```typescript
// Function that takes a function as argument (higher-order function)
/**
 * Higher-order function that applies a binary operation to two numbers.
 * @param operation - The function to apply (e.g., add, multiply)
 * @param a - First number
 * @param b - Second number
 * @returns The result of applying the operation to a and b
 * 
 * @example
 * applyOperation(add, 5, 3) // returns 8
 * applyOperation(multiply, 5, 3) // returns 15
 * applyOperation((a, b) => a - b, 10, 4) // returns 6
 */
const applyOperation = (operation: (a: number, b: number) => number, a: number, b: number): number => 
  operation(a, b);

const add = (a: number, b: number): number => a + b;
const multiply = (a: number, b: number): number => a * b;

console.log(applyOperation(add, 5, 3)); // 8
console.log(applyOperation(multiply, 5, 3)); // 15

// Function that returns a function (function factory)
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

## Array Methods for Functional Programming

### 1. map() - Transform Elements
```typescript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Transform objects
interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob']
```

### 2. filter() - Select Elements
```typescript
const numbers = [1, 2, 3, 4, 5, 6];

// Get even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6]

// Filter objects
interface User {
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const activeUsers = users.filter(user => user.active);
console.log(activeUsers); // [{ name: 'Alice', age: 25, active: true }, { name: 'Charlie', age: 35, active: true }]
```

### 3. reduce() - Accumulate Values
```typescript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers - reduce accumulates values into a single result
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Group by property - reduce can create complex data structures
interface User {
  name: string;
  age: number;
  city: string;
}

const users: User[] = [
  { name: 'Alice', age: 25, city: 'NYC' },
  { name: 'Bob', age: 30, city: 'LA' },
  { name: 'Charlie', age: 35, city: 'NYC' }
];

const groupedByCity = users.reduce((acc, user) => {
  if (!acc[user.city]) {
    acc[user.city] = [];
  }
  acc[user.city].push(user);
  return acc;
}, {} as Record<string, User[]>);

console.log(groupedByCity);
// { NYC: [{ name: 'Alice', age: 25, city: 'NYC' }, { name: 'Charlie', age: 35, city: 'NYC' }], LA: [{ name: 'Bob', age: 30, city: 'LA' }] }
```

### 4. Chaining Methods
```typescript
interface User {
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'David', age: 20, active: true }
];

// Get names of active users over 25 - chain multiple operations
const result = users
  .filter(user => user.active)     // First filter: only active users
  .filter(user => user.age > 25)   // Second filter: only users over 25
  .map(user => user.name);         // Finally: extract just the names

console.log(result); // ['Charlie']
```

## Function Composition Basics

### Simple Composition
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

## Real-World Examples

### Data Processing Pipeline
```typescript
interface Order {
  id: number;
  amount: number;
  status: string;
}

const orders: Order[] = [
  { id: 1, amount: 100, status: 'completed' },
  { id: 2, amount: 200, status: 'pending' },
  { id: 3, amount: 150, status: 'completed' },
  { id: 4, amount: 300, status: 'cancelled' }
];
```

### Validation Pipeline
```typescript
// Step 1: Validate email format using regex
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
};

// Step 2: Validate email length (must be longer than 5 characters)
const validateLength = (email: string | null): string | null => 
  email && email.length > 5 ? email : null;

// Step 3: Normalize email to lowercase
const normalizeEmail = (email: string | null): string | null => 
  email && email.toLowerCase();

// Compose all validation steps into a single pipeline
const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Best Practices

### 1. Keep Functions Small and Focused
```typescript
// ❌ Too many responsibilities - violates single responsibility principle
const processUser = (user: any) => {
  // Validation, transformation, and side effects all mixed together
  if (!user.name) throw new Error('Name required');
  const processed = { ...user, name: user.name.toUpperCase() };
  saveToDatabase(processed); // Side effect mixed with business logic
  return processed;
};

// ✅ Separated concerns - each function has one responsibility
const validateUser = (user: any) => {
  if (!user.name) throw new Error('Name required');
  return user;
};

const transformUser = (user: any) => ({
  ...user,
  name: user.name.toUpperCase()
});

const processUser = pipe(validateUser, transformUser);
```

### 2. Avoid Side Effects
```typescript
// ❌ Side effects in pure functions - makes testing and debugging harder
const calculateTotal = (items: any[]): number => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  console.log(`Total: ${total}`); // Side effect: interacts with external system
  return total;
};

// ✅ Pure function - same input always produces same output
const calculateTotal = (items: any[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### 3. Use Descriptive Names
```typescript
// ❌ Unclear names - hard to understand what the function does
const fn = (arr: number[]): number[] => arr.filter(x => x > 0).map(x => x * 2);

// ✅ Descriptive names - clear intent and purpose
const getPositiveNumbers = (numbers: number[]): number[] => numbers.filter(num => num > 0);
const doubleNumbers = (numbers: number[]): number[] => numbers.map(num => num * 2);
const processNumbers = pipe(getPositiveNumbers, doubleNumbers);
```

## Exercise
Create a pure function that processes a list of products and returns the total price of items that are in stock and cost less than $100.

Define:
```ts
type Product = { id: number; name: string; price: number; inStock: boolean };
```
Implement `totalAffordableInStock(products: Product[]): number`.

### Unit tests
```typescript
// Exercise: totalAffordableInStock
describe('totalAffordableInStock', () => {
  const products: Product[] = [
    { id: 1, name: 'A', price: 25, inStock: true },
    { id: 2, name: 'B', price: 150, inStock: true },
    { id: 3, name: 'C', price: 75, inStock: false },
    { id: 4, name: 'D', price: 60, inStock: true }
  ];

  it('sums only in-stock items under $100', () => {
    expect(totalAffordableInStock(products)).toBe(85);
  });

  it('is pure and does not mutate input', () => {
    const copy = products.map(p => ({ ...p }));
    totalAffordableInStock(products);
    expect(products).toEqual(copy);
  });
});
```

## Resources
- [Eloquent JavaScript - Chapter 5: Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)
- [Functional Programming in JavaScript](https://www.freecodecamp.org/news/functional-programming-in-javascript/)

# ES6+ Features for Functional Programming

This lecture explores how modern TypeScript features enhance functional programming capabilities.

## Arrow Functions

### Basic Syntax
```typescript
// Traditional function expression
const add = function(a: number, b: number): number {
  return a + b;
};
/// add(3, 4) returns 7

// Arrow function - more concise syntax
const addArrow = (a: number, b: number): number => a + b;
/// add(3, 4) returns 7

// Single parameter (parentheses optional for single parameter)
const double = (x: number): number => x * 2;
/// double(5) returns 10

// No parameters - parentheses required
const getRandom = (): number => Math.random();
/// getRandom() returns a random number between 0 and 1

// Multiple statements - use curly braces and explicit return
const processUser = (user: any) => {
  const validated = validateUser(user);
  const transformed = transformUser(validated);
  return transformed;
};
```

### Lexical `this` Binding
```typescript
// Traditional function - `this` context issues
const user = {
  name: 'Alice',
  greet: function() {
    setTimeout(function() {
      console.log(`Hello, ${this.name}!`); // `this` is undefined
    }, 1000);
  }
};

// Arrow function - preserves `this` context
const user = {
  name: 'Alice',
  greet: function() {
    setTimeout(() => {
      console.log(`Hello, ${this.name}!`); // `this` refers to user
    }, 1000);
  }
};
```

### Functional Programming Benefits
```typescript
// Cleaner higher-order functions
const numbers = [1, 2, 3, 4, 5];

// Traditional
const doubled = numbers.map(function(num: number) {
  return num * 2;
});

// Arrow function
const doubled = numbers.map(num => num * 2);

// Chaining with arrow functions
const result = numbers
  .filter(num => num > 2)
  .map(num => num * 2)
  .reduce((sum, num) => sum + num, 0);
```

## Destructuring

### Array Destructuring
```typescript
// Basic destructuring - extract values from array into variables
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Function parameters - destructure array parameters directly
const processUser = ([name, age, city]: [string, number, string]) => {
  return { name, age, city };
};

const userData: [string, number, string] = ['Alice', 25, 'NYC'];
const user = processUser(userData);
console.log(user); // { name: 'Alice', age: 25, city: 'NYC' }

// Swapping variables - elegant way to swap without temporary variable
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

### Object Destructuring
```typescript
// Basic object destructuring - extract properties into variables
const user = { name: 'Alice', age: 25, city: 'NYC' };
const { name, age, city } = user;
console.log(name, age, city); // Alice 25 NYC

// Renaming variables - use different variable names for properties
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // Alice 25

// Default values - provide fallback values for missing properties
const { name, age, country = 'USA' } = user;
console.log(country); // USA

// Nested destructuring - extract properties from nested objects
const user = {
  name: 'Alice',
  address: {
    city: 'NYC',
    zip: '10001'
  }
};

const { name, address: { city, zip } } = user;
console.log(name, city, zip); // Alice NYC 10001
```

### Function Parameters
```typescript
// Destructuring in function parameters
const createUser = ({ name, age, email = null }: { name: string; age: number; email?: string }) => {
  return { name, age, email };
};

const user = createUser({ name: 'Alice', age: 25 });
console.log(user); // { name: 'Alice', age: 25, email: null }

// Multiple return values
const getUserStats = (user: any) => {
  const { name, posts } = user;
  const postCount = posts.length;
  const avgLikes = posts.reduce((sum: number, post: any) => sum + post.likes, 0) / postCount;
  
  return { name, postCount, avgLikes };
};
```

## Spread and Rest Operators

### Spread Operator
```typescript
// Array spreading
const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5];
console.log(moreNumbers); // [1, 2, 3, 4, 5]

// Object spreading
const user = { name: 'Alice', age: 25 };
const updatedUser = { ...user, age: 26 };
console.log(updatedUser); // { name: 'Alice', age: 26 }

// Merging objects
const defaults = { theme: 'dark', language: 'en' };
const userPrefs = { theme: 'light' };
const settings = { ...defaults, ...userPrefs };
console.log(settings); // { theme: 'light', language: 'en' }

// Function arguments
const numbers = [1, 2, 3, 4, 5];
const max = Math.max(...numbers);
console.log(max); // 5
```

### Rest Operator
```typescript
// Collecting arguments
const sum = (...numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
};
/// sum(1, 2, 3) returns 6
/// sum(5) returns 5
/// sum() returns 0

console.log(sum(1, 2, 3, 4, 5)); // 15

// Destructuring with rest
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(rest); // [3, 4, 5]

const { name, ...otherProps } = { name: 'Alice', age: 25, city: 'NYC' };
console.log(otherProps); // { age: 25, city: 'NYC' }
```

## Template Literals

### Basic Usage
```typescript
const name = 'Alice';
const age = 25;

// Traditional concatenation
const message = 'Hello, ' + name + '. You are ' + age + ' years old.';

// Template literal
const message = `Hello, ${name}. You are ${age} years old.`;

// Multi-line strings
const html = `
  <div class="user">
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;
```

### Tagged Templates
```typescript
// Tagged template function
const highlight = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce((result, string, index) => {
    const value = values[index] || '';
    return result + string + (value ? `<span class="highlight">${value}</span>` : '');
  }, '');
};

const name = 'Alice';
const age = 25;
const result = highlight`Hello, ${name}. You are ${age} years old.`;
console.log(result); // "Hello, <span class="highlight">Alice</span>. You are <span class="highlight">25</span> years old."
```

## Default Parameters

### Basic Defaults
```typescript
// Traditional approach
const greet = (name: string) => {
  name = name || 'Guest';
  return `Hello, ${name}!`;
};

// Default parameters
const greet = (name: string = 'Guest'): string => `Hello, ${name}!`;
/// greet("Alice") returns "Hello, Alice!"
/// greet() returns "Hello, Guest!"

console.log(greet('Alice')); // "Hello, Alice!"
console.log(greet()); // "Hello, Guest!"

// Multiple defaults
const createUser = (name: string = 'Anonymous', age: number = 18, email: string | null = null) => {
  return { name, age, email };
};
```

### Function Defaults
```typescript
// Default function parameter
const processData = <T>(data: T, processor: (x: T) => T = (x: T) => x): T => {
  return processor(data);
};

console.log(processData([1, 2, 3])); // [1, 2, 3]
console.log(processData([1, 2, 3], arr => arr.map(x => x * 2))); // [2, 4, 6]
```

## Modules and Functional Programming

### Named Exports
```typescript
// math.ts
export const add = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;

// utils.ts
export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x));
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (a: A) => D;
export function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (x: unknown) => fns.reduce((acc, fn) => fn(acc), x);
}
```

### Default Exports
```typescript
// userService.ts - Export a single main function as default
const validateUser = (user: any) => {
  if (!user.name) throw new Error('Name required');
  return user;
};

const transformUser = (user: any) => ({
  ...user,
  name: user.name.toUpperCase()
});

const processUser = (user: any) => {
  const validated = validateUser(user);
  return transformUser(validated);
};

export default processUser; // Default export - only one per module
```

### Importing
```typescript
// main.ts - Import functions from different modules
import { add, multiply } from './math.js'; // Named imports
import { compose, pipe } from './utils.js'; // Named imports
import processUser from './userService.js'; // Default import

// Using imported functions
const result = add(5, 3);
const processedUser = processUser({ name: 'alice', age: 25 });
```

## Enhanced Functional Patterns

### Partial Application
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

### Data Processing Pipeline
```typescript
interface User {
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pure functions for data transformation - each does one thing well
const filterActive = (users: User[]) => users.filter(user => user.active); // Filter active users
const mapNames = (users: User[]) => users.map(user => user.name); // Extract names
const sortNames = (names: string[]) => names.sort(); // Sort alphabetically

// Compose the pipeline - combine simple functions into complex behavior
const getActiveUserNames = pipe(filterActive, mapNames, sortNames);
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]
```

### Validation Pipeline
```typescript
// Step 1: Validate email format
const validateEmail = (email: string): string | null => email.includes('@') ? email : null;
// Step 2: Validate email length
const validateLength = (email: string | null): string | null => email && email.length > 5 ? email : null;
// Step 3: Normalize email to lowercase
const normalizeEmail = (email: string | null): string | null => email && email.toLowerCase();

// Compose validation steps into a single pipeline
const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Exercise
Using ES6+/TypeScript features, implement immutable configuration merging and user selection utilities:

1. `mergeConfig(defaults: Config, overrides?: Partial<Config>): Config` using spread and default params.
2. `getActiveUserNames(users: User[]): string[]` that filters `active` users, maps their `name`, and returns them sorted.

### Unit tests
```typescript
// Exercise: ES6+ utilities
describe('mergeConfig', () => {
  const defaults: Config = { theme: 'dark', language: 'en', notifications: true };

  it('merges overrides immutably', () => {
    const overrides: Partial<Config> = { theme: 'light' };
    const merged = mergeConfig(defaults, overrides);
    expect(merged).toEqual({ theme: 'light', language: 'en', notifications: true });
    expect(merged).not.toBe(defaults);
  });
});

describe('getActiveUserNames', () => {
  const users: User[] = [
    { name: 'Alice', age: 25, email: 'a@a.com', active: true } as any,
    { name: 'Bob', age: 30, email: 'b@b.com', active: false } as any,
    { name: 'Charlie', age: 35, email: 'c@c.com', active: true } as any
  ];

  it('filters active users and sorts names', () => {
    expect(getActiveUserNames(users)).toEqual(['Alice', 'Charlie']);
  });
});
```

## Resources
- [ES6 Features](https://github.com/lukehoban/es6features)
- [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

# TypeScript and Functional Programming

This lecture explores how TypeScript enhances functional programming with type safety and better developer experience.

## Type Annotations for Functions

### Basic Function Types
```typescript
// Function type annotations
const add: (a: number, b: number) => number = (a, b) => a + b;
/// add(5, 3) returns 8

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;
/// multiply(4, 6) returns 24

// Function type aliases
type BinaryOperation = (a: number, b: number) => number;
const add: BinaryOperation = (a, b) => a + b;
const subtract: BinaryOperation = (a, b) => a - b;
```

### Higher-Order Functions
```typescript
// Function that takes a function as parameter
type Predicate<T> = (item: T) => boolean; // Type for functions that test a condition
type Transformer<T, U> = (item: T) => U; // Type for functions that transform data

const filter = <T>(array: T[], predicate: Predicate<T>): T[] => {
  return array.filter(predicate);
};

const map = <T, U>(array: T[], transformer: Transformer<T, U>): U[] => {
  return array.map(transformer);
};

// Usage - create specific functions that match the type signatures
const numbers = [1, 2, 3, 4, 5];
const isEven: Predicate<number> = (n) => n % 2 === 0; // Predicate function
const double: Transformer<number, number> = (n) => n * 2; // Transformer function

const evenNumbers = filter(numbers, isEven);
const doubledNumbers = map(numbers, double);
```

### Function Composition Types
```typescript
// Type-safe composition - define the type for function composition
type Compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => C;

const compose: Compose = (f, g) => (x) => f(g(x)); // Mathematical composition: f(g(x))

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12

// Pipeline composition - alternative to compose, reads left to right
type Pipe = <A, B, C>(f: (a: A) => B, g: (b: B) => C) => (a: A) => C;

const pipe: Pipe = (f, g) => (x) => g(f(x)); // Pipeline: g(f(x))
```

## Generic Types

### Generic Functions
```typescript
// Generic identity function - works with any type
const identity = <T>(value: T): T => value;
/// identity(5) returns 5
/// identity("hello") returns "hello"

// Generic array operations - work with arrays of any type
const head = <T>(array: T[]): T | undefined => array[0]; // Get first element
/// head([1, 2, 3]) returns 1
/// head([]) returns undefined
const tail = <T>(array: T[]): T[] => array.slice(1); // Get all elements except first
/// tail([1, 2, 3]) returns [2, 3]
const last = <T>(array: T[]): T | undefined => array[array.length - 1]; // Get last element
/// last([1, 2, 3]) returns 3
/// last([]) returns undefined

// Usage - TypeScript infers the generic types automatically
const numbers = [1, 2, 3, 4, 5];
const first = head(numbers); // number | undefined
const rest = tail(numbers); // number[]
const lastNum = last(numbers); // number | undefined
```

### Generic Data Structures
```typescript
// Generic Maybe type - represents optional values (success or nothing)
type Maybe<T> = T | null;

const safeDivide = (a: number, b: number): Maybe<number> => {
  return b === 0 ? null : a / b; // Return null for division by zero
};

const safeHead = <T>(array: T[]): Maybe<T> => {
  return array.length > 0 ? array[0] : null; // Return null for empty array
};

// Generic Either type - represents success or failure with error information
type Either<L, R> = { left: L } | { right: R };

const parseNumber = (str: string): Either<string, number> => {
  const num = parseInt(str);
  return isNaN(num) 
    ? { left: 'Invalid number' } // Left represents error
    : { right: num }; // Right represents success
};
```

### Generic Constraints
```typescript
// Constraint: T must have a length property (works with strings, arrays, etc.)
const getLength = <T extends { length: number }>(value: T): number => {
  return value.length;
};

console.log(getLength('hello')); // 5
console.log(getLength([1, 2, 3])); // 3

// Constraint: T must be comparable (works with numbers and strings)
const max = <T extends number | string>(a: T, b: T): T => {
  return a > b ? a : b;
};

console.log(max(5, 3)); // 5
console.log(max('abc', 'def')); // 'def'
```

## Advanced Type Patterns

### Conditional Types
```typescript
// Conditional type for function return - extracts return type from function type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Conditional type for array element - extracts element type from array type
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Usage - TypeScript can infer types from existing functions
const add = (a: number, b: number): number => a + b;
type AddReturn = ReturnType<typeof add>; // number

const numbers = [1, 2, 3];
type NumberElement = ArrayElement<typeof numbers>; // number
```

### Mapped Types
```typescript
// Make all properties optional - useful for partial updates
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required - removes optional modifiers
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly - prevents mutation
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Usage - transform existing interfaces
interface User {
  name: string;
  age: number;
  email?: string;
}

type PartialUser = Partial<User>; // All properties optional
type RequiredUser = Required<User>; // All properties required
type ReadonlyUser = Readonly<User>; // All properties readonly
```

### Utility Types
```typescript
// Pick specific properties - create new type with only selected properties
type UserName = Pick<User, 'name'>; // { name: string }

// Omit specific properties - create new type without selected properties
type UserWithoutEmail = Omit<User, 'email'>; // { name: string; age: number }

// Extract function parameters - get parameter types from function type
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Usage - extract types from existing functions
const createUser = (name: string, age: number): User => ({ name, age, email: null });
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

## Type-Safe Functional Libraries

### Maybe Implementation
```typescript
class Maybe<T> {
  private constructor(private value: T | null) {}

  // Factory method to create a Maybe with a value
  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  // Factory method to create an empty Maybe
  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  // Transform the value if it exists, otherwise return nothing
  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing<U>()
      : Maybe.just(fn(this.value));
  }

  // Chain operations that return Maybe values
  bind<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing<U>()
      : fn(this.value);
  }

  // Extract value with fallback for empty Maybe
  getOrElse(defaultValue: T): T {
    return this.value === null ? defaultValue : this.value;
  }

  // Check if Maybe contains a value
  isJust(): boolean {
    return this.value !== null;
  }

  // Check if Maybe is empty
  isNothing(): boolean {
    return this.value === null;
  }
}

// Usage - safe division that handles division by zero
const safeDivide = (a: number, b: number): Maybe<number> => {
  return b === 0 ? Maybe.nothing() : Maybe.just(a / b);
};

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))  // 10 / 2 = 5
  .bind(x => safeDivide(x, 5))  // 5 / 5 = 1
  .getOrElse(0);                // Extract result or use 0 as fallback

console.log(result); // 1
```

### Either Implementation
```typescript
class Either<L, R> {
  private constructor(
    private leftValue: L | null,
    private rightValue: R | null,
    private isLeft: boolean
  ) {}

  // Factory method for error case (left)
  static left<L, R>(value: L): Either<L, R> {
    return new Either(value, null, true);
  }

  // Factory method for success case (right)
  static right<L, R>(value: R): Either<L, R> {
    return new Either(null, value, false);
  }

  // Transform success value, preserve error
  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isLeft 
      ? Either.left<L, U>(this.leftValue!)
      : Either.right<L, U>(fn(this.rightValue!));
  }

  // Chain operations that return Either values
  bind<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isLeft 
      ? Either.left<L, U>(this.leftValue!)
      : fn(this.rightValue!);
  }

  // Handle both success and error cases
  fold<U>(
    leftFn: (value: L) => U,   // Function to handle error
    rightFn: (value: R) => U   // Function to handle success
  ): U {
    return this.isLeft 
      ? leftFn(this.leftValue!)
      : rightFn(this.rightValue!);
  }
}

// Usage - safe number parsing with error handling
const parseNumber = (str: string): Either<string, number> => {
  const num = parseInt(str);
  return isNaN(num) 
    ? Either.left('Invalid number')
    : Either.right(num);
};

const result = parseNumber('123')
  .map(x => x * 2)  // Transform success value
  .fold(
    error => `Error: ${error}`,     // Handle error case
    value => `Result: ${value}`     // Handle success case
  );

console.log(result); // "Result: 246"
```

## Real-World Examples

### Type-Safe API Client
```typescript
// API response types - define the shape of data from API
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

// API client with type safety - generic methods ensure type safety
class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    return this.get<User>(`/api/users/${id}`); // Type parameter ensures return type
  }

  async getPosts(userId: number): Promise<Post[]> {
    return this.get<Post[]>(`/api/users/${userId}/posts`); // Type parameter ensures return type
  }
}

// Type-safe data processing - TypeScript ensures correct property access
const processUserPosts = async (userId: number): Promise<string[]> => {
  const client = new ApiClient();
  
  try {
    const user = await client.getUser(userId); // TypeScript knows this returns User
    const posts = await client.getPosts(userId); // TypeScript knows this returns Post[]
    
    return posts.map(post => `${user.name}: ${post.title}`); // Safe property access
  } catch (error) {
    console.error('Error processing user posts:', error);
    return [];
  }
};
```

### Type-Safe Redux Actions
```typescript
// Action types - generic type for all Redux actions
type Action<T extends string, P = any> = {
  type: T;
  payload: P;
};

// Specific action types with their payloads
type AddTodoAction = Action<'ADD_TODO', { text: string; completed: boolean }>;
type ToggleTodoAction = Action<'TOGGLE_TODO', number>;
type DeleteTodoAction = Action<'DELETE_TODO', number>;

// Union type of all possible todo actions
type TodoAction = AddTodoAction | ToggleTodoAction | DeleteTodoAction;

// Action creators - pure functions that create actions
const addTodo = (text: string): AddTodoAction => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});

const toggleTodo = (id: number): ToggleTodoAction => ({
  type: 'TOGGLE_TODO',
  payload: id
});

const deleteTodo = (id: number): DeleteTodoAction => ({
  type: 'DELETE_TODO',
  payload: id
});

// Type-safe reducer - TypeScript ensures all action types are handled
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload.text,
          completed: action.payload.completed
        }]
      };
      
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
      
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
      
    default:
      return state;
  }
};
```

## Exercise
Create a lightweight `Maybe<T>` type with `of`, `map`, `chain`, and `getOrElse`. Also implement `safeHead<T>(xs: T[]): Maybe<T>`.

### Unit tests
```typescript
// Exercise: Maybe type
describe('Maybe', () => {
  it('maps over present values', () => {
    const value = Maybe.of(2).map(x => x * 3).getOrElse(0);
    expect(value).toBe(6);
  });

  it('does not map over empty', () => {
    const value = Maybe.of<number | null>(null).map(x => (x as number) * 3).getOrElse(10);
    expect(value).toBe(10);
  });
});

describe('safeHead', () => {
  it('returns first element wrapped in Maybe', () => {
    expect(safeHead([1, 2, 3]).getOrElse(-1)).toBe(1);
  });

  it('returns empty for empty array', () => {
    expect(safeHead<number>([]).getOrElse(42)).toBe(42);
  });
});
```

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Functional Programming in TypeScript](https://github.com/gcanti/fp-ts)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

# Redux Standard Patterns & Functional Programming

Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts. While this covers traditional Redux patterns, **Redux Toolkit (RTK) and RTK Query are the modern, official approach** that supersedes these patterns in production applications.

**Important Note:** This lecture provides foundational understanding, but **RTK and RTK Query take absolute priority** in modern applications. They eliminate the need for most hand-written data fetching logic and provide better developer experience while maintaining functional programming principles.

## Key Functional Programming Concepts in Redux

### 1. Pure Functions
Redux reducers must be pure functions:
```typescript
// Pure function - same input always produces same output, no side effects
const counterReducer = (state = 0, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // No side effects, immutable update
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
```

### 2. Immutability
State updates must be immutable:
```typescript
// ❌ Wrong - mutating state breaks Redux principles
const wrongReducer = (state: any, action: any) => {
  state.count += 1; // Mutation! This will cause bugs
  return state;
};

// ✅ Correct - immutable update creates new state object
const correctReducer = (state: any, action: any) => {
  return {
    ...state,
    count: state.count + 1 // Create new object with updated count
  };
};
```

### 3. Composition
Redux combines multiple reducers functionally:
```typescript
// Compose multiple domain-specific reducers into a single root reducer
const rootReducer = combineReducers({
  users: usersReducer,    // Handles user-related state
  posts: postsReducer,    // Handles post-related state
  comments: commentsReducer // Handles comment-related state
});
```

## Standard Patterns

### Action Creators as Pure Functions
```typescript
// Pure function that creates actions - same input always produces same action
const addTodo = (text: string) => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});
```

### Selectors as Pure Functions
```typescript
// Pure function for data selection - extracts specific data from state
const selectCompletedTodos = (state: any) => 
  state.todos.filter((todo: any) => todo.completed);

const selectTodoCount = (state: any) => 
  state.todos.length;
```

## Functional Benefits
- **Predictability**: Pure functions make testing easier
- **Debugging**: Immutable state enables time-travel debugging
- **Performance**: Immutability enables efficient change detection

## Resources
- [Redux Standard Patterns](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns)

## Exercise
Create a pure reducer function that handles a shopping cart with add/remove/clear actions. 

### Unit tests
```typescript
// Exercise: shopping cart reducer
type CartItem = { id: string; name: string; price: number; qty: number };
type CartState = { items: CartItem[] };

describe('cartReducer', () => {
  const initial: CartState = { items: [] };

  it('adds items', () => {
    const next = cartReducer(initial, { type: 'ADD', payload: { id: '1', name: 'A', price: 10, qty: 2 } });
    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toEqual({ id: '1', name: 'A', price: 10, qty: 2 });
    expect(next).not.toBe(initial);
  });

  it('removes items by id', () => {
    const state: CartState = { items: [{ id: '1', name: 'A', price: 10, qty: 2 }] };
    const next = cartReducer(state, { type: 'REMOVE', payload: '1' });
    expect(next.items).toHaveLength(0);
  });

  it('clears all items', () => {
    const state: CartState = { items: [{ id: '1', name: 'A', price: 10, qty: 2 }] };
    const next = cartReducer(state, { type: 'CLEAR' });
    expect(next.items).toEqual([]);
  });
});
```

# Redux Toolkit & Functional Programming

Redux Toolkit (RTK) simplifies Redux while maintaining functional programming principles. It provides utilities that make functional patterns more accessible. **This is the definitive modern Redux approach** that should be used in all new applications.

**Why RTK is Essential:**
- **Official Redux team support** ensuring long-term maintenance and best practices
- **Built-in Immer integration** for safe immutable updates with mutable syntax
- **Automatic action creator generation** reducing boilerplate
- **TypeScript-first design** with excellent inference and type safety
- **Seamless Redux DevTools integration** for debugging and time-travel
- **RTK Query integration** for data fetching and caching (covered in advanced lectures)

## Functional Programming in RTK

### 1. createSlice - Pure Function Generators
```typescript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // Each reducer is a pure function
    // RTK uses Immer under the hood, so this appears mutable but is actually immutable
    addTodo: (state, action) => {
      state.push(action.payload); // Immer handles immutability behind the scenes
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; // Immer ensures this is immutable
    }
  }
});
```

### 2. Functional Action Creators
```typescript
// RTK automatically generates pure action creators from your reducers
const { addTodo, toggleTodo } = todoSlice.actions;

// These are pure functions - same input always produces same action
const newTodo = addTodo({ id: 1, text: 'Learn FP', completed: false });
const toggleAction = toggleTodo(1);
```

### 3. createAsyncThunk - Functional Side Effects
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Pure function that returns a thunk (function returning function)
// This separates side effects from pure logic
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId: number) => {
    const response = await fetch(`/api/users/${userId}/todos`);
    return response.json();
  }
);
```

## Functional Benefits of RTK

### Immutability Made Easy
```typescript
// RTK uses Immer under the hood to handle immutable updates
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Looks like mutation, but Immer handles immutability
    }
  }
});
```

### Composition with combineReducers
```typescript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,    // Compose domain-specific reducers
    counter: counterSlice.reducer,
    // Composition of pure reducers - each handles its own domain
  }
});
```

## Functional Patterns in RTK Query

### Pure Data Fetching
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Pure function that defines data fetching - no side effects in the definition
    getTodos: builder.query({
      query: (userId: number) => `users/${userId}/todos`, // Pure function for URL generation
      // Transform is a pure function - transforms response data
      transformResponse: (response: any) => response.data
    })
  })
});
```

### 2. Functional Caching Strategy
```typescript
// Pure cache key generation
const generateCacheKey = (userId: number, filters: any) => {
  return `todos-${userId}-${JSON.stringify(filters)}`;
};

// Pure cache invalidation
const invalidateUserTodos = (userId: number) => [
  { type: 'Todo', id: userId },
  { type: 'Todo', id: 'LIST' }
];

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todo', 'User'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: ({ userId, filters = {} }: { userId: number; filters?: any }) => ({
        url: `users/${userId}/todos`,
        params: filters
      }),
      providesTags: (result, error, { userId }) => 
        result ? [
          ...result.map((todo: any) => ({ type: 'Todo', id: todo.id })),
          { type: 'Todo', id: `user-${userId}` }
        ] : []
    }),
    
    updateTodo: builder.mutation({
      query: ({ id, updates }: { id: number; updates: any }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' }
      ]
    })
  })
});
```

### 3. Functional Error Handling
```typescript
// Pure error transformation
const transformError = (error: any): { type: string; message: string } => {
  if (error.status === 401) {
    return { type: 'AUTH_ERROR', message: 'Please log in again' };
  }
  if (error.status === 404) {
    return { type: 'NOT_FOUND', message: 'Resource not found' };
  }
  return { type: 'GENERIC_ERROR', message: error.data?.message || 'An error occurred' };
};

import { retry } from '@reduxjs/toolkit/query/react';
const baseQuery = retry(fetchBaseQuery({ baseUrl: '/api' }), { maxRetries: 3 });

const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], number>({
      query: (userId: number) => `users/${userId}/todos`,
      transformErrorResponse: (response: any) => transformError(response),
    })
  })
});
```

## Advanced Functional Patterns

### 1. Functional Selectors with Reselect
```typescript
import { createSelector } from '@reduxjs/toolkit';

// Pure selector functions
const selectTodos = (state: any) => state.todos.items;
const selectFilter = (state: any) => state.todos.filter;

// Memoized derived state
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos: Todo[], filter: string) => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'active':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }
);

const selectTodoStats = createSelector(
  [selectTodos],
  (todos: Todo[]) => ({
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length
  })
);
```

### 2. Functional Component Integration
```typescript
import { useGetTodosQuery, useCreateTodoMutation } from './api';

// Pure component with RTK Query hooks
const TodoList = ({ userId }: { userId: number }) => {
  const { data: todos, isLoading, error } = useGetTodosQuery(userId);
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  
  // Pure event handlers
  const handleAddTodo = async (text: string) => {
    try {
      await createTodo({ userId, text, completed: false }).unwrap();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;
  
  return (
    <div>
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <AddTodoForm onSubmit={handleAddTodo} disabled={isCreating} />
    </div>
  );
};
```

### 3. Functional Middleware
```typescript
import { createListenerMiddleware } from '@reduxjs/toolkit';

// Pure middleware functions
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addTodo,
  effect: async (action, listenerApi) => {
    // Pure side effect handling
    const { dispatch, getState } = listenerApi;
    
    // Debounced save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      
      if (!result.ok) {
        throw new Error('Failed to save todo');
      }
      
      const savedTodo = await result.json();
      dispatch(updateTodo({ id: action.payload.id, updates: savedTodo }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
    }
  }
});
```

## Performance Optimization

### 1. Functional Memoization
```typescript
// Pure memoization utility
const memoize = <T extends any[], R>(fn: (...args: T) => R) => {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Memoized expensive calculation
const expensiveCalculation = memoize((numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
});
```

### 2. Functional Lazy Loading
```typescript
// Pure lazy loading utility
const createLazyLoader = <T>(loader: () => Promise<T>) => {
  let promise: Promise<T> | null = null;
  return (): Promise<T> => {
    if (!promise) {
      promise = loader();
    }
    return promise;
  };
};

// Lazy load API slices
const lazyUserApi = createLazyLoader(() => import('./userApi'));
const lazyPostApi = createLazyLoader(() => import('./postApi'));
```

## Testing Functional RTK Code

### 1. Pure Function Testing
```typescript
// Test pure selectors
describe('todoSelectors', () => {
  it('should filter completed todos', () => {
    const state = {
      todos: {
        items: [
          { id: 1, text: 'Todo 1', completed: true },
          { id: 2, text: 'Todo 2', completed: false }
        ] as Todo[]
      }
    };
    
    const result = selectFilteredTodos(state, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
```

### 2. RTK Query Testing
```typescript
import { setupApiStore } from '@reduxjs/toolkit/query/react';
import { api } from './api';

const storeRef = setupApiStore(api);

describe('todoApi', () => {
  it('should fetch todos', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetTodosQuery(1),
      { wrapper: ({ children }) => (
        <Provider store={storeRef.store}>{children}</Provider>
      )}
    );
    
    expect(result.current.isLoading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

## Exercise
Define a tiny RTK Query API and test a query hook behavior.

Task:
- Create `todosApi` with `getTodos(userId: number)` endpoint.
- Write a test that renders the hook with a configured store and asserts loading -> data.

### Unit tests
```typescript
// Exercise: RTK Query endpoint test
describe('todosApi/getTodos', () => {
  it('transitions from loading to data', async () => {
    const mockTodos = [ { id: 1, text: 'X', completed: false } ];
    server.use(rest.get('/api/users/1/todos', (req, res, ctx) => res(ctx.json(mockTodos))));

    const { result, waitForNextUpdate } = renderHook(
      () => useGetTodosQuery(1),
      { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> }
    );

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockTodos);
  });
});
```

## Resources
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)
- [Redux Toolkit Testing](https://redux-toolkit.js.org/rtk-query/usage/testing)

# Functional Composition

Functional composition is a core principle where complex functions are built by combining simpler functions. This lecture explores composition patterns from James Sinclair and Eric Elliott's work. **Composition is the key to building lean, modular codebases** that are easy to maintain and extend.

**Composition in Practice:**
- **Small, focused functions** that do one thing well
- **Pipeline composition** for data transformation workflows
- **Point-free style** for cleaner, more readable code
- **Composable selectors** for Redux state management
- **Function factories** for creating reusable behavior patterns

**Maintenance Benefits:**
- **Testability**: Each small function can be tested independently
- **Reusability**: Functions can be combined in many different ways
- **Readability**: Complex operations become clear, linear pipelines
- **Maintainability**: Changes to one function don't affect others

## Function Composition Basics

### Mathematical Composition
```typescript
// Mathematical composition: (f ∘ g)(x) = f(g(x))
// This reads as "f composed with g" - apply g first, then f
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x));

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne); // Apply addOne first, then multiplyByTwo
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition
```typescript
// Pipeline: data flows through functions left to right
// This is often more readable than mathematical composition
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

## Real-World Composition Examples

### Data Processing Pipeline
```typescript
interface User {
  name: string;
  age: number;
  active: boolean;
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pure functions for data transformation
const filterActive = (users: User[]) => users.filter(user => user.active);
const mapNames = (users: User[]) => users.map(user => user.name);
const sortNames = (names: string[]) => names.sort();

// Compose the pipeline
const getActiveUserNames = pipe(filterActive, mapNames, sortNames);
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]
```

### Validation Pipeline
```typescript
const validateEmail = (email: string): string | null => email.includes('@') ? email : null;
const validateLength = (email: string | null): string | null => email && email.length > 5 ? email : null;
const normalizeEmail = (email: string | null): string | null => email && email.toLowerCase();

const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Advanced Composition Patterns

### Point-Free Style
```typescript
// Avoid mentioning the data explicitly
const prop = <K extends keyof any>(key: K) => <T extends Record<K, any>>(obj: T): T[K] => obj[key];
const map = <T, U>(fn: (item: T) => U) => (arr: T[]): U[] => arr.map(fn);
const filter = <T>(fn: (item: T) => boolean) => (arr: T[]): T[] => arr.filter(fn);

// Point-free composition
const getActiveUserNames = pipe(
  filter(prop('active')),
  map(prop('name')),
  sort
);
```

### Composition with Currying
```typescript
const curry = <T extends any[], R>(fn: (...args: T) => R) => {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs: any[]) => curried(...args, ...moreArgs);
  };
};

const add = curry((a: number, b: number): number => a + b);
const multiply = curry((a: number, b: number): number => a * b);

const addThenMultiply = pipe(add(5), multiply(2));
console.log(addThenMultiply(3)); // 16
```

## Composition in React/Redux

### Selector Composition
```typescript
// Compose selectors for complex data queries
const selectUsers = (state: any) => state.users;
const selectActiveUsers = pipe(selectUsers, filter(prop('active')));
const selectActiveUserNames = pipe(selectActiveUsers, map(prop('name')));
```

### Action Creator Composition
```typescript
const withMeta = (meta: any) => (action: any) => ({ ...action, meta });
const withTimestamp = (action: any) => ({ ...action, timestamp: Date.now() });

const createActionWithMeta = pipe(
  withMeta({ source: 'user' }),
  withTimestamp
);

const addTodo = (text: string) => ({ type: 'ADD_TODO', payload: { text } });
const addTodoWithMeta = pipe(addTodo, createActionWithMeta);
```

## Benefits of Composition
- **Reusability**: Small functions can be combined in many ways
- **Testability**: Each function can be tested independently
- **Readability**: Complex operations become clear pipelines
- **Maintainability**: Changes to one function don't affect others

## Resources
- [James Sinclair](https://jrsinclair.com/)
- [Eric Elliott](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)

## Exercise
Create a composition pipeline that processes a list of products: filters by price range, sorts by rating, and maps to display format. 

### Unit tests
```typescript
// Exercise: product composition pipeline
type RatedProduct = { id: number; name: string; price: number; rating: number };

describe('productPipeline', () => {
  const products: RatedProduct[] = [
    { id: 1, name: 'A', price: 50, rating: 4.2 },
    { id: 2, name: 'B', price: 200, rating: 4.9 },
    { id: 3, name: 'C', price: 75, rating: 3.8 }
  ];

  it('filters, sorts by rating desc, and maps to display', () => {
    const result = productPipeline(products, { min: 0, max: 100 });
    expect(result).toEqual(['A (4.2★) - $50', 'C (3.8★) - $75']);
  });
});
```

# Monads in Functional Programming

Monads are a fundamental concept in functional programming that handle side effects and complex computations. This lecture explores monads based on Philip Wadler's work and their practical applications.

## What is a Monad?

A monad is a type that wraps a value and provides two operations:
1. **return/unit**: Wraps a value in the monad
2. **bind/flatMap**: Chains operations on the monad

```typescript
// Monad interface (conceptual)
class Monad<T> {
  static return<T>(value: T): Monad<T> { /* wraps value */ }
  bind<U>(fn: (value: T) => Monad<U>): Monad<U> { /* chains operations */ }
}
```

## Common Monad Types

### 1. Maybe Monad (Handles null/undefined)
```typescript
class Maybe<T> {
  private constructor(private value: T | null) {}

  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }

  bind<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value === null || this.value === undefined
      ? Maybe.nothing<U>()
      : fn(this.value);
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.bind(value => Maybe.just(fn(value)));
  }

  getOrElse(defaultValue: T): T {
    return this.value === null || this.value === undefined 
      ? defaultValue 
      : this.value;
  }
}

// Usage
const safeDivide = (a: number, b: number): Maybe<number> => 
  b === 0 ? Maybe.nothing() : Maybe.just(a / b);

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .bind(x => safeDivide(x, 5));

console.log(result.getOrElse(0)); // 1
```

### 2. Either Monad (Handles errors)
```typescript
class Either<L, R> {
  private constructor(
    private value: L | R,
    private isLeft: boolean
  ) {}

  static left<L, R>(error: L): Either<L, R> {
    return new Either(error, true);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(value, false);
  }

  bind<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return this.isLeft ? this as Either<L, U> : fn(this.value as R);
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.bind(value => Either.right(fn(value)));
  }
}

// Usage
const parseNumber = (str: string): Either<string, number> => {
  const num = parseInt(str);
  return isNaN(num) 
    ? Either.left('Invalid number')
    : Either.right(num);
};

const result = parseNumber('123')
  .bind(x => x > 0 ? Either.right(x * 2) : Either.left('Must be positive'))
  .map(x => x + 1);
```

### 3. List Monad (Handles collections)
```typescript
class List<T> {
  constructor(private values: T[]) {}

  static return<T>(value: T): List<T> {
    return new List([value]);
  }

  bind<U>(fn: (value: T) => List<U>): List<U> {
    const results = this.values.flatMap(value => fn(value).values);
    return new List(results);
  }

  map<U>(fn: (value: T) => U): List<U> {
    return this.bind(value => List.return(fn(value)));
  }
}

// Usage
const numbers = new List([1, 2, 3]);
const doubled = numbers.bind(x => new List([x, x * 2]));
console.log(doubled.values); // [1, 2, 2, 4, 3, 6]
```

## Monad Laws

### 1. Left Identity
```typescript
// return(a).bind(f) === f(a)
const a = 5;
const f = (x: number) => Maybe.just(x * 2);

const left = Maybe.just(a).bind(f);
const right = f(a);
// left.value === right.value
```

### 2. Right Identity
```typescript
// m.bind(return) === m
const m = Maybe.just(5);
const left = m.bind(Maybe.just);
const right = m;
// left.value === right.value
```

### 3. Associativity
```typescript
// m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
const m = Maybe.just(5);
const f = (x: number) => Maybe.just(x * 2);
const g = (x: number) => Maybe.just(x + 1);

const left = m.bind(f).bind(g);
const right = m.bind(x => f(x).bind(g));
// left.value === right.value
```

## Practical Applications

### Error Handling
```typescript
interface User {
  name: string;
  email: string;
}

const validateUser = (user: User): Either<string, User> => {
  if (!user.name) return Either.left('Name required');
  if (!user.email) return Either.left('Email required');
  return Either.right(user);
};

const saveUser = (user: User): Either<string, User & { id: number }> => {
  // Simulate database save
  return Either.right({ ...user, id: Date.now() });
};

const result = validateUser({ name: 'Alice', email: 'alice@example.com' })
  .bind(saveUser)
  .map(user => `User ${user.name} saved with ID ${user.id}`);
```

### Optional Chaining
```typescript
const getUser = (id: number) => Maybe.just({ id, name: 'Alice' });
const getProfile = (user: any) => Maybe.just({ ...user, bio: 'Developer' });
const getAvatar = (profile: any) => Maybe.just({ ...profile, avatar: 'avatar.jpg' });

const result = getUser(1)
  .bind(getProfile)
  .bind(getAvatar)
  .map(profile => profile.avatar);
```

## Monads in Modern JavaScript

### Promise as a Monad
```typescript
// Promise implements monad-like behavior
const fetchUser = (id: number) => fetch(`/api/users/${id}`).then(r => r.json());
const fetchPosts = (user: any) => fetch(`/api/users/${user.id}/posts`).then(r => r.json());

const result = fetchUser(1)
  .then(user => fetchPosts(user))
  .then(posts => posts.map((post: any) => post.title));
```

### Array as a Monad
```typescript
// Array implements monad behavior with flatMap
const numbers = [1, 2, 3];
const result = numbers
  .flatMap(x => [x, x * 2])
  .flatMap(x => [x, x + 1]);
```

## Benefits of Monads
- **Error handling**: Structured way to handle failures
- **Composition**: Chain operations safely
- **Separation of concerns**: Pure logic separated from side effects
- **Type safety**: Compile-time guarantees about error handling

## Resources
- [Philip Wadler - Monads](https://jgbm.github.io/eecs762f19/papers/wadler-monads.pdf)

## Exercise
Implement a Result monad that can handle both success and error cases, then use it to process a list of user data with validation. 

### Unit tests
```typescript
// Exercise: Result monad
describe('Result', () => {
  it('maps and chains on Ok', () => {
    const res = Ok(2).map(x => x + 1).chain(x => Ok(x * 10));
    expect(res.unwrap()).toBe(30);
  });

  it('skips map/chain on Err', () => {
    const res = Err<number>('bad').map(x => x + 1).chain(x => Ok(x * 10));
    expect(res.isErr()).toBe(true);
  });
});

describe('processUsers with Result', () => {
  it('validates and formats only valid users', () => {
    const users = [
      { name: 'Alice', email: 'a@a.com' },
      { name: '', email: '' }
    ];
    const result = processUsers(users);
    expect(result.unwrap()).toEqual(['Alice <a@a.com>']);
  });
});
```

# Practical Applications of Functional Programming

This lecture combines all the functional programming concepts we've learned into practical, real-world applications. We'll see how Redux, composition, monads, and reactive programming work together.


## Building a Functional Todo Application

### 1. State Management with Redux Toolkit
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

// Pure action creators
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null } as TodoState,
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  }
});

// Async thunk for side effects
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch todos: ${error.message}`);
    }
  }
);
```

### 2. Functional Composition for Data Processing
```typescript
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Pure functions for data transformation
const filterByStatus = (status: boolean) => (todos: Todo[]) => 
  todos.filter(todo => todo.completed === status);

const sortByDate = (todos: Todo[]) => 
  todos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

const mapToDisplay = (todos: Todo[]) => 
  todos.map(todo => ({
    ...todo,
    displayText: todo.completed ? `✓ ${todo.text}` : todo.text
  }));

// Compose the pipeline
const processTodos = pipe(
  filterByStatus(false),
  sortByDate,
  mapToDisplay
);
```

### 3. Monads for Error Handling
```typescript
// Either monad for API calls
class ApiResult<T> {
  private constructor(private value: T | string, private isError: boolean) {}

  static success<T>(value: T): ApiResult<T> {
    return new ApiResult(value, false);
  }

  static error<T>(message: string): ApiResult<T> {
    return new ApiResult(message, true);
  }

  bind<U>(fn: (value: T) => ApiResult<U>): ApiResult<U> {
    return this.isError ? this as ApiResult<U> : fn(this.value as T);
  }

  map<U>(fn: (value: T) => U): ApiResult<U> {
    return this.bind(value => ApiResult.success(fn(value)));
  }
}

// Safe API wrapper
const safeApiCall = async <T>(url: string): Promise<ApiResult<T>> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return ApiResult.success(data);
  } catch (error) {
    return ApiResult.error(`API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Usage with composition
const fetchUserTodos = pipe(
  (userId: number) => `/api/users/${userId}/todos`,
  safeApiCall,
  result => result.map(processTodos)
);
```

## Advanced Patterns

### 1. Functional State Machines
```typescript
interface TodoState {
  todos: Todo[];
  filter: string;
}

// Pure function for state transitions
const createStateMachine = <T, A>(initialState: T, transitions: Record<string, (state: T, action: A) => T>) => {
  return (state: T = initialState, action: A): T => {
    const transition = transitions[(action as any).type];
    return transition ? transition(state, action) : state;
  };
};

// Todo state machine
const todoTransitions = {
  ADD_TODO: (state: TodoState, action: any) => ({
    ...state,
    todos: [...state.todos, action.payload]
  }),
  TOGGLE_TODO: (state: TodoState, action: any) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === action.payload 
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  }),
  DELETE_TODO: (state: TodoState, action: any) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.payload)
  })
};

const todoReducer = createStateMachine(
  { todos: [], filter: 'all' } as TodoState,
  todoTransitions
);
```

### 2. Functional Testing
```typescript
// Pure function testing
const testProcessTodos = (): boolean => {
  const input: Todo[] = [
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01' },
    { id: 2, text: 'Task 2', completed: true, createdAt: '2023-01-02' },
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03' }
  ];

  const expected = [
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03', displayText: 'Task 3' },
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01', displayText: 'Task 1' }
  ];

  const result = processTodos(input);
  
  return JSON.stringify(result) === JSON.stringify(expected);
};

console.log('Test passed:', testProcessTodos());

// Property-based testing example
const testFilterByStatus = (): boolean => {
  const todos: Todo[] = [
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01' },
    { id: 2, text: 'Task 2', completed: true, createdAt: '2023-01-02' },
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03' }
  ];

  const activeTodos = filterByStatus(false)(todos);
  const completedTodos = filterByStatus(true)(todos);

  // Property: filtering by status should only return items with that status
  const allActiveAreIncomplete = activeTodos.every(todo => !todo.completed);
  const allCompletedAreComplete = completedTodos.every(todo => todo.completed);

  return allActiveAreIncomplete && allCompletedAreComplete;
};

// Integration testing
const testTodoPipeline = (): boolean => {
  const todos: Todo[] = [
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01' },
    { id: 2, text: 'Task 2', completed: true, createdAt: '2023-01-02' },
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03' }
  ];

  const result = processTodos(todos);
  
  // Property: result should only contain incomplete todos
  const onlyIncomplete = result.every(todo => !todo.completed);
  
  // Property: result should be sorted by date (newest first)
  const isSorted = result.every((todo, index) => {
    if (index === 0) return true;
    const currentDate = new Date(todo.createdAt);
    const prevDate = new Date(result[index - 1].createdAt);
    return currentDate <= prevDate;
  });

  return onlyIncomplete && isSorted;
};

console.log('Filter test passed:', testFilterByStatus());
console.log('Pipeline test passed:', testTodoPipeline());
```

### 3. Functional Error Boundaries
```typescript
// Maybe monad for component rendering
const safeRender = <T, R>(component: (props: T) => R, props: T): Maybe<R> => {
  try {
    return Maybe.just(component(props));
  } catch (error) {
    console.error('Render error:', error);
    return Maybe.nothing<R>();
  }
};

// Usage
const renderTodoList = (todos: Todo[]): any => {
  if (!Array.isArray(todos)) {
    throw new Error('Todos must be an array');
  }
  
  return h('ul', todos.map((todo: Todo) => 
    h('li', { key: todo.id }, todo.text)
  ));
};

const safeTodoList = safeRender(renderTodoList, todos);
safeTodoList.map((vdom: any) => render(vdom)).getOrElse(() => 
  h('div.error', 'Failed to render todos')
);
```

## Performance Optimization

### 1. Memoization
```typescript
// Pure function memoization
const memoize = <T extends any[], R>(fn: (...args: T) => R) => {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveCalculation = memoize((numbers: number[]): number => {
  return numbers.reduce((sum, num) => sum + num, 0);
});
```

### 2. Lazy Evaluation
```typescript
// Lazy stream processing
const createLazyStream = <T>(generator: () => Generator<T>) => {
  return {
    map: <U>(fn: (item: T) => U) => createLazyStream(function* () {
      for (const item of generator()) {
        yield fn(item);
      }
    }),
    filter: (predicate: (item: T) => boolean) => createLazyStream(function* () {
      for (const item of generator()) {
        if (predicate(item)) yield item;
      }
    }),
    take: (count: number) => createLazyStream(function* () {
      let taken = 0;
      for (const item of generator()) {
        if (taken >= count) break;
        yield item;
        taken++;
      }
    })
  };
};
```

## Best Practices Summary

### 1. Pure Functions
- Always return the same output for the same input
- Avoid side effects
- Make functions small and focused

### 2. Immutability
- Never mutate data structures
- Use spread operators and immutable libraries
- Create new objects instead of modifying existing ones

### 3. Composition
- Build complex functions from simple ones
- Use pipe/compose for data transformations
- Keep functions small and composable

### 4. Error Handling
- Use monads for structured error handling
- Separate pure logic from side effects
- Handle errors at the boundaries

### 5. Testing
- Test pure functions with simple inputs/outputs
- Use property-based testing for complex functions
- Mock side effects and test pure logic separately

## Exercise
Refactor an impure data workflow into pure transformations plus side-effect boundaries.

Task:
- Implement `parseUsers(json: unknown): User[]` (pure) and `toDisplayNames(users: User[]): string[]` (pure).
- Keep network/file I/O outside these functions.

### Unit tests
```typescript
// Exercise: pure data workflow
describe('parseUsers + toDisplayNames', () => {
  it('parses valid JSON and maps display names', () => {
    const json = JSON.stringify([
      { firstName: 'Alice', lastName: 'Smith' },
      { firstName: 'Bob', lastName: 'Lee' }
    ]);
    const users = parseUsers(json);
    expect(Array.isArray(users)).toBe(true);
    expect(toDisplayNames(users)).toEqual(['Alice Smith', 'Bob Lee']);
  });

  it('throws on invalid input', () => {
    expect(() => parseUsers('not json')).toThrow();
  });
});
```

## Additional Resources

### Books
- [Functional Programming in JavaScript](https://www.manning.com/books/functional-programming-in-javascript) by Luis Atencio
- [Composing Software](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc) by Eric Elliott
- [Professor Frisby's Mostly Adequate Guide to Functional Programming](https://github.com/MostlyAdequate/mostly-adequate-guide)

### Online Courses
- [Functional Programming Principles in Scala](https://www.coursera.org/learn/progfun1) by Martin Odersky
- [Functional Programming in Haskell](https://www.futurelearn.com/courses/functional-programming-haskell)

### Libraries and Tools
- [Ramda](https://ramdajs.com/) - Practical functional library for JavaScript
- [fp-ts](https://github.com/gcanti/fp-ts) - Functional programming in TypeScript
- [Folktale](https://folktale.origamitower.com/) - Fantasy Land compatible library
- [Sanctuary](https://sanctuary.js.org/) - Refuge from unsafe JavaScript

### Community Resources
- [Functional Programming Discord](https://discord.gg/functional)
- [r/functionalprogramming](https://www.reddit.com/r/functionalprogramming/)
- [Functional Programming Slack](https://fpchat-invite.herokuapp.com/)

### Conferences and Events
- [LambdaConf](https://lambdaconf.zohobackstage.com/)
- [Strange Loop](https://thestrangeloop.com/)
- [Compose Conference](https://www.composeconference.org/)

### Practice Platforms
- [Exercism](https://exercism.io/) - Functional programming tracks
- [Codewars](https://www.codewars.com/) - Functional programming katas
- [HackerRank](https://www.hackerrank.com/) - Functional programming challenges

### Research Papers
- [Monads for Functional Programming](https://jgbm.github.io/eecs762f19/papers/wadler-monads.pdf) by Philip Wadler
- [Functional Programming with Bananas, Lenses, Envelopes and Barbed Wire](https://eprints.eemcs.utwente.nl/7281/01/db-utwente-40501F46.pdf) by Erik Meijer et al.

### Video Content
- [Functional Programming Fundamentals](https://www.youtube.com/watch?v=BMUiFMZr7vk) by MPJ
- [Functional Programming in JavaScript](https://www.youtube.com/watch?v=BMUiFMZr7vk) by Fun Fun Function
- [Category Theory for Programmers](https://www.youtube.com/watch?v=O6TyYd8QaQo) by Bartosz Milewski 

# Functional Programming Maintenance Strategy

This lecture explores strategies for maintaining a codebase in pure functional programming style, focusing on lean architecture, separation of concerns, and Redux Toolkit best practices. **This is where theory meets practice** - you'll learn how to apply all the functional programming concepts you've learned to build maintainable, scalable applications.

**Core Maintenance Philosophy:**
- **Lean and Modular**: Every file and function has a clear, necessary purpose
- **Separation of Concerns**: UI logic separate from business logic separate from data logic
- **Small, Focused Files**: Preferably one function per file for clarity and testability
- **Multiple Command Dispatchers**: Different handlers for different domains
- **Boilerplate vs. Business Logic**: Keep setup code separate from core application rules
- **Avoid Over-Centralization**: Distribute feature business logic; centralize only cross-cutting infrastructure

**Why This Matters:**
- **Maintainability**: Easier to update, debug, and onboard new developers
- **Testability**: Isolated logic is easier to test
- **Scalability**: Adding new features or domains is straightforward
- **Team Collaboration**: Clear boundaries make code ownership obvious


## Core Maintenance Principles

### 1. Lean and Modular Codebase
```typescript
interface User {
  name: string;
  email: string;
}

// ❌ Bloated, monolithic approach
const userService = {
  validateUser: (user: User) => { /* validation logic */ },
  saveUser: (user: User) => { /* save logic */ },
  sendEmail: (user: User) => { /* email logic */ },
  generateReport: (user: User) => { /* report logic */ },
  // ... 20 more methods
};

// ✅ Lean, modular approach
// userValidation.ts
export const validateUser = (user: User): User => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// userRepository.ts
export const saveUser = async (user: User): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return response.json();
};

// emailService.ts
export const sendWelcomeEmail = async (user: User): Promise<void> => {
  // Email logic isolated
};
```

### 2. Separation of Concerns
```typescript
// ❌ Mixed concerns
const UserComponent = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      // Business logic mixed with UI logic
      if (!user.name) throw new Error('Name required');
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
      });
      const savedUser = await response.json();
      // UI updates mixed with business logic
      setUser(savedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  return <div>...</div>;
};

// ✅ Separated concerns
// userSlice.ts - Business logic
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null } as UserState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// userActions.ts - Pure action creators
export const saveUser = createAsyncThunk(
  'user/saveUser',
  async (user: User) => {
    const validatedUser = validateUser(user);
    return await userRepository.saveUser(validatedUser);
  }
);

// UserComponent.tsx - UI only
const UserComponent = ({ user }: { user: User }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.user);
  
  const handleSave = () => {
    dispatch(saveUser(user));
  };
  
  return <div>...</div>;
};
```

### 3. Small, Focused Files
```typescript
// ❌ Large file with multiple responsibilities
// userManagement.ts (200+ lines)
export class UserManager {
  constructor() { /* setup */ }
  
  validateUser(user: User): User { /* validation logic */ }
  saveUser(user: User): Promise<User> { /* save logic */ }
  updateUser(user: User): Promise<User> { /* update logic */ }
  deleteUser(userId: number): Promise<void> { /* delete logic */ }
  sendEmail(user: User): Promise<void> { /* email logic */ }
  generateReport(user: User): Promise<Report> { /* report logic */ }
  // ... many more methods
}

// ✅ Small, focused files
// userValidation.ts (15 lines)
export const validateUser = (user: User): User => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// userRepository.ts (20 lines)
export const saveUser = async (user: User): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return response.json();
};

// userEmailService.ts (25 lines)
export const sendWelcomeEmail = async (user: User): Promise<void> => {
  // Email-specific logic only
};
```

### 4. One Function Per File
```typescript
// ❌ Multiple functions in one file
// utils.ts
export const formatDate = (date: Date): string => { /* date formatting */ };
export const formatCurrency = (amount: number): string => { /* currency formatting */ };
export const validateEmail = (email: string): boolean => { /* email validation */ };
export const debounce = <T extends any[]>(fn: (...args: T) => void, delay: number): (...args: T) => void => { /* debounce utility */ };

// ✅ One function per file
// formatDate.ts
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

// formatCurrency.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// validateEmail.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## Redux Toolkit Maintenance Patterns

### 1. Slice Organization
```typescript
// ❌ Monolithic slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    users: [] as User[],
    posts: [] as Post[],
    comments: [] as Comment[],
    settings: {} as Settings,
    notifications: [] as Notification[],
    // ... many more domains
  },
  reducers: {
    // 50+ reducers mixed together
  }
});

// ✅ Domain-specific slices
// userSlice.ts
const userSlice = createSlice({
  name: 'user',
  initialState: { users: [] as User[], loading: false, error: null as string | null },
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    }
  }
});

// postSlice.ts
const postSlice = createSlice({
  name: 'post',
  initialState: { posts: [] as Post[], loading: false, error: null as string | null },
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    }
  }
});
```

### 2. RTK Query API Organization
```typescript
// ❌ Single API slice for everything
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({ query: () => 'users' }),
    createUser: builder.mutation<User, User>({ query: (user: User) => ({ url: 'users', method: 'POST', body: user }) }),
    getPosts: builder.query<Post[], void>({ query: () => 'posts' }),
    createPost: builder.mutation<Post, Post>({ query: (post: Post) => ({ url: 'posts', method: 'POST', body: post }) }),
    getComments: builder.query<Comment[], void>({ query: () => 'comments' }),
    // ... many more endpoints
  })
});

// ✅ Domain-specific API slices
// userApi.ts
const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({ query: () => 'users' }),
    createUser: builder.mutation<User, User>({ query: (user: User) => ({ url: 'users', method: 'POST', body: user }) })
  })
});

// postApi.ts
const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({ query: () => 'posts' }),
    createPost: builder.mutation<Post, Post>({ query: (post: Post) => ({ url: 'posts', method: 'POST', body: post }) })
  })
});
```

### 3. Selector Organization
```typescript
// ❌ Complex selectors in components
const UserList = () => {
  const users = useSelector((state: RootState) => 
    state.user.users.filter((user: User) => user.active)
      .map((user: User) => ({ ...user, displayName: `${user.firstName} ${user.lastName}` }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  );
};

// ✅ Pure selector functions
// userSelectors.ts
export const selectActiveUsers = (state: RootState): User[] => 
  state.user.users.filter((user: User) => user.active);

export const selectUserDisplayNames = createSelector(
  [selectActiveUsers],
  (users: User[]) => users.map((user: User) => ({
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  }))
);

export const selectSortedUsers = createSelector(
  [selectUserDisplayNames],
  (users: User[]) => users.sort((a, b) => a.displayName.localeCompare(b.displayName))
);

// UserList.tsx
const UserList = () => {
  const users = useSelector(selectSortedUsers);
  return <div>...</div>;
};
```

## Functional Programming Maintenance Benefits

### 1. Testability
```typescript
// Pure functions are easy to test
const validateUser = (user: User): User => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// Simple, focused tests
describe('validateUser', () => {
  it('should validate a valid user', () => {
    const user: User = { name: 'Alice', email: 'alice@example.com' };
    expect(validateUser(user)).toEqual(user);
  });
  
  it('should throw error for missing name', () => {
    const user: Partial<User> = { email: 'alice@example.com' };
    expect(() => validateUser(user as User)).toThrow('Name required');
  });
});
```

### 2. Maintainability
```typescript
// Small, focused functions are easy to understand and modify
const formatUserDisplayName = (user: User): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Easy to extend or modify
const formatUserDisplayName = (user: User, includeTitle: boolean = false): string => {
  const baseName = `${user.firstName} ${user.lastName}`.trim();
  return includeTitle ? `${user.title} ${baseName}` : baseName;
};
```

### 3. Reusability
```typescript
// Pure functions can be reused across the application
const debounce = <T extends any[]>(fn: (...args: T) => void, delay: number): ((...args: T) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Used in multiple components
const debouncedSearch = debounce(searchUsers, 300);
const debouncedSave = debounce(saveUser, 1000);
```

## Exercise
Write selectors and utilities to demonstrate testability and reusability:

1. `selectCompletedTodos(state): Todo[]` (pure selector).
2. `formatUserDisplayName(user: User, includeTitle?: boolean): string`.

### Unit tests
```typescript
// Exercise: selectors and utilities
describe('selectCompletedTodos', () => {
  it('filters only completed items', () => {
    const state = { todos: { items: [
      { id: 1, text: 'A', completed: true },
      { id: 2, text: 'B', completed: false }
    ] } } as any;
    expect(selectCompletedTodos(state)).toEqual([{ id: 1, text: 'A', completed: true }]);
  });
});

describe('formatUserDisplayName', () => {
  it('formats with or without title', () => {
    const u = { firstName: 'Ada', lastName: 'Lovelace', title: 'Dr.' } as any;
    expect(formatUserDisplayName(u)).toBe('Ada Lovelace');
    expect(formatUserDisplayName(u, true)).toBe('Dr. Ada Lovelace');
  });
});
```

## Resources
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide)
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)

# Redux Toolkit & RTK Query Best Practices

This lecture explores advanced Redux Toolkit and RTK Query patterns for maintaining functional programming principles in modern React applications. **RTK Query eliminates the need for most hand-written data fetching logic**, replacing complex thunk/saga patterns with purpose-built data fetching and caching solutions.

**RTK Query Advantages Over Alternatives:**
- **Automatic caching, invalidation, and background refetching** out-of-the-box
- **Dedicated API slices per service** with shared base queries reduce complexity
- **Built-in optimistic updates** and error handling without additional libraries
- **Seamless Redux DevTools integration** for debugging and time-travel
- **TypeScript-first design** with excellent inference and type safety
- **Official Redux team support** ensuring long-term maintenance and best practices

**Functional Programming Benefits:**
- **Pure API definitions** with transformResponse functions
- **Immutable cache management** with automatic updates
- **Composable query patterns** for complex data requirements
- **Predictable state updates** through Redux store integration

## Redux Toolkit's Functional Foundation

### 1. Pure Reducers with Immer
```typescript
import { createSlice } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null } as TodoState,
  reducers: {
    // Pure functions that appear mutable but are actually immutable
    addTodo: (state, action) => {
      state.items.push(action.payload); // Immer handles immutability behind the scenes
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed; // Immer ensures this is immutable
    },
    removeTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  }
});

// Automatically generated pure action creators
const { addTodo, toggleTodo, removeTodo } = todoSlice.actions;
```

### 2. Functional Async Operations
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Pure function that returns a thunk
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Pure function for optimistic updates
const addTodoOptimistic = createAsyncThunk(
  'todos/addTodoOptimistic',
  async (todo: Todo, { dispatch }) => {
    // Optimistic update
    dispatch(addTodo({ ...todo, id: Date.now(), pending: true }));
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      
      const savedTodo = await response.json();
      return savedTodo;
    } catch (error) {
      // Rollback on error
      dispatch(removeTodo(todo.id));
      throw error;
    }
  }
);
```

## RTK Query Functional Patterns

### 1. Pure API Definitions
```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // Pure function that defines data fetching
    getTodos: builder.query({
      query: (userId: number) => `users/${userId}/todos`,
      // Pure transformation function
      transformResponse: (response: any) => response.data,
      // Pure cache key function
      providesTags: (result, error, userId) => 
        result ? [{ type: 'Todo', id: userId }] : []
    }),
    
    createTodo: builder.mutation({
      query: (todo: Todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo
      }),
      // Pure invalidation function
      invalidatesTags: (result, error, todo) => [
        { type: 'Todo', id: todo.userId }
      ]
    })
  })
});
```

### 2. Functional Caching Strategy
```typescript
// Pure cache key generation
const generateCacheKey = (userId: number, filters: any) => {
  return `todos-${userId}-${JSON.stringify(filters)}`;
};

// Pure cache invalidation
const invalidateUserTodos = (userId: number) => [
  { type: 'Todo', id: userId },
  { type: 'Todo', id: 'LIST' }
];

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todo', 'User'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: ({ userId, filters = {} }: { userId: number; filters?: any }) => ({
        url: `users/${userId}/todos`,
        params: filters
      }),
      providesTags: (result, error, { userId }) => 
        result ? [
          ...result.map((todo: any) => ({ type: 'Todo', id: todo.id })),
          { type: 'Todo', id: `user-${userId}` }
        ] : []
    }),
    
    updateTodo: builder.mutation({
      query: ({ id, updates }: { id: number; updates: any }) => ({
        url: `todos/${id}`,
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Todo', id },
        { type: 'Todo', id: 'LIST' }
      ]
    })
  })
});
```

### 3. Functional Error Handling
```typescript
// Pure error transformation
const transformError = (error: any): { type: string; message: string } => {
  if (error.status === 401) {
    return { type: 'AUTH_ERROR', message: 'Please log in again' };
  }
  if (error.status === 404) {
    return { type: 'NOT_FOUND', message: 'Resource not found' };
  }
  return { type: 'GENERIC_ERROR', message: error.data?.message || 'An error occurred' };
};

import { retry } from '@reduxjs/toolkit/query/react';
const baseQuery = retry(fetchBaseQuery({ baseUrl: '/api' }), { maxRetries: 3 });

const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], number>({
      query: (userId: number) => `users/${userId}/todos`,
      transformErrorResponse: (response: any) => transformError(response),
    })
  })
});
```

## Advanced Functional Patterns

### 1. Functional Selectors with Reselect
```typescript
import { createSelector } from '@reduxjs/toolkit';

// Pure selector functions
const selectTodos = (state: any) => state.todos.items;
const selectFilter = (state: any) => state.todos.filter;

// Memoized derived state
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos: Todo[], filter: string) => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'active':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }
);

const selectTodoStats = createSelector(
  [selectTodos],
  (todos: Todo[]) => ({
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length
  })
);
```

### 2. Functional Component Integration
```typescript
import { useGetTodosQuery, useCreateTodoMutation } from './api';

// Pure component with RTK Query hooks
const TodoList = ({ userId }: { userId: number }) => {
  const { data: todos, isLoading, error } = useGetTodosQuery(userId);
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  
  // Pure event handlers
  const handleAddTodo = async (text: string) => {
    try {
      await createTodo({ userId, text, completed: false }).unwrap();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;
  
  return (
    <div>
      {todos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      <AddTodoForm onSubmit={handleAddTodo} disabled={isCreating} />
    </div>
  );
};
```

### 3. Functional Middleware
```typescript
import { createListenerMiddleware } from '@reduxjs/toolkit';

// Pure middleware functions
const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: addTodo,
  effect: async (action, listenerApi) => {
    // Pure side effect handling
    const { dispatch, getState } = listenerApi;
    
    // Debounced save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      
      if (!result.ok) {
        throw new Error('Failed to save todo');
      }
      
      const savedTodo = await result.json();
      dispatch(updateTodo({ id: action.payload.id, updates: savedTodo }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
    }
  }
});
```

## Performance Optimization

### 1. Functional Memoization
```typescript
// Pure memoization utility
const memoize = <T extends any[], R>(fn: (...args: T) => R) => {
  const cache = new Map<string, R>();
  return (...args: T): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Memoized expensive calculation
const expensiveCalculation = memoize((data: any[]) => {
  return data.reduce((acc, item) => acc + item.value, 0);
});
```

### 2. Functional Lazy Loading
```typescript
// Pure lazy loading utility
const createLazyLoader = <T>(loader: () => Promise<T>) => {
  let promise: Promise<T> | null = null;
  return (): Promise<T> => {
    if (!promise) {
      promise = loader();
    }
    return promise;
  };
};

// Lazy load API slices
const lazyUserApi = createLazyLoader(() => import('./userApi'));
const lazyPostApi = createLazyLoader(() => import('./postApi'));
```

## Testing Functional RTK Code

### 1. Pure Function Testing
```typescript
// Test pure selectors
describe('todoSelectors', () => {
  it('should filter completed todos', () => {
    const state = {
      todos: {
        items: [
          { id: 1, text: 'Todo 1', completed: true },
          { id: 2, text: 'Todo 2', completed: false }
        ] as Todo[]
      }
    };
    
    const result = selectFilteredTodos(state, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
```

### 2. RTK Query Testing
```typescript
import { setupApiStore } from '@reduxjs/toolkit/query/react';
import { api } from './api';

const storeRef = setupApiStore(api);

describe('todoApi', () => {
  it('should fetch todos', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useGetTodosQuery(1),
      { wrapper: ({ children }) => (
        <Provider store={storeRef.store}>{children}</Provider>
      )}
    );
    
    expect(result.current.isLoading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeDefined();
  });
});
```

## Exercise
Define a tiny RTK Query API and test a query hook behavior.

Task:
- Create `todosApi` with `getTodos(userId: number)` endpoint.
- Write a test that renders the hook with a configured store and asserts loading -> data.

### Unit tests
```typescript
// Exercise: RTK Query endpoint test
describe('todosApi/getTodos', () => {
  it('transitions from loading to data', async () => {
    const mockTodos = [ { id: 1, text: 'X', completed: false } ];
    server.use(rest.get('/api/users/1/todos', (req, res, ctx) => res(ctx.json(mockTodos))));

    const { result, waitForNextUpdate } = renderHook(
      () => useGetTodosQuery(1),
      { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> }
    );

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockTodos);
  });
});
```

## Resources
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)
- [Redux Toolkit Testing](https://redux-toolkit.js.org/rtk-query/usage/testing)

# Modern Redux Architecture Patterns

This lecture explores modern Redux architecture patterns that prioritize functional programming principles, RTK Query for data management, and scalable application design. **This represents the culmination of all functional programming concepts** applied to real-world application architecture.

**Modern Redux Architecture Priorities:**
1. **RTK Query First**: Use RTK Query for all data fetching, caching, and server state synchronization
2. **RTK Slices**: Use createSlice for client-side state management with built-in Immer integration
3. **Avoid Legacy Patterns**: No hand-written thunks, sagas, or observables for data fetching
4. **Functional Purity**: Maintain pure reducer functions while leveraging RTK's built-in middleware for side effects

**Architecture Benefits:**
- **Scalable**: Feature-based organization that grows with your application
- **Maintainable**: Clear separation of concerns and predictable data flow
- **Testable**: Pure functions and isolated components are easy to test
- **Performant**: Automatic optimizations through RTK Query caching and Redux Toolkit
- **Developer Experience**: Excellent tooling and debugging capabilities

## Modern Redux Architecture Priorities

### 1. RTK Query First Approach
```typescript
// ❌ Legacy approach: Manual data fetching with thunks
const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (userId: number) => {
    const [userResponse, postsResponse, settingsResponse] = await Promise.all([
      fetch(`/api/users/${userId}`),
      fetch(`/api/users/${userId}/posts`),
      fetch(`/api/users/${userId}/settings`)
    ]);
    
    return {
      user: await userResponse.json(),
      posts: await postsResponse.json(),
      settings: await settingsResponse.json()
    };
  }
);

// ✅ Modern approach: RTK Query for all data fetching
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId: number) => `users/${userId}`
    }),
    getUserPosts: builder.query({
      query: (userId: number) => `users/${userId}/posts`
    }),
    getUserSettings: builder.query({
      query: (userId: number) => `users/${userId}/settings`
    })
  })
});

// Functional composition of queries
const useUserData = (userId: number) => {
  const user = useGetUserQuery(userId);
  const posts = useGetUserPostsQuery(userId);
  const settings = useGetUserSettingsQuery(userId);
  
  return {
    user: user.data,
    posts: posts.data,
    settings: settings.data,
    isLoading: user.isLoading || posts.isLoading || settings.isLoading,
    error: user.error || posts.error || settings.error
  };
};
```

### 2. Functional State Management
```typescript
// ❌ Complex state with mixed concerns
const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: null,
    posts: [],
    settings: {},
    ui: {
      loading: false,
      sidebarOpen: false,
      theme: 'light'
    },
    cache: {
      userData: null,
      lastFetch: null
    }
  },
  reducers: {
    // 20+ reducers handling everything
  }
});

// ✅ Domain-specific slices with pure functions
// userSlice.ts - User domain only
const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  }
});

// uiSlice.ts - UI state only
const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false, theme: 'light' },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

// No cache slice needed - RTK Query handles caching
```

## Functional State Machine Patterns

### 1. Pure State Transitions
```typescript
interface AuthState {
  status: 'authenticated' | 'unauthenticated';
  user: any | null;
  error: string | null;
}

// Pure state machine for user authentication
const createAuthMachine = () => {
  const transitions = {
    LOGIN: (state: AuthState, action: any) => ({
      ...state,
      status: 'authenticated',
      user: action.payload,
      error: null
    }),
    LOGOUT: (state: AuthState) => ({
      ...state,
      status: 'unauthenticated',
      user: null,
      error: null
    }),
    LOGIN_FAILED: (state: AuthState, action: any) => ({
      ...state,
      status: 'unauthenticated',
      user: null,
      error: action.payload
    })
  };
  
  return (state: AuthState = { status: 'unauthenticated', user: null, error: null }, action: any): AuthState => {
    const transition = transitions[(action as any).type];
    return transition ? transition(state, action) : state;
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { status: 'unauthenticated', user: null, error: null } as AuthState,
  reducers: {
    login: (state, action) => {
      state.status = 'authenticated';
      state.user = action.payload;
      state.error = null;
    },
    logout: (state) => {
      state.status = 'unauthenticated';
      state.user = null;
      state.error = null;
    },
    loginFailed: (state, action) => {
      state.status = 'unauthenticated';
      state.user = null;
      state.error = action.payload;
    }
  }
});
```

### 2. Functional Event Handling
```typescript
// Pure event handlers
const createEventHandlers = (dispatch: any) => ({
  handleLogin: async (credentials: any) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const user = await response.json();
      dispatch(authSlice.actions.login(user));
    } catch (error) {
      dispatch(authSlice.actions.loginFailed(error instanceof Error ? error.message : 'Unknown error'));
    }
  },
  
  handleLogout: () => {
    dispatch(authSlice.actions.logout());
  }
});
```

## Scalable Application Architecture

### 1. Feature-Based Organization
```typescript
// Feature-based folder structure
src/
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authApi.ts
│   │   ├── authSelectors.ts
│   │   └── components/
│   │       ├── LoginForm.tsx
│   │       └── UserProfile.tsx
│   ├── todos/
│   │   ├── todoSlice.ts
│   │   ├── todoApi.ts
│   │   ├── todoSelectors.ts
│   │   └── components/
│   │       ├── TodoList.tsx
│   │       └── TodoForm.tsx
│   └── posts/
│       ├── postSlice.ts
│       ├── postApi.ts
│       ├── postSelectors.ts
│       └── components/
│           ├── PostList.tsx
│           └── PostEditor.tsx
├── shared/
│   ├── api/
│   │   └── baseApi.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── utils/
│       ├── validation.ts
│       └── formatting.ts
└── app/
    ├── store.ts
    ├── App.tsx
    └── index.ts
```

### 2. Functional API Composition
```typescript
// Base API with shared configuration
const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['User', 'Todo', 'Post'],
  endpoints: () => ({})
});

// Feature-specific API extensions
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: () => 'auth/me',
      providesTags: ['User']
    }),
    updateProfile: builder.mutation({
      query: (updates: any) => ({
        url: 'auth/profile',
        method: 'PATCH',
        body: updates
      }),
      invalidatesTags: ['User']
    })
  })
});

const todoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: (userId: number) => `users/${userId}/todos`,
      providesTags: (result, error, userId) => 
        result ? [
          ...result.map((todo: any) => ({ type: 'Todo', id: todo.id })),
          { type: 'Todo', id: `user-${userId}` }
        ] : []
    }),
    createTodo: builder.mutation({
      query: (todo: Todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo
      }),
      invalidatesTags: (result, error, todo) => [
        { type: 'Todo', id: `user-${todo.userId}` }
      ]
    })
  })
});
```

### 3. Functional Component Architecture
```typescript
// Pure component composition
const TodoApp = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <TodoFeature />
      </AuthProvider>
    </Provider>
  );
};

// Feature component with pure composition
const TodoFeature = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return (
    <div className="todo-feature">
      <TodoHeader user={user} />
      <TodoList userId={user.id} />
      <TodoForm userId={user.id} />
    </div>
  );
};

// Pure components with RTK Query
const TodoList = ({ userId }: { userId: number }) => {
  const { data: todos, isLoading, error } = useGetTodosQuery(userId);
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  
  const handleToggle = (todo: Todo) => {
    updateTodo({ id: todo.id, completed: !todo.completed });
  };
  
  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ul className="todo-list">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
};
```

## Advanced Functional Patterns

### 1. Functional Middleware Composition
```typescript
// Pure middleware functions
const createLoggingMiddleware = () => (store: any) => (next: any) => (action: any) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

const createAnalyticsMiddleware = () => (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Track specific actions
  if (action.type === 'todos/addTodo') {
    analytics.track('todo_created', { userId: (store.getState() as any).auth.user?.id });
  }
  
  return result;
};

// Compose middleware functionally
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(createLoggingMiddleware())
      .concat(createAnalyticsMiddleware())
});
```

### 2. Functional Error Boundaries
```typescript
// Pure error boundary with functional composition
const createErrorBoundary = (fallback: (error: Error) => React.ReactElement) => {
  return class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error: Error, errorInfo: any) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError && this.state.error) {
        return fallback(this.state.error);
      }
      
      return this.props.children;
    }
  };
};

// Usage with pure error handling
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="error-boundary">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <button onClick={() => window.location.reload()}>
      Reload Page
    </button>
  </div>
);

const AppErrorBoundary = createErrorBoundary(ErrorFallback);
```

### 3. Functional Performance Optimization
```typescript
// Pure performance utilities
const createMemoizedSelector = <T extends any[], R>(selector: (...args: T) => R, equalityFn: (a: T, b: T) => boolean = shallowEqual) => {
  let lastResult: R | null = null;
  let lastArgs: T | null = null;
  
  return (...args: T): R => {
    if (lastArgs && equalityFn(args, lastArgs)) {
      return lastResult!;
    }
    
    lastArgs = args;
    lastResult = selector(...args);
    return lastResult;
  };
};

// Functional lazy loading
const createLazyComponent = <T extends { default: React.ComponentType<any> }>(loader: () => Promise<T>) => {
  let Component: React.ComponentType<any> | null = null;
  let promise: Promise<T> | null = null;
  
  return React.lazy(() => {
    if (!promise) {
      promise = loader().then(module => {
        Component = module.default;
        return module;
      });
    }
    return promise;
  });
};

// Usage
const LazyTodoList = createLazyComponent(() => import('./TodoList'));
```

## Testing Modern Redux Architecture

### 1. Functional Testing Patterns
```typescript
// Test pure selectors
describe('todoSelectors', () => {
  it('should select todos by user', () => {
    const state = {
      todos: {
        items: [
          { id: 1, userId: 1, text: 'Todo 1' },
          { id: 2, userId: 2, text: 'Todo 2' },
          { id: 3, userId: 1, text: 'Todo 3' }
        ] as Todo[]
      }
    };
    
    const result = selectTodosByUser(state, 1);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(3);
  });
});

// Test pure reducers
describe('todoSlice', () => {
  it('should handle addTodo', () => {
    const initialState = { items: [] } as TodoState;
    const todo = { id: 1, text: 'New Todo', completed: false };
    
    const newState = todoSlice.reducer(
      initialState,
      todoSlice.actions.addTodo(todo)
    );
    
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual(todo);
  });
});
```

### 2. RTK Query Testing
```typescript
// Test RTK Query endpoints
describe('todoApi', () => {
  it('should fetch todos', async () => {
    const mockTodos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false }
    ] as Todo[];
    
    server.use(
      rest.get('/api/users/1/todos', (req, res, ctx) => {
        return res(ctx.json(mockTodos));
      })
    );
    
    const { result, waitForNextUpdate } = renderHook(
      () => useGetTodosQuery(1),
      { wrapper: ({ children }) => (
        <Provider store={store}>{children}</Provider>
      )}
    );
    
    await waitForNextUpdate();
    
    expect(result.current.data).toEqual(mockTodos);
    expect(result.current.isLoading).toBe(false);
  });
});
```

## Exercise
Capstone: Build a mini feature end-to-end with functional purity.

Task:
- Define a `todos` slice (add/toggle/remove) and selectors.
- Define an `api` slice with `getTodos` and `addTodo` endpoints.
- Create a `TodoList` component that uses selectors and hooks.
- Write unit tests for reducers, selectors, and API hooks.

### Unit tests
```typescript
// Capstone sample tests
describe('todos reducer', () => {
  it('adds and toggles', () => {
    const s0 = undefined as any;
    const s1 = todosReducer(s0, addTodo({ id: 1, text: 'A', completed: false }));
    const s2 = todosReducer(s1, toggleTodo(1));
    expect(s1.items).toHaveLength(1);
    expect(s2.items[0].completed).toBe(true);
  });
});

describe('selectIncomplete', () => {
  it('derives incomplete todos', () => {
    const state = { todos: { items: [
      { id: 1, text: 'A', completed: false },
      { id: 2, text: 'B', completed: true }
    ] } } as any;
    expect(selectIncomplete(state)).toEqual([{ id: 1, text: 'A', completed: false }]);
  });
});
```

## Resources
- [Redux Toolkit Architecture](https://redux-toolkit.js.org/usage/usage-guide)
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)
- [Redux Best Practices](https://redux.js.org/style-guide/)

## Programming Glossary

- **expression**: A piece of code that produces a value. Expressions can be evaluated and always return a result (e.g., `2 + 3`, `Math.max(a, b)`, `user.name`).

- **statement**: A complete instruction that performs an action. Statements don't return values but execute code (e.g., `if (condition) { ... }`, `return value;`, `const x = 5;`).

- **declaration**: Code that introduces a new variable, function, or type into scope. Declarations create bindings but don't necessarily execute code.

- **assignment**: The process of storing a value in a variable. In functional programming, assignments are often avoided in favor of immutable declarations.

- **variable**: A named container that stores a value. In functional programming, variables are often immutable to prevent side effects and ensure referential transparency.

- **const**: A variable that is immutable. In functional programming, variables should be immutable to prevent side effects and ensure referential transparency. `const` is a better choice than `let` because it's more explicit and less error-prone.

- **gate**: A logical operator that controls data flow (AND, OR, NOT). Gates are pure functions that combine boolean values.

- **boolean**: A data type with only two possible values: true or false. Booleans are fundamental to conditional logic and functional programming.

- **number**: A numeric data type for mathematical operations. In functional programming, numbers are immutable and operations return new values.

- **string**: A sequence of characters representing text. Strings are immutable in most functional programming contexts.

- **array**: An ordered collection of elements. Arrays are fundamental to functional programming for data transformation operations.

- **object**: A collection of key-value pairs representing a real-world entity. In functional programming, objects should be immutable.

- **method**: A function that belongs to an object or class. Methods can access the object's state and modify it (though this is avoided in functional programming).

- **function**: A reusable block of code that takes inputs (parameters) and returns an output. In functional programming, functions should be pure - same input always produces same output with no side effects.

- **type**: A classification of data that defines what operations can be performed on it. Types provide compile-time safety and documentation.

- **argument**: The actual value passed to a function when it's called. Arguments are the concrete data that functions operate on.

- **parameter**: The placeholder variable in a function definition that receives arguments. Parameters define the function's interface and expected input types.

- **attribute**: A property or characteristic of an object. In functional programming, object attributes should be immutable to prevent side effects.

- **return**: A statement that exits a function and provides a value back to the caller. Return values should be the only way functions communicate results.

- **side effect**: Any change to the system outside the function (modifying global state, making API calls, logging). Pure functions avoid side effects.

- **event**: A signal that something has happened in the system (user interaction, timer completion, data arrival). Events are the foundation of reactive programming.

- **listener**: A function that waits for and responds to events. Listeners are pure functions that process event data without side effects.

- **handler**: A function that processes a specific event or action. Handlers should be pure functions that transform input data into output data.

- **callback**: A function passed as an argument to another function, to be executed later. Callbacks enable asynchronous programming and function composition.

- **promise**: An object representing the eventual completion (or failure) of an asynchronous operation. Promises provide a clean way to handle async operations functionally.

- **async/await**: Syntactic sugar for working with promises. Async functions return promises, and await pauses execution until a promise resolves.

- **symbol**: A unique, immutable primitive value used as object property keys. Symbols provide a way to create truly private properties.

- **null**: A special value representing the intentional absence of any object value. In functional programming, null is often replaced with Maybe/Option types.

- **undefined**: A value assigned to variables that have been declared but not initialized. Undefined represents an unassigned value.

- **NaN**: "Not a Number" - a special numeric value representing an undefined or unrepresentable mathematical result.

- **interface**: A TypeScript construct that defines the shape of an object. Interfaces describe contracts that objects must fulfill.

- **class**: A blueprint for creating objects with shared properties and methods. Classes are less common in functional programming, which prefers plain objects and functions.

- **set**: A collection of unique values with no duplicates. Sets are useful for functional programming operations like union, intersection, and difference.

- **loop**: A control structure that repeats code execution. In functional programming, loops are often replaced with higher-order functions like map, filter, and reduce.

- **condition**: A boolean expression that determines program flow. Conditions are used in if statements and ternary operators.

- **iteration**: The process of repeating a set of instructions. In functional programming, iteration is handled through recursion or higher-order functions.

- **recursion**: A function calling itself to solve a problem by breaking it into smaller subproblems. Recursion is fundamental to functional programming.

/**
 * Adds one to a number.
 * @param x - The number to increment
 * @returns The number plus one
 * 
 * @example
 * addOne(5) // returns 6
 * addOne(0) // returns 1
 * addOne(-1) // returns 0
 */
const addOne = (x: number): number => x + 1;

/**
 * Multiplies a number by two.
 * @param x - The number to double
 * @returns The number multiplied by two
 * 
 * @example
 * multiplyByTwo(3) // returns 6
 * multiplyByTwo(0) // returns 0
 * multiplyByTwo(-2) // returns -4
 */
const multiplyByTwo = (x: number): number => x * 2;