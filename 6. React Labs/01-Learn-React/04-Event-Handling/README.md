# Chapter 4 — Event Handling

---

## Topics Covered

- `onClick`
- `onChange`
- Event object
- Controlled inputs

---

## What is Event Handling in React?

Events are things the **user does** — clicking a button, typing in a field, submitting a form. React lets you **listen** for these events and **run a function** in response.

React events work almost the same as HTML events, with two differences:

| HTML | React |
|---|---|
| `onclick="..."` | `onClick={...}` |
| `onchange="..."` | `onChange={...}` |
| Takes a string | Takes a **function** |
| `<button onclick="doThis()">` | `<button onClick={doThis}>` |

The naming is **camelCase** in React (`onClick`, `onChange`, `onSubmit`), and you always pass a **function reference**, not a string.

---

## Key Patterns

### Pattern 1 — Inline Arrow Function

Write the handler directly on the element. Best for short, simple logic.

```jsx
// The function is written inline — runs when button is clicked
<button onClick={() => alert('clicked!')}>Click</button>
```

---

### Pattern 2 — Named Handler Function

Define the function separately, then reference it. Best for longer or reusable logic.

```jsx
// Define the function separately — cleaner and easier to read
function handleClick() {
  alert('clicked!');
}

// Pass the function reference — NO parentheses ()
<button onClick={handleClick}>Click</button>
//               ^ no () here — passing the function, not calling it
```

> ⚠️ **Critical distinction:**
> - `onClick={handleClick}` → passes the function, runs **on click** ✅
> - `onClick={handleClick()}` → **calls it immediately** on render, not on click ❌

---

### Pattern 3 — The Event Object `e`

When a user interacts with an element, React passes an **event object** to your handler automatically. This object contains information about what happened — what was typed, which key was pressed, which element was clicked, etc.

```jsx
// React automatically passes the event object as the first argument
<input onChange={(e) => console.log(e)} />

// The most useful property: e.target.value — what the user typed
<input onChange={(e) => setValue(e.target.value)} />
//                ^                  ^
//          event object      the current text in the input
```

Think of `e.target` as **"the element that triggered the event"** and `e.target.value` as **"the current value of that element"**.

---

## Controlled Inputs — The Most Important Pattern

A **controlled input** is an input whose value is **driven by React state**, not the browser.

### Uncontrolled input (browser controls the value):
```jsx
// The browser manages what's in this input — React doesn't know
<input type="text" />
```

### Controlled input (React controls the value):
```jsx
const [inputValue, setInputValue] = useState('');

// React controls both the display (value=) and updates (onChange=)
<input
  value={inputValue}              // what to display — comes from state
  onChange={(e) => setInputValue(e.target.value)}  // update state on every keystroke
/>
```

**How it works — the loop:**

```
User types "A"
    ↓
onChange fires → e.target.value = "A"
    ↓
setInputValue("A") is called
    ↓
React re-renders → input displays "A"
    ↓
User types "B" → same loop repeats
```

**Why use controlled inputs?**

- You can **read the value** at any time via state (`inputValue`)
- You can **programmatically clear** the input: `setInputValue("")`
- You can **validate** input before displaying it
- The input value and your state are always **in sync**

---

## Spreading Array State — The `...` Spread Operator

When adding a new item to a list in state, you must create a **new array** (immutability rule from Chapter 3). The spread operator `...` makes this clean:

```jsx
const [items, setItems] = useState([]);

// ❌ Wrong — mutating existing state directly
items.push(newItem);
setItems(items);

// ✅ Correct — creating a brand new array with all old items + new one
setItems([...items, newItem]);
//          ^ copy all existing items, then add newItem at the end
```

`[...items, newItem]` means: "make a new array containing everything from `items`, plus `newItem` at the end."

---

## Rendering Lists with `.map()`

To render an array of items as JSX, use JavaScript's `.map()` method inside `{}`:

```jsx
const items = ['Apple', 'Banana', 'Cherry'];

// .map() transforms each item in the array into a <li> element
<ul>
  {items.map((item, index) => (
    <li key={index}>{item}</li>
    //  ^ key is required — explained below
  ))}
</ul>

// Renders:
// <ul>
//   <li>Apple</li>
//   <li>Banana</li>
//   <li>Cherry</li>
// </ul>
```

---

## The `key` Prop — Why It's Required on Lists

When rendering a list, React needs a **`key`** on each element to track which items changed, were added, or were removed. Without it, React re-renders the whole list inefficiently and may display bugs.

```jsx
// ❌ Missing key — React will warn and may behave incorrectly
{items.map((item) => <li>{item}</li>)}

// ✅ With index as key — acceptable for simple static lists
{items.map((item, index) => <li key={index}>{item}</li>)}

// ✅ With unique id as key — best practice for real data
{items.map((item) => <li key={item.id}>{item.name}</li>)}
```

> **Note on `index` as key:** Using the array index as a key is fine for simple, non-reorderable lists (like this exercise). For lists where items can be deleted or reordered, use a unique ID instead — otherwise React can mix up which element is which.

---

## The Task

> Build an item list with a controlled input, add functionality, and list rendering.

```
App component:
  ├── State 1: inputValue (string) — tracks what's typed in the input
  ├── State 2: items (array)       — the list of added items
  │
  ├── <input id="item-input">     — controlled input, shows inputValue
  ├── <button id="add-btn">       — calls addItem on click
  └── <ul id="item-list">
        └── {items.map(...)}       — one <li> per item
```

---

## Solution

```jsx
import { useState } from 'react';

function App() {

  // State 1: tracks what the user is currently typing in the input
  const [inputValue, setInputValue] = useState('');

  // State 2: the array of all added items — starts empty
  const [items, setItems] = useState([]);

  // Handler: called when the Add button is clicked
  function addItem() {
    // Add the current inputValue to the items array
    // Spread ...items copies all existing items into a new array
    // then we add inputValue at the end
    setItems([...items, inputValue]);

    // Clear the input by resetting inputValue state to empty string
    setInputValue('');
  }

  return (
    <div>

      {/* Controlled input:
          - value={inputValue} makes React control what's displayed
          - onChange updates state on every keystroke via e.target.value */}
      <input
        id="item-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {/* Named handler — onClick references addItem without calling it */}
      <button
        id="add-btn"
        onClick={addItem}
      >
        Add
      </button>

      {/* Render the items array as a list
          .map() returns one <li> per item
          key={index} helps React track each element efficiently */}
      <ul id="item-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>
  );
}
```

### What happens step by step when a user types "React" and clicks Add

```
1. User types "R" into the input
   → onChange fires → e.target.value = "R"
   → setInputValue("R") → inputValue = "R" → re-render

2. User types "e", "a", "c", "t" — same loop, inputValue becomes "React"

3. User clicks "Add"
   → addItem() runs
   → setItems([...items, "React"]) → items = ["React"]
   → setInputValue("") → inputValue = ""
   → re-render

4. UI updates:
   → input is now empty (controlled — React cleared it)
   → <ul> now shows: <li>React</li>
```

---

## Test Cases

### ✅ Test 1 — Has an input with `id="item-input"`

```jsx
<input
  id="item-input"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
```

**What is being checked:** An `<input>` element exists in the DOM with `id="item-input"`. The test simulates typing and checks the input is responsive (controlled).

---

### ✅ Test 2 — Typing and clicking Add adds item to list

```jsx
// The addItem function takes the current inputValue and appends it to items
function addItem() {
  setItems([...items, inputValue]);
  setInputValue('');
}

<button id="add-btn" onClick={addItem}>Add</button>
```

**What is being checked:** After typing text into the input and clicking the button with `id="add-btn"`, a new `<li>` appears inside `<ul id="item-list">` with the typed text.

---

### ✅ Test 3 — Input clears after adding an item

```jsx
function addItem() {
  setItems([...items, inputValue]);
  setInputValue('');  // ← this line is what clears the input
}
```

**What is being checked:** After clicking Add, the input's value becomes empty (`""`). This only works because it's a **controlled input** — React sets `value={inputValue}` so when `inputValue` is reset to `""`, the input visually clears.

---

### ✅ Test 4 — Can add multiple items

```jsx
// Each click appends to the existing items array
// First click:  items = ["React"]
// Second click: items = ["React", "Hooks"]
// Third click:  items = ["React", "Hooks", "State"]
setItems([...items, inputValue]);
```

**What is being checked:** Clicking Add multiple times adds multiple `<li>` elements to the list — they accumulate rather than replace each other. This works because `...items` preserves all previous items.

---

## What I Learned From This Exercise

1. **React events use camelCase.** `onClick`, `onChange`, `onSubmit` — not `onclick`, `onchange`. React normalises events across all browsers into a **SyntheticEvent** system.

2. **Always pass a function to event handlers, never a call.** `onClick={handleClick}` is correct. `onClick={handleClick()}` runs the function immediately on render — almost always a bug.

3. **The event object `e` carries information about the interaction.** For inputs, `e.target.value` is the most important property — it holds whatever the user typed at that moment.

4. **Controlled inputs keep React in charge of the input's value.** By setting `value={state}` and updating state `onChange`, the input and your state are always perfectly in sync. This is the standard React pattern for forms.

5. **Clearing a controlled input is trivial.** Just set the state back to `""`. Because React controls the `value` attribute, the input visually clears too. This would be much harder with an uncontrolled input.

6. **You need two separate pieces of state for this kind of feature.** One for what's currently being typed (`inputValue`), and one for the stored list (`items`). Each has a different role and a different lifecycle.

7. **The spread operator `...` is how you add items to array state without mutating.** `setItems([...items, newItem])` creates a brand new array — it doesn't modify the existing one. This follows React's immutability rule.

8. **`.map()` is the standard way to render a list.** It transforms an array of data into an array of JSX elements. React renders that array automatically.

9. **Every item in a mapped list needs a `key` prop.** React uses keys to efficiently track which list items changed. Without keys, React re-renders the entire list on every change. `key={index}` is acceptable for simple lists; unique IDs are better for real data.

10. **Named handler functions keep JSX clean.** When the logic is more than one line (like `addItem` which does two things), extracting it into a named function makes the JSX easier to read and the logic easier to maintain.

---

## Quick Reference Summary

| Concept | Syntax | Notes |
|---|---|---|
| Click handler (inline) | `onClick={() => doSomething()}` | Good for simple one-liners |
| Click handler (named) | `onClick={handleClick}` | No `()` — pass reference |
| Change handler | `onChange={(e) => setValue(e.target.value)}` | `e.target.value` = typed text |
| Controlled input | `value={state}` + `onChange` | React owns the input value |
| Clear input | `setInputValue('')` | Only works on controlled inputs |
| Add to array state | `setItems([...items, newItem])` | Never mutate — spread to copy |
| Render list | `{items.map((item, i) => <li key={i}>{item}</li>)}` | Always include `key` |
| Event object | `e` in `(e) => ...` | Auto-passed by React |
| Key prop | `key={index}` or `key={item.id}` | Required on list elements |

<!-- Chapter 4
Event Handling

onClick
onChange
Event object
Controlled inputs
Event Handling
React events are named using camelCase: onClick, onChange, onSubmit. You pass a function as the handler, not a string.

Key Patterns
// Inline handler
<button onClick={() => alert('clicked!')}>Click</button>

// Named handler
function handleClick() { alert('clicked!'); }
<button onClick={handleClick}>Click</button>

// With event object
<input onChange={(e) => setValue(e.target.value)} />
Your Task
Build a simple item list:

Create an input with id "item-input" for typing items
Track the input value in state
Add a button with id "add-btn" that adds the input text to a list
After adding, clear the input
Render the list as <ul id="item-list"> with <li> elements
Each <li> should display the item text


function App() {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);

  function addItem() {
    setItems([...items, inputValue]);
    setInputValue("");
  }
  

  return (
    <div>
      {/* Add input, button, and list here */}
      <input 
        id="item-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button 
        id="add-btn"
        onClick={addItem}>
        Add
      </button>
      <ul id="item-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}




Has an input with id "item-input"
✓
Typing and clicking Add adds item to list
✓
Input clears after adding an item
✓
Can add multiple items


Add the tasks with the solution, with test cases and explanations in markdown format.
make notes of the lessons i learnt using this exercise
make notes in english in md format.
never miss any point
explain things easily
also use comments in code(if available -->