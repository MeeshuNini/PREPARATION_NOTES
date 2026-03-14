JavaScript Notes — Part 7
REST APIs & HTTP

The core idea
Every time your React app fetches data, submits a form, or logs a user in — it is talking to a server over HTTP. Understanding how that conversation works is fundamental to both frontend development and the SDET role at LoginRadius, where your entire job is validating that these conversations happen correctly.
REST (Representational State Transfer) is a set of conventions for how that conversation should be structured. It is not a protocol or a library — just a set of rules that the industry has agreed on.

Part 1 — How the web works in one picture
Browser / App                          Server
     │                                    │
     │  ── HTTP Request ──────────────►  │
     │     method: GET                    │
     │     url: /api/users/1              │
     │     headers: { Authorization }     │
     │                                    │
     │  ◄── HTTP Response ─────────────  │
     │     status: 200                    │
     │     headers: { Content-Type }      │
     │     body: { id: 1, name: "Padma" } │
     │                                    │
Every HTTP interaction has two parts — a request (client asking) and a response (server answering). Understanding both sides is what makes you effective at testing APIs.

Part 2 — HTTP Methods
HTTP methods tell the server what action you want to perform. These map to CRUD operations.
MethodCRUDWhat it doesGETReadFetch data — no body, no side effectsPOSTCreateSend data to create something newPUTUpdate (full)Replace an entire resourcePATCHUpdate (partial)Update only specific fieldsDELETEDeleteRemove a resource
js// GET — fetch a user
GET /api/users/1

// POST — create a new user
POST /api/users
body: { name: "Padma", email: "padma@example.com" }

// PUT — replace the entire user object
PUT /api/users/1
body: { name: "Padma K", email: "padmak@example.com", role: "admin" }

// PATCH — update only the email
PATCH /api/users/1
body: { email: "new@example.com" }

// DELETE — remove the user
DELETE /api/users/1
```

### Interview question — PUT vs PATCH

PUT replaces the entire resource. If you send a PUT with only `{ email: "new@example.com" }`, every other field gets wiped. PATCH only updates the fields you send — everything else stays the same.

---

## Part 3 — HTTP Status Codes

Status codes are the server's way of telling you what happened. They fall into five groups.

### 2xx — Success
```
200 OK              → standard success for GET, PUT, PATCH
201 Created         → resource was created, used after POST
204 No Content      → success but nothing to return, used after DELETE
```

### 3xx — Redirection
```
301 Moved Permanently  → resource has a new URL forever
302 Found              → temporary redirect
304 Not Modified       → cached version is still valid, no need to resend
```

### 4xx — Client errors (you sent something wrong)
```
400 Bad Request        → malformed request, validation failed
401 Unauthorized       → not authenticated — no token or invalid token
403 Forbidden          → authenticated but not allowed — wrong permissions
404 Not Found          → resource does not exist
405 Method Not Allowed → tried GET on a POST-only endpoint
409 Conflict           → resource already exists (duplicate email)
422 Unprocessable      → data is valid JSON but fails business rules
429 Too Many Requests  → rate limited
```

### 5xx — Server errors (server broke)
```
500 Internal Server Error  → something crashed on the server
502 Bad Gateway            → upstream server sent invalid response
503 Service Unavailable    → server is overloaded or down for maintenance
504 Gateway Timeout        → upstream server did not respond in time
```

### The most important distinction — 401 vs 403
```
401 Unauthorized → you are not logged in (no token / bad token)
403 Forbidden    → you are logged in but do not have permission
```

An interviewer will absolutely ask this. 401 means "who are you?" — 403 means "I know who you are, but no."

---

## Part 4 — HTTP Headers

Headers are key-value pairs sent with every request and response. They carry metadata about the message.

### Common request headers
```
Content-Type: application/json
→ tells the server the body is JSON

Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
→ sends the auth token

Accept: application/json
→ tells the server what format you want back

Origin: https://myapp.com
→ sent automatically by the browser for CORS

Cache-Control: no-cache
→ tells the server/proxy not to use a cached response
```

### Common response headers
```
Content-Type: application/json
→ tells the client the body is JSON

Access-Control-Allow-Origin: *
→ CORS header — which origins can access this resource

Set-Cookie: session=abc123; HttpOnly; Secure
→ tells the browser to store a cookie

Cache-Control: max-age=3600
→ browser can cache this for 1 hour

Location: /api/users/42
→ sent with 201 Created — where the new resource lives

Part 5 — Using fetch in JavaScript
fetch is the built-in browser API for making HTTP requests.
GET request
jsasync function getUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`);

  // fetch does NOT throw on 4xx or 5xx
  // you must check response.ok (true if status is 200-299)
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const user = await response.json();
  return user;
}
POST request
jsasync function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer mytoken123"
    },
    body: JSON.stringify(userData)  // body must be a string
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

createUser({ name: "Padma", email: "padma@example.com" });
PATCH request
jsasync function updateEmail(userId, newEmail) {
  const response = await fetch(`https://api.example.com/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: newEmail })
  });

  if (!response.ok) throw new Error("Update failed");
  return response.json();
}
DELETE request
jsasync function deleteUser(userId) {
  const response = await fetch(`https://api.example.com/users/${userId}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer mytoken123" }
  });

  // DELETE often returns 204 No Content — no body to parse
  if (!response.ok) throw new Error("Delete failed");
  return true;
}
```

---

## Part 6 — Using `axios`

`axios` is a popular third-party library that wraps `fetch` with a cleaner API. It is used in most React and Node.js projects including yours (BYOL Academy likely used it).

### Key differences from fetch
```
fetch  → does not throw on 4xx/5xx, must check response.ok manually
axios  → throws automatically on 4xx/5xx, caught in catch block

fetch  → body must be JSON.stringify'd manually
axios  → body is serialised automatically

fetch  → response.json() is a separate await
axios  → response.data is the parsed data directly
Installation
bashnpm install axios
GET request
jsimport axios from "axios";

async function getUser(id) {
  try {
    const response = await axios.get(`https://api.example.com/users/${id}`);
    return response.data;  // axios puts the parsed data in .data
  } catch (error) {
    console.error(error.response.status);    // the HTTP status code
    console.error(error.response.data);      // the error body from server
  }
}
POST request
jsasync function createUser(userData) {
  try {
    const response = await axios.post("https://api.example.com/users", userData, {
      headers: { "Authorization": "Bearer mytoken123" }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
axios instance — set base URL and headers once
This is the standard pattern in real projects. You create one configured instance and use it everywhere.
js// api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json"
  }
});

// add auth token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// usage anywhere in your app
import api from "./api";
const user = await api.get("/users/1");      // GET https://api.example.com/users/1
const post = await api.post("/posts", data); // POST https://api.example.com/posts
```

---

## Part 7 — REST URL conventions

REST has naming conventions for URLs (called endpoints or routes).
```
GET    /users          → get all users
GET    /users/1        → get user with id 1
POST   /users          → create a new user
PUT    /users/1        → replace user 1
PATCH  /users/1        → partially update user 1
DELETE /users/1        → delete user 1

GET    /users/1/posts  → get all posts belonging to user 1
GET    /users/1/posts/5 → get post 5 of user 1
```

### URL vs Query parameters
```
/users/1              → path parameter — identifies a specific resource
/users?role=admin     → query parameter — filters or modifies the result
/users?page=2&limit=10 → pagination via query params
/search?q=padma       → search query
js// Reading query params in a URL
const url = new URL("https://example.com/users?page=2&limit=10");
url.searchParams.get("page");   // "2"
url.searchParams.get("limit");  // "10"

// Building a URL with query params
const params = new URLSearchParams({ page: 2, limit: 10 });
fetch(`/api/users?${params}`);  // /api/users?page=2&limit=10
```

---

## Part 8 — CORS

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks requests from one origin to another unless the server explicitly allows it.

An **origin** is the combination of protocol + domain + port:
- `https://myapp.com` is one origin
- `https://api.myapp.com` is a different origin (different subdomain)
- `http://myapp.com` is a different origin (different protocol)
```
Browser at https://myapp.com makes a request to https://api.example.com
→ browser checks: does api.example.com allow myapp.com?
→ if the server does not send the right CORS headers → browser BLOCKS the response
→ you see: "CORS policy: No 'Access-Control-Allow-Origin' header"
```

### The important thing to know as a developer

CORS errors happen in the browser only. When you test APIs with Postman or from Node.js, CORS does not apply — it is a browser-only restriction. So if your API works in Postman but not in the browser, it is almost certainly a CORS issue on the server.

The server fixes it by adding headers:
```
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

---

## Part 9 — Request and Response anatomy in full

### Full request
```
POST /api/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGci...
Accept: application/json

{
  "name": "Padma",
  "email": "padma@example.com",
  "role": "developer"
}
```

Parts:
- `POST /api/users HTTP/1.1` — method, path, HTTP version (the request line)
- `Host`, `Content-Type`, `Authorization` — headers
- Empty line — separates headers from body
- `{ "name": ... }` — the body (only POST/PUT/PATCH have bodies)

### Full response
```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/users/42

{
  "id": 42,
  "name": "Padma",
  "email": "padma@example.com",
  "createdAt": "2026-03-14T10:00:00Z"
}
```

Parts:
- `HTTP/1.1 201 Created` — HTTP version + status code + status text
- `Content-Type`, `Location` — response headers
- `{ "id": 42, ... }` — the response body

---

## Part 10 — What an SDET tests in APIs

Since this is directly relevant to the LoginRadius role, here is exactly what you will be doing:

### Functional testing
```
✓ Does GET /users return a list of users?
✓ Does POST /users with valid data return 201 and the created user?
✓ Does POST /users with missing email return 400?
✓ Does GET /users/999 return 404?
✓ Does DELETE /users/1 return 204?
```

### Auth testing
```
✓ Does GET /users without a token return 401?
✓ Does GET /users with an invalid token return 401?
✓ Does GET /admin/users with a non-admin token return 403?
✓ Does a valid token grant access — 200?
```

### Edge case testing
```
✓ What happens with a very long name field?
✓ What happens with special characters in the email?
✓ What happens with a negative ID?
✓ What happens when the body is empty?
✓ What happens with extra unknown fields in the body?
```

### Response validation
```
✓ Is the Content-Type header application/json?
✓ Does the response body match the expected schema?
✓ Are all required fields present?
✓ Are field types correct (id is a number, not a string)?
✓ Is the response time under an acceptable threshold?

Part 11 — JSON
JSON (JavaScript Object Notation) is the data format used in almost every REST API.
js// JavaScript object
const user = { name: "Padma", age: 22, active: true };

// Convert to JSON string — for sending in a request body
const jsonString = JSON.stringify(user);
// '{"name":"Padma","age":22,"active":true}'

// Convert JSON string back to object — for parsing a response
const parsed = JSON.parse(jsonString);
// { name: "Padma", age: 22, active: true }

// Pretty print — useful for debugging
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "Padma",
//   "age": 22,
//   "active": true
// }
```

### What JSON supports vs what it does not
```
Supported:   strings, numbers, booleans, null, arrays, objects
NOT supported: undefined, functions, Dates (become strings), Symbol
jsJSON.stringify({ a: undefined, b: function(){}, c: new Date() });
// '{"c":"2026-03-14T10:00:00.000Z"}'
// undefined and function are silently dropped
// Date becomes a string
```

---

## What interviews will ask from this note

| Question | The answer |
|---|---|
| What is REST? | A set of conventions for structuring HTTP APIs around resources and standard methods |
| GET vs POST | GET fetches data with no side effects. POST sends data to create a resource |
| PUT vs PATCH | PUT replaces the entire resource. PATCH updates only specified fields |
| 401 vs 403 | 401 = not authenticated. 403 = authenticated but not authorised |
| Why does fetch not throw on 404? | fetch only rejects on network failure. HTTP errors like 404 are still valid responses — check response.ok |
| What is CORS? | A browser security policy that blocks cross-origin requests unless the server allows them |
| axios vs fetch | axios throws on 4xx/5xx, auto-parses JSON, easier defaults. fetch needs manual checks |
| What status code for successful creation? | 201 Created |
| What status code for successful deletion? | 204 No Content |

---

## Things to memorise
```
GET    → read, no body
POST   → create, has body, returns 201
PUT    → full replace
PATCH  → partial update
DELETE → remove, returns 204

200 OK · 201 Created · 204 No Content
400 Bad Request · 401 Unauth · 403 Forbidden · 404 Not Found
409 Conflict · 422 Unprocessable · 429 Rate Limited
500 Server Error · 503 Unavailable · 504 Timeout

401 = who are you?
403 = I know you, but no

fetch  → check response.ok manually
axios  → throws on 4xx/5xx automatically

CORS = browser only, not Postman, not Node.js
JSON.stringify = object → string (for sending)
JSON.parse     = string → object (for receiving)