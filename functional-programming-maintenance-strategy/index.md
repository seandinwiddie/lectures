# Functional Programming Maintenance Strategy

This lecture explores strategies for maintaining functional programming codebases effectively.

> "Maintainable code is not accidental—it's architectural. Pure functions with single responsibilities, strict types, comprehensive tests, and clear documentation create systems that scale gracefully and refactor fearlessly." - AI Insight

## Code Organization

### File Structure
```
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
// ❌ Bad: Multiple responsibilities
const processUser = (user: User) => {
  // Validation
  if (!user.name) throw new Error('Name required');
  
  // Transformation
  const processed = { ...user, name: user.name.toUpperCase() };
  
  // Side effect
  saveToDatabase(processed);
  
  return processed;
};

// ✅ Good: Separated concerns
const validateUser = (user: Partial<User>): User => {
  if (!user.name) throw new Error('Name required');
  return user;
};

const transformUser = (user: User): ProcessedUser => ({
  ...user,
  name: user.name.toUpperCase()
});

const processUser = pipe(validateUser, transformUser);
```

## Type Safety

> "Strict TypeScript configuration is preventative medicine: noImplicitAny catches 'any' creep, noUncheckedIndexedAccess prevents array bounds errors, strictNullChecks eliminates null pointer exceptions. Turn on all flags." - AI Insight

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
// Type guards for runtime type checking
const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && 
         obj !== null && 
         typeof obj.name === 'string' &&
         typeof obj.email === 'string';
};

const isAdmin = (user: User): user is AdminUser => {
  return user.role === 'admin';
};

// Usage
const processUser = (data: unknown): User | null => {
  if (isUser(data)) {
    return data;
  }
  return null;
};
```

## Testing Strategy

### Unit Testing Pure Functions
```typescript
describe('User validation', () => {
  it('should validate correct user data', () => {
    const user = { name: 'Alice', email: 'alice@example.com' };
    const result = validateUser(user);
    expect(result).toEqual(user);
  });

  it('should throw error for invalid user', () => {
    const user = { name: '', email: 'alice@example.com' };
    expect(() => validateUser(user)).toThrow('Name required');
  });

  it('should be pure and not mutate input', () => {
    const user = { name: 'Alice', email: 'alice@example.com' };
    const original = { ...user };
    validateUser(user);
    expect(user).toEqual(original);
  });
});
```

### Property-Based Testing
```typescript
import { property, forAll, string, integer } from 'fast-check';

describe('User transformation properties', () => {
  it('should preserve user id during transformation', () => {
    property(
      forAll(integer(), string(), string()),
      (id, name, email) => {
        const user = { id, name, email };
        const transformed = transformUser(user);
        return transformed.id === id;
      }
    );
  });

  it('should always uppercase name', () => {
    property(
      forAll(string()),
      (name) => {
        const user = { id: 1, name, email: 'test@example.com' };
        const transformed = transformUser(user);
        return transformed.name === name.toUpperCase();
      }
    );
  });
});
```

## Documentation

### JSDoc Comments
```typescript
/**
 * Validates a user object and throws an error if validation fails.
 * 
 * @param user - The user object to validate
 * @returns The validated user object if all checks pass
 * @throws {Error} If name is missing, email is missing, or email is invalid
 * 
 * @example
 * ```typescript
 * const user = { name: 'Alice', email: 'alice@example.com' };
 * const validated = validateUser(user);
 * ```
 * 
 * @since 1.0.0
 * @author John Doe
 */
const validateUser = (user: Partial<User>): User => {
  if (!user.name) throw new Error('Name is required');
  if (!user.email) throw new Error('Email is required');
  if (!isValidEmail(user.email)) throw new Error('Invalid email format');
  return user;
};
```

### README Documentation
```markdown
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
```

## Error Handling

### Result Types
```typescript
// Use Result types instead of throwing exceptions
type Result<T, E = string> = 
  | { success: true; data: T }
  | { success: false; error: E };

const validateUser = (user: Partial<User>): Result<User, string> => {
  if (!user.name) {
    return { success: false, error: 'Name is required' };
  }
  if (!user.email) {
    return { success: false, error: 'Email is required' };
  }
  return { success: true, data: user };
};

// Usage
const result = validateUser(userData);
if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}
```

### Error Boundaries
```typescript
// Error boundary for React components
class ErrorBoundary extends React.Component {
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
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

## Performance Monitoring

### Function Performance
```typescript
const withPerformanceMonitoring = <T extends any[], U>(
  fn: (...args: T) => U,
  name: string
) => {
  return (...args: T): U => {
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
const withMemoryMonitoring = <T extends any[], U>(
  fn: (...args: T) => U
) => {
  return (...args: T): U => {
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const result = fn(...args);
    const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
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

- [ ] Functions are pure (no side effects)
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
- [Functional Programming Best Practices](https://www.functionalprogramming.com/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Testing Functional Code](https://www.freecodecamp.org/news/testing-functional-code/)
