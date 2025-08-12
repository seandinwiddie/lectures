# Functional Programming Lectures Index

## Overview
This series of lectures explores functional programming concepts from fundamentals to advanced applications in modern JavaScript development. The curriculum is designed with a **lean and modular approach**, emphasizing **separation of concerns** and **functional programming principles** throughout. As you progress, you'll learn how to build maintainable, scalable applications using pure functions, immutable data structures, and modern Redux architecture patterns.

**Key Learning Philosophy:**
- **Functions for Everything**: Every concept is taught through the lens of pure functions
- **Immutability First**: Learn to work with immutable data structures from day one
- **Composition Over Complexity**: Build complex systems from simple, composable parts
- **Redux Toolkit Priority**: RTK and RTK Query are the definitive choice for state management and data fetching
- **Lean Architecture**: Focus on small, focused files with clear separation of concerns

## Learning Path
1. **Fundamentals** (Beginner)
   - What is a function in TypeScript?
   - The simplest FP TS Hello World
   - Basic Functional Programming JavaScript knowledge
   - ES6+ Features for Functional Programming
   - TypeScript and Functional Programming

2. **Intermediate** (Intermediate)
   - Redux Standard Patterns & Functional Programming
   - Redux Toolkit & Functional Programming
   - Functional Composition

3. **Advanced** (Advanced)
   - Monads in Functional Programming
   - Reactive Programming with Cycle.js
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

**Architecture Principles You'll Learn:**
- **Lean and Modular Codebase**: Avoid unnecessary code, duplication, or bloat
- **Separation of Concerns**: UI components focus on rendering, Redux slices handle business logic
- **Multiple Command Dispatchers**: Different handlers for different domains
- **Small, Focused Files**: Preferably one function per file for clarity and testability
- **Boilerplate vs. Business Logic**: Keep setup code separate from core application rules
- **No Consolidation**: Distribute business logic by feature rather than centralizing

## Lectures

# What is a function in TypeScript?

## Overview
**Difficulty:** Beginner  
**Estimated Time:** 1-2 hours  
**Prerequisites:** Basic TypeScript knowledge

This lecture introduces the fundamental concept of functions in TypeScript and how they form the basis of functional programming. This is where your journey into **lean, modular functional programming** begins. You'll learn to write functions that are **pure, testable, and composable** - the building blocks of maintainable codebases.

**Why This Matters for Maintenance:**
- **Pure functions** are the foundation of predictable, debuggable code
- **Type safety** prevents runtime errors and makes refactoring safer
- **Function composition** enables building complex systems from simple parts
- **Immutability** ensures your functions don't have hidden side effects

## Learning Objectives
- Understand function types and signatures in TypeScript
- Learn about pure functions and their characteristics
- Master function declarations and expressions
- Practice type-safe function composition

## Function Fundamentals in TypeScript

### Function Declarations
```typescript
// Basic function declaration
function add(a: number, b: number): number {
  return a + b;
}

// Function with optional parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// Function with rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}
```

### Function Expressions
```typescript
// Function expression with type annotation
const multiply: (a: number, b: number) => number = (a, b) => a * b;

// Arrow function with explicit types
const divide = (a: number, b: number): number => a / b;

// Function with generic types
const identity = <T>(value: T): T => value;
```

### Function Types
```typescript
// Function type aliases
type BinaryOperation = (a: number, b: number) => number;
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (item: T) => U;

// Using function types
const add: BinaryOperation = (a, b) => a + b;
const isEven: Predicate<number> = (n) => n % 2 === 0;
const double: Transformer<number, number> = (n) => n * 2;
```

## Pure Functions

### Characteristics of Pure Functions
```typescript
// ✅ Pure function - same input always produces same output
const add = (a: number, b: number): number => a + b;

// ✅ Pure function - no side effects
const formatName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// ❌ Impure function - depends on external state
let total = 0;
const addToTotal = (num: number): number => {
  total += num; // Side effect: mutates external state
  return total;
};

// ❌ Impure function - side effect (console.log)
const addWithLogging = (a: number, b: number): number => {
  console.log(`Adding ${a} and ${b}`); // Side effect
  return a + b;
};
```

### Benefits of Pure Functions
```typescript
// 1. Predictable and testable
const testAdd = () => {
  return add(2, 3) === 5 && add(0, 0) === 0;
};

// 2. Memoizable
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

const expensiveCalculation = memoize((n: number): number => {
  // Simulate expensive computation
  return n * n * n;
});
```

## Higher-Order Functions

### Functions as Parameters
```typescript
// Function that takes a function as parameter
const applyOperation = (
  operation: BinaryOperation, 
  a: number, 
  b: number
): number => {
  return operation(a, b);
};

// Usage
const add: BinaryOperation = (a, b) => a + b;
const multiply: BinaryOperation = (a, b) => a * b;

console.log(applyOperation(add, 5, 3)); // 8
console.log(applyOperation(multiply, 5, 3)); // 15
```

### Functions that Return Functions
```typescript
// Function that returns a function
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
```typescript
// Compose two functions
const compose = <A, B, C>(
  f: (b: B) => C, 
  g: (a: A) => B
): (a: A) => C => {
  return (x: A) => f(g(x));
};

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition
```typescript
// Pipeline: data flows through functions left to right
const pipe = <T>(...fns: Array<(arg: T) => T>) => (x: T): T => {
  return fns.reduce((acc, fn) => fn(acc), x);
};

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
const addFive = add(5);
console.log(addFive(3)); // 8

// Auto-currying utility
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
```typescript
// Partial application utility
const partial = <T extends any[], R>(
  fn: (...args: T) => R, 
  ...args: Partial<T>
) => {
  return (...moreArgs: any[]): R => {
    return fn(...args, ...moreArgs);
  };
};

const greet = (greeting: string, name: string): string => 
  `${greeting}, ${name}!`;

const sayHello = partial(greet, 'Hello');
console.log(sayHello('Alice')); // "Hello, Alice!"
```

## Real-World Examples

### Data Processing Functions
```typescript
// Type-safe data transformation functions
interface User {
  name: string;
  age: number;
  email: string;
}

const validateUser = (user: User): User => {
  if (!user.name) throw new Error('Name is required');
  if (!user.email) throw new Error('Email is required');
  if (user.age < 0) throw new Error('Age must be positive');
  return user;
};

const formatUser = (user: User): string => {
  return `${user.name} (${user.age}) - ${user.email}`;
};

const processUser = pipe(validateUser, formatUser);

// Usage
const user: User = { name: 'Alice', age: 25, email: 'alice@example.com' };
console.log(processUser(user)); // "Alice (25) - alice@example.com"
```

### Configuration Functions
```typescript
// Function for creating configuration objects
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

const createConfig = (
  apiUrl: string, 
  timeout: number = 5000, 
  retries: number = 3
): Config => {
  return { apiUrl, timeout, retries };
};

const validateConfig = (config: Config): Config => {
  if (!config.apiUrl) throw new Error('API URL is required');
  if (config.timeout < 0) throw new Error('Timeout must be positive');
  if (config.retries < 0) throw new Error('Retries must be positive');
  return config;
};

const createValidConfig = pipe(createConfig, validateConfig);
```

## Exercise
Create a type-safe function library that includes:
- A `map` function that works with arrays and objects
- A `filter` function with predicate support
- A `reduce` function for both arrays and objects
- A `compose` function that can handle multiple arguments

## Resources
- [TypeScript Functions](https://www.typescriptlang.org/docs/handbook/functions.html)
- [Functional Programming in TypeScript](https://github.com/gcanti/fp-ts)

# The simplest FP TS Hello World

## Overview
**Difficulty:** Beginner  
**Estimated Time:** 1 hour  
**Prerequisites:** What is a function in TypeScript?

This lecture demonstrates the simplest possible functional programming example in TypeScript - a pure function that processes data without side effects.

## Learning Objectives
- Write your first pure function in TypeScript
- Understand function composition in practice
- Learn to avoid side effects
- Practice functional programming principles

## The Simplest Functional Program

### Pure Function Example
```typescript
// The simplest pure function
const greet = (name: string): string => `Hello, ${name}!`;

// Usage
console.log(greet('World')); // "Hello, World!"
console.log(greet('Alice')); // "Hello, Alice!"
```

### Why This is Functional Programming
```typescript
// 1. Pure function - same input always produces same output
console.log(greet('World')); // "Hello, World!"
console.log(greet('World')); // "Hello, World!" (same result)

// 2. No side effects - doesn't modify external state
const name = 'Alice';
const greeting = greet(name);
console.log(name); // 'Alice' (unchanged)

// 3. Referential transparency - can be replaced with its result
const result = greet('World');
console.log(result); // "Hello, World!"
console.log('Hello, World!'); // Same output
```

## Function Composition Example

### Simple Composition
```typescript
// Pure functions
const toUpperCase = (str: string): string => str.toUpperCase();
const addExclamation = (str: string): string => str + '!';

// Compose functions
const shout = (name: string): string => {
  return addExclamation(toUpperCase(greet(name)));
};

console.log(shout('World')); // "HELLO, WORLD!!"
```

### Using Composition Utility
```typescript
// Composition utility
const compose = <A, B, C>(
  f: (b: B) => C, 
  g: (a: A) => B
): (a: A) => C => {
  return (x: A) => f(g(x));
};

// Compose multiple functions
const shout = compose(
  addExclamation,
  compose(toUpperCase, greet)
);

console.log(shout('World')); // "HELLO, WORLD!!"
```

## Data Transformation Example

### Simple Data Processing
```typescript
// Pure functions for data transformation
const double = (n: number): number => n * 2;
const addOne = (n: number): number => n + 1;
const toString = (n: number): string => n.toString();

// Compose transformations
const processNumber = (n: number): string => {
  return toString(addOne(double(n)));
};

console.log(processNumber(5)); // "11"
```

### Array Processing
```typescript
// Pure functions for array processing
const numbers = [1, 2, 3, 4, 5];

// Transform each number
const doubled = numbers.map(double);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter even numbers
const isEven = (n: number): boolean => n % 2 === 0;
const evens = numbers.filter(isEven);
console.log(evens); // [2, 4]

// Reduce to sum
const sum = (acc: number, n: number): number => acc + n;
const total = numbers.reduce(sum, 0);
console.log(total); // 15
```

## Avoiding Side Effects

### Good vs Bad Examples
```typescript
// ✅ Good - Pure function
const calculateArea = (width: number, height: number): number => {
  return width * height;
};

// ❌ Bad - Side effect (console.log)
const calculateAreaWithLogging = (width: number, height: number): number => {
  const area = width * height;
  console.log(`Area calculated: ${area}`); // Side effect
  return area;
};

// ❌ Bad - Mutates external state
let totalArea = 0;
const calculateAndStoreArea = (width: number, height: number): number => {
  const area = width * height;
  totalArea += area; // Side effect: mutation
  return area;
};
```

## Testing Pure Functions

### Simple Testing
```typescript
// Pure functions are easy to test
const testGreet = (): boolean => {
  return greet('World') === 'Hello, World!' &&
         greet('Alice') === 'Hello, Alice!' &&
         greet('') === 'Hello, !';
};

const testProcessNumber = (): boolean => {
  return processNumber(5) === '11' &&
         processNumber(0) === '1' &&
         processNumber(10) === '21';
};

console.log('Greet tests:', testGreet()); // true
console.log('Process number tests:', testProcessNumber()); // true
```

## Real-World Simple Example

### User Name Processing
```typescript
// Pure functions for user name processing
const trim = (str: string): string => str.trim();
const capitalize = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatName = (name: string): string => {
  return capitalize(trim(name));
};

// Usage
console.log(formatName('  alice  ')); // "Alice"
console.log(formatName('BOB')); // "Bob"
console.log(formatName('charlie')); // "Charlie"
```

### Configuration Builder
```typescript
// Pure function for building configuration
interface AppConfig {
  name: string;
  version: string;
  debug: boolean;
}

const createConfig = (
  name: string, 
  version: string, 
  debug: boolean = false
): AppConfig => {
  return { name, version, debug };
};

const validateConfig = (config: AppConfig): AppConfig => {
  if (!config.name) throw new Error('Name is required');
  if (!config.version) throw new Error('Version is required');
  return config;
};

const buildConfig = (name: string, version: string): AppConfig => {
  return validateConfig(createConfig(name, version));
};

// Usage
const config = buildConfig('MyApp', '1.0.0');
console.log(config); // { name: 'MyApp', version: '1.0.0', debug: false }
```

## Key Takeaways

### 1. Start Simple
- Begin with pure functions that have no side effects
- Focus on input → output transformations
- Keep functions small and focused

### 2. Composition Over Complexity
- Build complex behavior from simple functions
- Use composition to combine functions
- Avoid deeply nested logic

### 3. Immutability
- Never modify input parameters
- Return new values instead of modifying existing ones
- Use const for variables that shouldn't change

### 4. Testing
- Pure functions are easy to test
- Same input always produces same output
- No need to mock external dependencies

## Exercise
Create a simple functional program that:
1. Takes a list of numbers
2. Filters out negative numbers
3. Doubles the remaining numbers
4. Sums the results
5. Returns the final sum

Make sure all functions are pure and compose them together.

## Resources
- [Functional Programming Fundamentals](https://www.freecodecamp.org/news/functional-programming-in-javascript/)
- [Pure Functions](https://www.sitepoint.com/functional-programming-pure-functions/)

# Basic Functional Programming JavaScript Knowledge

## Overview
**Difficulty:** Beginner  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic JavaScript knowledge

This lecture introduces the fundamental concepts of functional programming using vanilla JavaScript.

## Learning Objectives
- Understand pure functions and their benefits
- Learn about immutability and why it matters
- Master higher-order functions
- Practice functional programming patterns

## Core Concepts

### 1. Pure Functions
A pure function always returns the same output for the same input and has no side effects.

```javascript
// ✅ Pure function
const add = (a, b) => a + b;

// ❌ Impure function (side effect)
const addWithLogging = (a, b) => {
  console.log('Adding numbers'); // Side effect
  return a + b;
};

// ❌ Impure function (depends on external state)
let total = 0;
const addToTotal = (num) => {
  total += num; // Mutates external state
  return total;
};
```

### 2. Immutability
Never modify existing data structures; create new ones instead.

```javascript
// ❌ Mutating arrays
const numbers = [1, 2, 3];
numbers.push(4); // Mutation!

// ✅ Immutable array operations
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4]; // Spread operator
const doubledNumbers = numbers.map(n => n * 2); // Map creates new array

// ❌ Mutating objects
const user = { name: 'Alice', age: 25 };
user.age = 26; // Mutation!

// ✅ Immutable object updates
const user = { name: 'Alice', age: 25 };
const updatedUser = { ...user, age: 26 }; // Spread operator
```

### 3. Higher-Order Functions
Functions that take other functions as arguments or return functions.

```javascript
// Function that takes a function as argument
const applyOperation = (operation, a, b) => operation(a, b);

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

console.log(applyOperation(add, 5, 3)); // 8
console.log(applyOperation(multiply, 5, 3)); // 15

// Function that returns a function
const createGreeter = (greeting) => {
  return (name) => `${greeting}, ${name}!`;
};

const sayHello = createGreeter('Hello');
const sayGoodbye = createGreeter('Goodbye');

console.log(sayHello('Alice')); // "Hello, Alice!"
console.log(sayGoodbye('Bob')); // "Goodbye, Bob!"
```

## Array Methods for Functional Programming

### 1. map() - Transform Elements
```javascript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Transform objects
const users = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

const names = users.map(user => user.name);
console.log(names); // ['Alice', 'Bob']
```

### 2. filter() - Select Elements
```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Get even numbers
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6]

// Filter objects
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

const activeUsers = users.filter(user => user.active);
console.log(activeUsers); // [{ name: 'Alice', age: 25, active: true }, { name: 'Charlie', age: 35, active: true }]
```

### 3. reduce() - Accumulate Values
```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 15

// Group by property
const users = [
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
}, {});

console.log(groupedByCity);
// { NYC: [{ name: 'Alice', age: 25, city: 'NYC' }, { name: 'Charlie', age: 35, city: 'NYC' }], LA: [{ name: 'Bob', age: 30, city: 'LA' }] }
```

### 4. Chaining Methods
```javascript
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'David', age: 20, active: true }
];

// Get names of active users over 25
const result = users
  .filter(user => user.active)
  .filter(user => user.age > 25)
  .map(user => user.name);

console.log(result); // ['Charlie']
```

## Function Composition Basics

### Simple Composition
```javascript
// Compose two functions
const compose = (f, g) => x => f(g(x));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12

// Compose multiple functions
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const processData = pipe(
  x => x * 2,
  x => x + 1,
  x => x.toString()
);

console.log(processData(5)); // "11"
```

## Real-World Examples

### Data Processing Pipeline
```javascript
const orders = [
  { id: 1, amount: 100, status: 'completed' },
  { id: 2, amount: 200, status: 'pending' },
  { id: 3, amount: 150, status: 'completed' },
  { id: 4, amount: 300, status: 'cancelled' }
];

// Calculate total revenue from completed orders
const totalRevenue = orders
  .filter(order => order.status === 'completed')
  .map(order => order.amount)
  .reduce((sum, amount) => sum + amount, 0);

console.log(totalRevenue); // 250
```

### Validation Pipeline
```javascript
const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
};

const validateLength = email => email && email.length > 5 ? email : null;
const normalizeEmail = email => email && email.toLowerCase();

const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Best Practices

### 1. Keep Functions Small and Focused
```javascript
// ❌ Too many responsibilities
const processUser = (user) => {
  // Validation, transformation, and side effects all mixed together
  if (!user.name) throw new Error('Name required');
  const processed = { ...user, name: user.name.toUpperCase() };
  saveToDatabase(processed);
  return processed;
};

// ✅ Separated concerns
const validateUser = (user) => {
  if (!user.name) throw new Error('Name required');
  return user;
};

const transformUser = (user) => ({
  ...user,
  name: user.name.toUpperCase()
});

const processUser = pipe(validateUser, transformUser);
```

### 2. Avoid Side Effects
```javascript
// ❌ Side effects in pure functions
const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  console.log(`Total: ${total}`); // Side effect
  return total;
};

// ✅ Pure function
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### 3. Use Descriptive Names
```javascript
// ❌ Unclear names
const fn = (arr) => arr.filter(x => x > 0).map(x => x * 2);

// ✅ Descriptive names
const getPositiveNumbers = (numbers) => numbers.filter(num => num > 0);
const doubleNumbers = (numbers) => numbers.map(num => num * 2);
const processNumbers = pipe(getPositiveNumbers, doubleNumbers);
```

## Exercise
Create a pure function that processes a list of products and returns the total price of items that are in stock and cost less than $100.

## Resources
- [Eloquent JavaScript - Chapter 5: Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)
- [Functional Programming in JavaScript](https://www.freecodecamp.org/news/functional-programming-in-javascript/)

# ES6+ Features for Functional Programming

## Overview
**Difficulty:** Beginner-Intermediate  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic Functional Programming JavaScript knowledge

This lecture explores how modern JavaScript features enhance functional programming capabilities.

## Learning Objectives
- Master arrow functions and their benefits
- Understand destructuring and spread operators
- Learn template literals and default parameters
- Explore modules and their impact on FP

## Arrow Functions

### Basic Syntax
```javascript
// Traditional function
const add = function(a, b) {
  return a + b;
};

// Arrow function
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const double = x => x * 2;

// No parameters
const getRandom = () => Math.random();

// Multiple statements
const processUser = (user) => {
  const validated = validateUser(user);
  const transformed = transformUser(validated);
  return transformed;
};
```

### Lexical `this` Binding
```javascript
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
```javascript
// Cleaner higher-order functions
const numbers = [1, 2, 3, 4, 5];

// Traditional
const doubled = numbers.map(function(num) {
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
```javascript
// Basic destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]

// Function parameters
const processUser = ([name, age, city]) => {
  return { name, age, city };
};

const userData = ['Alice', 25, 'NYC'];
const user = processUser(userData);
console.log(user); // { name: 'Alice', age: 25, city: 'NYC' }

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```

### Object Destructuring
```javascript
// Basic object destructuring
const user = { name: 'Alice', age: 25, city: 'NYC' };
const { name, age, city } = user;
console.log(name, age, city); // Alice 25 NYC

// Renaming variables
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // Alice 25

// Default values
const { name, age, country = 'USA' } = user;
console.log(country); // USA

// Nested destructuring
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
```javascript
// Destructuring in function parameters
const createUser = ({ name, age, email = null }) => {
  return { name, age, email };
};

const user = createUser({ name: 'Alice', age: 25 });
console.log(user); // { name: 'Alice', age: 25, email: null }

// Multiple return values
const getUserStats = (user) => {
  const { name, posts } = user;
  const postCount = posts.length;
  const avgLikes = posts.reduce((sum, post) => sum + post.likes, 0) / postCount;
  
  return { name, postCount, avgLikes };
};
```

## Spread and Rest Operators

### Spread Operator
```javascript
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
```javascript
// Collecting arguments
const sum = (...numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
};

console.log(sum(1, 2, 3, 4, 5)); // 15

// Destructuring with rest
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(rest); // [3, 4, 5]

const { name, ...otherProps } = { name: 'Alice', age: 25, city: 'NYC' };
console.log(otherProps); // { age: 25, city: 'NYC' }
```

## Template Literals

### Basic Usage
```javascript
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
```javascript
// Tagged template function
const highlight = (strings, ...values) => {
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
```javascript
// Traditional approach
const greet = (name) => {
  name = name || 'Guest';
  return `Hello, ${name}!`;
};

// Default parameters
const greet = (name = 'Guest') => `Hello, ${name}!`;

console.log(greet('Alice')); // "Hello, Alice!"
console.log(greet()); // "Hello, Guest!"

// Multiple defaults
const createUser = (name = 'Anonymous', age = 18, email = null) => {
  return { name, age, email };
};
```

### Function Defaults
```javascript
// Default function parameter
const processData = (data, processor = x => x) => {
  return processor(data);
};

console.log(processData([1, 2, 3])); // [1, 2, 3]
console.log(processData([1, 2, 3], arr => arr.map(x => x * 2))); // [2, 4, 6]
```

## Modules and Functional Programming

### Named Exports
```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// utils.js
export const compose = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);
export const pipe = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
```

### Default Exports
```javascript
// userService.js
const validateUser = (user) => {
  if (!user.name) throw new Error('Name required');
  return user;
};

const transformUser = (user) => ({
  ...user,
  name: user.name.toUpperCase()
});

const processUser = (user) => {
  const validated = validateUser(user);
  return transformUser(validated);
};

export default processUser;
```

### Importing
```javascript
// main.js
import { add, multiply } from './math.js';
import { compose, pipe } from './utils.js';
import processUser from './userService.js';

// Using imported functions
const result = add(5, 3);
const processedUser = processUser({ name: 'alice', age: 25 });
```

## Enhanced Functional Patterns

### Partial Application
```javascript
// Using default parameters for partial application
const add = (a, b) => a + b;
const addFive = (b) => add(5, b);

console.log(addFive(3)); // 8

// More flexible partial application
const partial = (fn, ...args) => (...moreArgs) => fn(...args, ...moreArgs);
const addFive = partial(add, 5);
console.log(addFive(3)); // 8
```

### Currying with Arrow Functions
```javascript
// Manual currying
const add = (a) => (b) => a + b;
const addFive = add(5);
console.log(addFive(3)); // 8

// Auto-currying utility
const curry = (fn) => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const add = curry((a, b) => a + b);
const addFive = add(5);
console.log(addFive(3)); // 8
```

## Real-World Examples

### Data Processing Pipeline
```javascript
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Using ES6+ features for clean functional code
const getActiveUserNames = users
  .filter(({ active }) => active)
  .map(({ name }) => name)
  .sort();

console.log(getActiveUserNames); // ['Alice', 'Charlie']
```

### Configuration Management
```javascript
const createConfig = (userConfig = {}) => {
  const defaults = {
    theme: 'dark',
    language: 'en',
    notifications: true
  };
  
  return { ...defaults, ...userConfig };
};

const config = createConfig({ theme: 'light' });
console.log(config); // { theme: 'light', language: 'en', notifications: true }
```

## Exercise
Create a functional utility library using ES6+ features that includes:
- A `map` function that works with objects and arrays
- A `filter` function with predicate support
- A `reduce` function for both arrays and objects
- A `compose` function that can handle multiple arguments

## Resources
- [ES6 Features](https://github.com/lukehoban/es6features)
- [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

# TypeScript and Functional Programming

## Overview
**Difficulty:** Intermediate  
**Estimated Time:** 3-4 hours  
**Prerequisites:** ES6+ Features for Functional Programming, Basic TypeScript knowledge

This lecture explores how TypeScript enhances functional programming with type safety and better developer experience.

## Learning Objectives
- Understand type annotations for functional programming
- Master generic types and their applications
- Learn advanced TypeScript patterns for FP
- Explore type-safe functional libraries

## Type Annotations for Functions

### Basic Function Types
```typescript
// Function type annotations
const add: (a: number, b: number) => number = (a, b) => a + b;

// Arrow function with types
const multiply = (a: number, b: number): number => a * b;

// Function type aliases
type BinaryOperation = (a: number, b: number) => number;
const add: BinaryOperation = (a, b) => a + b;
const subtract: BinaryOperation = (a, b) => a - b;
```

### Higher-Order Functions
```typescript
// Function that takes a function as parameter
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (item: T) => U;

const filter = <T>(array: T[], predicate: Predicate<T>): T[] => {
  return array.filter(predicate);
};

const map = <T, U>(array: T[], transformer: Transformer<T, U>): U[] => {
  return array.map(transformer);
};

// Usage
const numbers = [1, 2, 3, 4, 5];
const isEven: Predicate<number> = (n) => n % 2 === 0;
const double: Transformer<number, number> = (n) => n * 2;

const evenNumbers = filter(numbers, isEven);
const doubledNumbers = map(numbers, double);
```

### Function Composition Types
```typescript
// Type-safe composition
type Compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => C;

const compose: Compose = (f, g) => (x) => f(g(x));

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12

// Pipeline composition
type Pipe = <A, B, C>(f: (a: A) => B, g: (b: B) => C) => (a: A) => C;

const pipe: Pipe = (f, g) => (x) => g(f(x));
```

## Generic Types

### Generic Functions
```typescript
// Generic identity function
const identity = <T>(value: T): T => value;

// Generic array operations
const head = <T>(array: T[]): T | undefined => array[0];
const tail = <T>(array: T[]): T[] => array.slice(1);
const last = <T>(array: T[]): T | undefined => array[array.length - 1];

// Usage
const numbers = [1, 2, 3, 4, 5];
const first = head(numbers); // number | undefined
const rest = tail(numbers); // number[]
const lastNum = last(numbers); // number | undefined
```

### Generic Data Structures
```typescript
// Generic Maybe type
type Maybe<T> = T | null;

const safeDivide = (a: number, b: number): Maybe<number> => {
  return b === 0 ? null : a / b;
};

const safeHead = <T>(array: T[]): Maybe<T> => {
  return array.length > 0 ? array[0] : null;
};

// Generic Either type
type Either<L, R> = { left: L } | { right: R };

const parseNumber = (str: string): Either<string, number> => {
  const num = parseInt(str);
  return isNaN(num) 
    ? { left: 'Invalid number' }
    : { right: num };
};
```

### Generic Constraints
```typescript
// Constraint: T must have a length property
const getLength = <T extends { length: number }>(value: T): number => {
  return value.length;
};

console.log(getLength('hello')); // 5
console.log(getLength([1, 2, 3])); // 3

// Constraint: T must be comparable
const max = <T extends number | string>(a: T, b: T): T => {
  return a > b ? a : b;
};

console.log(max(5, 3)); // 5
console.log(max('abc', 'def')); // 'def'
```

## Advanced Type Patterns

### Conditional Types
```typescript
// Conditional type for function return
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Conditional type for array element
type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Usage
const add = (a: number, b: number): number => a + b;
type AddReturn = ReturnType<typeof add>; // number

const numbers = [1, 2, 3];
type NumberElement = ArrayElement<typeof numbers>; // number
```

### Mapped Types
```typescript
// Make all properties optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Usage
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
// Pick specific properties
type UserName = Pick<User, 'name'>; // { name: string }

// Omit specific properties
type UserWithoutEmail = Omit<User, 'email'>; // { name: string; age: number }

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Usage
const createUser = (name: string, age: number): User => ({ name, age, email: null });
type CreateUserParams = Parameters<typeof createUser>; // [string, number]
```

## Type-Safe Functional Libraries

### Maybe Implementation
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

  isJust(): boolean {
    return this.value !== null;
  }

  isNothing(): boolean {
    return this.value === null;
  }
}

// Usage
const safeDivide = (a: number, b: number): Maybe<number> => {
  return b === 0 ? Maybe.nothing() : Maybe.just(a / b);
};

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .bind(x => safeDivide(x, 5))
  .getOrElse(0);

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

  fold<U>(
    leftFn: (value: L) => U,
    rightFn: (value: R) => U
  ): U {
    return this.isLeft 
      ? leftFn(this.leftValue!)
      : rightFn(this.rightValue!);
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
  .map(x => x * 2)
  .fold(
    error => `Error: ${error}`,
    value => `Result: ${value}`
  );

console.log(result); // "Result: 246"
```

## Real-World Examples

### Type-Safe API Client
```typescript
// API response types
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

// API client with type safety
class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    return this.get<User>(`/api/users/${id}`);
  }

  async getPosts(userId: number): Promise<Post[]> {
    return this.get<Post[]>(`/api/users/${userId}/posts`);
  }
}

// Type-safe data processing
const processUserPosts = async (userId: number): Promise<string[]> => {
  const client = new ApiClient();
  
  try {
    const user = await client.getUser(userId);
    const posts = await client.getPosts(userId);
    
    return posts.map(post => `${user.name}: ${post.title}`);
  } catch (error) {
    console.error('Error processing user posts:', error);
    return [];
  }
};
```

### Type-Safe Redux Actions
```typescript
// Action types
type Action<T extends string, P = any> = {
  type: T;
  payload: P;
};

type AddTodoAction = Action<'ADD_TODO', { text: string; completed: boolean }>;
type ToggleTodoAction = Action<'TOGGLE_TODO', number>;
type DeleteTodoAction = Action<'DELETE_TODO', number>;

type TodoAction = AddTodoAction | ToggleTodoAction | DeleteTodoAction;

// Action creators
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

// Type-safe reducer
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
Create a type-safe functional utility library that includes:
- A generic `Result<T, E>` type for error handling
- A generic `Option<T>` type for nullable values
- Type-safe composition functions
- Generic data transformation pipelines

## Resources
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Functional Programming in TypeScript](https://github.com/gcanti/fp-ts)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

# Redux Standard Patterns & Functional Programming

## Overview
**Difficulty:** Intermediate  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic Functional Programming JavaScript knowledge

Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts. While this covers traditional Redux patterns, **Redux Toolkit (RTK) and RTK Query are the modern, official approach** that supersedes these patterns in production applications.

**Important Note:** This lecture provides foundational understanding, but **RTK and RTK Query take absolute priority** in modern applications. They eliminate the need for most hand-written data fetching logic and provide better developer experience while maintaining functional programming principles.

## Learning Objectives
- Understand how Redux implements functional programming principles
- Learn to write pure reducers and action creators
- Master immutable state updates
- Practice functional composition with Redux

## Key Functional Programming Concepts in Redux

### 1. Pure Functions
Redux reducers must be pure functions:
```javascript
// Pure function - same input always produces same output
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // No side effects, immutable
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
```

### 2. Immutability
State updates must be immutable:
```javascript
// ❌ Wrong - mutating state
const wrongReducer = (state, action) => {
  state.count += 1; // Mutation!
  return state;
};

// ✅ Correct - immutable update
const correctReducer = (state, action) => {
  return {
    ...state,
    count: state.count + 1
  };
};
```

### 3. Composition
Redux combines multiple reducers functionally:
```javascript
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer
});
```

## Standard Patterns

### Action Creators as Pure Functions
```javascript
// Pure function that creates actions
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});
```

### Selectors as Pure Functions
```javascript
// Pure function for data selection
const selectCompletedTodos = (state) => 
  state.todos.filter(todo => todo.completed);

const selectTodoCount = (state) => 
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

# Redux Toolkit & Functional Programming

## Overview
**Difficulty:** Intermediate  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Redux Standard Patterns & Functional Programming

Redux Toolkit (RTK) simplifies Redux while maintaining functional programming principles. It provides utilities that make functional patterns more accessible. **This is the definitive modern Redux approach** that should be used in all new applications.

**Why RTK is Essential:**
- **Official Redux team support** ensuring long-term maintenance and best practices
- **Built-in Immer integration** for safe immutable updates with mutable syntax
- **Automatic action creator generation** reducing boilerplate
- **TypeScript-first design** with excellent inference and type safety
- **Seamless Redux DevTools integration** for debugging and time-travel
- **RTK Query integration** for data fetching and caching (covered in advanced lectures)

## Learning Objectives
- Understand how RTK maintains functional programming principles
- Learn to use createSlice for pure function generation
- Master async thunks for functional side effects
- Explore RTK Query for pure data fetching

## Functional Programming in RTK

### 1. createSlice - Pure Function Generators
```javascript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // Each reducer is a pure function
    // RTK uses Immer under the hood, so this appears mutable but is actually immutable
    addTodo: (state, action) => {
      state.push(action.payload); // Immer handles immutability
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  }
});
```

### 2. Functional Action Creators
```javascript
// RTK automatically generates pure action creators
const { addTodo, toggleTodo } = todoSlice.actions;

// These are pure functions
const newTodo = addTodo({ id: 1, text: 'Learn FP', completed: false });
const toggleAction = toggleTodo(1);
```

### 3. createAsyncThunk - Functional Side Effects
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Pure function that returns a thunk (function returning function)
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}/todos`);
    return response.json();
  }
);
```

## Functional Benefits of RTK

### Immutability Made Easy
```javascript
// RTK uses Immer under the hood
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
```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,
    counter: counterSlice.reducer,
    // Composition of pure reducers
  }
});
```

## Functional Patterns in RTK Query

### Pure Data Fetching
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Pure function that defines data fetching
    getTodos: builder.query({
      query: (userId) => `users/${userId}/todos`,
      // Transform is a pure function
      transformResponse: (response) => response.data
    })
  })
});
```

## Key Takeaways
- RTK maintains functional programming principles
- Immer provides immutable updates with mutable syntax
- Async operations are handled functionally
- Composition remains a core pattern

## Resources
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

## Exercise
Create a Redux Toolkit slice for a user profile with async thunk for fetching user data. 

# Functional Composition

## Overview
**Difficulty:** Intermediate  
**Estimated Time:** 2-3 hours  
**Prerequisites:** Basic Functional Programming JavaScript knowledge, ES6+ Features for Functional Programming

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

## Learning Objectives
- Master mathematical function composition
- Learn pipeline composition patterns
- Understand point-free programming
- Practice composition with currying

## Function Composition Basics

### Mathematical Composition
```javascript
// Mathematical composition: (f ∘ g)(x) = f(g(x))
const compose = (f, g) => x => f(g(x));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition
```javascript
// Pipeline: data flows through functions left to right
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const processData = pipe(
  x => x * 2,
  x => x + 1,
  x => x.toString()
);

console.log(processData(5)); // "11"
```

## Real-World Composition Examples

### Data Processing Pipeline
```javascript
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pure functions for data transformation
const filterActive = users => users.filter(user => user.active);
const mapNames = users => users.map(user => user.name);
const sortNames = names => names.sort();

// Compose the pipeline
const getActiveUserNames = pipe(filterActive, mapNames, sortNames);
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]
```

### Validation Pipeline
```javascript
const validateEmail = email => email.includes('@') ? email : null;
const validateLength = email => email && email.length > 5 ? email : null;
const normalizeEmail = email => email && email.toLowerCase();

const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Advanced Composition Patterns

### Point-Free Style
```javascript
// Avoid mentioning the data explicitly
const prop = key => obj => obj[key];
const map = fn => arr => arr.map(fn);
const filter = fn => arr => arr.filter(fn);

// Point-free composition
const getActiveUserNames = pipe(
  filter(prop('active')),
  map(prop('name')),
  sort
);
```

### Composition with Currying
```javascript
const curry = fn => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const add = curry((a, b) => a + b);
const multiply = curry((a, b) => a * b);

const addThenMultiply = pipe(add(5), multiply(2));
console.log(addThenMultiply(3)); // 16
```

## Composition in React/Redux

### Selector Composition
```javascript
// Compose selectors for complex data queries
const selectUsers = state => state.users;
const selectActiveUsers = pipe(selectUsers, filter(prop('active')));
const selectActiveUserNames = pipe(selectActiveUsers, map(prop('name')));
```

### Action Creator Composition
```javascript
const withMeta = meta => action => ({ ...action, meta });
const withTimestamp = action => ({ ...action, timestamp: Date.now() });

const createActionWithMeta = pipe(
  withMeta({ source: 'user' }),
  withTimestamp
);

const addTodo = text => ({ type: 'ADD_TODO', payload: { text } });
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

# Monads in Functional Programming

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Functional Composition, TypeScript and Functional Programming

Monads are a fundamental concept in functional programming that handle side effects and complex computations. This lecture explores monads based on Philip Wadler's work and their practical applications.

## Learning Objectives
- Understand monad theory and laws
- Implement common monad types (Maybe, Either, List)
- Learn to use monads for error handling
- Practice monad composition patterns

## What is a Monad?

A monad is a type that wraps a value and provides two operations:
1. **return/unit**: Wraps a value in the monad
2. **bind/flatMap**: Chains operations on the monad

```javascript
// Monad interface (conceptual)
class Monad {
  static return(value) { /* wraps value */ }
  bind(fn) { /* chains operations */ }
}
```

## Common Monad Types

### 1. Maybe Monad (Handles null/undefined)
```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static just(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  bind(fn) {
    return this.value === null || this.value === undefined
      ? Maybe.nothing()
      : fn(this.value);
  }

  map(fn) {
    return this.bind(value => Maybe.just(fn(value)));
  }

  getOrElse(defaultValue) {
    return this.value === null || this.value === undefined 
      ? defaultValue 
      : this.value;
  }
}

// Usage
const safeDivide = (a, b) => 
  b === 0 ? Maybe.nothing() : Maybe.just(a / b);

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .bind(x => safeDivide(x, 5));

console.log(result.value); // 1
```

### 2. Either Monad (Handles errors)
```javascript
class Either {
  constructor(value, isLeft = false) {
    this.value = value;
    this.isLeft = isLeft;
  }

  static left(error) {
    return new Either(error, true);
  }

  static right(value) {
    return new Either(value, false);
  }

  bind(fn) {
    return this.isLeft ? this : fn(this.value);
  }

  map(fn) {
    return this.bind(value => Either.right(fn(value)));
  }
}

// Usage
const parseNumber = (str) => {
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
```javascript
class List {
  constructor(values) {
    this.values = values;
  }

  static return(value) {
    return new List([value]);
  }

  bind(fn) {
    const results = this.values.flatMap(value => fn(value).values);
    return new List(results);
  }

  map(fn) {
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
```javascript
// return(a).bind(f) === f(a)
const a = 5;
const f = x => Maybe.just(x * 2);

const left = Maybe.just(a).bind(f);
const right = f(a);
// left.value === right.value
```

### 2. Right Identity
```javascript
// m.bind(return) === m
const m = Maybe.just(5);
const left = m.bind(Maybe.just);
const right = m;
// left.value === right.value
```

### 3. Associativity
```javascript
// m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
const m = Maybe.just(5);
const f = x => Maybe.just(x * 2);
const g = x => Maybe.just(x + 1);

const left = m.bind(f).bind(g);
const right = m.bind(x => f(x).bind(g));
// left.value === right.value
```

## Practical Applications

### Error Handling
```javascript
const validateUser = (user) => {
  if (!user.name) return Either.left('Name required');
  if (!user.email) return Either.left('Email required');
  return Either.right(user);
};

const saveUser = (user) => {
  // Simulate database save
  return Either.right({ ...user, id: Date.now() });
};

const result = validateUser({ name: 'Alice', email: 'alice@example.com' })
  .bind(saveUser)
  .map(user => `User ${user.name} saved with ID ${user.id}`);
```

### Optional Chaining
```javascript
const getUser = (id) => Maybe.just({ id, name: 'Alice' });
const getProfile = (user) => Maybe.just({ ...user, bio: 'Developer' });
const getAvatar = (profile) => Maybe.just({ ...profile, avatar: 'avatar.jpg' });

const result = getUser(1)
  .bind(getProfile)
  .bind(getAvatar)
  .map(profile => profile.avatar);
```

## Monads in Modern JavaScript

### Promise as a Monad
```javascript
// Promise implements monad-like behavior
const fetchUser = (id) => fetch(`/api/users/${id}`).then(r => r.json());
const fetchPosts = (user) => fetch(`/api/users/${user.id}/posts`).then(r => r.json());

const result = fetchUser(1)
  .then(user => fetchPosts(user))
  .then(posts => posts.map(post => post.title));
```

### Array as a Monad
```javascript
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

# Reactive Programming with Cycle.js

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Functional Composition, Monads in Functional Programming

Reactive programming is a paradigm focused on data streams and propagation of change. This lecture explores reactive programming concepts through Andre Staltz's Cycle.js framework.

## Learning Objectives
- Understand reactive programming principles
- Learn to work with data streams
- Master MVI pattern implementation
- Practice functional reactive programming

## What is Reactive Programming?

Reactive programming is programming with asynchronous data streams. Everything is a stream:
- User events (clicks, typing)
- HTTP requests
- Timer events
- Component state changes

```javascript
// Traditional imperative approach
let count = 0;
button.addEventListener('click', () => {
  count++;
  display.textContent = count;
});

// Reactive approach with streams
const clickStream = fromEvent(button, 'click');
const countStream = clickStream.pipe(
  scan((acc) => acc + 1, 0)
);
countStream.subscribe(count => display.textContent = count);
```

## Core Concepts

### 1. Streams
```javascript
// A stream is a sequence of events over time
const stream = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

stream.subscribe({
  next: value => console.log(value),
  complete: () => console.log('Done')
});
```

### 2. Operators
```javascript
// Transform streams using operators
const numbers$ = of(1, 2, 3, 4, 5);

const doubled$ = numbers$.pipe(
  map(x => x * 2),
  filter(x => x > 5)
);

doubled$.subscribe(console.log); // 6, 8, 10
```

### 3. Composition
```javascript
// Combine multiple streams
const clicks$ = fromEvent(button, 'click');
const timer$ = interval(1000);

const combined$ = merge(clicks$, timer$);
combined$.subscribe(event => console.log('Event:', event));
```

## Cycle.js Architecture

### MVI Pattern (Model-View-Intent)
```javascript
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

function main(sources) {
  // Intent: User actions → actions
  const click$ = sources.DOM.select('.button').events('click');
  const action$ = click$.map(() => ({ type: 'INCREMENT' }));

  // Model: Actions → state
  const state$ = action$.pipe(
    scan((state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return { ...state, count: state.count + 1 };
        default:
          return state;
      }
    }, { count: 0 })
  );

  // View: State → DOM
  const vdom$ = state$.map(state => 
    h('div', [
      h('h1', `Count: ${state.count}`),
      h('button.button', 'Increment')
    ])
  );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver('#app')
});
```

## Functional Reactive Programming

### Pure Functions with Streams
```javascript
// Pure function that transforms a stream
const incrementCounter = (action$) => 
  action$.pipe(
    filter(action => action.type === 'INCREMENT'),
    scan((count, action) => count + 1, 0)
  );

// Pure function for DOM rendering
const renderCounter = (count$) =>
  count$.pipe(
    map(count => h('div', [
      h('h1', `Count: ${count}`),
      h('button', 'Increment')
    ]))
  );
```

### Composition of Streams
```javascript
// Compose multiple stream transformations
const processUserInput = pipe(
  debounceTime(300),
  map(event => event.target.value),
  filter(text => text.length > 2),
  distinctUntilChanged()
);

const searchResults$ = userInput$.pipe(processUserInput);
```

## Real-World Examples

### Search with Debouncing
```javascript
function searchComponent(sources) {
  const input$ = sources.DOM.select('.search').events('input');
  
  const searchTerm$ = input$.pipe(
    map(event => event.target.value),
    debounceTime(300),
    filter(term => term.length > 2)
  );

  const searchResults$ = searchTerm$.pipe(
    switchMap(term => 
      sources.HTTP.get(`/api/search?q=${term}`)
    ),
    map(response => response.body.results)
  );

  const vdom$ = combineLatest(searchTerm$, searchResults$).pipe(
    map(([term, results]) => 
      h('div', [
        h('input.search', { placeholder: 'Search...' }),
        h('ul', results.map(result => 
          h('li', result.title)
        ))
      ])
    )
  );

  return {
    DOM: vdom$,
    HTTP: searchTerm$.map(term => ({
      url: `/api/search?q=${term}`,
      category: 'search'
    }))
  };
}
```

### Todo App with Streams
```javascript
function todoApp(sources) {
  // Intent
  const addTodo$ = sources.DOM.select('.add-todo').events('click');
  const newTodoText$ = sources.DOM.select('.new-todo').events('input')
    .map(event => event.target.value);

  // Model
  const todos$ = addTodo$.pipe(
    withLatestFrom(newTodoText$),
    scan((todos, [_, text]) => [
      ...todos,
      { id: Date.now(), text, completed: false }
    ], [])
  );

  // View
  const vdom$ = todos$.pipe(
    map(todos => 
      h('div', [
        h('input.new-todo', { placeholder: 'New todo' }),
        h('button.add-todo', 'Add'),
        h('ul', todos.map(todo => 
          h('li', { key: todo.id }, todo.text)
        ))
      ])
    )
  );

  return { DOM: vdom$ };
}
```

## Benefits of Reactive Programming

### 1. Declarative
```javascript
// Declarative: Describe what you want, not how to get it
const result$ = source$.pipe(
  filter(x => x > 0),
  map(x => x * 2),
  take(5)
);
```

### 2. Compositional
```javascript
// Compose complex behaviors from simple streams
const userInput$ = fromEvent(input, 'input');
const validation$ = userInput$.pipe(
  map(validate),
  distinctUntilChanged()
);
const submit$ = fromEvent(form, 'submit');
const formData$ = combineLatest(userInput$, validation$);
```

### 3. Testable
```javascript
// Easy to test with marble testing
const input$ = cold('a-b-c', { a: 1, b: 2, c: 3 });
const result$ = input$.pipe(map(x => x * 2));
const expected$ = cold('a-b-c', { a: 2, b: 4, c: 6 });

expectObservable(result$).toBe(expected$);
```

## Resources
- [Andre Staltz - Cycle.js](https://cycle.js.org/)

## Exercise
Create a reactive counter component that can increment, decrement, and reset, using only pure functions and stream composition. 

# Practical Applications of Functional Programming

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 4-5 hours  
**Prerequisites:** All previous lectures

This lecture combines all the functional programming concepts we've learned into practical, real-world applications. We'll see how Redux, composition, monads, and reactive programming work together.

## Learning Objectives
- Integrate all functional programming concepts
- Build complete functional applications
- Implement advanced patterns and optimizations
- Practice real-world functional programming

## Building a Functional Todo Application

### 1. State Management with Redux Toolkit
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Pure action creators
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
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
  async (userId) => {
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
```javascript
// Pure functions for data transformation
const filterByStatus = (status) => (todos) => 
  todos.filter(todo => todo.completed === status);

const sortByDate = (todos) => 
  todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const mapToDisplay = (todos) => 
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
```javascript
// Either monad for API calls
class ApiResult {
  constructor(value, isError = false) {
    this.value = value;
    this.isError = isError;
  }

  static success(value) {
    return new ApiResult(value, false);
  }

  static error(message) {
    return new ApiResult(message, true);
  }

  bind(fn) {
    return this.isError ? this : fn(this.value);
  }

  map(fn) {
    return this.bind(value => ApiResult.success(fn(value)));
  }
}

// Safe API wrapper
const safeApiCall = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return ApiResult.success(data);
  } catch (error) {
    return ApiResult.error(`API call failed: ${error.message}`);
  }
};

// Usage with composition
const fetchUserTodos = pipe(
  (userId) => `/api/users/${userId}/todos`,
  safeApiCall,
  result => result.map(processTodos)
);
```

### 4. Reactive Components with Streams
```javascript
import { fromEvent, combineLatest, merge } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators';

function TodoComponent(sources) {
  // Intent: User actions
  const addTodo$ = sources.DOM.select('.add-todo').events('click');
  const inputChange$ = sources.DOM.select('.todo-input').events('input');
  const toggleTodo$ = sources.DOM.select('.todo-item').events('click');

  // Model: State management
  const newTodoText$ = inputChange$.pipe(
    map(event => event.target.value),
    debounceTime(300)
  );

  const todos$ = merge(
    addTodo$.pipe(
      withLatestFrom(newTodoText$),
      map(([_, text]) => ({ type: 'ADD_TODO', payload: { text } }))
    ),
    toggleTodo$.pipe(
      map(event => ({ type: 'TOGGLE_TODO', payload: event.target.dataset.id }))
    )
  ).pipe(
    scan((todos, action) => {
      switch (action.type) {
        case 'ADD_TODO':
          return [...todos, { 
            id: Date.now(), 
            text: action.payload.text, 
            completed: false 
          }];
        case 'TOGGLE_TODO':
          return todos.map(todo => 
            todo.id === parseInt(action.payload) 
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        default:
          return todos;
      }
    }, [])
  );

  // View: Render UI
  const vdom$ = todos$.pipe(
    map(todos => 
      h('div.todo-app', [
        h('input.todo-input', { placeholder: 'Add todo...' }),
        h('button.add-todo', 'Add'),
        h('ul.todo-list', todos.map(todo => 
          h('li.todo-item', { 
            key: todo.id,
            'data-id': todo.id,
            className: todo.completed ? 'completed' : ''
          }, todo.text)
        ))
      ])
    )
  );

  return { DOM: vdom$ };
}
```

## Advanced Patterns

### 1. Functional State Machines
```javascript
// Pure function for state transitions
const createStateMachine = (initialState, transitions) => {
  return (state = initialState, action) => {
    const transition = transitions[action.type];
    return transition ? transition(state, action) : state;
  };
};

// Todo state machine
const todoTransitions = {
  ADD_TODO: (state, action) => ({
    ...state,
    todos: [...state.todos, action.payload]
  }),
  TOGGLE_TODO: (state, action) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === action.payload 
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  }),
  DELETE_TODO: (state, action) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.payload)
  })
};

const todoReducer = createStateMachine(
  { todos: [], filter: 'all' },
  todoTransitions
);
```

### 2. Functional Testing
```javascript
// Pure function testing
const testProcessTodos = () => {
  const input = [
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
const testFilterByStatus = () => {
  const todos = [
    { id: 1, text: 'Task 1', completed: false },
    { id: 2, text: 'Task 2', completed: true },
    { id: 3, text: 'Task 3', completed: false }
  ];

  const activeTodos = filterByStatus(false)(todos);
  const completedTodos = filterByStatus(true)(todos);

  // Property: filtering by status should only return items with that status
  const allActiveAreIncomplete = activeTodos.every(todo => !todo.completed);
  const allCompletedAreComplete = completedTodos.every(todo => todo.completed);

  return allActiveAreIncomplete && allCompletedAreComplete;
};

// Integration testing
const testTodoPipeline = () => {
  const todos = [
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
```javascript
// Maybe monad for component rendering
const safeRender = (component, props) => {
  try {
    return Maybe.just(component(props));
  } catch (error) {
    console.error('Render error:', error);
    return Maybe.nothing();
  }
};

// Usage
const renderTodoList = (todos) => {
  if (!Array.isArray(todos)) {
    throw new Error('Todos must be an array');
  }
  
  return h('ul', todos.map(todo => 
    h('li', { key: todo.id }, todo.text)
  ));
};

const safeTodoList = safeRender(renderTodoList, todos);
safeTodoList.map(vdom => render(vdom)).getOrElse(() => 
  h('div.error', 'Failed to render todos')
);
```

## Performance Optimization

### 1. Memoization
```javascript
// Pure function memoization
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveCalculation = memoize((numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
});
```

### 2. Lazy Evaluation
```javascript
// Lazy stream processing
const createLazyStream = (generator) => {
  return {
    map: (fn) => createLazyStream(function* () {
      for (const item of generator()) {
        yield fn(item);
      }
    }),
    filter: (predicate) => createLazyStream(function* () {
      for (const item of generator()) {
        if (predicate(item)) yield item;
      }
    }),
    take: (count) => createLazyStream(function* () {
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
Build a complete todo application that combines all these patterns: Redux for state, composition for data processing, monads for error handling, and reactive streams for user interactions.

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

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Redux Toolkit & Functional Programming, Practical Applications of Functional Programming

This lecture explores strategies for maintaining a codebase in pure functional programming style, focusing on lean architecture, separation of concerns, and Redux Toolkit best practices. **This is where theory meets practice** - you'll learn how to apply all the functional programming concepts you've learned to build maintainable, scalable applications.

**Core Maintenance Philosophy:**
- **Lean and Modular**: Every file and function has a clear, necessary purpose
- **Separation of Concerns**: UI logic separate from business logic separate from data logic
- **Small, Focused Files**: Preferably one function per file for clarity and testability
- **Multiple Command Dispatchers**: Different handlers for different domains
- **Boilerplate vs. Business Logic**: Keep setup code separate from core application rules
- **No Consolidation**: Distribute business logic by feature rather than centralizing

**Why This Matters:**
- **Maintainability**: Easier to update, debug, and onboard new developers
- **Testability**: Isolated logic is easier to test
- **Scalability**: Adding new features or domains is straightforward
- **Team Collaboration**: Clear boundaries make code ownership obvious

## Learning Objectives
- Understand lean and modular codebase principles
- Master separation of concerns in functional architecture
- Learn Redux Toolkit maintenance patterns
- Practice functional programming maintenance strategies

## Core Maintenance Principles

### 1. Lean and Modular Codebase
```javascript
// ❌ Bloated, monolithic approach
const userService = {
  validateUser: (user) => { /* validation logic */ },
  saveUser: (user) => { /* save logic */ },
  sendEmail: (user) => { /* email logic */ },
  generateReport: (user) => { /* report logic */ },
  // ... 20 more methods
};

// ✅ Lean, modular approach
// userValidation.js
export const validateUser = (user) => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// userRepository.js
export const saveUser = async (user) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return response.json();
};

// emailService.js
export const sendWelcomeEmail = async (user) => {
  // Email logic isolated
};
```

### 2. Separation of Concerns
```javascript
// ❌ Mixed concerns
const UserComponent = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return <div>...</div>;
};

// ✅ Separated concerns
// userSlice.js - Business logic
const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null },
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

// userActions.js - Pure action creators
export const saveUser = createAsyncThunk(
  'user/saveUser',
  async (user) => {
    const validatedUser = validateUser(user);
    return await userRepository.saveUser(validatedUser);
  }
);

// UserComponent.jsx - UI only
const UserComponent = ({ user }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.user);
  
  const handleSave = () => {
    dispatch(saveUser(user));
  };
  
  return <div>...</div>;
};
```

### 3. Small, Focused Files
```javascript
// ❌ Large file with multiple responsibilities
// userManagement.js (200+ lines)
export class UserManager {
  constructor() { /* setup */ }
  
  validateUser(user) { /* validation logic */ }
  saveUser(user) { /* save logic */ }
  updateUser(user) { /* update logic */ }
  deleteUser(userId) { /* delete logic */ }
  sendEmail(user) { /* email logic */ }
  generateReport(user) { /* report logic */ }
  // ... many more methods
}

// ✅ Small, focused files
// userValidation.js (15 lines)
export const validateUser = (user) => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// userRepository.js (20 lines)
export const saveUser = async (user) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  });
  return response.json();
};

// userEmailService.js (25 lines)
export const sendWelcomeEmail = async (user) => {
  // Email-specific logic only
};
```

### 4. One Function Per File
```javascript
// ❌ Multiple functions in one file
// utils.js
export const formatDate = (date) => { /* date formatting */ };
export const formatCurrency = (amount) => { /* currency formatting */ };
export const validateEmail = (email) => { /* email validation */ };
export const debounce = (fn, delay) => { /* debounce utility */ };

// ✅ One function per file
// formatDate.js
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

// formatCurrency.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// validateEmail.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## Redux Toolkit Maintenance Patterns

### 1. Slice Organization
```javascript
// ❌ Monolithic slice
const appSlice = createSlice({
  name: 'app',
  initialState: {
    users: [],
    posts: [],
    comments: [],
    settings: {},
    notifications: [],
    // ... many more domains
  },
  reducers: {
    // 50+ reducers mixed together
  }
});

// ✅ Domain-specific slices
// userSlice.js
const userSlice = createSlice({
  name: 'user',
  initialState: { users: [], loading: false, error: null },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    }
  }
});

// postSlice.js
const postSlice = createSlice({
  name: 'post',
  initialState: { posts: [], loading: false, error: null },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    }
  }
});
```

### 2. RTK Query API Organization
```javascript
// ❌ Single API slice for everything
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => 'users' }),
    createUser: builder.mutation({ query: (user) => ({ url: 'users', method: 'POST', body: user }) }),
    getPosts: builder.query({ query: () => 'posts' }),
    createPost: builder.mutation({ query: (post) => ({ url: 'posts', method: 'POST', body: post }) }),
    getComments: builder.query({ query: () => 'comments' }),
    // ... many more endpoints
  })
});

// ✅ Domain-specific API slices
// userApi.js
const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => 'users' }),
    createUser: builder.mutation({ query: (user) => ({ url: 'users', method: 'POST', body: user }) })
  })
});

// postApi.js
const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => 'posts' }),
    createPost: builder.mutation({ query: (post) => ({ url: 'posts', method: 'POST', body: post }) })
  })
});
```

### 3. Selector Organization
```javascript
// ❌ Complex selectors in components
const UserList = () => {
  const users = useSelector(state => 
    state.user.users.filter(user => user.active)
      .map(user => ({ ...user, displayName: `${user.firstName} ${user.lastName}` }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
  );
};

// ✅ Pure selector functions
// userSelectors.js
export const selectActiveUsers = (state) => 
  state.user.users.filter(user => user.active);

export const selectUserDisplayNames = createSelector(
  [selectActiveUsers],
  (users) => users.map(user => ({
    ...user,
    displayName: `${user.firstName} ${user.lastName}`
  }))
);

export const selectSortedUsers = createSelector(
  [selectUserDisplayNames],
  (users) => users.sort((a, b) => a.displayName.localeCompare(b.displayName))
);

// UserList.jsx
const UserList = () => {
  const users = useSelector(selectSortedUsers);
  return <div>...</div>;
};
```

## Functional Programming Maintenance Benefits

### 1. Testability
```javascript
// Pure functions are easy to test
const validateUser = (user) => {
  if (!user.name) throw new Error('Name required');
  if (!user.email) throw new Error('Email required');
  return user;
};

// Simple, focused tests
describe('validateUser', () => {
  it('should validate a valid user', () => {
    const user = { name: 'Alice', email: 'alice@example.com' };
    expect(validateUser(user)).toEqual(user);
  });
  
  it('should throw error for missing name', () => {
    const user = { email: 'alice@example.com' };
    expect(() => validateUser(user)).toThrow('Name required');
  });
});
```

### 2. Maintainability
```javascript
// Small, focused functions are easy to understand and modify
const formatUserDisplayName = (user) => {
  return `${user.firstName} ${user.lastName}`.trim();
};

// Easy to extend or modify
const formatUserDisplayName = (user, includeTitle = false) => {
  const baseName = `${user.firstName} ${user.lastName}`.trim();
  return includeTitle ? `${user.title} ${baseName}` : baseName;
};
```

### 3. Reusability
```javascript
// Pure functions can be reused across the application
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Used in multiple components
const debouncedSearch = debounce(searchUsers, 300);
const debouncedSave = debounce(saveUser, 1000);
```

## Exercise
Refactor a monolithic user management component into a functional architecture with:
- Separate validation, repository, and UI layers
- Redux Toolkit slices for state management
- RTK Query for data fetching
- Pure selector functions
- One function per file organization

## Resources
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide)
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)

# Redux Toolkit & RTK Query Best Practices

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 3-4 hours  
**Prerequisites:** Redux Toolkit & Functional Programming, Functional Programming Maintenance Strategy

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

## Learning Objectives
- Master RTK Query for data fetching and caching
- Understand Redux Toolkit's functional architecture
- Learn advanced patterns for state management
- Practice functional programming with RTK

## Redux Toolkit's Functional Foundation

### 1. Pure Reducers with Immer
```javascript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // Pure functions that appear mutable but are actually immutable
    addTodo: (state, action) => {
      state.items.push(action.payload); // Immer handles immutability
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
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
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Pure function that returns a thunk
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/todos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Pure function for optimistic updates
const addTodoOptimistic = createAsyncThunk(
  'todos/addTodoOptimistic',
  async (todo, { dispatch }) => {
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
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    // Pure function that defines data fetching
    getTodos: builder.query({
      query: (userId) => `users/${userId}/todos`,
      // Pure transformation function
      transformResponse: (response) => response.data,
      // Pure cache key function
      providesTags: (result, error, userId) => 
        result ? [{ type: 'Todo', id: userId }] : []
    }),
    
    createTodo: builder.mutation({
      query: (todo) => ({
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
```javascript
// Pure cache key generation
const generateCacheKey = (userId, filters) => {
  return `todos-${userId}-${JSON.stringify(filters)}`;
};

// Pure cache invalidation
const invalidateUserTodos = (userId) => [
  { type: 'Todo', id: userId },
  { type: 'Todo', id: 'LIST' }
];

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Todo', 'User'],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: ({ userId, filters = {} }) => ({
        url: `users/${userId}/todos`,
        params: filters
      }),
      providesTags: (result, error, { userId }) => 
        result ? [
          ...result.map(todo => ({ type: 'Todo', id: todo.id })),
          { type: 'Todo', id: `user-${userId}` }
        ] : []
    }),
    
    updateTodo: builder.mutation({
      query: ({ id, updates }) => ({
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
```javascript
// Pure error transformation
const transformError = (error) => {
  if (error.status === 401) {
    return { type: 'AUTH_ERROR', message: 'Please log in again' };
  }
  if (error.status === 404) {
    return { type: 'NOT_FOUND', message: 'Resource not found' };
  }
  return { type: 'GENERIC_ERROR', message: error.data?.message || 'An error occurred' };
};

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: (userId) => `users/${userId}/todos`,
      transformErrorResponse: (response) => transformError(response),
      // Pure retry logic
      retry: (failedAttempts, error) => {
        if (error.status === 500 && failedAttempts < 3) {
          return true;
        }
        return false;
      }
    })
  })
});
```

## Advanced Functional Patterns

### 1. Functional Selectors with Reselect
```javascript
import { createSelector } from '@reduxjs/toolkit';

// Pure selector functions
const selectTodos = (state) => state.todos.items;
const selectFilter = (state) => state.todos.filter;

// Memoized derived state
const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
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
  (todos) => ({
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length
  })
);
```

### 2. Functional Component Integration
```javascript
import { useGetTodosQuery, useCreateTodoMutation } from './api';

// Pure component with RTK Query hooks
const TodoList = ({ userId }) => {
  const { data: todos, isLoading, error } = useGetTodosQuery(userId);
  const [createTodo, { isLoading: isCreating }] = useCreateTodoMutation();
  
  // Pure event handlers
  const handleAddTodo = async (text) => {
    try {
      await createTodo({ userId, text, completed: false }).unwrap();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
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
```javascript
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
      dispatch(setError(error.message));
    }
  }
});
```

## Performance Optimization

### 1. Functional Memoization
```javascript
// Pure memoization utility
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Memoized expensive calculation
const expensiveCalculation = memoize((data) => {
  return data.reduce((acc, item) => acc + item.value, 0);
});
```

### 2. Functional Lazy Loading
```javascript
// Pure lazy loading utility
const createLazyLoader = (loader) => {
  let promise = null;
  return () => {
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
```javascript
// Test pure selectors
describe('todoSelectors', () => {
  it('should filter completed todos', () => {
    const state = {
      todos: {
        items: [
          { id: 1, text: 'Todo 1', completed: true },
          { id: 2, text: 'Todo 2', completed: false }
        ]
      }
    };
    
    const result = selectFilteredTodos(state, 'completed');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
```

### 2. RTK Query Testing
```javascript
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
Create a complete todo application using RTK Query with:
- Pure API definitions with proper caching
- Functional selectors with memoization
- Error handling with pure transformation functions
- Optimistic updates with rollback
- Comprehensive testing

## Resources
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)
- [Redux Toolkit Testing](https://redux-toolkit.js.org/rtk-query/usage/testing)

# Modern Redux Architecture Patterns

## Overview
**Difficulty:** Advanced  
**Estimated Time:** 4-5 hours  
**Prerequisites:** Redux Toolkit & RTK Query Best Practices, Functional Programming Maintenance Strategy

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

## Learning Objectives
- Understand modern Redux architecture priorities
- Master RTK Query-first data management
- Learn functional state machine patterns
- Practice scalable Redux application design

## Modern Redux Architecture Priorities

### 1. RTK Query First Approach
```javascript
// ❌ Legacy approach: Manual data fetching with thunks
const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (userId) => {
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
      query: (userId) => `users/${userId}`
    }),
    getUserPosts: builder.query({
      query: (userId) => `users/${userId}/posts`
    }),
    getUserSettings: builder.query({
      query: (userId) => `users/${userId}/settings`
    })
  })
});

// Functional composition of queries
const useUserData = (userId) => {
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
```javascript
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
// userSlice.js - User domain only
const userSlice = createSlice({
  name: 'user',
  initialState: { currentUser: null },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  }
});

// uiSlice.js - UI state only
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
```javascript
// Pure state machine for user authentication
const createAuthMachine = () => {
  const transitions = {
    LOGIN: (state, action) => ({
      ...state,
      status: 'authenticated',
      user: action.payload,
      error: null
    }),
    LOGOUT: (state) => ({
      ...state,
      status: 'unauthenticated',
      user: null,
      error: null
    }),
    LOGIN_FAILED: (state, action) => ({
      ...state,
      status: 'unauthenticated',
      user: null,
      error: action.payload
    })
  };
  
  return (state = { status: 'unauthenticated', user: null, error: null }, action) => {
    const transition = transitions[action.type];
    return transition ? transition(state, action) : state;
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { status: 'unauthenticated', user: null, error: null },
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
```javascript
// Pure event handlers
const createEventHandlers = (dispatch) => ({
  handleLogin: async (credentials) => {
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
      dispatch(authSlice.actions.loginFailed(error.message));
    }
  },
  
  handleLogout: () => {
    dispatch(authSlice.actions.logout());
  }
});
```

## Scalable Application Architecture

### 1. Feature-Based Organization
```javascript
// Feature-based folder structure
src/
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── authApi.js
│   │   ├── authSelectors.js
│   │   └── components/
│   │       ├── LoginForm.jsx
│   │       └── UserProfile.jsx
│   ├── todos/
│   │   ├── todoSlice.js
│   │   ├── todoApi.js
│   │   ├── todoSelectors.js
│   │   └── components/
│   │       ├── TodoList.jsx
│   │       └── TodoForm.jsx
│   └── posts/
│       ├── postSlice.js
│       ├── postApi.js
│       ├── postSelectors.js
│       └── components/
│           ├── PostList.jsx
│           └── PostEditor.jsx
├── shared/
│   ├── api/
│   │   └── baseApi.js
│   ├── components/
│   │   ├── Button.jsx
│   │   └── Modal.jsx
│   └── utils/
│       ├── validation.js
│       └── formatting.js
└── app/
    ├── store.js
    ├── App.jsx
    └── index.js
```

### 2. Functional API Composition
```javascript
// Base API with shared configuration
const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
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
      query: (updates) => ({
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
      query: (userId) => `users/${userId}/todos`,
      providesTags: (result, error, userId) => 
        result ? [
          ...result.map(todo => ({ type: 'Todo', id: todo.id })),
          { type: 'Todo', id: `user-${userId}` }
        ] : []
    }),
    createTodo: builder.mutation({
      query: (todo) => ({
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
```javascript
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
const TodoList = ({ userId }) => {
  const { data: todos, isLoading, error } = useGetTodosQuery(userId);
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  
  const handleToggle = (todo) => {
    updateTodo({ id: todo.id, completed: !todo.completed });
  };
  
  const handleDelete = (todoId) => {
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
```javascript
// Pure middleware functions
const createLoggingMiddleware = () => (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

const createAnalyticsMiddleware = () => (store) => (next) => (action) => {
  const result = next(action);
  
  // Track specific actions
  if (action.type === 'todos/addTodo') {
    analytics.track('todo_created', { userId: store.getState().auth.user?.id });
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
```javascript
// Pure error boundary with functional composition
const createErrorBoundary = (fallback) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return fallback(this.state.error);
      }
      
      return this.props.children;
    }
  };
};

// Usage with pure error handling
const ErrorFallback = ({ error }) => (
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
```javascript
// Pure performance utilities
const createMemoizedSelector = (selector, equalityFn = shallowEqual) => {
  let lastResult = null;
  let lastArgs = null;
  
  return (...args) => {
    if (lastArgs && equalityFn(args, lastArgs)) {
      return lastResult;
    }
    
    lastArgs = args;
    lastResult = selector(...args);
    return lastResult;
  };
};

// Functional lazy loading
const createLazyComponent = (loader) => {
  let Component = null;
  let promise = null;
  
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
```javascript
// Test pure selectors
describe('todoSelectors', () => {
  it('should select todos by user', () => {
    const state = {
      todos: {
        items: [
          { id: 1, userId: 1, text: 'Todo 1' },
          { id: 2, userId: 2, text: 'Todo 2' },
          { id: 3, userId: 1, text: 'Todo 3' }
        ]
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
    const initialState = { items: [] };
    const todo = { id: 1, text: 'New Todo' };
    
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
```javascript
// Test RTK Query endpoints
describe('todoApi', () => {
  it('should fetch todos', async () => {
    const mockTodos = [
      { id: 1, text: 'Todo 1' },
      { id: 2, text: 'Todo 2' }
    ];
    
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
Build a scalable Redux application with:
- Feature-based architecture
- RTK Query for all data management
- Pure functional components
- Comprehensive error handling
- Performance optimization
- Full test coverage

## Resources
- [Redux Toolkit Architecture](https://redux-toolkit.js.org/usage/usage-guide)
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/advanced-patterns)
- [Redux Best Practices](https://redux.js.org/style-guide/)