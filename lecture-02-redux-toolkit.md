# Lecture 2: Redux Toolkit & Functional Programming

## Overview
Redux Toolkit (RTK) simplifies Redux while maintaining functional programming principles. It provides utilities that make functional patterns more accessible.

## Functional Programming in RTK

### 1. createSlice - Pure Function Generators
```javascript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // Each reducer is a pure function
    addTodo: (state, action) => {
      state.push(action.payload); // RTK uses Immer for immutability
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  }
});
```

### 2. Functional Action Creators
```javascript
// RTK automatically generates pure action creators
const { addTodo, toggleTodo } = todoSlice.actions;

// These are pure functions
const newTodo = addTodo({ id: 1, text: 'Learn FP', completed: false });
const toggleAction = toggleTodo(1);
```

### 3. createAsyncThunk - Functional Side Effects
```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';

// Pure function that returns a thunk (function returning function)
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}/todos`);
    return response.json();
  }
);
```

## Functional Benefits of RTK

### Immutability Made Easy
```javascript
// RTK uses Immer under the hood
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Looks like mutation, but is immutable
    }
  }
});
```

### Composition with combineReducers
```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    todos: todoSlice.reducer,
    counter: counterSlice.reducer,
    // Composition of pure reducers
  }
});
```

## Functional Patterns in RTK Query

### Pure Data Fetching
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    // Pure function that defines data fetching
    getTodos: builder.query({
      query: (userId) => `users/${userId}/todos`,
      // Transform is a pure function
      transformResponse: (response) => response.data
    })
  })
});
```

## Key Takeaways
- RTK maintains functional programming principles
- Immer provides immutable updates with mutable syntax
- Async operations are handled functionally
- Composition remains a core pattern

## Resources
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

## Exercise
Create a Redux Toolkit slice for a user profile with async thunk for fetching user data. 