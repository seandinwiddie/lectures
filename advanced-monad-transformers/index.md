# Advanced Monad Transformers

This lecture explores monad transformers for combining multiple monadic effects.

## What are Monad Transformers?

Monad transformers allow you to stack multiple monadic effects together, providing a way to handle complex scenarios with multiple types of side effects.

### MaybeT Transformer
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
