### JavaScript Notes — Part 6

### Promises & Async/Await

#### The core idea

> A Promise is an object that represents the eventual result of an async operation. Instead of passing a callback into a function and hoping it gets called, a Promise gives you an object you can hold onto, chain methods on, and handle errors from in one place.

Think of it like ordering food at a restaurant. The waiter gives you a token — that token is the Promise. You do not stand at the counter blocking everyone. You go sit down, do other things, and when your order is ready, you are called. The token represents a meal that does not exist yet but will either arrive (resolved) or fail (rejected).

### Part 1 — The three states of a Promise

A Promise is always in one of three states:

 - pending   → the async operation is still running
 - fulfilled → the operation completed successfully, has a value
 - rejected  → the operation failed, has an error reason
  
Once a Promise moves from pending to either fulfilled or rejected, it is settled and its state never changes again.

```js
// A promise starts pending
const p = new Promise((resolve, reject) => {
  // resolve moves it to fulfilled
  // reject moves it to rejected
});
```

### Part 2 — Creating a Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // This function runs immediately when the Promise is created
  // It receives two functions: resolve and reject

  const success = true;

  if (success) {
    resolve("it worked!");    // fulfills the promise with this value
  } else {
    reject("something broke"); // rejects the promise with this reason
  }
});
```
A real example — wrapping setTimeout in a Promise:

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("done waiting");
    }, ms);
  });
}

delay(1000).then(result => console.log(result));
// after 1 second: "done waiting"
```

### Part 3 — Consuming a Promise with .then, .catch, .finally

.then — runs when the Promise is fulfilled

```js
fetchUser(1)
  .then(user => {
    console.log(user.name);  // runs on success
    return user.name;        // whatever you return becomes the next .then's value
  });
```

.catch — runs when the Promise is rejected

```js
fetchUser(999)
  .then(user => console.log(user))
  .catch(error => {
    console.log("Error:", error.message);  // runs on failure
  });
```

.finally — runs no matter what

```js
fetchUser(1)
  .then(user => console.log(user))
  .catch(error => console.log(error))
  .finally(() => {
    console.log("always runs — good for hiding loading spinners");
  });
```

### Part 4 — Promise chaining

This is the real power of Promises. Each .then returns a new Promise, so you can chain them instead of nesting.

```js
// Callback hell version (old way)
fetchUser(1, function(user) {
  fetchPosts(user.id, function(posts) {
    fetchComments(posts[0].id, function(comments) {
      console.log(comments);
    });
  });
});

// Promise chain version (clean)
fetchUser(1)
  .then(user => fetchPosts(user.id))       // return the next promise
  .then(posts => fetchComments(posts[0].id)) // chain continues
  .then(comments => console.log(comments))
  .catch(error => console.log(error));     // one catch handles ALL errors
```

The return rule in chains
What you return from a .then determines what the next .then receives:

```js
Promise.resolve(1)
  .then(val => val + 1)       // returns 2
  .then(val => val * 10)      // receives 2, returns 20
  .then(val => console.log(val)); // receives 20, logs 20

// If you return a Promise, the chain waits for it to resolve
Promise.resolve("user")
  .then(user => fetchPosts(user))  // fetchPosts returns a Promise
  .then(posts => console.log(posts)); // waits for fetchPosts to resolve
```

### Part 5 — Promise static methods

These are the ones interviewers ask about most.

##### Promise.all — wait for ALL promises, fail if ANY fails

```js
const p1 = fetch("/api/user");
const p2 = fetch("/api/posts");
const p3 = fetch("/api/comments");

Promise.all([p1, p2, p3])
  .then(([user, posts, comments]) => {
    // all three completed successfully
    // results come back in the same order as the input
    console.log(user, posts, comments);
  })
  .catch(error => {
    // if ANY of the three fails, catch runs immediately
    // the other promises are NOT cancelled but their results are ignored
    console.log("one of them failed:", error);
  });
```

**Use case:** loading multiple independent resources in parallel. Faster than doing them one by one.

##### Promise.allSettled — wait for ALL, never fails

```js
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach(result => {
      if (result.status === "fulfilled") {
        console.log("success:", result.value);
      } else {
        console.log("failed:", result.reason);
      }
    });
  });
```

**Use case:** when you want all results regardless of failures — like loading a dashboard where some widgets can fail without breaking others.

##### Promise.race — resolves/rejects as soon as the FIRST one settles

```js
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 100));
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 1000));

Promise.race([fast, slow])
  .then(result => console.log(result));  // "fast" — wins the race
```

**Use case:** implementing timeouts for requests.

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

withTimeout(fetch("/api/data"), 3000)
  .then(data => console.log(data))
  .catch(err => console.log(err.message));  // "timed out" if > 3 seconds
```

##### Promise.any — resolves as soon as the FIRST one FULFILLS

```js
// Like race but ignores rejections — only cares about first success
Promise.any([failingPromise, slowPromise, fastPromise])
  .then(result => console.log(result));  // first one to SUCCEED
  // only rejects if ALL promises reject
```

##### Summary table

 MethodResolves whenRejects whenPromise.all ALL fulfillANY rejectsPromise.allSettledALL settle (either way)neverPromise.raceFIRST settles (success or fail)FIRST rejectsPromise.anyFIRST fulfillsALL reject

### Part 6 — async/await

> async/await is syntactic sugar over Promises. Under the hood it is still Promises and the microtask queue — it just looks like synchronous code.

async — makes a function return a Promise

```js
async function greet() {
  return "Hello";  // automatically wrapped in Promise.resolve("Hello")
}

greet().then(msg => console.log(msg));  // "Hello"
// async functions ALWAYS return a Promise
```

- await — pauses execution until a Promise resolves

```js
async function getUser() {
  const user = await fetchUser(1);  // wait here until fetchUser resolves
  console.log(user.name);           // then continue
}
```

- await can only be used inside an async function. Using it outside throws a syntax error (unless you are in the top level of a module — top-level await is supported in modern environments).
- The same chain, rewritten with async/await

```js
// Promise chain
function loadData() {
  return fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => console.log(comments))
    .catch(error => console.log(error));
}

// async/await — reads like synchronous code
async function loadData() {
  try {
    const user     = await fetchUser(1);
    const posts    = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
  } catch (error) {
    console.log(error);
  }
}
```

### Part 7 — Error handling with async/await

Use try/catch — the same way you handle synchronous errors.

```js
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const user = await response.json();
    return user;

  } catch (error) {
    console.error("Failed to load user:", error.message);
    throw error;  // re-throw if you want the caller to handle it too
  }
}
```

A common mistake — not awaiting inside try/catch

```js
// BROKEN — the error is NOT caught
async function broken() {
  try {
    const promise = fetchUser(1);  // forgot await
    // try block exits here, promise is still pending
  } catch (e) {
    // this never runs
  }
}

// FIXED
async function fixed() {
  try {
    const user = await fetchUser(1);  // await is here
  } catch (e) {
    // now this catches the rejection
  }
}
```

### Part 8 — Sequential vs parallel execution

This is one of the most common async/await bugs and interview questions.
Sequential — each waits for the previous (SLOW)

```js
async function sequential() {
  const user    = await fetchUser(1);     // waits 1 second
  const posts   = await fetchPosts(1);    // THEN waits another 1 second
  const profile = await fetchProfile(1);  // THEN waits another 1 second
  // total time: 3 seconds
}
```

Parallel — kick off all at once (FAST)\

```js
async function parallel() {
  const [user, posts, profile] = await Promise.all([
    fetchUser(1),    // all three start at the same time
    fetchPosts(1),
    fetchProfile(1)
  ]);
  // total time: 1 second (the longest one)
}
```

Use sequential when each request depends on the result of the previous one. Use Promise.all when the requests are independent of each other.
The subtle bug — using await in a loop

```js
const ids = [1, 2, 3, 4, 5];

// WRONG — runs sequentially, each waits for the previous
async function slowLoop() {
  for (const id of ids) {
    const user = await fetchUser(id);  // each iteration waits
    console.log(user);
  }
}

// RIGHT — fires all at once
async function fastLoop() {
  const promises = ids.map(id => fetchUser(id));  // create all promises
  const users    = await Promise.all(promises);    // wait for all at once
  users.forEach(user => console.log(user));
}
```

### Part 9 — How async/await connects to the event loop

When you await a Promise, here is what actually happens:

```js
async function main() {
  console.log("before await");        // 1. runs synchronously
  const result = await somePromise;   // 2. pauses here, registers .then internally
  console.log("after await");         // 4. runs as a microtask when promise resolves
}

main();
console.log("after main()");          // 3. runs while main is paused
```

Output:

```
before await
after main()
after await
```

await is literally .then under the hood. The code after await is scheduled as a microtask when the Promise resolves. This is why it goes into the microtask queue and runs before any setTimeout callbacks.

### Part 10 — The fetch API

fetch is the standard way to make HTTP requests in the browser. It returns a Promise.

```js
async function getUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);

  // IMPORTANT: fetch only rejects on network failure
  // A 404 or 500 response is still "successful" from fetch's perspective
  // You must check response.ok manually
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();  // also returns a Promise
  return data;
}
```

fetch with options — POST request

```js

async function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer mytoken123"
    },
    body: JSON.stringify(userData)  // must be a string
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

createUser({ name: "Padma", email: "padma@example.com" });
```

### Part 11 — Common patterns you will write in real code

Pattern 1 — loading state with async/await

```js
async function loadAndDisplay() {
  setLoading(true);

  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);  // always runs, hides the spinner
  }
}
```

Pattern 2 — retry logic

```js
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;  // last attempt — give up
      await delay(1000 * (i + 1));          // wait longer each time
    }
  }
}
```

Pattern 3 — Promise.all with error handling per request

```js
async function loadDashboard() {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchNotifications(),
    fetchStats()
  ]);

  const [user, notifications, stats] = results;

  if (user.status === "fulfilled") setUser(user.value);
  if (notifications.status === "fulfilled") setNotifications(notifications.value);
  if (stats.status === "fulfilled") setStats(stats.value);
  // each one fails independently without breaking the others
}
```

### Part 12 — Promises and the event loop together

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve()
  .then(() => console.log("3"))
  .then(() => console.log("4"));

async function run() {
  console.log("5");
  await Promise.resolve();
  console.log("6");   // microtask
}

run();

console.log("7");
```

Output: `1, 5, 7, 3, 6, 4, 2`

Trace:

- `1` — sync
- `run()` called → `5` — sync inside async function
- `await` pauses `run`, schedules `6` as microtask
- `7` — sync
- Microtask queue: `3` runs, schedules `4`
- Microtask queue: `6` runs
- Microtask queue: `4` runs
- Callback queue: `2` runs

#### What interviews will ask from this note

| Question | The answer |
|---|---|
| What is a Promise? | An object representing the eventual result of an async operation — pending, fulfilled, or rejected |
| What is async/await? | Syntactic sugar over Promises — await pauses the async function and resumes it as a microtask when the Promise resolves |
| Promise.all vs Promise.allSettled | all fails fast if any rejects. allSettled waits for all and never rejects |
| How do you run Promises in parallel? | `Promise.all([p1, p2, p3])` — do not use sequential awaits for independent operations |
| What happens if you forget await? | You get a pending Promise instead of the resolved value — a very common bug |
| Does fetch reject on a 404? | No — fetch only rejects on network failure. You must check `response.ok` manually |
| Where does code after await run? | In the microtask queue — same as `.then` |
| How do you handle errors in async/await? | `try/catch/finally` |

#### Things to memorise

```
Promise states: pending → fulfilled or rejected
.then    → on success
.catch   → on failure
.finally → always

Promise.all        → all must succeed, fails fast
Promise.allSettled → all settle regardless, never fails
Promise.race       → first to settle wins
Promise.any        → first to succeed wins
```

- async function always returns a Promise
- await pauses the function, schedules resume as microtask
- await in a loop = sequential (slow) — use Promise.all instead
- fetch does NOT reject on 404 — check response.ok manually
- try/catch for error handling in async/await

