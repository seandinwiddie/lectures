# Functional Composition

This lecture explores advanced function composition techniques in functional programming.

## Composition Fundamentals

### Mathematical Composition
```typescript
// Mathematical composition: f ∘ g (f composed with g)
const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (x: A): C => f(g(x));

const addOne = (x: number): number => x + 1;
const multiplyByTwo = (x: number): number => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition
```typescript
// Pipeline: data flows left to right
const pipe = <A, B, C>(f: (a: A) => B, g: (b: B) => C) => (x: A): C => g(f(x));

const processData = pipe(
  (x: number) => x * 2,
  (x: number) => x + 1,
  (x: number) => x.toString()
);

console.log(processData(5)); // "11"
```

## Advanced Composition Patterns

### Point-Free Style
```typescript
// Point-free: functions without explicit parameters
const map = <A, B>(f: (a: A) => B) => (xs: A[]) => xs.map(f);
const filter = <A>(p: (a: A) => boolean) => (xs: A[]) => xs.filter(p);

const getActiveUserNames = pipe(
  filter((user: any) => user.active),
  map((user: any) => user.name)
);
```

### Composition with Error Handling
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
  (names: string[]) => names.sort()
);

console.log(processUsers(users)); // ["Alice", "Charlie"]
```

## Exercise
Implement a composition utility that can handle functions with different arities and provide proper type safety.

## Resources
- [Function Composition in JavaScript](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0)
- [Point-Free Programming](https://en.wikipedia.org/wiki/Tacit_programming)
