# Chapter 3 — State & useState

---

## Topics Covered

- `useState` hook
- State updates
- Re-rendering
- Immutability

---

## What is State?

**State** is data that **belongs to a component and can change over time**.

When state changes, React **automatically re-renders** the component to show the updated value on screen. You don't manually update the DOM — React does it for you.

Compare the two:

| | Regular Variable | State |
|---|---|---|
| Declared with | `const count = 0` | `useState(0)` |
| Can change? | No (re-render won't happen) | Yes (triggers re-render) |
| React tracks it? | No | Yes |
| Updates the UI? | No | Yes, automatically |

```jsx
// ❌ Regular variable — changing it does NOT update the UI
let count = 0;
count = count + 1; // React has no idea this changed

// ✅ State — changing it DOES update the UI
const [count, setCount] = useState(0);
setCount(count + 1); // React sees the change and re-renders
```

---

## How `useState` Works

```jsx
const [count, setCount] = useState(0);
//     ^          ^                ^
//   value    setter fn     initial value
```

`useState` is a **React Hook** — a special function that gives your component memory.

It returns an **array of exactly two things**:

1. **The current value** — `count` (starts as `0`)
2. **The setter function** — `setCount` (the only way to update the value)

This is **array destructuring** — the same JavaScript feature from Chapter 2, applied to arrays instead of objects:

```jsx
// useState returns: [currentValue, setterFunction]
const stateArray = useState(0);
const count = stateArray[0];      // current value
const setCount = stateArray[1];   // setter function

// Shorthand using array destructuring (what everyone uses)
const [count, setCount] = useState(0);
```

---

## Key Concepts

### 1. Calling the Setter Triggers a Re-Render

Every time you call `setCount(...)`, React:
1. Updates the state value
2. Re-renders the component with the new value
3. Updates the DOM to reflect what changed

```jsx
// When this button is clicked:
<button onClick={() => setCount(count + 1)}>+</button>

// React does:
// 1. setCount is called with the new value
// 2. Component function runs again
// 3. JSX is recalculated with the new count
// 4. Only the changed part of the DOM updates
```

---

### 2. Two Ways to Call the Setter

#### Way 1 — Pass the new value directly

```jsx
// Simple, works fine for basic cases
setCount(count + 1);
setCount(0);           // reset to 0
setCount(count - 1);
```

#### Way 2 — Pass a function (functional update) ✅ Preferred

```jsx
// Pass a function that receives the PREVIOUS state as its argument
setCount(prev => prev + 1);
setCount(prev => prev - 1);
```

**Why prefer the functional form?**

React can **batch multiple state updates** together for performance. If you call `setCount` multiple times quickly, the `count` variable in your code may be stale (old). Using `prev => prev + 1` guarantees you're always working from the **latest** state value, not a potentially outdated snapshot.

```jsx
// ⚠️ Potentially unsafe — 'count' might be stale if batched
setCount(count + 1);

// ✅ Always safe — 'prev' is always the latest value
setCount(prev => prev + 1);
```

---

### 3. Never Modify State Directly

State must **only be changed through the setter function**. Modifying the variable directly does nothing — React won't know about the change.

```jsx
const [count, setCount] = useState(0);

// ❌ Wrong — directly modifying state, React won't re-render
count = count + 1;
count++;

// ✅ Correct — always use the setter
setCount(prev => prev + 1);
```

This is the **immutability** principle — treat state as something you **replace**, not **mutate**.

---

### 4. State is Local to Each Component Instance

Every time you use a component, it gets its **own independent state**. Two `<Counter />` components on the same page don't share state — they each have their own `count`.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(prev => prev + 1)}>{count}</button>;
}

function App() {
  return (
    <div>
      <Counter />  {/* has its own count, starts at 0 */}
      <Counter />  {/* has its own count, starts at 0 — independent */}
    </div>
  );
}
```

---

### 5. The Initial Value Only Runs Once

The value you pass to `useState(initialValue)` is only used on the **first render**. After that, React remembers the current state and ignores the initial value.

```jsx
// 0 is only used once — when the component mounts for the first time
const [count, setCount] = useState(0);
```

---

### 6. Event Handlers with `onClick`

Buttons in React use the `onClick` prop (not `onclick` like in HTML) to attach a function that runs when clicked.

```jsx
// ❌ Wrong — calling the function immediately instead of passing it
<button onClick={setCount(count + 1)}>+</button>
//                      ^ this runs right away on render, not on click!

// ✅ Correct — wrap in an arrow function so it runs ON click
<button onClick={() => setCount(prev => prev + 1)}>+</button>
//               ^ this is a function that WILL BE called on click
```

The `() =>` wrapper is crucial — it delays execution until the button is actually clicked.

---

## The Task

> Build a counter that can go up, down, and reset.

```
App component:
  ├── State: count, initialized to 0
  ├── <h2 id="count"> displaying current count
  ├── <button id="increment"> → increases count by 1
  ├── <button id="decrement"> → decreases count by 1
  └── <button id="reset">     → sets count back to 0
```

---

## Solution

```jsx
// Import useState from React
import { useState } from 'react';

function App() {

  // Declare state: count starts at 0
  // [current value, setter function] = useState(initial value)
  const [count, setCount] = useState(0);

  return (
    <div>

      {/* Display current count — re-renders every time count changes */}
      <h2 id="count">Count: {count}</h2>

      {/* INCREMENT button — uses functional update (prev => prev + 1)
          'prev' is guaranteed to be the latest value of count */}
      <button
        id="increment"
        onClick={() => setCount(prev => prev + 1)}
      >
        Increment
      </button>

      {/* DECREMENT button — subtracts 1 from current count */}
      <button
        id="decrement"
        onClick={() => setCount(prev => prev - 1)}
      >
        Decrement
      </button>

      {/* RESET button — sets count directly back to 0
          No need for functional update here since we're not using previous value */}
      <button
        id="reset"
        onClick={() => setCount(0)}
      >
        Reset
      </button>

    </div>
  );
}
```

### What happens step by step when "Increment" is clicked

```
1. User clicks the Increment button
2. onClick fires → () => setCount(prev => prev + 1) runs
3. React calls the updater function with current count (e.g. 0)
4. prev = 0, so it returns 0 + 1 = 1
5. React updates count to 1
6. App function re-runs (re-render)
7. JSX is recalculated: <h2>Count: 1</h2>
8. DOM updates — only the changed text node updates
```

---

## Test Cases

### ✅ Test 1 — Displays initial count of `0`

```jsx
// useState(0) sets the starting value
const [count, setCount] = useState(0);

// On first render, count is 0 — so this shows "Count: 0"
<h2 id="count">Count: {count}</h2>
```

**What is being checked:** On load, before any button is clicked, the `<h2>` displays `Count: 0`.

---

### ✅ Test 2 — Increment button increases count by 1

```jsx
<button
  id="increment"
  onClick={() => setCount(prev => prev + 1)}
>
  Increment
</button>
```

**What is being checked:** After clicking Increment, the displayed count increases by exactly 1. The test looks for a button with `id="increment"` and simulates a click.

---

### ✅ Test 3 — Decrement button decreases count by 1

```jsx
<button
  id="decrement"
  onClick={() => setCount(prev => prev - 1)}
>
  Decrement
</button>
```

**What is being checked:** After clicking Decrement, the displayed count decreases by exactly 1. The test looks for `id="decrement"`.

---

### ✅ Test 4 — Reset button sets count to `0`

```jsx
<button
  id="reset"
  onClick={() => setCount(0)}
>
  Reset
</button>
```

**What is being checked:** After incrementing/decrementing, clicking Reset sets count back to `0` regardless of its current value. The test looks for `id="reset"`.

---

## What I Learned From This Exercise

1. **State is how React remembers changing data.** A regular `let` variable resets on every render — state persists across renders because React manages it separately from the function body.

2. **`useState` returns two things** — the current value and a setter function. These are accessed via array destructuring: `const [count, setCount] = useState(0)`.

3. **You must use the setter to change state.** Directly writing `count = 5` does nothing visible — React doesn't know about it. Only calling `setCount(5)` tells React to update and re-render.

4. **The functional update form `prev => prev + 1` is safer than `count + 1`.** When React batches updates, `count` in your closure may be stale. `prev` inside the updater function is always the fresh, latest value.

5. **Calling the setter triggers a re-render.** React re-runs your component function and recalculates the JSX. Only the parts of the DOM that actually changed get updated — React handles this efficiently.

6. **The initial value in `useState(0)` is used only once** — on the very first render. After that, React remembers the current state and the initial value is ignored.

7. **Each component instance has its own state.** Two `<Counter />` components on the same page each maintain their own independent count — they don't share state automatically.

8. **`onClick` takes a function, not a function call.** `onClick={setCount(1)}` runs immediately on render (wrong). `onClick={() => setCount(1)}` runs only when clicked (correct). The arrow function delays execution.

9. **Immutability means you replace state, you don't mutate it.** For simple values like numbers this means using the setter. For objects and arrays (in later chapters), this means creating new copies rather than modifying the existing ones.

10. **`useState` is a Hook** — hooks are special React functions that always start with `use`. They must be called at the top level of a component, never inside conditions or loops.

---

## Quick Reference Summary

| Concept | Syntax | Notes |
|---|---|---|
| Declare state | `const [val, setVal] = useState(0)` | Initial value only used once |
| Read state | `{count}` in JSX | Re-renders when it changes |
| Update state (direct) | `setCount(5)` | Fine for simple resets |
| Update state (functional) | `setCount(prev => prev + 1)` | Preferred — always up to date |
| Reset state | `setCount(0)` | Pass the initial value |
| Attach click handler | `onClick={() => setCount(...)}` | Arrow fn delays execution |
| Direct mutation | `count = count + 1` | ❌ Never — React won't see it |
| Hook rule | Call at top of component | Never inside if/loops |

<!-- Chapter 3
State & useState


useState hook
State updates
Re-rendering
Immutability
State & useState
State is data that changes over time. When state changes, React re-renders the component to reflect the new data.

How useState Works
const [count, setCount] = useState(0);
//     ^          ^                ^
//   value    setter fn     initial value
useState returns an array: [currentValue, setterFunction]
Calling the setter triggers a re-render
Never modify state directly — always use the setter
Your Task
Build a counter component:

Initialize a count state to 0 using useState
Display the count in an <h2> with id "count"
Add an Increment button (id: "increment") that increases count by 1
Add a Decrement button (id: "decrement") that decreases count by 1
Add a Reset button (id: "reset") that sets count back to 0



function App() {
  // Add your state here
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2 id="count">Count: {count}</h2>
      {/* Add your buttons */}
      <button 
        id="increment" 
        onClick={() => setCount(prev => prev + 1)}>
        Increment
      </button>
      <button 
        id="decrement" 
        onClick={() => setCount(prev => prev - 1)}>
        Decrement
      </button>
      <button 
        id="reset" 
        onClick={() => setCount(0)}>
        Reset
      </button>
      
    </div>
  );
}


✓
Displays initial count of 0
✓
Increment button increases count by 1
✓
Decrement button decreases count by 1
✓
Reset button sets count to 0

Add the tasks with the solution, with test cases and explanations in markdown format.
make notes of the lessons i learnt using this exercise
make notes in english in md format.
never miss any point
explain things easily
also use comments in code(if available


 -->
