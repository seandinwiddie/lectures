# Functional Composition

This lecture explores advanced function composition techniques in functional programming.

> "Function composition is the essence of programming: combining simple, focused functions into complex behaviors. Like LEGO blocks, well-composed functions are greater than the sum of their parts." - AI Insight

## Composition Fundamentals

### Mathematical Composition

Function composition is like connecting pipes - you take the output of one function and feed it into another function. The `compose` function does this automatically. Think of it like a math problem: if you have f(x) and g(x), composition gives you f(g(x)). The functions are applied from right to left, so in the example, we add one first, then multiply by two.
```typescript
// Mathematical composition: f ∘ g (f composed with g)
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x));

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition

Pipeline composition does the same thing as mathematical composition, but it reads more naturally from left to right, like reading English. Instead of right-to-left like `compose`, `pipe` applies functions in the order you write them. This makes complex data processing easier to read and understand, especially when you have many steps in your pipeline.
```typescript
// Pipeline: data flows left to right
const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T) => 
  fns.reduce((acc, fn) => fn(acc), value);

const processData = pipe(
  (x: number) => x * 2,
  (x: number) => x + 1
);

console.log(processData(5)); // 11
```

## Advanced Composition Patterns

### Point-Free Style

> "Point-free style reveals the essence: processUsers = pipe(filterActive, extractNames, sort). No intermediate variables, no explicit parameters—just pure transformation pipelines that read like prose." - AI Insight

Point-free style means writing functions without explicitly mentioning their parameters. Instead of writing `(users) => users.filter(...)`, you can write just `filter(...)`. This makes your code more concise and focuses on what the functions do rather than what they're called. It's like writing poetry - you focus on the meaning, not the mechanics.
```typescript
// Point-free: functions without explicit parameters
const map = <A, B>(f: (a: A) => B) => (xs: A[]) => xs.map(f);
const filter = <A>(p: (a: A) => boolean) => (xs: A[]) => xs.filter(p);

interface User {
  name: string;
  active: boolean;
}

const getActiveUserNames = pipe(
  filter((user: User) => user.active),
  map((user: User) => user.name)
);
```

### Composition with Error Handling

When you're composing functions, sometimes one of them might fail or return null. Safe composition handles these cases gracefully by checking if the intermediate result is valid before passing it to the next function. This prevents your pipeline from crashing when something goes wrong, making your code more robust and reliable.
```typescript
// Safe composition with error handling
const safeCompose = <A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B | null
) => (x: A): C | null => {
  const result = g(x);
  return result !== null ? f(result) : null;
};
```

## Real-World Applications

### Data Processing Pipeline

This example shows how function composition works in real applications. We start with a list of users, filter out the inactive ones, extract just their names, and then sort them alphabetically. Each step is a simple function, but when we compose them together, we get a powerful data processing pipeline. This is a common pattern in functional programming for transforming data step by step.
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

const processUsers = pipe(
  (users: User[]) => users.filter(user => user.active),
  (users: User[]) => users.map(user => user.name),
  (names: string[]) => [...names].sort()
);

console.log(processUsers(users)); // ["Alice", "Charlie"]
```

## Exercise
Implement a composition utility that can handle functions with different arities and provide proper type safety.

## Resources
- [Function Composition in JavaScript](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0)
- [Point-Free Programming](https://en.wikipedia.org/wiki/Tacit_programming)
