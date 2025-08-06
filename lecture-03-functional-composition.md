# Lecture 3: Functional Composition

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