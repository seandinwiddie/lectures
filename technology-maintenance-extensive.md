# FP Maintenance Strategy (Extensive)

This document provides comprehensive guidelines for maintaining the codebase using functional programming (FP) principles combined with Redux Toolkit (RTK) and RTK Query. It serves as the comprehensive reference for architectural decisions, coding patterns, testing strategies, and best practices across the **entire application stack**—frontend, backend, and database.

> **MODERNIZATION NOTE (2026):**
> This document is being updated to align with the **Functional Programming with AI Quickstart Guide**.
> consistently check `fp-quickstart/pages` for the latest patterns on:
> *   **Effect Ecosystem & Branded Types** (Foundation)
> *   **Agentic Workflows** (MCP, Antigravity, & Roles)
> *   **React 19 Compiler Architecture** (Purity over Memoization)
> *   **Property-Based Testing** (PBT) vs. Example-Based Testing
>
> While the core Redux/Backend patterns here remain valid, the "AI-Assisted" workflow supersedes manual coding practices described in older sections.

Ensure full Storybook coverage for all UI components

Ensure full Playwright E2E test coverage.

Ensure full Maestro E2E test coverage.

Implement comprehensive test suite with TDD/BDD coverage for all layers.

Run all stories and tests to ensure they are working correctly.


##
##






##
The Redux design pattern is an implementation of the Flux architecture and incorporates concepts from functional programming, the Command pattern, and the Elm Architecture. It is primarily known by its own name, "Redux pattern," but is related to other established software design principles. [1, 2, 3]  
Key alternative or related names and concepts include: 

• Flux architecture: Redux is often described as an alternative, more streamlined implementation of Facebook's original Flux pattern, with the key difference being a single store in Redux versus multiple stores in Flux. 
• The Elm Architecture (TEA): The core concept of an updater function () that returns a new state is directly inspired by Elm's Model-View-Update architecture. 
• Command pattern: The actions dispatched in Redux can be viewed as an implementation of the command pattern, which describes an intention to change the state. 
• Observer pattern: Internally, Redux uses the observer pattern so that subscribed UI components are notified of any state changes when the store is updated. 
• State Reducer pattern or Fold: The core mechanism of a reducer function, which takes the previous state and an action to produce a new state, is known in functional programming as a "fold" or "reducer". 
• Unidirectional data flow: The entire process follows a strict, one-way data flow, which is a fundamental characteristic of the pattern and a key difference from traditional MVC architectures. 
• Event-driven programming or Message-passing: The pattern popularizes the idea of managing application state through events (actions). 
• Singleton Pattern: The application's state is stored in a single, global store, which is an application of the singleton pattern. [1, 2, 4, 5, 6, 7, 8, 9]  

AI responses may include mistakes.

[1] https://dev.to/davidkpiano/redux-is-half-of-a-pattern-1-2-1hd7
[2] https://redux.js.org/understanding/history-and-design/prior-art
[3] https://www.freecodecamp.org/news/all-the-fundamental-react-js-concepts-jammed-into-this-single-medium-article-c83f9b53eac2/
[4] https://stackoverflow.com/questions/42374194/redux-and-design-patterns
[5] https://drpicox.medium.com/redux-and-doman-driven-development-29f818f60f2f
[6] https://softwareengineering.stackexchange.com/questions/399618/what-do-you-call-the-state-reducer-pattern-used-by-redux
[7] https://www.freecodecamp.org/news/how-data-flows-in-redux/
[8] https://engineering.zalando.com/posts/2016/08/design-patterns-redux.html
[9] https://www.thisdot.co/blog/introduction-to-redux-pattern


##



> **Note:** This is the extensive version with comprehensive examples and complete reference material. For a quick reference checklist, see [Condensed Version](./technology-maintenance-condensed.md). For detailed patterns and examples, see [Standard Version](./technology-maintenance.md).

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

>
> **CRITICAL TESTING RULE: NO MOCKING - REAL BACKEND ONLY**
> - **NEVER** mock Redux slices, selectors, or component logic.
> - **NEVER** mock internal functions to make a test "pass".
> - **NEVER** mock API responses (no MSW, no jest.mock for network).
> - All tests must use the **Real Redux Store** and hit the **Real Backend**.
> - Start the backend before running component tests: `cd backend && npm run dev`
> - "Getting the test to pass" by mocking is a failure. The goal is to verify the app works.

## Purpose

This maintenance guide ensures consistent, maintainable, and scalable code across all layers by:

- **Enforcing Functional Programming Principles**: Using pure functions, immutability, and explicit state management throughout frontend, backend, and database layers
- **Standardizing on Redux Toolkit**: RTK and RTK Query are the definitive choice for all frontend state management and data fetching, replacing manual Redux patterns and reactive programming libraries
- **Maintaining Clear Separation of Concerns**: Frontend components are presentational only; all business logic lives in pure reducers within feature slices
- **Applying FP Patterns to Backend**: CQRS, event sourcing, and pure function patterns for backend services and command/query handlers
- **Database-First FP Approach**: Immutable migrations, pure query functions, and functional composition patterns for PostgreSQL/Nile multi-tenant databases
- **Comprehensive Testing Strategy**: TDD/BDD approaches with Given-When-Then scenarios for all layers
- **Systematic Debugging**: Tools and strategies for debugging frontend Redux state, backend services, and database queries
- **Providing Actionable Guidelines**: Clear refactoring rules, checklists, and patterns for day-to-day development across the stack

## Scope

This guide covers the complete application architecture:

### Frontend (React + Redux Toolkit)
- **State Management**: Redux Toolkit's `createSlice` for all client-side state with built-in Immer integration
- **Data Fetching**: RTK Query for all server state, caching, and synchronization
- **Components**: Strictly presentational UI components that dispatch actions and consume state via selectors
- **Business Logic**: All business rules, validation, and transformations in pure reducer functions
- **Selectors**: Co-located memoized selectors using `createSelector` for derived state

### Backend (Node.js + Express)
- **CQRS Pattern**: Command-Query Responsibility Segregation separating state-changing operations from read operations
- **Event Sourcing**: Immutable event store for complete audit trail and time-travel debugging
- **Pure Functions**: Command handlers, query handlers, and event handlers as pure, testable functions
- **Domain-Driven Design**: DDD aggregates with clear consistency boundaries
- **Endpoint Structure**: SQL-structured endpoints following `/endpoint/basic/{operation}/{entity}` pattern

### Database (PostgreSQL + Nile)
- **Multi-Tenant Architecture**: Tenant isolation using `tenant_id` in all queries and schema design
- **Immutable Migrations**: Version-controlled schema changes with up/down migrations
- **Query Optimization**: Index strategies, query performance analysis, and connection pooling
- **Functional SQL**: Pure query functions, function composition, and deterministic operations
- **Row-Level Security**: Nile-managed RLS for automatic tenant isolation

### Testing (TDD/BDD)
- **Test-Driven Development**: Red-Green-Refactor cycle for all code
- **Behavior-Driven Development**: Given-When-Then scenarios for user stories
- **Frontend Testing**: Reducer testing, RTK Query endpoint testing with real test backend, component testing
- **Backend Testing**: Pure function testing, integration testing, event replay testing
- **Database Testing**: Unit tests for query functions, migration testing, data integrity testing

### Debugging
- **Redux DevTools**: Time-travel debugging, state inspection, action history
- **Systematic Approaches**: Reproduce, isolate, analyze, and document bugs
- **Layer-Specific Debugging**: Frontend Redux state, RTK Query cache, backend services, database queries

## Core Approach

The codebase follows a **reducer-first, FP-aligned architecture** across all layers:

### Frontend Architecture
- **State Management**: Redux Toolkit's `createSlice` handles all client-side state with built-in Immer integration for safe immutable updates
- **Data Fetching**: RTK Query manages all server state, caching, and synchronization with automatic background refetching
- **Business Logic**: All business rules, validation, and transformations are implemented as pure reducer functions in feature slices
- **Components**: UI components are strictly presentational, dispatching actions and consuming state via selectors and RTK Query hooks

### Backend Architecture
- **Commands & Queries**: CQRS pattern separates state-changing commands from read-only queries
- **Event Sourcing**: Immutable event store captures all state changes for auditability and replay
- **Pure Handlers**: Command handlers, query handlers, and event handlers are pure functions with predictable inputs/outputs
- **Unidirectional Flow**: Commands → Command Handlers → Events → Event Store → Projections → Query Handlers → Responses

### Database Architecture
- **Immutable Schema**: All schema changes through versioned migrations, never modifying existing migrations
- **Pure Queries**: Database queries as pure, deterministic functions where possible
- **Multi-Tenant Isolation**: All queries scoped by `tenant_id` with Row-Level Security (RLS) managed by Nile
- **Functional Composition**: Complex queries built by composing simple, reusable query functions

## Document Structure

This guide is organized to support both quick reference and deep understanding:

- **[Quick Reference](#quick-reference)**: Checklists and common patterns for immediate use during development across all layers
- **[Core Principles](#core-principles)**: Critical rules for components, business logic, and code organization
- **[Architecture & Patterns](#architecture--patterns)**: Detailed Redux Toolkit patterns, RTK Query usage, FP implementation guidelines, and backend architectural patterns
- **[Testing Strategy](#testing-strategy)**: Comprehensive testing strategies with Given-When-Then scenarios for frontend, backend, and database layers
- **[Redux Toolkit Core Patterns](#redux-toolkit-core-patterns)**: Detailed patterns for createSlice, selectors, RTK Query, and listener middleware
- **[Directory Structure](#directory-structure)**: Feature-based organization, frontend file structure, and backend endpoint/service patterns
- **[Database Maintenance](#database-maintenance)**: PostgreSQL/Nile multi-tenant database patterns, migration management, query optimization, and FP-aligned SQL practices
- **[Backend Architecture](#backend-architecture)**: CQRS, event sourcing, DDD aggregates, message queues, and Redux principles applied to backend
- **[Implementation Strategy](#implementation-strategy)**: Gradual migration paths and when to use each pattern
- **[Implementation Roadmap](#implementation-roadmap)**: Step-by-step implementation roadmap for frontend Redux store, components, APIs, and backend services
- **[Debugging Strategies](#debugging-strategies)**: Systematic approaches for troubleshooting Redux state, RTK Query cache, backend services, and database queries

## Getting Started

**New to this codebase?** 
- Start with the [Quick Reference](#quick-reference) section for immediate guidance
- Review [Core Principles](#core-principles) to understand fundamental rules across all layers
- Explore [Architecture & Patterns](#architecture--patterns) for detailed implementation patterns
- For a quick checklist, see [Condensed Version](./technology-maintenance-condensed.md)

**Refactoring existing code?** 
- Use the refactoring checklists in [Quick Reference](#quick-reference)
- Follow explicit refactoring rules in [Core Principles](#core-principles)
- Consult layer-specific sections (Frontend: [Redux Toolkit Core Patterns](#redux-toolkit-core-patterns), Backend: [Backend Architecture](#backend-architecture), Database: [Database Maintenance](#database-maintenance))
- For a standard reference, see [Standard Version](./technology-maintenance.md)

**Implementing new features?** 
- Review [Redux Toolkit Core Patterns](#redux-toolkit-core-patterns) for Redux Toolkit patterns
- Consult [Directory Structure](#directory-structure) for organization guidelines
- Follow [Implementation Roadmap](#implementation-roadmap) for step-by-step guidance
- Write tests first using [Testing Strategy](#testing-strategy) approaches

**Debugging issues?**
- Start with [Debugging Strategies](#debugging-strategies) for systematic approaches
- Use Redux DevTools for frontend state issues
- Apply layer-specific debugging techniques for backend and database

## Related Documentation

- **For quick reference checklist**: [Condensed Version](./technology-maintenance-condensed.md)
- **For detailed patterns and examples**: [Standard Version](./technology-maintenance.md)

## Table of Contents

### Quick Reference
- [Quick Reference](#quick-reference)
  - [Priority 1: Critical Rules](#priority-1-critical-rules-check-first)
  - [Priority 2: Architecture Patterns](#priority-2-architecture-patterns)
  - [Priority 3: Code Quality](#priority-3-code-quality)
  - [Common Code Smells](#common-code-smells-to-identify)
  - [Refactoring Checklist Format](#refactoring-checklist-format)

### Core Principles
- [Core Principles](#core-principles)
  - [Components are Presentational ONLY](#components-are-presentational-only)
  - [Business Logic in Pure Reducers](#business-logic-in-pure-reducers)
  - [Explicit Refactoring Rules](#explicit-refactoring-rules-for-components-and-business-logic)
- [Architecture & Patterns](#architecture--patterns)
  - [Resources](#resources)
  - [Guiding Principles](#guiding-principles)
  - [Redux's Three Core Principles](#reduxs-three-core-principles-fp-aligned)
  - [Why RTK and RTK Query Over Alternatives](#why-rtk-and-rtk-query-over-alternatives)
  - [RTK Query Patterns and Best Practices](#rtk-query-patterns-and-best-practices)
  - [Listener Middleware for Reactive Side Effects](#listener-middleware-for-reactive-side-effects)
  - [Modern Redux Architecture Priorities](#modern-redux-architecture-priorities)
  - [FP Implementation Guidelines](#fp-implementation-guidelines)

### Testing
- [Testing Strategy](#testing-strategy)
  - [Introduction to TDD and BDD](#introduction-to-tdd-and-bdd)
  - [Why BDD with User Stories?](#why-bdd-with-user-stories)
  - [Relationship to Functional Programming and Redux](#relationship-to-functional-programming-and-redux)
  - [TDD Red-Green-Refactor Cycle](#tdd-red-green-refactor-cycle)
  - [BDD Given-When-Then Structure](#bdd-given-when-then-structure)
  - [Integration with Redux Toolkit Testing](#integration-with-redux-toolkit-testing)
  - [Explicit Refactoring Rules for TDD and BDD](#explicit-refactoring-rules-for-tdd-and-bdd)
  - [Backend Testing Best Practices](#backend-testing-best-practices)
  - [Converting User Stories to BDD Scenarios](#converting-user-stories-to-bdd-scenarios)
  - [BDD Best Practices](#bdd-best-practices)
  - [TDD Best Practices](#tdd-best-practices)


### Redux Toolkit Patterns
- [Redux Toolkit Core Patterns](#redux-toolkit-core-patterns)
  - [createSlice Patterns](#createslice-patterns)
  - [Fat Reducers, Thin Actions Pattern](#fat-reducers-thin-actions-pattern)
  - [createAsyncThunk Patterns](#createasyncthunk-patterns)
  - [Explicit Refactoring Rules for Redux Toolkit Patterns](#explicit-refactoring-rules-for-redux-toolkit-patterns)
  - [createEntityAdapter for Normalized State](#createentityadapter-for-normalized-state)
  - [createListenerMiddleware for Reactive Side Effects](#createlistenermiddleware-for-reactive-side-effects)
  - [configureStore Advanced Configuration](#configurestore-advanced-configuration)
  - [Selector Placement and Co-location](#selector-placement-and-co-location)
  - [Selector Patterns with createSelector](#selector-patterns-with-createselector)

### Directory Structure
- [Directory Structure](#directory-structure)
  - [Feature Module Structure](#feature-module-structure)
  - [Key Principles](#key-principles)
  - [Feature Folders with Single-File Logic](#feature-folders-with-single-file-logic-the-recommended-redux-pattern)
- [Backend Directory Structure](#backend-directory-structure)
  - [Endpoint Structure Pattern](#endpoint-structure-pattern)
  - [Service Module Structure](#service-module-structure)
  - [Key Principles](#key-principles-1)

### Database Maintenance
- [Database Maintenance](#database-maintenance)
  - [Functional Programming with SQL](#functional-programming-with-sql)
  - [Schema Design Patterns](#schema-design-patterns)
  - [Migration Management](#migration-management)
  - [Query Optimization](#query-optimization)
  - [Multi-Tenant Database Patterns](#multi-tenant-database-patterns)
  - [Database Testing](#database-testing)
  - [Database Maintenance Checklist](#database-maintenance-checklist)

### Backend Architecture
- [Backend Architecture](#backend-architecture)
  - [Redux Principles Applied to Backend](#redux-principles-applied-to-backend)
  - [Architectural Patterns](#architectural-patterns)
- [Command-Query Responsibility Segregation (CQRS)](#command-query-responsibility-segregation-cqrs)
  - [Core Concepts](#core-concepts)
  - [Command Handlers](#command-handlers)
  - [Query Handlers](#query-handlers)
  - [Benefits of CQRS](#benefits-of-cqrs)
  - [Mapping to Current Endpoint Structure](#mapping-to-current-endpoint-structure)
- [Event Sourcing](#event-sourcing)
  - [Core Concepts](#core-concepts-1)
  - [Event Sourcing Pattern](#event-sourcing-pattern)
  - [Event Versioning](#event-versioning)
  - [Integration with Audit Logs](#integration-with-audit-logs)
  - [Benefits of Event Sourcing](#benefits-of-event-sourcing)
  - [Challenges and Considerations](#challenges-and-considerations)
- [Functional Programming for Backend](#functional-programming-for-backend)
  - [Core Principles](#core-principles)
  - [Functional Programming Patterns](#functional-programming-patterns)
  - [Benefits of Functional Programming](#benefits-of-functional-programming)
- [Message Queues and Event Buses](#message-queues-and-event-buses)
  - [Core Concepts](#core-concepts-2)
  - [Event Bus Pattern](#event-bus-pattern)
  - [Message Queue Pattern](#message-queue-pattern)
  - [Integration Patterns](#integration-patterns)
  - [Benefits](#benefits)
  - [Implementation Considerations](#implementation-considerations)
- [Domain-Driven Design (DDD) Aggregates](#domain-driven-design-ddd-aggregates)
  - [Core Concepts](#core-concepts-3)
  - [Aggregate Pattern](#aggregate-pattern)
  - [Mapping to Services](#mapping-to-services)
  - [Benefits](#benefits-1)
  - [Aggregate Design Guidelines](#aggregate-design-guidelines)
- [Redux-Backend Pattern Mapping](#redux-backend-pattern-mapping)
  - [Detailed Mappings](#detailed-mappings)
  - [Benefits of This Mapping](#benefits-of-this-mapping)
  - [Backend Testing Requirements](#backend-testing-requirements)

### Implementation
- [Implementation Strategy](#implementation-strategy)
  - [Gradual Migration Path](#gradual-migration-path)
  - [When to Use Each Pattern](#when-to-use-each-pattern)
  - [Trade-offs and Considerations](#trade-offs-and-considerations)
  - [Migration Best Practices](#migration-best-practices)
  - [Recommended Approach](#recommended-approach)
- [Implementation Roadmap](#implementation-roadmap)
  - [Redux Store Foundation](#1-redux-store-foundation)
  - [Maintain Core Utilities](#2-maintain-core-utilities-with-reducer-first-approach)
  - [Maintain Entry Points](#3-maintain-entry-points-and-application-initialization-with-rtk-query-integration)
  - [Maintain Components](#4-maintain-components-with-reducer-based-state)
  - [Enhance APIs](#5-enhance-apis-with-rtk-query-advanced-patterns-and-features-with-reducer-patterns)
  - [Monitoring and Logging](#6-monitoring-and-logging-with-reducer-architecture)
  - [Testing and Validation](#7-testing-and-validation-with-tdd-and-bdd)
  - [Edge Cases and Refinements](#8-edge-cases-and-refinements-with-rtk-query-advanced-patterns)

### Debugging
- [Debugging Strategies](#debugging-strategies)
  - [Before You Begin Debugging](#before-you-begin-debugging)
  - [Systematic Debugging Approach](#systematic-debugging-approach)
  - [Redux-Specific Debugging](#redux-specific-debugging)
  - [After Finding the Bug](#after-finding-the-bug)
  - [Debugging Best Practices Summary](#debugging-best-practices-summary)
  - [Debugging Resources](#debugging-resources)

---

## Quick Reference

**Use this section as a quick checklist when refactoring code. Apply these rules systematically to identify and fix violations.**

### Priority 1: Critical Rules (Check First)

**IF** a component contains business logic (validation, calculations, transformations, workflows)
**THEN** move all business logic to a pure reducer function in the appropriate `features/[domain]/slice/[feature]Slice.ts` file
**AND** have the component dispatch actions instead of implementing logic directly

**IF** a component uses `useEffect` + `fetch` for data fetching
**THEN** replace with RTK Query hooks (`useGetQuery`, `useMutation`) from an API slice
**AND** remove manual fetch logic and state management

**IF** a component uses `useState`, `useReducer`, or any local state (including UI state like `isModalOpen`, `isDropdownExpanded`)
**THEN** move ALL state to Redux slices (use `features/core/ui/slice/uiSlice.ts` for UI state)
**AND** replace local state management with Redux actions and selectors
**AND** components dispatch actions to update state
**AND** components read state via selectors

**IF** a component contains mount logging, component state logging, or debugging with `useEffect`
**THEN** remove logging from component
**AND** use `redux-logger` middleware for all state change logging
**AND** all logging goes through Redux middleware, not component hooks

**IF** manual data fetching exists (thunks, sagas, or direct API calls)
**THEN** convert to RTK Query endpoints in `features/core/api/` or feature-specific API slices
**AND** use RTK Query's built-in caching and invalidation

**IF** business logic exists in utility files or services
**THEN** move logic to pure reducer functions in Redux slices
**AND** keep utilities for pure, stateless helper functions only

### Priority 2: Architecture Patterns

**IF** a file contains multiple unrelated functions
**THEN** split into separate files (one function per file, except Redux slices)
**AND** maintain single responsibility principle

**IF** a Redux slice file is missing selectors
**THEN** add selectors co-located in the same slice file
**AND** export selectors alongside action creators

**IF** state management uses non-RTK patterns (manual Redux, context, ANY component state including UI state)
**THEN** migrate to Redux Toolkit `createSlice` for ALL state management
**AND** use RTK Query for server state
**AND** use Redux slices for ALL client-side state including UI state

**IF** side effects are handled in reducers or components
**THEN** move to RTK Query endpoints (for data fetching) or listener middleware (for reactive side effects)
**AND** keep reducers pure

### Priority 3: Code Quality

**IF** a component mixes UI logic with business logic
**THEN** separate into presentational component and business logic in reducers
**AND** use action dispatching for all state changes

**IF** test files are missing for slices, utilities, or components
**THEN** add test files following TDD/BDD patterns with Given-When-Then structure
**AND** test reducers as pure functions with predictable inputs/outputs

**IF** files are large (>300 lines) or contain multiple responsibilities
**THEN** split into smaller, focused files
**AND** maintain feature-based organization

### Common Code Smells to Identify

- ❌ Business logic in components (validation, calculations, transformations)
- ❌ Manual data fetching (`fetch`, `axios` in components or thunks)
- ❌ State management outside Redux (ANY component state, including UI state like modals, dropdowns)
- ❌ Component state using `useState` or `useReducer` (ALL state must be in Redux)
- ❌ Mount logging or debugging in components using `useEffect` (use redux-logger middleware)
- ❌ Missing selectors for state access
- ❌ Side effects in reducers
- ❌ Large files with multiple responsibilities
- ❌ Missing tests for business logic
- ❌ Non-RTK patterns (manual Redux, sagas, observables for data fetching)

### Refactoring Checklist Format

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

The codebase should be lean and modular. Maintain separation of concerns with component and slice design. Use multiple command dispatchers for different parts of the application. Keep files small and focused. Try not to have too many functions (preferably only one) in a single file. Keep boilerplate logic separate from business logic. Keep business logic in separate files. Do not consolidate business logic into a single files.

### 1. **Lean and Modular Codebase**
- **Lean**: Avoid unnecessary code, duplication, or bloat. Every file and function should have a clear, necessary purpose.
- **Modular**: Break the application into small, independent modules. Each module should encapsulate a single responsibility or feature.

**When Refactoring:**
- **IF** a file contains multiple unrelated responsibilities
- **THEN** split into separate files, each with a single responsibility
- **AND** ensure each file has a clear, necessary purpose
- **IF** code is duplicated across multiple files
- **THEN** extract to a shared utility function or hook
- **AND** ensure the extracted code is pure and reusable

**Lean and Modular Checklist:**
- [ ] Each file has a single, clear responsibility
- [ ] No code duplication (DRY principle)
- [ ] Modules are independent and can be tested in isolation
- [ ] Files are small and focused (&lt;300 lines preferred)
- [ ] Unnecessary code has been removed

### 2. **Separation of Concerns**
- **Component and Slice Design**: UI components should focus on rendering and user interaction, while Redux slices (state logic) should handle ALL state and business rules.
- **No Mixing**: Don't mix UI logic with business logic or state management in the same file.
- **CRITICAL RULE - Components are Presentational ONLY (Zero State)**: Components in `components/` must contain **ONLY presentational logic** (rendering, styling, user interaction handlers). **NO business logic, NO component state, NO logging** is allowed in components. All business logic, validation, data transformations, state management (including UI state), and logging must live in Redux slices or middleware within `features/`.
- **CRITICAL RULE - ALL State in Redux**: **ALL state** (business state, UI state like modals/dropdowns, form state, etc.) must be managed in Redux slices. Components are zero-state - they only render props and dispatch actions.
- **CRITICAL RULE - Business Logic in Reducers**: **ALL business logic** must be implemented as pure reducer functions in Redux slices within `features/`. This includes validation rules, business workflows, data transformations, calculations, and any logic that determines application behavior beyond simple UI rendering.
- **CRITICAL RULE - Logging Through Middleware**: All logging (mount logging, state change logging, debugging) must go through Redux middleware (redux-logger), not component hooks.

### 3. **Multiple Command Dispatchers**
- **Purpose**: Use different command dispatchers (handlers for actions/commands) for different domains (e.g., user management, content, analytics).
- **Benefit**: This keeps each dispatcher focused and easier to maintain or extend.

### 4. **Small, Focused Files**
- **Single Responsibility**: Each file should do one thing (e.g., a single slice, a single component, a single utility function).
- **Easier Maintenance**: Small files are easier to read, test, and refactor.

**When Refactoring:**
- **IF** a file exceeds 300 lines or contains multiple responsibilities
- **THEN** split into smaller, focused files
- **AND** maintain feature-based organization
- **IF** a file mixes concerns (e.g., UI + business logic, setup + implementation)
- **THEN** separate concerns into different files
- **AND** keep related code co-located within feature folders

**Small Files Checklist:**
- [ ] Files are under 300 lines (preferred)
- [ ] Each file has a single responsibility
- [ ] Related files are co-located in feature folders
- [ ] File names clearly indicate their purpose

### 5. **Limit Functions per File**
- **Preferably One Function per File**: This enforces clarity and makes it easy to locate and test logic.
- **Exception**: Utility files may have a few related helpers, but avoid large collections of unrelated functions.
- **Redux Slice Exception**: Redux recommends consolidating all Redux logic (reducers, actions) for a feature into a single slice file using `createSlice`. This follows the "feature folders with single-file logic" pattern where all Redux-related code for a feature lives in one `[feature]Slice.ts` file. The slice file consolidates reducer logic and automatically generates action creators, reducing boilerplate while keeping related Redux logic together. This applies specifically to Redux state management logic; utility functions should still follow the "one function per file" principle when appropriate.

### 6. **Boilerplate vs. Business Logic**
- **Boilerplate Logic**: Code that sets up infrastructure (e.g., Redux store setup, API base queries, middleware) should be isolated from business rules.
- **Business Logic**: Core application rules (e.g., validation rules, business workflows) should live in their own files, separate from setup or glue code.

**When Refactoring:**
- **IF** business logic is mixed with boilerplate/setup code
- **THEN** separate business logic into reducer functions in slices
- **AND** keep setup code in configuration files
- **IF** business logic exists in utility files
- **THEN** move to appropriate feature slice
- **AND** keep utilities for pure, stateless helper functions only

**Boilerplate vs Business Logic Checklist:**
- [ ] Business logic is in reducers, not setup files
- [ ] Setup/configuration code is separate from business rules
- [ ] Utilities contain only pure, stateless functions
- [ ] Business rules are organized by feature/domain

### 7. **No Consolidation of Business Logic**
- **Don't Centralize**: Avoid putting all business rules in a single file. Instead, distribute them according to feature or domain (e.g., feature-specific logic in separate files).
- **Benefit**: This prevents files from becoming too large and complex, and makes it easier to reason about and test each part of the system.

**Why?**
- **Maintainability**: Easier to update, debug, and onboard new developers.
- **Testability**: Isolated logic is easier to test.
- **Scalability**: Adding new features or domains is straightforward.

**Redux Toolkit (RTK) and RTK Query are the official, modern Redux approach and take absolute priority.**

Try to move logic out of utilities and services into the slices.

## Core Principles

### Components are Presentational ONLY (Zero State)

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
- **ANY component state** (no `useState`, `useReducer`, or local state) - ALL state must go through Redux
- **UI state** (modals, dropdowns, form field focus) - ALL state in Redux slices
- **Mount logging or debugging hooks** (use redux-logger middleware instead)
- **Complex conditional logic** that determines business behavior
- **Workflow or business rule implementations**
- **`useEffect` for business logic**: NEVER use `useEffect` to trigger data fetching, state updates, business workflows, OR animations. `useEffect` is FORBIDDEN. All logic must reside in Redux.

### Component Composition Hierarchy

Adhere to this strict hierarchy to maintain a scalable UI architecture:

1.  **Screens (`screens/`)**:
    -   **NO RAW MARKUP**: Screens should NOT be filled with `<div>`, `<span>`, or other raw HTML/JSX.
    -   **Strict Composition**: Screens must be purely compositions of components from `elements/generic` and `elements/unique`.
    -   **Role**: Screens define the layout and orchestration of high-level elements. They are the canvas, not the paint.

2.  **Unique Elements (`elements/unique/`)**:
    -   **Composed of Generic**: Feature-specific components (e.g., `CampaignDashboard`, `UserProfileCard`).
    -   **Structure**: Should be compositions of `elements/generic` wherever possible.
    -   **Custom Elements**: Use raw markup or custom one-off styles ONLY if absolutely necessary and strongly justified.

3.  **Generic Elements (`elements/generic/`)**:
    -   **Base Building Blocks**: Reusable atoms and molecules (Buttons, Inputs, Cards, Grids, Modals, Typography).
    -   **Source of Truth**: These define the design system and should be used to build EVERYTHING else.

### Business Logic in Pure Reducers

**ALL business logic** must be implemented as pure reducer functions in Redux slices within `features/`:
- Validation rules and validation logic
- Business workflows and state machines
- Data transformations and calculations
- Business rules and decision logic
- Computed state and derived data
- Domain-specific operations

**How Components Interact with Business Logic:**
1. Components dispatch actions (e.g., `dispatch(validateForm(formData))`)
2. Actions trigger pure reducer functions in slices
3. Reducers contain all business logic and return new state
4. Components consume updated state via selectors
5. Components re-render based on state changes

#### UI State Management in Redux

**ALL state must go through Redux**, including UI state like modal open/close, dropdown expanded, form field focus, etc. Components are zero-state - they only render props and dispatch actions.

**UI State Management Pattern:**
- **UI State Slice**: Manage UI state in `features/core/ui/slice/uiSlice.ts`
- **Actions**: Create actions for UI state changes (e.g., `openModal`, `closeModal`, `expandDropdown`, `setFormFieldFocus`)
- **Selectors**: Create selectors for UI state access (e.g., `selectIsModalOpen`, `selectIsDropdownExpanded`)
- **Component Usage**: Components dispatch actions to update UI state and read UI state via selectors

**Example UI Slice:**
```typescript
// features/core/ui/slice/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  modals: Record<string, boolean>;
  dropdowns: Record<string, boolean>;
  focusedFields: Record<string, boolean>;
}

const initialState: UIState = {
  modals: {},
  dropdowns: {},
  focusedFields: {},
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    toggleDropdown: (state, action: PayloadAction<string>) => {
      state.dropdowns[action.payload] = !state.dropdowns[action.payload];
    },
    setFieldFocus: (state, action: PayloadAction<{ fieldId: string; focused: boolean }>) => {
      state.focusedFields[action.payload.fieldId] = action.payload.focused;
    },
  },
});

export const { openModal, closeModal, toggleDropdown, setFieldFocus } = uiSlice.actions;

// Selectors
export const selectIsModalOpen = (state: RootState, modalId: string) => 
  state.ui.modals[modalId] ?? false;
export const selectIsDropdownExpanded = (state: RootState, dropdownId: string) => 
  state.ui.dropdowns[dropdownId] ?? false;
export const selectIsFieldFocused = (state: RootState, fieldId: string) => 
  state.ui.focusedFields[fieldId] ?? false;
```

**Example Component Usage:**
```typescript
// Component using UI state from Redux
import { useSelector, useDispatch } from 'react-redux';
import { openModal, closeModal, selectIsModalOpen } from '@/features/core/ui';

export function MyComponent() {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => selectIsModalOpen(state, 'myModal'));
  
  const handleOpen = () => dispatch(openModal('myModal'));
  const handleClose = () => dispatch(closeModal('myModal'));
  
  return (
    <>
      <button onClick={handleOpen}>Open Modal</button>
      {isModalOpen && <Modal onClose={handleClose}>Content</Modal>}
    </>
  );
}
```

### Explicit Refactoring Rules for Components and Business Logic

**When Refactoring Components:**

**IF** a component contains validation logic (e.g., email format checks, required field validation)
**THEN** create a reducer in the appropriate slice (e.g., `features/[domain]/slice/[feature]Slice.ts`)
**AND** move validation logic to the reducer
**AND** have the component dispatch a validation action instead of validating directly

**IF** a component performs calculations or data transformations (e.g., computing totals, formatting data)
**THEN** move calculations to a reducer or selector
**AND** use `createSelector` for memoized derived state if the calculation is expensive
**AND** have the component consume the computed value via selector

**IF** a component contains workflow logic or business rules (e.g., multi-step processes, conditional flows)
**THEN** implement as a state machine in a reducer
**AND** use actions to transition between states
**AND** have the component dispatch actions and read state, not implement the workflow

**IF** a component uses `useState` or `useReducer` for ANY state (including UI state like `isModalOpen`, `isDropdownExpanded`)
**THEN** move ALL state to Redux slices (use `features/core/ui/slice/uiSlice.ts` for UI state)
**AND** replace local state management with Redux actions and selectors
**AND** components dispatch actions to update UI state (e.g., `dispatch(openModal('modalId'))`)
**AND** components read UI state via selectors (e.g., `useSelector(selectIsModalOpen('modalId'))`)

**IF** a component contains `useEffect` with business logic side effects
**THEN** move side effects to RTK Query endpoints (for data fetching) or listener middleware (for reactive side effects)
**AND** remove `useEffect` from component
**AND** use RTK Query hooks or action dispatching instead

**IF** you are about to write a `useEffect` to "sync state" or "react to props"
**THEN** STOP. This is almost always a sign of bad architecture in Redux.
**AND** move the logic to a reducer or listener middleware.
**AND** ensure the state is single-source-of-truth in Redux, requiring no "syncing".

**When Refactoring Business Logic:**

**IF** business logic exists in utility files or services
**THEN** identify the domain/feature it belongs to
**AND** move logic to a pure reducer function in `features/[domain]/slice/[feature]Slice.ts`
**AND** keep utilities for pure, stateless helper functions only

**IF** business logic is scattered across multiple files
**THEN** consolidate related logic into the appropriate feature slice
**AND** maintain feature-based organization (don't create a single "business logic" file)
**AND** use `extraReducers` for cross-slice coordination if needed

**IF** business logic contains side effects (API calls, localStorage, etc.)
**THEN** separate pure business logic (in reducer) from side effects
**AND** use RTK Query for API calls
**AND** use listener middleware for other side effects

**Component Refactoring Checklist:**
- [ ] No validation logic in components
- [ ] No calculations or transformations in components
- [ ] No workflow or business rule implementations in components
- [ ] No state in `useState` or local `useReducer` (including UI state) - ALL state in Redux
- [ ] UI state (modals, dropdowns, form fields) managed in Redux slices
- [ ] Components dispatch actions to update UI state
- [ ] Components read UI state via selectors
- [ ] No business logic in `useEffect`
- [ ] No mount logging or debugging in components (use redux-logger middleware)
- [ ] All business logic moved to reducers
- [ ] Components only dispatch actions and consume state via selectors

[↑ Back to Top](#table-of-contents)

## Architecture & Patterns

### Resources

**Redux Toolkit Documentation:**
- [Redux Toolkit Overview](https://redux-toolkit.js.org/)
- [Redux Toolkit Getting Started](https://redux-toolkit.js.org/introduction/getting-started)
- [Redux Toolkit Tutorials](https://redux-toolkit.js.org/tutorials/overview)
- [Redux Toolkit API Reference](https://redux-toolkit.js.org/api/configureStore)
- [createSlice API](https://redux-toolkit.js.org/api/createSlice)
- [createAsyncThunk API](https://redux-toolkit.js.org/api/createAsyncThunk)
- [createEntityAdapter API](https://redux-toolkit.js.org/api/createEntityAdapter)
- [createListenerMiddleware API](https://redux-toolkit.js.org/api/createListenerMiddleware)
- [createSelector (Reselect)](https://redux-toolkit.js.org/api/createSelector)

**RTK Query Documentation:**
- [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- [RTK Query Getting Started](https://redux-toolkit.js.org/rtk-query/overview/getting-started)
- [RTK Query API Reference](https://redux-toolkit.js.org/rtk-query/api/createApi)
- [RTK Query Advanced Patterns](https://redux-toolkit.js.org/rtk-query/usage/examples)
- [RTK Query Cache Management](https://redux-toolkit.js.org/rtk-query/usage/cache-behavior)
- [RTK Query Testing](https://redux-toolkit.js.org/rtk-query/usage/server-side-rendering)

**Redux Fundamentals:**
- [Redux FAQ: Code Structure](https://redux.js.org/faq/code-structure)
- [Redux Toolkit Usage Guide](https://redux-toolkit.js.org/usage/usage-guide)
- [Redux Essentials: Part 2 - App Structure](https://redux.js.org/tutorials/essentials/part-2-app-structure)
- [Redux Standard Patterns](https://redux.js.org/tutorials/fundamentals/part-7-standard-patterns)
- [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview)

**Functional Programming Resources:**
- [James Sinclair](https://jrsinclair.com/)
- [Eric Elliott](https://medium.com/javascript-scene/composing-software-the-book-f31c77fc3ddc)
- [Philip Wadler](https://jgbm.github.io/eecs762f19/papers/wadler-monads.pdf)
- [Andre Staltz](https://cycle.js.org/)

### Guiding Principles

#### Redux's Three Core Principles (FP-Aligned)
- **Single Source of Truth**: All application state lives in one Redux store object tree, ensuring predictable state access.
- **State is Read-Only**: State can only be changed by dispatching actions - pure objects describing what happened.
- **Changes are Made with Pure Functions**: Reducers are pure functions that take previous state and an action, returning new state without mutations.

#### Why RTK and RTK Query Over Alternatives
**RTK Query eliminates the need for most hand-written data fetching logic**, replacing complex thunk/saga patterns with purpose-built data fetching and caching solutions. Unlike reactive patterns:

- **RTK Query** provides automatic caching, invalidation, and background refetching out-of-the-box
- **Dedicated API slices per service** with a shared base query reduce complexity and boilerplate compared to observable streams
- **Built-in optimistic updates** and error handling without additional reactive libraries
- **Seamless Redux DevTools integration** for debugging and time-travel
- **TypeScript-first design** with excellent inference and type safety
- **Official Redux team support** ensuring long-term maintenance and best practices

#### RTK Query Patterns and Best Practices

**When Refactoring RTK Query:**
- **IF** multiple API calls use similar base configuration
- **THEN** create a base API slice with shared configuration
- **AND** use `injectEndpoints` to add endpoints to the base slice
- **IF** cache invalidation is inconsistent or missing
- **THEN** implement tag-based cache invalidation
- **AND** use `providesTags` and `invalidatesTags` consistently

#### Base API Slice Configuration

Create a base API slice with shared configuration.

#### Query Endpoints

Use query endpoints for fetching data.

#### Mutation Endpoints

Use mutation endpoints for creating, updating, or deleting data.

#### Tag-Based Cache Invalidation

Use tags to manage cache invalidation.

#### transformResponse and transformErrorResponse

Transform API responses to match your application's data structure.

#### setupListeners for Refetch Behavior

Enable automatic refetching on focus and reconnect.

#### Optimistic Updates

Implement optimistic updates for better UX.

#### Code Splitting with injectEndpoints

Split API endpoints across multiple files.

#### RTK Query Hook Usage in Components

Use generated hooks in components.

#### Listener Middleware for Reactive Side Effects

RTK's `createListenerMiddleware` provides a powerful way to handle side effects reactively based on dispatched actions. It's the recommended approach for side effects that don't belong in reducers.

### 1. **The "Zero React Logic" Rule** (Zero State / Zero Effect)
- **Rule**: ALL React Hooks (`useEffect`, `useState`, `useCallback`, `useMemo`, `useReducer`) are effectively BANNED for application logic.
- **Why**: Hooks introduce implicit logic and side effects into the view layer. All state and logic must reside in Redux to decouple the View from the Model/Controller.
- **Enforcement**: If you find yourself writing any React Hook (except `useSelector` or `useDispatch`), STOP. Move the logic to a Redux Slice, Listener, or Thunk.

#### When to Use Listener Middleware

**Use listener middleware for:**
- Cache invalidation based on actions (e.g., invalidate cache when user logs out)
- Analytics and logging
- Cross-slice coordination
- Side effects that need to react to multiple action types
- Complex conditional logic based on state changes

**Don't use listener middleware for:**
- Business logic (use reducers)
- Data fetching (use RTK Query)
- Simple state updates (use reducers)

#### Basic Listener Middleware Pattern

Use listener middleware to handle reactive side effects based on dispatched actions.

#### Action Matchers

Use matchers to handle multiple action types.

#### Predicate-Based Matching

Use predicates for complex matching logic.

#### Cache Invalidation Pattern

Common pattern for cache invalidation (as used in impersonation middleware).

#### Accessing State and Dispatching Actions

Listeners can access state and dispatch actions.

#### Async Side Effects

Handle async operations in listeners.

#### Conditional Execution

Use `take` for conditional execution.

#### Listener Middleware in Store Configuration

Add listener middleware to store.

#### Modern Redux Architecture Priorities
1. **RTK Query First**: Use RTK Query for all data fetching, caching, and server state synchronization
2. **RTK Slices**: Use createSlice for client-side state management with built-in Immer integration
3. **Avoid Legacy Patterns**: No hand-written thunks, sagas, or observables for data fetching
4. **Functional Purity**: Maintain pure reducer functions while leveraging RTK's built-in middleware for side effects

#### FP Implementation Guidelines
- **Functions Only**: Use functions for everything, including factories returning objects with methods (closures for private state).
- **Immutability**: Use Redux Toolkit's createReducer and createSlice with built-in Immer integration for safe "mutations".
- **Purity**: Reducers must be pure functions; isolate side effects in RTK Query endpoints and createAsyncThunk.
- **Unidirectional Data Flow**: Actions dispatched → Reducers update state → UI re-renders → User interactions → Actions dispatched.
- **Reducer-Centric Architecture**: All state changes flow through pure reducer functions using createSlice and createReducer from RTK.
- **Components are Presentational ONLY**: Components must contain **ONLY presentational logic** (rendering, styling, event handlers that dispatch actions). **ZERO business logic** in components. All business logic belongs in pure reducers within `features/` slices.
- **Business Logic in Pure Reducers**: **ALL business logic** (validation, calculations, transformations, workflows, business rules) must be implemented as pure reducer functions in `features/` slices. Components consume state via selectors and dispatch actions; they never contain business logic.
- **Predictable State Updates**: Use action creators and typed actions to make state changes explicit and traceable.
- **Events**: Use Redux actions dispatched through the store for centralized event handling, with RTK listener for reactivity.
- **Async Operations**: Use createAsyncThunk from RTK for async logic; leverage RTK Query for data fetching and caching.
- **Tools**: Prioritize RTK's createSlice, createAsyncThunk, RTK Query, createEntityAdapter, and createSelector. Use RTK's built-in features for reactivity.

[↑ Back to Top](#table-of-contents)

## Testing Strategy

This section outlines Test-Driven Development (TDD) and Behavior-Driven Development (BDD) practices for the codebase, with a focus on BDD and user story-driven development. These practices ensure high-quality, maintainable code that aligns with business requirements and user needs.

### Introduction to TDD and BDD

**Test-Driven Development (TDD)** is a software development approach where tests are written before the implementation code. The TDD cycle follows three steps:
1. **Red**: Write a failing test that describes the desired functionality
2. **Green**: Write the minimal code necessary to make the test pass
3. **Refactor**: Improve the code structure while keeping tests passing

**Behavior-Driven Development (BDD)** extends TDD by focusing on the behavior of the system from the user's perspective. BDD uses a common language (Gherkin syntax) to describe scenarios in a format that both technical and non-technical stakeholders can understand. BDD emphasizes:
- Collaboration between developers, testers, and business stakeholders
- Clear, readable scenarios that serve as living documentation
- User-centric behavior descriptions rather than technical implementation details

### Why BDD with User Stories?

BDD with user stories provides several key benefits:

- **Improved Communication**: BDD scenarios use plain language that all team members can understand, bridging the gap between technical and non-technical stakeholders
- **Reduced Ambiguity**: Clear scenarios with Given-When-Then structure minimize assumptions and guesswork
- **Living Documentation**: BDD scenarios act as executable specifications that remain up-to-date as the system evolves
- **User-Centric Development**: Focusing on user stories ensures features deliver real value to end users
- **Better Test Coverage**: BDD encourages thinking about edge cases and different scenarios upfront

### Relationship to Functional Programming and Redux

TDD and BDD align perfectly with functional programming principles and Redux architecture:

- **Pure Functions**: Reducers are pure functions, making them ideal for TDD - predictable inputs and outputs
- **Testability**: Functional programming's emphasis on pure functions and immutability makes code highly testable
- **Redux State Management**: Redux's predictable state updates through actions and reducers map naturally to BDD scenarios (Given initial state, When action dispatched, Then new state)
- **RTK Query**: RTK Query endpoints can be tested with BDD scenarios describing API interactions
- **Component Testing**: Presentational components can be tested with BDD scenarios focusing on user interactions

### TDD Red-Green-Refactor Cycle

The TDD cycle is a disciplined approach to writing code:

#### Red Phase: Write a Failing Test

Write a test that describes the desired functionality. This test should fail initially because the functionality doesn't exist yet.

#### Green Phase: Write Minimal Code to Pass

Write only the code necessary to make the test pass. Avoid over-engineering at this stage.

#### Refactor Phase: Improve Code Quality

Once the test passes, refactor the code to improve structure, readability, and maintainability while keeping all tests green.

### BDD Given-When-Then Structure

BDD scenarios use Gherkin syntax with three main keywords:

- **Given**: Describes the initial state or pre-condition of the system
- **When**: Describes the action or event that triggers the behavior
- **Then**: Describes the expected outcome or result

Additional keywords:
- **And**: Used to continue a Given, When, or Then clause
- **But**: Used to express a negative condition in a Then clause

### Integration with Redux Toolkit Testing

TDD and BDD integrate seamlessly with Redux Toolkit testing patterns:

- **Redux Slices**: Test reducers with BDD scenarios describing state transformations
- **RTK Query**: Test API endpoints with scenarios describing data fetching and caching behavior
- **Components**: Test presentational components with scenarios describing user interactions
- **Middleware**: Test listener middleware with scenarios describing side effects

### Explicit Refactoring Rules for TDD and BDD

**When Refactoring Tests:**

**IF** a slice file exists without a corresponding test file
**THEN** create a test file following the pattern `[feature]Slice.test.ts` in the same directory
**AND** write BDD-style tests with Given-When-Then structure
**AND** test all reducers as pure functions with predictable inputs/outputs

**IF** tests don't follow BDD structure (Given-When-Then)
**THEN** refactor tests to use BDD format with clear Given-When-Then comments
**AND** use descriptive test names that read like specifications
**AND** organize tests by scenarios, not by implementation details

**IF** tests contain business logic or complex setup
**THEN** extract test setup to helper functions or fixtures
**AND** keep tests focused on behavior, not implementation
**AND** use factories or builders for test data creation

**IF** tests are missing for business logic in reducers
**THEN** add comprehensive test coverage for all reducer functions
**AND** test both happy paths and error cases
**AND** test edge cases and boundary conditions

**When Refactoring Test Structure:**

**IF** test files are organized by file structure rather than by feature/domain
**THEN** reorganize tests to match feature-based organization
**AND** co-locate test files with the code they test (e.g., `slice/__tests__/[feature]Slice.test.ts`)
**AND** maintain test structure that mirrors code structure

**IF** tests use implementation details (e.g., testing internal state, private methods)
**THEN** refactor tests to focus on behavior and public APIs
**AND** test through actions and selectors, not direct state access
**AND** verify outcomes, not implementation steps

**IF** RTK Query endpoints are missing tests
**THEN** create test files for API slices using `setupApiStore` helper
**AND** test query endpoints against a real test backend with seeded data
**AND** test cache invalidation and optimistic updates

**TDD/BDD Refactoring Checklist:**
- [ ] All slice files have corresponding test files
- [ ] Tests use BDD Given-When-Then structure
- [ ] Test names are descriptive and behavior-focused
- [ ] Tests are organized by feature/domain
- [ ] Tests focus on behavior, not implementation
- [ ] All reducers are tested as pure functions
- [ ] Error cases and edge cases are covered
- [ ] RTK Query endpoints have tests
- [ ] Test setup is extracted to helpers/fixtures
- [ ] Tests are independent and can run in any order

### Backend Testing Best Practices

> [!IMPORTANT]
> **Core Principle: If a test does not catch a runtime issue, the test is wasteful.**

Backend tests must validate real behavior, not just function call counts. A test that passes with mocked logic but fails at runtime provides false confidence and slows development.

#### No Mocking Principle

**Never mock your own code.** Run tests against real services in a test environment (local containers or staging) and seed data through real code paths.

**What to Keep Real (everything you own):**
- Validation functions (test actual validation logic)
- Data transformation functions (test actual transformations)
- Business logic helpers (test actual business rules)
- Error response creation (test actual error formatting)
- CQRS command/query handlers (test real database operations)
- API endpoints (test real HTTP handling)

**Only acceptable mocks:**
- Express `req`/`res` objects for endpoint unit tests (structural, not behavioral)
- Third-party external services when absolutely necessary (payment APIs, email services)

#### Backend Test Pattern

```typescript
// ✅ CORRECT: Test against real services with seeded data
import { seedTestUser, cleanupTestData } from '../test-fixtures';

beforeEach(async () => {
  await seedTestUser({ email: 'test@example.com', name: 'Test' });
});

afterEach(async () => {
  await cleanupTestData();
});

it('should reject invalid email', async () => {
  // Arrange - invalid data will be caught by REAL validation
  const invalidData = { email: 'not-an-email', name: 'Test' };
  const response = await request(app).post('/api/users').send(invalidData);

  // Assert - validation error was returned
  expect(response.status).toBe(400);
  expect(response.body.error).toContain('email');
});
```

```typescript
// ❌ WRONG: Mocking defeats the purpose of testing
jest.mock('../../validation/users', () => ({
  validateUserData: jest.fn().mockReturnValue({ ok: false, error: 'Invalid' })
}));
// This test passes but doesn't verify real validation logic works
```

#### Backend Test Checklist

- [ ] Tests run against real services (local containers or test environment)
- [ ] Data is seeded through real code paths
- [ ] Real validation functions are exercised
- [ ] Real transformation functions are exercised
- [ ] No mocking of your own code
- [ ] Both success and error paths are tested
- [ ] Edge cases are covered (empty data, missing fields, invalid formats)
- [ ] Tests would catch runtime issues (not just compile-time)

### Converting User Stories to BDD Scenarios

Converting user stories to BDD scenarios is a systematic process that ensures clear, testable requirements. This process bridges the gap between business requirements and technical implementation.

#### Step 1: Write a Standard User Story

Start with a user story that outlines the feature's purpose and value. Use the standard template:

**User Story Template:**
- **As a** [user role]
- **I want to** [perform an action]
- **So that** [I can achieve a benefit]

**Example User Story:**
- **As a** customer
- **I want to** view my order history
- **So that** I can track my past purchases and reorder items easily

#### Step 2: Identify Scenarios and Acceptance Criteria

Brainstorm different scenarios that can arise from the user story, including:
- **Happy path**: The primary, expected user flow
- **Edge cases**: Boundary conditions and unusual inputs
- **Error scenarios**: What happens when things go wrong
- **Alternative flows**: Different paths users might take

For each scenario, define acceptance criteria using Gherkin syntax.

#### Step 3: Create Executable BDD Scenarios

Combine Gherkin steps to form complete scenarios. You can have multiple Given, When, and Then steps to describe complex flows.

#### Step 4: Use Example Tables for Data-Driven Scenarios

For scenarios with multiple inputs or variations, use example tables to show different outcomes clearly.

#### Step 5: Add Edge Cases and Error Scenarios

Include scenarios for error conditions and edge cases.

#### Step 6: Maintain Story Narrative

Keep the original user story narrative visible to remind everyone of the "why" behind the feature. This helps maintain focus on delivering value to users.

### BDD Best Practices

Following BDD best practices ensures effective collaboration, clear communication, and maintainable test scenarios.

#### Collaborate and Communicate

- **Engage All Stakeholders**: Involve developers, testers, business analysts, and product owners in writing scenarios
- **Use a Common Language**: Establish a ubiquitous language that reflects the business domain and is understandable by all team members
- **Regular Reviews**: Review and refine scenarios regularly to ensure they remain accurate and valuable
- **Shared Understanding**: Use BDD scenarios as a tool to build shared understanding of requirements

#### Use Ubiquitous Language

- **Business Terms**: Use business domain terminology rather than technical jargon
- **Consistent Vocabulary**: Establish and maintain a consistent vocabulary across all scenarios
- **Domain-Driven**: Align language with domain concepts and user mental models
- **Accessible**: Ensure non-technical stakeholders can read and understand scenarios

#### Focus on One Behavior per Scenario

- **Single Outcome**: Each scenario should test one specific behavior or outcome
- **Clear Purpose**: Scenarios should have a clear, single purpose
- **Readability**: Focused scenarios are easier to read, understand, and maintain
- **Debugging**: When a scenario fails, it's easier to identify the issue if it tests one behavior

#### Avoid Technical Implementation Details

- **User-Centric**: Focus on what the user sees and does, not how it's implemented
- **Behavior Over Implementation**: Describe behavior, not technical details like database queries or API endpoints
- **Maintainable**: Scenarios that avoid implementation details are more resilient to refactoring

Avoid technical implementation details in scenarios. Focus on user behavior and outcomes rather than technical details like database queries or API endpoints.

#### Use Example Tables for Variations

- **Data-Driven Testing**: Use example tables to test the same behavior with different data
- **Reduce Redundancy**: Avoid writing multiple similar scenarios
- **Clear Examples**: Example tables make it easy to see all test cases at a glance

#### Include Examples and Edge Cases

- **Comprehensive Coverage**: Include both normal and edge cases in scenarios
- **Boundary Conditions**: Test boundary values and limits
- **Error Handling**: Include scenarios for error conditions and recovery
- **Alternative Flows**: Consider different paths users might take

#### Keep Scenarios Readable and Maintainable

- **Clear and Concise**: Write scenarios that are easy to read and understand
- **Descriptive Names**: Use descriptive scenario names that clearly indicate what is being tested
- **Organized**: Group related scenarios together
- **Documented**: Add comments or notes when scenarios need additional context

#### Integration with CI/CD Pipeline

- **Automated Execution**: Integrate BDD scenarios into continuous integration pipeline
- **Fast Feedback**: Run scenarios automatically on every commit
- **Living Documentation**: Keep scenarios up-to-date as requirements change
- **Quality Gate**: Use scenario results as a quality gate before deployment

### TDD Best Practices

Following TDD best practices ensures high-quality, maintainable code with good test coverage.

#### Write Failing Test First

- **Test Before Code**: Always write the test before implementing the functionality
- **Clear Requirements**: Writing tests first clarifies requirements and expected behavior
- **Prevents Over-Engineering**: Tests help focus on what's needed, not what might be needed
- **Documentation**: Tests serve as executable documentation of expected behavior

#### Write Minimal Code to Pass

- **Just Enough**: Write only the code necessary to make the test pass
- **Avoid Premature Optimization**: Don't optimize or add features not required by tests
- **Incremental Development**: Build functionality incrementally, one test at a time
- **Simple Solutions**: Prefer simple solutions that pass tests over complex ones

#### Refactor After Green

- **Improve Structure**: Once tests pass, refactor to improve code structure and readability
- **Maintain Tests**: Keep all tests passing during refactoring
- **Code Quality**: Use refactoring to improve code quality without changing behavior
- **Safe Refactoring**: Tests provide safety net for refactoring

#### Use Descriptive Test Names

- **Clear Intent**: Test names should clearly describe what is being tested
- **BDD-Style**: Use BDD-style descriptions (e.g., "should increment counter when increment action is dispatched")
- **Living Documentation**: Test names serve as documentation of system behavior
- **Easy Debugging**: Descriptive names make it easier to identify failing tests

#### Test Pure Functions (Reducers)

- **Ideal for TDD**: Pure functions are ideal for TDD - predictable inputs and outputs
- **Isolated Testing**: Test reducers in isolation without external dependencies
- **Predictable**: Pure functions make tests predictable and reliable
- **Fast**: Pure function tests are fast and don't require complex setup

#### Test in Isolation

- **Unit Tests**: Test individual functions and components in isolation
- **Independent Tests**: Tests should be independent and not rely on other tests
- **Fast Execution**: Use test containers and seeded fixtures for fast, reliable tests
- **Real Dependencies**: Test against real services in a test environment; never mock your own APIs or data layers

#### Test Error Cases

- **Comprehensive Coverage**: Test both success and error paths
- **Edge Cases**: Test boundary conditions and edge cases
- **Error Handling**: Verify error handling and recovery mechanisms
- **User Experience**: Ensure error cases provide good user experience

### E2E Testing: Assert Data Presence, Not Just Containers

End-to-end tests must explicitly verify that the test environment is populated with required data before validating functionality. A common testing pitfall occurs when tests run against an empty database or unseeded environment. In these scenarios, the application renders "empty state" placeholders, allowing tests that only verify container visibility to pass falsely.

**Rule: Assert Data Presence, Not Just Containers.**

- **Assert Non-Empty State**: Tests must explicitly verify that "no data" or "empty state" placeholders are *not* visible when data is expected.
- **Assert Item Count**: Tests must verify that lists contain more than zero items (e.g., `expect(await items.count()).toBeGreaterThan(0)`).
- **Fail Fast on Missing Data**: If required data is missing, the test should fail immediately, flagging the environmental issue rather than passing silently.

This prevents false positives where bugs in item-rendering code are concealed because the code paths were never executed.

## Redux Toolkit Core Patterns

### createSlice Patterns

`createSlice` is the primary tool for defining Redux state logic. It automatically generates action creators and action types, reducing boilerplate significantly.

#### Why Action Creators?

While Redux does not require action creators, they offer several important benefits. **With `createSlice`, action creators are automatically generated**, so you get these benefits without writing boilerplate code:

**Benefits of Action Creators:**

1. **Maintainability**: Updates to an action can be made in one place and applied everywhere. All instances of an action are guaranteed to have the same shape and the same default values.

2. **Testability**: The correctness of an inline action must be verified manually. Like any function, tests for an creator can be written once and run automatically.

3. **Documentation**: The action creator's parameters enumerate the action's dependencies. Centralization of the action definition provides a convenient place for documentation comments. When actions are written inline, this information is harder to capture and communicate.

4. **Abstraction**: Creating an action often involves transforming data or making API requests. Action creators provide a uniform interface to this varied logic. This abstraction frees a component to dispatch an action without being complicated by the details of that action's creation.

**With `createSlice`, you get all these benefits automatically.**

The action creators generated by `createSlice` are:
- **Type-safe**: TypeScript knows the exact payload type
- **Consistent**: Same shape every time they're called
- **Testable**: Can be tested as pure functions
- **Documented**: The reducer definition serves as documentation
- **Maintainable**: Changes to the reducer automatically update the action creator

#### Basic createSlice Pattern

`createSlice` consolidates all Redux logic for a feature into a single file. This follows Redux's recommended "feature folders with single-file logic" pattern. The slice file contains reducers, automatically generates action creators, and selectors should be defined alongside reducers in the same file.

**Key Points:**
- **Single-file consolidation**: All Redux logic (reducers, actions, selectors) for the counter feature is in one file
- **Automatic action creators**: `createSlice` generates action creators automatically - no separate action files needed
- **Selectors co-located**: Selectors are defined alongside reducers in the same file
- **Complete feature**: One file contains everything needed for Redux state management of this feature

#### extraReducers with Builder Callback

Use `extraReducers` to handle actions from other slices or async thunks. **It's entirely possible (and encouraged) for a reducer defined in one folder to respond to an action defined in another folder.** This enables cross-slice coordination and allows different parts of your application to react to actions from other domains.

The builder callback pattern is preferred for TypeScript type safety.

**Key Points:**
- Use builder callback syntax for better TypeScript inference
- Handle async thunk states: `pending`, `fulfilled`, `rejected`
- Use `addMatcher` for handling multiple action types with shared logic
- Keep reducers pure - all business logic belongs here
- **Cross-slice actions are encouraged**: Reducers can and should respond to actions from other slices when it makes sense for your application logic
- **Example use cases**: Invalidating cache when user logs out, updating UI state based on domain actions, coordinating state across features

### Fat Reducers, Thin Actions Pattern

**We recommend putting as much logic as possible into reducers.** This is a core Redux best practice that ensures business logic is centralized, testable, and benefits from time-travel debugging.

#### Why Fat Reducers?

**Benefits of putting logic in reducers:**
- **Centralized Business Logic**: All state transformation logic lives in one place, making it easier to understand and maintain
- **Time-Travel Debugging**: More logic in reducers means more functionality is affected by Redux DevTools time-travel debugging
- **Semantic Actions**: Action types become more meaningful and descriptive (e.g., `"USER_UPDATED"` instead of `"SET_STATE"`)
- **Testability**: Pure reducer functions are easier to test than action creators with side effects
- **Predictability**: Reducers are pure functions with predictable inputs and outputs

#### Thin Actions

Actions should be thin, semantic objects that describe **what happened** rather than **how to update state**. The reducer then contains the logic for how to update the state.

#### When to Put Logic in Action Creators

While most logic should be in reducers, some logic may need to be in action creators when:
- You need to access external APIs or services
- You need to read from other parts of state before creating the action
- You need to perform async operations (though RTK Query or `createAsyncThunk` are preferred)
- You need to transform data before it reaches the reducer

However, even in these cases, keep action creators focused on preparing data, and put the actual state transformation logic in reducers.

#### Trade-offs

**Fat Reducers (Recommended):**
- ✅ More logic affected by time-travel debugging
- ✅ Semantic, meaningful action types
- ✅ Centralized business logic
- ✅ Easier to test pure functions
- ⚠️ Reducers may need information from other state branches (use `extraReducers` or selectors)

**Thin Reducers:**
- ✅ Simple, composable reducers
- ✅ Easy to combine and reuse
- ❌ Less logic affected by time-travel debugging
- ❌ Actions become less semantic
- ❌ Business logic scattered across action creators

**Recommendation**: Put as much logic as possible into reducers. Use action creators primarily for preparing data and handling side effects, but keep the core business logic in reducers.

### createAsyncThunk Patterns

`createAsyncThunk` generates async action creators that automatically dispatch pending, fulfilled, and rejected actions.

#### When to Use createAsyncThunk vs RTK Query

**Use createAsyncThunk when:**
- You need complex async logic that doesn't fit RTK Query patterns
- You need to dispatch multiple actions during async operations
- You need conditional logic based on state before making requests
- You're working with non-REST APIs or complex request/response patterns

**Use RTK Query when:**
- Fetching data from REST APIs (preferred for all data fetching)
- You need automatic caching and cache invalidation
- You need background refetching and polling
- You need optimistic updates for mutations

### Explicit Refactoring Rules for Redux Toolkit Patterns

**When Refactoring Data Fetching:**

**IF** code uses `useEffect` + `fetch` or `axios` for data fetching
**THEN** create an RTK Query endpoint in the appropriate API slice (`features/core/api/` or feature-specific API slice)
**AND** replace `useEffect` + `fetch` with RTK Query hooks (`useGetQuery`, `useMutation`)
**AND** remove manual loading/error state management (RTK Query handles this)

**IF** code uses `createAsyncThunk` for simple REST API calls
**THEN** convert to RTK Query endpoints (preferred for all data fetching)
**AND** use RTK Query's built-in caching and invalidation instead of manual cache management
**AND** keep `createAsyncThunk` only for complex async logic that doesn't fit RTK Query patterns

**IF** code uses manual Redux thunks or sagas for data fetching
**THEN** migrate to RTK Query endpoints
**AND** remove thunk/saga middleware and related code
**AND** use RTK Query's automatic caching and background refetching

**When Refactoring State Management:**

**IF** code uses manual Redux (without RTK) with `createStore`, manual action creators, or manual reducers
**THEN** convert to `createSlice` from Redux Toolkit
**AND** use automatically generated action creators
**AND** leverage Immer for safe "mutations" in reducers

**IF** a slice file is missing selectors
**THEN** add selectors co-located in the same slice file
**AND** export selectors alongside action creators and reducer
**AND** use `createSelector` for memoized derived state

**IF** state is accessed directly (e.g., `state.feature.property`) instead of via selectors
**THEN** create selectors in the slice file
**AND** replace direct state access with selector calls
**AND** use selectors everywhere state is accessed (components, thunks, other slices)

**When Refactoring Reducers:**

**IF** business logic exists in action creators or components instead of reducers
**THEN** move logic to reducer functions (fat reducers pattern)
**AND** keep actions thin (describe what happened, not how to update state)
**AND** put all state transformation logic in reducers

**IF** a reducer needs to respond to actions from other slices
**THEN** use `extraReducers` with builder callback pattern
**AND** handle cross-slice actions in `extraReducers`, not in main `reducers` object
**AND** use TypeScript-safe builder callback syntax

**When Refactoring RTK Query:**

**IF** multiple API slices exist without a shared base query
**THEN** create a base API slice with shared configuration (base URL, headers, error handling)
**AND** use `injectEndpoints` to add endpoints to the base API slice
**AND** share base query configuration across all API slices

**IF** cache invalidation is handled manually or inconsistently
**THEN** use RTK Query's tag-based cache invalidation
**AND** define tags for endpoints that should invalidate each other
**AND** use `providesTags` and `invalidatesTags` consistently

**IF** optimistic updates are implemented manually
**THEN** use RTK Query's built-in optimistic update patterns
**AND** implement `onQueryStarted` in mutation endpoints for optimistic updates
**AND** leverage RTK Query's automatic rollback on error

**Redux Toolkit Refactoring Checklist:**
- [ ] All data fetching uses RTK Query (no manual fetch/axios in components)
- [ ] All state management uses `createSlice` (no manual Redux)
- [ ] All slices have co-located selectors
- [ ] State is accessed via selectors, not direct access
- [ ] Business logic is in reducers, not action creators
- [ ] Cross-slice coordination uses `extraReducers`
- [ ] RTK Query endpoints use shared base query
- [ ] Cache invalidation uses tag-based system
- [ ] Optimistic updates use RTK Query patterns

### createEntityAdapter for Normalized State

`createEntityAdapter` provides standardized reducers and selectors for managing normalized collections of entities. Use it when you have collections of items that need efficient lookups, updates, and deletions.

#### createEntityAdapter Pattern

**Benefits:**
- Normalized state structure (entities and ids arrays)
- Efficient lookups by ID
- Built-in CRUD operations
- Optimized selectors

### createListenerMiddleware for Reactive Side Effects

`createListenerMiddleware` provides a way to handle side effects reactively based on dispatched actions. Use it for cache invalidation, logging, analytics, and other side effects that shouldn't be in reducers.

#### Listener Middleware Pattern

**When to Use:**
- Cache invalidation based on actions
- Analytics and logging
- Side effects that don't belong in reducers
- Cross-slice coordination

**Action Matchers:**
- `isAnyOf(...actions)` - matches if any action matches
- `isAllOf(...actions)` - matches if all actions match
- Custom predicate functions for complex matching

### configureStore Advanced Configuration

`configureStore` provides sensible defaults but can be customized for advanced use cases.

#### Advanced Store Configuration

**Middleware Order:**
- `prepend()` - adds middleware before default middleware
- `concat()` - adds middleware after default middleware
- RTK Query middleware should be concatenated
- Listener middleware can be prepended for early execution

### Selector Placement and Co-location

**Selectors should be defined alongside reducers and exported from the same file.** This practice colocates all code that knows about the actual shape of the state tree in the reducer files, making it easier to maintain and understand the relationship between state structure and how it's accessed.

**Key Principles:**
- **Co-locate with Reducers**: Define selectors in the same file as the slice, or in an immediately adjacent `selectors.ts` file within the same feature folder
- **Export from Slice File**: Export selectors alongside action creators and the reducer from the slice file
- **Reuse Everywhere**: Selectors should be reused in `mapStateToProps` functions, async action creators, sagas, components, and anywhere else state is accessed
- **Single Source of Truth**: By defining selectors alongside reducers, you ensure that any changes to state structure are reflected in the selectors, preventing inconsistencies

This pattern ensures that:
1. All code related to the users feature state is in one place
2. Selectors automatically reflect changes to the state structure
3. Components and other code use consistent selectors rather than accessing state directly
4. The relationship between state shape and access patterns is clear

### Selector Patterns with createSelector

`createSelector` (re-exported from reselect by RTK) provides memoized selectors for efficient state access and derived data computation.

#### Basic Selector Pattern

Use `createSelector` for memoized selectors that compute derived state.

#### Parameterized Selectors

Create selectors that accept parameters.

#### Composing Selectors

Combine multiple selectors.

#### Memoization Best Practices

**When to use createSelector:**
- Computing derived data from state
- Filtering or transforming arrays
- Combining data from multiple slices
- Expensive computations that should be cached

**When NOT to use createSelector:**
- Simple property access (use direct selectors)
- Data that changes frequently (memoization overhead)
- Very simple transformations (overhead not worth it)

**Performance Considerations:**
- Selectors only recompute when input selectors change
- Use for expensive computations (filtering large arrays, complex calculations)
- Avoid creating selectors inside components (create them outside)
- Use parameterized selectors for dynamic lookups

#### Advanced Selector Patterns

Use advanced selector patterns for complex state transformations and cross-slice data composition.

#### Selector Testing

Test selectors as pure functions.

## Directory Structure

Recommended directory structure for Expo + RTK projects following functional programming principles and Redux's recommended "feature folders / domain-style" organization pattern. This structure follows the "feature folders with single-file logic" approach where all Redux logic (reducers, actions) for a feature is consolidated into a single slice file using `createSlice`.

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Expo Router app directory (file-based routing)
│   │   ├── _layout.tsx               # Root layout with Redux Provider
│   │   ├── index.tsx                 # Landing page with auth redirect
│   │   ├── (tabs)/                   # Tab navigation group
│   │   │   ├── _layout.tsx           # Tab layout configuration
│   │   │   ├── index.tsx             # Home/Dashboard screen
│   │   │   └── [feature].tsx         # Feature screens
│   │   └── auth/                     # Authentication routes
│   │       ├── _layout.tsx           # Auth layout
│   │       ├── login.tsx             # Login screen
│   │       └── register.tsx          # Registration screen
│   │
│   ├── features/                     # Redux feature modules (domain-driven)
│   │   │                              # Feature folders with single-file logic: All Redux logic (reducers, actions) for a feature
│   │   │                              # is consolidated into a single slice file using createSlice
│   │   │                              # CRITICAL: All non-presentational logic must be in domain-specific slices as pure reducers
│   │   │                              # Slices contain pure reducer functions implementing all business logic, validation, 
│   │   │                              # transformations, calculations, and domain rules - NO logic in components
│   │   │
│   │   ├── core/                     # Core application features
│   │   │   ├── api/                  # RTK Query API slice
│   │   │   │   ├── slice/
│   │   │   │   │   └── apiSlice.ts   # Base API slice with endpoints (pure reducers)
│   │   │   │   ├── actions/          # API action creators
│   │   │   │   ├── selectors/        # API selectors
│   │   │   │   ├── types/            # API TypeScript types
│   │   │   │   ├── config/           # API configuration
│   │   │   │   │   └── api.ts        # API base configuration
│   │   │   │   └── __tests__/        # API slice tests
│   │   │   ├── store/                # Redux store configuration
│   │   │   │   ├── store.ts          # configureStore setup
│   │   │   │   └── middleware/       # Custom middleware
│   │   │   ├── appFlow/              # Application flow state
│   │   │   │   ├── slice/            # App flow slice (pure reducers)
│   │   │   │   ├── constants/        # Route constants
│   │   │   │   │   └── routes.ts     # Route definitions
│   │   │   │   └── types/            # App flow types
│   │   │   ├── errors/               # Error handling state (pure reducers)
│   │   │   ├── forms/                # Form state management (pure reducers)
│   │   │   ├── theme/                # Theme state (dark/light mode)
│   │   │   │   ├── slice/            # Theme slice (pure reducers)
│   │   │   │   ├── config/           # Theme configuration
│   │   │   │   │   └── theme.ts      # Theme constants
│   │   │   │   └── types/            # Theme types
│   │   │   ├── ui/                   # UI state (modals, drawers, etc.)
│   │   │   │   ├── slice/            # UI slice (pure reducers)
│   │   │   │   ├── constants/        # UI constants
│   │   │   │   │   └── styling.ts    # Styling constants
│   │   │   │   └── types/            # UI types
│   │   │   └── storage/              # Local storage abstraction
│   │   │
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── slice/
│   │   │   │   └── authSlice.ts      # Auth state slice (pure reducers)
│   │   │   ├── users/                # User management sub-feature
│   │   │   │   ├── slice/            # User slice (pure reducers)
│   │   │   │   ├── selectors/
│   │   │   │   └── utils/
│   │   │   ├── tenants/              # Tenant management sub-feature
│   │   │   │   └── slice/            # Tenant slice (pure reducers)
│   │   │   └── utils/                # Auth utilities
│   │   │
│   │   └── [domain]/                 # Domain-specific features
│   │       │                           # ALL non-presentational logic for this domain lives here as pure reducers
│   │       ├── slice/
│   │       │   └── [domain]Slice.ts  # Domain state slice (pure reducers for all domain logic)
│   │       ├── actions/              # Domain action creators
│   │       ├── selectors/            # Domain selectors
│   │       ├── types/                # Domain TypeScript types
│   │       ├── utils/                # Domain utilities
│   │       └── __tests__/            # Domain slice tests
│   │
│   ├── components/                   # React components (presentational ONLY - NO business logic)
│   │   ├── elements/                 # Reusable UI components
│   │   │   ├── generic/              # Generic components
│   │   │   │   ├── forms/            # Form components (presentation only)
│   │   │   │   ├── layout/           # Layout components
│   │   │   │   ├── ui/               # UI primitives (buttons, inputs, etc.)
│   │   │   │   └── guards/           # Route guards, auth guards
│   │   │   └── unique/               # Feature-specific components
│   │   └── screens/                  # Screen-level components
│   │       └── [ScreenName]Screen.tsx
│   │   # NOTE: Components ONLY render UI and dispatch actions.
│   │   # ALL business logic must be in features/ slices as pure reducers.
│   │
│   └── __tests__/                    # Global test utilities
│       ├── setup.ts                  # Test setup
│       ├── mocks/                    # Test mocks
│       └── helpers/                  # Test helpers
│
├── assets/                           # Static assets (images, fonts, etc.)
├── app.json                          # Expo configuration
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript configuration
```

**When Refactoring Directory Structure:**
- **IF** code is organized by file type (Rails-style) rather than by feature
- **THEN** reorganize into feature-based folders
- **AND** co-locate related code (slice, selectors, components, types) within feature folders
- **IF** Redux logic is scattered across multiple files (actions, reducers, selectors in separate folders)
- **THEN** consolidate into a single slice file using `createSlice`
- **AND** keep selectors co-located with reducers in the same file

**Directory Structure Checklist:**
- [ ] Code is organized by feature/domain, not by file type
- [ ] Related code is co-located in feature folders
- [ ] Redux logic is consolidated in slice files
- [ ] Selectors are co-located with reducers
- [ ] Feature folders are self-contained

### Feature Module Structure

Each feature module follows a consistent structure following Redux's "feature folders with single-file logic" pattern. Within each feature, the slice file consolidates all Redux logic (reducers, actions) using `createSlice`, and selectors are defined alongside reducers in the same file or immediately adjacent:

**Simplified Structure for Simple Features:**

For simple features, you can use an even simpler structure with the slice, selectors, and component in the same folder:

**Key Points:**
- **Single-file logic**: All Redux logic (reducers, actions) for a feature is in one slice file
- **Selectors co-located**: Selectors are defined alongside reducers in the same file or immediately adjacent
- **Automatic action creators**: `createSlice` automatically generates action creators, eliminating the need for separate action files in most cases
- **Flexible structure**: Complex features can use sub-folders for organization, but the core Redux logic remains in the slice file

**Critical Principle**: All non-presentational logic for a domain must be implemented as pure reducer functions within the domain-specific slice. This includes:
- Business logic and validation rules
- Data transformations and calculations
- Workflow and state machine logic
- Domain-specific operations and rules
- Computed state and derived data

**Components are Presentational ONLY**: Components must contain ONLY rendering, styling, and UI event handlers that dispatch actions. They must NOT contain any business logic, validation, calculations, or transformations - all such logic belongs in pure reducers.

**Note**: `config/`, `constants/`, and `types/` are organized within each feature module, not at the root `src/` level. This keeps configuration, constants, and types co-located with their related feature logic.

### Key Principles

- **One slice per file**: Each Redux slice should be a single file with clear responsibility
- **Feature-based organization**: Group related slices, actions, and selectors by domain/feature
- **Barrel exports**: Use `index.ts` files to create clean public APIs for each feature
- **Separation of concerns**: UI components separate from business logic and state management
- **Components are Presentational ONLY**: Components in `components/` contain **ONLY presentational logic** (rendering, styling, UI event handlers). **NO business logic** allowed in components.
- **Business Logic in Pure Reducers**: **ALL business logic** (validation, calculations, transformations, workflows, business rules) must be implemented as pure reducer functions in `features/` slices. Components consume state via selectors and dispatch actions only.
- **RTK Query first**: All data fetching through RTK Query API slices in `features/core/api/`
- **Pure functions**: Keep utilities pure and testable, avoid side effects

### Feature Folders with Single-File Logic: The Recommended Redux Pattern

Redux specifically recommends organizing your logic into **"feature folders"** with all the Redux logic for a given feature in a single **"slice/ducks" file**. This is the modern, recommended approach for Redux applications.

#### What is "Feature Folders with Single-File Logic"?

This pattern organizes code by feature/domain, with each feature folder containing:
- A single slice file (`[feature]Slice.ts`) that consolidates all Redux logic (reducers, actions)
- Selectors defined alongside reducers in the same file
- Optional component file for the feature
- Supporting files (types, utils, config) as needed

#### Comparison with Other Patterns

**Rails-style (Not Recommended):** Related code is scattered across multiple folders, making it hard to find and maintain.

**Pure Ducks Pattern:** Less flexible for complex features that need supporting files.

**Feature Folders with Single-File Logic (Recommended):**
**Benefits**: 
- Related code is co-located
- Flexible enough for simple and complex features
- Easy to find all code related to a feature
- Supports sub-folders for complex features
- Clear feature boundaries

#### Key Characteristics

1. **Single Slice File**: All Redux logic (reducers, actions) for a feature is in one `[feature]Slice.ts` file
2. **Automatic Action Creators**: `createSlice` automatically generates action creators, eliminating separate action files
3. **Selectors Co-located**: Selectors are defined alongside reducers in the same file
4. **Feature Boundaries**: Each feature folder is self-contained with its own slice, types, and utilities
5. **Flexible Structure**: Simple features can be just a slice file; complex features can have sub-folders

#### Why This Pattern?

- **Maintainability**: All code for a feature is in one place, making it easy to understand and modify
- **Scalability**: Easy to add new features without affecting existing ones
- **Testability**: Feature code is isolated and easy to test
- **Developer Experience**: Easy to find related code
- **Official Recommendation**: This is the pattern recommended by the Redux team

This pattern aligns with Redux's core principles while providing the flexibility needed for real-world applications. It's the modern standard for Redux applications using Redux Toolkit.

## Backend Directory Structure

Recommended directory structure for Express.js + TypeScript backend following functional programming principles:

```
backend/
├── index.ts                          # Main Express server entry point
│
├── endpoint/                         # SQL-structured TypeScript endpoints
│   ├── basic/                        # Basic CRUD operations
│   │   ├── select/                   # SELECT operations (GET)
│   │   │   ├── [entity]/
│   │   │   │   └── index.ts          # Entity SELECT endpoint
│   │   │   └── ...
│   │   ├── create/                   # CREATE operations (POST)
│   │   │   ├── [entity]/
│   │   │   │   └── index.ts          # Entity CREATE endpoint
│   │   │   └── ...
│   │   ├── update/                   # UPDATE operations (PUT)
│   │   │   ├── [entity]/
│   │   │   │   └── index.ts          # Entity UPDATE endpoint
│   │   │   └── ...
│   │   ├── delete/                   # DELETE operations (DELETE)
│   │   │   ├── [entity]/
│   │   │   │   └── index.ts          # Entity DELETE endpoint
│   │   │   └── ...
│   │   └── read/                     # Custom read operations
│   │       └── [custom-operation].ts
│   │
│   └── advanced/                     # Advanced operations
│       ├── admin/                    # Admin-only operations
│       │   └── [operation].ts
│       └── auth/                     # Authentication operations
│           ├── login.ts
│           └── logout.ts
│
├── database/                         # Database layer
│   ├── connection.ts                 # Type-safe database connection
│   ├── init.ts                       # Database initialization
│   ├── init-nile.ts                  # Multi-tenant database setup (Nile)
│   ├── local-connection.ts           # Local development connection
│   ├── migrate.ts                    # Migration runner
│   ├── nile.ts                       # Nile-specific operations
│   └── migrations/                   # SQL migration files
│       └── [timestamp]_[description].sql
│
├── middleware/                       # Express middleware (pure functions)
│   ├── auth.ts                       # JWT authentication middleware
│   ├── tenant.ts                     # Tenant context injection
│   ├── health-checks.ts              # Health check endpoints
│   └── production.ts                 # Production optimization
│       ├── Rate limiting
│       ├── Compression
│       ├── Request logging
│       ├── Security headers
│       └── Performance monitoring
│
├── services/                         # Business logic services (domain-driven)
│   ├── [domain]/                     # Domain-specific services
│   │   ├── index.ts                  # Service public API
│   │   ├── [service].ts              # Service implementation
│   │   ├── types.ts                  # Service types
│   │   └── utils.ts                  # Service utilities
│   │
│   ├── emailService.ts               # Email notifications
│   └── ...
│
├── commands/                         # Command handlers (CQRS write side)
│   ├── [domain]/                     # Domain-specific commands
│   │   ├── [command].ts              # Command handler (pure function)
│   │   ├── types.ts                  # Command types
│   │   └── validators.ts             # Command validation
│   │
│   └── index.ts                      # Commands barrel export
│
├── queries/                          # Query handlers (CQRS read side)
│   ├── [domain]/                     # Domain-specific queries
│   │   ├── [query].ts                 # Query handler (pure function)
│   │   ├── types.ts                  # Query types
│   │   └── filters.ts                # Query filters and transformations
│   │
│   └── index.ts                      # Queries barrel export
│
├── events/                           # Event definitions and handlers
│   ├── [domain]/                     # Domain-specific events
│   │   ├── [event].ts                 # Event definition and handler
│   │   ├── types.ts                  # Event types
│   │   └── versioning.ts             # Event versioning and migration
│   │
│   ├── event-store.ts                # Event store implementation
│   ├── event-bus.ts                  # Event bus for event distribution
│   └── index.ts                      # Events barrel export
│
├── projections/                      # Read model projections (from events)
│   ├── [domain]/                     # Domain-specific projections
│   │   ├── [projection].ts            # Projection handler (pure function)
│   │   ├── types.ts                  # Projection types
│   │   └── snapshots.ts              # Snapshot management for performance
│   │
│   └── index.ts                      # Projections barrel export
│
├── aggregates/                      # DDD aggregates
│   ├── [domain]/                     # Domain-specific aggregates
│   │   ├── [aggregate].ts             # Aggregate root implementation
│   │   ├── types.ts                  # Aggregate types
│   │   └── state.ts                 # Aggregate state management
│   │
│   └── index.ts                      # Aggregates barrel export
│
├── infrastructure/                   # Infrastructure layer (side effects)
│   ├── event-store/                  # Event store implementation
│   │   ├── postgres-event-store.ts   # PostgreSQL event store
│   │   ├── in-memory-event-store.ts  # In-memory event store (testing)
│   │   └── types.ts                  # Event store types
│   │
│   ├── message-queue/                # Message queue implementation
│   │   ├── queue.ts                  # Queue interface
│   │   ├── worker.ts                 # Command/event worker
│   │   └── types.ts                  # Queue types
│   │
│   ├── event-bus/                    # Event bus implementation
│   │   ├── in-memory-bus.ts          # In-memory event bus
│   │   ├── redis-bus.ts              # Redis-based event bus
│   │   └── types.ts                  # Event bus types
│   │
│   └── index.ts                      # Infrastructure barrel export
│
├── utils/                            # Pure functional utilities
│   ├── validation.ts                 # Type-safe validation functions
│   ├── error-handling.ts             # Consistent error responses
│   ├── transformation.ts             # Data mapping utilities
│   ├── pagination.ts                 # Pagination logic
│   ├── query-builder.ts              # Dynamic SQL generation
│   ├── query-optimizer.ts            # Query performance optimization
│   ├── database-indexes.ts           # Database index management
│   ├── performance-monitor.ts        # Performance monitoring
│   └── index.ts                      # Utils barrel export
│
├── types/                            # TypeScript type definitions
│   ├── database.ts                   # Database model types
│   ├── api.ts                        # API request/response types
│   └── index.ts                      # Type barrel export
│
├── tests/                            # Comprehensive testing
│   ├── unit/                         # Unit tests (pure function tests)
│   │   └── [module].test.ts
│   ├── integration/                  # Integration test suites
│   │   └── [feature].test.ts
│   ├── helpers/                      # Test utilities and mocks
│   │   └── [helper].ts
│   ├── setup.ts                      # Test configuration
│   └── jest.config.js                # Jest configuration
│
├── scripts/                          # Database and deployment scripts
│   ├── check-schema.ts               # Schema validation
│   ├── init-indexes.ts               # Index initialization
│   ├── run-migrations.ts             # Migration runner
│   └── [utility-script].ts
│
├── docs/                             # API documentation
│   ├── api-documentation.md          # API reference
│   └── swagger.ts                    # Swagger/OpenAPI setup
│
├── credentials/                      # Service account credentials (git-ignored)
│   └── service-account.json
│
├── logs/                             # Application logs (git-ignored)
│   └── [log-files].json
│
├── Dockerfile                        # Docker configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript configuration
├── jest.config.js                    # Jest configuration
└── vercel.json                       # Vercel deployment config
```

### Endpoint Structure Pattern

Endpoints follow a SQL-structured pattern for consistency:

```
/endpoint/{basic|advanced}/{operation}/{entity}[/:id]
```

- **basic**: Standard CRUD operations
- **advanced**: Complex business operations
- **operation**: `select`, `create`, `update`, `delete`, or custom operations
- **entity**: Database entity name (e.g., `clients`, `users`, `tenants`)

Example endpoints:
```
GET    /endpoint/basic/select/clients         # Get all clients
GET    /endpoint/basic/select/clients/:id     # Get specific client
POST   /endpoint/basic/create/clients         # Create client
PUT    /endpoint/basic/update/clients/:id     # Update client
DELETE /endpoint/basic/delete/clients/:id     # Delete client
```

### Service Module Structure

Each service module follows a consistent structure:

```
services/[domain]/
├── index.ts                  # Public API (barrel export)
├── [service].ts              # Service implementation (pure functions)
├── types.ts                  # Service-specific types
└── utils.ts                  # Service utilities (optional)
```

### Key Principles

- **SQL-structured endpoints**: Consistent endpoint pattern mirrors database operations
- **Pure functions**: Business logic in services as pure, testable functions
- **Type-safe database**: Database layer with TypeScript types for queries
- **Middleware composition**: Express middleware as pure functions
- **Domain-driven services**: Business logic organized by domain/feature
- **Separation of concerns**: Endpoints handle HTTP, services handle business logic
- **Functional utilities**: Reusable pure functions in utils directory
- **Comprehensive testing**: Unit tests for utilities/services, integration tests for endpoints

## Database Maintenance

This section outlines database maintenance practices aligned with functional programming principles for PostgreSQL/Nile multi-tenant databases. Database operations should follow FP principles: pure functions, immutability, composition, and testability.

### Functional Programming with SQL

SQL queries and database operations can be designed following functional programming principles, making them more predictable, testable, and maintainable.

#### Pure Query Functions

Database queries should be pure functions where possible - deterministic, with no side effects beyond data retrieval.

**Benefits:**
- **Predictable**: Same inputs always produce same outputs
- **Testable**: Easy to test with known inputs and expected outputs
- **Cacheable**: Results can be safely cached
- **Composable**: Can be combined with other pure functions

#### Immutable Schema Changes

Schema changes should be immutable - each change creates a new version through migrations, never modifying existing migrations.

**Migration Immutability:**
- **Never modify existing migrations**: Once a migration is applied to production, it becomes immutable
- **Create new migrations**: All schema changes go through new migration files
- **Version control**: Migrations are versioned and tracked in git
- **Rollback support**: Each migration should have a corresponding down migration

#### Function Composition in SQL

Build complex queries by composing simple, reusable query functions.

**Benefits:**
- **Reusability**: Base queries can be reused across different contexts
- **Maintainability**: Changes to base queries propagate to composed queries
- **Testability**: Each function can be tested independently

#### Query Builders and Functional Patterns

Use functional query builders that support composition and immutability.

#### Referential Transparency in Database Operations

Database operations should be referentially transparent where possible - a function call can be replaced with its return value without changing program behavior.

**When Not Referentially Transparent:**
- Operations with side effects (INSERT, UPDATE, DELETE)
- Operations that depend on current time or random values
- Operations that read from external state

**Best Practices:**
- Keep read operations (SELECT) referentially transparent
- Isolate side effects (writes) in separate functions
- Use transactions for atomic operations
- Document non-transparent operations

### Schema Design Patterns

Schema design should follow functional programming principles: immutability, composition, and clear boundaries.

#### Normalization vs. Denormalization Strategies

Balance normalization (reducing redundancy) with denormalization (optimizing reads) based on access patterns.

**Normalization (Recommended for Writes):**
- **Third Normal Form (3NF)**: Eliminate redundant data
- **Benefits**: Data consistency, easier updates, reduced storage
- **Use When**: Write-heavy operations, data integrity critical

**Denormalization (Recommended for Reads):**
- **Strategic Duplication**: Store computed or frequently accessed data
- **Benefits**: Faster reads, reduced joins
- **Use When**: Read-heavy operations, performance critical

**Hybrid Approach (Recommended):**
- Normalize core data (clients, users, tenants)
- Denormalize computed/aggregated data (totals, counts, statistics)
- Use materialized views for complex aggregations
- Update denormalized data via triggers or application logic

#### Multi-Tenant Schema Design

Design schemas with tenant isolation as a first-class concern.

**Key Principles:**
- **Always include tenant_id**: Every tenant-aware table must have tenant_id
- **Composite primary keys**: Use (id, tenant_id) for multi-tenant safety
- **Foreign keys with tenant_id**: Include tenant_id in foreign key constraints
- **Tenant-scoped indexes**: Index on tenant_id for efficient filtering
- **Row-level security**: Use RLS policies for additional isolation (Nile handles this automatically)

#### Index Design Patterns

Design indexes to optimize query performance while maintaining write performance.

**Index Types and Use Cases:**

**Index Best Practices:**
- **Index tenant_id first**: For multi-tenant queries, tenant_id should be first in composite indexes
- **Use partial indexes**: For filtered queries, partial indexes reduce index size
- **Monitor index usage**: Use `pg_stat_user_indexes` to identify unused indexes
- **Balance reads and writes**: More indexes improve reads but slow writes
- **Consider index maintenance**: Indexes require storage and maintenance overhead

#### Foreign Key Constraints and Referential Integrity

Use foreign keys to enforce referential integrity and maintain data consistency.

**Referential Integrity Options:**
- **ON DELETE CASCADE**: Delete child records when parent is deleted
- **ON DELETE SET NULL**: Set foreign key to NULL when parent is deleted
- **ON DELETE RESTRICT**: Prevent deletion if child records exist
- **ON UPDATE CASCADE**: Update foreign key when parent key changes

**Best Practices:**
- **Always include tenant_id**: Multi-tenant foreign keys must include tenant_id
- **Use appropriate actions**: Choose CASCADE, SET NULL, or RESTRICT based on business logic
- **Index foreign keys**: Foreign key columns should be indexed for performance
- **Document constraints**: Document why specific referential actions are chosen

#### JSONB Usage Patterns

Use JSONB for flexible, schema-less data while maintaining query performance.

**JSONB Best Practices:**
- **Use for flexible data**: Addresses, metadata, configuration, user preferences
- **Index with GIN**: Create GIN indexes for JSONB columns used in WHERE clauses
- **Validate structure**: Use application-level validation for JSONB structure
- **Consider performance**: JSONB queries can be slower than normalized columns
- **Document schema**: Document expected JSONB structure even if schema-less

#### Address and Location Data Patterns

Design address and location data to balance flexibility with queryability.

**Address Pattern Options:**

Choose between normalized, JSONB, or denormalized approaches based on complexity and query patterns.

**Best Practices:**
- **Choose based on complexity**: Simple addresses → JSONB, Complex → Normalized
- **Consider query patterns**: If you query by city/state frequently, use normalized columns
- **Use generated columns**: Use computed/generated columns for formatted addresses
- **Index location data**: Index city, state, zip for location-based queries

#### Schema Versioning

Version schemas through migrations to track changes and enable rollbacks.

**Versioning Best Practices:**
- **Semantic versioning**: Use semantic versioning (major.minor.patch) for schema versions
- **Migration tracking**: Track applied migrations in a `schema_migrations` table
- **Documentation**: Document schema changes in migration files
- **Backward compatibility**: Maintain backward compatibility when possible
- **Breaking changes**: Document breaking changes and migration paths

### Migration Management

Migrations are the primary mechanism for schema changes. They should be immutable, testable, and reversible.

#### Migration File Naming and Organization

Organize migrations with clear naming conventions and consistent structure.

**Naming Convention:**

**Naming Pattern:**
- **Format**: `{sequence_number}_{description}.sql`
- **Sequence**: Sequential numbers (001, 002, 003) or timestamps (20251014_001)
- **Description**: Brief, descriptive name in snake_case
- **Examples**:
  - `001_create_clients_table.sql`
  - `002_add_research_table.sql`
  - `015_add_client_status_index.sql`

**Organization Best Practices:**
- **Single directory**: All migrations in `database/migrations/`
- **Sequential numbering**: Use sequential numbers for ordering
- **Descriptive names**: Names should clearly describe the change
- **Group related changes**: Related changes can be in the same migration
- **Separate concerns**: Separate schema changes from data migrations

#### Up and Down Migrations

Every migration should have both up (apply) and down (rollback) operations.

**Up Migration:**
- **Purpose**: Apply the schema change
- **Idempotent**: Use `IF NOT EXISTS` or `IF EXISTS` for idempotency
- **Reversible**: Should be reversible via down migration
- **Tested**: Test up migration on development/staging first

**Down Migration:**
- **Purpose**: Rollback the schema change
- **Complete reversal**: Should completely reverse the up migration
- **Data safety**: Consider data loss when rolling back
- **Tested**: Test down migration to ensure it works

**Best Practices:**
- **Always provide down migration**: Every up migration needs a down migration
- **Test both directions**: Test up and down migrations
- **Document data implications**: Document if rollback causes data loss
- **Use transactions**: Wrap migrations in transactions when possible
- **Idempotent operations**: Use `IF NOT EXISTS` / `IF EXISTS` for safety

#### Data Migration Patterns

Data migrations require special care to ensure data integrity and avoid data loss.

**Data Migration Best Practices:**
- **Backup first**: Always backup data before data migrations
- **Test on copy**: Test data migrations on a copy of production data
- **Verify results**: Verify data migration results before committing
- **Batch processing**: For large datasets, process in batches
- **Monitor performance**: Monitor migration performance and adjust batch size
- **Rollback plan**: Have a rollback plan for data migrations
- **Document changes**: Document what data is being migrated and why

#### Rollback Strategies

Plan rollback strategies for all migrations, especially data migrations.

**Rollback Strategy Types:**

1. **Automatic Rollback (Recommended)**
   - Down migration automatically reverses up migration
   - Use for schema-only changes
   - Tested and verified

2. **Manual Rollback (For Data Migrations)**
   - Requires manual intervention
   - Document rollback steps
   - May cause data loss

3. **No Rollback (Breaking Changes)**
   - Some changes cannot be rolled back
   - Document breaking changes
   - Plan forward migration path

**Rollback Best Practices:**
- **Test rollbacks**: Always test rollback procedures
- **Document rollback steps**: Document manual rollback steps
- **Backup before rollback**: Backup data before rolling back
- **Consider data loss**: Understand data loss implications
- **Plan forward path**: For breaking changes, plan forward migration

#### Migration Testing

Test migrations thoroughly before applying to production.

**Migration Testing Checklist:**
- [ ] Test up migration on development database
- [ ] Test down migration on development database
- [ ] Test on copy of production data (if data migration)
- [ ] Verify data integrity after migration
- [ ] Verify indexes are created/updated correctly
- [ ] Verify foreign keys are maintained
- [ ] Test application compatibility after migration
- [ ] Verify performance impact (if significant schema change)
- [ ] Test rollback procedure

#### Multi-Tenant Migration Considerations

Multi-tenant migrations require special considerations for tenant isolation and data integrity.

**Multi-Tenant Migration Best Practices:**
- **Respect tenant isolation**: Never mix data across tenants
- **Test per tenant**: Test migrations with multiple tenants
- **Verify isolation**: Verify tenant isolation after migration
- **Consider tenant-specific data**: Some migrations may need tenant-specific logic
- **Monitor performance**: Multi-tenant migrations can be slower
- **Batch by tenant**: For large migrations, process per tenant

### Query Optimization

Optimize queries for performance while maintaining correctness and tenant isolation.

#### Index Optimization

Design indexes to match query patterns and optimize performance.

**Index Optimization Checklist:**
- [ ] Index all foreign key columns
- [ ] Index tenant_id for multi-tenant queries
- [ ] Create composite indexes for multi-column WHERE clauses
- [ ] Use partial indexes for filtered queries
- [ ] Create GIN indexes for JSONB columns used in queries
- [ ] Monitor index usage with `pg_stat_user_indexes`
- [ ] Remove unused indexes
- [ ] Rebuild indexes periodically (REINDEX)

**Index Analysis:**

#### Query Performance Analysis

Analyze query performance using EXPLAIN and EXPLAIN ANALYZE.

**EXPLAIN Usage:**

**Query Plan Analysis:**
- **Seq Scan**: Full table scan (slow, avoid if possible)
- **Index Scan**: Uses index (fast, preferred)
- **Index Only Scan**: Uses index only, no table access (fastest)
- **Bitmap Heap Scan**: Uses bitmap index (good for multiple conditions)
- **Nested Loop**: Joins tables (can be slow for large datasets)
- **Hash Join**: Hash-based join (good for large datasets)
- **Merge Join**: Merge-based join (good for sorted data)

**Performance Indicators:**
- **Execution Time**: Total query execution time
- **Planning Time**: Query planning time
- **Rows**: Number of rows processed
- **Cost**: Estimated cost (lower is better)
- **Buffers**: Memory buffer usage

#### Common Query Anti-Patterns

Avoid common query anti-patterns that hurt performance.

**Anti-Pattern 1: Missing Tenant Filter**

Always include tenant_id in WHERE clauses for multi-tenant queries.

**Anti-Pattern 2: N+1 Queries**

Avoid making multiple queries in loops. Use JOINs or batch queries instead.

**Anti-Pattern 3: SELECT ***

Avoid selecting all columns. Select only the columns you need.

**Anti-Pattern 4: Missing Indexes**

Ensure all foreign keys and frequently queried columns are indexed.

**Anti-Pattern 5: Functions in WHERE Clause**

Avoid using functions in WHERE clauses as they prevent index usage.

#### Connection Pooling and Transaction Management

Manage database connections and transactions efficiently.

**Best Practices:**
- **Use connection pooling**: Always use connection pools, never create connections per request
- **Set appropriate pool size**: Balance between connection overhead and concurrency
- **Use transactions**: Use transactions for multi-step operations
- **Handle errors**: Always handle transaction errors and rollback
- **Keep transactions short**: Long transactions hold locks and reduce concurrency

#### Prepared Statements and Parameterized Queries

Use prepared statements and parameterized queries for security and performance.

**Benefits:**
- **Security**: Prevents SQL injection attacks
- **Performance**: Query plans can be cached and reused
- **Type Safety**: Parameters are properly typed and escaped
- **Maintainability**: Easier to read and maintain

### Multi-Tenant Database Patterns

Multi-tenant databases require special patterns to ensure tenant isolation, performance, and data integrity.

#### Tenant Isolation Strategies

Implement tenant isolation at multiple levels for security and correctness.

**Isolation Levels:**

1. **Application-Level Isolation (Current Approach)**
   - Always include `tenant_id` in queries
   - Filter by `tenant_id` in WHERE clauses
   - Include `tenant_id` in foreign keys
   - **Pros**: Simple, flexible
   - **Cons**: Requires discipline, easy to forget

2. **Row-Level Security (RLS) - Nile Handles Automatically**
   - PostgreSQL RLS policies enforce tenant isolation
   - Automatic filtering by tenant_id
   - **Pros**: Automatic, secure, cannot be bypassed
   - **Cons**: Requires RLS setup (Nile handles this)

3. **Schema-Level Isolation**
   - Separate schema per tenant
   - **Pros**: Complete isolation
   - **Cons**: Complex, harder to manage, not scalable

#### Row-Level Security (RLS) Patterns

Nile automatically handles RLS, but understanding the pattern is important.

**RLS Best Practices:**
- **Let Nile handle RLS**: Nile automatically sets up RLS policies
- **Always set tenant context**: Always provide tenantId to Nile queries
- **Test isolation**: Test that tenants cannot access each other's data
- **Monitor RLS performance**: RLS adds overhead, monitor performance

#### Tenant-Scoped Queries

All queries must be tenant-scoped to ensure isolation.

**Tenant-Scoped Query Checklist:**
- [ ] All SELECT queries include tenant_id filter
- [ ] All INSERT queries include tenant_id
- [ ] All UPDATE queries include tenant_id in WHERE clause
- [ ] All DELETE queries include tenant_id in WHERE clause
- [ ] All JOINs include tenant_id matching
- [ ] All foreign keys include tenant_id
- [ ] Test queries with multiple tenants to verify isolation

#### Cross-Tenant Data Access Patterns

Some operations may need cross-tenant access (admin operations, analytics).

**Cross-Tenant Access Best Practices:**
- **Minimize cross-tenant access**: Only use when absolutely necessary
- **Audit cross-tenant operations**: Log all cross-tenant data access
- **Use aggregated data**: Prefer aggregated data over raw cross-tenant access
- **Restrict to admin roles**: Only allow admin users to perform cross-tenant operations
- **Document exceptions**: Document why cross-tenant access is needed

#### Performance Considerations for Multi-Tenant Queries

Multi-tenant queries have unique performance considerations.

**Performance Optimization:**

1. **Index tenant_id First**

2. **Partial Indexes for Tenant Data**

3. **Connection Pooling per Tenant (Advanced)**

**Performance Best Practices:**
- **Index tenant_id first**: Always index tenant_id first in composite indexes
- **Use partial indexes**: Use partial indexes for tenant-specific filtered queries
- **Monitor per-tenant performance**: Monitor query performance per tenant
- **Consider tenant-specific optimizations**: Some tenants may need specific optimizations
- **Cache tenant-scoped data**: Cache frequently accessed tenant data

### Database Testing

Test database operations thoroughly to ensure correctness, performance, and tenant isolation.

#### Unit Testing Database Functions

Test database functions as pure functions with predictable inputs and outputs.

**Unit Testing Best Practices:**
- **Test as pure functions**: Test database functions with known inputs and expected outputs
- **Use test database**: Use separate test database for unit tests
- **Clean up after tests**: Clean up test data after each test
- **Test edge cases**: Test null values, empty results, error cases
- **Test tenant isolation**: Always test tenant isolation in unit tests

#### Integration Testing with Test Databases

Test complete database operations with real database connections.

**Integration Testing Best Practices:**
- **Use real database**: Use real database connection for integration tests
- **Isolate test data**: Use separate test database or schema
- **Clean up**: Clean up test data before and after tests
- **Test transactions**: Test transaction rollback and commit
- **Test concurrency**: Test concurrent operations if applicable
- **Test performance**: Test query performance in integration tests

#### Migration Testing

Test migrations to ensure they work correctly and can be rolled back.

**Migration Testing Best Practices:**
- **Test up and down**: Test both up and down migrations
- **Test idempotency**: Test that migrations can be run multiple times
- **Test on production-like data**: Test migrations on copy of production data
- **Test data migrations**: Test data migrations thoroughly
- **Test rollback**: Test rollback procedures
- **Verify constraints**: Verify foreign keys, indexes, constraints after migration

#### Data Integrity Testing

Test data integrity constraints, foreign keys, and business rules.

**Data Integrity Testing Best Practices:**
- **Test constraints**: Test all foreign key, unique, and check constraints
- **Test tenant isolation**: Test that tenants cannot access each other's data
- **Test cascading deletes**: Test ON DELETE CASCADE behavior
- **Test null constraints**: Test NOT NULL constraints
- **Test default values**: Test DEFAULT value behavior

#### Performance Testing

Test query performance and identify slow queries.

**Performance Testing Best Practices:**
- **Set performance benchmarks**: Define acceptable query performance targets
- **Test with realistic data**: Test with realistic data volumes
- **Monitor slow queries**: Identify and optimize slow queries
- **Test index usage**: Verify that indexes are being used
- **Test under load**: Test query performance under concurrent load

### Database Maintenance Checklist

Regular database maintenance ensures optimal performance, data integrity, and reliability.

#### Regular Maintenance Tasks

**Daily Tasks:**
- [ ] Monitor database connection pool usage
- [ ] Check for slow queries (queries taking >1 second)
- [ ] Monitor error logs for database errors
- [ ] Verify backup completion (if automated)

**Weekly Tasks:**
- [ ] Review and optimize slow queries
- [ ] Check index usage statistics
- [ ] Review and remove unused indexes
- [ ] Monitor database size and growth
- [ ] Review application logs for database-related errors

**Monthly Tasks:**
- [ ] Analyze query performance trends
- [ ] Review and optimize indexes
- [ ] Check for table bloat and vacuum if needed
- [ ] Review migration history and plan upcoming migrations
- [ ] Update database documentation

**Quarterly Tasks:**
- [ ] Comprehensive performance review
- [ ] Review and update database schema documentation
- [ ] Plan and execute major migrations
- [ ] Review and optimize database configuration
- [ ] Review security and access controls

#### Performance Monitoring

Monitor database performance metrics to identify issues early.

**Key Metrics to Monitor:**
- **Query Performance**: Average query time, slow query count
- **Connection Pool**: Active connections, idle connections, wait time
- **Index Usage**: Index hit rate, unused indexes
- **Table Size**: Table growth, bloat percentage
- **Transaction Rate**: Transactions per second, commit/rollback ratio
- **Lock Contention**: Lock wait time, deadlock count

**Monitoring Queries:**

#### Backup and Recovery

Implement and test backup and recovery procedures.

**Backup Strategy:**
- **Automated Backups**: Set up automated daily backups
- **Backup Retention**: Retain backups for at least 30 days
- **Point-in-Time Recovery**: Enable WAL archiving for point-in-time recovery
- **Backup Testing**: Test backup restoration monthly
- **Backup Verification**: Verify backup integrity regularly

**Recovery Procedures:**
- **Document recovery steps**: Document step-by-step recovery procedures
- **Test recovery**: Test recovery procedures regularly
- **Recovery time objectives**: Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)
- **Disaster recovery plan**: Have a disaster recovery plan

**Nile-Specific Considerations:**
- **Nile handles backups**: Nile automatically handles backups
- **Verify Nile backups**: Verify that Nile backups are working
- **Test Nile recovery**: Test recovery from Nile backups
- **Document Nile procedures**: Document Nile-specific backup/recovery procedures

#### Security Considerations

Maintain database security through access controls, encryption, and monitoring.

**Security Checklist:**
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Enforce tenant isolation (RLS, application-level filtering)
- [ ] Use least privilege principle (minimal database user permissions)
- [ ] Encrypt sensitive data (at rest and in transit)
- [ ] Monitor access logs (audit database access)
- [ ] Regular security updates (keep database and dependencies updated)
- [ ] Secure connection strings (store in environment variables, not code)
- [ ] Regular security audits (review access controls and permissions)

**Security Best Practices:**
- **Connection Security**: Use SSL/TLS for database connections
- **Password Security**: Use strong passwords, rotate regularly
- **Access Control**: Limit database access to necessary users only
- **Audit Logging**: Log all database access and modifications
- **Vulnerability Scanning**: Regularly scan for database vulnerabilities

#### Documentation Requirements

Maintain comprehensive database documentation.

**Documentation Checklist:**
- [ ] Schema documentation (table structures, relationships)
- [ ] Migration history (all migrations documented)
- [ ] Query patterns (common queries and their purposes)
- [ ] Index documentation (indexes and their purposes)
- [ ] Performance baselines (expected query performance)
- [ ] Backup/recovery procedures (step-by-step procedures)
- [ ] Security procedures (access controls, encryption)
- [ ] Multi-tenant patterns (tenant isolation patterns)

**Documentation Best Practices:**
- **Keep documentation updated**: Update documentation when schema changes
- **Include examples**: Include code examples in documentation
- **Document decisions**: Document why certain design decisions were made
- **Version documentation**: Version documentation alongside code
- **Accessible location**: Keep documentation in accessible location (e.g., docs/ directory)

[↑ Back to Top](#table-of-contents)

## Backend Architecture

While Redux is primarily a client-side state management library, its core principles of a single source of truth, predictable state changes through actions and reducers, and unidirectional data flow can be applied to backend architecture through several design patterns and architectural styles.

### Redux Principles Applied to Backend

#### Single Source of Truth
- **Frontend**: Redux store contains all application state
- **Backend**: Event store contains all state changes as an immutable sequence of events
- **Benefit**: Predictable state access, ability to reconstruct any point in time

#### State is Read-Only
- **Frontend**: State can only be changed by dispatching actions
- **Backend**: State can only be changed by processing commands that create events
- **Benefit**: Immutable state changes, auditability, time-travel debugging

#### Changes are Made with Pure Functions
- **Frontend**: Reducers are pure functions that take previous state and action, return new state
- **Backend**: Command handlers and event handlers are pure functions that process commands/events
- **Benefit**: Testability, predictability, no side effects in business logic

#### Unidirectional Data Flow
- **Frontend**: Actions → Reducers → Store → UI → User Interactions → Actions
- **Backend**: Commands → Command Handlers → Events → Event Store → Projections → Query Handlers → Responses
- **Benefit**: Predictable data flow, easier debugging, clear separation of concerns

### Architectural Patterns

The following patterns enable Redux-like architecture in the backend:

1. **Command-Query Responsibility Segregation (CQRS)**: Separates commands (state-changing operations) from queries (read-only operations)
2. **Event Sourcing**: Stores all state changes as immutable events, reconstructs state by replaying events
3. **Functional Programming**: Pure functions, immutability, function composition
4. **Message Queues and Event Buses**: Event-driven communication between services
5. **Domain-Driven Design (DDD) Aggregates**: Clusters of related entities with consistency boundaries

## Command-Query Responsibility Segregation (CQRS)

CQRS separates the responsibilities of handling commands (state-changing operations) and queries (read-only operations). This pattern is analogous to Redux's separation of actions (commands) and selectors (queries).

### Core Concepts

#### Commands (State-Changing Operations)
- **Purpose**: Represent intent to change system state
- **Characteristics**: 
  - Immutable data structures
  - Descriptive names (e.g., `CreateClient`, `UpdateClientStatus`)
  - Contain all data needed to perform the operation
  - Never return data (only success/failure)
- **Mapping to Current Structure**: 
  - `POST /endpoint/basic/create/[entity]` → Commands
  - `PUT /endpoint/basic/update/[entity]` → Commands
  - `DELETE /endpoint/basic/delete/[entity]` → Commands

#### Queries (Read-Only Operations)
- **Purpose**: Retrieve data without modifying state
- **Characteristics**:
  - No side effects
  - Can be cached and optimized independently
  - Return data in format optimized for consumption
- **Mapping to Current Structure**:
  - `GET /endpoint/basic/select/[entity]` → Queries
  - `GET /endpoint/basic/read/[operation]` → Queries

### Command Handlers

Command handlers are pure functions that:
1. Validate the command
2. Check business rules and constraints
3. Create events representing the state change
4. Return success or failure

### Query Handlers

Query handlers are pure functions that:
1. Read from projections (read models)
2. Apply filters and transformations
3. Return data optimized for consumption
4. Never modify state

### Benefits of CQRS

- **Scalability**: Commands and queries can be scaled independently
- **Performance**: Query models can be optimized for read performance (denormalized, indexed)
- **Separation of Concerns**: Clear distinction between write and read operations
- **Flexibility**: Multiple read models for different use cases
- **Maintainability**: Easier to reason about and test

### Mapping to Current Endpoint Structure

The current SQL-structured endpoint pattern already aligns with CQRS principles:

- **Commands**: `/endpoint/basic/{create|update|delete}/[entity]`
- **Queries**: `/endpoint/basic/{select|read}/[entity]`

This structure can be enhanced by:
- Moving command logic to dedicated command handlers
- Moving query logic to dedicated query handlers
- Using event sourcing for command processing
- Creating optimized read models (projections) for queries

## Event Sourcing

Event Sourcing takes the idea of predictable state changes further by storing all changes to an application's state as a sequence of immutable events. Instead of storing the current state, the system reconstructs it by replaying the event log. This is analogous to Redux's ability to replay actions to reconstruct the state.

### Core Concepts

#### Event Store
- **Purpose**: Immutable sequence of events as single source of truth
- **Characteristics**:
  - Append-only log of events
  - Events are never modified or deleted
  - Each event has: type, aggregate ID, data, timestamp, version
  - Events are ordered by sequence number

#### Events
- **Purpose**: Immutable records of what happened
- **Characteristics**:
  - Descriptive names (e.g., `ClientCreated`, `ClientStatusChanged`)
  - Contain all data needed to reconstruct state
  - Versioned for schema evolution
  - Linked to aggregate (entity) via aggregate ID

#### Event Handlers
- **Purpose**: Pure functions that project events to read models
- **Characteristics**:
  - Process events in order
  - Build read models (projections) from events
  - Can create multiple projections for different use cases
  - Idempotent (can be replayed safely)

#### Event Replay
- **Purpose**: Reconstruct state by replaying events
- **Process**:
  1. Load all events for an aggregate
  2. Apply events in order to empty state
  3. Result is current state
- **Benefits**: Time-travel debugging, auditability, multiple read models

### Event Versioning

Events must be versioned to handle schema evolution.

### Integration with Audit Logs

The existing `audit_logs` table can be enhanced to serve as an event store:

- **Current**: Audit logs track actions for compliance
- **Enhanced**: Audit logs become events in event store
- **Benefits**: 
  - Single source of truth for both auditing and state reconstruction
  - Automatic audit trail for all state changes
  - Time-travel debugging capabilities

### Benefits of Event Sourcing

- **Auditability**: Complete history of all state changes
- **Time-Travel Debugging**: Reconstruct state at any point in time
- **Multiple Read Models**: Build different projections for different use cases
- **Scalability**: Events can be processed asynchronously
- **Flexibility**: Easy to add new read models without changing write logic
- **Debugging**: Replay events to understand system behavior

### Challenges and Considerations

- **Event Store Size**: Events accumulate over time (requires archiving strategy)
- **Replay Performance**: Replaying many events can be slow (use snapshots)
- **Eventual Consistency**: Read models may be slightly behind write model
- **Schema Evolution**: Events must be versioned and migrated carefully
- **Complexity**: More complex than traditional CRUD, requires careful design

## Functional Programming for Backend

Functional programming principles are essential for building robust, testable, and maintainable backend systems. These principles align with Redux's emphasis on pure functions and immutability.

### Core Principles

#### Pure Functions
- **Definition**: Functions that always return the same output for the same input, with no side effects
- **Benefits**: 
  - Easier to test (predictable inputs/outputs)
  - Easier to reason about (no hidden dependencies)
  - Easier to parallelize (no shared state)
- **Application**: All business logic in services should be pure functions

#### Immutability
- **Definition**: Data structures that cannot be modified after creation
- **Benefits**:
  - Prevents accidental mutations
  - Enables safe sharing of data
  - Simplifies concurrent access
- **Application**: 
  - Events are immutable
  - Projections (read models) are immutable
  - Command/query objects are immutable

#### Function Composition
- **Definition**: Building complex operations by combining simple functions
- **Benefits**:
  - Reusable, testable components
  - Clear, readable code
  - Easy to modify and extend
- **Application**: Build complex business logic from simple, composable functions

#### No Side Effects in Business Logic
- **Definition**: Business logic functions should not have side effects (database writes, API calls, etc.)
- **Benefits**:
  - Easier to test (no need to mock external dependencies)
  - Easier to reason about (pure functions)
  - Easier to parallelize
- **Application**: 
  - Business logic in services: pure functions
  - Side effects isolated to infrastructure layer (database, APIs, message queues)

#### Referential Transparency
- **Definition**: Functions can be replaced with their return value without changing program behavior
- **Benefits**:
  - Enables optimization (memoization, caching)
  - Enables parallelization
  - Simplifies reasoning about code
- **Application**: All business logic functions should be referentially transparent

### Functional Programming Patterns

#### Higher-Order Functions
Functions that take other functions as arguments or return functions. Use higher-order functions for composition and abstraction.

#### Currying
Transforming a function with multiple arguments into a sequence of functions with single arguments. Use currying for partial application and function composition.

#### Monads
Structures that represent computations with context (e.g., Maybe, Either, Result). Use monads for handling optional values, error handling, and asynchronous operations.

### Benefits of Functional Programming

- **Testability**: Pure functions are easy to test (predictable inputs/outputs)
- **Maintainability**: Code is easier to understand and modify
- **Reliability**: Fewer bugs due to immutability and no side effects
- **Parallelization**: Pure functions can be safely parallelized
- **Composability**: Complex operations built from simple functions

## Message Queues and Event Buses

Message queues and event buses facilitate communication between different parts of a distributed system in an event-driven manner. Events published to a queue or bus can trigger actions or updates in other services, reflecting a similar flow to Redux's action dispatch and reducer execution.

### Core Concepts

#### Event Bus
- **Purpose**: Central event distribution mechanism
- **Characteristics**:
  - Publishes events to multiple subscribers
  - Decouples event producers from consumers
  - Supports multiple event types
  - Can be in-memory or distributed

#### Message Queues
- **Purpose**: Async command/event processing
- **Characteristics**:
  - Guarantees message delivery
  - Supports message ordering
  - Handles message persistence
  - Supports retry and dead-letter queues

#### Event Handlers
- **Purpose**: Reactive handlers that respond to events
- **Characteristics**:
  - Subscribe to specific event types
  - Process events asynchronously
  - Can trigger side effects (e.g., send email, update cache)
  - Idempotent (can be safely retried)

### Event Bus Pattern

Use an event bus for centralized event distribution and decoupled service communication.

### Message Queue Pattern

Use message queues for asynchronous command and event processing with guaranteed delivery.

### Integration Patterns

#### Command-Event Flow
1. Client sends command to API
2. API enqueues command to command queue
3. Command handler processes command, creates events
4. Events published to event bus
5. Event handlers update read models, trigger side effects
6. Query handlers read from updated projections

#### Event-Driven Service Communication
- **Synchronous**: Direct API calls (tight coupling)
- **Asynchronous**: Event bus (loose coupling)
- **Benefits**: 
  - Services can evolve independently
  - Better scalability (services can process events at their own pace)
  - Better resilience (services can retry failed events)

### Benefits

- **Decoupling**: Services communicate through events, not direct calls
- **Scalability**: Services can process events independently and at different rates
- **Resilience**: Failed events can be retried, dead-letter queues for problematic events
- **Flexibility**: Easy to add new event handlers without modifying existing code
- **Auditability**: All events are logged, providing complete audit trail

### Implementation Considerations

- **Event Ordering**: Some events must be processed in order (use partitioning)
- **Idempotency**: Event handlers must be idempotent (can be safely retried)
- **Error Handling**: Failed events should be retried or sent to dead-letter queue
- **Monitoring**: Track event processing metrics (throughput, latency, errors)
- **Testing**: Mock event bus for testing, use in-memory bus for integration tests

## Domain-Driven Design (DDD) Aggregates

In DDD, aggregates represent clusters of related objects treated as a single unit for data changes. Commands are typically directed at aggregates, and the aggregate ensures consistency within its boundaries, similar to how a reducer in Redux manages a specific slice of the state.

### Core Concepts

#### Aggregates
- **Definition**: Clusters of related entities treated as a single unit
- **Characteristics**:
  - Has clear boundaries
  - Ensures consistency within boundaries
  - Has a single aggregate root
  - Commands target the aggregate root

#### Aggregate Roots
- **Definition**: Single entry point for commands targeting an aggregate
- **Responsibilities**:
  - Validates commands
  - Ensures business rules are satisfied
  - Creates events representing state changes
  - Maintains consistency within aggregate boundary

#### Consistency Boundaries
- **Definition**: Aggregates ensure consistency within their boundaries
- **Characteristics**:
  - Changes within aggregate are transactional
  - Changes across aggregates are eventually consistent
  - Aggregates communicate through events

#### Command Routing
- **Definition**: Commands are routed to specific aggregates
- **Process**:
  1. Command contains aggregate ID
  2. Load aggregate from event store
  3. Apply command to aggregate root
  4. Aggregate root creates events
  5. Save events to event store

### Aggregate Pattern

Use aggregates to define consistency boundaries and encapsulate business logic within domain entities.

### Mapping to Services

Current service structure can be enhanced with aggregates:

- **Services**: Domain-specific business logic
- **Aggregates**: Consistency boundaries within services
- **Example**: 
  - `services/clients/` → Client aggregate
  - `services/users/` → User aggregate
  - `services/offers/` → Offer aggregate

### Benefits

- **Consistency**: Aggregates ensure consistency within boundaries
- **Encapsulation**: Business rules encapsulated within aggregates
- **Scalability**: Aggregates can be distributed across services
- **Testability**: Aggregates can be tested in isolation
- **Maintainability**: Clear boundaries make code easier to understand

### Aggregate Design Guidelines

- **Keep Aggregates Small**: Smaller aggregates are easier to understand and test
- **One Aggregate Root**: Each aggregate has exactly one root entity
- **Consistency Within Boundaries**: All changes within aggregate are transactional
- **Events for Cross-Aggregate Communication**: Aggregates communicate through events
- **Idempotent Commands**: Commands should be idempotent (safe to retry)

## Redux-Backend Pattern Mapping

The following table maps Redux concepts to backend architectural patterns:

| Redux Concept | Backend Pattern | Description |
|--------------|----------------|-------------|
| **Actions** | **Commands/Events** | Immutable, descriptive objects representing intent (commands) or what happened (events) |
| **Reducers** | **Event Handlers/Projections** | Pure functions that transform state based on events |
| **Store** | **Event Store** | Single source of truth containing all state changes |
| **Selectors** | **Query Handlers** | Functions that read and transform data from projections |
| **Middleware** | **Command/Event Middleware** | Intercept and process commands/events (validation, logging, etc.) |
| **dispatch()** | **Command Bus/Queue** | Mechanism for sending commands to handlers |
| **getState()** | **Query Handlers** | Read-only access to current state (projections) |
| **subscribe()** | **Event Subscriptions** | React to state changes (event handlers) |
| **Time-Travel Debugging** | **Event Replay** | Reconstruct state at any point in time by replaying events |
| **Action Creators** | **Command Factories** | Functions that create commands with proper structure |
| **combineReducers()** | **Multiple Projections** | Different read models (projections) for different use cases |

### Detailed Mappings

#### Actions → Commands/Events

**Redux Actions, Backend Commands, and Backend Events** represent different stages of the same pattern.

#### Reducers → Event Handlers/Projections

**Redux Reducers and Backend Event Handlers** both transform state based on actions/events.

#### Store → Event Store

**Redux Store:**
- Contains current application state
- Can be serialized and rehydrated
- Supports time-travel debugging

**Backend Event Store:**
- Contains immutable sequence of events
- Can reconstruct state at any point in time
- Supports event replay and time-travel debugging

#### Selectors → Query Handlers

**Redux Selectors and Backend Query Handlers** both read and transform data from state/projections.

### Benefits of This Mapping

- **Familiar Patterns**: Developers familiar with Redux can apply same principles to backend
- **Consistency**: Same architectural principles across frontend and backend
- **Predictability**: Predictable state management patterns
- **Testability**: Pure functions are easy to test
- **Maintainability**: Clear separation of concerns

### Backend Testing Requirements

The backend **must** have comprehensive test coverage following functional programming principles:

#### Test Structure

- **Unit Tests** (`tests/unit/`): Test pure functions in isolation
  - All utility functions (`utils/`) must have unit tests
  - All service functions (`services/`) must have unit tests
  - All command handlers (`commands/`) must have unit tests
  - All event handlers (`events/`) must have unit tests
  - All projection handlers (`projections/`) must have unit tests
  - All aggregate logic (`aggregates/`) must have unit tests
  - Test pure functions with various inputs and edge cases
  - Use seeded test data and real services in test environment
  - Focus on testing business logic, validation, and transformations

- **Integration Tests** (`tests/integration/`): Test complete request/response flows
  - All endpoints must have integration tests
  - Test full HTTP request/response cycles
  - Test authentication and authorization
  - Test database interactions with test database
  - Test error handling and edge cases
  - Test multi-tenant isolation where applicable
  - Test event store operations (save, load, replay)
  - Test command processing end-to-end
  - Test query handlers with real projections

#### Testing Command Handlers

Command handlers are pure functions and should be tested as such.

#### Testing Event Handlers

Event handlers are pure functions that transform state.

#### Testing Projections

Projections should be tested by replaying events.

#### Testing Aggregates

Aggregates should be tested by applying commands and verifying events.

#### Testing Best Practices

- **Pure Function Testing**: Since commands, events, and projections are pure functions, tests should be straightforward with predictable inputs/outputs
- **Test Coverage**: Aim for high test coverage (minimum 80%) on business logic
- **Test Isolation**: Each test should be independent and not rely on other tests
- **Test Data**: Use factories or fixtures for consistent test data
- **Real Dependencies**: Test against real services in test environment; only mock third-party external services (payment APIs, email) when absolutely necessary
- **Test Database**: Use a separate test database that can be reset between test runs
- **Event Store Testing**: Use in-memory event store for fast unit tests, use real event store for integration tests
- **Async Testing**: Properly handle async operations in tests with proper cleanup
- **Event Replay Testing**: Test that events can be replayed to reconstruct state correctly
- **Idempotency Testing**: Test that event handlers are idempotent (can be safely replayed)

#### Required Test Files

- Every service file should have a corresponding test file: `services/[domain]/[service].test.ts`
- Every utility file should have a corresponding test file: `utils/[utility].test.ts`
- Every command handler should have a test file: `commands/[domain]/[command].test.ts`
- Every event handler should have a test file: `events/[domain]/[event].test.ts`
- Every projection should have a test file: `projections/[domain]/[projection].test.ts`
- Every aggregate should have a test file: `aggregates/[domain]/[aggregate].test.ts`
- Every endpoint should have integration tests: `tests/integration/[endpoint].test.ts`
- Test helpers and fixtures should be in `tests/helpers/` and `tests/fixtures/`

#### Test Execution

- Tests should run automatically in CI/CD pipeline
- Tests should be fast and reliable
- Use Jest as the testing framework (already configured)
- Run tests before committing code
- Maintain test documentation for complex test scenarios
- Use in-memory event store for fast unit tests
- Use real event store for integration tests to verify persistence

## Implementation Strategy

This section provides guidance on gradually introducing Redux-inspired patterns to the backend without breaking existing functionality.

### Gradual Migration Path

#### Phase 1: Introduce CQRS Separation (Low Risk)

1. **Identify Commands and Queries**
   - Map existing endpoints: `create/`, `update/`, `delete/` → Commands
   - Map existing endpoints: `select/`, `read/` → Queries

2. **Extract Command Handlers**
   - Move command logic from endpoints to `commands/` directory
   - Keep endpoints as thin wrappers that call command handlers
   - Maintain existing API contracts

3. **Extract Query Handlers**
   - Move query logic from endpoints to `queries/` directory
   - Keep endpoints as thin wrappers that call query handlers
   - Maintain existing API contracts

**Benefits**: Clear separation of concerns, easier testing, no breaking changes

#### Phase 2: Introduce Event Sourcing (Medium Risk)

1. **Start with Audit Trail**
   - Enhance existing `audit_logs` table to store events
   - Create event definitions for key operations
   - Store events alongside traditional database writes

2. **Add Event Handlers**
   - Create event handlers that update read models (projections)
   - Keep traditional database writes for backward compatibility
   - Gradually migrate to event-sourced read models

3. **Implement Event Replay**
   - Add ability to replay events to reconstruct state
   - Use for debugging and auditing initially
   - Gradually use for primary read models

**Benefits**: Complete audit trail, time-travel debugging, foundation for full event sourcing

#### Phase 3: Full Event Sourcing (Higher Risk)

1. **Migrate Write Path**
   - Commands create events instead of direct database writes
   - Events stored in event store
   - Event handlers update projections

2. **Migrate Read Path**
   - Queries read from projections instead of primary tables
   - Projections built from events
   - Maintain backward compatibility during transition

3. **Remove Legacy Code**
   - Once projections are proven stable, remove direct database writes
   - Keep event store as single source of truth

**Benefits**: Full event sourcing benefits, but requires careful migration

### When to Use Each Pattern

#### Use CQRS When:
- Read and write workloads have different performance requirements
- You need to scale reads and writes independently
- You want clear separation between write and read logic
- You need multiple read models for different use cases

#### Use Event Sourcing When:
- You need complete audit trail and compliance
- You need time-travel debugging capabilities
- You need to build multiple read models from same events
- You need to replay events for analysis or recovery
- You have complex business rules that benefit from event history

#### Use DDD Aggregates When:
- You have complex business rules within entity boundaries
- You need to ensure consistency within entity clusters
- You want to encapsulate business logic within aggregates
- You have clear domain boundaries

#### Use Message Queues/Event Bus When:
- You need to decouple services
- You need async processing
- You need to handle high throughput
- You need resilience (retry failed operations)

### Trade-offs and Considerations

#### CQRS Trade-offs

**Benefits:**
- Independent scaling of reads and writes
- Optimized read models
- Clear separation of concerns

**Costs:**
- More complex architecture
- Eventual consistency between read and write models
- More code to maintain

#### Event Sourcing Trade-offs

**Benefits:**
- Complete audit trail
- Time-travel debugging
- Multiple read models
- Flexible querying

**Costs:**
- More complex architecture
- Event store can grow large (requires archiving)
- Replay performance (requires snapshots)
- Eventual consistency
- Schema evolution complexity

#### DDD Aggregates Trade-offs

**Benefits:**
- Clear consistency boundaries
- Encapsulated business logic
- Better domain modeling

**Costs:**
- More complex than simple CRUD
- Requires careful aggregate design
- Cross-aggregate consistency is eventually consistent

#### Message Queues Trade-offs

**Benefits:**
- Decoupling
- Scalability
- Resilience

**Costs:**
- Eventual consistency
- More complex error handling
- Requires monitoring and observability
- Potential message ordering issues

### Migration Best Practices

1. **Start Small**: Begin with one domain/entity, prove the pattern works
2. **Maintain Backward Compatibility**: Keep existing APIs working during migration
3. **Test Thoroughly**: Comprehensive testing at each phase
4. **Monitor Closely**: Watch for performance issues, errors, consistency problems
5. **Document Changes**: Keep team informed of architectural changes
6. **Iterate**: Refine patterns based on experience

### Recommended Approach

For this codebase, the recommended approach is:

1. **Phase 1 (Immediate)**: Introduce CQRS separation
   - Extract command handlers from endpoints
   - Extract query handlers from endpoints
   - Keep existing database structure

2. **Phase 2 (Short-term)**: Enhance audit logs with events
   - Store events in audit_logs table
   - Create event handlers for key operations
   - Build projections alongside traditional reads

3. **Phase 3 (Long-term)**: Full event sourcing for critical domains
   - Start with high-value domains (clients, offers)
   - Migrate to event-sourced read models
   - Keep other domains on traditional approach

This gradual approach minimizes risk while gaining benefits incrementally.

## Implementation Roadmap

### 1. Redux Store Foundation

#### Store Configuration with configureStore

The Redux store is configured using `configureStore` from Redux Toolkit (see [Redux Toolkit Usage Guide](https://redux-toolkit.js.org/usage/usage-guide)). `configureStore` provides sensible defaults and dramatically simplifies store setup compared to manual Redux store configuration. It automatically:

- Sets up the Redux DevTools Extension
- Adds Redux Thunk middleware
- Enables helpful development checks (immutability and serializability)
- Combines your slice reducers into the root reducer
- Configures default middleware with good defaults

This eliminates most boilerplate and configuration complexity.

#### Middleware Configuration Patterns

**getDefaultMiddleware Customization:**
- `serializableCheck`: Validates that actions and state are serializable
- `immutableCheck`: Validates that state is not mutated
- `thunk`: Redux Thunk middleware (included by default)
- Customize or disable checks based on your needs

**Middleware Order:**
- `prepend()`: Adds middleware before default middleware (use for listeners)
- `concat()`: Adds middleware after default middleware (use for RTK Query)
- RTK Query middleware must be concatenated to work properly
- Listener middleware can be prepended for early execution

**redux-logger for State Change Logging:**

Use `redux-logger` middleware to automatically log all Redux actions and state changes. This is the recommended approach for monitoring state updates and aligns with functional programming principles by keeping logging in middleware rather than components.

**Installation:**
```bash
npm install --save-dev redux-logger
```

**Configuration:**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    // ... your reducers
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    
    // Only add logger in development
    if (process.env.NODE_ENV === 'development') {
      return middleware.concat(logger);
    }
    
    return middleware;
  },
});
```

**Benefits of redux-logger over useEffect-based logging:**
- **Centralized logging**: All state changes logged in one place, not scattered across components
- **Automatic**: Logs every action and state change without manual intervention
- **Complete context**: Shows previous state, dispatched action, and resulting state
- **FP-aligned**: Uses middleware pattern for side effects, not component lifecycle hooks
- **Development-friendly**: Can be easily disabled in production for performance
- **No component coupling**: Logging happens at the Redux level, independent of components

**DO NOT use useEffect for logging:**
- ❌ Mount logging: `useEffect(() => console.log('Component mounted'), [])`
- ❌ Component state logging: `useEffect(() => console.log(state), [state])`
- ❌ Debugging state changes: `useEffect(() => console.log('State changed', props), [props])`

**Instead, use redux-logger:**
- ✅ All Redux state changes are automatically logged
- ✅ Component mount tracking (if needed) should dispatch Redux actions tracked by redux-logger
- ✅ All logging goes through Redux middleware

**Example Output:**
```
action     cart/addItem @ 12:34:56.789
 prev state { items: [], total: 0 }
 action     { type: 'cart/addItem', payload: {...} }
 next state { items: [{...}], total: 10.00 }
```

**Example: Replacing Mount Logging with Redux Actions**

Instead of:
```typescript
// ❌ BAD: Using useEffect for mount logging
useEffect(() => {
  console.log('Component mounted');
  console.log('Component state:', state);
}, []);
```

Use Redux actions with redux-logger:
```typescript
// ✅ GOOD: Dispatch action tracked by redux-logger
useEffect(() => {
  dispatch({ type: 'component/mounted', payload: { componentName: 'MyComponent' } });
}, [dispatch]);

// Redux-logger will automatically log:
// action     component/mounted @ 12:34:56.789
// prev state { ... }
// action     { type: 'component/mounted', payload: {...} }
// next state { ... }
```

**Example: Replacing Component State Logging with Redux Actions**

Instead of:
```typescript
// ❌ BAD: Using useEffect to log component state changes
useEffect(() => {
  console.log('State changed:', { clientId, client, isLoading });
}, [clientId, client, isLoading]);
```

Use Redux actions and redux-logger:
```typescript
// ✅ GOOD: State changes tracked automatically by redux-logger
// All state changes in Redux are automatically logged by redux-logger middleware
// No manual logging needed in components
```

#### Typed Hooks

Create typed hooks for type-safe Redux integration.

#### Root Reducer Pattern

Combine all domain slices using the reducer object pattern (configureStore handles combineReducers internally).

#### Store Configuration Best Practices

- **Maintain Redux slices for major domains**: Application state, feature state, config state, UI state
- **Maintain RTK Query API slices**: Centralized data fetching and caching
- **Use typed hooks**: `useAppDispatch` and `useAppSelector` for type safety
- **Configure middleware properly**: RTK Query middleware must be concatenated
- **Setup listeners**: Call `setupListeners(store.dispatch)` for RTK Query refetch behavior
- **Use redux-logger for development**: Add `redux-logger` middleware in development to automatically log all actions and state changes
- **Disable checks in production**: Improve performance by disabling serializable/immutable checks and removing logger
- **Keep store configuration in one place**: Single source of truth for store setup

### 2. Maintain Core Utilities with Reducer-First Approach
- **Strategy**:
  - **Replace all manual data fetching** with RTK Query endpoints
  - Maintain Redux slices for client-side state only (UI state, form state, computed state)
  - Use RTK Query's built-in caching, invalidation, and background sync
  - Maintain pure functions that return analysis results via RTK Query transformResponse
  - Leverage createEntityAdapter from RTK for normalized data when needed by RTK Query

### 3. Maintain Entry Points and Application Initialization with RTK Query Integration
- **Strategy**:
  - Maintain application entry points with pure handlers that dispatch actions to appropriate slices.
  - **Integrate RTK Query hooks** for all data fetching in application logic
  - Maintain handlers as pure functions that use RTK Query for API calls
  - Use RTK Query's polling and real-time features instead of manual intervals

### 4. Maintain Components with Reducer-Based State
- **Strategy**:
  - **CRITICAL: Components are Presentational ONLY** - Components must contain **ONLY presentational logic** (rendering, styling, UI event handlers that dispatch actions). **ZERO business logic** in components.
  - **ALL business logic** (validation, calculations, transformations, workflows) must be in pure reducers within `features/` slices.
  - Maintain factories that consume Redux state via selectors and RTK Query hooks.
  - **Replace useEffect + fetch patterns** with RTK Query hooks (useGetQuery, useMutation)
  - Maintain component-specific slices only for local UI state using RTK createSlice (e.g., modal open/close, form field focus state).
  - Maintain render functions that compose smaller pure helpers receiving state via selectors and RTK Query data.
  - Components dispatch actions to trigger business logic in reducers; they never implement business logic directly.

### 5. Enhance APIs with RTK Query Advanced Patterns and Features with Reducer Patterns
- **Strategy**:
  - **Convert all existing thunks and manual API calls** to RTK Query endpoints
  - Each API will have its own slice, and all slices will use a single enhanced base query to reduce redundant logic for retries, logging, and error handling.
  - Leverage RTK Query's automatic retry logic, error handling, and optimistic updates
  - Use RTK Query's built-in normalized caching instead of manual cache management

### 6. Monitoring and Logging with Reducer Architecture
- **Strategy**:
  - Maintain monitoring slices using createSlice from RTK for UI state only
  - **Use RTK Query for all monitoring data fetching** (metrics, alerts, logs)
  - Replace EventEmitter patterns with RTK Query's built-in polling and real-time updates
  - Use RTK listener middleware for reactive side effects, not observables

### 7. Testing and Validation with TDD and BDD

This section covers Test-Driven Development (TDD) and Behavior-Driven Development (BDD) practices for testing Redux Toolkit code, with emphasis on BDD scenarios and user story-driven testing.

#### 7.1 TDD Workflow with Redux Toolkit

The TDD workflow (Red-Green-Refactor) applies naturally to Redux Toolkit development, especially for pure reducer functions.

##### Red-Green-Refactor Cycle for Reducers

**Red Phase: Write Failing Test**

Write a test that describes the desired functionality. This test should fail initially because the functionality doesn't exist yet.

**Green Phase: Write Minimal Implementation**

Write only the code necessary to make the test pass. Avoid over-engineering at this stage.

**Refactor Phase: Improve Code Quality**

Once the test passes, refactor the code to improve structure, readability, and maintainability while keeping all tests green.

##### Writing Tests First for createSlice

When creating a new slice, start with tests:

1. **Define the interface**: Write TypeScript interfaces for state and actions
2. **Write reducer tests**: Test each reducer with Given-When-Then structure
3. **Write selector tests**: Test selectors with various state configurations
4. **Implement the slice**: Write minimal code to pass tests
5. **Refactor**: Improve code structure while keeping tests green

##### TDD for RTK Query Endpoints

Apply TDD to RTK Query endpoints:

**Red Phase: Write Failing Test**

Write a test that describes the desired API endpoint functionality. This test should fail initially because the endpoint doesn't exist yet.

**Green Phase: Implement Endpoint**

Create the RTK Query endpoint with minimal implementation to make the test pass.

##### TDD for Components (Presentational Only)

Test presentational components with TDD:

**Red Phase: Write Failing Test**

Write a test that describes the desired component behavior. This test should fail initially because the component doesn't exist or doesn't have the required functionality.

#### 7.2 BDD Scenarios for Redux Slices

BDD scenarios for Redux slices describe state transformations in user-centric language using Given-When-Then structure.

##### Writing BDD-Style Tests for Reducers

Structure reducer tests using BDD Given-When-Then format. Test scenarios for different initial states and actions, verifying that state transformations work correctly and original state is not mutated.

##### Given-When-Then Structure for State Changes

BDD scenarios for state changes follow this pattern:

- **Given**: Initial state or pre-conditions
- **When**: Action dispatched or event occurs
- **Then**: Expected state after action
- **And**: Additional assertions or conditions

##### Example: Testing Form Validation with BDD

Test form validation using BDD scenarios with Given-When-Then structure. Test both valid and invalid email formats, verifying that errors are set correctly and form validity is updated appropriately.

#### 7.3 BDD Scenarios for RTK Query

BDD scenarios for RTK Query describe API interactions and caching behavior from the user's perspective.

##### Given-When-Then for API Interactions

Use BDD scenarios to describe API interactions from the user's perspective. Test both successful API calls and error handling scenarios.

##### Testing Query Endpoints with BDD

Test query endpoints using BDD scenarios that describe caching behavior and data fetching patterns.

##### Testing Mutations with BDD

Test mutation endpoints using BDD scenarios that describe data creation, updates, and cache invalidation.

##### Cache Invalidation Scenarios

Test cache invalidation scenarios using BDD. Verify that when data is updated, related caches are invalidated and subsequent queries refetch the updated data.

#### 7.4 BDD Scenarios for Components

BDD scenarios for components focus on user interactions and component behavior, not implementation details.

##### User Interaction Scenarios

Test user interactions with components using BDD scenarios. Focus on what the user sees and does, not implementation details. Test user actions like clicking buttons, entering data, and verifying UI updates.

##### Component Behavior Testing

Test component behavior including loading states, error handling, and data display. Use BDD scenarios to describe how components respond to different states and user interactions.

##### Integration with Redux State

Test components that integrate with Redux state. Verify that components correctly display data from the store and dispatch actions when users interact with the UI.

##### Presentational Component Testing Patterns

For presentational components, focus on:
- **Rendering**: What is displayed based on props/state
- **User Interactions**: What happens when user interacts with component
- **State Updates**: How component responds to Redux state changes
- **No Business Logic**: Components should not contain business logic (tested in reducers)

#### 7.5 BDD Tools and Frameworks

##### Jest with BDD-Style describe/it Blocks

Jest's `describe` and `it` blocks naturally support BDD-style testing. Use nested describe blocks to organize scenarios and it blocks for individual test cases with Given-When-Then structure.

##### Cucumber.js Integration (Optional)

For teams wanting executable Gherkin syntax, Cucumber.js can be integrated. Create feature files with Gherkin syntax and implement step definitions in TypeScript files.

##### Writing Readable Test Descriptions

Use descriptive test names that read like specifications:

**Good Examples:**
- `should increment counter when increment action is dispatched`
- `should display error message when API call fails`
- `should reset form when reset button is clicked`

**Bad Examples:**
- `test1`
- `increment works`
- `error handling`

##### Test Organization Patterns

Organize tests to match feature structure, co-locating test files with the code they test.

#### 7.6 RTK Query Testing Patterns

This section covers existing RTK Query testing patterns that complement TDD and BDD practices.

##### Testing createSlice Reducers

Test reducers as pure functions with predictable inputs and outputs.

##### Testing createAsyncThunk

Test async thunks against a real test backend with seeded data.

##### Testing RTK Query Endpoints with Real Backend

Test RTK Query endpoints against a real test API. Seed data through real code paths and verify actual API responses.

##### Testing RTK Query with store helpers

Use RTK Query's testing utilities like `setupApiStore` to test API slices.

##### Testing Listener Middleware

Test listener middleware side effects by verifying that listeners respond correctly to dispatched actions.

##### Testing with Redux DevTools

Use Redux DevTools for debugging.

- Install Redux DevTools browser extension
- Use time-travel debugging to step through actions
- Inspect state at any point in action history
- Export/import state for testing

#### 7.7 Complete Examples: User Story to BDD Implementation

This section provides complete, working examples showing the full journey from user story to BDD test implementation.

##### Example 1: User Story to BDD Test for Redux Slice

**User Story:**
```
As a user
I want to add items to my shopping cart
So that I can purchase multiple items together
```

**BDD Scenarios:**
```
Scenario: Add item to empty cart
  Given I have an empty shopping cart
  When I add a product to the cart
  Then the cart should contain one item
  And the item should have the correct product details

Scenario: Add item to cart with existing items
  Given I have a cart with one item
  When I add another product to the cart
  Then the cart should contain two items
  And both items should be preserved

Scenario: Add duplicate item to cart
  Given I have a cart with one item
  When I add the same product again
  Then the cart should contain two items
  And both items should have the same product ID
```

**BDD Test Implementation:**

```typescript
// features/cart/slice/cartSlice.test.ts
import { cartSlice, CartState } from './cartSlice';

describe('Cart Feature - User Story: Add items to cart', () => {
  describe('Scenario: Add item to empty cart', () => {
    it('should add item when cart is empty', () => {
      // Given: I have an empty shopping cart
      const initialState: CartState = {
        items: [],
        total: 0,
      };
      
      const product = {
        id: '1',
        name: 'Product 1',
        price: 10.00,
        quantity: 1,
      };
      
      // When: I add a product to the cart
      const action = cartSlice.actions.addItem(product);
      const result = cartSlice.reducer(initialState, action);
      
      // Then: The cart should contain one item
      expect(result.items).toHaveLength(1);
      // And: The item should have the correct product details
      expect(result.items[0]).toEqual({
        ...product,
        id: expect.any(String),
      });
      expect(result.total).toBe(10.00);
    });
  });
  
  describe('Scenario: Add item to cart with existing items', () => {
    it('should add item when cart already has items', () => {
      // Given: I have a cart with one item
      const initialState: CartState = {
        items: [
          {
            id: 'item-1',
            productId: '1',
            name: 'Product 1',
            price: 10.00,
            quantity: 1,
          },
        ],
        total: 10.00,
      };
      
      const newProduct = {
        id: '2',
        name: 'Product 2',
        price: 20.00,
        quantity: 1,
      };
      
      // When: I add another product to the cart
      const action = cartSlice.actions.addItem(newProduct);
      const result = cartSlice.reducer(initialState, action);
      
      // Then: The cart should contain two items
      expect(result.items).toHaveLength(2);
      // And: Both items should be preserved
      expect(result.items[0].productId).toBe('1');
      expect(result.items[1].productId).toBe('2');
      expect(result.total).toBe(30.00);
    });
  });
  
  describe('Scenario: Add duplicate item to cart', () => {
    it('should add duplicate item as separate entry', () => {
      // Given: I have a cart with one item
      const initialState: CartState = {
        items: [
          {
            id: 'item-1',
            productId: '1',
            name: 'Product 1',
            price: 10.00,
            quantity: 1,
          },
        ],
        total: 10.00,
      };
      
      const duplicateProduct = {
        id: '1',
        name: 'Product 1',
        price: 10.00,
        quantity: 1,
      };
      
      // When: I add the same product again
      const action = cartSlice.actions.addItem(duplicateProduct);
      const result = cartSlice.reducer(initialState, action);
      
      // Then: The cart should contain two items
      expect(result.items).toHaveLength(2);
      // And: Both items should have the same product ID
      expect(result.items[0].productId).toBe('1');
      expect(result.items[1].productId).toBe('1');
      expect(result.total).toBe(20.00);
    });
  });
});
```

**Slice Implementation (TDD Green Phase):**

```typescript
// features/cart/slice/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>) => {
      const newItem: CartItem = {
        id: `item-${Date.now()}`,
        productId: action.payload.id,
        name: action.payload.name,
        price: action.payload.price,
        quantity: action.payload.quantity,
      };
      state.items.push(newItem);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
});

export default cartSlice.reducer;
```

##### Example 2: User Story to BDD Test for RTK Query

**User Story:**
```
As a user
I want to view my profile information
So that I can verify and update my account details
```

**BDD Scenarios:**
```
Scenario: Fetch user profile successfully
  Given I am authenticated
  When I request my profile information
  Then I should receive my profile data
  And the profile should include name, email, and preferences

Scenario: Handle profile fetch error
  Given I am authenticated
  When the profile API returns an error
  Then I should see an error message
  And I should be able to retry the request
```

**BDD Test Implementation (using real test backend):**

```typescript
// features/user/api/userApi.test.ts
import { setupApiStore } from '../../../test-utils';
import { userApi } from './userApi';
import { seedTestUser, cleanupTestData, getTestUserCredentials } from '../../../test-fixtures';

beforeAll(async () => {
  // Seed real test data in test database
  await seedTestUser({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    preferences: { theme: 'dark', notifications: true },
  });
});

afterAll(async () => {
  await cleanupTestData();
});

describe('User Profile Feature - User Story: View profile information', () => {
  describe('Scenario: Fetch user profile successfully', () => {
    it('should return profile data when API call succeeds', async () => {
      // Given: I am authenticated (using real test credentials)
      const storeRef = setupApiStore(userApi, { 
        auth: await getTestUserCredentials() 
      });
      
      // When: I request my profile information
      const result = await storeRef.store.dispatch(
        userApi.endpoints.getProfile.initiate()
      );
      
      // Then: I should receive my profile data
      expect(result.data).toBeDefined();
      expect(result.isSuccess).toBe(true);
      // And: The profile should include name, email, and preferences
      expect(result.data?.name).toBe('John Doe');
      expect(result.data?.email).toBe('john@example.com');
      expect(result.data?.preferences).toBeDefined();
    });
  });
  
  describe('Scenario: Handle profile fetch error', () => {
    it('should handle error when authentication fails', async () => {
      // Given: I am NOT authenticated (no credentials)
      const storeRef = setupApiStore(userApi);
      
      // When: I request my profile without authentication
      const result = await storeRef.store.dispatch(
        userApi.endpoints.getProfile.initiate()
      );
      
      // Then: I should see an error message
      expect(result.isError).toBe(true);
      expect(result.error).toBeDefined();
      // And: I should be able to retry the request
    });
  });
});
```

**RTK Query Implementation:**

```typescript
// features/user/api/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: string;
    notifications: boolean;
  };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => 'user/profile',
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
```

##### Example 3: User Story to BDD Test for Component

**User Story:**
```
As a user
I want to search for products
So that I can quickly find what I'm looking for
```

**BDD Scenarios:**
```
Scenario: Search for products
  Given I am on the product search page
  When I enter a search term
  And I click the search button
  Then I should see matching products
  And the results should be relevant to my search

Scenario: Display no results
  Given I am on the product search page
  When I search for a term with no matches
  Then I should see a "No results found" message
  And I should see suggestions for alternative searches
```

**BDD Test Implementation (using real test backend):**

```typescript
// features/products/components/ProductSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../api/productsApi';
import ProductSearch from './ProductSearch';
import { seedTestProducts, cleanupTestData } from '../../../test-fixtures';

beforeAll(async () => {
  // Seed real products in test database
  await seedTestProducts([
    { id: '1', name: 'laptop Product 1', price: 10.00 },
    { id: '2', name: 'laptop Product 2', price: 20.00 },
  ]);
});

afterAll(async () => {
  await cleanupTestData();
});

describe('Product Search Feature - User Story: Search for products', () => {
  const createStore = () => configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });

  describe('Scenario: Search for products', () => {
    it('should display matching products when search succeeds', async () => {
      // Given: I am on the product search page (with seeded products)
      render(
        <Provider store={createStore()}>
          <ProductSearch />
        </Provider>
      );
      
      // When: I enter a search term
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      
      // And: I click the search button
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      
      // Then: I should see matching products
      await waitFor(() => {
        expect(screen.getByText(/laptop Product 1/i)).toBeInTheDocument();
        expect(screen.getByText(/laptop Product 2/i)).toBeInTheDocument();
      });
      // And: The results should be relevant to my search
      expect(screen.queryByText(/unrelated product/i)).not.toBeInTheDocument();
    });
  });
  
  describe('Scenario: Display no results', () => {
    it('should show no results message when search returns empty', async () => {
      // Given: I am on the product search page
      render(
        <Provider store={createStore()}>
          <ProductSearch />
        </Provider>
      );
      
      // When: I search for a term with no matches
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
      
      // Then: I should see a "No results found" message
      await waitFor(() => {
        expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      });
      // And: I should see suggestions for alternative searches
      expect(screen.getByText(/try searching for/i)).toBeInTheDocument();
    });
  });
});
```

##### Example 4: Complete TDD Cycle Example

This example demonstrates the complete Red-Green-Refactor cycle for a form validation feature.

**User Story:**
```
As a user
I want to validate my email address during registration
So that I can ensure I receive important account notifications
```

**Red Phase: Write Failing Test**

```typescript
// features/auth/slice/validationSlice.test.ts
describe('Email Validation - TDD Cycle', () => {
  describe('Red Phase: Write Failing Test', () => {
    it('should validate email format', () => {
      // Given: Form with email field
      const initialState = {
        email: '',
        errors: {},
      };
      
      // When: Validate email with invalid format
      const action = validationSlice.actions.validateEmail('invalid-email');
      const result = validationSlice.reducer(initialState, action);
      
      // Then: Email error should be set
      expect(result.errors.email).toBe('Invalid email format');
    });
  });
});
```

**Green Phase: Write Minimal Implementation**

```typescript
// features/auth/slice/validationSlice.ts
export const validationSlice = createSlice({
  name: 'validation',
  initialState: {
    email: '',
    errors: {},
  },
  reducers: {
    validateEmail: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(email)) {
        state.errors.email = 'Invalid email format';
      } else {
        delete state.errors.email;
      }
    },
  },
});
```

**Refactor Phase: Improve Code Quality**

```typescript
// Refactored with better structure and additional validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmailFormat = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validationSlice = createSlice({
  name: 'validation',
  initialState: {
    email: '',
    errors: {},
    isValid: false,
  },
  reducers: {
    validateEmail: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      state.email = email;
      
      if (!email) {
        state.errors.email = 'Email is required';
        state.isValid = false;
      } else if (!validateEmailFormat(email)) {
        state.errors.email = 'Invalid email format';
        state.isValid = false;
      } else {
        delete state.errors.email;
        state.isValid = Object.keys(state.errors).length === 0;
      }
    },
  },
});
```

#### Testing Best Practices

- **Test reducers as pure functions**: Reducers should be predictable and testable in isolation
- **Use real dependencies**: Test against real test backends with seeded data; never mock your own APIs or data layers
- **Test async flows**: Use `waitFor` and proper async/await patterns
- **Test error cases**: Always test both success and error paths
- **Test cache behavior**: Verify cache invalidation and updates work correctly
- **Use test utilities**: Leverage RTK's testing utilities with real test backends
- **Avoid testing implementation details**: Focus on behavior, not internal implementation
- **Write BDD-style scenarios**: Use Given-When-Then structure for clear, readable tests
- **Follow TDD workflow**: Write tests first, then implement, then refactor
- **Maintain user story traceability**: Link tests to user stories for requirements tracking
- **Create living documentation**: Use BDD scenarios as executable specifications that stay up-to-date
- **One behavior per scenario**: Keep scenarios focused on a single behavior or outcome
- **Use descriptive test names**: Test names should clearly describe what is being tested
- **Test in isolation**: Test individual functions and components independently
- **Include edge cases**: Test boundary conditions and error scenarios

[↑ Back to Top](#table-of-contents)

### 8. Edge Cases and Refinements with RTK Query Advanced Patterns
- Maintain optimistic updates using RTK Query's built-in optimistic update patterns
- Ensure all data flows through RTK Query cache or Redux store; eliminate component-level fetching
- Use createSelector with reselect for memoized derived state computations
- **Leverage RTK Query's streaming updates and real-time synchronization** instead of WebSocket observables
- Use RTK Query's cache invalidation and prefetching for performance optimization

## Debugging Strategies

Effective debugging is essential for maintaining a functional programming codebase with Redux Toolkit. This section covers systematic debugging approaches, Redux-specific debugging techniques, and tools for diagnosing issues efficiently.

### Before You Begin Debugging

#### Gather Information

Before diving into code, systematically gather information about the bug:

- **Understand the exact symptoms**: What is the actual behavior vs. expected behavior?
- **Reproduce consistently**: Can you reliably reproduce the bug? Document the exact steps.
- **Check recent changes**: Did the bug coincide with recent commits, dependency updates, or configuration changes?
- **Review error messages**: Read error messages and stack traces carefully - they often point directly to the issue
- **Check related systems**: Are there issues with APIs, network, or external dependencies?

#### Form a Hypothesis

Based on the information gathered, make an educated guess about where the problem might be:

- **Identify likely areas**: Which slices, components, or services are involved?
- **Consider data flow**: Trace the expected data flow from action dispatch → reducer → selector → component
- **Think about edge cases**: Could this be a boundary condition or race condition?
- **Review similar issues**: Have you seen similar bugs before? Check git history or documentation

### Systematic Debugging Approach

#### 1. Reproduce the Bug Consistently

**Critical First Step**: You cannot debug what you cannot reproduce.

- **Document exact steps**: Write down every step needed to reproduce the bug
- **Note environment details**: Browser, OS, user state, network conditions
- **Check if intermittent**: If the bug is intermittent, note what conditions make it more likely
- **Simplify reproduction**: Remove unnecessary steps to create a minimal reproduction case

#### 2. Use Console Logs Strategically

Console logs are your first line of defense, but use them strategically:

**Best Practices for Console Logging:**

- **Add specific log statements** in suspected areas to track execution flow and variable states
- **Use consistent log format** with a unique trace ID to link events across different services or components
- **Log at key points**: Action dispatches, reducer entries/exits, selector calls, component renders
- **Include context**: Log relevant state, props, and computed values
- **Use log levels**: Use `console.log`, `console.warn`, `console.error` appropriately
- **Remove debug logs**: Clean up debug logs before committing (or use a logging utility that can be disabled in production)

**For automatic state change logging, use `redux-logger` middleware** (see [Middleware Configuration Patterns](#middleware-configuration-patterns)) instead of adding `useEffect` hooks in components. This keeps logging centralized and aligned with functional programming principles.

**DO NOT use `useEffect` for:**
- Mount logging (component mount/unmount tracking)
- Component state logging (tracking component state changes)
- Debugging state changes (tracking Redux state or component props changes)
- Any logging that depends on component lifecycle or state changes

**All logging must go through Redux middleware:**
- Redux state changes are automatically logged by `redux-logger` middleware
- Mount/unmount tracking should be handled through Redux actions if needed
- Component state tracking should be done through Redux actions and redux-logger
- Debugging should use Redux DevTools and redux-logger, not component hooks

Add logging in reducers to track action dispatches with payload and current state only if needed for specific debugging scenarios. For general state change logging, rely on `redux-logger` middleware.

#### 3. Use Debuggers Effectively

Debuggers provide the most powerful way to inspect code execution:

**Setting Breakpoints:**

- **Set breakpoints at critical points**: Action dispatches, reducer functions, selector calls, component lifecycle methods
- **Use conditional breakpoints**: Break only when specific conditions are met (e.g., `action.type === 'SPECIFIC_ACTION'`)
- **Step through code**: Use step over, step into, and step out to trace execution flow
- **Inspect variables**: Check variable values, state, props, and computed values at each breakpoint
- **Watch expressions**: Set up watch expressions for values you want to monitor continuously

**Redux-Specific Debugging:**

- **Break in reducers**: Set breakpoints in reducer functions to see state transformations
- **Break in selectors**: Set breakpoints in selector functions to see how state is being accessed
- **Break in action creators**: Set breakpoints in action creators (or where actions are dispatched) to inspect payloads
- **Break in middleware**: Set breakpoints in middleware to see actions as they flow through the middleware chain

#### 4. Isolate the Problem

Use the "divide and conquer" method to narrow down the bug's location:

**Isolation Techniques:**

- **Comment out sections**: Temporarily comment out sections of code to isolate the problematic area
- **Simplify the problem**: Remove unnecessary features or data to create a minimal reproduction
- **Test in isolation**: Extract the suspected code into a test file and test it independently
- **Binary search**: Systematically eliminate half of the codebase until you find the issue
- **Disable features**: Temporarily disable features or middleware to see if they're related

**Redux Isolation:**

- **Test reducers in isolation**: Create a test that directly calls the reducer with known inputs
- **Test selectors in isolation**: Test selectors with mock state to verify they work correctly
- **Test actions independently**: Dispatch actions manually in the console to see their effects
- **Isolate slices**: Temporarily disable other slices to see if cross-slice interactions are causing issues

#### 5. Analyze Errors and Stack Traces

Error messages and stack traces are direct hints to the source of problems:

**Reading Stack Traces:**

- **Start from the top**: The top of the stack trace shows where the error occurred
- **Follow the call stack**: Trace back through the call stack to understand the execution path
- **Look for your code**: Focus on stack frames from your application code, not library internals
- **Check line numbers**: Verify the line numbers match your current code (may be off if source maps are incorrect)

**Interpreting Error Messages:**

- **Read the full message**: Error messages often contain helpful context
- **Search for the error**: Use online resources or documentation to understand cryptic error messages
- **Check TypeScript errors**: TypeScript errors can reveal type mismatches or incorrect usage
- **Review Redux errors**: Redux-specific errors (e.g., "Actions must be plain objects") point to specific issues

#### 6. Leverage Browser DevTools

Browser DevTools provide powerful debugging capabilities:

**Network Tab:**

- **Check API calls**: Verify RTK Query requests are being made correctly
- **Inspect request/response**: Check request payloads, headers, and response data
- **Monitor network errors**: Look for failed requests, timeouts, or CORS issues
- **Check cache behavior**: Verify RTK Query cache is working as expected

**Application Tab:**

- **Inspect storage**: Check LocalStorage and SessionStorage for unexpected data
- **View Redux state**: Use Redux DevTools (see below) to inspect store state
- **Check cookies**: Verify authentication cookies or session data

**Console Tab:**

- **Monitor console errors**: Watch for runtime errors, warnings, or deprecation notices
- **Use console utilities**: `console.table()`, `console.group()`, `console.time()` for better debugging
- **Access global objects**: Use console to access and inspect global objects (see Redux store access below)

**Performance Tab:**

- **Profile rendering**: Use React Profiler to identify performance bottlenecks
- **Monitor re-renders**: Check if components are re-rendering unnecessarily
- **Analyze bundle size**: Verify code splitting and lazy loading are working

### Redux-Specific Debugging

#### Accessing Redux Store from Browser Console

During debugging, you often need to access the Redux store directly from the browser console. There are several methods:

**Method 1: Expose Store to Window (Recommended for Development)**

The simplest approach is to expose the store to the `window` object during development. In your store configuration, add a check to expose the store only in development mode. Then access it from the browser console using `window.__REDUX_STORE__.getState()` and `window.__REDUX_STORE__.dispatch()`.

**Method 2: Using React DevTools**

If you have React DevTools installed, you can access the store through the selected component. Open React DevTools, select the Provider component, and use `$r` in the console to access the store via `$r.props.store` or `$r.state.store`.

**Method 3: Using Redux DevTools Extension**

The Redux DevTools Extension provides the most powerful debugging experience (see below).

#### Redux DevTools Extension

The Redux DevTools Extension is the recommended tool for debugging Redux applications. It's automatically set up when using `configureStore` from Redux Toolkit.

**Features:**

- **Time-travel debugging**: Step backward and forward through action history
- **State inspection**: View the entire Redux state tree at any point in time
- **Action inspection**: See all dispatched actions with their payloads
- **Diff view**: See exactly what changed in state after each action
- **Export/Import**: Export state and action history for sharing or testing
- **Action filtering**: Filter actions by type to focus on specific actions
- **State persistence**: Persist state across page reloads

**Usage:**

1. **Install the extension**: Install Redux DevTools Extension for Chrome or Firefox
2. **Open DevTools**: Open browser DevTools and click the "Redux" tab
3. **Inspect actions**: See all dispatched actions in chronological order
4. **Inspect state**: Click on any action to see the state at that point
5. **Time-travel**: Use the slider or buttons to jump to any point in action history
6. **Dispatch actions**: Manually dispatch actions from the DevTools interface

**Accessing Store from Console with DevTools:**

When Redux DevTools is installed, you can access the store via `window.__REDUX_STORE__.getState()` (if exposed) or through React DevTools using `$r.props.store.getState()`.

#### Debugging Redux Slices

**Reducer Debugging:**

- **Add logging in reducers**: Log state before and after transformations
- **Use Redux DevTools**: Step through reducer execution in DevTools
- **Test reducers directly**: Write unit tests that call reducers with known inputs
- **Check immutability**: Verify reducers are not mutating state (Redux Toolkit's Immer helps here)

**Action Debugging:**

- **Log action dispatches**: Add logging where actions are dispatched
- **Inspect action payloads**: Verify action payloads have the expected structure
- **Check action types**: Ensure action types match between dispatch and reducer
- **Use Redux DevTools**: See all dispatched actions in the DevTools action log

**Selector Debugging:**

- **Log selector calls**: Add logging in selector functions to see when they're called
- **Check memoization**: Verify selectors are properly memoized and not recomputing unnecessarily
- **Test selectors directly**: Write unit tests for selectors with mock state
- **Profile selector performance**: Use React Profiler to identify slow selectors

#### Debugging RTK Query

RTK Query provides built-in debugging capabilities:

**RTK Query DevTools Integration:**

- **View cache state**: See all cached queries and their data in Redux DevTools
- **Monitor query lifecycle**: Track query states (pending, fulfilled, rejected)
- **Inspect mutations**: See mutation requests and responses
- **Check cache invalidation**: Verify tags and cache invalidation are working

**Console Access to RTK Query:**

Access RTK Query cache state from the console by accessing `store.getState().api`. View cached queries via `api.queries` and cached mutations via `api.mutations`.

**Common RTK Query Issues:**

- **Cache not updating**: Check tag invalidation, verify tags are correctly defined
- **Queries not refetching**: Verify `setupListeners` is called, check refetch conditions
- **Network errors**: Check base query configuration, verify API endpoints
- **Transform errors**: Verify `transformResponse` and `transformErrorResponse` functions

#### Debugging Listener Middleware

When debugging listener middleware:

- **Log listener triggers**: Add logging to see when listeners are triggered
- **Check action matching**: Verify action matchers are correctly configured
- **Inspect listener state**: Log state and action in listener callbacks
- **Test listeners in isolation**: Write unit tests for listener middleware

### After Finding the Bug

#### Write Tests

Once you've identified and fixed the bug, write tests to prevent regression:

- **Create a regression test**: Write a test that reproduces the bug (it should fail before the fix, pass after)
- **Test the fix**: Verify the fix works with the new test
- **Test edge cases**: Add tests for related edge cases that might have similar issues
- **Update existing tests**: If the bug revealed issues with existing tests, update them

Write a regression test that reproduces the bug scenario. Create initial state that triggers the bug, dispatch the action that caused the issue, and verify the expected state after the fix.

#### Document the Bug

Keep a record of the bug for future reference:

- **Document the symptoms**: What was the bug's behavior?
- **Document reproduction steps**: How to reproduce the bug
- **Document the root cause**: What was the actual cause of the bug?
- **Document the solution**: How was the bug fixed?
- **Document prevention**: What can be done to prevent similar bugs?

#### Seek a Fresh Perspective

Sometimes explaining the problem helps you see the solution:

- **Rubber duck debugging**: Explain the problem to a colleague or even a rubber duck
- **Code review**: Ask for a code review - fresh eyes often spot issues
- **Pair programming**: Work with another developer to debug together
- **Take a break**: Step away from the problem and return with fresh eyes

### Debugging Best Practices Summary

**Do:**

- ✅ Reproduce the bug consistently before debugging
- ✅ Use systematic approaches (divide and conquer, hypothesis testing)
- ✅ Leverage Redux DevTools for state inspection and time-travel
- ✅ Add strategic logging at key points in the data flow
- ✅ Test reducers, selectors, and actions in isolation
- ✅ Write regression tests after fixing bugs
- ✅ Document bugs and solutions for future reference

**Don't:**

- ❌ Debug without reproducing the bug first
- ❌ Add excessive logging that clutters the console
- ❌ Mutate state directly (always use actions and reducers)
- ❌ Skip writing tests after fixing bugs
- ❌ Debug in production (use development tools and environments)
- ❌ Ignore error messages and stack traces

### Debugging Resources

**Redux Debugging:**
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension)
- [Redux Toolkit Debugging Guide](https://redux-toolkit.js.org/usage/debugging)
- [Accessing Redux Store from Console](https://stackoverflow.com/questions/34373462/while-debugging-can-i-have-access-to-the-redux-store-from-the-browser-console)

**General Debugging:**
- [Debugging Strategies for Experienced Developers](https://www.reddit.com/r/ExperiencedDevs/comments/udvcfo/what_are_your_strategies_for_debugging_hard_or/)
- [Crushing Bugs: A Developer's Guide](https://medium.com/@riaanfnel/crushing-bugs-a-developers-guide-to-debugging-like-a-pro-d673906ae0dc)

---

## Related Documentation

- **For quick reference checklist**: [Condensed Version](./technology-maintenance-condensed.md)
- **For detailed patterns and examples**: [Standard Version](./technology-maintenance.md)

[↑ Back to Top](#table-of-contents)
