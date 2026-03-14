### JavaScript Notes — Part 3

#### Prototypes, Classes & Inheritance

##### The core idea

- Every object in JavaScript has a hidden link to another object called its prototype. 
- When you try to access a property on an object and it is not found there, JavaScript automatically looks up this chain until it either finds it or reaches the end. 
- This is called the prototype chain.
- This is how JavaScript does inheritance — not by copying properties, but by linking objects together.

##### Part 1 — Prototypes

- Every object has a prototype

```js
const person = { name: "Padma" };

// person has its own property: name
// but it also has access to methods like toString(), hasOwnProperty()
// where do those come from?

person.hasOwnProperty("name");  // true
// person doesn't define hasOwnProperty — so where is it?
```

It comes from `Object.prototype` — the root object that every plain object in JavaScript links to. JavaScript looked at `person`, did not find `hasOwnProperty` there, then walked up to `Object.prototype` and found it there.

##### Visualising the chain

```
person
  └── name: "Padma"
  └── [[Prototype]] → Object.prototype
                          └── hasOwnProperty()
                          └── toString()
                          └── valueOf()
                          └── [[Prototype]] → null  (end of chain)
[[Prototype]] is the hidden internal link. You can access it in code as __proto__ (old way) or through Object.getPrototypeOf() (correct way).
```

```js
const person = { name: "Padma" };

Object.getPrototypeOf(person) === Object.prototype  // true

Setting up prototype chains manually — Object.create
Object.create(obj) creates a new object whose prototype is obj.
jsconst animal = {
  breathe() {
    console.log("breathing");
  }
};

const dog = Object.create(animal);
// dog's prototype is animal

dog.name = "Bruno";
dog.breathe();  // "breathing" — found on the prototype, not on dog itself

dog.hasOwnProperty("name");     // true  — name is on dog directly
dog.hasOwnProperty("breathe");  // false — breathe is on the prototype
```

The chain here:

```
dog
  └── name: "Bruno"
  └── [[Prototype]] → animal
                          └── breathe()
                          └── [[Prototype]] → Object.prototype
```

##### Constructor functions — the old way to create objects with shared methods

- Before class was introduced, people used constructor functions and manually assigned methods to the prototype.
  
```js
function Person(name, age) {
  this.name = name;   // each instance gets its own name
  this.age = age;     // each instance gets its own age
}

// Methods go on the prototype — shared by ALL instances
// NOT inside the constructor, because that would create a new copy per instance
Person.prototype.greet = function() {
  console.log("Hi, I am " + this.name);
};

const padma  = new Person("Padma", 22);
const ananya = new Person("Ananya", 23);

padma.greet();   // "Hi, I am Padma"
ananya.greet();  // "Hi, I am Ananya"

// Both share the SAME greet function from the prototype
// They do NOT each have their own copy
padma.greet === ananya.greet  // true — same function reference
```

- Why put methods on the prototype and not inside the constructor?
  
```js
// BAD — greet is recreated fresh for every new instance
function Person(name) {
  this.name = name;
  this.greet = function() {   // new function object created every time
    console.log(this.name);
  };
}

// GOOD — greet is created once, shared by all instances
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  console.log(this.name);
};
```

- If you create 1000 Person objects, the bad version creates 1000 separate greet functions in memory. The good version creates exactly one.

#### Part 2 — Classes

- class was introduced in ES6 (2015). It is not a new system — it is cleaner syntax on top of the exact same prototype system above. Interviewers call this syntactic sugar.

##### Basic class syntax

```js
class Person {
  constructor(name, age) {   // runs when you do new Person(...)
    this.name = name;
    this.age = age;
  }

  greet() {                  // goes on Person.prototype automatically
    console.log("Hi, I am " + this.name);
  }

  getAge() {
    return this.age;
  }
}

const padma = new Person("Padma", 22);
padma.greet();    // "Hi, I am Padma"
padma.getAge();   // 22
```

- Under the hood, greet and getAge are placed on Person.prototype — exactly like we did manually above. The class keyword just writes that code for you.

```js
// Proof that classes are just prototype sugar
typeof Person  // "function" — not a special class type, just a function
Person.prototype.greet  // the greet method is right there on the prototype
```

#### Inheritance with extends and super

- extends sets up the prototype chain. super calls the parent's constructor or methods.

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(this.name + " makes a sound.");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // MUST call super() before using this
                        // it runs Animal's constructor, setting this.name
    this.breed = breed; // then we add Dog-specific properties
  }

  speak() {             // overrides Animal's speak method
    console.log(this.name + " barks.");
  }

  fetch() {
    console.log(this.name + " fetches the ball!");
  }
}

const bruno = new Dog("Bruno", "Labrador");
bruno.speak();   // "Bruno barks."  — Dog's version
bruno.fetch();   // "Bruno fetches the ball!"
```

### The prototype chain with classes

```
bruno
  └── name: "Bruno", breed: "Labrador"
  └── [[Prototype]] → Dog.prototype
                          └── speak()  (overrides Animal's)
                          └── fetch()
                          └── [[Prototype]] → Animal.prototype
                                                  └── speak()  (original)
                                                  └── [[Prototype]] → Object.prototype
```

- Calling the parent's method with super
  
```js
class Animal {
  speak() {
    console.log(this.name + " makes a sound.");
  }
}

class Dog extends Animal {
  speak() {
    super.speak();  // call Animal's speak first
    console.log(this.name + " also barks.");
  }
}

const d = new Dog();
d.name = "Bruno";
d.speak();
// "Bruno makes a sound."
// "Bruno also barks."
```

Static methods — belong to the class, not instances

```js
class MathHelper {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

MathHelper.add(3, 4);       // 7  — called on the CLASS
MathHelper.multiply(3, 4);  // 12

const m = new MathHelper();
m.add(3, 4);  // ERROR — static methods are not on instances
```

- Static methods are utility functions that belong to the class conceptually but do not need an instance. 
- Array.isArray(), Object.keys(), Math.round() — these are all static methods.

##### Getters and setters

- Getters and setters let you define properties that look like regular values but run code when accessed or assigned.

```js
class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  get area() {                          // accessed like a property, not called like a method
    return Math.PI * this.radius ** 2;
  }

  get diameter() {
    return this.radius * 2;
  }

  set diameter(value) {                 // setting diameter automatically updates radius
    this.radius = value / 2;
  }
}

const c = new Circle(5);
c.area;       // 78.53... — no parentheses needed, looks like a property
c.diameter;   // 10

c.diameter = 20;  // triggers the setter
c.radius;         // 10 — radius was updated
```

##### Private fields — truly private class properties

Before ES2022, there was no real private in JavaScript — people used conventions like _name to signal "don't touch this." Now there are real private fields using #.

```js
class BankAccount {
  #balance = 0;            // private — truly inaccessible from outside

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount(1000);
account.deposit(500);
account.balance;    // 1500  — accessed through the getter
account.#balance;   // SyntaxError — cannot access private field from outside
```

#### Part 3 — What classes compile down to

- This is the most important interview insight. When you write a class, JavaScript internally does this:

```js
// What you write
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    console.log("Hi, I am " + this.name);
  }
}

// What JavaScript actually does under the hood
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  console.log("Hi, I am " + this.name);
};
```

- They are identical. The class keyword just makes it look nicer.

#### Part 4 — instanceof and type checking

```js
class Animal {}
class Dog extends Animal {}

const bruno = new Dog();

bruno instanceof Dog     // true
bruno instanceof Animal  // true  — because Dog extends Animal
bruno instanceof Object  // true  — everything is ultimately an Object

// instanceof walks up the prototype chain
```

#### Part 5 — The prototype chain for built-in types

- Arrays, functions, and strings all have their own prototype chains. This is why arrays have .map(), .filter() etc — those methods live on Array.prototype.

```js
const arr = [1, 2, 3];

// arr's prototype chain:
// arr → Array.prototype → Object.prototype → null

// This is why you can call:
arr.map(...)         // from Array.prototype
arr.hasOwnProperty() // from Object.prototype
```

```js
// You can actually add your own methods to Array.prototype
// (Don't do this in production, but it proves the concept)
Array.prototype.sum = function() {
  return this.reduce((a, b) => a + b, 0);
};

[1, 2, 3].sum();  // 6
```

#### Part 6 — Common interview patterns

- Implement inheritance from scratch without class
  
```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  console.log(this.name + " speaks.");
};

function Dog(name, breed) {
  Animal.call(this, name);   // inherit properties
  this.breed = breed;
}

// Set up the prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // fix the constructor reference

Dog.prototype.bark = function() {
  console.log(this.name + " barks.");
};

const d = new Dog("Bruno", "Lab");
d.speak();  // "Bruno speaks."
d.bark();   // "Bruno barks."
```

Check if a property is own or inherited

```js
const dog = new Dog("Bruno", "Lab");

dog.hasOwnProperty("name");   // true  — own property
dog.hasOwnProperty("speak");  // false — inherited from Animal.prototype
"speak" in dog                // true  — in checks the entire chain
```

#### What interviews will ask from this note

| Question | The answer |
|---|---|
| What is a prototype? | A hidden object that every JS object links to for property lookup |
| What is the prototype chain? | The chain of prototype links JS walks when a property is not found on the current object |
| Are classes new in JavaScript? | No — they are syntactic sugar over the existing prototype system |
| What does `super()` do? | Calls the parent class constructor, must be called before `this` in a subclass |
| What is the difference between own and inherited properties? | Own = defined directly on the object. Inherited = found up the prototype chain |
| What does `instanceof` do? | Checks if an object's prototype chain contains the prototype of a given constructor |
| What are static methods? | Methods on the class itself, not on instances. Called as `ClassName.method()` |
| Why put methods on the prototype not the constructor? | So all instances share one copy instead of each getting their own |


#### Things to memorise

```
prototype = the hidden parent object every object links to
prototype chain = the lookup path JS follows when a property is not found
class = syntactic sugar over prototype-based inheritance
extends = sets up the prototype chain between two classes
super() = calls the parent constructor, must come before this
static = belongs to the class, not to instances
instanceof = walks the chain checking for a match
hasOwnProperty = checks only the object itself, not the chain
"in" operator = checks the entire prototype chain
```