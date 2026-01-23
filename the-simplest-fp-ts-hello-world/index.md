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

---

## 🎬 Video Script

### INTRO (0:00 - 0:30)

**[On camera or voiceover with title card]**

> "Hey everyone! Today we're stripping functional programming down to its absolute core. Forget monads, forget complex type theory - we're starting with the simplest possible example: a pure function that says hello.
>
> By the end of this short video, you'll understand why this tiny function embodies everything that makes functional programming powerful."

---

### PART 1: What Makes a Function "Pure"? (0:30 - 1:30)

**[Screen: Show the code]**

> "Here's our function. Just one line:"
>
> ```typescript
> const greet = (name: string): string => `Hello, ${name}!`;
> ```
>
> "This is a *pure function*. What does that mean? Two simple rules:
>
> **One** - Given the same input, it *always* returns the same output. Call `greet('World')` a million times, you'll get `'Hello, World!'` a million times. No surprises.
>
> **Two** - It has no *side effects*. It doesn't change anything outside itself. No database writes, no global variables mutated, no files modified. It just takes data in, and returns data out."

---

### PART 2: Why This Matters (1:30 - 2:30)

**[Screen: Show usage examples]**

> "Let's run it:"
>
> ```typescript
> console.log(greet('World')); // "Hello, World!"
> console.log(greet('Alice')); // "Hello, Alice!"
> ```
>
> "Now, why should you care? Three reasons:
>
> **Predictability** - You can reason about this function in isolation. You don't need to know the state of the entire application to understand what it does.
>
> **Testability** - Testing is trivial. Input goes in, expected output comes out. No mocking, no setup, no teardown.
>
> **Composability** - Pure functions are building blocks. You can combine them, chain them, pass them around, and your code stays clean."

---

### PART 3: The TypeScript Advantage (2:30 - 3:00)

**[Screen: Highlight the type annotations]**

> "Notice the types: `(name: string): string`. TypeScript tells us exactly what goes in and what comes out.
>
> This is a *contract*. The compiler enforces it. Try passing a number? Error. Expect a boolean back? Error.
>
> Types plus purity equals confidence. Your code does what it says, and nothing else."

---

### OUTRO (3:00 - 3:30)

**[On camera or voiceover]**

> "That's it. The simplest functional program in TypeScript. One pure function.
>
> Every complex functional application - whether it's using fp-ts, Effect, or any other library - is built on this foundation. Pure functions, composed together.
>
> Start simple. Build up. Thanks for watching, and I'll see you in the next one."

---

### 📝 Production Notes

- **Total runtime:** ~3-3.5 minutes
- **Visuals:** VSCode or TypeScript Playground showing the code
- **Tone:** Conversational, confident, no jargon
- **Call to action:** Link to TypeScript Playground in description so viewers can experiment
