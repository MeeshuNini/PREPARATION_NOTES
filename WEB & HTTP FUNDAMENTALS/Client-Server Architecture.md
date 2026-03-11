# Client–Server Architecture

### Definition

Client–Server architecture is a **distributed computing model** where **clients request services** and **servers provide those services** over a network.

---

### Client

The **client** is responsible for:

- User interface
- Sending requests
- Displaying responses

#### Examples

- Web browsers
- Mobile apps
- Desktop applications

---

### Server

The **server** is responsible for:

- Processing requests
- Running business logic
- Accessing databases
- Sending responses

#### Examples

- Node.js server
- Flask / FastAPI server
- Java Spring server

---

### Basic Architecture


Client → Request → Server
Client ← Response ← Server


In modern systems:


Client → Backend Server → Database


---

### Example Flow

User opens a website.


Browser (Client)
↓
HTTP Request
↓
Web Server
↓
Database
↓
Response returned to browser


---

### Advantages

- Centralized data management
- Easier maintenance
- Better security
- Scalable architecture

---

### Disadvantages

- Server dependency
- Server bottlenecks
- Infrastructure cost

---

## Interview Questions

---

### 1. What is Client–Server Architecture?

Client–Server architecture is a **distributed computing model** in which **clients request services or resources** and **servers process those requests and return responses** over a network.

#### Client Responsibilities

- User interface
- Sending requests
- Displaying results

#### Server Responsibilities

- Processing requests
- Executing business logic
- Interacting with databases
- Sending responses back to clients

#### Typical Architecture


Client → Request → Server
Client ← Response ← Server


#### Modern Architecture


Client → Backend Server → Database


#### Example

| Component | Example |
|----------|---------|
| Client | Web browser |
| Server | Node.js / FastAPI backend |
| Database | MongoDB / SQL |

---

## 2. When you open https://google.com, identify the client, server, request, and response.

#### Client

The **client** is the user's **web browser** (Chrome, Firefox, Safari).

#### Server

The **server** is **Google's web server infrastructure** that hosts the website.

#### Request

The browser sends an **HTTP GET request** to Google's server asking for the homepage.

Example request:

```http
GET / HTTP/1.1
Host: google.com
Response
```

The server responds with:

- HTML
- CSS
- JavaScript
- Images
- Other resources

The browser then renders the webpage.

#### 3. Why do we use Client–Server Architecture instead of running everything on the user's machine?

Client–Server architecture provides several advantages.

#### 1. Centralized Data Management

All data is stored and managed on the server, ensuring consistency and easier updates.

#### 2. Scalability

Servers can handle requests from many clients simultaneously.

#### 3. Security

Sensitive logic and data remain on the server rather than on user devices.

#### 4. Resource Sharing

Multiple clients can access shared resources and services.

Without client–server architecture, every user would need to store and process all data locally, which would be inefficient and difficult to maintain.

### 4. In a React + Node.js + MongoDB application, identify the client, server, and database.

#### Client

The client is the React frontend application, which runs in the user's browser.

##### Responsibilities:

- User interface
- Sending API requests
- Displaying results

#### Server

The server is the Node.js backend, which handles:

- API endpoints
- Business logic
- Authentication
- Communication with the database

#### Database

MongoDB stores application data such as:
- Users
- Posts
- Application records

#### Request Flow

```User interacts with React UI
       ↓
React sends HTTP request
       ↓
Node.js backend processes request
       ↓
Backend queries MongoDB
       ↓
Database returns data
       ↓
Backend sends response
       ↓
React renders result
```

### 5. What are disadvantages of Client–Server Architecture?

While Client–Server architecture is powerful, it has some challenges.

#### 1. Server Dependency

If the server goes down, clients cannot access services.

#### 2. Server Bottlenecks

If too many clients send requests simultaneously, the server may become overloaded.

#### 3. Infrastructure Cost

Maintaining servers, networking infrastructure, and scaling resources can be expensive.

#### 4. Network Dependency

Communication between client and server requires a stable network connection.