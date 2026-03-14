The this Keyword, call, apply, bind

The core idea
this is a special keyword in JavaScript that refers to the object that is currently executing the function. The tricky part — this is not decided when you write the function. It is decided when you call it.
This is the opposite of closures. Closures care about where a function was written. this cares about how a function was called.

Rule 1 — this in the global scope
When you use this outside of any function, it refers to the global object. In a browser that is window. In Node.js that is global.
jsconsole.log(this);  // window (in browser) or {} (in Node.js module)
This rarely matters in interviews, but you should know it exists.

Rule 2 — this inside a regular function
Inside a regular function, this depends on how the function is called.
jsfunction sayHello() {
  console.log(this);
}

sayHello();  // window (browser) or global (Node.js)
             // in strict mode: undefined
On its own, a regular function's this is the global object. In strict mode ("use strict"), it is undefined. This is almost never what you want, which is why methods exist.

Rule 3 — this inside a method
When a function is a property of an object and you call it on that object, this refers to that object.
jsconst person = {
  name: "Padma",
  greet: function() {
    console.log(this.name);  // this = person
  }
};

person.greet();  // "Padma"
this is person here because the function was called on person. That dot before greet is the signal — whatever is to the left of the dot is this.

Rule 4 — this is lost when you detach a method
This is the classic this bug. You take a method out of an object and assign it to a variable. Now when you call it, there is no dot, so this is no longer the object.
jsconst person = {
  name: "Padma",
  greet: function() {
    console.log(this.name);
  }
};

person.greet();          // "Padma" — this = person

const fn = person.greet; // detach the method
fn();                    // undefined — this is now global/undefined
                         // the connection to person is lost
This happens all the time in React when you pass a class method as a callback. The fix is bind, which you will see below.

Rule 5 — this inside an arrow function
Arrow functions do not have their own this. They inherit this from the surrounding scope where they were written.
jsconst person = {
  name: "Padma",
  greet: function() {
    const inner = () => {
      console.log(this.name);  // this comes from greet's scope = person
    };
    inner();
  }
};

person.greet();  // "Padma"
Now contrast with a regular function in the same position:
jsconst person = {
  name: "Padma",
  greet: function() {
    const inner = function() {
      console.log(this.name);  // this = global/undefined, NOT person
    };
    inner();
  }
};

person.greet();  // undefined
The arrow function version works because the arrow function borrows this from greet, where this is person. The regular function version breaks because it creates its own this.

Rule 6 — this with new
When you call a function with the new keyword, this refers to the brand new object being created.
jsfunction Person(name) {
  this.name = name;        // this = the new object being created
  this.greet = function() {
    console.log("Hi, I am " + this.name);
  };
}

const padma = new Person("Padma");
padma.greet();  // "Hi, I am Padma"
new does four things under the hood:

Creates a new empty object
Sets this to that object
Runs the function body
Returns the object


The four rules summarised
How the function is calledWhat this isRegular function call fn()global object (or undefined in strict mode)Method call obj.method()the object before the dot (obj)Arrow functioninherited from surrounding scopeCalled with newthe newly created object

call, apply, bind — manually controlling this
These three methods let you explicitly set what this will be when a function runs. They are defined on every function in JavaScript.

call — call the function immediately, set this manually
jsfunction greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const person = { name: "Padma" };

greet.call(person, "Hello", "!");
// "Hello, Padma!"
// first argument = what this should be
// remaining arguments = the function's normal arguments
Another example — borrowing a method from one object and using it on another:
jsconst person1 = {
  name: "Padma",
  greet: function() {
    console.log("Hi, I am " + this.name);
  }
};

const person2 = { name: "Ananya" };

person1.greet.call(person2);  // "Hi, I am Ananya"
// greet runs, but this = person2

apply — same as call, but arguments are passed as an array
jsfunction greet(greeting, punctuation) {
  console.log(greeting + ", " + this.name + punctuation);
}

const person = { name: "Padma" };

greet.apply(person, ["Hello", "!"]);
// "Hello, Padma!"
// difference from call: arguments go in an ARRAY
Memory trick:

call → comma separated arguments
apply → array of arguments

In modern JavaScript, apply is mostly replaced by the spread operator:
jsgreet.call(person, ...["Hello", "!"]);  // same as apply

bind — returns a NEW function with this permanently set
call and apply run the function immediately. bind does not run it — it gives you back a new function where this is locked in forever.
jsfunction greet() {
  console.log("Hi, I am " + this.name);
}

const person = { name: "Padma" };

const boundGreet = greet.bind(person);  // does NOT call greet yet
                                         // returns a new function with this=person

boundGreet();  // "Hi, I am Padma"
boundGreet();  // "Hi, I am Padma"  — this is permanently locked
The most practical use of bind — fixing the detached method problem
jsconst person = {
  name: "Padma",
  greet: function() {
    console.log(this.name);
  }
};

const fn = person.greet;       // detached — this is lost
fn();                           // undefined

const boundFn = person.greet.bind(person);  // lock this to person
boundFn();  // "Padma"
bind with pre-set arguments — partial application
bind can also pre-fill some arguments, not just this:
jsfunction multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
// null = we don't care about this here
// 2 = first argument is permanently set to 2

double(5);   // 10
double(10);  // 20

The arrow function vs bind in React
This is one of the most common React interview questions. In class components, methods lose this when passed as event handlers. There are two fixes:
jsclass Button extends React.Component {
  constructor(props) {
    super(props);
    // Fix 1: bind in the constructor
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log(this);  // works — this is the component
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
jsclass Button extends React.Component {
  // Fix 2: arrow function as a class field
  // Arrow functions don't have their own this
  // so they inherit this from the class instance
  handleClick = () => {
    console.log(this);  // works — this is the component
  }

  render() {
    return <button onClick={this.handleClick}>Click</button>;
  }
}
In modern React with functional components and hooks, you almost never deal with this. But interviewers still ask about it.

this in arrow functions — the full picture
Arrow functions inherit this from wherever they were written. This means:
js// Arrow function as an object method — PROBLEM
const person = {
  name: "Padma",
  greet: () => {
    console.log(this.name);  // this = global, NOT person
  }
};

person.greet();  // undefined
Why? The arrow function was written inside the object literal, but the object literal is not a function — it does not create a new this. So the arrow function goes up to the next surrounding scope, which is the global scope. this becomes window/undefined.
Rule of thumb: never use arrow functions as object methods if you need this. Use regular functions for methods, arrow functions for everything else inside those methods.
jsconst person = {
  name: "Padma",
  greet: function() {              // regular function for the method — this = person
    const inner = () => {          // arrow for the inner — inherits this from greet
      console.log(this.name);      // "Padma"
    };
    inner();
  }
};

Quick summary — the five this scenarios
js// 1. Regular function call — global or undefined
function fn() { console.log(this); }
fn();  // window / undefined

// 2. Method call — the object
const obj = { fn: function() { console.log(this); } };
obj.fn();  // obj

// 3. Detached method — lost
const detached = obj.fn;
detached();  // window / undefined

// 4. Arrow function — inherited from surrounding scope
const obj2 = {
  fn: function() {
    const arrow = () => console.log(this);
    arrow();  // obj2 — inherited from fn's this
  }
};
obj2.fn();

// 5. new — the new instance
function Foo() { this.x = 1; }
const f = new Foo();
f.x;  // 1
```

---

## What interviews will ask from this note

| Question | The answer |
|---|---|
| What is `this`? | The object currently executing the function, determined at call time |
| Difference between `call`, `apply`, `bind` | call/apply run immediately (call = comma args, apply = array args), bind returns a new function |
| Why does `this` get lost? | When a method is detached from its object and called without a dot |
| How do arrow functions handle `this`? | They have no own `this`, they inherit it from the surrounding lexical scope |
| When would you use `bind`? | When passing a method as a callback and you need to preserve `this` |
| Can you use `bind` on arrow functions? | No — arrow functions ignore `bind`, `call`, and `apply` for `this`. Their `this` is fixed at definition. |

---

## Things to memorise
```
this = whoever is to the left of the dot when the function is called
no dot = global object (or undefined in strict mode)
arrow functions = no own this, inherit from where they were written
bind = returns new function with this locked
call = runs now, comma args
apply = runs now, array args
never use arrow functions as object methods
