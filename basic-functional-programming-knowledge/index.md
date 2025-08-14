# Basic Functional Programming TypeScript Knowledge

This lecture introduces the fundamental concepts of functional programming using TypeScript.

## Core Concepts

### 1. Pure Functions

Pure functions are like math functions - they always give you the same answer for the same inputs, and they don't change anything else in your program. Think of them as reliable machines that do exactly what you expect every time. The examples show the difference between pure functions (which are good) and impure functions (which can cause unexpected behavior).

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

Immutability means "don't change things that already exist." Instead of modifying your original data, you create new copies with the changes you want. This prevents bugs because you can't accidentally change data that other parts of your program are using. The spread operator (`...`) is your friend for creating new arrays and objects.

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

Higher-order functions are functions that work with other functions. They can take functions as inputs (like a tool that uses different tools) or return functions as outputs (like a factory that creates tools). This makes your code more flexible and reusable - you can swap in different functions for different situations.

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

The `map` function is like a factory that transforms every item in a list. You give it a function that describes how to change each item, and it gives you back a new list with all the transformed items. It never changes the original list - it always creates a new one. This is perfect for functional programming!
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

The `filter` function is like a sieve that lets through only the items you want. You give it a function that returns true or false for each item, and it gives you back a new list with only the items where your function returned true. It's great for finding specific items in a list without changing the original.
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

The `reduce` function is like a machine that combines all the items in a list into a single result. You give it a function that describes how to combine two items, and it works through the entire list to give you one final answer. It's perfect for things like adding up numbers, counting items, or grouping data together.
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

Method chaining is like connecting pipes in a factory - you can take the output of one operation and feed it directly into the next operation. This lets you build complex data processing pipelines step by step. Each step takes the result from the previous step and transforms it further, making your code easy to read and understand.
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

Function composition is like connecting pipes - you take the output of one function and feed it into another function. The `compose` function does this automatically. Think of it like a math problem: if you have f(x) and g(x), composition gives you f(g(x)). The `pipe` function does the same thing but reads more naturally from left to right, like reading English.
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

This example shows how you might work with real data in an application. The `orders` array represents data you might get from a database or API. We'll use this data to demonstrate how functional programming techniques can help you process and analyze information in a clean, predictable way.
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

This example shows how you can break down a complex task (validating an email) into smaller, focused functions. Each function does one specific check, and then you combine them all together using `pipe`. This makes your code easier to test and understand - you can test each validation step separately, and the pipeline makes it clear what order the checks happen in.
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

The best functions are like good tools - they do one thing really well. When you try to make a function do too many things, it becomes hard to understand, test, and fix. The example shows how to break down a big, messy function into smaller, focused functions that each have a clear purpose.
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

Side effects are things your function does besides returning a value - like printing to the console, saving to a database, or changing global variables. Pure functions don't have side effects, which makes them predictable and easy to test. The example shows how removing side effects makes your function more reliable.
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

Good function names are like good book titles - they tell you exactly what the function does. Avoid short, unclear names like `fn` or `process`. Instead, use names that describe the function's purpose, like `getPositiveNumbers` or `doubleNumbers`. This makes your code self-documenting and easier for other people (including future you) to understand.
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
