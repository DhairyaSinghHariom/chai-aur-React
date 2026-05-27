# Chapter 1 — JSX Basics

---

## Topics Covered

- JSX syntax
- Expressions with `{}`
- `className`
- Fragments

---

## What is JSX?

JSX stands for **JavaScript XML**. It lets you write HTML-like code **inside JavaScript**.

Even though it *looks* like HTML, it is **not** HTML. Under the hood, a tool called **Babel** converts JSX into plain JavaScript before the browser runs it.

### How JSX is converted

```jsx
// What you write (JSX)
<h1>Hello, React!</h1>

// What Babel converts it to (plain JavaScript)
React.createElement('h1', null, 'Hello, React!')
```

So JSX is just a **shortcut** — a friendlier way to write `React.createElement(...)` calls.

---

## Key Rules of JSX

### 1. Use `className` instead of `class`

In HTML you write `class="..."`. In JSX you must write `className="..."`.

**Why?** Because `class` is a **reserved keyword** in JavaScript (used for things like `class App {}`), so React uses `className` to avoid a naming conflict.

```jsx
// ❌ Wrong — 'class' is a reserved JS keyword
<p class="subtitle">Hello</p>

// ✅ Correct — use className in JSX
<p className="subtitle">Hello</p>
```

---

### 2. Embed JavaScript with Curly Braces `{}`

Inside JSX, anything inside `{ }` is treated as a **JavaScript expression**. This is how you display variables, calculations, or any dynamic value.

```jsx
function App() {
  const year = 2026; // a regular JavaScript variable

  return (
    <div>
      <p>{year}</p>                       {/* renders: 2026 */}
      <p>{2 + 3}</p>                      {/* renders: 5 */}
      <p>{"hello".toUpperCase()}</p>      {/* renders: HELLO */}
    </div>
  );
}
```

Think of `{}` as a **window into JavaScript** — any valid JavaScript expression can go inside.

> ⚠️ Only **expressions** work inside `{}`, not statements.
> - ✅ `{condition ? "yes" : "no"}` — works (ternary expression)
> - ❌ `{if (condition) { }}` — doesn't work (statement, not expression)

---

### 3. JSX Must Return a Single Root Element

A component can only return **one top-level element**. You cannot return two sibling elements side by side.

```jsx
// ❌ Wrong — two root elements, JSX won't compile
return (
  <h1>Hello</h1>
  <p>World</p>
);

// ✅ Correct — wrapped in a single <div>
return (
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>
);
```

---

### 4. Fragments — `<>` and `</>`

Wrapping everything in a `<div>` adds an **extra HTML node** to the page that you may not want. **Fragments** solve this — they group elements without adding any extra element to the DOM.

```jsx
// ✅ Using a Fragment — no extra <div> in the output HTML
return (
  <>
    <h1>Hello</h1>
    <p>World</p>
  </>
);

// Same thing, longer syntax
return (
  <React.Fragment>
    <h1>Hello</h1>
    <p>World</p>
  </React.Fragment>
);
```

Use `<>...</>` when you want to group elements **without polluting the DOM** with wrapper divs.

---

### 5. Self-Closing Tags Must End with `/>`

In HTML, some tags don't need a closing tag: `<img>`, `<br>`, `<input>`. In JSX, **every tag must be explicitly closed**, using `/>` for tags with no children.

```jsx
// ❌ Wrong — JSX requires explicit closing
<img src="photo.jpg">
<br>
<input type="text">

// ✅ Correct — self-closed with />
<img src="photo.jpg" />
<br />
<input type="text" />
```

---

### 6. JSX Comments

Regular JavaScript comments (`//` or `/* */`) don't work directly inside JSX markup. JSX has its own comment syntax — wrap them in `{}`:

```jsx
return (
  <div>
    {/* This is a valid JSX comment */}
    <h1>Hello</h1>
  </div>
);
```

---

## The Task

> Create an `App` component that renders the following structure:

```
A <div> wrapper containing:
  ├── An <h1> with the text "Hello, React!"
  ├── A <p> that displays the value of const year = 2026 using a JSX expression
  └── A <p> with className="subtitle" containing any text
```

**Hint:** Use `{year}` inside JSX to embed the variable.

---

## Solution

```jsx
function App() {
  // Step 1: Declare a plain JavaScript variable inside the component
  const year = 2026;

  return (
    // Step 2: Single root <div> wrapping all elements (satisfies the single root rule)
    <div>

      {/* Step 3: Plain static text inside an h1 */}
      <h1>Hello, React!</h1>

      {/* Step 4: Use {} to embed the JS variable 'year' — renders 2026 */}
      <p>{year}</p>

      {/* Step 5: className (NOT class) used for CSS targeting */}
      <p className="subtitle">This is random text</p>

    </div>
  );
}
```

### Why each line matters

| Line | What it does | Rule applied |
|---|---|---|
| `const year = 2026` | Declares a JS variable inside the component | Normal JavaScript |
| `<div>` wrapper | Wraps all elements in one root | Single root rule |
| `<h1>Hello, React!</h1>` | Renders static text | Basic JSX |
| `<p>{year}</p>` | Embeds the variable value dynamically | `{}` expressions |
| `className="subtitle"` | Adds a CSS class to the element | `className` rule |

---

## Test Cases

These are the four checks the exercise validates:

### ✅ Test 1 — Renders an `<h1>` with "Hello, React!"

```jsx
// The component must contain this exact h1
<h1>Hello, React!</h1>
```

**What is being checked:** The `<h1>` tag exists and its text content is exactly `"Hello, React!"`.

---

### ✅ Test 2 — Displays the year `2026` in a `<p>` tag

```jsx
// The variable must be embedded using {}
const year = 2026;
<p>{year}</p>  {/* outputs: 2026 */}
```

**What is being checked:** A `<p>` tag exists that renders the number `2026`, injected via a JSX expression — not hardcoded as plain text like `<p>2026</p>`.

---

### ✅ Test 3 — Has a `<p>` with `className="subtitle"`

```jsx
// The className attribute must be present
<p className="subtitle">This is random text</p>
```

**What is being checked:** A `<p>` tag has the `className` attribute set to `"subtitle"`. The text inside can be anything.

---

### ✅ Test 4 — Wrapped in a single root `<div>`

```jsx
// Everything must live inside one top-level <div>
return (
  <div>
    ...all elements here...
  </div>
);
```

**What is being checked:** The component returns exactly one root element, and that root is a `<div>`.

---

## What I Learned From This Exercise

1. **JSX is syntactic sugar** — it compiles down to `React.createElement()` calls. It is not real HTML, even though it looks like it.

2. **`className` is mandatory** — wherever you would write `class` in HTML, you write `className` in JSX. Using `class` in JSX will cause a warning or error.

3. **Curly braces `{}`** are the bridge between JSX and JavaScript. Any valid JavaScript expression — a variable, a calculation, a function call — can be placed inside `{}` to render its result.

4. **One root element rule** — a component's `return` must have exactly one top-level wrapper. You can't return two sibling elements without wrapping them.

5. **Fragments `<>`** let you group multiple elements without adding an unnecessary `<div>` to the actual HTML output in the browser.

6. **Self-closing tags** like `<img />`, `<br />`, and `<input />` must include the `/` before `>` in JSX. Leaving it out is a syntax error.

7. **JSX comments** use `{/* */}` — regular `//` comments can't be placed directly inside JSX markup.

8. **Variables declared inside a component** are just regular JavaScript — `const year = 2026` is nothing special. JSX just lets you pull them into the rendered output using `{}`.

---

## Quick Reference Summary

| Concept | HTML | JSX |
|---|---|---|
| CSS class | `class="..."` | `className="..."` |
| Dynamic value | Not possible inline | `{expression}` |
| Self-closing tag | `<br>` | `<br />` |
| Multiple elements | Allowed freely | Must have one root |
| Comments | `<!-- -->` | `{/* */}` |
| Group without wrapper | Not possible | `<>...</>` Fragment |

<!-- Chapter 1
JSX Basics

JSX syntax
Expressions with {}
className
Fragments
JSX Basics
JSX looks like HTML but lives inside JavaScript. Under the hood, <h1>Hello</h1> becomes React.createElement('h1', null, 'Hello').

Key Rules
Use className instead of class
Embed JavaScript expressions with curly braces {}
JSX must return a single root element (use <div> or <> fragments)
Self-closing tags must end with /> (e.g., <img />, <br />)
Your Task
Create an App component that renders:

A <div> wrapper containing:
An <h1> with the text "Hello, React!"
A <p> that displays the value of const year = 2026 using a JSX expression
A <p> with className="subtitle" containing any text
Hint: Use {year} inside JSX to embed the variable.

function App() {
  const year = 2026;

  return (
    <div>
      <h1>Hello, React!</h1>
      <p>{year}</p>
      <p className="subtitle">This is random text</p>
    </div>
  );
}

Tests: 
✓
Renders an <h1> with "Hello, React!"
✓
Displays the year 2026 in a <p> tag
✓
Has a <p> with className="subtitle"
✓
Wrapped in a single root <div>



Add the tasks with the solution, with test cases and explanations in markdown format.
make notes of the lessons i learnt using this exercise
make notes in english in md format.
never miss any point
explain things easily
also use comments in code(if available) -->
