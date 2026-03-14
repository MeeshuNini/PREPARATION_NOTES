JavaScript Notes — Part 9
Node.js Fundamentals

The core idea
Node.js is JavaScript running on the server instead of in the browser. The same language, but with different built-in capabilities. Instead of window and document, you get access to the file system, network, processes, and the operating system.
For the LoginRadius SDET role, Node.js is how you write test scripts, automation tools, and API test runners. It is also what powers the backend services you will be testing. Understanding it from both sides makes you a much stronger candidate.

Part 1 — How Node.js differs from the browser
Browser JavaScript          Node.js JavaScript
──────────────────          ──────────────────
window object               global object
document, DOM               no DOM
fetch, XMLHttpRequest        http module, node-fetch
localStorage                file system (fs module)
alert, prompt               no UI at all
limited file access         full file system access
runs in a sandbox           runs with system permissions
Both run the same V8 JavaScript engine. The difference is what surrounds it.

Part 2 — The Node.js global object
In the browser, global variables live on window. In Node.js they live on global.
jsconsole.log(global);         // the global object
console.log(__dirname);      // absolute path of the current file's directory
console.log(__filename);     // absolute path of the current file
console.log(process.env);    // environment variables
console.log(process.argv);   // command line arguments
process — the most important global
js// Environment variables — used for secrets and config
process.env.NODE_ENV;          // "development" or "production" or "test"
process.env.DATABASE_URL;      // your db connection string
process.env.PORT;              // which port to run on

// Exit the process
process.exit(0);   // 0 = success
process.exit(1);   // 1 = failure (used in scripts when something goes wrong)

// Command line arguments
// node script.js hello world
process.argv;      // ["node", "script.js", "hello", "world"]
process.argv[2];   // "hello"
process.argv[3];   // "world"

// Current working directory
process.cwd();     // "/home/padma/projects/myapp"

Part 3 — Modules
Node.js has its own module system. Every file is its own module with its own scope — variables defined in one file do not leak into another.
CommonJS — the original Node.js module system
js// math.js — exporting
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
const PI = 3.14159;

module.exports = { add, subtract, PI };

// Or export one thing at a time
module.exports.add = add;
module.exports.subtract = subtract;
js// app.js — importing
const { add, subtract, PI } = require("./math");

add(2, 3);  // 5
js// require built-in Node modules (no path needed)
const fs   = require("fs");
const path = require("path");
const http = require("http");

// require installed npm packages (no path needed)
const express = require("express");
const axios   = require("axios");

// require your own files (path needed)
const utils = require("./utils");
const config = require("../config");
ES Modules — the modern standard
js// math.js
export function add(a, b) { return a + b; }
export const PI = 3.14159;
export default function multiply(a, b) { return a * b; }
js// app.js
import { add, PI } from "./math.js";
import multiply from "./math.js";   // default import
import * as math from "./math.js";  // import everything
```

To use ES modules in Node.js, either:
- Name your files `.mjs`
- Or add `"type": "module"` in `package.json`

### CommonJS vs ES Modules
```
CommonJS (require/module.exports)
→ older, synchronous, works everywhere in Node.js
→ what you will see in most existing Node.js codebases and Jest configs

ES Modules (import/export)
→ newer, same syntax as browser JS and React
→ Jest needs extra config to support this (babel or --experimental-vm-modules)
For interviews and testing: know both, but expect CommonJS in Node.js test files unless configured otherwise.

Part 4 — The path module
path handles file paths correctly across operating systems (Windows uses \, Mac/Linux use /).
jsconst path = require("path");

// Join path segments safely
path.join("/home", "padma", "projects", "app.js");
// "/home/padma/projects/app.js"

path.join(__dirname, "data", "users.json");
// absolute path to users.json in a data folder next to the current file

// Get the directory of a file
path.dirname("/home/padma/projects/app.js");
// "/home/padma/projects"

// Get just the filename
path.basename("/home/padma/projects/app.js");
// "app.js"

path.basename("/home/padma/projects/app.js", ".js");
// "app" — strip the extension

// Get the extension
path.extname("/home/padma/projects/app.js");
// ".js"

// Resolve to an absolute path
path.resolve("data", "users.json");
// "/current/working/directory/data/users.json"

Part 5 — The fs module
fs (file system) lets you read, write, and manipulate files and directories.
Reading files
jsconst fs = require("fs");

// Synchronous — blocks everything until file is read
// Use only in startup scripts, never in a server
const data = fs.readFileSync("./data.json", "utf8");
console.log(data);  // the file contents as a string

// Asynchronous with callback — old way
fs.readFile("./data.json", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Asynchronous with promises — modern way, use this
const fs = require("fs/promises");  // or require("fs").promises

async function readData() {
  try {
    const data = await fs.readFile("./data.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read file:", error.message);
  }
}
Writing files
jsconst fs = require("fs/promises");

// Write (creates file if it doesn't exist, overwrites if it does)
await fs.writeFile("./output.json", JSON.stringify(data, null, 2), "utf8");

// Append (adds to the end without overwriting)
await fs.appendFile("./log.txt", "New log entry\n", "utf8");
Working with directories
js// Create a directory
await fs.mkdir("./reports", { recursive: true });
// recursive: true means it won't throw if the directory already exists

// Read directory contents
const files = await fs.readdir("./data");
console.log(files);  // ["users.json", "posts.json", "config.json"]

// Delete a file
await fs.unlink("./temp.txt");

// Check if a file exists
try {
  await fs.access("./config.json");
  console.log("file exists");
} catch {
  console.log("file does not exist");
}

// Get file information
const stats = await fs.stat("./data.json");
stats.isFile();       // true
stats.isDirectory();  // false
stats.size;           // file size in bytes
stats.mtime;          // last modified time
Practical example — reading a JSON config file
jsconst fs   = require("fs/promises");
const path = require("path");

async function loadConfig() {
  const configPath = path.join(__dirname, "config.json");
  const raw        = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw);
}

async function saveResults(results) {
  const outputPath = path.join(__dirname, "results", "output.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
}

Part 6 — The http module
Node.js can create an HTTP server from scratch with just the built-in http module — no Express needed.
jsconst http = require("http");

const server = http.createServer((req, res) => {
  // req = the incoming request
  // res = the response you send back

  console.log(req.method);  // "GET", "POST", etc.
  console.log(req.url);     // "/api/users"

  // Set response headers
  res.setHeader("Content-Type", "application/json");

  // Send response
  res.writeHead(200);  // status code
  res.end(JSON.stringify({ message: "Hello!" }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
In reality you will almost always use Express instead of the raw http module — it wraps http with a much nicer API. But knowing the http module shows you understand what Express is doing underneath.

Part 7 — Express (built on top of http)
Express is the most common Node.js web framework. Your BYOL Academy internship used it.
bashnpm install express
Basic Express server
jsconst express = require("express");
const app = express();

// Middleware — runs on every request
app.use(express.json());  // parse JSON request bodies automatically

// Routes
app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "Padma" }]);
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;   // path parameter
  res.json({ id: Number(id), name: "Padma" });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;  // parsed from JSON body

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  res.status(201).json({ id: 42, name, email });
});

app.delete("/api/users/:id", (req, res) => {
  res.status(204).send();  // no content
});

// Start the server
app.listen(3000, () => console.log("Running on port 3000"));
Query parameters and request anatomy
jsapp.get("/api/users", (req, res) => {
  // GET /api/users?role=admin&page=2
  const { role, page } = req.query;   // query parameters
  console.log(role);   // "admin"
  console.log(page);   // "2" (always a string from query params)

  res.json({ role, page: Number(page) });
});

app.get("/api/users/:id/posts/:postId", (req, res) => {
  const { id, postId } = req.params;  // path parameters
  res.json({ userId: id, postId });
});
Middleware
Middleware is a function that runs between the request arriving and the route handler running.
js// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();  // must call next() to pass control to the next middleware/route
});

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  // verify token...
  next();
}

// Apply to specific routes only
app.get("/api/admin", requireAuth, (req, res) => {
  res.json({ secret: "admin data" });
});

Part 8 — EventEmitter
Node.js is built around events. The EventEmitter class lets you create objects that emit named events and register listeners for them.
jsconst EventEmitter = require("events");

const emitter = new EventEmitter();

// Register a listener
emitter.on("data", (payload) => {
  console.log("received:", payload);
});

// Register a one-time listener
emitter.once("connect", () => {
  console.log("connected — this only fires once");
});

// Emit an event
emitter.emit("data", { id: 1, name: "Padma" });
emitter.emit("data", { id: 2, name: "Ananya" });
emitter.emit("connect");   // fires the once listener
emitter.emit("connect");   // listener is gone, nothing happens

// Remove a listener
function handler(data) { console.log(data); }
emitter.on("message", handler);
emitter.off("message", handler);  // remove it
Creating your own event-driven class
jsconst EventEmitter = require("events");

class FileWatcher extends EventEmitter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  start() {
    // simulate watching a file
    setInterval(() => {
      this.emit("change", {
        file: this.filePath,
        time: new Date()
      });
    }, 2000);
  }
}

const watcher = new FileWatcher("./config.json");

watcher.on("change", (event) => {
  console.log(`File changed: ${event.file} at ${event.time}`);
});

watcher.start();
```

Many Node.js built-ins extend EventEmitter — HTTP servers, streams, database connections all emit events.

---

## Part 9 — Streams

Streams handle large amounts of data piece by piece instead of loading everything into memory at once. Essential for reading large files or processing network data.
```
Without streams: read entire 1GB file into memory, then process
With streams:    read 64KB chunk, process it, read next chunk, repeat
jsconst fs   = require("fs");
const path = require("path");

// Readable stream — read a file chunk by chunk
const readable = fs.createReadStream("./large-file.txt", "utf8");

readable.on("data", (chunk) => {
  console.log("received chunk:", chunk.length, "bytes");
});

readable.on("end", () => {
  console.log("finished reading");
});

readable.on("error", (err) => {
  console.error("error:", err.message);
});
js// Writable stream — write data chunk by chunk
const writable = fs.createWriteStream("./output.txt");

writable.write("first chunk\n");
writable.write("second chunk\n");
writable.end("final chunk\n");

writable.on("finish", () => {
  console.log("done writing");
});
Piping — connect a readable to a writable
js// Copy a file using streams — efficient even for huge files
const readable = fs.createReadStream("./input.txt");
const writable = fs.createWriteStream("./output.txt");

readable.pipe(writable);

// Real world: compress a file on the fly
const zlib = require("zlib");
fs.createReadStream("./file.txt")
  .pipe(zlib.createGzip())          // transform stream — compresses
  .pipe(fs.createWriteStream("./file.txt.gz"));

Part 10 — npm and package.json
npm (Node Package Manager) manages third-party libraries.
Essential commands
bashnpm init -y                    # create package.json with defaults
npm install express            # install and add to dependencies
npm install --save-dev jest    # install and add to devDependencies
npm install                    # install all packages listed in package.json
npm uninstall express          # remove a package
npm run test                   # run the test script
npm run build                  # run the build script
npm list                       # show installed packages
npm outdated                   # show which packages have updates
package.json anatomy
json{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start":    "node src/index.js",
    "dev":      "nodemon src/index.js",
    "test":     "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "express": "^4.18.0",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0"
  }
}
```
```
dependencies    → needed to run the app in production
devDependencies → only needed for development and testing
                  (jest, eslint, nodemon, supertest)
```

### `node_modules` and `.gitignore`
```
node_modules/ contains all installed packages
It can be hundreds of MB — never commit it to git

.gitignore should always include:
node_modules/
.env
coverage/
dist/

Part 11 — Environment variables with .env
Never hardcode secrets like API keys or database passwords in your code. Use environment variables.
bashnpm install dotenv
```
```
# .env file — never commit this to git
DATABASE_URL=mongodb://localhost:27017/myapp
JWT_SECRET=mysupersecretkey123
PORT=3000
NODE_ENV=development
js// At the very top of your entry file
require("dotenv").config();

// Now process.env has everything from .env
console.log(process.env.DATABASE_URL);
console.log(process.env.PORT);

// In tests — Jest has a setupFiles option to load .env.test

Part 12 — Writing a CLI script
Node.js is great for writing automation scripts — exactly what an SDET does.
js#!/usr/bin/env node
// test-runner.js

const fs      = require("fs/promises");
const path    = require("path");
const axios   = require("axios");

const BASE_URL = process.env.API_URL || "http://localhost:3000";

async function runTests() {
  const results = [];

  // Test 1 — health check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    results.push({
      test: "GET /health",
      passed: res.status === 200,
      status: res.status
    });
  } catch (err) {
    results.push({ test: "GET /health", passed: false, error: err.message });
  }

  // Test 2 — create user
  try {
    const res = await axios.post(`${BASE_URL}/api/users`, {
      name: "Test User",
      email: `test${Date.now()}@example.com`
    });
    results.push({
      test: "POST /api/users",
      passed: res.status === 201,
      status: res.status
    });
  } catch (err) {
    results.push({ test: "POST /api/users", passed: false, error: err.message });
  }

  // Print results
  results.forEach(r => {
    const icon = r.passed ? "✓" : "✗";
    console.log(`${icon} ${r.test}`);
  });

  const passed = results.filter(r => r.passed).length;
  console.log(`\n${passed}/${results.length} tests passed`);

  // Save results to file
  await fs.writeFile(
    path.join(__dirname, "test-results.json"),
    JSON.stringify(results, null, 2)
  );

  // Exit with error code if any tests failed
  if (passed < results.length) process.exit(1);
}

runTests().catch(console.error);
Run it:
bashnode test-runner.js
API_URL=https://staging.example.com node test-runner.js

Part 13 — Error handling in Node.js
Synchronous errors
jstry {
  const data = fs.readFileSync("./missing.json", "utf8");
} catch (error) {
  console.error(error.message);  // ENOENT: no such file or directory
  console.error(error.code);     // "ENOENT"
}
Async errors
js// Always handle rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

// Always handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});
```

### Common Node.js error codes
```
ENOENT   → no such file or directory
EACCES   → permission denied
EADDRINUSE → port is already in use
ECONNREFUSED → connection refused (server not running)
ETIMEDOUT → connection timed out
```

---

## What interviews will ask from this note

| Question | The answer |
|---|---|
| What is Node.js? | JavaScript running on the server using the V8 engine, with access to the file system, network, and OS |
| CommonJS vs ES Modules | CommonJS uses require/module.exports, synchronous. ES Modules use import/export, the modern standard |
| What is `__dirname`? | The absolute path of the directory containing the current file |
| What is middleware in Express? | A function that runs between the request and the route handler — used for logging, auth, parsing |
| What is an EventEmitter? | A Node.js class that lets objects emit named events and register listeners for them |
| What are streams? | A way to process data chunk by chunk instead of loading it all into memory at once |
| dependencies vs devDependencies | dependencies are needed in production. devDependencies are only needed for development and testing |
| What is `process.env`? | An object containing environment variables — used for secrets and config that should not be in code |

---

## Things to memorise
```
__dirname  → directory of current file
__filename → full path of current file
process.env → environment variables
process.exit(0) → success, process.exit(1) → failure
process.argv → command line arguments

require() → CommonJS import
module.exports → CommonJS export
import/export → ES Modules

fs.readFile  → async file read
fs.writeFile → async file write
fs.readdir   → list directory contents
fs/promises  → the promise-based fs API — always use this

path.join    → combine path segments safely
path.resolve → get absolute path
path.dirname → get directory from path
path.basename → get filename from path

EventEmitter → .on() .emit() .once() .off()
Streams → readable, writable, pipe()

dependencies → production
devDependencies → development and testing only
.env → never commit to git

