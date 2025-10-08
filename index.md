# Functional Programming Lectures

## Overview
This series of lectures explores functional programming concepts from fundamentals to advanced applications in modern development. The curriculum is designed with a lean and modular approach, emphasizing separation of concerns and functional programming principles throughout. As you progress, you'll learn how to build maintainable, scalable applications using pure functions, immutable data structures, and modern state management architecture patterns.

**Key Learning Philosophy:**
- Start thinking in pure functions from the beginning
- Embrace immutability as your default approach
- Leverage TypeScript's type system to its fullest
- Keep side effects isolated at your application boundaries
- Build complexity through composition, not inheritance
- Use Redux Toolkit and RTK Query for all state management needs
- Keep files small and focused on single responsibilities

**Architecture Principles You'll Master:**
- Avoid unnecessary code, duplication, and bloat in your codebase
- Keep UI components focused on rendering and Redux slices on business logic
- Use different handlers for different domains
- Keep files small with preferably one function per file for clarity
- Separate setup code from your core application rules
- Distribute feature logic and centralize only cross-cutting infrastructure

> "All software design is composition: the act of breaking complex problems down into smaller problems and composing those solutions. Learn to do it well." - Eric Elliott

## Glossary

Skip to the bottom of this document to see the glossary of a list of basic programming terms.

## Typescript

TypeScript is a superset of JavaScript that adds static typing to the language.

TypeScript will be the language of choice for this course.

## Learning Path & Lectures

### 1. Fundamentals
1. **[The Simplest FP TS Hello World](./the-simplest-fp-ts-hello-world/index.md)** - Basic pure function example
2. **[Basic TypeScript Knowledge](./basic-typescript-knowledge/index.md)** - Core TypeScript concepts for FP
3. **[What is a Function?](./what-is-a-function/index.md)** - Function fundamentals and pure functions
4. **[Basic Functional Programming Knowledge](./basic-functional-programming-knowledge/index.md)** - Core FP concepts
5. **[ES6+ Features for Functional Programming](./es6+-features-for-functional-programming/index.md)** - Modern JS/TS features
6. **[TypeScript and Functional Programming](./typescript-and-functional-programming/index.md)** - Type safety in FP

### 2. Intermediate
7. **[Redux Standard Patterns & Functional Programming](./redux-standard-patterns-&-functional-programming/index.md)** - Traditional Redux patterns
8. **[Redux Toolkit & Functional Programming](./redux-toolkit-&-functional-programming/index.md)** - Modern Redux with RTK
9. **[Functional Composition](./functional-composition/index.md)** - Advanced composition techniques

### 3. Advanced
10. **[Monads in Functional Programming](./monads-in-functional-programming/index.md)** - Monadic programming
11. **[Advanced Monad Transformers](./advanced-monad-transformers/index.md)** - Combining monadic effects
12. **[Category Theory Fundamentals](./category-theory-fundamentals/index.md)** - Mathematical foundations

### 4. Applications
13. **[Practical Applications of Functional Programming](./practical-applications-of-functional-programming/index.md)** - Real-world FP
14. **[Performance Optimization Techniques](./performance-optimization-techniques/index.md)** - FP performance
15. **[Functional Programming in Other Languages](./functional-programming-in-other-languages/index.md)** - FP across languages

### 5. Maintenance & Architecture
16. **[Functional Programming Maintenance Strategy](./functional-programming-maintenance-strategy/index.md)** - Maintaining FP codebases
17. **[Redux Toolkit & RTK Query Best Practices](./redux-toolkit-&-rtk-query-best-practices/index.md)** - RTK and RTK Query
18. **[Modern Redux Architecture Patterns](./modern-redux-architecture-patterns/index.md)** - Scalable Redux patterns

## Programming Glossary

- expression: A piece of code that produces a value. Expressions can be evaluated and always return a result (e.g., `2 + 3`, `Math.max(a, b)`, `user.name`).

- statement: A complete instruction that performs an action. Statements don't return values but execute code (e.g., `if (condition) { ... }`, `return value;`, `const x = 5;`).

- declaration: Code that introduces a new variable, function, or type into scope. Declarations create bindings but don't necessarily execute code.

- assignment: The process of storing a value in a variable. In functional programming, assignments are often avoided in favor of immutable declarations.

- variable: A named container that stores a value. In functional programming, variables are often immutable to prevent side effects and ensure referential transparency.

- const: A variable that is immutable. In functional programming, variables should be immutable to prevent side effects and ensure referential transparency. `const` is a better choice than `let` because it's more explicit and less error-prone.

- gate: A logical operator that controls data flow (AND, OR, NOT). Gates are pure functions that combine boolean values.

- boolean: A data type with only two possible values: true or false. Booleans are fundamental to conditional logic and functional programming.

- number: A numeric data type for mathematical operations. In functional programming, numbers are immutable and operations return new values.

- string: A sequence of characters representing text. Strings are immutable in most functional programming contexts.

- array: An ordered collection of elements. Arrays are fundamental to functional programming for data transformation operations.

- object: A collection of key-value pairs representing a real-world entity. In functional programming, objects should be immutable.

- method: A function that belongs to an object or class. Methods can access the object's state and modify it (though this is avoided in functional programming).

- function: A reusable block of code that takes inputs (parameters) and returns an output. In functional programming, functions should be pure - same input always produces same output with no side effects.

- type: A classification of data that defines what operations can be performed on it. Types provide compile-time safety and documentation.

- argument: The actual value passed to a function when it's called. Arguments are the concrete data that functions operate on.

- parameter: The placeholder variable in a function definition that receives arguments. Parameters define the function's interface and expected input types.

- attribute: A property or characteristic of an object. In functional programming, object attributes should be immutable to prevent side effects.

- return: A statement that exits a function and provides a value back to the caller. Return values should be the only way functions communicate results.

- side effect: Any change to the system outside the function (modifying global state, making API calls, logging). Pure functions avoid side effects.

- event: A signal that something has happened in the system (user interaction, timer completion, data arrival). Events are the foundation of reactive programming.

- listener: A function that waits for and responds to events. Listeners are pure functions that process event data without side effects.

- handler: A function that processes a specific event or action. Handlers should be pure functions that transform input data into output data.

- callback: A function passed as an argument to another function, to be executed later. Callbacks enable asynchronous programming and function composition.

- promise: An object representing the eventual completion (or failure) of an asynchronous operation. Promises provide a clean way to handle async operations functionally.

- async/await: Syntactic sugar for working with promises. Async functions return promises, and await pauses execution until a promise resolves.

- symbol: A unique, immutable primitive value used as object property keys. Symbols provide a way to create truly private properties.

- null: A special value representing the intentional absence of any object value. In functional programming, null is often replaced with Maybe/Option types.

- undefined: A value assigned to variables that have been declared but not initialized. Undefined represents an unassigned value.

- NaN: "Not a Number" - a special numeric value representing an undefined or unrepresentable mathematical result.

- interface: A TypeScript construct that defines the shape of an object. Interfaces describe contracts that objects must fulfill.

- class: A blueprint for creating objects with shared properties and methods. Classes are less common in functional programming, which prefers plain objects and functions.

- set: A collection of unique values with no duplicates. Sets are useful for functional programming operations like union, intersection, and difference.

- loop: A control structure that repeats code execution. In functional programming, loops are often replaced with higher-order functions like map, filter, and reduce.

- condition: A boolean expression that determines program flow. Conditions are used in if statements and ternary operators.

- iteration: The process of repeating a set of instructions. In functional programming, iteration is handled through recursion or higher-order functions.

- recursion: A function calling itself to solve a problem by breaking it into smaller subproblems. Recursion is fundamental to functional programming.