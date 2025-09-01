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

### Generics Basics

Generics are like **variables for types**. Just as you can pass values to functions, you can pass types to type definitions, interfaces, and functions. The `<T>` syntax declares a **type parameter** that gets replaced with an actual type when you use it.

Think of generics as templates that work with different types. Instead of writing the same function multiple times for different types (like one for numbers, one for strings), you write it once and it works with whatever type you give it. The `extends` keyword lets you say "this generic type must have certain properties" - like saying "this function works with any object that has an `id` property."

## How Generics Work

```typescript
type Success<T> = { status: "success"; data: T };
```

- `<T>` declares a **type parameter** named `T`
- `T` is a placeholder that gets replaced with an actual type when you use `Success`
- The `data` property will have whatever type you specify for `T`

## Usage Examples

```typescript
// T becomes string
type StringSuccess = Success<string>;
// Equivalent to: { status: "success"; data: string }

// T becomes number  
type NumberSuccess = Success<number>;
// Equivalent to: { status: "success"; data: number }

// T becomes a custom object type
type UserSuccess = Success<{ id: string; name: string }>;
// Equivalent to: { status: "success", data: { id: string; name: string } }
```

## Why Use Generics?

Without generics, you'd need separate types for each data type:

```typescript
// Without generics - repetitive!
type StringSuccess = { status: "success"; data: string };
type NumberSuccess = { status: "success"; data: number };
type UserSuccess = { status: "success"; data: User };
```

With generics, you write it once and reuse it:

```typescript
// With generics - reusable!
type Success<T> = { status: "success"; data: T };
```

## Common Generic Names
- `T` = "Type" (most common)
- `U`, `V` = additional types
- `K` = "Key" 
- `V` = "Value"
- Descriptive names like `TData`, `TUser` are also fine

The `<>` brackets are called **angle brackets** or **generic brackets**, and the letter inside (like `T`) is the **type parameter**.

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
