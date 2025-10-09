# Practical Applications of Functional Programming

This lecture explores real-world applications of functional programming principles in modern software development.

> "Functional programming isn't academic theory—it's production-ready engineering. Pure functions, immutability, and composition solve real problems in React, Redux, data pipelines, and API clients every single day." - AI Insight

## Web Development

> "React components are pure functions: props => UI. This purity enables predictable rendering, easy testing, and powerful optimization like React.memo. Functional React is just functional programming applied to the DOM." - AI Insight

### React with Functional Components

React's functional components are perfect for functional programming because they're pure functions that take props and return JSX. Higher-order components (HOCs) are functions that take a component and return a new component with additional functionality. This pattern lets you add features like data fetching without changing the original component, keeping your code modular and testable.
```typescript
import React from 'react';

// Pure functional component
const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

// Higher-order component for data fetching
const withUserData = <P extends object>(
  Component: React.ComponentType<P & { user: User }>
) => {
  return (props: P) => {
    const [user, setUser] = React.useState<User | null>(null);
    
    React.useEffect(() => {
      fetchUser().then(setUser);
    }, []);
    
    return user ? <Component {...props} user={user} /> : <div>Loading...</div>;
  };
};

const UserCardWithData = withUserData(UserCard);
```

### State Management with Redux Toolkit

Redux Toolkit makes state management much simpler while maintaining functional programming principles. The `createSlice` function automatically generates action creators and reducers, reducing boilerplate code. Even though the code looks like it's mutating state, Redux Toolkit uses Immer behind the scenes to ensure immutability, giving you the safety of functional programming with the simplicity of "mutable" syntax.
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null } as TodoState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  }
});

export const { addTodo, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

## Data Processing

### ETL Pipeline

ETL (Extract, Transform, Load) pipelines are perfect for functional programming because they're just a series of data transformations. Each step is a pure function that takes data and returns transformed data. The `pipe` function chains these transformations together, and the `Either` type handles errors gracefully without throwing exceptions. This makes data processing predictable and easy to test.
```typescript
interface RawData {
  id: string;
  name: string;
  value: string;
  timestamp: string;
}

interface ProcessedData {
  id: number;
  name: string;
  value: number;
  date: Date;
}

// Pure functions for data transformation
const validateData = (data: RawData): Either<string, RawData> => {
  if (!data.id || !data.name || !data.value) {
    return Either.left('Missing required fields');
  }
  return Either.right(data);
};

const transformData = (data: RawData): ProcessedData => ({
  id: parseInt(data.id),
  name: data.name.trim(),
  value: parseFloat(data.value),
  date: new Date(data.timestamp)
});

const processData = pipe(
  validateData,
  dataEither => dataEither.map(transformData)
);

// Batch processing
const processBatch = (rawData: RawData[]): ProcessedData[] => {
  return rawData
    .map(processData)
    .filter((result): result is Either<string, ProcessedData> => 
      result.isRight()
    )
    .map(result => result.getOrElse(null!));
};
```

### API Client with Error Handling

API clients benefit greatly from functional programming because they deal with uncertainty - network requests can fail, servers can be down, or data might be malformed. The `Either` type lets you handle these cases explicitly instead of throwing exceptions. Each method returns either a success value or an error message, making error handling predictable and forcing you to consider both cases.
```typescript
class ApiClient {
  private async request<T>(url: string, options?: RequestInit): Promise<Either<string, T>> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return Either.left(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return Either.right(data);
    } catch (error) {
      return Either.left(error.message);
    }
  }

  async getUsers(): Promise<Either<string, User[]>> {
    return this.request<User[]>('/api/users');
  }

  async createUser(user: Omit<User, 'id'>): Promise<Either<string, User>> {
    return this.request<User>('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  }
}
```

## Testing

> "Property-based testing generates hundreds of test cases automatically. Instead of 'add(2, 3) === 5', you prove 'add(a, b) === add(b, a) for all numbers'. Pure functions make this approach natural." - AI Insight

### Property-Based Testing

Property-based testing is perfect for functional programming because it tests the mathematical properties of your functions rather than specific examples. Instead of testing individual cases, you test properties like commutativity (order doesn't matter) or associativity (grouping doesn't matter). This is especially powerful for pure functions because their behavior is predictable and mathematical.
```typescript
import { property, forAll, integer, string } from 'fast-check';

// Testing pure functions with property-based testing
const testAddCommutativity = property(
  forAll(integer(), integer()),
  (a, b) => {
    return add(a, b) === add(b, a);
  }
);

const testAddAssociativity = property(
  forAll(integer(), integer(), integer()),
  (a, b, c) => {
    return add(add(a, b), c) === add(a, add(b, c));
  }
);

const testStringReversal = property(
  forAll(string()),
  (str) => {
    return reverse(reverse(str)) === str;
  }
);
```

### Unit Testing with Pure Functions

Pure functions are incredibly easy to test because they always give the same result for the same inputs and have no side effects. You don't need to set up complex test environments or mock external dependencies. Each test is isolated and predictable, making your test suite fast, reliable, and easy to understand.
```typescript
describe('User validation', () => {
  it('should validate correct user data', () => {
    const user = { name: 'Alice', age: 25, email: 'alice@example.com' };
    const result = validateUser(user);
    expect(result.isRight()).toBe(true);
    expect(result.getOrElse(null)).toEqual(user);
  });

  it('should reject invalid email', () => {
    const user = { name: 'Alice', age: 25, email: 'invalid-email' };
    const result = validateUser(user);
    expect(result.isLeft()).toBe(true);
    expect(result.fold(
      error => error,
      () => 'No error'
    )).toContain('Invalid email');
  });
});
```

## Performance Optimization

### Memoization

Memoization is like remembering the results of expensive calculations. Since pure functions always return the same result for the same inputs, you can safely cache their results. The first time you call the function, it computes the result and stores it. The next time you call it with the same input, it returns the cached result instead of recomputing. This is especially useful for expensive operations like API calls or complex calculations.
```typescript
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

// Memoized expensive calculation
const expensiveCalculation = memoize((n: number): number => {
  // Simulate expensive computation
  return n * n * n;
});

// Usage
console.log(expensiveCalculation(5)); // Computed: 125
console.log(expensiveCalculation(5)); // Cached: 125
```

### Lazy Evaluation

Lazy evaluation means "don't compute until you need it." Instead of computing a value immediately, you create a promise to compute it later. This is useful for expensive operations that might not be needed. The `Lazy` class wraps a computation and only executes it when you actually request the result. This can save significant time and resources in applications with complex, conditional logic.
```typescript
class Lazy<T> {
  private constructor(private thunk: () => T) {}

  static of<T>(value: T): Lazy<T> {
    return new Lazy(() => value);
  }

  static from<T>(thunk: () => T): Lazy<T> {
    return new Lazy(thunk);
  }

  map<U>(fn: (value: T) => U): Lazy<U> {
    return new Lazy(() => fn(this.thunk()));
  }

  get(): T {
    return this.thunk();
  }
}

// Lazy computation
const expensiveOperation = Lazy.from(() => {
  console.log('Computing...');
  return 42;
});

// Only computed when accessed
const result = expensiveOperation.map(x => x * 2);
console.log('Before access');
console.log(result.get()); // "Computing..." then 84
```

## Configuration Management

### Immutable Configuration

Configuration management benefits from functional programming because configurations should be predictable and consistent. The `createConfig` function creates immutable configuration objects with sensible defaults, and you can override specific values without changing the original. This prevents configuration drift and makes it easy to create environment-specific configurations (like development vs production) while maintaining consistency.
```typescript
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
  features: {
    caching: boolean;
    logging: boolean;
  };
}

const createConfig = (overrides: Partial<Config> = {}): Config => ({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  features: {
    caching: true,
    logging: false
  },
  ...overrides
});

// Environment-specific configurations
const devConfig = createConfig({
  apiUrl: 'https://dev-api.example.com',
  features: { caching: false, logging: true }
});

const prodConfig = createConfig({
  timeout: 10000,
  retries: 5
});
```

## Exercise
Build a complete data processing pipeline that reads from a CSV file, validates and transforms the data, and writes to a database, using only pure functions and functional programming principles.

## Resources
- [Functional Programming in JavaScript](https://www.freecodecamp.org/news/functional-programming-in-javascript/)
- [Real World Functional Programming](https://www.manning.com/books/real-world-functional-programming)
