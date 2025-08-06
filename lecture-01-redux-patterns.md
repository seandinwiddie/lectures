# Lecture 1: Redux Standard Patterns & Functional Programming

## Overview
Redux follows functional programming principles at its core. This lecture explores how Redux patterns align with functional programming concepts.

## Key Functional Programming Concepts in Redux

### 1. Pure Functions
Redux reducers must be pure functions:
```javascript
// Pure function - same input always produces same output
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // No side effects, immutable
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};
```

### 2. Immutability
State updates must be immutable:
```javascript
// ❌ Wrong - mutating state
const wrongReducer = (state, action) => {
  state.count += 1; // Mutation!
  return state;
};

// ✅ Correct - immutable update
const correctReducer = (state, action) => {
  return {
    ...state,
    count: state.count + 1
  };
};
```

### 3. Composition
Redux combines multiple reducers functionally:
```javascript
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer
});
```

## Standard Patterns

### Action Creators as Pure Functions
```javascript
// Pure function that creates actions
const addTodo = (text) => ({
  type: 'ADD_TODO',
  payload: { text, completed: false }
});
```

### Selectors as Pure Functions
```javascript
// Pure function for data selection
const selectCompletedTodos = (state) => 
  state.todos.filter(todo => todo.completed);

const selectTodoCount = (state) => 
  state.todos.length;
```

## Functional Benefits
- **Predictability**: Pure functions make testing easier
- **Debugging**: Immutable state enables time-travel debugging
- **Performance**: Immutability enables efficient change detection

## Resources
- [Redux Standard Patterns](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns)

## Exercise
Create a pure reducer function that handles a shopping cart with add/remove/clear actions. 