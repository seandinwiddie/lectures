# ES6+ Features for Functional Programming

This lecture explores how modern TypeScript features enhance functional programming capabilities.

> "Modern JavaScript features like arrow functions, destructuring, and spread operators aren't just syntax sugar—they're tools that make functional programming patterns natural and expressive." - AI Insight

## Arrow Functions

### Basic Syntax

Arrow functions are a shorter, cleaner way to write functions in JavaScript and TypeScript. They're especially useful for simple functions that just return a value. Think of them as a more compact way to write the same thing - like using shorthand instead of writing out the full words.
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
interface User {
  name: string;
  age: number;
  email?: string;
  posts?: { likes: number }[];
}

const processUser = (user: User) => {
  const validated = validateUser(user);
  const transformed = transformUser(validated);
  return transformed;
};
```

### Lexical `this` Binding

The `this` keyword in JavaScript can be tricky - it changes depending on how a function is called. Arrow functions fix this problem by "remembering" what `this` should be from where they were created. This is especially helpful when you're using functions inside other functions, like with timers or event handlers.
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

Arrow functions make functional programming much cleaner and easier to read. When you're working with arrays and using functions like `map`, `filter`, and `reduce`, arrow functions let you write the transformation logic right inline without all the extra syntax. This makes your code more concise and easier to understand.
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

> "Destructuring is syntactic sugar that reveals intent: instead of accessing array[0] and array[1], you declare 'let [first, second] = array'. Pattern matching in TypeScript starts here." - AI Insight

### Array Destructuring

Destructuring is like unpacking a box - you can take items out of arrays and objects and put them into separate variables all at once. It's much cleaner than writing multiple lines to extract each value. The `...rest` syntax lets you collect all the remaining items into a new array.
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

Object destructuring works the same way as array destructuring, but for objects. You can extract properties by name, give them new variable names, provide default values for missing properties, and even extract nested properties. This is especially useful when working with function parameters or API responses.
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

Destructuring in function parameters is really powerful - you can extract exactly the properties you need from an object right in the function signature. This makes your functions more flexible and self-documenting. You can also provide default values for optional properties, making your functions easier to use.
```typescript
// Destructuring in function parameters
const createUser = ({ name, age, email = null }: { name: string; age: number; email?: string }) => {
  return { name, age, email };
};

const user = createUser({ name: 'Alice', age: 25 });
console.log(user); // { name: 'Alice', age: 25, email: null }

// Multiple return values
const getUserStats = (user: User) => {
  const { name, posts = [] } = user;
  const postCount = posts.length;
  const avgLikes = postCount > 0 
    ? posts.reduce((sum, post) => sum + post.likes, 0) / postCount
    : 0;
  
  return { name, postCount, avgLikes };
};
```

## Spread and Rest Operators

> "The spread operator is immutability made elegant: {...obj, name: 'new'} creates a new object without mutation. It's the foundation of Redux reducers and React state updates—copy-on-write as syntax." - AI Insight

### Spread Operator

The spread operator (`...`) is like opening a box and spreading its contents out. For arrays, it takes all the items and puts them in a new array. For objects, it takes all the properties and puts them in a new object. This is perfect for creating copies or combining things without changing the originals - exactly what functional programming is all about!
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

The rest operator (also `...`) is the opposite of spread - instead of spreading things out, it collects things together. It's like gathering scattered items into a basket. In function parameters, it collects all the arguments into an array. In destructuring, it collects all the remaining items into a new array or object.
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

Template literals are a much nicer way to create strings that include variables. Instead of using `+` to concatenate strings and variables, you can use backticks (`) and `${}` to embed expressions directly in your strings. This makes your code much more readable and less error-prone.
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

Tagged templates are an advanced feature that lets you process template literals with a function before they become strings. The function receives the string parts and the interpolated values separately, allowing you to transform them however you want. This is useful for things like HTML escaping, internationalization, or custom formatting.
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

Default parameters let you provide fallback values for function arguments. If someone calls your function without providing a value for a parameter, it will use the default instead. This makes your functions more flexible and reduces the need for checking if parameters are undefined inside your function.
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

You can even use functions as default parameters! This is useful when you want to provide a default behavior that can be overridden. The default function is only created when needed, which can be more efficient than creating it every time the function is called.
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

Modules help you organize your code by splitting it into separate files. Named exports let you export multiple functions from a single file, making your code more modular and reusable. This is perfect for functional programming because you can group related functions together and import only what you need.
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

Default exports are useful when a module has one main function or class that it's primarily about. You can only have one default export per file, but you can have as many named exports as you want. Default exports are imported differently - without curly braces.

Default exports are useful when a module has one main function or class that it's primarily about. You can only have one default export per file, but you can have as many named exports as you want. Default exports are imported differently - without curly braces.
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

Importing is how you bring functions and other things from other files into your current file. Named imports use curly braces to specify exactly what you want, while default imports don't need them. This lets you build your application by combining functions from different modules.
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

Partial application is a technique where you "fix" some of the arguments of a function to create a new, more specialized function. This is really useful when you have a general function but need a specific version of it. Default parameters make this even easier by letting you provide some arguments now and the rest later.
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
