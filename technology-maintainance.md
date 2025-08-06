# FP Maintainance Strategy

This document outlines maintaining a codebase in pure functional programming (FP) style. The goal is to use functions for everything, ensure immutability, avoid side effects where possible, and use explicit state passing. We'll leverage Redux Toolkit's createReducer, createSlice, and Immer for efficient immutable state management. As per our architectural strategy, Redux Toolkit (RTK) and RTK Query are the definitive choice for state management and data fetching, superseding reactive programming libraries.js. Prioritize core files first, then components.

The codebase should be lean and modular. Maintain separation of concerns with component and slice design. Use multiple command dispatchers for different parts of the application. Keep files small and focused. Try not to have too many functions (preferably only one) in a single file. Keep boilerplate logic separate from business logic. Keep business logic in separate files.


### 1. **Lean and Modular Codebase**
- **Lean**: Avoid unnecessary code, duplication, or bloat. Every file and function should have a clear, necessary purpose.
- **Modular**: Break the application into small, independent modules. Each module should encapsulate a single responsibility or feature.

### 2. **Separation of Concerns**
- **Component and Slice Design**: UI components should focus on rendering and user interaction, while Redux slices (state logic) should handle state and business rules.
- **No Mixing**: Don’t mix UI logic with business logic or state management in the same file.

### 3. **Multiple Command Dispatchers**
- **Purpose**: Use different command dispatchers (handlers for actions/commands) for different domains.
- **Benefit**: This keeps each dispatcher focused and easier to maintain or extend.

### 4. **Small, Focused Files**
- **Single Responsibility**: Each file should do one thing (e.g., a single slice, a single component).
- **Easier Maintenance**: Small files are easier to read, test, and refactor.

### 5. **Limit Functions per File**
- **Preferably One Function per File**: This enforces clarity and makes it easy to locate and test logic.

### 6. **Boilerplate vs. Business Logic**
- **Boilerplate Logic**: Code that sets up infrastructure (e.g., Redux store setup, API base queries) should be isolated from business rules.
- **Business Logic**: Core application rules should live in their own files, separate from setup or glue code.

### 7. **No Consolidation of Business Logic**
- **Don’t Centralize**: Avoid putting all business rules in a single file. Instead, distribute them according to feature or domain.
- **Benefit**: This prevents files from becoming too large and complex, and makes it easier to reason about and test each part of the system.

**Why?**
- **Maintainability**: Easier to update, debug, and onboard new developers.
- **Testability**: Isolated logic is easier to test.
- **Scalability**: Adding new features or domains is straightforward.

**Redux Toolkit (RTK) and RTK Query are the official, modern Redux approach and take absolute priority.**

## Guiding Principles

### Redux's Three Core Principles (FP-Aligned)
- **Single Source of Truth**: All application state lives in one Redux store object tree, ensuring predictable state access.
- **State is Read-Only**: State can only be changed by dispatching actions - pure objects describing what happened.
- **Changes are Made with Pure Functions**: Reducers are pure functions that take previous state and an action, returning new state without mutations.

### Why RTK and RTK Query Over Alternatives
**RTK Query eliminates the need for most hand-written data fetching logic**, replacing complex thunk/saga patterns with purpose-built data fetching and caching solutions. Unlike reactive patterns:

- **RTK Query** provides automatic caching, invalidation, and background refetching out-of-the-box
- **Dedicated API slices per service** with a shared base query reduce complexity and boilerplate compared to observable streams
- **Built-in optimistic updates** and error handling without additional reactive libraries
- **Seamless Redux DevTools integration** for debugging and time-travel
- **TypeScript-first design** with excellent inference and type safety
- **Official Redux team support** ensuring long-term maintenance and best practices

### Modern Redux Architecture Priorities
1. **RTK Query First**: Use RTK Query for all data fetching, caching, and server state synchronization
2. **RTK Slices**: Use createSlice for client-side state management with built-in Immer integration
3. **Avoid Legacy Patterns**: No hand-written thunks, sagas, or observables for data fetching
4. **Functional Purity**: Maintain pure reducer functions while leveraging RTK's built-in middleware for side effects

### FP Implementation Guidelines
- **Functions Only**: Use functions for everything, including factories returning objects with methods (closures for private state).
- **Immutability**: Use Redux Toolkit's createReducer and createSlice with built-in Immer integration for safe "mutations".
- **Purity**: Reducers must be pure functions; isolate side effects in RTK Query endpoints and createAsyncThunk.
- **Unidirectional Data Flow**: Actions dispatched → Reducers update state → UI re-renders → User interactions → Actions dispatched.
- **Reducer-Centric Architecture**: All state changes flow through pure reducer functions using createSlice and createReducer from RTK.
- **Predictable State Updates**: Use action creators and typed actions to make state changes explicit and traceable.
- **Events**: Use Redux actions dispatched through the store for centralized event handling, with RTK listener for reactivity.
- **Async Operations**: Use createAsyncThunk from RTK for async logic; leverage RTK Query for data fetching and caching.
- **Tools**: Prioritize RTK's createSlice, createAsyncThunk, RTK Query, createEntityAdapter, and createSelector. Use RTK's built-in features for reactivity.

## Plan

### 1. Redux Store Foundation
- Review configuration of Redux store using configureStore.
- Maintain Redux slices for major domains.
- Maintain RTK Query API slices for centralized data fetching and caching.
- Maintain typed hooks (useAppDispatch, useAppSelector) for type-safe Redux integration.
- Maintain root reducer combining all domain slices using combineReducers pattern.

### 2. Maintain Core Utilities with Reducer-First Approach
- **Strategy**:
  - **Replace all manual data fetching** with RTK Query endpoints
  - Maintain Redux slices for client-side state only (UI state, form state, computed state)
  - Use RTK Query's built-in caching, invalidation, and background sync
  - Maintain pure functions that return analysis results via RTK Query transformResponse
  - Leverage createEntityAdapter from RTK for normalized data when needed by RTK Query

### 3. Maintain CLI and Entry Point with RTK Query Integration
- **Strategy**:
  - Maintain with pure command handlers that dispatch actions to appropriate slices.
  - **Integrate RTK Query hooks** for all data fetching in CLI commands
  - Maintain command handlers as pure functions that use RTK Query for API calls
  - Use RTK Query's polling and real-time features instead of manual intervals

### 4. Maintain Components with Reducer-Based State
- **Strategy**:
  - Maintain factories that consume Redux state via selectors and RTK Query hooks.
  - **Replace useEffect + fetch patterns** with RTK Query hooks (useGetQuery, useMutation)
  - Maintain component-specific slices only for local UI state using RTK createSlice.
  - Maintain render functions that compose smaller pure helpers receiving state via selectors and RTK Query data.

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

### 7. Testing and Validation with RTK Query Testing Patterns
- Maintain unit tests for reducers as pure functions using RTK's testing utilities.
- **Test RTK Query endpoints** using Mock Service Worker (MSW) with RTK Query's testing helpers
- Maintain integration tests for complete Redux + RTK Query data flow
- Use Redux DevTools Extension for debugging RTK Query cache and network requests
- **Avoid testing observable streams** - focus on RTK Query endpoint behavior and caching

### 8. Edge Cases and Refinements with RTK Query Advanced Patterns
- Maintain optimistic updates using RTK Query's built-in optimistic update patterns
- Ensure all data flows through RTK Query cache or Redux store; eliminate component-level fetching
- Use createSelector with reselect for memoized derived state computations
- **Leverage RTK Query's streaming updates and real-time synchronization** instead of WebSocket observables
- Use RTK Query's cache invalidation and prefetching for performance optimization
