---
title: "ES6+ Features for Functional Programming"
description: "This lecture explores how modern TypeScript features enhance functional programming capabilities."
layout: lecture
---

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
const getDefaultLimit = (): number => 20;
/// getDefaultLimit() returns 20

// Multiple statements - use curly braces and explicit return
interface User {
  name: string;
  age: number;
  email?: string;
  posts?: { likes: number }[];
}

const normalizeUser = (user: User): User => {
  const name = user.name.trim();
  return { ...user, name };
};
```

### Lexical `this` Binding

The `this` keyword in JavaScript can be tricky - it changes depending on how a function is called. Arrow functions fix this problem by "remembering" what `this` should be from where they were created. This is especially helpful when you're using functions inside other functions, like with timers or event handlers.

```typescript
// Traditional function - `this` context issues
const traditionalUser = {
  name: 'Alice',
  greet() {
    setTimeout(function(this: void) {
      // @ts-expect-error A traditional callback has no user receiver here.
      console.log(`Hello, ${this.name}!`); // `this` is undefined
    }, 1000);
  }
};

// Arrow function - preserves `this` context
const arrowUser = {
  name: 'Alice',
  greet() {
    setTimeout(() => {
      console.log(`Hello, ${this.name}!`); // `this` refers to arrowUser
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
const doubledTraditionally = numbers.map(function(num: number) {
  return num * 2;
});

// Arrow function
const doubledWithArrow = numbers.map(num => num * 2);

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
interface Profile {
  readonly name: string;
  readonly age: number;
  readonly city: string;
  readonly country?: string;
}

const profile: Profile = { name: 'Alice', age: 25, city: 'NYC' };
const { name: profileName, age: profileAge, city: profileCity } = profile;
console.log(profileName, profileAge, profileCity); // Alice 25 NYC

// Renaming variables - use different variable names for properties
const { name: userName, age: userAge } = profile;
console.log(userName, userAge); // Alice 25

// Default values - provide fallback values for missing properties
const { country = 'USA' } = profile;
console.log(country); // USA

// Nested destructuring - extract properties from nested objects
const userWithAddress = {
  name: 'Alice',
  address: {
    city: 'NYC',
    zip: '10001'
  }
};

const {
  name: addressedName,
  address: { city: addressCity, zip }
} = userWithAddress;
console.log(addressedName, addressCity, zip); // Alice NYC 10001
```

### Function Parameters

Destructuring in function parameters is really powerful - you can extract exactly the properties you need from an object right in the function signature. This makes your functions more flexible and self-documenting. You can also provide default values for optional properties, making your functions easier to use.

```typescript
// Destructuring in function parameters
interface UserWithPosts {
  readonly name: string;
  readonly age: number;
  readonly email?: string;
  readonly posts?: readonly { readonly likes: number }[];
}

const createUser = ({
  name,
  age,
  email = 'not provided'
}: {
  name: string;
  age: number;
  email?: string;
}) => {
  return { name, age, email };
};

const user = createUser({ name: 'Alice', age: 25 });
console.log(user); // { name: 'Alice', age: 25, email: 'not provided' }

// Multiple return values
const getUserStats = (user: UserWithPosts) => {
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
const baseNumbers = [1, 2, 3];
const moreNumbers = [...baseNumbers, 4, 5];
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
const values = [1, 2, 3, 4, 5];
const max = Math.max(...values);
console.log(max); // 5
```

#### Spread is how you update without mutating

This is the single most important use of spread in functional code: an "update"
never changes the original, it produces a *new* value with the change applied.

```typescript
const user = { name: 'Alice', age: 25, roles: ['member'] };

// Wrong — mutates the shared object; other holders see the change.
user.age = 26;
user.roles.push('admin');

// Right — a new object; the original is untouched and still valid.
const olderUser = { ...user, age: 26 };
const promotedUser = { ...user, roles: [...user.roles, 'admin'] };
```

Note the nested spread on `roles`: a top-level `{ ...user }` copies the object
but *shares* the inner array reference, so the array must be spread too. Immutable
updates are shallow by default. This "copy-and-change" move is what lets Redux
compare states by reference, what makes time-travel debugging possible, and what
guarantees a function that receives your object cannot alter it behind your back.
When the nesting gets deep enough that stacked spreads become noisy, that is the
signal to reach for a lens (covered later), not to fall back to mutation.

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

Template literals are a much nicer way to create strings that include variables. Instead of using `+` to concatenate strings and variables, you can use backticks and `${}` to embed expressions directly in your strings. This makes your code much more readable and less error-prone.

```typescript
const name = 'Alice';
const age = 25;

// Traditional concatenation
const concatenatedMessage = 'Hello, ' + name + '. You are ' + age + ' years old.';

// Template literal
const interpolatedMessage = `Hello, ${name}. You are ${age} years old.`;

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
const escapeHtml = (value: unknown): string => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const highlight = (strings: TemplateStringsArray, ...values: unknown[]) => {
  return strings.reduce((result, string, index) => {
    const value = values[index];
    const rendered = value == null ? '' : escapeHtml(value);
    return result + string + (rendered
      ? `<span class="highlight">${rendered}</span>`
      : '');
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
const legacyGreet = (name?: string) => {
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

Defaults run only when an argument is omitted or explicitly `undefined`.
Unlike the older `name || 'Guest'` pattern, they do not replace valid falsy
values such as the empty string, `0`, or `false`.

### Function Defaults

You can also use a function as a default parameter. This is useful when you
want to provide behavior that callers may override. The default expression is
evaluated each time that argument is omitted, so use a named shared function if
allocation or referential identity matters.

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
export const compose = <A, B, C>(
  after: (value: B) => C,
  before: (value: A) => B
) => (value: A): C => after(before(value));

export const pipe2 = <A, B, C>(
  first: (value: A) => B,
  second: (value: B) => C
) => (value: A): C => second(first(value));
```

### Default Exports

Default exports are useful when a module has one main function or class that it's primarily about. You can only have one default export per file, but you can have as many named exports as you want. Default exports are imported differently - without curly braces.

```typescript
// userService.ts - Export a single main function as default
interface UserRecord {
  readonly name: string;
  readonly age: number;
}

const validateUser = (user: UserRecord): UserRecord => {
  if (user.name.trim().length === 0) {
    throw new Error('Name required');
  }
  return user;
};

const transformUser = (user: UserRecord): UserRecord => ({
  ...user,
  name: user.name.trim().toUpperCase()
});

const processUser = (user: UserRecord): UserRecord => {
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
import { compose } from './utils.js'; // Named import
import processUser from './userService.js'; // Default import

// Using imported functions
const result = multiply(add(5, 3), 2);
const formatResult = compose(
  (value: number): string => `Total: ${value}`,
  (value: number): number => value
);
const label = formatResult(result);
const processedUser = processUser({ name: 'alice', age: 25 });
```

## Enhanced Functional Patterns

### Partial Application

Partial application is a technique where you "fix" some of the arguments of a function to create a new, more specialized function. This is really useful when you have a general function but need a specific version of it. Default parameters make this even easier by letting you provide some arguments now and the rest later.

```typescript
// The direct form is often clearest.
const add = (a: number, b: number): number => a + b;
const addFiveDirectly = (b: number): number => add(5, b);

console.log(addFiveDirectly(3)); // 8

// A fixed-arity helper keeps the remaining argument fully typed.
const partialFirst = <A, B, Result>(
  fn: (first: A, second: B) => Result,
  first: A
) => (second: B): Result => fn(first, second);

const addFiveWithHelper = partialFirst(add, 5);
console.log(addFiveWithHelper(3)); // 8
```

Avoid modeling supplied tuple positions with `Partial<T>`. `Partial` means every
position may be absent; it cannot prove which arguments are still required. A
small fixed-arity helper is easier for beginners and preserves the exact input
and output types.

### Currying with Arrow Functions

```typescript
// Manual currying is explicit and easy to read.
const curriedAdd = (a: number) => (b: number): number => a + b;
const addFive = curriedAdd(5);
console.log(addFive(3)); // 8

// A typed helper handles exactly two parameters.
const curry2 = <A, B, Result>(fn: (a: A, b: B) => Result) =>
  (a: A) =>
  (b: B): Result => fn(a, b);

const curriedMultiply = curry2(
  (a: number, b: number): number => a * b
);
const double = curriedMultiply(2);
console.log(double(4)); // 8
```

Do not infer currying behavior from JavaScript's `fn.length`. Default,
rest, and bound parameters change that runtime value, while TypeScript cannot
use it to prove how arguments should be grouped. Prefer explicit curried
functions or fixed-arity helpers such as `curry2` and `curry3`.

## Real-World Examples

### Data Processing Pipeline

```typescript
interface User {
  readonly name: string;
  readonly age: number;
  readonly active: boolean;
}

const users: readonly User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pure functions for data transformation - each does one thing well
const filterActive = (input: readonly User[]): User[] =>
  input.filter(user => user.active);
const mapNames = (input: readonly User[]): string[] =>
  input.map(user => user.name);
const sortNames = (names: readonly string[]): string[] =>
  [...names].sort((left, right) => left.localeCompare(right));

const pipe3 = <A, B, C, D>(
  first: (value: A) => B,
  second: (value: B) => C,
  third: (value: C) => D
) => (value: A): D => third(second(first(value)));

// Compose the pipeline - combine simple functions into complex behavior
const getActiveUserNames = pipe3(filterActive, mapNames, sortNames);
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]
```

`Array.prototype.sort` mutates its receiver. Copying with `[...names]` first
keeps the function pure from the caller's perspective. On an ES2023 target,
`names.toSorted()` expresses the same intent without a mutating method.

### Validation Pipeline

```typescript
const pipe3 = <A, B, C, D>(
  first: (value: A) => B,
  second: (value: B) => C,
  third: (value: C) => D
) => (value: A): D => third(second(first(value)));

// Step 1: Validate email format
const validateEmail = (email: string): string | null =>
  email.includes('@') ? email : null;
// Step 2: Validate email length
const validateLength = (email: string | null): string | null =>
  email !== null && email.length > 5 ? email : null;
// Step 3: Normalize email to lowercase
const normalizeEmail = (email: string | null): string | null =>
  email === null ? null : email.toLowerCase();

// Compose validation steps into a single pipeline
const validateAndNormalize = pipe3(
  validateEmail,
  validateLength,
  normalizeEmail
);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Exercise

Using ES6+/TypeScript features, implement immutable configuration merging and user selection utilities:

1. `mergeConfig(defaults: Config, overrides?: Partial<Config>): Config` using spread and default params.
2. `getActiveUserNames(users: readonly User[]): string[]` that filters `active` users, maps their `name`, and returns them sorted.

### Unit tests

```typescript
interface Config {
  readonly theme: 'dark' | 'light';
  readonly language: string;
  readonly notifications: boolean;
}

interface User {
  readonly name: string;
  readonly age: number;
  readonly email: string;
  readonly active: boolean;
}

const mergeConfig = (
  defaults: Config,
  overrides: Partial<Config> = {}
): Config => ({ ...defaults, ...overrides });

const getActiveUserNames = (users: readonly User[]): string[] => {
  const names = users
    .filter(user => user.active)
    .map(user => user.name);
  return [...names].sort((left, right) => left.localeCompare(right));
};

const defaults: Config = {
  theme: 'dark',
  language: 'en',
  notifications: true
};
const overrides: Partial<Config> = { theme: 'light' };
const merged = mergeConfig(defaults, overrides);

if (
  merged.theme !== 'light' ||
  merged.language !== 'en' ||
  merged.notifications !== true ||
  merged === defaults
) {
  throw new Error('mergeConfig test failed');
}

const users: readonly User[] = [
  { name: 'Alice', age: 25, email: 'a@a.com', active: true },
  { name: 'Bob', age: 30, email: 'b@b.com', active: false },
  { name: 'Charlie', age: 35, email: 'c@c.com', active: true }
];
const activeNames = getActiveUserNames(users);

if (activeNames.join('|') !== 'Alice|Charlie') {
  throw new Error('getActiveUserNames test failed');
}
```

## Resources

- [ES6 Features](https://github.com/lukehoban/es6features)
- [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
