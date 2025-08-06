# Lecture 4: Monads in Functional Programming

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