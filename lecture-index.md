# Functional Programming Lectures Index

## Overview
This series of lectures explores functional programming concepts through practical applications in modern JavaScript development. Each lecture builds upon the previous ones, creating a comprehensive understanding of functional programming principles.

## Lecture Series

### [Lecture 1: Redux Standard Patterns & Functional Programming](lecture-01-redux-patterns.md)
**Learning Objectives:**
- Understand how Redux implements functional programming principles
- Learn pure functions, immutability, and composition in Redux
- Explore action creators and selectors as pure functions
- Practice building predictable state management

**Key Concepts:**
- Pure functions in reducers
- Immutable state updates
- Functional composition with combineReducers
- Action creators and selectors

---

### [Lecture 2: Redux Toolkit & Functional Programming](lecture-02-redux-toolkit.md)
**Learning Objectives:**
- Master Redux Toolkit's functional approach
- Understand createSlice and createAsyncThunk
- Learn Immer's immutable updates
- Explore RTK Query for data fetching

**Key Concepts:**
- createSlice for pure function generators
- Immer for immutable updates
- Async thunks for side effects
- RTK Query for functional data fetching

---

### [Lecture 3: Functional Composition](lecture-03-functional-composition.md)
**Learning Objectives:**
- Master function composition techniques
- Learn pipeline and mathematical composition
- Understand point-free programming
- Practice building data transformation pipelines

**Key Concepts:**
- Mathematical composition (f ∘ g)
- Pipeline composition with pipe
- Point-free style programming
- Composition with currying
- Real-world data processing examples

---

### [Lecture 4: Monads in Functional Programming](lecture-04-monads.md)
**Learning Objectives:**
- Understand monad theory and implementation
- Learn Maybe, Either, and List monads
- Master monad laws and practical applications
- Explore error handling with monads

**Key Concepts:**
- Monad interface (return/bind)
- Maybe monad for null handling
- Either monad for error handling
- List monad for collections
- Monad laws and composition

---

### [Lecture 5: Reactive Programming with Cycle.js](lecture-05-reactive-programming.md)
**Learning Objectives:**
- Understand reactive programming principles
- Learn stream-based programming
- Master MVI pattern in Cycle.js
- Explore functional reactive programming

**Key Concepts:**
- Streams and operators
- MVI (Model-View-Intent) pattern
- Pure functions with streams
- Stream composition
- Real-world reactive applications

---

### [Lecture 6: Practical Applications](lecture-06-practical-applications.md)
**Learning Objectives:**
- Combine all functional programming concepts
- Build complete applications using FP principles
- Learn advanced patterns and optimizations
- Master testing and error handling

**Key Concepts:**
- Complete todo application
- Functional state machines
- Performance optimization
- Testing strategies
- Best practices summary

## Learning Path

### Beginner Level (Lectures 1-2)
Start with Redux patterns to understand basic functional programming concepts in a familiar context.

### Intermediate Level (Lectures 3-4)
Dive deeper into composition and monads to build more sophisticated functional programming skills.

### Advanced Level (Lectures 5-6)
Explore reactive programming and practical applications that combine all concepts.

## Prerequisites
- Basic JavaScript knowledge
- Understanding of React/Redux (helpful but not required)
- Familiarity with ES6+ features

## Resources Referenced
- [Redux Standard Patterns](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [James Sinclair](https://jrsinclair.com/)
- [Eric Elliott](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)
- [Philip Wadler](https://jgbm.github.io/eecs762f19/papers/wadler-monads.pdf)
- [Andre Staltz](https://cycle.js.org/)

## Exercises
Each lecture includes practical exercises to reinforce learning:
- Lecture 1: Create a pure reducer for shopping cart
- Lecture 2: Build Redux Toolkit slice with async thunk
- Lecture 3: Build data processing pipeline
- Lecture 4: Implement Result monad
- Lecture 5: Create reactive counter component
- Lecture 6: Build complete functional todo application

## Next Steps
After completing this series, consider exploring:
- TypeScript with functional programming
- Advanced monad transformers
- Category theory fundamentals
- Functional programming in other languages (Haskell, Elm, Clojure)
- Performance optimization techniques
- Property-based testing with libraries like fast-check 