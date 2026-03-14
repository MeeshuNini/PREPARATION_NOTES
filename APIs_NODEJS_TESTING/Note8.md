JavaScript Notes — Part 8
Jest & Unit Testing

The core idea
Testing is writing code that checks your other code works correctly. Instead of manually opening a browser and clicking around every time you make a change, you write automated tests that do that checking for you in milliseconds.
For the LoginRadius SDET role, this is the entire job. You will be expected to write tests, understand what makes a good test, and explain testing concepts clearly. This note covers everything from scratch.

Part 1 — Why testing exists
js// You write this function
function add(a, b) {
  return a + b;
}

// Without tests, you open the browser and manually check:
// add(2, 3) → 5 ✓
// looks good, ship it

// Three weeks later someone changes it to:
function add(a, b) {
  return a * b;  // bug introduced
}

// Without tests — nobody notices until a user reports it
// With tests — the test catches it immediately, before it ships
```

Tests are a safety net. They let you change code confidently because if something breaks, you know instantly.

---

## Part 2 — Types of tests
```
Unit tests        → test one function or component in isolation
                   fast, lots of them, no network/database

Integration tests → test multiple units working together
                   slower, fewer, may use a real database or API

End-to-end tests  → test the entire app from the user's perspective
                   slowest, fewest, simulates a real browser
```

The testing pyramid — you want mostly unit tests, some integration tests, few E2E tests:
```
        /\
       /E2E\          few — slow, expensive
      /------\
     /  Integ  \      some — medium speed
    /------------\
   /  Unit Tests  \   many — fast, cheap
  /________________\
Jest is primarily used for unit and integration tests.

Part 3 — Setting up Jest
bashnpm install --save-dev jest
In package.json:
json{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Jest automatically finds test files that:
- End in `.test.js` or `.spec.js`
- Are inside a `__tests__` folder
```
src/
  utils.js
  utils.test.js       ← Jest finds this automatically
  __tests__/
    auth.test.js      ← Jest finds this too

Part 4 — Your first test
js// utils.js
function add(a, b) {
  return a + b;
}

function isEven(n) {
  return n % 2 === 0;
}

module.exports = { add, isEven };
js// utils.test.js
const { add, isEven } = require("./utils");

test("adds two numbers correctly", () => {
  expect(add(2, 3)).toBe(5);
});

test("identifies even numbers", () => {
  expect(isEven(4)).toBe(true);
  expect(isEven(3)).toBe(false);
});
Run it:
bashnpm test

# Output:
# PASS  utils.test.js
#   ✓ adds two numbers correctly (2ms)
#   ✓ identifies even numbers (1ms)
```

---

## Part 5 — The AAA Pattern

Every test in the world follows this structure. Memorise it and say it in every interview.
```
Arrange  → set up the data and conditions you need
Act      → call the thing you are testing
Assert   → check the result is what you expected
jstest("returns the full name", () => {
  // Arrange
  const firstName = "Padma";
  const lastName  = "Kondeti";

  // Act
  const result = getFullName(firstName, lastName);

  // Assert
  expect(result).toBe("Padma Kondeti");
});
Every single test you write should have these three sections, even if they are just one line each. Interviewers will ask you to name this pattern.

Part 6 — Matchers
Matchers are the methods you chain onto expect() to make assertions.
Equality
jsexpect(2 + 2).toBe(4);              // strict equality ===
expect({a: 1}).toEqual({a: 1});     // deep equality — use for objects and arrays
expect({a: 1}).toBe({a: 1});        // FAILS — different object references
toBe uses === — it fails for objects because two different object literals are never === even if they look the same. Always use toEqual for objects and arrays.
Truthiness
jsexpect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect("hello").toBeDefined();
expect(null).toBeNull();
Numbers
jsexpect(5).toBeGreaterThan(3);
expect(3).toBeLessThan(5);
expect(5).toBeGreaterThanOrEqual(5);
expect(0.1 + 0.2).toBeCloseTo(0.3);  // use for floats — avoids 0.30000000004 issues
Strings
jsexpect("Padmasahithi").toContain("Padma");
expect("hello world").toMatch(/world/);        // regex
expect("hello world").toMatch("world");        // substring
Arrays
jsexpect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
expect([{id: 1}, {id: 2}]).toContainEqual({id: 1});  // deep check
Objects
jsconst user = { name: "Padma", age: 22, role: "dev" };

expect(user).toHaveProperty("name");
expect(user).toHaveProperty("name", "Padma");  // check value too
expect(user).toMatchObject({ name: "Padma" }); // partial match — extra fields ok
Errors
jsfunction divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

// must wrap in a function — otherwise error throws before expect runs
expect(() => divide(1, 0)).toThrow();
expect(() => divide(1, 0)).toThrow("Cannot divide by zero");
expect(() => divide(1, 0)).toThrow(Error);
Negating with .not
jsexpect(5).not.toBe(4);
expect([1, 2, 3]).not.toContain(99);
expect(user).not.toHaveProperty("password");  // useful security check

Part 7 — Organising tests with describe
describe groups related tests together. Use it to organise tests by function or feature.
jsdescribe("add function", () => {
  test("adds positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("adds negative numbers", () => {
    expect(add(-1, -2)).toBe(-3);
  });

  test("adds zero", () => {
    expect(add(5, 0)).toBe(5);
  });
});

describe("isEven function", () => {
  test("returns true for even numbers", () => {
    expect(isEven(4)).toBe(true);
  });

  test("returns false for odd numbers", () => {
    expect(isEven(3)).toBe(false);
  });
});
```

Output:
```
add function
  ✓ adds positive numbers
  ✓ adds negative numbers
  ✓ adds zero

isEven function
  ✓ returns true for even numbers
  ✓ returns false for odd numbers

Part 8 — Setup and teardown
Run code before or after tests automatically.
jsdescribe("database tests", () => {
  let db;

  beforeAll(() => {
    db = connectToDatabase();  // runs ONCE before all tests in this describe
  });

  afterAll(() => {
    db.close();  // runs ONCE after all tests in this describe
  });

  beforeEach(() => {
    db.clear();  // runs before EACH test — fresh state every time
  });

  afterEach(() => {
    jest.clearAllMocks();  // runs after EACH test — clean up mocks
  });

  test("inserts a user", () => {
    db.insert({ name: "Padma" });
    expect(db.find("Padma")).toBeDefined();
  });

  test("deletes a user", () => {
    // db was cleared in beforeEach so no leftover data from previous test
    db.insert({ name: "Padma" });
    db.delete("Padma");
    expect(db.find("Padma")).toBeUndefined();
  });
});
```

### When to use which
```
beforeAll  → expensive setup that only needs to happen once (db connection, server start)
afterAll   → cleanup that only needs to happen once (close connection)
beforeEach → reset state so each test starts fresh (clear db, reset mocks)
afterEach  → clean up after each test (clear mocks, remove temp files)
```

---

## Part 9 — Mocking

Mocking is replacing a real dependency with a fake one that you control. This is the heart of unit testing.

### Why mock?
```
Real function: calls a live database, makes a real HTTP request, reads from disk
Problem: tests become slow, flaky, and dependent on external services

Mock: a fake function that returns whatever you tell it to
Result: tests are fast, reliable, and isolated
jest.fn() — create a mock function
jsconst mockFn = jest.fn();

mockFn("hello");
mockFn("world");

expect(mockFn).toHaveBeenCalled();            // was it called at all?
expect(mockFn).toHaveBeenCalledTimes(2);      // called exactly twice?
expect(mockFn).toHaveBeenCalledWith("hello"); // called with this argument?
expect(mockFn).toHaveBeenLastCalledWith("world"); // last call?
Making a mock return a value
jsconst mockFn = jest.fn();

mockFn.mockReturnValue(42);   // always returns 42
mockFn();  // 42
mockFn();  // 42

mockFn.mockReturnValueOnce(1)  // returns 1 on first call
      .mockReturnValueOnce(2)  // returns 2 on second call
      .mockReturnValue(99);    // returns 99 on all subsequent calls

mockFn();  // 1
mockFn();  // 2
mockFn();  // 99
mockFn();  // 99
Making a mock return a Promise
jsconst mockFetchUser = jest.fn();

mockFetchUser.mockResolvedValue({ id: 1, name: "Padma" });
// equivalent to mockReturnValue(Promise.resolve({ id: 1, name: "Padma" }))

mockFetchUser.mockRejectedValue(new Error("Not found"));
// equivalent to mockReturnValue(Promise.reject(new Error("Not found")))

Part 10 — Mocking modules
Mock an entire imported module so it does not hit the real implementation.
js// emailService.js
async function sendEmail(to, subject) {
  // actually sends an email via SMTP
  await smtp.send({ to, subject });
}

module.exports = { sendEmail };
js// user.js
const { sendEmail } = require("./emailService");

async function registerUser(email) {
  // save user to db...
  await sendEmail(email, "Welcome!");
  return { email, registered: true };
}

module.exports = { registerUser };
js// user.test.js
jest.mock("./emailService");  // replaces the entire module with auto-mocked version

const { sendEmail } = require("./emailService");
const { registerUser } = require("./user");

test("registers a user and sends welcome email", async () => {
  // Arrange
  sendEmail.mockResolvedValue(true);  // control what the mock returns

  // Act
  const result = await registerUser("padma@example.com");

  // Assert
  expect(result).toEqual({ email: "padma@example.com", registered: true });
  expect(sendEmail).toHaveBeenCalledWith("padma@example.com", "Welcome!");
  expect(sendEmail).toHaveBeenCalledTimes(1);
});

Part 11 — Spies
A spy wraps a real function and tracks calls to it without replacing its behaviour.
jsconst calculator = {
  add(a, b) { return a + b; }
};

const spy = jest.spyOn(calculator, "add");

calculator.add(2, 3);  // real function still runs, returns 5

expect(spy).toHaveBeenCalledWith(2, 3);
expect(spy).toHaveBeenCalledTimes(1);

// You can also override the implementation
spy.mockImplementation((a, b) => 999);
calculator.add(2, 3);  // now returns 999

// Restore the original
spy.mockRestore();
calculator.add(2, 3);  // back to real implementation, returns 5
```

### Mock vs Spy
```
jest.fn()       → creates a brand new fake function with no real implementation
jest.spyOn()    → wraps an existing function, still calls the real one by default
                  use when you want to verify calls but keep the real behaviour

Part 12 — Testing async code
Testing Promises
js// Method 1 — return the promise (Jest waits for it)
test("fetches a user", () => {
  return fetchUser(1).then(user => {
    expect(user.name).toBe("Padma");
  });
});

// Method 2 — async/await (cleanest, most common)
test("fetches a user", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Padma");
});

// Method 3 — resolves/rejects matchers
test("fetches a user", async () => {
  await expect(fetchUser(1)).resolves.toEqual({ id: 1, name: "Padma" });
});

test("throws on invalid id", async () => {
  await expect(fetchUser(-1)).rejects.toThrow("User not found");
});
The most common async testing mistake
js// BROKEN — test always passes even if fetchUser throws
test("broken test", () => {
  fetchUser(1).then(user => {
    expect(user.name).toBe("Padma");
  });
  // test finishes before the promise resolves
  // the expect inside .then never runs
});

// FIXED — either return the promise or use async/await
test("fixed test", async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe("Padma");
});

Part 13 — Code coverage
Coverage measures how much of your code is actually executed by your tests.
bashnpm test -- --coverage

# Output:
# ------------|---------|----------|---------|---------|
# File        | % Stmts | % Branch | % Funcs | % Lines |
# ------------|---------|----------|---------|---------|
# utils.js    |   85.71 |    75.00 |  100.00 |   85.71 |
# auth.js     |   60.00 |    50.00 |   66.67 |   60.00 |
# ------------|---------|----------|---------|---------|
```

### Four types of coverage
```
Statement coverage → was each line of code executed?
Branch coverage    → was each if/else branch taken? (most important)
Function coverage  → was each function called?
Line coverage      → was each line hit? (similar to statement)
What coverage does NOT tell you
100% coverage does not mean your tests are good. It means every line ran — not that every case was handled correctly.
jsfunction divide(a, b) {
  return a / b;
}

// This gives 100% coverage
test("divides", () => {
  expect(divide(10, 2)).toBe(5);
});

// But this case is untested and will return Infinity
divide(10, 0);  // Infinity — should probably throw
Coverage is a tool, not a goal. Aim for high branch coverage on critical paths.

Part 14 — What good tests look like
A well-written test
jsdescribe("createUser", () => {
  describe("with valid data", () => {
    test("returns the created user with an id", async () => {
      // Arrange
      const userData = { name: "Padma", email: "padma@example.com" };
      mockDb.insert.mockResolvedValue({ id: 42, ...userData });

      // Act
      const result = await createUser(userData);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: "Padma",
        email: "padma@example.com"
      });
    });
  });

  describe("with invalid data", () => {
    test("throws when email is missing", async () => {
      await expect(createUser({ name: "Padma" }))
        .rejects
        .toThrow("Email is required");
    });

    test("throws when email is already taken", async () => {
      mockDb.insert.mockRejectedValue(new Error("Duplicate email"));
      await expect(createUser({ name: "Padma", email: "taken@example.com" }))
        .rejects
        .toThrow("Duplicate email");
    });
  });
});
```

### Characteristics of good tests
```
1. One assertion per test (ideally)
   → when a test fails you know exactly what broke

2. Tests are independent
   → no test depends on another test running first

3. Tests are deterministic
   → same code always produces same result, no random data

4. Test names describe behaviour, not implementation
   → "returns 404 when user not found"
   → NOT "test getUserById function"

5. Tests cover the happy path AND edge cases
   → valid input, invalid input, empty input, boundary values

Part 15 — Testing patterns for the SDET role
Since LoginRadius is an identity/auth platform, here are the exact patterns you will write:
Testing an auth function
jsdescribe("validateToken", () => {
  test("returns user data for a valid token", async () => {
    const token = generateTestToken({ userId: 1, role: "user" });
    const result = await validateToken(token);
    expect(result).toMatchObject({ userId: 1, role: "user" });
  });

  test("throws for an expired token", async () => {
    const expiredToken = generateTestToken({ userId: 1 }, { expiresIn: "-1s" });
    await expect(validateToken(expiredToken)).rejects.toThrow("Token expired");
  });

  test("throws for a malformed token", async () => {
    await expect(validateToken("not.a.token")).rejects.toThrow();
  });

  test("throws for a null token", async () => {
    await expect(validateToken(null)).rejects.toThrow();
  });
});
Testing an API handler
jsdescribe("POST /api/users", () => {
  test("creates a user and returns 201", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "Padma", email: "padma@example.com" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: "Padma",
      email: "padma@example.com"
    });
  });

  test("returns 400 when email is missing", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ name: "Padma" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("email");
  });

  test("returns 409 when email already exists", async () => {
    await createUser({ name: "Existing", email: "taken@example.com" });

    const response = await request(app)
      .post("/api/users")
      .send({ name: "Padma", email: "taken@example.com" });

    expect(response.status).toBe(409);
  });
});
```

---

## What interviews will ask from this note

| Question | The answer |
|---|---|
| What is the AAA pattern? | Arrange, Act, Assert — set up data, call the function, check the result |
| What is mocking? | Replacing a real dependency with a fake one you control so tests are fast and isolated |
| `toBe` vs `toEqual` | `toBe` uses strict equality (===), `toEqual` does deep comparison — use toEqual for objects and arrays |
| What is code coverage? | A metric showing what percentage of your code is executed by your tests |
| Mock vs spy | `jest.fn()` creates a fake function. `jest.spyOn()` wraps a real function and tracks calls while keeping the original behaviour |
| Why does this async test always pass? | Because the promise was not awaited — the test finished before the assertion ran |
| What is `beforeEach` for? | Reset state before each test so tests are independent and do not affect each other |
| What is branch coverage? | Whether each possible branch of an if/else was executed by your tests |

---

## Things to memorise
```
AAA pattern → Arrange, Act, Assert. Every test.

toBe        → strict equality, primitives
toEqual     → deep equality, objects and arrays
toMatchObject → partial match, extra fields ok
toContain   → array or string contains value
toThrow     → function throws an error
resolves/rejects → async matchers

jest.fn()      → fake function, no real implementation
jest.spyOn()   → wraps real function, tracks calls
jest.mock()    → replaces entire module
mockResolvedValue → mock returns a resolved promise
mockRejectedValue → mock returns a rejected promise

beforeAll  → once before all tests
afterAll   → once after all tests
beforeEach → before every test, use for reset
afterEach  → after every test, use for cleanup

always await async tests
always return promise if not using async/await
coverage = how much code runs, not how good tests are

