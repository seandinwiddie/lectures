# Functional Programming Lectures Index

## Overview
This series of lectures explores functional programming concepts.

## Todo- create lectures for:
- Basic Functional Programming JavaScript knowledge
- Familiarity with Functional Programming with ES6+ features
- Familiarity with Functional Programming with TypeScript
- Understanding of Functional Programming with React/Redux, RTK, and RTK Query
- Advanced monad transformers
- Category theory fundamentals
- Functional programming in other languages (Haskell, Elm, Clojure)
- Performance optimization techniques

## Lectures

# Redux Standard Patterns & Functional Programming

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

# Redux Toolkit & Functional Programming

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

# Functional Composition

## Overview
Functional composition is a core principle where complex functions are built by combining simpler functions. This lecture explores composition patterns from James Sinclair and Eric Elliott's work.

## Function Composition Basics

### Mathematical Composition
```javascript
// Mathematical composition: (f ∘ g)(x) = f(g(x))
const compose = (f, g) => x => f(g(x));

const addOne = x => x + 1;
const multiplyByTwo = x => x * 2;

const addOneThenMultiply = compose(multiplyByTwo, addOne);
console.log(addOneThenMultiply(5)); // 12
```

### Pipeline Composition
```javascript
// Pipeline: data flows through functions left to right
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const processData = pipe(
  x => x * 2,
  x => x + 1,
  x => x.toString()
);

console.log(processData(5)); // "11"
```

## Real-World Composition Examples

### Data Processing Pipeline
```javascript
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pure functions for data transformation
const filterActive = users => users.filter(user => user.active);
const mapNames = users => users.map(user => user.name);
const sortNames = names => names.sort();

// Compose the pipeline
const getActiveUserNames = pipe(filterActive, mapNames, sortNames);
console.log(getActiveUserNames(users)); // ["Alice", "Charlie"]
```

### Validation Pipeline
```javascript
const validateEmail = email => email.includes('@') ? email : null;
const validateLength = email => email && email.length > 5 ? email : null;
const normalizeEmail = email => email && email.toLowerCase();

const validateAndNormalize = pipe(validateEmail, validateLength, normalizeEmail);

console.log(validateAndNormalize('test@example.com')); // "test@example.com"
console.log(validateAndNormalize('invalid')); // null
```

## Advanced Composition Patterns

### Point-Free Style
```javascript
// Avoid mentioning the data explicitly
const prop = key => obj => obj[key];
const map = fn => arr => arr.map(fn);
const filter = fn => arr => arr.filter(fn);

// Point-free composition
const getActiveUserNames = pipe(
  filter(prop('active')),
  map(prop('name')),
  sort
);
```

### Composition with Currying
```javascript
const curry = fn => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs) => curried(...args, ...moreArgs);
  };
};

const add = curry((a, b) => a + b);
const multiply = curry((a, b) => a * b);

const addThenMultiply = pipe(add(5), multiply(2));
console.log(addThenMultiply(3)); // 16
```

## Composition in React/Redux

### Selector Composition
```javascript
// Compose selectors for complex data queries
const selectUsers = state => state.users;
const selectActiveUsers = pipe(selectUsers, filter(prop('active')));
const selectActiveUserNames = pipe(selectActiveUsers, map(prop('name')));
```

### Action Creator Composition
```javascript
const withMeta = meta => action => ({ ...action, meta });
const withTimestamp = action => ({ ...action, timestamp: Date.now() });

const createActionWithMeta = pipe(
  withMeta({ source: 'user' }),
  withTimestamp
);

const addTodo = text => ({ type: 'ADD_TODO', payload: { text } });
const addTodoWithMeta = pipe(addTodo, createActionWithMeta);
```

## Benefits of Composition
- **Reusability**: Small functions can be combined in many ways
- **Testability**: Each function can be tested independently
- **Readability**: Complex operations become clear pipelines
- **Maintainability**: Changes to one function don't affect others

## Resources
- [James Sinclair](https://jrsinclair.com/)
- [Eric Elliott](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)

## Exercise
Create a composition pipeline that processes a list of products: filters by price range, sorts by rating, and maps to display format. 

# Monads in Functional Programming

## Overview
Monads are a fundamental concept in functional programming that handle side effects and complex computations. This lecture explores monads based on Philip Wadler's work and their practical applications.

## What is a Monad?

A monad is a type that wraps a value and provides two operations:
1. **return/unit**: Wraps a value in the monad
2. **bind/flatMap**: Chains operations on the monad

```javascript
// Monad interface (conceptual)
class Monad {
  static return(value) { /* wraps value */ }
  bind(fn) { /* chains operations */ }
}
```

## Common Monad Types

### 1. Maybe Monad (Handles null/undefined)
```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static just(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  bind(fn) {
    return this.value === null || this.value === undefined
      ? Maybe.nothing()
      : fn(this.value);
  }

  map(fn) {
    return this.bind(value => Maybe.just(fn(value)));
  }
}

// Usage
const safeDivide = (a, b) => 
  b === 0 ? Maybe.nothing() : Maybe.just(a / b);

const result = Maybe.just(10)
  .bind(x => safeDivide(x, 2))
  .bind(x => safeDivide(x, 5));

console.log(result.value); // 1
```

### 2. Either Monad (Handles errors)
```javascript
class Either {
  constructor(value, isLeft = false) {
    this.value = value;
    this.isLeft = isLeft;
  }

  static left(error) {
    return new Either(error, true);
  }

  static right(value) {
    return new Either(value, false);
  }

  bind(fn) {
    return this.isLeft ? this : fn(this.value);
  }

  map(fn) {
    return this.bind(value => Either.right(fn(value)));
  }
}

// Usage
const parseNumber = (str) => {
  const num = parseInt(str);
  return isNaN(num) 
    ? Either.left('Invalid number')
    : Either.right(num);
};

const result = parseNumber('123')
  .bind(x => x > 0 ? Either.right(x * 2) : Either.left('Must be positive'))
  .map(x => x + 1);
```

### 3. List Monad (Handles collections)
```javascript
class List {
  constructor(values) {
    this.values = values;
  }

  static return(value) {
    return new List([value]);
  }

  bind(fn) {
    const results = this.values.flatMap(value => fn(value).values);
    return new List(results);
  }

  map(fn) {
    return this.bind(value => List.return(fn(value)));
  }
}

// Usage
const numbers = new List([1, 2, 3]);
const doubled = numbers.bind(x => new List([x, x * 2]));
console.log(doubled.values); // [1, 2, 2, 4, 3, 6]
```

## Monad Laws

### 1. Left Identity
```javascript
// return(a).bind(f) === f(a)
const a = 5;
const f = x => Maybe.just(x * 2);

const left = Maybe.just(a).bind(f);
const right = f(a);
// left.value === right.value
```

### 2. Right Identity
```javascript
// m.bind(return) === m
const m = Maybe.just(5);
const left = m.bind(Maybe.just);
const right = m;
// left.value === right.value
```

### 3. Associativity
```javascript
// m.bind(f).bind(g) === m.bind(x => f(x).bind(g))
const m = Maybe.just(5);
const f = x => Maybe.just(x * 2);
const g = x => Maybe.just(x + 1);

const left = m.bind(f).bind(g);
const right = m.bind(x => f(x).bind(g));
// left.value === right.value
```

## Practical Applications

### Error Handling
```javascript
const validateUser = (user) => {
  if (!user.name) return Either.left('Name required');
  if (!user.email) return Either.left('Email required');
  return Either.right(user);
};

const saveUser = (user) => {
  // Simulate database save
  return Either.right({ ...user, id: Date.now() });
};

const result = validateUser({ name: 'Alice', email: 'alice@example.com' })
  .bind(saveUser)
  .map(user => `User ${user.name} saved with ID ${user.id}`);
```

### Optional Chaining
```javascript
const getUser = (id) => Maybe.just({ id, name: 'Alice' });
const getProfile = (user) => Maybe.just({ ...user, bio: 'Developer' });
const getAvatar = (profile) => Maybe.just({ ...profile, avatar: 'avatar.jpg' });

const result = getUser(1)
  .bind(getProfile)
  .bind(getAvatar)
  .map(profile => profile.avatar);
```

## Monads in Modern JavaScript

### Promise as a Monad
```javascript
// Promise implements monad-like behavior
const fetchUser = (id) => fetch(`/api/users/${id}`).then(r => r.json());
const fetchPosts = (user) => fetch(`/api/users/${user.id}/posts`).then(r => r.json());

const result = fetchUser(1)
  .then(user => fetchPosts(user))
  .then(posts => posts.map(post => post.title));
```

### Array as a Monad
```javascript
// Array implements monad behavior with flatMap
const numbers = [1, 2, 3];
const result = numbers
  .flatMap(x => [x, x * 2])
  .flatMap(x => [x, x + 1]);
```

## Benefits of Monads
- **Error handling**: Structured way to handle failures
- **Composition**: Chain operations safely
- **Separation of concerns**: Pure logic separated from side effects
- **Type safety**: Compile-time guarantees about error handling

## Resources
- [Philip Wadler - Monads](https://jgbm.github.io/eecs762f19/papers/wadler-monads.pdf)

## Exercise
Implement a Result monad that can handle both success and error cases, then use it to process a list of user data with validation. 

# Reactive Programming with Cycle.js

## Overview
Reactive programming is a paradigm focused on data streams and propagation of change. This lecture explores reactive programming concepts through Andre Staltz's Cycle.js framework.

## What is Reactive Programming?

Reactive programming is programming with asynchronous data streams. Everything is a stream:
- User events (clicks, typing)
- HTTP requests
- Timer events
- Component state changes

```javascript
// Traditional imperative approach
let count = 0;
button.addEventListener('click', () => {
  count++;
  display.textContent = count;
});

// Reactive approach with streams
const clickStream = fromEvent(button, 'click');
const countStream = clickStream.pipe(
  scan((acc) => acc + 1, 0)
);
countStream.subscribe(count => display.textContent = count);
```

## Core Concepts

### 1. Streams
```javascript
// A stream is a sequence of events over time
const stream = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

stream.subscribe({
  next: value => console.log(value),
  complete: () => console.log('Done')
});
```

### 2. Operators
```javascript
// Transform streams using operators
const numbers$ = of(1, 2, 3, 4, 5);

const doubled$ = numbers$.pipe(
  map(x => x * 2),
  filter(x => x > 5)
);

doubled$.subscribe(console.log); // 6, 8, 10
```

### 3. Composition
```javascript
// Combine multiple streams
const clicks$ = fromEvent(button, 'click');
const timer$ = interval(1000);

const combined$ = merge(clicks$, timer$);
combined$.subscribe(event => console.log('Event:', event));
```

## Cycle.js Architecture

### MVI Pattern (Model-View-Intent)
```javascript
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

function main(sources) {
  // Intent: User actions → actions
  const click$ = sources.DOM.select('.button').events('click');
  const action$ = click$.map(() => ({ type: 'INCREMENT' }));

  // Model: Actions → state
  const state$ = action$.pipe(
    scan((state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return { ...state, count: state.count + 1 };
        default:
          return state;
      }
    }, { count: 0 })
  );

  // View: State → DOM
  const vdom$ = state$.map(state => 
    h('div', [
      h('h1', `Count: ${state.count}`),
      h('button.button', 'Increment')
    ])
  );

  return {
    DOM: vdom$
  };
}

run(main, {
  DOM: makeDOMDriver('#app')
});
```

## Functional Reactive Programming

### Pure Functions with Streams
```javascript
// Pure function that transforms a stream
const incrementCounter = (action$) => 
  action$.pipe(
    filter(action => action.type === 'INCREMENT'),
    scan((count, action) => count + 1, 0)
  );

// Pure function for DOM rendering
const renderCounter = (count$) =>
  count$.pipe(
    map(count => h('div', [
      h('h1', `Count: ${count}`),
      h('button', 'Increment')
    ]))
  );
```

### Composition of Streams
```javascript
// Compose multiple stream transformations
const processUserInput = pipe(
  debounceTime(300),
  map(event => event.target.value),
  filter(text => text.length > 2),
  distinctUntilChanged()
);

const searchResults$ = userInput$.pipe(processUserInput);
```

## Real-World Examples

### Search with Debouncing
```javascript
function searchComponent(sources) {
  const input$ = sources.DOM.select('.search').events('input');
  
  const searchTerm$ = input$.pipe(
    map(event => event.target.value),
    debounceTime(300),
    filter(term => term.length > 2)
  );

  const searchResults$ = searchTerm$.pipe(
    switchMap(term => 
      sources.HTTP.get(`/api/search?q=${term}`)
    ),
    map(response => response.body.results)
  );

  const vdom$ = combineLatest(searchTerm$, searchResults$).pipe(
    map(([term, results]) => 
      h('div', [
        h('input.search', { placeholder: 'Search...' }),
        h('ul', results.map(result => 
          h('li', result.title)
        ))
      ])
    )
  );

  return {
    DOM: vdom$,
    HTTP: searchTerm$.map(term => ({
      url: `/api/search?q=${term}`,
      category: 'search'
    }))
  };
}
```

### Todo App with Streams
```javascript
function todoApp(sources) {
  // Intent
  const addTodo$ = sources.DOM.select('.add-todo').events('click');
  const newTodoText$ = sources.DOM.select('.new-todo').events('input')
    .map(event => event.target.value);

  // Model
  const todos$ = addTodo$.pipe(
    withLatestFrom(newTodoText$),
    scan((todos, [_, text]) => [
      ...todos,
      { id: Date.now(), text, completed: false }
    ], [])
  );

  // View
  const vdom$ = todos$.pipe(
    map(todos => 
      h('div', [
        h('input.new-todo', { placeholder: 'New todo' }),
        h('button.add-todo', 'Add'),
        h('ul', todos.map(todo => 
          h('li', { key: todo.id }, todo.text)
        ))
      ])
    )
  );

  return { DOM: vdom$ };
}
```

## Benefits of Reactive Programming

### 1. Declarative
```javascript
// Declarative: Describe what you want, not how to get it
const result$ = source$.pipe(
  filter(x => x > 0),
  map(x => x * 2),
  take(5)
);
```

### 2. Compositional
```javascript
// Compose complex behaviors from simple streams
const userInput$ = fromEvent(input, 'input');
const validation$ = userInput$.pipe(
  map(validate),
  distinctUntilChanged()
);
const submit$ = fromEvent(form, 'submit');
const formData$ = combineLatest(userInput$, validation$);
```

### 3. Testable
```javascript
// Easy to test with marble testing
const input$ = cold('a-b-c', { a: 1, b: 2, c: 3 });
const result$ = input$.pipe(map(x => x * 2));
const expected$ = cold('a-b-c', { a: 2, b: 4, c: 6 });

expectObservable(result$).toBe(expected$);
```

## Resources
- [Andre Staltz - Cycle.js](https://cycle.js.org/)

## Exercise
Create a reactive counter component that can increment, decrement, and reset, using only pure functions and stream composition. 

# Practical Applications of Functional Programming

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