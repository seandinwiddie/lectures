# Redux Toolkit & Functional Programming

This lecture explores how Redux Toolkit (RTK) enhances functional programming patterns in state management.

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

## Functional Benefits of RTK
- **Reduced boilerplate**: Less code to write and maintain
- **Built-in immutability**: Immer handles immutable updates automatically
- **Type safety**: Better TypeScript integration
- **DevTools integration**: Enhanced debugging capabilities

## Resources
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [RTK Query for Data Fetching](https://redux-toolkit.js.org/rtk-query/overview)
