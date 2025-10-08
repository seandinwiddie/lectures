# Redux Standard Patterns & Functional Programming

Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts. While this covers traditional Redux patterns, Redux Toolkit (RTK) and RTK Query are the modern, official approach that supersedes these patterns in production applications.

> "Redux is functional programming applied to state management: pure reducers, immutable state, and unidirectional data flow create a predictable system where every state change is traceable and testable." - AI Insight

**Important Note:** This lecture provides foundational understanding, but RTK and RTK Query take absolute priority in modern applications. They eliminate the need for most hand-written data fetching logic and provide better developer experience while maintaining functional programming principles.

## Key Functional Programming Concepts in Redux

### 1. Pure Functions

Redux reducers must be pure functions - they always give you the same result for the same inputs and never change anything else in your program. Think of them as reliable machines that take the current state and an action, then give you back a new state. They never modify the original state, only create a new one.
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

In Redux, you never change the existing state - you always create a new copy with your changes. This is called immutability. The wrong example shows what happens when you try to modify state directly (it causes bugs!), while the correct example shows how to create a new state object with the spread operator. This makes your app predictable and easier to debug.
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

Redux uses composition to build complex state management from simple parts. Instead of having one huge reducer that handles everything, you break your state into smaller, focused reducers (like one for users, one for posts, one for comments). Then you combine them into a single root reducer. This makes your code easier to understand and maintain.
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

Action creators are functions that create action objects. They should be pure functions too - given the same inputs, they always produce the same action. This makes your actions predictable and easy to test. Think of them as factories that create standardized messages that describe what happened in your app.
```typescript
// Pure function that creates actions - same input always produces same action
const addTodo = (text: string) => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});
```

### Selectors as Pure Functions

Selectors are functions that extract specific pieces of data from your Redux state. They should be pure functions that take the state and return the data you need. This keeps your components clean by moving the data selection logic out of the UI. Selectors are also great for computing derived data, like counting items or filtering lists.
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
