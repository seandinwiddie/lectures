# TypeScript and Functional Programming

This lecture explores how TypeScript enhances functional programming with type safety and better developer experience.

> "TypeScript's type system transforms functional programming from an art into an engineering discipline. Generics, constraints, and type inference ensure that composed functions are correct before they ever run." - AI Insight

## Type Annotations for Functions

### Basic Function Types

TypeScript lets you be very specific about what types your functions accept and return. This is like giving your functions a clear contract - you're telling TypeScript exactly what kind of data goes in and what kind comes out. This helps catch mistakes before your code even runs and makes your functions easier to understand and use.
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

Higher-order functions are functions that work with other functions. TypeScript lets you create special types for these function parameters, making your code more readable and safer. A `Predicate` is a function that tests something and returns true or false, while a `Transformer` is a function that changes one type of data into another.
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

Function composition is when you connect functions together like pipes. TypeScript lets you create types that ensure your composition functions are used correctly. The `compose` function works like math composition (f(g(x))), while `pipe` reads more naturally from left to right. Both do the same thing, but `pipe` is often easier to read.
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

Generics are like templates that work with different types. Instead of writing the same function multiple times for different types, you write it once and it works with whatever type you give it. TypeScript is smart enough to figure out what type you're using and make sure everything matches up correctly.
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

Generic data structures let you create containers that can hold different types of data. The `Maybe` type represents something that might or might not have a value (like a box that could be empty), while the `Either` type represents something that could succeed or fail with an error message. These are really useful for handling situations where things might go wrong.
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

Sometimes you want your generic functions to work with any type, but only if that type has certain properties. Constraints let you say "this generic type must have these specific features." For example, you might want a function that works with anything that has a `length` property, or anything that can be compared with `>`.
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

Conditional types are like smart types that change based on conditions. They let you create types that are different depending on what you give them. For example, you can create a type that extracts the return type from a function, or the element type from an array. TypeScript can figure out these types automatically from your existing code.
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

Mapped types let you transform existing types by changing their properties. You can make all properties optional, make them all required, or make them all read-only. This is really useful when you want to create variations of existing types without writing them all out by hand. Think of it like a factory that can modify types automatically.
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

Utility types are pre-built tools that help you work with types. They let you pick specific properties from a type, remove properties, or extract information from functions. These are like Swiss Army knives for types - they give you common operations you'll need when working with complex type systems.

Utility types are pre-built tools that help you work with types. They let you pick specific properties from a type, remove properties, or extract information from functions. These are like Swiss Army knives for types - they give you common operations you'll need when working with complex type systems.
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

The `Maybe` type is like a smart box that might or might not contain a value. It's really useful for handling situations where something could fail or be missing. Instead of using `null` or `undefined` (which can cause errors), `Maybe` forces you to handle both the success and failure cases explicitly, making your code safer.
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

The `Either` type is like a smart box that can contain either a success value or an error message. It's perfect for operations that might fail, like parsing numbers or making API calls. Instead of throwing errors or returning `null`, `Either` makes you handle both success and error cases explicitly, which makes your code more predictable and easier to debug.

The `Either` type is like a smart box that can contain either a success value or an error message. It's perfect for operations that might fail, like parsing numbers or making API calls. Instead of throwing errors or returning `null`, `Either` makes you handle both success and error cases explicitly, which makes your code more predictable and easier to debug.
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

When you're working with APIs, TypeScript can help ensure that you're using the data correctly. By defining the shape of your API responses, TypeScript can catch mistakes like trying to access properties that don't exist or using the wrong data types. This is especially helpful when the API data structure is complex or when you're working with multiple different API endpoints.
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

Redux is a popular way to manage state in applications, and TypeScript makes it much safer. By defining specific types for your actions and their payloads, TypeScript can ensure that you're creating the right kind of actions and handling them correctly in your reducers. This prevents bugs like typos in action types or accessing the wrong properties from action payloads.
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
