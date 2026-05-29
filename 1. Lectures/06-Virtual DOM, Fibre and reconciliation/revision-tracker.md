# 📘 Lecture 06 — Virtual DOM, Fibre & Reconciliation

---

## 🗓️ Revision Tracker

| # | Date | Status | Notes |
|---|------|--------|-------|
| 1 | 29 May 2026 | ✅ First Read | Initial study of article + notes |
| 2 | | ⬜ | |
| 3 | | ⬜ | |
| 4 | | ⬜ | |

---

## 📌 Table of Contents

1. [What is the DOM?](#1-what-is-the-dom)
2. [What is the Virtual DOM?](#2-what-is-the-virtual-dom)
3. [Browser DOM vs Virtual DOM](#3-browser-dom-vs-virtual-dom)
4. [Why Tree Structure?](#4-why-tree-structure)
5. [What is Page Reload?](#5-what-is-page-reload)
6. [What is createRoot?](#6-what-is-createroot)
7. [What is Reconciliation?](#7-what-is-reconciliation)
8. [Reconciliation vs Rendering](#8-reconciliation-vs-rendering)
9. [What is Scheduling?](#9-what-is-scheduling)
10. [What is React Fibre?](#10-what-is-react-fibre)
11. [Structure of a Fibre](#11-structure-of-a-fibre)
12. [What is Incremental Rendering?](#12-what-is-incremental-rendering)
13. [What is Hydration?](#13-what-is-hydration)
14. [What are Hooks?](#14-what-are-hooks)
15. [Interview Questions & Answers](#15-interview-questions--answers)
16. [Key Terms Glossary](#16-key-terms-glossary)

---

## 1. What is the DOM?

**DOM = Document Object Model**

When a browser loads an HTML page, it parses the HTML and creates a **tree of objects** in memory — this is the DOM. Every HTML tag (`<div>`, `<p>`, `<h1>`, etc.) becomes a **node** in this tree.

```html
<html>
  <body>
    <div id="app">
      <h1>Hello</h1>
      <p>World</p>
    </div>
  </body>
</html>
```

**DOM Tree:**
```
html
 └── body
      └── div#app
           ├── h1  → "Hello"
           └── p   → "World"
```

JavaScript can interact with this tree via `document.getElementById()`, `querySelector()`, etc.

**Problem:** Direct DOM manipulation is **slow and expensive** — every time you change the DOM, the browser may reflow (recalculate layout) and repaint the screen. Doing this repeatedly causes poor performance.

---

## 2. What is the Virtual DOM?

The **Virtual DOM (VDOM)** is a **lightweight JavaScript representation** (a plain object/tree) of the actual DOM, kept in memory by React.

Instead of directly updating the real DOM every time data changes, React:
1. Creates a new Virtual DOM tree (after state/props change)
2. **Diffs** the new tree with the previous one (finds what changed)
3. Only updates the **actual changed parts** in the real DOM

```js
// A Virtual DOM node looks roughly like this:
{
  type: 'div',
  props: {
    className: 'app',
    children: [
      { type: 'h1', props: { children: 'Hello' } },
      { type: 'p',  props: { children: 'World' } }
    ]
  }
}
```

> 💡 The Virtual DOM is React's internal data structure — you never directly create it. JSX compiles to `React.createElement()` calls which produce these objects.

---

## 3. Browser DOM vs Virtual DOM

| Feature | Browser DOM | Virtual DOM |
|---|---|---|
| Lives in | Browser memory (C++ objects) | JavaScript memory (JS objects) |
| Manipulation speed | Slow (triggers reflow/repaint) | Fast (just JS object operations) |
| Directly visible | Yes — what user sees | No — internal representation |
| Updated by | Vanilla JS / frameworks | React internally |
| Purpose | Actual rendered UI | Blueprint for efficient updates |

**Analogy:** Think of the Virtual DOM like an **architect's blueprint** — changes are made on paper first (fast), then only the necessary parts of the building (real DOM) are updated.

---

## 4. Why Tree Structure?

Both the browser DOM and Virtual DOM use **tree structure** because:

- HTML is **inherently hierarchical** — elements nest inside each other (parent → child relationship)
- A tree is the most natural data structure to represent nesting
- **Tree diffing algorithms** (like React's reconciliation) are well-studied and efficient
- Traversal (top-down, depth-first) maps perfectly to how HTML is rendered

> Every webpage is a hierarchy: `html > body > div > p` — a tree is the only structure that captures this relationship cleanly.

---

## 5. What is Page Reload?

**Page reload** = the browser fetches the HTML from the server again, re-parses it, rebuilds the DOM, re-downloads resources (CSS, JS, images), and re-renders everything from scratch.

**Behind the scenes of a page reload:**
1. Browser sends a new HTTP GET request to the server
2. Server responds with fresh HTML
3. Browser **destroys** the current DOM
4. Parses new HTML, builds a new DOM tree
5. Downloads and executes CSS → applies styles
6. Downloads and executes JS → runs scripts
7. Page renders visually

**React avoids full page reloads** by updating only what changed in the DOM using the Virtual DOM diff strategy — this is the core value proposition of React as a **SPA (Single Page Application)** framework.

---

## 6. What is `createRoot`?

`createRoot` is the entry point to React 18+'s rendering pipeline. It tells React: *"take control of this DOM node and manage everything inside it."*

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**Behind the scenes of `createRoot`:**

1. React finds the real DOM node (`#root`)
2. Creates an internal **FiberRoot** object — this is the top of React's Fibre tree
3. Creates the first **Fibre node** for `<App />`
4. Kicks off the **reconciliation process** — builds the virtual tree
5. Commits the result to the real DOM (first paint)
6. Sets up event listeners and schedules future updates

> In React 18, `createRoot` enables **Concurrent Mode** — meaning React can pause, resume, and prioritize rendering work. The old `ReactDOM.render()` was synchronous (blocking).

**Key difference:**
```js
// Old (React 17) — synchronous, blocking
ReactDOM.render(<App />, document.getElementById('root'));

// New (React 18) — concurrent, non-blocking
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## 7. What is Reconciliation?

> **Reconciliation** is the algorithm React uses to diff one Virtual DOM tree with another to determine which parts of the real DOM need to change.

**Simple mental model:**
- React says: *"I have the old tree and the new tree. Let me compare them and find the minimum set of operations to transform old → new."*

### How it works step by step:

```
State changes (e.g., setState called)
         ↓
React creates a NEW virtual DOM tree
         ↓
React DIFFS new tree vs old tree (reconciliation)
         ↓
Finds the minimal set of changes
         ↓
Applies those changes to the real DOM
```

### Key rules React uses during diffing:

**Rule 1 — Different component types = full replacement**

```jsx
// Before
<div><Counter /></div>

// After
<span><Counter /></span>

// React sees div → span, tears down the entire subtree and rebuilds
```

**Rule 2 — Same type = update in place**

```jsx
// Before: <div className="old" />
// After:  <div className="new" />
// React just updates the className attribute — doesn't recreate the div
```

**Rule 3 — Lists use keys**

```jsx
// ❌ Bad — React can't efficiently diff without keys
<ul>
  {items.map(item => <li>{item.name}</li>)}
</ul>

// ✅ Good — React uses key to track identity
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

> **Keys must be: stable (don't change), predictable (deterministic), and unique (among siblings)**
> Never use array index as key when items can be reordered or deleted — it confuses reconciliation.

---

## 8. Reconciliation vs Rendering

These are **two separate phases** in React — a crucial distinction:

| Phase | What it does | Who does it |
|---|---|---|
| **Reconciliation** | Computes *what* changed (diffs trees) | React Core (shared) |
| **Rendering** | Applies changes to the output environment | Renderer (platform-specific) |

**Why this matters:**

React separates these concerns so the same reconciler can power:
- `react-dom` → updates browser DOM
- `react-native` → updates iOS/Android native views
- `react-three-fiber` → updates 3D scenes
- `react-pdf` → generates PDFs

> This is why "Virtual DOM" is technically a misnomer — the virtual tree is used for reconciliation, not just DOM updates.

---

## 9. What is Scheduling?

**Scheduling** = deciding *when* to perform work (computations/renders).

### The problem without scheduling:

In old React (pre-Fibre), when state changed, React would **synchronously walk the entire component tree** in one go — blocking the browser's main thread. This caused:
- Dropped animation frames (janky UI)
- Unresponsive inputs
- Bad user experience

### Push vs Pull approach:

| Approach | Who decides when to render | Example |
|---|---|---|
| **Push** (old way) | The programmer / library triggers immediately | MobX, old Redux |
| **Pull** (React's way) | React decides when it's best to update | React Fibre |

### React's scheduling philosophy:

> "React is not a generic data processing library. It is a library for building user interfaces — uniquely positioned to know which computations are relevant right now."

**Priority examples:**
- 🔴 **High priority:** Animation triggered by button click → must render immediately
- 🟡 **Medium priority:** User typing in an input → should feel instant
- 🟢 **Low priority:** Data loaded from network in background → can wait

React Fibre implements this via a scheduler that:
- Uses `requestAnimationFrame` for high-priority work
- Uses `requestIdleCallback` for low-priority work
- Can **pause** work mid-render and resume later

---

## 10. What is React Fibre?

**React Fibre** is a complete rewrite of React's core reconciliation algorithm, introduced in React 16.

> *"Fiber is a reimplementation of the call stack, specialized for React components. You can think of a single fiber as a virtual stack frame."*

### Why was Fibre needed?

Old React used JavaScript's native **call stack** for rendering. The call stack can't be paused — once rendering starts, it must finish. This made it impossible to:
- Pause rendering mid-way for higher priority work
- Spread rendering across multiple frames
- Assign priorities to updates

Fibre solves this by **reimplementing the stack in JavaScript** — giving React full control over when/how work is executed.

### What Fibre enables:

| Capability | Benefit |
|---|---|
| ⏸️ Pause work and resume later | Prevents blocking the main thread |
| 🎯 Assign priorities to work | Animation > background data fetch |
| ♻️ Reuse previously completed work | Avoid redundant computation |
| 🚫 Abort work no longer needed | Stale updates are discarded |

### The formula:

```
v = f(d)
```
- `v` = view (what the user sees)
- `f` = your React component (a function)
- `d` = data (props + state)

Rendering a React app = calling `f(d)`, which calls child functions, and so on — a deep call chain. **Fibre reimplements this call chain** as a linked list of objects that React controls.

---

## 11. Structure of a Fibre

A **Fibre** is a plain JavaScript object representing a unit of work — one component instance.

```js
// Simplified Fibre object
{
  type: MyComponent,       // The component function/class or 'div', 'span' etc.
  key: null,               // Used in reconciliation (like list keys)
  child: FiberNode,        // First child component
  sibling: FiberNode,      // Next sibling component
  return: FiberNode,       // Parent component (where to return after done)
  pendingProps: {},        // New props being processed
  memoizedProps: {},       // Props from last completed render
  pendingWorkPriority: 0,  // Priority level of this work
  alternate: FiberNode,    // The other version of this fiber (current ↔ work-in-progress)
  output: ...,             // What this fiber produces (ultimately DOM nodes)
}
```

### Key fields explained:

**`type` and `key`**
- `type`: For custom components → the function/class itself. For DOM elements → string like `'div'`
- `key`: Used during reconciliation to identify list items

**`child`, `sibling`, `return`**

```jsx
function Parent() {
  return [<Child1 />, <Child2 />]
}
```

```
Parent
  └── child → Child1
                 └── sibling → Child2
                                 └── sibling → null

Child1.return = Parent
Child2.return = Parent
```

**`pendingProps` vs `memoizedProps`**
- `pendingProps`: Props at the *start* of rendering this fiber
- `memoizedProps`: Props from the *last completed* render
- If `pendingProps === memoizedProps` → output can be **reused** (skip work!)

**`pendingWorkPriority`**
- A number representing priority. `0` = no work
- **Lower number = higher priority** (counterintuitive but true)
- Scheduler uses this to pick which fiber to work on next

**`alternate` (Double Buffering)**
- At any time, a component has **two fibres**: `current` and `work-in-progress`
- `current` = what's currently on screen
- `work-in-progress` = what React is computing next
- When work completes, they **swap** — work-in-progress becomes current
- This prevents flickering and allows aborting updates cleanly

```
current fiber  ←→  work-in-progress fiber
(on screen)        (being computed)
```

---

## 12. What is Incremental Rendering?

**Incremental rendering** = splitting rendering work into **small chunks** and spreading them across **multiple browser frames** instead of doing everything at once.

**Old React (no incremental rendering):**
```
Frame 1: [==== entire render work ====] → browser can't paint → dropped frame
Frame 2: [browser paints] → visible delay
```

**Fibre with incremental rendering:**
```
Frame 1: [chunk 1] → browser paints
Frame 2: [chunk 2] → browser paints
Frame 3: [chunk 3] → browser paints
```

This is the **headline feature** of React Fibre. It uses `requestIdleCallback` style scheduling to break up work between frames, keeping the UI responsive.

---

## 13. What is Hydration?

**Hydration** is the process where React takes **server-rendered HTML** and "attaches" its event listeners and state to it — making it interactive.

**The flow:**
1. Server renders your React app to HTML string → sends to browser
2. Browser shows the HTML immediately (fast first paint)
3. React's JS bundle downloads
4. React **hydrates** — walks the existing DOM and attaches its Virtual DOM tree to it
5. App is now fully interactive

```jsx
// Server (Node.js)
const html = ReactDOMServer.renderToString(<App />);

// Client
const root = createRoot(document.getElementById('root'));
root.render(<App />); // or hydrateRoot() for SSR
```

> Without hydration, the user sees a static HTML page (fast to load) then a blank flash as React takes over. Hydration avoids that blank flash.

---

## 14. What are Hooks?

**Hooks** are functions that let functional components "hook into" React's internal state and lifecycle features.

**How hooks trigger UI updates:**

```jsx
function Counter() {
  const [count, setCount] = useState(0); // declares state

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

When `setCount` is called:
1. React marks this component's Fibre as needing an update
2. Adds to the **update queue**
3. Scheduler picks it up based on priority
4. Reconciliation runs → diffs old tree vs new tree
5. Only the changed DOM nodes are updated

**Common hooks and what they update:**

| Hook | What it does |
|---|---|
| `useState` | Local component state → triggers re-render on change |
| `useEffect` | Side effects after render (data fetching, subscriptions) |
| `useReducer` | Complex state logic (like Redux in a component) |
| `useContext` | Subscribe to context — re-renders when context changes |
| `useMemo` / `useCallback` | Memoize values/functions to skip unnecessary re-renders |
| `useRef` | Mutable ref that doesn't trigger re-renders |

---

## 15. Interview Questions & Answers

### Q1: What is the Virtual DOM and how does it improve performance?

**Answer:** The Virtual DOM is a lightweight JavaScript object tree that mirrors the real DOM. Instead of directly updating the slow browser DOM on every state change, React updates the Virtual DOM, diffs it with the previous version (reconciliation), finds the minimum number of changes, and applies only those to the real DOM. This batching and minimizing of real DOM operations is what makes React performant.

---

### Q2: What is reconciliation? Explain with an example.

**Answer:** Reconciliation is the algorithm React uses to determine what changed between two renders by diffing the old and new Virtual DOM trees.

```jsx
// Before state change
function App() {
  return (
    <ul>
      <li key="1">Apple</li>
      <li key="2">Banana</li>
    </ul>
  );
}

// After state change (added Cherry at the beginning)
function App() {
  return (
    <ul>
      <li key="3">Cherry</li>  {/* new */}
      <li key="1">Apple</li>   {/* reused */}
      <li key="2">Banana</li>  {/* reused */}
    </ul>
  );
}
```
Without keys, React would re-render all three `<li>` elements. With keys, React knows `key="1"` and `key="2"` are the same items — it only inserts one new DOM node for Cherry.

---

### Q3: Why are keys important in lists?

**Answer:** Keys help React identify which items in a list have changed, been added, or removed. Without keys, React re-renders every list item. Keys must be:
- **Stable** — same item should always have the same key
- **Unique** — unique among siblings (not globally)
- **Predictable** — not random (never use `Math.random()` as key)

❌ Bad: `key={index}` when items can be reordered
✅ Good: `key={item.id}` from database ID

---

### Q4: What is React Fibre and why was it introduced?

**Answer:** React Fibre is a rewrite of React's core algorithm introduced in React 16. It was introduced to solve a fundamental limitation of old React: synchronous, uninterruptible rendering. Old React would process the entire component tree in one go, blocking the browser's main thread and causing dropped frames.

Fibre reimplements React's rendering as a **linked list of work units (fibres)** that can be paused, prioritized, reused, or aborted. This enables:
- Concurrent rendering (React 18)
- Suspense and lazy loading
- Smooth animations without jank
- Priority-based updates

---

### Q5: What is the difference between reconciliation and rendering?

**Answer:** 
- **Reconciliation** = computing *what* changed (diffing Virtual DOM trees) — this is platform-agnostic
- **Rendering** = applying those changes to the output environment (browser DOM, native views, etc.)

They are intentionally separate so React can use the same reconciler for different platforms (web, mobile, VR).

---

### Q6: What is incremental rendering?

**Answer:** Incremental rendering is the ability to split rendering work into small chunks spread across multiple browser frames. Instead of blocking the browser for 200ms to render a complex update, Fibre does 10ms of work per frame, lets the browser paint, then continues — keeping animations smooth and inputs responsive.

---

## 16. Key Terms Glossary

| Term | Definition |
|---|---|
| **DOM** | Browser's tree representation of an HTML document |
| **Virtual DOM** | React's in-memory JS object representation of the UI |
| **Reconciliation** | Algorithm to diff two Virtual DOM trees |
| **Rendering** | Applying changes to the actual output environment |
| **Fibre** | A unit of work; a JS object representing one component instance |
| **FiberRoot** | The root of React's internal fibre tree (created by `createRoot`) |
| **Scheduling** | Deciding when to perform rendering work |
| **Incremental Rendering** | Splitting rendering into chunks across multiple frames |
| **Hydration** | Attaching React's virtual tree to server-rendered HTML |
| **work-in-progress** | A fibre currently being processed (not yet rendered) |
| **current fiber** | A fibre whose output is currently on screen |
| **alternate** | The pair of current ↔ work-in-progress fibres |
| **flush** | To render a fibre's output to the screen |
| **host component** | Leaf-level DOM element like `div`, `span` (lowercase in JSX) |
| **pendingProps** | Props at the start of a render |
| **memoizedProps** | Props from the last completed render |
| **update** | A change in data (usually from `setState`) that triggers re-render |

---

## 📝 Quick Revision Summary

```
DOM → browser's tree of HTML elements (slow to update)
Virtual DOM → React's JS copy (fast, in-memory)
createRoot → entry point, creates FiberRoot, enables concurrent mode
Reconciliation → diff algorithm (old tree vs new tree)
  → Rule 1: different types = full replace
  → Rule 2: same type = update in place
  → Rule 3: lists use keys (stable, unique, predictable)
Rendering → separate phase; applies changes to platform
Scheduling → deciding WHEN to do work
  → push (old) vs pull (React) approach
  → High priority: animations | Low priority: background data
Fibre = unit of work = virtual stack frame = JS object
  Fields: type, key, child, sibling, return, pendingProps,
          memoizedProps, pendingWorkPriority, alternate
Incremental rendering → work split across frames
Hydration → SSR HTML + React JS bundle → interactive app
Hooks → setState → marks fibre dirty → scheduler → reconcile → commit
```

---

*Notes compiled: 29 May 2026 | Lecture 06*

<!-- 
Revision Tracker:  06-Virtual DOM, Fibre and reconciliation

1. 29 May, 2026

What is createRoot method in react?
Explain behind the scenes of createRoot method? 
What is virtual DOM?
What is DOM?
What is browser dom and virtual dom?
What is page reload? what happens behind the scens?
Why virtual dom or browser dom uses tree like structure?

React does not need to instantly update the UI — it can wait, batch, and defer updates intelligently until the final change is ready.
A good scheduling algorithm handles when and how UI updates are applied.

What are hooks and how it updates UI at different places?

What is react fibre architecture?

React uses fibre algorithm behind the scene to update virtual dom

What is incremental rendering?

What is hydration concept?

What is reconciliation?

What is rendering in react?

Reconciliation is the algorithm behind what is popularly understood as the "virtual DOM." A high-level description goes something like this: when you render a React application, a tree of nodes that describes the app is generated and saved in memory. This tree is then flushed to the rendering environment — for example, in the case of a browser application, it's translated to a set of DOM operations. When the app is updated (usually via setState), a new tree is generated. The new tree is diffed with the previous tree to compute which operations are needed to update the rendered app.

Explain it in detail with code example asked in interviews?
Important: Diffing of lists is performed using keys. Keys should be "stable, predictable, and unique."


The key points are:

In a UI, it's not necessary for every update to be applied immediately; in fact, doing so can be wasteful, causing frames to drop and degrading the user experience.
Different types of updates have different priorities — an animation update needs to complete more quickly than, say, an update from a data store.
A push-based approach requires the app (you, the programmer) to decide how to schedule work. A pull-based approach allows the framework (React) to be smart and make those decisions for you.


What is fibre?

We've established that a primary goal of Fiber is to enable React to take advantage of scheduling. Specifically, we need to be able to

pause work and come back to it later.
assign priority to different types of work.
reuse previously completed work.
abort work if it's no longer needed.
In order to do any of this, we first need a way to break work down into units. In one sense, that's what a fiber is. A fiber represents a unit of work.





















Make notes points of this articles, so that i undersatand it fully.
```
React Fiber Architecture
Introduction
React Fiber is an ongoing reimplementation of React's core algorithm. It is the culmination of over two years of research by the React team.

The goal of React Fiber is to increase its suitability for areas like animation, layout, and gestures. Its headline feature is incremental rendering: the ability to split rendering work into chunks and spread it out over multiple frames.

Other key features include the ability to pause, abort, or reuse work as new updates come in; the ability to assign priority to different types of updates; and new concurrency primitives.

About this document
Fiber introduces several novel concepts that are difficult to grok solely by looking at code. This document began as a collection of notes I took as I followed along with Fiber's implementation in the React project. As it grew, I realized it may be a helpful resource for others, too.

I'll attempt to use the plainest language possible, and to avoid jargon by explicitly defining key terms. I'll also link heavily to external resources when possible.

Please note that I am not on the React team, and do not speak from any authority. This is not an official document. I have asked members of the React team to review it for accuracy.

This is also a work in progress. Fiber is an ongoing project that will likely undergo significant refactors before it's completed. Also ongoing are my attempts at documenting its design here. Improvements and suggestions are highly welcome.

My goal is that after reading this document, you will understand Fiber well enough to follow along as it's implemented, and eventually even be able to contribute back to React.

Prerequisites
I strongly suggest that you are familiar with the following resources before continuing:

React Components, Elements, and Instances - "Component" is often an overloaded term. A firm grasp of these terms is crucial.
Reconciliation - A high-level description of React's reconciliation algorithm.
React Basic Theoretical Concepts - A description of the conceptual model of React without implementation burden. Some of this may not make sense on first reading. That's okay, it will make more sense with time.
React Design Principles - Pay special attention to the section on scheduling. It does a great job of explaining the why of React Fiber.
Review
Please check out the prerequisites section if you haven't already.

Before we dive into the new stuff, let's review a few concepts.

What is reconciliation?
reconciliation
The algorithm React uses to diff one tree with another to determine which parts need to be changed.
update
A change in the data used to render a React app. Usually the result of `setState`. Eventually results in a re-render.
The central idea of React's API is to think of updates as if they cause the entire app to re-render. This allows the developer to reason declaratively, rather than worry about how to efficiently transition the app from any particular state to another (A to B, B to C, C to A, and so on).

Actually re-rendering the entire app on each change only works for the most trivial apps; in a real-world app, it's prohibitively costly in terms of performance. React has optimizations which create the appearance of whole app re-rendering while maintaining great performance. The bulk of these optimizations are part of a process called reconciliation.

Reconciliation is the algorithm behind what is popularly understood as the "virtual DOM." A high-level description goes something like this: when you render a React application, a tree of nodes that describes the app is generated and saved in memory. This tree is then flushed to the rendering environment — for example, in the case of a browser application, it's translated to a set of DOM operations. When the app is updated (usually via setState), a new tree is generated. The new tree is diffed with the previous tree to compute which operations are needed to update the rendered app.

Although Fiber is a ground-up rewrite of the reconciler, the high-level algorithm described in the React docs will be largely the same. The key points are:

Different component types are assumed to generate substantially different trees. React will not attempt to diff them, but rather replace the old tree completely.
Diffing of lists is performed using keys. Keys should be "stable, predictable, and unique."
Reconciliation versus rendering
The DOM is just one of the rendering environments React can render to, the other major targets being native iOS and Android views via React Native. (This is why "virtual DOM" is a bit of a misnomer.)

The reason it can support so many targets is because React is designed so that reconciliation and rendering are separate phases. The reconciler does the work of computing which parts of a tree have changed; the renderer then uses that information to actually update the rendered app.

This separation means that React DOM and React Native can use their own renderers while sharing the same reconciler, provided by React core.

Fiber reimplements the reconciler. It is not principally concerned with rendering, though renderers will need to change to support (and take advantage of) the new architecture.

Scheduling
scheduling
the process of determining when work should be performed.
work
any computations that must be performed. Work is usually the result of an update (e.g. setState).
React's Design Principles document is so good on this subject that I'll just quote it here:

In its current implementation React walks the tree recursively and calls render functions of the whole updated tree during a single tick. However in the future it might start delaying some updates to avoid dropping frames.

This is a common theme in React design. Some popular libraries implement the "push" approach where computations are performed when the new data is available. React, however, sticks to the "pull" approach where computations can be delayed until necessary.

React is not a generic data processing library. It is a library for building user interfaces. We think that it is uniquely positioned in an app to know which computations are relevant right now and which are not.

If something is offscreen, we can delay any logic related to it. If data is arriving faster than the frame rate, we can coalesce and batch updates. We can prioritize work coming from user interactions (such as an animation caused by a button click) over less important background work (such as rendering new content just loaded from the network) to avoid dropping frames.

The key points are:

In a UI, it's not necessary for every update to be applied immediately; in fact, doing so can be wasteful, causing frames to drop and degrading the user experience.
Different types of updates have different priorities — an animation update needs to complete more quickly than, say, an update from a data store.
A push-based approach requires the app (you, the programmer) to decide how to schedule work. A pull-based approach allows the framework (React) to be smart and make those decisions for you.
React doesn't currently take advantage of scheduling in a significant way; an update results in the entire subtree being re-rendered immediately. Overhauling React's core algorithm to take advantage of scheduling is the driving idea behind Fiber.

Now we're ready to dive into Fiber's implementation. The next section is more technical than what we've discussed so far. Please make sure you're comfortable with the previous material before moving on.

What is a fiber?
We're about to discuss the heart of React Fiber's architecture. Fibers are a much lower-level abstraction than application developers typically think about. If you find yourself frustrated in your attempts to understand it, don't feel discouraged. Keep trying and it will eventually make sense. (When you do finally get it, please suggest how to improve this section.)

Here we go!

We've established that a primary goal of Fiber is to enable React to take advantage of scheduling. Specifically, we need to be able to

pause work and come back to it later.
assign priority to different types of work.
reuse previously completed work.
abort work if it's no longer needed.
In order to do any of this, we first need a way to break work down into units. In one sense, that's what a fiber is. A fiber represents a unit of work.

To go further, let's go back to the conception of React components as functions of data, commonly expressed as

v = f(d)
It follows that rendering a React app is akin to calling a function whose body contains calls to other functions, and so on. This analogy is useful when thinking about fibers.

The way computers typically track a program's execution is using the call stack. When a function is executed, a new stack frame is added to the stack. That stack frame represents the work that is performed by that function.

When dealing with UIs, the problem is that if too much work is executed all at once, it can cause animations to drop frames and look choppy. What's more, some of that work may be unnecessary if it's superseded by a more recent update. This is where the comparison between UI components and function breaks down, because components have more specific concerns than functions in general.

Newer browsers (and React Native) implement APIs that help address this exact problem: requestIdleCallback schedules a low priority function to be called during an idle period, and requestAnimationFrame schedules a high priority function to be called on the next animation frame. The problem is that, in order to use those APIs, you need a way to break rendering work into incremental units. If you rely only on the call stack, it will keep doing work until the stack is empty.

Wouldn't it be great if we could customize the behavior of the call stack to optimize for rendering UIs? Wouldn't it be great if we could interrupt the call stack at will and manipulate stack frames manually?

That's the purpose of React Fiber. Fiber is reimplementation of the stack, specialized for React components. You can think of a single fiber as a virtual stack frame.

The advantage of reimplementing the stack is that you can keep stack frames in memory and execute them however (and whenever) you want. This is crucial for accomplishing the goals we have for scheduling.

Aside from scheduling, manually dealing with stack frames unlocks the potential for features such as concurrency and error boundaries. We will cover these topics in future sections.

In the next section, we'll look more at the structure of a fiber.

Structure of a fiber
Note: as we get more specific about implementation details, the likelihood that something may change increases. Please file a PR if you notice any mistakes or outdated information.

In concrete terms, a fiber is a JavaScript object that contains information about a component, its input, and its output.

A fiber corresponds to a stack frame, but it also corresponds to an instance of a component.

Here are some of the important fields that belong to a fiber. (This list is not exhaustive.)

type and key
The type and key of a fiber serve the same purpose as they do for React elements. (In fact, when a fiber is created from an element, these two fields are copied over directly.)

The type of a fiber describes the component that it corresponds to. For composite components, the type is the function or class component itself. For host components (div, span, etc.), the type is a string.

Conceptually, the type is the function (as in v = f(d)) whose execution is being tracked by the stack frame.

Along with the type, the key is used during reconciliation to determine whether the fiber can be reused.

child and sibling
These fields point to other fibers, describing the recursive tree structure of a fiber.

The child fiber corresponds to the value returned by a component's render method. So in the following example

function Parent() {
  return <Child />
}
The child fiber of Parent corresponds to Child.

The sibling field accounts for the case where render returns multiple children (a new feature in Fiber!):

function Parent() {
  return [<Child1 />, <Child2 />]
}
The child fibers form a singly-linked list whose head is the first child. So in this example, the child of Parent is Child1 and the sibling of Child1 is Child2.

Going back to our function analogy, you can think of a child fiber as a tail-called function.

return
The return fiber is the fiber to which the program should return after processing the current one. It is conceptually the same as the return address of a stack frame. It can also be thought of as the parent fiber.

If a fiber has multiple child fibers, each child fiber's return fiber is the parent. So in our example in the previous section, the return fiber of Child1 and Child2 is Parent.

pendingProps and memoizedProps
Conceptually, props are the arguments of a function. A fiber's pendingProps are set at the beginning of its execution, and memoizedProps are set at the end.

When the incoming pendingProps are equal to memoizedProps, it signals that the fiber's previous output can be reused, preventing unnecessary work.

pendingWorkPriority
A number indicating the priority of the work represented by the fiber. The ReactPriorityLevel module lists the different priority levels and what they represent.

With the exception of NoWork, which is 0, a larger number indicates a lower priority. For example, you could use the following function to check if a fiber's priority is at least as high as the given level:

function matchesPriority(fiber, priority) {
  return fiber.pendingWorkPriority !== 0 &&
         fiber.pendingWorkPriority <= priority
}
This function is for illustration only; it's not actually part of the React Fiber codebase.

The scheduler uses the priority field to search for the next unit of work to perform. This algorithm will be discussed in a future section.

alternate
flush
To flush a fiber is to render its output onto the screen.
work-in-progress
A fiber that has not yet completed; conceptually, a stack frame which has not yet returned.
At any time, a component instance has at most two fibers that correspond to it: the current, flushed fiber, and the work-in-progress fiber.

The alternate of the current fiber is the work-in-progress, and the alternate of the work-in-progress is the current fiber.

A fiber's alternate is created lazily using a function called cloneFiber. Rather than always creating a new object, cloneFiber will attempt to reuse the fiber's alternate if it exists, minimizing allocations.

You should think of the alternate field as an implementation detail, but it pops up often enough in the codebase that it's valuable to discuss it here.

output
host component
The leaf nodes of a React application. They are specific to the rendering environment (e.g., in a browser app, they are `div`, `span`, etc.). In JSX, they are denoted using lowercase tag names.
Conceptually, the output of a fiber is the return value of a function.

Every fiber eventually has output, but output is created only at the leaf nodes by host components. The output is then transferred up the tree.

The output is what is eventually given to the renderer so that it can flush the changes to the rendering environment. It's the renderer's responsibility to define how the output is created and updated.

Future sections
That's all there is for now, but this document is nowhere near complete. Future sections will describe the algorithms used throughout the lifecycle of an update. Topics to cover include:

how the scheduler finds the next unit of work to perform.
how priority is tracked and propagated through the fiber tree.
how the scheduler knows when to pause and resume work.
how work is flushed and marked as complete.
how side-effects (such as lifecycle methods) work.
what a coroutine is and how it can be used to implement features like context and layout.
```


Create a detailed notes and answer the question in detailed and easy manner in md format
Make a revision tracker at the top to track my revision of this lecture.
 -->
