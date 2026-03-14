JavaScript Notes — Part 4
ES6+ Features

What is ES6?
ES6 is short for ECMAScript 2015 — the version of JavaScript released in 2015 that modernised the language completely. Everything from let/const to arrow functions to classes came from ES6. "ES6+" just means ES6 and everything that came after it.
All the modern JavaScript you see in React, Next.js, and Node.js codebases is ES6+. If your code looks old and verbose, you are probably not using these features.

1. Template Literals
The old way to build strings was messy:
jsconst name = "Padma";
const age = 22;

// Old way — string concatenation
const msg = "Hello, my name is " + name + " and I am " + age + " years old.";

// ES6 way — template literals
const msg = `Hello, my name is ${name} and I am ${age} years old.`;
Template literals use backticks ` instead of quotes. You embed expressions with ${ }.
js// Any expression works inside ${ }
const a = 5;
const b = 10;
console.log(`Sum is ${a + b}`);         // "Sum is 15"
console.log(`Is adult: ${age >= 18}`);  // "Is adult: true"

// Multi-line strings — no more \n needed
const html = `
  <div>
    <h1>Hello</h1>
    <p>World</p>
  </div>
`;

// Calling functions inside
const getName = () => "Padma";
console.log(`Hello, ${getName()}`);  // "Hello, Padma"

2. Destructuring
Destructuring lets you unpack values from arrays or objects into individual variables in one clean line.
Object destructuring
jsconst person = {
  name: "Padma",
  age: 22,
  city: "Hyderabad",
  role: "developer"
};

// Old way
const name = person.name;
const age  = person.age;

// ES6 way
const { name, age } = person;

// Rename while destructuring
const { name: fullName, age: years } = person;
console.log(fullName);  // "Padma"
console.log(years);     // 22

// Default values — used when the property does not exist
const { country = "India" } = person;
console.log(country);  // "India"

// Rename AND default at the same time
const { country: homeland = "India" } = person;

// Nested destructuring
const user = {
  name: "Padma",
  address: {
    city: "Hyderabad",
    pin: "500001"
  }
};

const { address: { city, pin } } = user;
console.log(city);  // "Hyderabad"
console.log(pin);   // "500001"

// Destructuring in function parameters — very common in React
function greet({ name, age }) {
  console.log(`Hi ${name}, you are ${age}`);
}
greet(person);  // "Hi Padma, you are 22"
Array destructuring
jsconst colors = ["red", "green", "blue"];

const [first, second, third] = colors;
console.log(first);   // "red"
console.log(second);  // "green"

// Skip items using commas
const [, , third] = colors;
console.log(third);  // "blue"

// Default values
const [a, b, c, d = "yellow"] = colors;
console.log(d);  // "yellow"

// Swap variables — classic interview trick
let x = 1;
let y = 2;
[x, y] = [y, x];
console.log(x);  // 2
console.log(y);  // 1

// Destructuring with rest
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]

3. Spread Operator ...
Spread expands an iterable — an array, object, or string — into individual elements.
Spread with arrays
jsconst a = [1, 2, 3];
const b = [4, 5, 6];

// Combine arrays
const combined = [...a, ...b];       // [1, 2, 3, 4, 5, 6]

// Copy an array — creates a NEW array, not the same reference
const copy = [...a];
copy.push(99);
console.log(a);     // [1, 2, 3] — original untouched
console.log(copy);  // [1, 2, 3, 99]

// Insert in the middle
const withExtra = [0, ...a, 99];  // [0, 1, 2, 3, 99]

// Pass array items as individual function arguments
function add(x, y, z) { return x + y + z; }
const nums = [1, 2, 3];
add(...nums);  // 6 — same as add(1, 2, 3)
Spread with objects
jsconst defaults = { theme: "light", lang: "en", fontSize: 14 };
const custom   = { theme: "dark", fontSize: 18 };

// Merge — later properties overwrite earlier ones
const settings = { ...defaults, ...custom };
// { theme: "dark", lang: "en", fontSize: 18 }

// Copy an object
const copy = { ...defaults };

// Add new properties while copying
const extended = { ...defaults, author: "Padma" };
Shallow copy warning
Spread only goes one level deep. Nested objects are still shared by reference.
jsconst original = {
  name: "Padma",
  address: { city: "Hyderabad" }   // nested object
};

const copy = { ...original };

copy.name = "Ananya";               // fine — name is a primitive
copy.address.city = "Mumbai";       // MUTATES original too — address is shared

console.log(original.name);         // "Padma"    — primitive was copied
console.log(original.address.city); // "Mumbai"   — nested object was NOT copied
This is called a shallow copy. For a deep copy, use structuredClone(obj) or JSON.parse(JSON.stringify(obj)).

4. Rest Parameters ...
Rest looks identical to spread but does the opposite — it collects multiple values into one array. The difference is context: spread is for expanding, rest is for collecting.
js// Rest in function parameters — collect all extra args into an array
function sum(first, second, ...rest) {
  console.log(first);   // 1
  console.log(second);  // 2
  console.log(rest);    // [3, 4, 5]
  return first + second + rest.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4, 5);  // 15

// Rest must always be the LAST parameter
function bad(...rest, last) {}   // SyntaxError
Spread vs Rest — same symbol, opposite jobs
js// SPREAD — expands an array into individual values
const nums = [1, 2, 3];
console.log(...nums);    // 1 2 3  (three separate values)

// REST — collects individual values into an array
function collect(...nums) {
  console.log(nums);     // [1, 2, 3]  (one array)
}
collect(1, 2, 3);

5. Optional Chaining ?.
Optional chaining lets you safely access deeply nested properties without throwing an error if something in the chain is null or undefined.
jsconst user = {
  name: "Padma",
  address: {
    city: "Hyderabad"
  }
};

// Old way — manual null checks
const city = user && user.address && user.address.city;

// ES6+ way — optional chaining
const city = user?.address?.city;   // "Hyderabad"

// If anything in the chain is null/undefined, returns undefined instead of crashing
const pin = user?.address?.pin;     // undefined — no error
const zip = user?.contact?.phone;   // undefined — contact doesn't exist, no error

// Without optional chaining
const zip = user.contact.phone;     // TypeError: Cannot read property 'phone' of undefined
Optional chaining with methods and arrays
js// With method calls
user?.getProfile?.();      // calls getProfile() only if it exists

// With arrays
const users = null;
users?.[0]?.name;          // undefined — no error

6. Nullish Coalescing ??
Returns the right side only when the left side is null or undefined. This is different from || which triggers on ANY falsy value.
js// ?? — only triggers on null or undefined
const name = null ?? "Anonymous";     // "Anonymous"
const age  = undefined ?? 0;          // 0
const score = 0 ?? 100;               // 0  — 0 is NOT null/undefined, so left side wins
const title = "" ?? "Untitled";       // ""  — empty string is NOT null/undefined

// || — triggers on ANY falsy value (null, undefined, 0, "", false, NaN)
const score = 0 || 100;              // 100 — 0 is falsy, so right side wins
const title = "" || "Untitled";      // "Untitled" — "" is falsy
In real code, ?? is almost always what you want for default values. || for defaults is a common source of bugs when 0 or "" are valid values.
Combining ?. and ??
jsconst user = null;
const city = user?.address?.city ?? "Unknown";
// user is null → optional chaining returns undefined → ?? gives "Unknown"

7. Short Circuit Evaluation
JavaScript's && and || do not just return true or false — they return one of their operands.
js// && — returns first falsy value, or the last value if all are truthy
false && "hello"     // false
null && "hello"      // null
"hello" && "world"   // "world"
1 && 2 && 3          // 3

// || — returns first truthy value, or the last value if all are falsy
false || "hello"     // "hello"
null || undefined    // undefined
"hello" || "world"   // "hello"
This is used heavily in React for conditional rendering:
js// Render the component only if isLoggedIn is true
{isLoggedIn && <Dashboard />}

// Render one thing or another
{isLoggedIn ? <Dashboard /> : <Login />}

8. Enhanced Object Literals
jsconst name = "Padma";
const age = 22;

// Old way
const person = { name: name, age: age };

// ES6 shorthand — when key and variable name are the same
const person = { name, age };

// Computed property names
const key = "score";
const obj = {
  [key]: 100,          // { score: 100 }
  [`${key}_max`]: 200  // { score_max: 200 }
};

// Method shorthand
const calculator = {
  // Old way
  add: function(a, b) { return a + b; },

  // ES6 shorthand
  subtract(a, b) { return a - b; }
};

9. for...of and Iterables
for...of works on anything that is iterable — arrays, strings, Maps, Sets, and more.
js// Arrays
for (const item of [1, 2, 3]) {
  console.log(item);  // 1, 2, 3
}

// Strings
for (const char of "hello") {
  console.log(char);  // h, e, l, l, o
}

// Get index AND value using entries()
const fruits = ["apple", "banana", "mango"];
for (const [index, value] of fruits.entries()) {
  console.log(index, value);
  // 0 "apple"
  // 1 "banana"
  // 2 "mango"
}

10. Map and Set
Map — like an object but keys can be anything
jsconst map = new Map();

map.set("name", "Padma");
map.set(42, "the answer");
map.set(true, "boolean key");

map.get("name");    // "Padma"
map.get(42);        // "the answer"
map.has("name");    // true
map.size;           // 3
map.delete("name");

// Iterating
for (const [key, value] of map) {
  console.log(key, value);
}
When to use Map over a plain object:

When keys are not strings
When insertion order matters and you need to iterate reliably
When you frequently add and remove keys (Map is optimised for this)

Set — a collection of unique values
jsconst set = new Set([1, 2, 3, 2, 1]);  // duplicates removed
console.log(set);  // Set {1, 2, 3}

set.add(4);
set.has(3);     // true
set.delete(2);
set.size;       // 3

// Most common use — remove duplicates from an array
const arr = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(arr)];  // [1, 2, 3, 4]

11. Symbols
A Symbol is a guaranteed unique value. No two symbols are ever equal.
jsconst id1 = Symbol("id");
const id2 = Symbol("id");

id1 === id2  // false — always unique, even with the same description

// Main use: unique object keys that won't accidentally clash
const USER_ID = Symbol("userId");
const obj = {
  [USER_ID]: 123,
  name: "Padma"
};

obj[USER_ID];  // 123
// Symbol keys don't show up in for...in or Object.keys()
Symbols are rarely tested at the junior level but good to know they exist.

12. Generators
A generator is a function that can pause its execution and resume later. It uses function* syntax and the yield keyword.
jsfunction* counter() {
  yield 1;   // pause here, return 1
  yield 2;   // pause here, return 2
  yield 3;   // pause here, return 3
}

const gen = counter();  // does NOT run the function yet

gen.next();  // { value: 1, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 3, done: false }
gen.next();  // { value: undefined, done: true }
Each call to .next() runs the function until the next yield, then pauses.
Infinite generators
jsfunction* infiniteId() {
  let id = 1;
  while (true) {
    yield id++;   // pauses here each time, gives the next id
  }
}

const gen = infiniteId();
gen.next().value;  // 1
gen.next().value;  // 2
gen.next().value;  // 3
// runs forever on demand, never all at once
When generators come up in interviews
Generators are used for lazy evaluation — producing values one at a time instead of all at once. You will see them in advanced Redux (redux-saga), and interviewers sometimes ask you to implement a range function:
jsfunction* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

for (const n of range(0, 10, 2)) {
  console.log(n);  // 0, 2, 4, 6, 8
}

13. Iterators
An iterator is any object that has a .next() method returning { value, done }. Generators produce iterators automatically. You can also make your own.
jsfunction makeRangeIterator(start, end) {
  let current = start;

  return {
    next() {
      if (current < end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const iter = makeRangeIterator(1, 4);
iter.next();  // { value: 1, done: false }
iter.next();  // { value: 2, done: false }
iter.next();  // { value: 3, done: false }
iter.next();  // { value: undefined, done: true }
Making an object iterable
For an object to work with for...of, it needs a [Symbol.iterator] method that returns an iterator.
jsconst range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const n of range) {
  console.log(n);  // 1, 2, 3, 4, 5
}

14. WeakMap and WeakRef
WeakMap
A WeakMap is like a Map, but its keys must be objects, and if the object has no other references, it gets garbage collected automatically — the WeakMap does not prevent cleanup.
jsconst cache = new WeakMap();

let user = { name: "Padma" };
cache.set(user, { score: 100 });

cache.get(user);  // { score: 100 }

user = null;
// now the user object has no references
// the WeakMap entry is garbage collected automatically
// you cannot even check because WeakMap is not iterable
Use case: caching data associated with DOM nodes or objects without causing memory leaks.
WeakMap vs Map for interview purposes
MapWeakMapKey typesanythingobjects onlyPrevents GC?yesnoIterable?yesnoUse casegeneralprivate data, caches tied to object lifetime

15. The most important ES6+ patterns in React codebases
Everything above gets used constantly in React. Here is where you will see each feature:
js// Destructuring props
function Card({ title, description, onClick }) { ... }

// Destructuring state
const [count, setCount] = useState(0);

// Spread to pass all props forward
function Wrapper(props) {
  return <Inner {...props} />;
}

// Optional chaining on API responses
const city = response?.data?.user?.address?.city ?? "Unknown";

// Template literals in classNames
<div className={`card ${isActive ? "active" : ""}`}>

// Short circuit for conditional rendering
{isLoggedIn && <Dashboard />}

// Computed keys for state updates
const field = "email";
setState(prev => ({ ...prev, [field]: value }));

// Unique keys in lists — sometimes Symbols
// Removing duplicate IDs from API data
const uniqueUsers = [...new Set(users.map(u => u.id))];
```

---

## What interviews will ask from this note

| Question | The answer |
|---|---|
| Difference between `??` and `\|\|` | `??` only triggers on null/undefined. `\|\|` triggers on any falsy value including 0 and "" |
| What is optional chaining? | Safe property access — returns undefined instead of throwing if any part of the chain is null/undefined |
| Spread vs rest | Spread expands an iterable into individual values. Rest collects individual values into an array |
| Shallow copy vs deep copy | Spread creates a shallow copy — nested objects are still shared by reference |
| What is a generator? | A function that can pause with yield and resume. Returns an iterator. |
| Remove duplicates from an array | `[...new Set(arr)]` |
| Map vs plain object | Map can have non-string keys, is iterable, better for frequent add/delete |
| Set vs array | Set stores only unique values |

---

## Things to memorise
```
??     → null/undefined only
||     → any falsy value
?.     → safe access, returns undefined instead of crashing
...    → spread when expanding, rest when collecting
Map    → any key type, ordered, iterable
Set    → unique values only
[...new Set(arr)] → remove duplicates
shallow copy → spread only goes one level deep
generator → function* with yield, pauses execution

