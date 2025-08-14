# Practical Applications of Functional Programming

This lecture explores real-world applications of functional programming principles in modern software development.

## Web Development

### React with Functional Components
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

### Property-Based Testing
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
