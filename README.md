# Node.js Design Patterns

## 1. Node.js

### 2. Node.js 6 and ES2015

#### 1. let and const

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

#### 2. Arrow Function

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

const greeter = new DelayedGreeter('World');
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

const greeter = new DelayGreeter('World');
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

const greeter = new DelayGreeter('World');
greeter.greet(); // Hello World
```

#### 3. Class

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

#### 4. Object literal

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
  name: 'George',
  surname: 'Boole',

  get fullName() {
    return this.name + ' ' + this.surname;
  }

  set fullName(fullName) {
    let parts = fullName.slit(' ');
    this.name = parts[0];
    this.surname = parts[1];
  }
}

console.log(person.fullName); // George Boole
console.log(person.fullName = 'Alan Turing') // Alan Turing
console.log(person.name) // Alan
```

#### 5. Map and Set Collection

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

#### 6. WeakMap and WeakSet

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

#### 7. Template

```nodejs
const name = "Leonardo";
const interest = ["arts", "architecture", "science", "music", "mathematics"];
const birth = { year: 1452, place: 'Florence' };
cost text = `${name} was an Italian polymath
    interested in many topics such as
    ${interest.join(', ')}. He was born
    in ${birth.year} in ${birth.place}`
console.log(text);
```

### 3. Reactor Patterns

#### 3. Non Blocking IO

```nodejs
resources = [socketA, socketB, socketC];
// busy waiting : high cost cpu
while (!resources.empty()) {
    for (i = 0; i < resources.length; i++) {
        resource = resources[i];
        let data = resource.read();
        if (data === NO_DATA_AVAILABLE)
            continue;
        if(data === RESOURCE_CLOSED)
            resources.remove(i);
        else
            consumeData(data);
    }
}
```

#### 4. Event Demultiplexing

운영체제이서 제공하는 Non Blocking Resource 처리를 위한 기능
***동기 이벤트 디멀티플렉서 or 이벤트 통지 인터페이스***

```nodejs
socketA, pipeB;
watchedList.add(socketA, FOR_READ);
watchedList.add(pipeB, FOR_READ);
while (events = demuliplexer.watch(watchedList)) {
    // event loop
    foreach (event in events) {
        // read non-blocking, always return data
        data = event.resource.read();
        if (data === RESOURCE_CLOSED)
            demultiplexer.unwatch(event.resource);
        else
            consumeData(data);
    }
}
```

## 2. Node.js Patterns

### 1. Callback Patterns

#### 1. The Continuation-Passing Style

```nodejs
// direct style
function add(a, b) {
    return a + b;
}
```

```nodejs
// continuation-passing style
function add(a, b, callback) {
    callback(a + b);
}
console.log('before');
add(1, 2, result => console.log('Result: ' + result));
console.log('after');

before
Result: 3
after
```

```nodejs
// async continuation-passing style
function add(a, b, callback) {
    setTimeout(() => callback(a + b), 100); // setTimeout is asynchronous
}

console.log('before'); // before
add(1, 2, result => console.log('Result: ' + result)); // Result:
console.log('after'); // after

before
after
Result: 3
```

```nodejs
// Non-continuation-passing style
const result = [1, 5, 7].map(element => element - 1);
console.log('result');
```

#### 2. sync? async?

```nodejs
const fs = require('fs');
const cache = {};
function inconsistentRead(filename, callback) {
    if (cache[filename]) {
        // synchronous
        callback(cache[filename]);
    else {
        // asynchronous
        fs.readFile(filename, 'utf8', (err, data) => {
            cache[filename] = data;
            callback(data);
        }
    }
}
function createFileReader(filename) {
    const listeners = [];
    inconsistentRead(filename, value => {
        listeners.foreach(listener => listener(value));
    });
    return {
        onDataReady: listener => listeners.push(listener);
    };
}
const reader1 = createFileReader('data.txt');
reader1.onDataReady(data => {
    console.log('First call data: ' + data);

    const reader2 = createFileReader('data.txt');
    reader2.onDataReady(data => {
        console.log('Second call data: ' + data);
    });
});

First call data: some data
```

```nodejs
// deffer execution
const fs = require('fs');
const cache = {};
function consistentReadAsync(filename, callback) {
    if (cache[filename]) {
        process.nextTick(() => callback(cache[filename])); // deffer execution
    } else {
        // asynchronous function
        fs.readFile(filename, 'utf8', (err, data) => {
            cache[filename] = data;
            callback(data);
        });
    }
}
```

#### 3. node.js callback principle

```nodejs
// callback is last parameter
fs.readFile(filename, 'utf8', (err, data) => { // err parameter is first in callback
    if (err) {
        handleError(err);
    else
        processData(data);
})
```

```nodejs
// Error spread
const fs = require('fs');
function readJSON(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        let parsed;
        if (err)
            return callback(err);

        try {
            // parsing data
            parsed = JSON.parse(data)
        } catch (err) {
            return callback(err);
        }

        callback(null, parsed);
    }
}
```

```nodejs
// not catch exceptions
const fs = require('fs');
function readJSONThrows (filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        let parsed;
        if (err)
            return callback(err);

        callback(null, JSON.parse(data));
    }
}
readJSONThrows('nonJSON.txt', err => console.log(err));
// SyntaxError : Unexpected token d
```

```nodejs
const fs = require('fs');
try {
    function readJSONThrows (filename, callback) {
        fs.readFile(filename, 'utf8', (err, data) => {
            let parsed;
            if (err)
                return callback(err);

            callback(null, JSON.parse(data));
        }
    }
} catch (err) {
    console.log('This will not catch the JSON parsing exception');
}
```

```nodejs
process.on('uncaughtException', (err) => {
    console.error('This will catch at last the + 'JSON parsing exception: ' + err.message);
    // end code '1', application exit
    process.exit(1);
});
```

### 2 Module System and Patterns

#### 1. Revealing Module Pattern

```nodejs
const module = (() => {
    const privateFoo = () => {};
    const privateBar = [];

    const exported = {
        publicFoo: () => {},
        publicBar: () => {}
    }
})();
console.log(module);
```

#### 2. Node.js Module

```nodejs
function loadModule(filename, module, require) {
    const wrappedSrc = `(function(module, exports, require) {
        ${fs.readFileSync(filename, 'utf8')}
    })(module, module.exports, require);`;
    eval(wrappedSrc);
}

const require = (moduleName) => {
    console.log(`Require invoked for module: ${moduleName}`);
    const id = require.resolve(moduleName);
    if(require.cache[id]) {
        return require.cache[id].exports;
    }

    // module metadata a
    const module = {
        exports: {},
        id: id
    }

    // the cache
    require.cache[id] = module;

    // load module
    loadModule(id, module, require);

    return module.exports;
}
require.cache = {};
require.resolve = (moduleName) => {};
```

```nodejs
const dependency = require('./anotherModule');

function log() {
    console.log(`Well done ${dependency.username}`);
}

module.exports.run = () => {
    log();
}
```

```nodejs
// require is synchronous
setTimeout(() => {
    module.exports = function() {}, 100);
}
```

```nodejs
// circulation dependency

// a.js
exports.loaded = false;
const b = require('./b');
module.exports = {
    bWasLoaded: b.loaded,
    loaded: true
}

// b.js
exports.loaded = false;
const a = require('./a');
module.exports = {
    aWasLoaded: a.loaded,
    loaded: true
}

// main.js
const a = require('./a');
const b = require('./b');
console.log(a);
console.log(b);

{ bWasLoaded: true, loaded: true }
{ bWasLoaded: false, loaded: true }
```

#### 3. Module Definition Pattern

```nodejs
// named exports

// logger.js
exports.info = (message) => {
    console.log('info: ' + message);
};

exports.verbose = (message) => {
    console.log('verbose: ' + message);
}

// main.js
const logger = require('./logger');
logger.info('This is an informational message')
logger.log('This is a verbose message')
```

```nodejs
// Exporting a function(= sub stack)

// logger.js
module.exports = (message) => {
    console.log(`info: ${message}`);
}

module.exports.verbose = (message) => {
    console.log(`verbose: ${message}`);
}

// main.js
const logger = require('./logger');
logger('This is an informational message');
logger.verbose('This is a verbose message');
```

```nodejs
// constructor export

// logger.js
function Logger(name) {
    this.name = name;
}

Logger.prototype.log = function(message) {
    console.log(`[${this.name}] ${message}`);
}

Logger.prototype.info = function(message) {
    console.log(`info: ${message}`);
}

Logger.prototype.verbose= function(message) {
    console.log(`verbose: ${message}`);
}

module.exports = Logger;

// main.js
const Logger = require('./logger');
const dbLogger = new Logger('DB');
dbLogger.info('This is an informational message');
const accessLogger = new Logger('ACCESS');
accessLogger.verbose('This is a verbose message');
```

```nodejs
// class export

class Logger {
    constructor(name) {
        this.name = name;
    }

    log(message) {
        console.log(`[${this.name}] ${message});
    }

    info(message) {
        console.log(`info: ${message}`);
    }

    verbose(message) {
        console.log(`verbose: ${message}`);
    }
}

exports.module = Logger;
```

```nodejs
// guard (constructor function or class)(like factory)

function Logger(name) {
    if(!(this instanceOf Logger)) {
        return new Logger(name);
    }
    this.name = name;
}

// logger.js
const Logger = require('./logger.js');
const dbLogger = Logger('DB');
dbLogger.verbose('This is a verbose message');
```

```nodejs
// new.target attribute use
function Logger(name) {
    if(!new.target) {
        return new LoggerConstructor(name);
    }
    this.name = name;
}
```

```nodejs
// export instance

// logger.js
function Logger(name) {
    this.count = 0;
    this.name = name;
}

Logger.prototype.log = function(message) {
    this.count++;
    console.log('[' + this.name + '] ' + message);
};

module.exports = new Logger('DEFAULT');
module.exports.Logger = Logger;

// main.js
const logger = require('./logger');
logger.log('This is an informational message');

const customLogger = new logger.Logger('CUSTOM');
customLogger.log('This is an informational message');
```

```nodejs
// modify module and global scope(monkey patching)(dangerous)

// patcher.js
require('./logger').customMessage = () => console.log('This is a new functionality');

// main.js
require('./patcher');
const logger = require('./logger');
logger.customMessage();
```

### 3. The Observer Pattern

#### 1. EventEmitter Class

```nodejs
const EventEmitter = require('event').EventEmitter;
const eeInstance = new EventEmitter();
```

#### 2. Use EventEmitter

```nodejs
const EventEmitter = require('event').EventEmitter;
const fs = require('fs');

function findPattern(files, regex) {
    const emitter = new EventEmitter();
    files.forEach(function(file) {
        fs.readFile(file, 'utf8', (err, content) => {
            if (err)
                return emitter.emit('error', err); // must need. error emitter
            emitter.emit('fileRead', file);
            let match;
            if (match = content.match(regex))
                match.forEach(elem => emitter.emit('found', file, elem));
        });
    });
    return emitter;
}

filePattern(
    ['fileA.txt', 'fileB.json'],
    /hello \w+/g
)
.on('fileRead', file => console.log(file + ' was read'))
.on('found', (file, match) => console.log('Matched "' + match + '" in file ' + file)
.on('error', err => console.log('Error emitted: ' + err.message));
```

#### 3. error propagation

#### 4. Create Observer Class

```nodejs
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');

class FindPattern extends EventEmitter {
    constructor(regex) {
        super();
        this.regex = regex;
        this.files = [];
    }

    addFile(file) {
        this.files.push(file);
        return this;
    }

    find() {
        this.files.forEach(file => {
            fs.readFile(file, 'utf8', (err, content) => {
                if (err)
                    return this.emit('error', err);
                this.emit('fileRead', file);
                let match = null;
                if (match = content.match(this.regex))
                    match.forEach(elem => this.emit('found', file, elem));
            });
        });
    }
}

const findPatternObj = new FindPattern(/hello \w+/);
findPatternObj
.addFile('fileA.txt')
.addFile('fileB.json')
.find()
.on('fileRead', file => console.log(`${file} was read`)
.on('found', (file, match) => console.log(`Matched "${match}" in file ${file}))
.on('error', err => console.log(`Error emitted ${err.message}));
```

#### 5. sync / async event

```nodejs
const EventEmitter = require('event').EventEmitter;

class SyncEmit extends EventEmitter {
    constructor() {
        super();
        this.emit('ready');
    }
}

const syncEmit = new SyncEmit();
syncEmit().on('ready', () => console.log('Object is ready to be used'));
```

#### 6. EventEmitter vs Callback

```nodejs
// EventEmitter
function helloEvents() {
    const eventEmitter = new EventEmitter();
    setTimeout(() => event.emit('hello', 'hello world'), 100)
    return eventEmitter;
}

// Callback
function helloCallback(callback) {
    setTimeout(() => callback('hello world'), 100);
}
```

## 3. Asynchronous control pattern using callback

### 1. Difficult of asynchronous programming

#### 1. Make a simple web project


### 2. Use Normal Javascript

#### 2. Use Callback Rule

```nodejs
// 1st refactoring
function spider(url, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.exists(filename, exists => {
        if(!exists) {
            console.log(`Downloading ${url}`);
            request(url, (err, response, body) => {
                if(err) {
                    return callback(err);
                }

                mkdirp(path.dirname(filename)), err => {
                    if(err) {
                        return callback(err);
                    }

                    fs.writeFile(filename, body, err => {
                        if(err) {
                            return callback(err);
                        }
                        callback(null, filename, true);
                    });
                }
            });
        } else {
            callback(null, filename, false);
        }
    });
}
```

```nodejs
// 2nd refactoring
function spider(url, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.exists(filename, exists => {
        if(!exists) {
            console.log(`Downloading ${url}`);
            request(url, (err, response, body) => {
                if(err) {
                    return callback(err);
                }
                saveFile(filename, body, callback);
            });
        } else {
            callback(null, filename, false);
        }
    });
}

function saveFile(filename, content, callback) {
    mkdirp(path.dirname(filename)), err => {
        if(err) {
            return callback(err);
        }

        fs.writeFile(filename, body, callback);
    }
}
```

```nodejs
// 3rd refactoring
function spider(url, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.exists(filename, exists => {
        if(!exists) {
            return download(url, filename, callback);
        } else {
            return callback(null, filename, false);
        }
    });
}

function saveFile(filename, content, callback) {
    mkdirp(path.dirname(filename)), err => {
        if(err) {
            return callback(err);
        }

        fs.writeFile(filename, body, callback);
    }
}

function download(url, filename, callback) {
    console.log(`Downloading ${url}`);
    request(url, (err, response, body) => {
        if(err) {
            return callback(err);
        }
        saveFile(filename, body, err => {
            if(err) {
                return callback(err);
            }
            console.log(`Downloaded and saved: ${url}`);
            callback(null, body)
        });
    });
}
```

```nodejs
// 4th refactoring
function spider(url, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.exists(filename, exists => {
        if(exists) {
            return callback(null, filename, false);
        }
        return download(url, filename, err => {
            if(err) {
                return callback(err);
            }
            callback(null, filename, true);
        });
    });
}

function saveFile(filename, content, callback) {
    mkdirp(path.dirname(filename)), err => {
        if(err) {
            return callback(err);
        }

        fs.writeFile(filename, body, callback);
    }
}

function download(url, filename, callback) {
    console.log(`Downloading ${url}`);
    request(url, (err, response, body) => {
        if(err) {
            return callback(err);
        }
        saveFile(filename, body, err => {
            if(err) {
                return callback(err);
            }
            console.log(`Downloaded and saved: ${url}`);
            callback(null, body)
        });
    });
}
```

#### 3. sequential execution

```nodejs
function task1(callback) {
    asyncOperation(() => {
        task2(callback);
    }
}

function task2(callback) {
    asyncOperation(() => {
        task3(callback);
    }
}

function task3(callback) {
    asyncOperation(() => {
        callback();
    }
}

task1(() => {
    console.log(`task 1, 2 and 3 executed`);
})
```

```nodejs
// 1st
function spider(url, nesting, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.readFile(filename, 'utf8', (err, body) => {
        if(err) {
            if(err.code != 'ENOENT') {
                return callback(err);
            }
            return download(url, filename, (err, body) => {
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }
        spiderLinks(url, body, nesting, callback);
    });
}

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting) {
        return process.nextTick(callback);
    }
    const links = utilities.getPageLinks(currentUrl, body);
    function iterate(index) {
        if(index === links.length) {
            return callback();
        }

        spider(links[index], nesting - 1, err => {
            if(err) {
                return callback(err);
            }
            iterate(index + 1);
        });
    }
    iterate(0);
}
```

```nodejs
// pattern
function iterate(index) {
    if(index === links.length) {
        return finish();
    }
    const task = tasks[index];
    task(function() {
        iterate(index + 1);
    });
}
function finish() {
}
iterate(0);

function iterateSeries(collection, iteratorCallback, finalCallback) {
    function iterate(index) {
        if(index === links.length) {
            return finalCallback();
        }
        const task = collection[index];
        task(function() => {
            iteratorCallback();
        });
    }
    iterate(0);
}
```

#### 4. parallel execution

```nodejs
// 2
function spider(url, nesting, callback) {
    const filename = utilities.UrlToFilename(url);
    fs.readFile(filename, 'utf8', (err, body) => {
        if(err) {
            if(err.code != 'ENOENT') {
                return callback(err);
            }
            return download(url, filename, (err, body) => {
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }
        spiderLinks(url, body, nesting, callback);
    });
}

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0) {
        return process.nextTick(callback);
    }
    const links = utilities.getPageLinks(currentUrl, body);
    if(links.length === 0) {
        return process.nextTick(callback);
    }

    let completed = 0, hasErrors = false;

    function done(err) {
        if(err) {
            hasErrors = true;
            return callback(err);
        }
        if(++completed === links.length && !hasErrors) {
            return callback();
        }
    }

    links.forEach(link => {
        spider(link, nesting - 1, done)
    });
}
```

```nodejs
// 3
const spidering = new Map();
function spider(url, nesting, callback) {
    if(spidering.has(url)) {
        return process.nextTick(callback);
    }
    spidering.set(url, true);
    const filename = utilities.UrlToFilename(url);
    fs.readFile(filename, 'utf8', (err, body) => {
        if(err) {
            if(err.code != 'ENOENT') {
                return callback(err);
            }
            return download(url, filename, (err, body) => {
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }
        spiderLinks(url, body, nesting, callback);
    });
}

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0) {
        return process.nextTick(callback);
    }
    const links = utilities.getPageLinks(currentUrl, body);
    if(links.length === 0) {
        return process.nextTick(callback);
    }

    let completed = 0, hasErrors = false;

    function done(err) {
        if(err) {
            hasErrors = true;
            return callback(err);
        }
        if(++completed === links.length && !hasErrors) {
            return callback();
        }
    }

    links.forEach(link => {
        spider(link, nesting - 1, done)
    });
}
```

#### 5. limited parallel execution

```nodejs
// limited execution
const tasks = ...
const concurrency = 2;
const running = 0;
const completed = 0;
const index = 0;

function next() {
    while(running < concurrency && index < tasks.length) {
        task = tasks[index++];
        task(() => {
            if(completed === tasks.index) {
                return flush();
            }
            completed++;
            running--;
            next();
        });
        running++;
    }
}

next();

function flush() {
    // finished
}
```

```nodejs
// using queue
class TaskQueue {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    pushTask(task) {
        this.queue.push(task);
        this.next();
    }

    next() {
        while(this.running < this.concurrency && this.queue.length) {
            const task = this.queue.shift();
            task(() => {
                this.running--;
                this.next();
            });
            this.running++;
        }
    }
}
```

```nodejs
const TaskQueue = require('./taskQueue');
const downloadQueue = new TaskQueue(2);
function spider(url, nesting, callback) {
    if(spidering.has(url)) {
        return process.nextTick(callback);
    }
    spidering.set(url, true);
    const filename = utilities.UrlToFilename(url);
    fs.readFile(filename, 'utf8', (err, body) => {
        if(err) {
            if(err.code != 'ENOENT') {
                return callback(err);
            }
            return download(url, filename, (err, body) => {
                if(err) {
                    return callback(err);
                }
                spiderLinks(url, body, nesting, callback);
            });
        }
        spiderLinks(url, body, nesting, callback);
    });
}

function spiderLinks(currentUrl, body, nesting, callback) {
    if(nesting === 0) {
        return process.nextTick(callback);
    }
    const links = utilities.getPageLinks(currentUrl, body);
    if(links.length === 0) {
        return process.nextTick(callback);
    }

    let completed = 0, hasErrors = false;

    links.forEach(link => {
        downloadQueue.pushTask(done => {
            spider(link, nesting - 1, err => {
                if (err) {
                    hasErrors = true;
                    return callback(err);
                }
                if(++completed === links.length && !hasErrors) {
                    callback();
                }
                done();
            })
        }
    });

    function done(err) {
        if(err) {
            hasErrors = true;
            return callback(err);
        }
        if(++completed === links.length && !hasErrors) {
            return callback();
        }
    }
}
```

### 3. Async Library

#### 1. Sequential Execution

```nodejs
const async = require('async');


```