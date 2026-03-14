### JavaScript Notes — Part 1

#### Variables, Data Types, Functions, Arrays, Loops & Objects

##### 1. Variables

- A variable is a named container that holds a value. In JavaScript there are three ways to declare one.
  
```javascript
var name = "Sahithi";    // old way — avoid this
let age = 26;          // modern — use this when the value will change
const city = "Hyderabad";  // use this when the value will NOT change
```

- The difference between var, let, and const

```javascript
// var — function scoped, can be redeclared, avoid it
var x = 1;
var x = 2;  // no error. this is why var causes bugs.

// let — block scoped, can be reassigned, cannot be redeclared
let score = 10;
score = 20;      // fine
let score = 30;  // ERROR — already declared

// const — block scoped, cannot be reassigned at all
const PI = 3.14;
PI = 3;          // ERROR — cannot reassign a const
```

###### What "block scoped" means

- A block is anything inside { } — an if statement, a loop, a function. Block-scoped variables only exist inside the block they were declared in.
  
```js
{
  let x = 10;
  const y = 20;
  console.log(x); // 10 — works fine inside the block
}
console.log(x);   // ERROR — x doesn't exist out here
console.log(y);   // ERROR — y doesn't exist out here

// var ignores blocks entirely
{
  var z = 30;
}
console.log(z);   // 30 — var leaks out of blocks. this is bad.
```

- Rules for naming variables
  
```js
let firstName = "Sahithi";   // camelCase — standard in JS
let _private = true;       // underscore prefix is fine
let $dollar = 5;           // dollar sign is fine

let 1name = "bad";         // ERROR — cannot start with a number
let my-name = "bad";       // ERROR — hyphens not allowed
let let = "bad";           // ERROR — cannot use reserved keywords
```

#### 2. Data Types

- JavaScript has two categories of data types — primitives and objects.

##### Primitive types

```js
//String — text, always in quotes
let name = "Sahithi";
let greeting = 'Hello';
let template = `Hi, ${name}`;  // template literal — backtick, can embed variables

// Number — integers and decimals, no distinction
let age = 22;
let price = 9.99;
let negative = -5;

// Boolean — only two values
let isLoggedIn = true;
let isAdmin = false;

// undefined — variable declared but no value assigned
let score;
console.log(score);  // undefined

// null — intentional absence of value (you set this on purpose)
let user = null;

// Symbol — unique identifier, rarely used at this level
const id = Symbol("id");
```

- Checking types

```js
typeof "hello"     // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← famous JS bug, null is not actually an object
typeof {}          // "object"
typeof []          // "object"  ← arrays are objects in JS
typeof function(){}  // "function"
```

##### Type coercion — JavaScript's biggest gotcha

- JavaScript automatically converts types in certain situations. This causes bugs.
  
```js
"5" + 3      // "53"  — + with a string does concatenation
"5" - 3      // 2     — - converts the string to number
"5" == 5     // true  — == does type coercion (loose equality)
"5" === 5    // false — === does NOT coerce (strict equality)

// Always use === in interviews and real code. Never ==.

null == undefined   // true  (loose)
null === undefined  // false (strict)
```

#### 3. Functions

- A function is a reusable block of code. There are several ways to write one in JavaScript.

##### Function declaration

```js
function greet(name) {
  return "Hello, " + name;
}

greet("Sahithi");  // "Hello, Sahithi"
```

##### The anatomy :

function — keyword
greet — the name you give it
(name) — parameters (inputs the function accepts)
{ ... } — the function body
return — sends a value back to whoever called the function

```js
// Without return, the function gives back undefined
function sayHi() {
  console.log("Hi");
  // no return statement
}

const result = sayHi();  // prints "Hi"
console.log(result);     // undefined
```

##### Function expression

- Assign a function to a variable. The function has no name of its own.
  
```js
const greet = function(name) {
  return "Hello, " + name;
};

greet("Sahithi");  // "Hello, Sahithi"
```

##### Arrow functions — the modern, short way

- Arrow functions are the most common syntax in modern React and Node.js code.
  
```js
// Full version
const greet = (name) => {
  return "Hello, " + name;
};

// Short version — if the body is a single expression, skip the braces and return
const greet = (name) => "Hello, " + name;

// Single parameter — can skip the parentheses
const greet = name => "Hello, " + name;

// No parameters — empty parentheses required
const sayHello = () => "Hello!";

// Multiple parameters — parentheses required
const add = (a, b) => a + b;
```

###### Parameters vs arguments

```js
function add(a, b) {   // a and b are PARAMETERS — placeholders in the definition
  return a + b;
}

add(3, 5);             // 3 and 5 are ARGUMENTS — actual values passed in
```

###### Default parameters

```js
function greet(name = "stranger") {
  return "Hello, " + name;
}

greet("Sahithi");  // "Hello, Sahithi"
greet();         // "Hello, stranger" — default kicks in when nothing is passed
```

###### Rest parameters — accept any number of arguments

```js
function sum(...numbers) {    // ...numbers collects all arguments into an array
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);       // 6
sum(1, 2, 3, 4, 5); // 15
```

#### 4. Arrays

- An array is an ordered list of values. Items are indexed starting from 0.

```js
const fruits = ["apple", "banana", "mango"];

fruits[0]  // "apple"
fruits[1]  // "banana"
fruits[2]  // "mango"
fruits[3]  // undefined — index doesn't exist

fruits.length  // 3
```

##### Adding and removing items

```js
const arr = [1, 2, 3];

arr.push(4);      // adds to the END    → [1, 2, 3, 4]
arr.pop();        // removes from END   → [1, 2, 3]
arr.unshift(0);   // adds to START      → [0, 1, 2, 3]
arr.shift();      // removes from START → [1, 2, 3]
```

- The three most important array methods — used everywhere in React
  
```js
const numbers = [1, 2, 3, 4, 5];

// map — transform every item, returns a NEW array of the same length
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter — keep only items that pass a test, returns a NEW array
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce — collapse the array into a single value
const total = numbers.reduce((accumulator, current) => accumulator + current, 0);
// 15
// accumulator starts at 0, then: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15
```

##### Other useful array methods

```js
const nums = [3, 1, 4, 1, 5, 9];

nums.find(n => n > 4);          // 5  — first item that passes the test
nums.findIndex(n => n > 4);     // 4  — index of first item that passes
nums.includes(4);               // true — does array contain this value?
nums.indexOf(1);                // 1  — index of first occurrence
nums.some(n => n > 8);          // true — does ANY item pass the test?
nums.every(n => n > 0);         // true — do ALL items pass the test?
nums.sort((a, b) => a - b);     // [1, 1, 3, 4, 5, 9] — sorts ascending
nums.reverse();                 // reverses in place
nums.slice(1, 3);               // [1, 4] — copy from index 1 to 3 (exclusive), original unchanged
nums.splice(1, 2);              // removes 2 items starting at index 1, MUTATES original
nums.join(", ");                // "3, 1, 4, 1, 5, 9" — joins into a string

// flat and flatMap — for nested arrays
[[1, 2], [3, 4]].flat();        // [1, 2, 3, 4]
Spread operator with arrays
jsconst a = [1, 2, 3];
const b = [4, 5, 6];

const combined = [...a, ...b];  // [1, 2, 3, 4, 5, 6]
const copy = [...a];            // [1, 2, 3] — a shallow copy, not the same reference
```

###### Destructuring arrays

```js
const [first, second, third] = [10, 20, 30];
console.log(first);   // 10
console.log(second);  // 20

// Skip items with commas
const [,, third] = [10, 20, 30];
console.log(third);   // 30

// Rest in destructuring
const [head, ...tail] = [1, 2, 3, 4];
console.log(head);  // 1
console.log(tail);  // [2, 3, 4]
```

#### 5. Objects

- An object is a collection of key-value pairs. Keys are called properties.

```js
const person = {
  name: "Sahithi",
  age: 22,
  city: "Hyderabad",
  isStudent: true
};

// Accessing properties
person.name       // "Sahithi"  — dot notation
person["name"]    // "Sahithi"  — bracket notation (useful when key is dynamic)

// Adding a new property
person.email = "sahithi@example.com";

// Updating a property
person.age = 23;

// Deleting a property
delete person.city;
```

##### Methods — functions inside objects

```js
const person = {
  name: "Sahithi",
  greet: function() {
    return "Hi, I am " + this.name;
  },
  // shorthand method syntax
  greetShort() {
    return "Hi, I am " + this.name;
  }
};

person.greet();  // "Hi, I am Sahithi"
```

##### Destructuring objects

```js
const person = { name: "Sahithi", age: 22, city: "Hyderabad" };

const { name, age } = person;
console.log(name);  // "Sahithi"
console.log(age);   // 22

// Rename while destructuring
const { name: fullName } = person;
console.log(fullName);  // "Sahithi"

// Default values
const { country = "India" } = person;
console.log(country);  // "India" — not in the object, so default is used

// Nested destructuring
const user = { profile: { username: "Sahithi22" } };
const { profile: { username } } = user;
console.log(username);  // "Sahithi22"
```

###### Spread operator with objects

```js
const defaults = { theme: "light", language: "en", fontSize: 14 };
const userPrefs = { theme: "dark", fontSize: 16 };

// Later properties overwrite earlier ones
const settings = { ...defaults, ...userPrefs };
// { theme: "dark", language: "en", fontSize: 16 }

// Copying an object
const copy = { ...defaults };
```

###### Useful Object methods

```js
const person = { name: "Sahithi", age: 22 };

Object.keys(person)    // ["name", "age"]
Object.values(person)  // ["Sahithi", 22]
Object.entries(person) // [["name", "Sahithi"], ["age", 22]]

// Checking if a property exists
"name" in person       // true
person.hasOwnProperty("name")  // true
```

#### 6. Loops

##### for loop — when you know how many times to loop

```js
for (let i = 0; i < 5; i++) {
  console.log(i);   // 0, 1, 2, 3, 4
}

// Anatomy:
// let i = 0    — initializer: runs once at the start
// i < 5        — condition: checked before each iteration
// i++          — update: runs after each iteration
```

##### for...of — loop over arrays (modern, preferred)

```js
const fruits = ["apple", "banana", "mango"];

for (const fruit of fruits) {
  console.log(fruit);  // apple, banana, mango
}
```

##### for...in — loop over object keys

```js
const person = { name: "Sahithi", age: 22 };

for (const key in person) {
  console.log(key, person[key]);
  // name Sahithi
  // age 22
}
```

##### while loop — when you don't know how many times to loop

```js
let count = 0;

while (count < 3) {
  console.log(count);  // 0, 1, 2
  count++;
}
```

##### forEach — loop over an array (functional style, no return value)

```js
const nums = [1, 2, 3];

nums.forEach((num, index) => {
  console.log(index, num);
  // 0 1
  // 1 2
  // 2 3
});

// forEach does NOT return anything. Use map if you need the transformed array.
```

##### break and continue

```js
for (let i = 0; i < 5; i++) {
  if (i === 3) break;      // stops the loop entirely
  console.log(i);           // 0, 1, 2
}

for (let i = 0; i < 5; i++) {
  if (i === 3) continue;   // skips this iteration, continues loop
  console.log(i);           // 0, 1, 2, 4
}
```

#### 7. Conditionals

```js
const age = 20;

// if / else if / else
if (age >= 18) {
  console.log("adult");
} else if (age >= 13) {
  console.log("teenager");
} else {
  console.log("child");
}

// Ternary operator — short form for simple if/else
const label = age >= 18 ? "adult" : "minor";

// Nullish coalescing — use default only if null or undefined
const username = null;
const display = username ?? "Anonymous";  // "Anonymous"

// Optional chaining — safe property access
const user = null;
user?.profile?.name   // undefined instead of throwing an error
```

#### 8. The Things Interviews Will Test From This Note

| Topic | What they ask |
|---------|---------|
| `var` vs `let` vs `const` | Scope, hoisting, reassignment rules |
| `===` vs `==` | Type coercion, always use `===` |
| `map` vs `forEach` | map returns a new array, forEach returns undefined |
| `map` vs `filter` vs `reduce` | When to use each, implement them from scratch |
| Array destructuring | Reading nested data, renaming, defaults |
| Object spread | Merging objects, making copies |
| Arrow functions | Syntax, how they differ from regular functions (specifically `this` — covered in the next note) |
| `typeof null` | Returns `"object"` — famous JS bug |
| `find` vs `filter` | find returns one item, filter returns an array |

#### Quick Reference — Things to Memorise

```js
const > let > var       always prefer in that order
=== over ==             always use strict equality
map    → transforms     returns new array, same length
filter → keeps/removes  returns new array, shorter
reduce → collapses      returns a single value
find   → first match    returns one item or undefined
some   → any pass?      returns boolean
every  → all pass?      returns boolean
```
