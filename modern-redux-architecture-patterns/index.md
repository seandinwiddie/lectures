# Modern Redux Architecture Patterns

This lecture explores modern Redux architecture patterns for building scalable applications.

> "Modern Redux architecture is about composition at scale: normalized state for performance, memoized selectors for efficiency, feature-based organization for maintainability. Each pattern solves a real scaling problem." - AI Insight

## Domain-Driven Design

### Feature-Based Organization
```
src/
├── features/
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── userSlice.ts
│   │   └── index.ts
│   ├── products/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── productSlice.ts
│   │   └── index.ts
│   └── orders/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── orderSlice.ts
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── app/
    ├── store/
    ├── providers/
    └── App.tsx
```

### Feature Module Structure
```typescript
// features/users/index.ts
export { default as userReducer } from './userSlice';
export * from './userSlice';
export * from './types';
export * from './hooks';
export * from './components';
export * from './services';
```

## State Normalization

> "Normalized state is the relational model applied to Redux: entities by ID in a flat structure. No nested updates, no duplication, O(1) lookups. GraphQL's cache and Redux both converge on this pattern for performance." - AI Insight

### Normalized State Structure
```typescript
interface NormalizedState<T> {
  entities: Record<string, T>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

interface UserState extends NormalizedState<User> {
  selectedUserId: string | null;
  filters: UserFilters;
}

const initialState: UserState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  selectedUserId: null,
  filters: {}
};
```

### Normalization Utilities
```typescript
// utils/normalization.ts
export const normalizeArray = <T extends { id: string | number }>(
  array: T[]
): { entities: Record<string, T>; ids: string[] } => {
  const entities: Record<string, T> = {};
  const ids: string[] = [];

  array.forEach(item => {
    const id = String(item.id);
    entities[id] = item;
    ids.push(id);
  });

  return { entities, ids };
};

export const denormalizeArray = <T>(
  entities: Record<string, T>,
  ids: string[]
): T[] => {
  return ids.map(id => entities[id]).filter(Boolean);
};

export const updateEntity = <T extends { id: string | number }>(
  entities: Record<string, T>,
  updates: Partial<T> & { id: string | number }
): Record<string, T> => {
  const id = String(updates.id);
  return {
    ...entities,
    [id]: { ...entities[id], ...updates }
  };
};
```

## Advanced Selectors

### Memoized Selectors
```typescript
// features/users/selectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const selectUserState = (state: RootState) => state.users;

export const selectUserEntities = createSelector(
  [selectUserState],
  (userState) => userState.entities
);

export const selectUserIds = createSelector(
  [selectUserState],
  (userState) => userState.ids
);

export const selectAllUsers = createSelector(
  [selectUserEntities, selectUserIds],
  (entities, ids) => denormalizeArray(entities, ids)
);

export const selectUserById = createSelector(
  [selectUserEntities, (state: RootState, userId: string) => userId],
  (entities, userId) => entities[userId]
);

export const selectActiveUsers = createSelector(
  [selectAllUsers],
  (users) => users.filter(user => user.active)
);

export const selectUsersByRole = createSelector(
  [selectAllUsers, (state: RootState, role: string) => role],
  (users, role) => users.filter(user => user.role === role)
);

export const selectUserStats = createSelector(
  [selectAllUsers],
  (users) => ({
    total: users.length,
    active: users.filter(user => user.active).length,
    inactive: users.filter(user => !user.active).length,
    byRole: users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  })
);
```

## Middleware Patterns

### Custom Middleware
```typescript
// middleware/logger.ts
import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

// middleware/analytics.ts
export const analyticsMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  // Track specific actions
  if (action.type.endsWith('/fulfilled')) {
    analytics.track('api_success', {
      action: action.type,
      payload: action.payload
    });
  }
  
  if (action.type.endsWith('/rejected')) {
    analytics.track('api_error', {
      action: action.type,
      error: action.error
    });
  }
  
  return result;
};
```

### Async Middleware
```typescript
// middleware/async.ts
import { Middleware } from '@reduxjs/toolkit';

interface AsyncAction {
  type: string;
  payload: Promise<unknown>;
  meta?: {
    onSuccess?: string;
    onError?: string;
  };
}

export const asyncMiddleware: Middleware = store => next => action => {
  if (action.payload instanceof Promise) {
    const asyncAction = action as AsyncAction;
    
    // Dispatch pending action
    store.dispatch({ type: `${asyncAction.type}/pending` });
    
    return asyncAction.payload
      .then(result => {
        store.dispatch({ 
          type: `${asyncAction.type}/fulfilled`, 
          payload: result 
        });
        if (asyncAction.meta?.onSuccess) {
          store.dispatch({ type: asyncAction.meta.onSuccess, payload: result });
        }
        return result;
      })
      .catch(error => {
        store.dispatch({ 
          type: `${asyncAction.type}/rejected`, 
          error: error.message 
        });
        if (asyncAction.meta?.onError) {
          store.dispatch({ type: asyncAction.meta.onError, error: error.message });
        }
        throw error;
      });
  }
  
  return next(action);
};
```

## State Persistence

### Persist Configuration
```typescript
// app/store/persistConfig.ts
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const userPersistConfig = {
  key: 'users',
  storage,
  whitelist: ['entities', 'ids'], // Only persist these fields
  blacklist: ['loading', 'error'] // Don't persist these fields
};

const productPersistConfig = {
  key: 'products',
  storage,
  whitelist: ['entities', 'ids']
};

export const persistConfigs = {
  userPersistConfig,
  productPersistConfig
};
```

### Store Configuration with Persistence
```typescript
// app/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from '../../features/users/userSlice';
import productReducer from '../../features/products/productSlice';
import { persistConfigs } from './persistConfig';

const persistedUserReducer = persistReducer(
  persistConfigs.userPersistConfig,
  userReducer
);

const persistedProductReducer = persistReducer(
  persistConfigs.productPersistConfig,
  productReducer
);

export const store = configureStore({
  reducer: {
    users: persistedUserReducer,
    products: persistedProductReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Error Boundaries

### Redux Error Boundary
```typescript
// components/ReduxErrorBoundary.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { clearErrors } from '../features/errors/errorSlice';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export const ReduxErrorBoundary: React.FC<Props> = ({ 
  children, 
  fallback: Fallback 
}) => {
  const [error, setError] = React.useState<Error | null>(null);
  const dispatch = useDispatch();

  const resetError = () => {
    setError(null);
    dispatch(clearErrors());
  };

  if (error) {
    if (Fallback) {
      return <Fallback error={error} resetError={resetError} />;
    }
    return (
      <div>
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      {children}
    </React.Suspense>
  );
};
```

## Performance Optimization

### Selective Re-rendering
```typescript
// hooks/useSelector.ts
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../app/store';

export const useAppSelector = <T>(
  selector: (state: RootState) => T,
  equalityFn?: (left: T, right: T) => boolean
) => {
  return useSelector(selector, equalityFn || shallowEqual);
};

// Usage
const UserComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const user = useAppSelector(
    state => state.users.entities[userId],
    (left, right) => left?.id === right?.id && left?.name === right?.name
  );

  return <div>{user?.name}</div>;
};
```

### Lazy Loading
```typescript
// features/users/lazySelectors.ts
import { createSelector } from '@reduxjs/toolkit';

export const createLazySelector = <State, T, R>(
  selector: (state: State) => T,
  transform: (data: T) => R
) => {
  let memoizedTransform: R | null = null;
  
  return createSelector(
    [selector],
    (data) => {
      if (!memoizedTransform) {
        memoizedTransform = transform(data);
      }
      return memoizedTransform;
    }
  );
};
```

## Testing Patterns

### Store Testing
```typescript
// tests/store.test.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/userSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      users: userReducer
    },
    preloadedState
  });
};

describe('Store', () => {
  it('should handle user actions', () => {
    const store = createTestStore();
    
    const user = { id: '1', name: 'Alice', email: 'alice@example.com' };
    store.dispatch(addUser(user));
    
    const state = store.getState();
    expect(state.users.entities['1']).toEqual(user);
    expect(state.users.ids).toContain('1');
  });
});
```

### Selector Testing
```typescript
// tests/selectors.test.ts
import { selectAllUsers, selectActiveUsers } from '../features/users/selectors';

describe('User Selectors', () => {
  const mockState = {
    users: {
      entities: {
        '1': { id: '1', name: 'Alice', active: true },
        '2': { id: '2', name: 'Bob', active: false }
      },
      ids: ['1', '2']
    }
  };

  it('should select all users', () => {
    const result = selectAllUsers(mockState);
    expect(result).toHaveLength(2);
  });

  it('should select only active users', () => {
    const result = selectActiveUsers(mockState);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Alice');
  });
});
```

## Exercise
Build a complete e-commerce application using modern Redux architecture patterns with feature-based organization, normalized state, and proper error handling.

## Resources
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide)
- [Normalizing State Shape](https://redux.js.org/usage/structuring-reducers/normalizing-state-shape)
