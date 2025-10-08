# The simplest FP TS Hello World

This lecture demonstrates the simplest possible functional programming example in TypeScript - a pure function that processes data without side effects.

> "Simplicity is the ultimate sophistication. A pure function that always returns the same output for the same input is the foundation of predictable, testable code." - AI Insight

## The Simplest Functional Program

### Pure Function Example
```typescript
// The simplest pure function
const greet = (name: string): string => `Hello, ${name}!`;
/**
 * Simple greeting function that returns a personalized message.
 * @param name - The name to greet
 * @returns A greeting string with the provided name
 * 
 * @example
 * greet("World") // returns "Hello, World!"
 * greet("Alice") // returns "Hello, Alice!"
 */

// Usage
console.log(greet('World')); // "Hello, World!"
console.log(greet('Alice')); // "Hello, Alice!"
```

[Run this example in the TypeScript Playground](https://www.typescriptlang.org/play/?&code=//%20The%20simplest%20pure%20functionconst%20greet%20=%20(name:%20string):%20string%20=%3E%20`Hello,%20${name}!`;/**%20*%20Simple%20greeting%20function%20that%20returns%20a%20personalized%20message.%20*%20@param%20name%20-%20The%20name%20to%20greet%20*%20@returns%20A%20greeting%20string%20with%20the%20provided%20name%20*%20%20*%20@example%20*%20greet(%22World%22)%20//%20returns%20%22Hello,%20World!%22%20*%20greet(%22Alice%22)%20//%20returns%20%22Hello,%20Alice!%22%20*///%20Usageconsole.log(greet(%27World%27));%20//%20%22Hello,%20World!%22console.log(greet(%27Alice%27));%20//%20%22Hello,%20Alice!%22#code/PTAEBUAsFNQZwJYFsAOAbacAuoUFcAnWAMzwDsBjLBAezICgK7tQBzI6HAXlAAoyAhkmgAueFgIIyrAJRjsk6aC4A+UAAMAEtDRoaAGlAASAN6DhAXwCE6gNz1gAKkf1Qj0AGVk6WO2icpVlBSSmo6UCxIARwiLEIyOFABXGgCODoBNAQAL2gAE1BhODgBVmgAOld3AAEUAQIhUHNYAFoIGCahWCwaNg4sKtBq2PjEgEE+-2olBUDQAHcESIiOlAIaADcEPPzO4UHB6ugADyEfQb9OXgAiAHUaAjQ865lQEFARggTQa+1dA1A90eeSs1wu-RuYyyFGgLzeYE+31+Oj0hihCBhoKqwHoDjAAFUSmVGMwaBhynpWLxLlheAByIFPOkyGS2eE-P6owEPJ5YpgJMkVSnUiF09Ew5ms9nI-5o6HQUFAA)
