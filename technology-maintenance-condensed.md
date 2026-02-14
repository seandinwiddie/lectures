# FP Maintenance Strategy (Condensed)

This document provides essential guidelines for maintaining the codebase using functional programming (FP) principles combined with Redux Toolkit (RTK) and RTK Query. For detailed patterns and examples, see [Standard Version](./technology-maintenance.md). For comprehensive examples and complete reference, see [Extensive Version](./technology-maintenance-extensive.md).

Ensure full Playwright E2E test coverage.

Ensure full Maestro E2E test coverage.

> **Note:** This is the condensed version for quick reference. Each section summarizes the corresponding section from the standard version, with links to more detailed information.

> [!CAUTION]
> **CRITICAL ARCHITECTURE RULE: NO BUSINESS LOGIC IN REACT COMPONENTS**
> 
> **React components must be strictly presentational.**
> [!CRITICAL]
> **BOYCOTT REACT LOGIC**: Do NOT use `useEffect`, `useCallback`, `useMemo`, or `useState` for ANY logic, data fetching, state transformations, workflows, or validation.
> **TSX IS PRESENTATIONAL ONLY**: Components must simply render data from Redux selectors.
> **REDUX FOR EVERYTHING**: All state, logic, and side effects MUST happen in Redux (Slices, RTK Query, Listener Middleware).
> **ZERO EXCEPTIONS**: There are no valid reasons to place logic in components.
> - **ALL** business logic must reside in Redux slices (`.ts` files) as pure reducers.
> - **ALL** side effects (data fetching, logging, etc.) must be handled by Redux Toolkit Query or Listener Middleware.
>
> **PURE RENDERING**: TSX files should strictly render and re-render markup based on props/state.
>
> **STYLING & ANIMATIONS**: All styling and animations must be handled via CSS. Do not use JS for animations.
>
> **NO REACT META-COMMENTS**: Do not leave comments explaining that React functions were removed or why they aren't used. The code should speak for itself.
>
> **STATE FLOW**: Event -> Redux Action -> State Change -> Component Re-render.
>
> **If you are writing a `useEffect`, YOU ARE DOING IT WRONG. Stop and move the logic to Redux.**

## Purpose

This maintenance guide ensures consistent, maintainable, and scalable code across all layers by:

- **Enforcing Functional Programming Principles**: Using pure functions, immutability, and explicit state management throughout frontend, backend, and database layers
- **Standardizing on Redux Toolkit**: RTK and RTK Query are the definitive choice for all frontend state management and data fetching, replacing manual Redux patterns and reactive programming libraries
### 1. **Zero React Logic Components** (Zero State / Zero Effect)
- **Strict Rule**: Components must NOT contain `useState`, `useReducer`, `useEffect`, `useCallback`, or `useMemo`.
- **Reason**: Components are for **Markup (TSX) Only**. Logic in hooks hides complexity and couples the view to business rules.
- **Implementation**:
    - **State**: `useSelector(selectData)`
    - **Actions**: `dispatch(doSomething())`
    - **Initialization**: Handled by Redux Listener Middleware or Router events, NEVER by `useEffect` on mount or `useState` initialization.
- **Maintaining Clear Separation of Concerns**: Frontend components are presentational only; all business logic lives in pure reducers within feature slices
- **Applying FP Patterns to Backend**: CQRS, event sourcing, and pure function patterns for backend services and command/query handlers
- **Database-First FP Approach**: Immutable migrations, pure query functions, and functional composition patterns for PostgreSQL/Nile multi-tenant databases

## Scope

### Frontend (React + Redux Toolkit)
- **State Management**: Redux Toolkit's `createSlice` for all client-side state with built-in Immer integration
- **Data Fetching**: RTK Query for all server state, caching, and synchronization
- **Components**: Strictly presentational UI components that dispatch actions and consume state via selectors
- **Business Logic**: All business rules, validation, and transformations in pure reducer functions

### Backend (Node.js + Express)
- **CQRS Pattern**: Command-Query Responsibility Segregation separating state-changing operations from read operations
- **Event Sourcing**: Immutable event store for complete audit trail and time-travel debugging
- **Pure Functions**: Command handlers, query handlers, and event handlers as pure, testable functions
- **Endpoint Structure**: SQL-structured endpoints following `/endpoint/basic/{operation}/{entity}` pattern

### Database (PostgreSQL + Nile)
- **Multi-Tenant Architecture**: Tenant isolation using `tenant_id` in all queries and schema design
- **Immutable Migrations**: Version-controlled schema changes with up/down migrations
- **Query Optimization**: Index strategies, query performance analysis, and connection pooling

## Core Approach

The codebase follows a **reducer-first, FP-aligned architecture** across all layers:

- **Frontend**: Redux Toolkit's `createSlice` handles all client-side state; RTK Query manages all server state; business logic in pure reducers
- **Backend**: CQRS pattern separates commands from queries; event sourcing for auditability; pure handlers for all operations
- **Database**: Immutable schema changes through migrations; pure queries where possible; multi-tenant isolation with `tenant_id`

## Document Structure

This guide is organized to support quick reference:

- **[Quick Reference](#quick-reference)**: Checklists and common patterns for immediate use
- **[Core Principles](#core-principles)**: Fundamental rules for components, business logic, and code organization
- **[Architecture & Patterns](#architecture--patterns)**: Redux Toolkit patterns and RTK Query usage
- **[Directory Structure](#directory-structure)**: Feature-based organization and file structure
- **[Testing Strategy](#testing-strategy)**: TDD/BDD approaches with Given-When-Then scenarios
- **[Database Maintenance](#database-maintenance)**: PostgreSQL/Nile multi-tenant database patterns
- **[Backend Architecture](#backend-architecture)**: CQRS, event sourcing, and Redux principles applied to backend
- **[Implementation Roadmap](#implementation-roadmap)**: Step-by-step implementation guidance
- **[Debugging Strategies](#debugging-strategies)**: Systematic approaches for troubleshooting

For detailed patterns and examples, see [Standard Version](./technology-maintenance.md). For comprehensive examples and complete reference, see [Extensive Version](./technology-maintenance-extensive.md).

## Getting Started

**New to this codebase?** 
- Start with the [Quick Reference](#quick-reference) section for immediate guidance
- Review [Core Principles](#core-principles) to understand fundamental rules
- Explore [Architecture & Patterns](#architecture--patterns) for detailed implementation patterns

**Refactoring existing code?** 
- Use the refactoring checklists in [Quick Reference](#quick-reference)
- Follow explicit refactoring rules in [Core Principles](#core-principles)
- Consult layer-specific sections for detailed patterns
- For detailed refactoring patterns, see [Standard Version](./technology-maintenance.md#core-principles)

**Implementing new features?** 
- Review [Architecture & Patterns](#architecture--patterns) for Redux Toolkit patterns
- Consult [Directory Structure](#directory-structure) for organization guidelines
- Follow [Implementation Roadmap](#implementation-roadmap) for step-by-step guidance
- For comprehensive implementation examples, see [Extensive Version](./technology-maintenance-extensive.md#implementation-roadmap)

**Debugging issues?**
- Start with [Debugging Strategies](#debugging-strategies) for systematic approaches
- Use Redux DevTools for frontend state issues

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [Core Principles](#core-principles)
3. [Architecture & Patterns](#architecture--patterns)
4. [Directory Structure](#directory-structure)
5. [Testing Strategy](#testing-strategy)
6. [Database Maintenance](#database-maintenance)
7. [Backend Architecture](#backend-architecture)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Debugging Strategies](#debugging-strategies)

---

## Quick Reference

**Use this section as a quick checklist when refactoring code. For detailed explanations, see [Core Principles](#core-principles).**

### Priority 1: Critical Rules

- [ ] **No business logic in components** → Move to reducers in `features/[domain]/slice/[feature]Slice.ts`
- [ ] **No manual data fetching** → Use RTK Query hooks (`useGetQuery`, `useMutation`)
- [ ] **No business logic in utilities** → Move to pure reducer functions in slices
- [ ] **All state management uses Redux Toolkit** → Use `createSlice`, not manual Redux

### Priority 2: Architecture Patterns

- [ ] **Selectors co-located with reducers** → Define in same slice file
- [ ] **RTK Query for all data fetching** → No `useEffect` + `fetch` patterns
- [ ] **Side effects isolated** → RTK Query for data, listener middleware for reactive effects
- [ ] **Single responsibility per file** → Split large files (`>300` lines)

### Priority 3: Code Quality

- [ ] **Tests follow BDD structure** → Given-When-Then format
- [ ] **Files are focused** → &lt;300 lines, single responsibility
- [ ] **Pure functions where possible** → Testable, predictable
- [ ] **Feature-based organization** → Code organized by domain/feature

### Common Code Smells

❌ Business logic in components | ❌ Manual data fetching (`fetch`, `axios` in components)  
❌ State management outside Redux | ❌ Missing selectors  
❌ Side effects in reducers | ❌ Large files with multiple responsibilities  
❌ Missing tests for business logic | ❌ Non-RTK patterns (sagas, observables for data fetching)

### Refactoring Checklist

When refactoring any file, verify:
- [ ] No business logic in components
- [ ] All data fetching uses RTK Query
- [ ] All state management uses Redux Toolkit
- [ ] No component state (no `useState`, `useReducer`, or local state) - ALL state in Redux slices
- [ ] UI state (modals, dropdowns, form fields) managed in Redux slices
- [ ] Components dispatch actions to update UI state
- [ ] Components read UI state via selectors
- [ ] No mount logging or debugging in components (use redux-logger middleware)
- [ ] Selectors are co-located with reducers
- [ ] Files follow single responsibility
- [ ] Tests exist for business logic
- [ ] Pure functions are used where possible
- [ ] Side effects are isolated (RTK Query or listener middleware)
- [ ] **NO `useEffect` used for logic**: Verify no `useEffect` hooks are performing state updates or business operations.

---

## Core Principles

### Components vs Business Logic

#### Components are Presentational ONLY (Zero State)

Components in `components/` must contain **ONLY presentational logic**:
- Rendering UI elements
- Styling and layout
- User interaction handlers that dispatch Redux actions
- Consuming state via selectors and RTK Query hooks
- Composing smaller presentational components

**Components MUST NOT contain:**
- **Business logic of ANY kind** (validation, calculations, transformations)
- **Data fetching logic** (use RTK Query hooks instead)
- **State management logic** (use Redux slices instead)
- **ANY component state** (use `useState`, `useReducer`, or local state) - ALL state must go through Redux
- **Mount logging or debugging hooks** (use redux-logger middleware instead)
- **`useEffect` for business logic**: NEVER use `useEffect` to trigger data fetching, state updates, business workflows, OR animations. `useEffect` is FORBIDDEN. All logic must reside in Redux.

#### Component Composition Hierarchy

1.  **Screens (`screens/`)**:
    -   **NO RAW MARKUP**: Screens should NOT be filled with `<div>`, `<span>`, or other raw markup.
    -   **Strict Composition**: Screens must be composed ENTIRELY of components from `elements/generic` and `elements/unique`.
    -   **Layout Only**: Screens simply orchestrate valid high-level elements.

2.  **Unique Elements (`elements/unique/`)**:
    -   **Composition First**: Should primarily be compositions of `elements/generic`.
    -   **Minimize Custom Markup**: Use raw markup/custom elements ONLY if absolutely necessary and not achievable with generic building blocks.

3.  **Generic Elements (`elements/generic/`)**:
    -   **Base Building Blocks**: Pure, reusable atoms/molecules used to build all other components.

#### Business Logic in Pure Reducers

**ALL business logic** must be implemented as pure reducer functions in Redux slices within `features/`:
- Validation rules and validation logic
- Business workflows and state machines
- Data transformations and calculations
- Business rules and decision logic

**How Components Interact with Business Logic:**
1. Components dispatch actions (e.g., `dispatch(validateForm(formData))`)
2. Actions trigger pure reducer functions in slices
3. Reducers contain all business logic and return new state
4. Components consume updated state via selectors
5. Components re-render based on state changes

### Refactoring Rules

**IF** a component contains validation logic, calculations, transformations, or workflows  
**THEN** create a reducer in `features/[domain]/slice/[feature]Slice.ts`  
**AND** move logic to the reducer  
**AND** have the component dispatch actions instead

**IF** a component uses `useState`, `useReducer`, or any local state (including UI state like `isModalOpen`, `isDropdownExpanded`)  
**THEN** move ALL state to Redux slices (use `features/core/ui/slice/uiSlice.ts` for UI state)  
**AND** replace local state management with Redux actions and selectors  
**AND** components dispatch actions to update state  
**AND** components read state via selectors

**IF** a component contains mount logging, component state logging, or debugging with `useEffect`  
**THEN** remove logging from component  
**AND** use `redux-logger` middleware for all state change logging  
**AND** all logging goes through Redux middleware, not component hooks

**IF** a component uses `useEffect` + `fetch` for data fetching  
**THEN** replace with RTK Query hooks (`useGetQuery`, `useMutation`) from an API slice  
**AND** remove manual fetch logic and state management

**IF** business logic exists in utility files or services  
**THEN** identify the domain/feature it belongs to  
**AND** move logic to a pure reducer function in `features/[domain]/slice/[feature]Slice.ts`

---

## Architecture & Patterns

### Redux's Three Core Principles (FP-Aligned)

- **Single Source of Truth**: All application state lives in one Redux store object tree
- **State is Read-Only**: State can only be changed by dispatching actions
- **Changes are Made with Pure Functions**: Reducers are pure functions that take previous state and an action, returning new state without mutations

### Why RTK and RTK Query Over Alternatives

RTK Query eliminates the need for most hand-written data fetching logic:
- Automatic caching, invalidation, and background refetching out-of-the-box
- Built-in optimistic updates and error handling
- Seamless Redux DevTools integration
- TypeScript-first design with excellent inference
- Official Redux team support

### Redux Toolkit Core Patterns

#### createSlice Patterns

`createSlice` automatically generates action creators and action types, reducing boilerplate:

- **Single-file consolidation**: All Redux logic (reducers, actions, selectors) for a feature in one file
- **Automatic action creators**: `createSlice` generates action creators automatically
- **Selectors co-located**: Selectors defined alongside reducers in the same file

#### extraReducers with Builder Callback

Use `extraReducers` to handle actions from other slices or async thunks. Cross-slice actions are encouraged.

#### Fat Reducers, Thin Actions Pattern

**Put as much logic as possible into reducers.** Benefits:
- Centralized business logic
- Time-travel debugging
- Testability
- Predictability

#### createAsyncThunk vs RTK Query

**Use createAsyncThunk when:**
- Complex async logic that doesn't fit RTK Query patterns
- Need to dispatch multiple actions during async operations

**Use RTK Query when:**
- Fetching data from REST APIs (preferred for all data fetching)
- Need automatic caching and cache invalidation
- Need background refetching and polling

#### RTK Query Patterns

- **Base API Slice**: Create a base API slice with shared configuration
- **Tag-Based Cache Invalidation**: Use tags to manage cache invalidation
- **Optimistic Updates**: Implement `onQueryStarted` in mutation endpoints

#### Listener Middleware

Use listener middleware for:
- Cache invalidation based on actions
- Analytics and logging
- Cross-slice coordination

Don't use for:
- Business logic (use reducers)
- Data fetching (use RTK Query)

#### Selector Patterns

- **Co-location**: Define selectors alongside reducers in the same file
- **createSelector**: Use for memoized derived state computations
- **Reuse Everywhere**: Selectors should be reused in components, thunks, and anywhere else state is accessed

### Refactoring Rules for Redux Toolkit

**IF** code uses `useEffect` + `fetch` or `axios` for data fetching  
**THEN** create an RTK Query endpoint in the appropriate API slice  
**AND** replace with RTK Query hooks

**IF** code uses manual Redux (without RTK)  
**THEN** convert to `createSlice` from Redux Toolkit  
**AND** use automatically generated action creators

**IF** business logic exists in action creators or components instead of reducers  
**THEN** move logic to reducer functions (fat reducers pattern)

---

## Directory Structure

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Expo Router app directory
│   ├── features/                     # Redux feature modules (domain-driven)
│   │   ├── core/                     # Core application features
│   │   │   ├── api/                  # RTK Query API slice
│   │   │   ├── store/                # Redux store configuration
│   │   │   └── [core features]/
│   │   └── [domain]/                 # Domain-specific features
│   │       ├── slice/                # Domain state slice
│   │       └── __tests__/            # Domain slice tests
│   ├── components/                   # React components (presentational ONLY)
│   │   ├── elements/                 # Reusable UI components
│   │   └── screens/                  # Screen-level components
│   └── __tests__/                    # Global test utilities
```

**Key Points:**
- Single-file logic: All Redux logic for a feature in one slice file
- Selectors co-located: Selectors defined alongside reducers
- Components are presentational ONLY: No business logic in components

### Backend Directory Structure

- **Endpoint Structure**: `/endpoint/basic/{operation}/{entity}`
- **Service Module Structure**: Business logic in services as pure, testable functions
- **Key Principles**: SQL-structured endpoints, pure functions, separation of concerns

For detailed directory structure, see [Standard Version](./technology-maintenance.md#directory-structure).

---

## Testing Strategy

### TDD and BDD Overview

**Test-Driven Development (TDD)** follows three steps:
1. **Red**: Write a failing test that describes the desired functionality
2. **Green**: Write the minimal code necessary to make the test pass
3. **Refactor**: Improve the code structure while keeping tests passing

**Behavior-Driven Development (BDD)** extends TDD by focusing on behavior from the user's perspective using Given-When-Then structure.

### BDD Given-When-Then Structure

- **Given**: Describes the initial state or pre-condition
- **When**: Describes the action or event that triggers the behavior
- **Then**: Describes the expected outcome or result

> [!CAUTION]
> **CRITICAL TESTING RULE: NO MOCKING**
> - **NEVER** mock Redux slices, selectors, or component logic.
> - **NEVER** mock internal functions to make a test "pass".
> - Use real services in test environments; only mock third-party external services (payment APIs, email) when absolutely necessary.
> - "Getting the test to pass" by mocking is a failure. The goal is to verify the app works.

### Integration with Redux Toolkit Testing

- **Redux Slices**: Test reducers with BDD scenarios describing state transformations
- **RTK Query**: Test API endpoints with scenarios describing data fetching and caching behavior
- **Components**: Test presentational components with scenarios describing user interactions

### Refactoring Rules for TDD and BDD

**IF** a slice file exists without a corresponding test file  
**THEN** create a test file following the pattern `[feature]Slice.test.ts`  
**AND** write BDD-style tests with Given-When-Then structure

**IF** tests don't follow BDD structure  
**THEN** refactor tests to use BDD format with clear Given-When-Then comments

### E2E Testing: Assert Data Presence, Not Just Containers

End-to-end tests must explicitly verify that the test environment is populated with required data before validating functionality. A common testing pitfall occurs when tests run against an empty database or unseeded environment. In these scenarios, the application renders "empty state" placeholders, allowing tests that only verify container visibility to pass falsely.

**Rule: Assert Data Presence, Not Just Containers.**

- **Assert Non-Empty State**: Tests must explicitly verify that "no data" or "empty state" placeholders are *not* visible when data is expected.
- **Assert Item Count**: Tests must verify that lists contain more than zero items (e.g., `expect(await items.count()).toBeGreaterThan(0)`).
- **Fail Fast on Missing Data**: If required data is missing, the test should fail immediately, flagging the environmental issue rather than passing silently.

This prevents false positives where bugs in item-rendering code are concealed because the code paths were never executed.

For detailed testing patterns and examples, see [Standard Version](./technology-maintenance.md#testing-strategy).

---

## Database Maintenance

### Functional Programming with SQL

- **Pure Query Functions**: Database queries should be pure functions where possible - deterministic, with no side effects beyond data retrieval
- **Immutable Schema Changes**: Schema changes should be immutable - each change creates a new version through migrations
- **Function Composition**: Build complex queries by composing simple, reusable query functions

### Schema Design Patterns

- **Multi-Tenant Schema Design**: Always include `tenant_id` in every tenant-aware table; use composite primary keys: `(id, tenant_id)`
- **Index Design**: Index `tenant_id` first in composite indexes; use partial indexes for filtered queries
- **JSONB Usage**: Use for flexible data; index with GIN for JSONB columns used in WHERE clauses

### Migration Management

- **Migration File Naming**: Format: `{sequence_number}_{description}.sql`
- **Up and Down Migrations**: Every migration should have both up (apply) and down (rollback) operations
- **Data Migration Patterns**: Backup first; test on copy; batch processing for large datasets

### Query Optimization

- **Index Optimization**: Index all foreign key columns; index `tenant_id` for multi-tenant queries
- **Query Performance Analysis**: Use EXPLAIN and EXPLAIN ANALYZE to analyze query performance
- **Common Anti-Patterns**: Missing tenant filter; N+1 queries; SELECT *; missing indexes

### Multi-Tenant Database Patterns

- **Tenant Isolation**: Always include `tenant_id` in queries; Nile handles Row-Level Security automatically
- **Tenant-Scoped Queries**: All SELECT/INSERT/UPDATE/DELETE queries include `tenant_id` filter
- **Performance**: Index `tenant_id` first in composite indexes; monitor per-tenant performance

For detailed database patterns and maintenance checklists, see [Standard Version](./technology-maintenance.md#database-maintenance).

---

## Backend Architecture

### Redux Principles Applied to Backend

While Redux is primarily a client-side library, its core principles can be applied to backend architecture:

- **Single Source of Truth**: Event store contains all state changes as an immutable sequence of events
- **State is Read-Only**: State can only be changed by processing commands that create events
- **Changes are Made with Pure Functions**: Command handlers and event handlers are pure functions
- **Unidirectional Data Flow**: Commands → Command Handlers → Events → Event Store → Projections → Query Handlers → Responses

### Architectural Patterns

1. **Command-Query Responsibility Segregation (CQRS)**: Separates commands (state-changing) from queries (read-only)
2. **Event Sourcing**: Stores all state changes as immutable events, reconstructs state by replaying events
3. **Functional Programming**: Pure functions, immutability, function composition
4. **Domain-Driven Design (DDD) Aggregates**: Clusters of related entities with consistency boundaries

### Command-Query Responsibility Segregation (CQRS)

**Commands (State-Changing Operations):**
- Represent intent to change system state
- Mapping: `POST /endpoint/basic/create/[entity]`, `PUT /endpoint/basic/update/[entity]`, `DELETE /endpoint/basic/delete/[entity]`

**Queries (Read-Only Operations):**
- Retrieve data without modifying state
- Mapping: `GET /endpoint/basic/select/[entity]`, `GET /endpoint/basic/read/[operation]`

### Event Sourcing

**Core Concepts:**
- **Event Store**: Immutable sequence of events as single source of truth
- **Events**: Immutable records of what happened with descriptive names
- **Event Handlers**: Pure functions that project events to read models
- **Event Replay**: Reconstruct state by loading all events for an aggregate

**Benefits:**
- Auditability: Complete history of all state changes
- Time-Travel Debugging: Reconstruct state at any point in time
- Multiple Read Models: Build different projections for different use cases

### Implementation Strategy

**Phase 1: Introduce CQRS Separation (Low Risk)**
- Map existing endpoints: `create/`, `update/`, `delete/` → Commands
- Map existing endpoints: `select/`, `read/` → Queries

**Phase 2: Introduce Event Sourcing (Medium Risk)**
- Enhance existing `audit_logs` table to store events
- Create event definitions for key operations
- Store events alongside traditional database writes

For detailed backend architecture patterns, see [Standard Version](./technology-maintenance.md#backend-architecture).

---

## Implementation Roadmap

### 1. Redux Store Foundation

- Configure store using `configureStore` from Redux Toolkit
- Set up middleware properly: RTK Query middleware must be concatenated
- Use typed hooks: `useAppDispatch` and `useAppSelector` for type safety

### 2. Core Utilities with Reducer-First Approach

- Replace all manual data fetching with RTK Query endpoints
- Maintain Redux slices for client-side state only (UI state, form state, computed state)
- Use RTK Query's built-in caching, invalidation, and background sync

### 3. Components with Reducer-Based State

- **CRITICAL: Components are Presentational ONLY** - Components must contain ONLY presentational logic
- **ALL business logic** must be in pure reducers within `features/` slices
- Replace `useEffect` + `fetch` patterns with RTK Query hooks

### 4. Enhance APIs with RTK Query

- Convert all existing thunks and manual API calls to RTK Query endpoints
- Use a single enhanced base query to reduce redundant logic
- Leverage RTK Query's automatic retry logic, error handling, and optimistic updates

For detailed implementation steps, see [Standard Version](./technology-maintenance.md#implementation-roadmap).

---

## Debugging Strategies

### Before You Begin Debugging

**Gather Information:**
- Understand the exact symptoms (actual vs. expected behavior)
- Reproduce consistently (document exact steps)
- Review error messages and stack traces carefully

**Form a Hypothesis:**
- Identify likely areas (which slices, components, or services are involved?)
- Consider data flow (action dispatch → reducer → selector → component)

### Systematic Debugging Approach

1. **Reproduce the Bug Consistently** - Document exact steps needed to reproduce
2. **Use Console Logs Strategically** - Use `redux-logger` middleware for automatic state change logging. **DO NOT use `useEffect` hooks for mount logging, component state logging, or debugging** - all logging goes through Redux middleware (see [Standard Version](./technology-maintenance.md#debugging-strategies) for details)
3. **Use Debuggers Effectively** - Set breakpoints at critical points
4. **Isolate the Problem** - Comment out sections to isolate problematic area
5. **Analyze Errors and Stack Traces** - Follow the call stack to understand execution path
6. **Leverage Browser DevTools** - Network Tab, Application Tab, Console Tab, Performance Tab

### Redux-Specific Debugging

**Redux DevTools Extension Features:**
- Time-travel debugging: Step backward and forward through action history
- State inspection: View entire Redux state tree at any point
- Action inspection: See all dispatched actions with payloads
- Diff view: See exactly what changed in state after each action

**Debugging RTK Query:**
- View cache state: See all cached queries and data in Redux DevTools
- Monitor query lifecycle: Track query states (pending, fulfilled, rejected)
- Check cache invalidation: Verify tags and cache invalidation are working

### Debugging Best Practices

**Do:**
- ✅ Reproduce the bug consistently before debugging
- ✅ Leverage Redux DevTools for state inspection and time-travel
- ✅ Test reducers, selectors, and actions in isolation
- ✅ Write regression tests after fixing bugs

**Don't:**
- ❌ Debug without reproducing the bug first
- ❌ Mutate state directly (always use actions and reducers)
- ❌ Skip writing tests after fixing bugs

For detailed debugging strategies, see [Standard Version](./technology-maintenance.md#debugging-strategies).

---

## Related Documentation

- **For detailed patterns and examples**: [Standard Version](./technology-maintenance.md)
- **For comprehensive examples and complete reference**: [Extensive Version](./technology-maintenance-extensive.md)

[↑ Back to Top](#table-of-contents)
