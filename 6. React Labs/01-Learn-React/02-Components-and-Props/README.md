# Chapter 2 — Components & Props

---

## Topics Covered

- Function components
- Props
- Destructuring
- Composition

---

## What are Components?

A **component** is just a **JavaScript function that returns JSX**. It is the core building block of any React application — everything you see on screen is a component.

```jsx
// The simplest possible component
function Hello() {
  return <h1>Hello, World!</h1>;
}
```

Think of components like **custom HTML tags** you define yourself. Once defined, you can use them anywhere:

```jsx
<Hello />   // works just like <h1>, <p>, etc.
```

---

## What are Props?

**Props** (short for *properties*) are how you **pass data from a parent component into a child component**.

They work exactly like HTML attributes — you write them on the component tag:

```jsx
// Passing props to a component (parent side)
<Greeting name="Alice" age={25} />
```

And you receive them inside the function as a parameter:

```jsx
// Receiving props inside the component (child side)
function Greeting(props) {
  return <h1>Hello, {props.name}! You are {props.age}.</h1>;
}
```

---

## Key Concepts

### 1. Components Must Start With an Uppercase Letter

React uses the **capitalisation** of the tag name to decide whether it's a built-in HTML element or a custom component.

```jsx
// ❌ Wrong — React treats this as an unknown HTML tag, not a component
function userCard() { ... }
<userCard />

// ✅ Correct — uppercase first letter = React component
function UserCard() { ... }
<UserCard />
```

> **Rule of thumb:** Lowercase = HTML element (`<div>`, `<p>`). Uppercase = React component (`<UserCard>`, `<App>`).

---

### 2. Props Are Passed Like HTML Attributes

You pass props by writing `key="value"` pairs on the component tag, just like HTML attributes.

```jsx
// String props use quotes
<UserCard name="Alice" role="Developer" />

// Number, boolean, or expression props use {}
<UserCard age={25} isAdmin={true} score={10 * 2} />
```

---

### 3. Accessing Props — Two Ways

#### Way 1: Via the `props` object (without destructuring)

```jsx
function UserCard(props) {
  // Access each prop using props.propName
  return (
    <div>
      <h2>{props.name}</h2>   {/* props.name = "Alice" */}
      <p>{props.role}</p>     {/* props.role = "Developer" */}
    </div>
  );
}
```

#### Way 2: Destructuring directly in the parameter (cleaner)

```jsx
// Pull out name and role directly — no need to write props.name, props.role
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>    {/* directly use 'name', not 'props.name' */}
      <p>{role}</p>      {/* directly use 'role', not 'props.role' */}
    </div>
  );
}
```

Destructuring is just **JavaScript syntax** — `{ name, role }` extracts those keys out of the props object. Both ways produce identical results; destructuring is just cleaner and more commonly used.

---

### 4. Props Are Read-Only — Never Modify Them

Props flow **one way: parent → child**. A component must **never change its own props**.

```jsx
function UserCard({ name }) {
  // ❌ Never do this — modifying props breaks React's data flow
  name = "Someone else";

  // ✅ If you need to change a value, use state (covered in a later chapter)
  return <h2>{name}</h2>;
}
```

This rule keeps data flow **predictable** — you always know where data comes from.

---

### 5. Composition — Components Inside Components

You can use components **inside other components**. This is called **composition** and it's how you build complex UIs from small, reusable pieces.

```jsx
// Small reusable child component
function UserCard({ name, role }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

// Parent component that composes multiple UserCards
function App() {
  return (
    <div>
      {/* Each UserCard is independent — same component, different data */}
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </div>
  );
}
```

This is the power of components — **write once, reuse with different data**.

---

## The Task

> Build a `UserCard` component and use it twice in `App` with different data.

```
UserCard component:
  ├── Accepts: name (string), role (string) as props
  ├── Renders: <div className="user-card">
  │               ├── <h2> displaying name
  │               └── <p> displaying role

App component:
  ├── <UserCard name="Alice" role="Developer" />
  └── <UserCard name="Bob"   role="Designer"  />
```

---

## Solution

```jsx
// --------------------------------------------------
// CHILD COMPONENT
// --------------------------------------------------
// Destructure 'name' and 'role' directly from props
// This is cleaner than writing props.name, props.role
function UserCard({ name, role }) {
  return (
    // className follows JSX rule — not 'class'
    <div className="user-card">

      {/* Render the name prop inside an h2 */}
      <h2>{name}</h2>

      {/* Render the role prop inside a p */}
      <p>{role}</p>

    </div>
  );
}

// --------------------------------------------------
// PARENT COMPONENT
// --------------------------------------------------
function App() {
  return (
    // Single root <div> wrapping both cards
    <div>

      {/* First instance — passes Alice's data as props */}
      <UserCard name="Alice" role="Developer" />

      {/* Second instance — passes Bob's data as props */}
      <UserCard name="Bob" role="Designer" />

    </div>
  );
}
```

### What happens at render time

```
App renders
  └── <div>
        ├── UserCard (name="Alice", role="Developer")
        │     └── <div class="user-card">
        │           ├── <h2>Alice</h2>
        │           └── <p>Developer</p>
        │
        └── UserCard (name="Bob", role="Designer")
              └── <div class="user-card">
                    ├── <h2>Bob</h2>
                    └── <p>Designer</p>
```

---

## Test Cases

### ✅ Test 1 — Renders two `UserCard` components

```jsx
// App must render UserCard twice
<UserCard name="Alice" role="Developer" />
<UserCard name="Bob" role="Designer" />
```

**What is being checked:** The `App` component renders exactly two instances of `UserCard` in its output.

---

### ✅ Test 2 — First card shows "Alice" and "Developer"

```jsx
// The first UserCard must receive these exact prop values
<UserCard name="Alice" role="Developer" />
```

**What is being checked:** The rendered output contains `"Alice"` in an `<h2>` and `"Developer"` in a `<p>`, produced by the first `UserCard`.

---

### ✅ Test 3 — Second card shows "Bob" and "Designer"

```jsx
// The second UserCard must receive these exact prop values
<UserCard name="Bob" role="Designer" />
```

**What is being checked:** The rendered output contains `"Bob"` in an `<h2>` and `"Designer"` in a `<p>`, produced by the second `UserCard`.

---

### ✅ Test 4 — Each card has an `<h2>` and `<p>` inside a `<div>`

```jsx
// UserCard's internal structure must match exactly
function UserCard({ name, role }) {
  return (
    <div className="user-card">  {/* wrapper div with correct className */}
      <h2>{name}</h2>             {/* h2 for name */}
      <p>{role}</p>               {/* p for role */}
    </div>
  );
}
```

**What is being checked:** The DOM structure of each card is `div > h2 + p`, and the wrapper div has `className="user-card"`.

---

## What I Learned From This Exercise

1. **A component is just a function that returns JSX.** There's no magic — it's a regular JavaScript function with one rule: it must return JSX.

2. **Components must start with an uppercase letter.** React uses this to tell the difference between built-in HTML tags (`<div>`) and custom components (`<UserCard>`). Lowercase = HTML. Uppercase = React component.

3. **Props are the way to pass data into a component.** You write them like HTML attributes on the component tag — `<UserCard name="Alice" />` — and receive them as a function parameter inside the component.

4. **Destructuring props is the preferred pattern.** Instead of `props.name` and `props.role`, you write `{ name, role }` in the function parameter. Same result, much cleaner code.

5. **Props are read-only.** You must never modify props inside a component. They are inputs — treat them as data you receive and display, never data you change.

6. **Composition means building with components.** The `App` component doesn't know *how* `UserCard` works internally — it just passes data. `UserCard` doesn't know where its data comes from — it just displays it. This separation makes each piece reusable and easy to understand.

7. **The same component can be used multiple times with different props.** `UserCard` is defined once but used twice — once for Alice, once for Bob. This is what makes components so powerful: **write once, reuse with different data**.

8. **Data flows one way — from parent to child.** `App` passes data *down* to `UserCard` via props. `UserCard` can never send data *up* to `App` through props. This one-way flow keeps the app predictable.

---

## Quick Reference Summary

| Concept | Example | Notes |
|---|---|---|
| Define a component | `function UserCard() { return <div/> }` | Always uppercase first letter |
| Use a component | `<UserCard />` | Like a custom HTML tag |
| Pass a string prop | `<UserCard name="Alice" />` | Use quotes for strings |
| Pass a number/expression | `<UserCard age={25} />` | Use `{}` for non-strings |
| Access props (object) | `props.name` | Needs `props` parameter |
| Access props (destructure) | `{ name }` in parameter | Cleaner, preferred way |
| Props are | Read-only | Never modify them |
| Composition | Component inside component | Reuse with different data |

<!-- Chapter 2
Components & Props

Function components
Props
Destructuring
Composition
Components & Props
Components are the building blocks of React. A component is just a function that returns JSX. Props let you pass data from a parent component to a child.

Key Concepts
Components must start with an uppercase letter
Props are passed like HTML attributes: <Greeting name="Alice" />
Inside the component, access them via the function parameter: function Greeting({ name })
Props are read-only — never modify them
Your Task
Create a UserCard component that accepts name and role props
Render an <h2> with the name
Render a <p> with the role
Wrap both in a <div> with className="user-card"
In the App component, render two UserCard components:
One with name "Alice" and role "Developer"
One with name "Bob" and role "Designer"


// Create your UserCard component here
function UserCard({name, role}){
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  )
}


function App() {
  return (
    <div>
      {/* Render two UserCard components */}
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </div>
  );
}


✓
Renders two UserCard components
✓
First card shows "Alice" and "Developer"
✓
Second card shows "Bob" and "Designer"
✓
Each card has an <h2> and <p> inside a div



Add the tasks with the solution, with test cases and explanations in markdown format.
make notes of the lessons i learnt using this exercise
make notes in english in md format.
never miss any point
explain things easily
also use comments in code(if available) -->