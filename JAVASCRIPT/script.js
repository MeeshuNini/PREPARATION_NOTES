// console.log(x); // ReferenceError: x is not defined
const person = { name: "Sahithi", age: 22, city: "Hyderabad" };

const { name, age, city } = person;
console.log(name);  // "Sahithi"
console.log(age);   // 22

// Rename while destructuring
const { name: fullName } = person;
console.log(fullName);  // "Sahithi"

// Default values
const { country = "India" } = person;
console.log(country);  // "India" — not in the object, so default is used
