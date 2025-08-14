# Redux Toolkit & RTK Query Best Practices

This lecture explores best practices for using Redux Toolkit and RTK Query in functional programming applications.

## Redux Toolkit Best Practices

### Slice Organization
```typescript
// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

interface UserState {
  items: User[];
  loading: boolean;
  error: string | null;
  selectedUserId: number | null;
}

const initialState: UserState = {
  items: [],
  loading: false,
  error: null,
  selectedUserId: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.items.push(action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<User> & { id: number }>) => {
      const index = state.items.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(user => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedUser: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    }
  }
});

export const {
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setLoading,
  setError,
  setSelectedUser
} = userSlice.actions;

export default userSlice.reducer;
```

### Selectors
```typescript
// userSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selectors
const selectUserState = (state: RootState) => state.users;
const selectUsers = (state: RootState) => state.users.items;
const selectSelectedUserId = (state: RootState) => state.users.selectedUserId;

// Derived selectors
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter(user => user.active)
);

export const selectUserById = createSelector(
  [selectUsers, (state: RootState, userId: number) => userId],
  (users, userId) => users.find(user => user.id === userId)
);

export const selectSelectedUser = createSelector(
  [selectUsers, selectSelectedUserId],
  (users, selectedId) => selectedId ? users.find(user => user.id === selectedId) : null
);

export const selectUserCount = createSelector(
  [selectUsers],
  (users) => users.length
);

export const selectUserStats = createSelector(
  [selectUsers],
  (users) => ({
    total: users.length,
    active: users.filter(user => user.active).length,
    inactive: users.filter(user => !user.active).length
  })
);
```

### Async Actions with createAsyncThunk
```typescript
// userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading, setError, setUsers } from './userSlice';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      dispatch(setUsers(users));
      return users;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { dispatch }) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newUser = await response.json();
      dispatch(addUser(newUser));
      return newUser;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  }
);
```

## RTK Query Best Practices

### API Definition
```typescript
// api/usersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' }
            ]
          : [{ type: 'User', id: 'LIST' }]
    }),
    
    getUserById: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }]
    }),
    
    createUser: builder.mutation<User, Omit<User, 'id'>>({
      query: (user) => ({
        url: 'users',
        method: 'POST',
        body: user
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }]
    }),
    
    updateUser: builder.mutation<User, Partial<User> & { id: number }>({
      query: ({ id, ...patch }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ]
    }),
    
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ]
    })
  })
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApi;
```

### Custom Hooks
```typescript
// hooks/useUsers.ts
import { useGetUsersQuery, useCreateUserMutation } from '../api/usersApi';

export const useUsers = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const activeUsers = users?.filter(user => user.active) ?? [];
  const inactiveUsers = users?.filter(user => !user.active) ?? [];

  return {
    users: users ?? [],
    activeUsers,
    inactiveUsers,
    isLoading,
    error,
    refetch,
    createUser: async (userData: Omit<User, 'id'>) => {
      try {
        await createUser(userData).unwrap();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    isCreating
  };
};
```

### Error Handling
```typescript
// utils/errorHandling.ts
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    if (error.status === 'FETCH_ERROR') {
      return 'Network error. Please check your connection.';
    }
    if (error.status === 'PARSING_ERROR') {
      return 'Invalid response from server.';
    }
    if (typeof error.status === 'number') {
      switch (error.status) {
        case 400: return 'Bad request. Please check your input.';
        case 401: return 'Unauthorized. Please log in again.';
        case 403: return 'Forbidden. You don\'t have permission.';
        case 404: return 'Resource not found.';
        case 500: return 'Server error. Please try again later.';
        default: return `Server error (${error.status}).`;
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred.';
};
```

### Component Usage
```typescript
// components/UserList.tsx
import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { getErrorMessage } from '../utils/errorHandling';

export const UserList: React.FC = () => {
  const { users, isLoading, error, refetch } = useUsers();

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {getErrorMessage(error)}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Users ({users.length})</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email}) - {user.active ? 'Active' : 'Inactive'}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Store Configuration
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import { usersApi } from '../api/usersApi';

export const store = configureStore({
  reducer: {
    users: userReducer,
    [usersApi.reducerPath]: usersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Testing
```typescript
// tests/userSlice.test.ts
import userReducer, { addUser, updateUser, removeUser } from '../userSlice';

describe('userSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
    selectedUserId: null
  };

  it('should handle initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addUser', () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com', active: true };
    const actual = userReducer(initialState, addUser(user));
    expect(actual.items).toEqual([user]);
  });

  it('should handle updateUser', () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com', active: true };
    const state = { ...initialState, items: [user] };
    const updatedUser = { id: 1, name: 'Alice Updated' };
    const actual = userReducer(state, updateUser(updatedUser));
    expect(actual.items[0].name).toBe('Alice Updated');
  });

  it('should handle removeUser', () => {
    const user = { id: 1, name: 'Alice', email: 'alice@example.com', active: true };
    const state = { ...initialState, items: [user] };
    const actual = userReducer(state, removeUser(1));
    expect(actual.items).toEqual([]);
  });
});
```

## Exercise
Create a complete user management system using Redux Toolkit and RTK Query with proper error handling, loading states, and optimistic updates.

## Resources
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Redux Best Practices](https://redux.js.org/style-guide/)
