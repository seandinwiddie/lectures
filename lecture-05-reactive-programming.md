# Lecture 5: Reactive Programming with Cycle.js

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