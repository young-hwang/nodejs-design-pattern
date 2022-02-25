# 1. Node.js 6 and ES2015
## 1. let and const

```nodejs
if (false) {
  var x = "hello";
}
console.log(x); // undefined - function scope, global scope
```

```nodejs
if (false) {
  let x = "hello";
}
console.log(x); // ReferenceError: x is not defined - block scope
```

```nodejs
for (let i=0; i<10; i++) {
  // working
}
console.log(i); // ReferenceError: i is not defined
```

```nodejs
const x = 'This will never change';
x = '....'; // TypeError: Assignment to constant variable
```

```nodejs
const x = {};
x.name = 'John';
x = null; // TypeError: Assignment to constant variable
```

```nodejs
const path = require('path'); // const use at using module.
let path = './some/path'; // Error
```

## 2. Arrow Function

```nodejs
// Old Function
const numbers = [2, 6, 7, 8, 1];
const even = numbers.filter(function(x) {
  return x%2 === 0;
});

// Arrow Function
const numbers = [2, 6, 7, 8, 1];
const even = numbers.filter(x => x%2 === 0);

// Arrow Function(multiple row)
const numbers = [2, 6, 7, 8, 1];
const even = numbers.filter(x => {
  if (x%2 === 0) {
    console.log(x + ' is even');
    return true;
  }
});
```

```nodejs
function DelayGreeter(name) {
  this.name = name;
}

DelayedGreeter.prototype.greet = function() {
  setTimeout(function cb() {
    console.log('Hello ' + this.name);
  }, 500)
}

const greeter = new DelaydGreeter('World');
greeter.greet();  // undefined
```

```nodejs
function DelayGreeter(name) {
  this.name = name;
}

// use bind()
DelayedGreeter.prototype.greet = function() {
  setTimeout((function cb() {
    console.log('Hello ' + this.name);
  }).bind(this), 500)
}

const greeter = new DelaydGreeter('World');
greeter.greet(); // Hello World
```

```nodejs
function DelayGreeter(name) {
  this.name = name;
}

// Arrow Function - lexical scope
DelayedGreeter.prototype.greet = function() {
  setTimeout(() => console.log('Hello' + this.name), 500);
}

const greeter = new DelaydGreeter('World');
greeter.greet(); // Hello World
```

## 3. Class

```nodejs
function Person(name, surname, age) {
  this.name = name;
  this.surname = surname;
  this.age = age;
}

Person.prototype.getFullName = function() {
  return this.name + ' ' + this.surname;
}

Person.older = function(person1, person2) {
  return (person1.age > person2.age) ? person1 : person2;
}
```

```nodejs
// Constructor Function
class Person {
  constructor(name, surname, age) {
    this.name = name;
    this.surname = surname;
    this.age = age;
  }

  getFullName() {
    return this.name + ' ' + this.surname;
  }

  static older(person1, person2) {
    return person1 > person2 ? person1 : person2;
  }
}
```

```nodejs
// Class
class PersonWithMiddlename extends Person {
  constructor(name, middlename, surname, age) {
    super(name, surname, age);
    this.middlename = middlename;
  }

  getFullName() {
    return this.name + ' ' + this.middlename + ' ' + this.surname;
  }
}
```

## 4. Object literal

```nodejs
const x = 22;
const y = 17;
const obj = { x, y } // Object literal

module.exports = { // Object literal
  square(x) {
    return x * x;
  },
  cube(x) {
    return x * x * x;
  }
}
```

```nodejs
const namespace = '-webkit-';
const style = {
  [namespace + 'box-sizing']: 'border-box', // dynamic attribute name
  [namespace + 'box-shadow']: '10px10px5px #888888'
}
```

```nodejs
const person = {
  name: 'eorge',
  surname: 'Boole',

  get fullname() {
    return this.name + ' ' + this.surname;
  }

  set fullname(fullanme) {
    let parts = fullname.slit(' ');
    this.name = parts[0];
    this.surname = parts[1];
  }
}

console.log(person.fullname); // Geroge Boole
console.log(person.fullname = 'Alan Turing') // Alan Turing
console.log(person.name) // Alan
```

## 5. Map and Set Collection

```nodejs
const profiles = new Map();
profiles.set('twitter', '@adalovelace');
profiles.set('facebook', 'adalovelace');
profiles.set('googleplus', 'ada');

profiles.size; // 3
profiles.has('twitter'); // true
profiles.get('twitter'); // "@adalovelace"
profiles.has('youtube'); // false
profiles.delete('facebook');
profiles.has('facebook'); // false
profiles.get('facebook'); // undefined
for (const entry of profiles) {
  console.log(entry);
}
```

```nodejs
const tests = new Map();
tests.set(() => 2+2, 4);
tests.set(() => 2*2, 4);
tests.set(() => 2/2, 1);

for (const entry of tests) {
  console.log((entry[0]() == entry[1] ? 'PASS' : 'FAIL'));
}
```

```nodejs
const s = new Set([0, 1, 2, 4]);
s.add(3); // not insert
s.size; // 4
s.delete(0);
s.has(0) // false

for (const entry of s) {
  console.log(entry);
}
```

## 6. WeakMap and WeakSet

```nodejs
let obj = {}; // key is object type
const map = new WeakMap();
map.set(obj, {key: "some_value"});
console.log(map.get(obj)); // {key: "some_value"}
obj = undefined; // running garbage collector
```

```nodejs
let obj1 = {key: "val1"};
let obj2 = {key: "val2"};
const set = new WeakSet([obj1, obj2]);
console.log(set.has(obj1)); // true
obj1 = undefined;
console.log(set.has(obj1)); // false
```

## 7. Template 

```nodejs
const name = "Leonardo";
const interest = ["arts", "architecture", "science", "music", "mathematics"];
const birth = { year: 1452, place: 'Flornce' };
cost text = `${name} was an Italian ploymath 
    interested in many topics such as
    ${interest.join(', ')}. He was born
    in ${birth.year} in ${birth.place}`
console.log(text);
```