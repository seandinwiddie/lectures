# Lecture 6: Practical Applications of Functional Programming

## Overview
This lecture combines all the functional programming concepts we've learned into practical, real-world applications. We'll see how Redux, composition, monads, and reactive programming work together.

## Building a Functional Todo Application

### 1. State Management with Redux Toolkit
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Pure action creators
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  }
});

// Async thunk for side effects
const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId) => {
    const response = await fetch(`/api/users/${userId}/todos`);
    return response.json();
  }
);
```

### 2. Functional Composition for Data Processing
```javascript
// Pure functions for data transformation
const filterByStatus = (status) => (todos) => 
  todos.filter(todo => todo.completed === status);

const sortByDate = (todos) => 
  todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const mapToDisplay = (todos) => 
  todos.map(todo => ({
    ...todo,
    displayText: todo.completed ? `✓ ${todo.text}` : todo.text
  }));

// Compose the pipeline
const processTodos = pipe(
  filterByStatus(false),
  sortByDate,
  mapToDisplay
);
```

### 3. Monads for Error Handling
```javascript
// Either monad for API calls
class ApiResult {
  constructor(value, isError = false) {
    this.value = value;
    this.isError = isError;
  }

  static success(value) {
    return new ApiResult(value, false);
  }

  static error(message) {
    return new ApiResult(message, true);
  }

  bind(fn) {
    return this.isError ? this : fn(this.value);
  }

  map(fn) {
    return this.bind(value => ApiResult.success(fn(value)));
  }
}

// Safe API wrapper
const safeApiCall = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return ApiResult.success(data);
  } catch (error) {
    return ApiResult.error(error.message);
  }
};

// Usage with composition
const fetchUserTodos = pipe(
  (userId) => `/api/users/${userId}/todos`,
  safeApiCall,
  result => result.map(processTodos)
);
```

### 4. Reactive Components with Streams
```javascript
import { fromEvent, combineLatest, merge } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators';

function TodoComponent(sources) {
  // Intent: User actions
  const addTodo$ = sources.DOM.select('.add-todo').events('click');
  const inputChange$ = sources.DOM.select('.todo-input').events('input');
  const toggleTodo$ = sources.DOM.select('.todo-item').events('click');

  // Model: State management
  const newTodoText$ = inputChange$.pipe(
    map(event => event.target.value),
    debounceTime(300)
  );

  const todos$ = merge(
    addTodo$.pipe(
      withLatestFrom(newTodoText$),
      map(([_, text]) => ({ type: 'ADD_TODO', payload: { text } }))
    ),
    toggleTodo$.pipe(
      map(event => ({ type: 'TOGGLE_TODO', payload: event.target.dataset.id }))
    )
  ).pipe(
    scan((todos, action) => {
      switch (action.type) {
        case 'ADD_TODO':
          return [...todos, { 
            id: Date.now(), 
            text: action.payload.text, 
            completed: false 
          }];
        case 'TOGGLE_TODO':
          return todos.map(todo => 
            todo.id === parseInt(action.payload) 
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        default:
          return todos;
      }
    }, [])
  );

  // View: Render UI
  const vdom$ = todos$.pipe(
    map(todos => 
      h('div.todo-app', [
        h('input.todo-input', { placeholder: 'Add todo...' }),
        h('button.add-todo', 'Add'),
        h('ul.todo-list', todos.map(todo => 
          h('li.todo-item', { 
            key: todo.id,
            'data-id': todo.id,
            className: todo.completed ? 'completed' : ''
          }, todo.text)
        ))
      ])
    )
  );

  return { DOM: vdom$ };
}
```

## Advanced Patterns

### 1. Functional State Machines
```javascript
// Pure function for state transitions
const createStateMachine = (initialState, transitions) => {
  return (state = initialState, action) => {
    const transition = transitions[action.type];
    return transition ? transition(state, action) : state;
  };
};

// Todo state machine
const todoTransitions = {
  ADD_TODO: (state, action) => ({
    ...state,
    todos: [...state.todos, action.payload]
  }),
  TOGGLE_TODO: (state, action) => ({
    ...state,
    todos: state.todos.map(todo => 
      todo.id === action.payload 
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  }),
  DELETE_TODO: (state, action) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== action.payload)
  })
};

const todoReducer = createStateMachine(
  { todos: [], filter: 'all' },
  todoTransitions
);
```

### 2. Functional Testing
```javascript
// Pure function testing
const testProcessTodos = () => {
  const input = [
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01' },
    { id: 2, text: 'Task 2', completed: true, createdAt: '2023-01-02' },
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03' }
  ];

  const expected = [
    { id: 3, text: 'Task 3', completed: false, createdAt: '2023-01-03', displayText: 'Task 3' },
    { id: 1, text: 'Task 1', completed: false, createdAt: '2023-01-01', displayText: 'Task 1' }
  ];

  const result = processTodos(input);
  
  return JSON.stringify(result) === JSON.stringify(expected);
};

console.log('Test passed:', testProcessTodos());
```

### 3. Functional Error Boundaries
```javascript
// Maybe monad for component rendering
const safeRender = (component, props) => {
  try {
    return Maybe.just(component(props));
  } catch (error) {
    console.error('Render error:', error);
    return Maybe.nothing();
  }
};

// Usage
const renderTodoList = (todos) => {
  if (!Array.isArray(todos)) {
    throw new Error('Todos must be an array');
  }
  
  return h('ul', todos.map(todo => 
    h('li', { key: todo.id }, todo.text)
  ));
};

const safeTodoList = safeRender(renderTodoList, todos);
safeTodoList.map(vdom => render(vdom)).getOrElse(() => 
  h('div.error', 'Failed to render todos')
);
```

## Performance Optimization

### 1. Memoization
```javascript
// Pure function memoization
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveCalculation = memoize((numbers) => {
  return numbers.reduce((sum, num) => sum + num, 0);
});
```

### 2. Lazy Evaluation
```javascript
// Lazy stream processing
const createLazyStream = (generator) => {
  return {
    map: (fn) => createLazyStream(function* () {
      for (const item of generator()) {
        yield fn(item);
      }
    }),
    filter: (predicate) => createLazyStream(function* () {
      for (const item of generator()) {
        if (predicate(item)) yield item;
      }
    }),
    take: (count) => createLazyStream(function* () {
      let taken = 0;
      for (const item of generator()) {
        if (taken >= count) break;
        yield item;
        taken++;
      }
    })
  };
};
```

## Best Practices Summary

### 1. Pure Functions
- Always return the same output for the same input
- Avoid side effects
- Make functions small and focused

### 2. Immutability
- Never mutate data structures
- Use spread operators and immutable libraries
- Create new objects instead of modifying existing ones

### 3. Composition
- Build complex functions from simple ones
- Use pipe/compose for data transformations
- Keep functions small and composable

### 4. Error Handling
- Use monads for structured error handling
- Separate pure logic from side effects
- Handle errors at the boundaries

### 5. Testing
- Test pure functions with simple inputs/outputs
- Use property-based testing for complex functions
- Mock side effects and test pure logic separately

## Exercise
Build a complete todo application that combines all these patterns: Redux for state, composition for data processing, monads for error handling, and reactive streams for user interactions. 