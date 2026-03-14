### JavaScript Notes — Part 5

#### The Event Loop, Call Stack & Async Basics

##### The core idea first

- JavaScript is single-threaded. That means it can only do one thing at a time. There is only one call stack, and only one piece of code runs at any given moment.
- But you have definitely seen JavaScript do things like fetch data from an API, set timers, and handle button clicks — all without freezing the page. How does a single-threaded language do that?
- The answer is the event loop — a system that lets JavaScript hand off slow work to the browser or Node.js, keep running other code, and come back to handle the result when it is ready.
- Understanding this completely is what separates junior developers from solid mid-level ones in interviews.

#### Part 1 — The Call Stack

> The call stack is where JavaScript keeps track of which function is currently running and what to return to when it finishes.

- Think of it as a stack of plates. You add plates on top, and you always remove from the top. Last in, first out.
  
```js
function greet(name) {
  return "Hello, " + name;
}

function main() {
  const result = greet("Padma");
  console.log(result);
}

main();
```

- Here is what the call stack does step by step:
  
```
1. main() is called         → stack: [main]
2. greet() is called        → stack: [main, greet]
3. greet() returns          → stack: [main]         greet is popped off
4. console.log() is called  → stack: [main, console.log]
5. console.log() returns    → stack: [main]
6. main() returns           → stack: []              empty, done
```

- When the stack is empty, JavaScript is idle and waiting for something to do.

##### Stack overflow

If a function calls itself forever with no way to stop, the stack fills up completely and crashes.

```js
function infinite() {
  return infinite();  // calls itself forever
}

infinite();  // RangeError: Maximum call stack size exceeded
```

This is literally where the name "stack overflow" comes from.

#### Part 2 — The Problem With Slow Operations

Some operations take a long time — fetching data from a server, reading a file, waiting for a timer. If JavaScript waited for these on the call stack, everything would freeze.

```js
// Imagine this actually waits 3 seconds on the stack
const data = fetchFromServer();  // stack is BLOCKED for 3 seconds
console.log("this can't run until fetch is done");
// the entire page is frozen during those 3 seconds
```

- This is called **blocking** — the call stack is occupied and nothing else can run.

- The solution is to make these operations **asynchronous** — hand them off, keep running other code, and handle the result when it comes back.

#### Part 3 — Web APIs and Node APIs

The browser (and Node.js) provide APIs that can handle slow work *outside* the JavaScript call stack:

- `setTimeout` / `setInterval` — timers
- `fetch` — network requests
- DOM event listeners — user clicks, keypresses
- `fs.readFile` — file reading in Node.js

When you call these, JavaScript hands the work off and immediately continues. The browser/Node handles the slow part in the background. When the work is done, the callback you provided gets placed into a **queue**, waiting to be picked up.

#### Part 4 — The Queues

There are two queues. This is where most people get confused, so read carefully.

##### The Callback Queue (also called the Macrotask Queue)

This holds callbacks from:

- `setTimeout`
- `setInterval`
- DOM events (clicks, keyboard)
- `setImmediate` (Node.js)

##### The Microtask Queue

This holds callbacks from:

- Resolved Promises (`.then`, `.catch`, `.finally`)
- `async/await` (which is built on Promises)
- `queueMicrotask()`
- `MutationObserver`

**The microtask queue has higher priority than the callback queue.** Every microtask runs to completion before the event loop picks up the next macrotask. This is critical.


#### Part 5 — The Event Loop

The event loop is a simple loop that runs continuously doing this:

```
1. Is the call stack empty?
   No → wait
   Yes → continue

2. Is the microtask queue empty?
   No → take the first microtask, push it onto the call stack, run it
        repeat until microtask queue is empty
   Yes → continue

3. Is the callback queue empty?
   No → take the first callback, push it onto the call stack, run it
        then go back to step 1
   Yes → wait for something to arrive
The key insight: the microtask queue is completely drained before even one callback queue item runs.
```

#### Part 6 — Putting it all together

Let's trace through a real example step by step:

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

What do you think this logs? Most beginners say `1, 2, 3, 4`. The actual answer is `1, 4, 3, 2`.

Here is exactly why:
```
Step 1: console.log("1") runs
        → call stack: [console.log("1")]
        → logs "1"
        → stack is empty

Step 2: setTimeout(..., 0) runs
        → JS hands this to the browser timer API
        → callback goes to CALLBACK QUEUE after 0ms
        → stack is empty again immediately

Step 3: Promise.resolve().then(...) runs
        → promise is already resolved
        → .then callback goes to MICROTASK QUEUE immediately
        → stack is empty

Step 4: console.log("4") runs
        → logs "4"
        → stack is empty

Step 5: Event loop checks — stack empty? YES
        Microtask queue? HAS ITEM → run it
        → logs "3"
        Microtask queue empty now

Step 6: Event loop checks — callback queue? HAS ITEM → run it
        → logs "2"
```

Final output: 1, 4, 3, 2
The setTimeout with 0ms does NOT mean "run immediately." It means "run as soon as possible after the current synchronous code AND all microtasks are done."

#### Part 7 — A more complex example

```js
console.log("start");

setTimeout(() => console.log("timeout 1"), 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    return Promise.resolve();
  })
  .then(() => console.log("promise 2"));

setTimeout(() => console.log("timeout 2"), 0);

console.log("end");
```

Output:
```
start
end
promise 1
promise 2
timeout 1
timeout 2
```

**Why?**
> Synchronous code runs first (start, end). Then the microtask queue is fully drained (promise 1, promise 2). Then the callback queue runs (timeout 1, timeout 2).

#### Part 8 — setTimeout and setInterval

setTimeout — run once after a delay

```js
// Run after 2 seconds
const timerId = setTimeout(() => {
  console.log("runs after 2 seconds");
}, 2000);

// Cancel it before it runs
clearTimeout(timerId);
setInterval — run repeatedly
jslet count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log("count:", count);
  if (count === 3) {
    clearInterval(intervalId);  // stop after 3 runs
  }
}, 1000);
The 0ms trick
jssetTimeout(() => {
  console.log("deferred");
}, 0);

console.log("immediate");

// Output:
// "immediate"
// "deferred"
```

`setTimeout(fn, 0)` is used to defer code to after the current synchronous execution is done. You will see this in React to defer state updates or DOM reads.

#### Part 9 — Callbacks

> Before Promises existed, async work was handled with callbacks — functions you pass in to be called when the work is done.

```js
function fetchUser(id, callback) {
  setTimeout(() => {
    const user = { id, name: "Padma" };  // simulating a server response
    callback(user);
  }, 1000);
}

fetchUser(1, function(user) {
  console.log(user.name);  // "Padma" — runs after 1 second
});

console.log("this runs first");
```

##### Callback hell — why Promises were invented

> When you need to chain multiple async operations, callbacks nest inside each other and become unreadable. This is called callback hell or the pyramid of doom.

```js
fetchUser(1, function(user) {
  fetchPosts(user.id, function(posts) {
    fetchComments(posts[0].id, function(comments) {
      fetchLikes(comments[0].id, function(likes) {
        // we are now 4 levels deep
        // error handling at each level is a nightmare
        console.log(likes);
      });
    });
  });
});
```

Promises solve this by flattening the chain. You will see this in detail in Note 8.

#### Part 10 — A mental model for the whole system

Here is the complete picture in one place:
```
┌─────────────────────────────────────────┐
│           JavaScript Engine              │
│                                          │
│   Call Stack                             │
│   ┌──────────────┐                       │
│   │ console.log  │  ← currently running  │
│   │ main()       │                       │
│   └──────────────┘                       │
│                                          │
│   Microtask Queue      (high priority)   │
│   [ promise.then ]  [ promise.then ]     │
│                                          │
│   Callback Queue       (low priority)    │
│   [ setTimeout ]  [ click handler ]      │
│                                          │
│   Event Loop                             │
│   stack empty? → drain microtasks        │
│               → take one from callbacks  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        Browser / Node.js APIs            │
│   Timer API    Network API    File API   │
│   (setTimeout) (fetch)        (fs)       │
│                                          │
│   These run OUTSIDE JavaScript           │
│   When done → push callback to queue     │
└─────────────────────────────────────────┘
```

#### Part 11 — requestAnimationFrame (browser only)

> Worth knowing for completeness. requestAnimationFrame tells the browser to run your callback before the next repaint — typically 60 times per second. It sits between the microtask queue and the callback queue in terms of timing.

```js
function animate() {
  // update something visual
  requestAnimationFrame(animate);  // schedule next frame
}
requestAnimationFrame(animate);
```

You will not be heavily tested on this but knowing it exists shows depth.

#### Part 12 — Common interview questions traced through the event loop

**Question 1 — classic**

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
Output: 3, 3, 3

**Why:**
> The setTimeout callbacks go to the callback queue. By the time the event loop runs them, the for loop has finished and i is 3. All three callbacks share the same var i.

Fix: use let (creates a new i per iteration) or an IIFE.

**Question 2 — mixed sync/async**

```js
console.log("A");

setTimeout(() => console.log("B"), 1000);
setTimeout(() => console.log("C"), 0);

Promise.resolve().then(() => console.log("D"));

console.log("E");
```

Output: A, E, D, C, B
**Why:**

A and E are synchronous — run immediately
D is a Promise microtask — runs before any setTimeout
C is setTimeout 0ms — runs after microtasks
B is setTimeout 1000ms — runs last


**Question 3 — what does setTimeout guarantee?**

```js
setTimeout(() => console.log("timeout"), 0);
```

Does this run after exactly 0 milliseconds? No. It runs after:
1. The current synchronous code finishes
2. All microtasks are drained
3. The browser is ready to process the callback queue

The delay is a *minimum* delay, not a guaranteed exact time.

#### What interviews will ask from this note

| Question | The answer |
|---|---|
| Is JavaScript single-threaded? | Yes — one call stack, one thing at a time |
| What is the event loop? | A loop that moves callbacks from queues onto the call stack when the stack is empty |
| Difference between microtask and callback queue? | Microtasks run before callbacks. Microtask queue is fully drained before even one callback runs |
| What goes in the microtask queue? | Promise `.then`/`.catch`, `async/await`, `queueMicrotask` |
| What goes in the callback queue? | `setTimeout`, `setInterval`, DOM events |
| Why does `setTimeout(fn, 0)` not run immediately? | It waits for the stack to be empty AND all microtasks to drain first |
| What is callback hell? | Deeply nested callbacks that make async code unreadable. Solved by Promises |
| What is a stack overflow? | When the call stack exceeds its maximum size, usually from infinite recursion |


## Things to memorise

```
call stack      → where functions run, last in first out
web APIs        → handle slow work outside JS (setTimeout, fetch)
microtask queue → promises, async/await — HIGH priority
callback queue  → setTimeout, events — LOW priority
event loop      → moves items from queues to stack when stack is empty
microtasks drain COMPLETELY before any callback runs
setTimeout(fn, 0) ≠ run immediately — it means run after sync + microtasks
single threaded → one thing at a time, but async = non-blocking
```

The output to memorise for interviews

```js
console.log("1");           // sync         → runs first
setTimeout(() => {}, 0);    // macrotask    → runs last
Promise.resolve().then()    // microtask    → runs before setTimeout
console.log("2");           // sync         → runs second

// Output order: 1, 2, promise, setTimeout
```

