---
title: "Functional Programming Maintenance Strategy"
description: "This lecture explores strategies for maintaining functional programming codebases effectively."
layout: lecture
---

# Functional Programming Maintenance Strategy

This lecture explores strategies for maintaining functional programming codebases effectively.

> "Maintainable code is not accidental—it's architectural. Pure functions with single responsibilities, strict types, comprehensive tests, and clear documentation create systems that scale gracefully and refactor fearlessly." - AI Insight

## Code Organization

### File Structure

```text
src/
├── types/
│   ├── index.ts
│   ├── user.ts
│   └── api.ts
├── utils/
│   ├── index.ts
│   ├── validation.ts
│   └── transformation.ts
├── services/
│   ├── index.ts
│   ├── userService.ts
│   └── apiClient.ts
└── components/
    ├── index.ts
    ├── UserCard.tsx
    └── UserList.tsx
```

### Single Responsibility Principle

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type ProcessedUser = User & { processed: true };

declare const saveToDatabase: (user: User) => void;

// ❌ Bad: Multiple responsibilities
const processUserImperatively = (user: User): ProcessedUser => {
  // Validation
  if (!user.name) throw new Error('Name required');

  // Transformation
  const processed: ProcessedUser = {
    ...user,
    name: user.name.toUpperCase(),
    processed: true
  };

  // Side effect
  saveToDatabase(processed);

  return processed;
};

// ✅ Good: Separated concerns
const validateUser = (input: Partial<User>): User => {
  const { id, name, email } = input;

  if (typeof id !== 'number') throw new Error('Id required');
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Name required');
  }
  if (typeof email !== 'string' || email.trim() === '') {
    throw new Error('Email required');
  }

  return { id, name, email };
};

const transformUser = (user: User): ProcessedUser => ({
  ...user,
  name: user.name.toUpperCase(),
  processed: true
});

const pipe2 = <A, B, C>(
  first: (input: A) => B,
  second: (value: B) => C
) => (input: A): C => second(first(input));

const processUser = pipe2(validateUser, transformUser);
```

## Type Safety

> "Strict TypeScript configuration is preventative medicine: `noImplicitAny`
> blocks implicit `any`, `noUncheckedIndexedAccess` exposes possibly absent indexed
> values, and `strictNullChecks` makes nullable paths explicit. These checks reduce
> risk; runtime validation is still required at external boundaries." - AI Insight

### Strict TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Guards

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'member' | 'admin';
}

type AdminUser = User & { role: 'admin' };

const isRecord = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === 'object' && value !== null;

// Narrow unknown to an indexable record before reading properties.
const isUser = (value: unknown): value is User => {
  if (!isRecord(value)) return false;

  return typeof value['id'] === 'number' &&
    typeof value['name'] === 'string' &&
    typeof value['email'] === 'string' &&
    (value['role'] === 'member' || value['role'] === 'admin');
};

const isAdmin = (user: User): user is AdminUser => {
  return user.role === 'admin';
};

const parseUser = (data: unknown): User | null =>
  isUser(data) ? data : null;
```

## Testing Strategy

### Unit Testing Pure Functions

```typescript
describe('User validation', () => {
  it('should validate correct user data', () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const result = validateUser(user);
    expect(result).toEqual(user);
  });

  it('should throw error for invalid user', () => {
    const user = { id: 1, name: '', email: 'alice@example.com' };
    expect(() => validateUser(user)).toThrow('Name required');
  });

  it('should be pure and not mutate input', () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
    const original = { ...user };
    validateUser(user);
    expect(user).toEqual(original);
  });
});
```

### Property-Based Testing

```typescript
import fc from 'fast-check';

describe('User transformation properties', () => {
  it('should preserve user id during transformation', () => {
    fc.assert(
      fc.property(
        fc.integer(), fc.string(), fc.string(),
        (id, name, email) => {
          const user = { id, name, email };
          const transformed = transformUser(user);
          return transformed.id === id;
        }
      )
    );
  });

  it('should always uppercase name', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (name) => {
          const user = { id: 1, name, email: 'test@example.com' };
          const transformed = transformUser(user);
          return transformed.name === name.toUpperCase();
        }
      )
    );
  });
});
```

## Documentation

### JSDoc Comments

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const isValidEmail = (email: string): boolean => email.includes('@');

/**
 * Validates a user object and throws an error if validation fails.
 *
 * @param input - The user object to validate
 * @returns The validated user object if all checks pass
 * @throws {Error} If id, name, or a valid email is missing
 *
 * @example
 * ```typescript
 * const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
 * const validated = validateUser(user);
 * ```
 *
 * @since 1.0.0
 * @author John Doe
 */
const validateUser = (input: Partial<User>): User => {
  const { id, name, email } = input;

  if (typeof id !== 'number') throw new Error('Id is required');
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('Name is required');
  }
  if (typeof email !== 'string' || !isValidEmail(email)) {
    throw new Error('A valid email is required');
  }

  return { id, name, email };
};
```

### README Documentation

````markdown
# User Service

A functional programming approach to user management.

## Usage

```typescript
import { validateUser, transformUser, processUser } from './userService';

// Process a user through the pipeline
const result = processUser(rawUserData);
```

## API Reference

### `validateUser(user: unknown): User`

Validates user data and returns a typed User object.

### `transformUser(user: User): ProcessedUser`

Transforms user data (e.g., uppercases name).

### `processUser(user: unknown): ProcessedUser`

Combines validation and transformation in a single pipeline.

## Examples

See the `examples/` directory for complete usage examples.
````

## Error Handling

### Result Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type ValidationError = {
  field: keyof User;
  message: string;
};

type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

const validateUser = (input: Partial<User>): Result<User, ValidationError> => {
  const { id, name, email } = input;

  if (typeof id !== 'number') {
    return {
      success: false,
      error: { field: 'id', message: 'Id is required' }
    };
  }
  if (typeof name !== 'string' || name.trim() === '') {
    return {
      success: false,
      error: { field: 'name', message: 'Name is required' }
    };
  }
  if (typeof email !== 'string' || email.trim() === '') {
    return {
      success: false,
      error: { field: 'email', message: 'Email is required' }
    };
  }

  // Construct a complete User; a checked Partial<User> is still Partial<User>.
  return { success: true, data: { id, name, email } };
};

const result = validateUser({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.field, result.error.message);
}
```

### Error Boundaries

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback ?? <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## Performance Monitoring

### Function Performance

```typescript
const withPerformanceMonitoring = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  name: string
) => {
  return (...args: TArgs): TResult => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    console.log(`${name} took ${end - start}ms`);
    return result;
  };
};

// Usage
const monitoredValidateUser = withPerformanceMonitoring(validateUser, 'validateUser');
```

### Memory Usage

```typescript
interface HeapMetrics {
  usedJSHeapSize: number;
}

type PerformanceWithHeap = Performance & { memory?: HeapMetrics };

const readUsedHeapSize = (): number =>
  (performance as PerformanceWithHeap).memory?.usedJSHeapSize ?? 0;

const withMemoryMonitoring = <TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult
) => {
  return (...args: TArgs): TResult => {
    const startMemory = readUsedHeapSize();
    const result = fn(...args);
    const endMemory = readUsedHeapSize();

    console.log(`Memory used: ${endMemory - startMemory} bytes`);
    return result;
  };
};
```

## Refactoring Guidelines

### Extract Pure Functions

```typescript
interface Item {
  active: boolean;
  processed?: boolean;
}

// Before: Mixed concerns
const processData = (data: Item[]) => {
  const results = [];
  for (const item of data) {
    if (item.active) {
      const processed = { ...item, processed: true };
      results.push(processed);
    }
  }
  return results;
};

// After: Separated concerns
const isActive = (item: Item): boolean => item.active;
const markProcessed = (item: Item) => ({ ...item, processed: true });

const processData = (data: Item[]) => 
  data.filter(isActive).map(markProcessed);
```

### Use Composition

```typescript
// Before: Nested function calls
const processUser = (user: unknown) => {
  const validated = validateUser(user);
  const transformed = transformUser(validated);
  const enriched = enrichUser(transformed);
  return enriched;
};

// After: Function composition
const processUser = pipe(
  validateUser,
  transformUser,
  enrichUser
);
```

## Code Review Checklist

- [ ] Pure domain functions and reducers are effect-free; effectful functions are isolated at explicit boundaries
- [ ] Functions are small and focused
- [ ] Types are properly defined
- [ ] Error handling is explicit
- [ ] Tests cover edge cases
- [ ] Documentation is complete
- [ ] Performance is acceptable
- [ ] Code follows functional patterns

## Exercise

Refactor a legacy imperative function into a functional pipeline with proper error handling and comprehensive tests.

## Resources

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
