# Redux Standard Patterns & Functional Programming

Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts. While this covers traditional Redux patterns, **Redux Toolkit (RTK) and RTK Query are the modern, official approach** that supersedes these patterns in production applications.

**Important Note:** This lecture provides foundational understanding, but **RTK and RTK Query take absolute priority** in modern applications. They eliminate the need for most hand-written data fetching logic and provide better developer experience while maintaining functional programming principles.

## Key Functional Programming Concepts in Redux

### 1. Pure Functions
Redux reducers must be pure functions:
```typescript
// Pure function - same input always produces same output, no side effects
const counterReducer = (state = 0, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // No side effects, immutable update
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
```

### 2. Immutability
State updates must be immutable:
```typescript
// ❌ Wrong - mutating state breaks Redux principles
const wrongReducer = (state: any, action: any) => {
  state.count += 1; // Mutation! This will cause bugs
  return state;
};

// ✅ Correct - immutable update creates new state object
const correctReducer = (state: any, action: any) => {
  return {
    ...state,
    count: state.count + 1 // Create new object with updated count
  };
};
```

### 3. Composition
Redux combines multiple reducers functionally:
```typescript
// Compose multiple domain-specific reducers into a single root reducer
const rootReducer = combineReducers({
  users: usersReducer,    // Handles user-related state
  posts: postsReducer,    // Handles post-related state
  comments: commentsReducer // Handles comment-related state
});
```

## Standard Patterns

### Action Creators as Pure Functions
```typescript
// Pure function that creates actions - same input always produces same action
const addTodo = (text: string) => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});
```

### Selectors as Pure Functions
```typescript
// Pure function for data selection - extracts specific data from state
const selectCompletedTodos = (state: any) => 
  state.todos.filter((todo: any) => todo.completed);

const selectTodoCount = (state: any) => 
  state.todos.length;
```

## Functional Benefits
- **Predictability**: Pure functions make testing easier
- **Debugging**: Immutable state enables time-travel debugging
- **Performance**: Immutability enables efficient change detection

## Resources
- [Redux Standard Patterns]
