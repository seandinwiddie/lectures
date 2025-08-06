# Functional Programming Lectures Index

## Overview
This series of lectures explores functional programming concepts from fundamentals to advanced applications in modern JavaScript development.

## Learning Path
1. **Fundamentals** (Beginner)
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

## Lectures

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

Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts.

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

Redux Toolkit (RTK) simplifies Redux while maintaining functional programming principles. It provides utilities that make functional patterns more accessible.

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

Functional composition is a core principle where complex functions are built by combining simpler functions. This lecture explores composition patterns from James Sinclair and Eric Elliott's work.

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