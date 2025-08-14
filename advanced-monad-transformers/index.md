# Advanced Monad Transformers

This lecture explores monad transformers for combining multiple monadic effects.

## What are Monad Transformers?

Monad transformers are like stacking boxes inside other boxes - they let you combine different types of monadic effects together. For example, you might want to handle both async operations (like API calls) and optional values (like Maybe) at the same time. Transformers give you a way to work with multiple effects in a clean, predictable way.

### MaybeT Transformer

The MaybeT transformer combines the Maybe monad (for optional values) with another monad. It's like putting a Maybe box inside another type of box. This is useful when you have operations that are both async (like API calls) and might fail (returning nothing). The transformer handles both effects together, so you don't have to nest them manually.
```typescript
class MaybeT<M, T> {
  constructor(private runMaybeT: M) {}

  static lift<M, T>(m: M): MaybeT<M, T> {
    return new MaybeT(m);
  }

  map<U>(fn: (value: T) => U): MaybeT<M, U> {
    // Implementation depends on the underlying monad M
    return new MaybeT(this.runMaybeT);
  }

  bind<U>(fn: (value: T) => MaybeT<M, U>): MaybeT<M, U> {
    // Implementation depends on the underlying monad M
    return new MaybeT(this.runMaybeT);
  }
}
```

### EitherT Transformer

The EitherT transformer combines the Either monad (for success/error handling) with another monad. It's like putting an Either box inside another type of box. This is perfect for async operations that might fail with specific error messages. Instead of handling async errors and Either errors separately, the transformer handles both together in a unified way.
```typescript
class EitherT<M, L, R> {
  constructor(private runEitherT: M) {}

  static lift<M, L, R>(m: M): EitherT<M, L, R> {
    return new EitherT(m);
  }

  map<U>(fn: (value: R) => U): EitherT<M, L, U> {
    // Implementation depends on the underlying monad M
    return new EitherT(this.runEitherT);
  }

  bind<U>(fn: (value: R) => EitherT<M, L, U>): EitherT<M, L, U> {
    // Implementation depends on the underlying monad M
    return new EitherT(this.runEitherT);
  }
}
```

## Combining Effects

### Async + Maybe

This example shows how to combine async operations with optional values. The `fetchUser` function makes an API call that might fail (returning nothing), and the `processUser` function safely extracts the user's name if the user exists. This pattern is common when working with APIs where data might not exist or the request might fail.
```typescript
// Combining async operations with optional values
const fetchUser = async (id: number): Promise<Maybe<User>> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      const user = await response.json();
      return Maybe.just(user);
    } else {
      return Maybe.nothing();
    }
  } catch {
    return Maybe.nothing();
  }
};

const processUser = async (id: number): Promise<Maybe<string>> => {
  const userMaybe = await fetchUser(id);
  return userMaybe.map(user => user.name);
};
```

### Async + Either

This example shows how to combine async operations with error handling. The `fetchUser` function makes an API call and returns either a user or a specific error message, and the `processUser` function safely extracts the user's name if the operation succeeds. This gives you detailed error information instead of just knowing that something failed.
```typescript
// Combining async operations with error handling
const fetchUser = async (id: number): Promise<Either<string, User>> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      const user = await response.json();
      return Either.right(user);
    } else {
      return Either.left(`HTTP ${response.status}`);
    }
  } catch (error) {
    return Either.left(error.message);
  }
};

const processUser = async (id: number): Promise<Either<string, string>> => {
  const userEither = await fetchUser(id);
  return userEither.map(user => user.name);
};
```

## Real-World Applications

### Database Operations with Error Handling

This example shows how monad transformers work in real applications with database operations. Each function (`findUser`, `updateUser`) handles both async operations and potential errors, returning detailed error information when things go wrong. The `processUserUpdate` function chains these operations together safely, handling errors at each step and providing meaningful error messages for debugging.
```typescript
interface DatabaseError {
  code: string;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const findUser = async (id: number): Promise<Either<DatabaseError, User>> => {
  try {
    const user = await db.users.findById(id);
    if (user) {
      return Either.right(user);
    } else {
      return Either.left({ code: 'NOT_FOUND', message: 'User not found' });
    }
  } catch (error) {
    return Either.left({ code: 'DATABASE_ERROR', message: error.message });
  }
};

const updateUser = async (id: number, updates: Partial<User>): Promise<Either<DatabaseError, User>> => {
  try {
    const user = await db.users.update(id, updates);
    return Either.right(user);
  } catch (error) {
    return Either.left({ code: 'UPDATE_ERROR', message: error.message });
  }
};

const processUserUpdate = async (id: number, updates: Partial<User>): Promise<Either<DatabaseError, string>> => {
  const userEither = await findUser(id);
  return userEither.bind(async user => {
    const updatedUser = await updateUser(id, updates);
    return updatedUser.map(u => `Updated user: ${u.name}`);
  });
};
```

## Exercise
Implement a ReaderT transformer that can handle dependency injection with other monadic effects.

## Resources
- [Monad Transformers](https://en.wikibooks.org/wiki/Haskell/Monad_transformers)
- [Functional Programming with Effects](https://www.functionalprogramming.com/)
