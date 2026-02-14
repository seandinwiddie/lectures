# Redux Toolkit & Functional Programming

This lecture explores how Redux Toolkit (RTK) enhances functional programming patterns in state management.

> "Redux Toolkit proves that functional programming doesn't require verbose boilerplate. With Immer's structural sharing, you get immutability with a mutable-looking syntax—the best of both worlds." - AI Insight

## RTK's Functional Programming Approach

### Immutable Updates with Immer

Redux Toolkit uses a library called Immer that makes immutable updates much easier. Instead of manually creating new objects with the spread operator, you can write code that looks like it's changing the state directly, but Immer automatically creates new copies behind the scenes. This gives you the safety of immutability with the simplicity of "mutable" syntax.
```typescript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false },
  reducers: {
    addTodo: (state, action) => {
      // Immer allows "mutative" syntax while preserving immutability
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  }
});
```

### Pure Action Creators

Redux Toolkit automatically creates action creators for you based on your reducer functions. These action creators are pure functions that take parameters and return action objects. You don't have to write them by hand anymore - RTK generates them automatically, which reduces boilerplate code and makes your codebase cleaner and more maintainable.
```typescript
// RTK automatically generates pure action creators
const { addTodo, toggleTodo } = todoSlice.actions;

// These are pure functions that create actions
const newTodo = addTodo({ id: 1, text: 'Learn RTK', completed: false });
```

### Async Actions with createAsyncThunk

Redux Toolkit simplifies async operations with `createAsyncThunk`. It automatically generates action types for pending, fulfilled, and rejected states, allowing you to handle side effects (like API calls) while keeping your reducers pure.

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Define the async thunk
export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId: number) => {
    const response = await fetch(\`/api/users/\${userId}\`);
    return response.json();
  }
);

// Handle the thunk in extraReducers
const userSlice = createSlice({
  name: 'users',
  initialState: { entities: [], loading: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = 'idle';
        state.entities.push(action.payload);
      });
  },
});
```

### Type-Safe Payloads

Redux Toolkit provides built-in type safety for action payloads. By defining the payload type in `PayloadAction`, you ensure that your reducers only receive valid data, preventing runtime errors and improving developer experience with autocomplete.

```typescript
import { PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: [] as Todo[],
  reducers: {
    // Type-safe payload
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.push(action.payload);
    },
    // Payload is inferred as number
    removeTodo: (state, action: PayloadAction<number>) => {
      return state.filter(todo => todo.id !== action.payload);
    }
  }
});
```

### Testing Redux Logic

Testing Redux Toolkit logic is straightforward because reducers are pure functions. You can test them by calling the reducer with a state and an action, and asserting the result.

```typescript
import todoReducer, { addTodo } from './todoSlice';

describe('todo reducer', () => {
  it('should handle initial state', () => {
    expect(todoReducer(undefined, { type: 'unknown' })).toEqual([]);
  });

  it('should handle addTodo', () => {
    const previousState = [];
    const action = addTodo({ id: 1, text: 'Run tests', completed: false });
    const nextState = todoReducer(previousState, action);
    
    expect(nextState).toEqual([
      { id: 1, text: 'Run tests', completed: false }
    ]);
  });
});


## Functional Benefits of RTK
- Write less code while maintaining better functionality
- Let Immer handle immutable updates automatically behind the scenes
- Enjoy better TypeScript integration and type safety
- Get enhanced debugging capabilities built right in

## Resources
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query for Data Fetching](https://redux-toolkit.js.org/rtk-query/overview)
