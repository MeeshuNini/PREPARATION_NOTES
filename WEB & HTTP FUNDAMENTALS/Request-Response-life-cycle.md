# Request–Response Lifecycle

The Request–Response Lifecycle describes the sequence of steps that occur when a user enters a URL in a browser and receives a webpage as a response from the server.

Example URL:
```https://example.com/products?id=10```

When a user enters this URL, the browser performs several steps to retrieve and display the requested resource.

### Step 1 — URL Parsing
The browser first parses the URL to identify its components.
```
Example URL:
https://example.com/products?id=10
```
#### Components of the URL:


| Component | Description |
| --- | --- |
| Protocol | Communication method (HTTP/HTTPS) |
| Domain | Server name hosting the resource |
| Path | Specific resource on the server |
| Query parameters | Additional data sent with request |

Parsed example:
| Part | Value |
| --- | --- |
| Protocol | HTTPS |
| Domain | example.com |
| Path | /products |
| Query | id=10 |

The browser now knows:
- which protocol to use
- which server to contact
- which resource is requested
  
#### Step 2 — DNS Resolution

Computers communicate using IP addresses, not domain names.
```
Example:
example.com → 93.184.216.34
```
Therefore, the browser must find the IP address associated with the domain name.

DNS lookup occurs in multiple stages:
- **Browser Cache** => Browser checks if it already knows the IP address.
- **Operating System Cache** => The OS checks its stored DNS records
- **Router Cache** => Local router may store recent DNS results.
- **ISP DNS Resolver** => Internet Service Provider's DNS server is queried.
- **Authoritative DNS Server**=> Provides the final IP address for the domain.

After resolution:
```
example.com → 93.184.216.34
```
Now the browser knows which server to contact.

#### Step 3 — TCP Connection (Three-Way Handshake)
Before sending data, the browser must establish a TCP connection with the server.

TCP ensures reliable communication between client and server.
The connection is established using the TCP three-way handshake.

##### Step 1 — SYN
Client sends:
**SYN**
```
Meaning:
 "I want to establish a connection."
 ```

##### Step 2 — SYN-ACK
Server replies:
**SYN-ACK**
```
Meaning:
 "I acknowledge your request and agree to establish the connection."
```

##### Step 3 — ACK
Client responds:
**ACK**
```
Meaning:
 "Connection confirmed."
```
Now the connection is established.

#### Step 4 — TLS Handshake (For HTTPS)

- If the website uses HTTPS, an additional step ensures secure communication.
- TLS (Transport Layer Security) encrypts data transmitted between client and server.
- During TLS handshake:
  1. Client sends supported encryption methods.
  2. Server sends its SSL/TLS certificate.
  3. Client verifies the certificate.
  4. Client and server exchange encryption keys.

After this process:
A secure encrypted communication channel is established.

#### Step 5 — HTTP Request Sent

After the connection is established, the browser sends an HTTP request to the server.
```
Example request:
GET /products?id=10 HTTP/1.1
Host: example.com
User-Agent: Chrome
Accept: application/json
Authorization: Bearer token
```
An HTTP request consists of three main components.
##### 1. Request Line
```
Example:
GET /products?id=10 HTTP/1.1
```
This contains:
- HTTP method
- Resource path
- HTTP version

##### 2. Headers
Headers provide additional metadata about the request.
```
Examples:
Host: example.com
User-Agent: Chrome
Content-Type: application/json
Authorization: Bearer token
```
Common headers:
| Header | Purpose |
| --- | --- |
| Host | Specifies the domain |
| User-Agent | Browser information |
| Content-Type | Type of request data |
| Authorization| Authentication credentials|


##### 3. Request Body (Optional)

Used in requests like:
- **POST**
- **PUT**
- **PATCH**
```
Example body:
{
 "username": "john",
 "password": "123456"
}
```

#### Step 6 — Server Processes Request
The request reaches the backend server.
```
Typical request flow:
Client
↓
Load Balancer
↓
Web Server
↓
Application Server
↓
Database
```
Server processing steps:
1. Request is received by the web server.
2. Authentication and authorization checks are performed.
3. Backend application executes business logic.
4. Database queries may be executed.
5. Response data is prepared.
```
Example database query:
SELECT * FROM products WHERE id = 10;
```

#### Step 7 — HTTP Response Sent
The server sends an HTTP response back to the client.
```
Example response:
HTTP/1.1 200 OK
Content-Type: application/json

{
 "id": 10,
 "name": "Laptop",
 "price": 900
}
```

An HTTP response also contains three parts.
##### 1. Status Line
```
Example:
HTTP/1.1 200 OK
```
It contains:
- HTTP version
- status code
- status message

##### 2. Response Headers
```
Example:
Content-Type: application/json
Cache-Control: max-age=3600
```
These headers provide metadata about the response.

##### 3. Response Body
Contains the actual data returned by the server.
```
Example:
{
 "product": "Laptop"
}
```

#### Step 8 — Browser Renders the Webpage
After receiving the response, the browser renders the webpage.
Steps involved:
1. HTML is parsed
2. CSS is applied
3. JavaScript is executed
4. DOM tree is constructed
5. Page is rendered to the screen


Additional requests may be made to fetch:
- images
- stylesheets
- scripts

Complete Request–Response Flow
```
User enters URL
↓
Browser parses URL
↓
DNS resolution (domain → IP)
↓
TCP connection established
↓
TLS handshake (if HTTPS)
↓
HTTP request sent
↓
Server processes request
↓
HTTP response returned
↓
Browser renders webpage
```

### Interview-Ready Explanation (Short Version)

> When a user enters a URL in the browser, the browser first resolves the domain name into an IP address using DNS. It then establishes a TCP connection with the server using the three-way handshake. If HTTPS is used, a TLS handshake establishes a secure encrypted connection. The browser sends an HTTP request to the server. The server processes the request, interacts with databases if needed, and returns an HTTP response. Finally, the browser renders the webpage.

### QUESTIONS

1. **What is the difference between TCP handshake and TLS handshake?**
**Answer** : 
  TCP handshake establishes a reliable connection between the client and the server using the three-way handshake: SYN, SYN-ACK, and ACK. This ensures both sides are ready to transmit data.
  TLS handshake happens after the TCP connection is established when using HTTPS. Its purpose is to establish a secure encrypted communication channel. During the TLS handshake, the server sends its SSL/TLS certificate, the client verifies it, and both parties negotiate encryption algorithms and generate shared encryption keys.

2. **What are the three parts of an HTTP request, and what information does each part contain?**
  An HTTP request consists of three main components: the request line, headers, and an optional request body.
  The request line contains the HTTP method, the resource path, and the HTTP version.
  The headers contain metadata about the request, such as the host, content type, authentication tokens, and browser information.
  The request body is optional and usually contains data sent to the server, typically in POST, PUT, or PATCH requests.
  Example HTTP Request
  ```
POST /users HTTP/1.1
Host: example.com
Content-Type: application/json
Authorization: Bearer token

{
"username": "john",
"password": "123456"
}
```
Breakdown:
| Part | Example |
| --- | --- |
| Request line | POST /users HTTP/1.1 |
| Headers | Host, Content-Type, Authorization |
| Body | JSON data |

**3. What are the three parts of an HTTP response, and what does each part contain?**
  An HTTP response consists of three main components: the status line, response headers, and the response body.
  The status line contains the HTTP version, status code, and status message. For example: HTTP/1.1 200 OK.
  The response headers contain metadata about the response such as content type, caching policies, and server information. Examples include Content-Type, Cache-Control, and Set-Cookie.The response body contains the actual data returned by the server, such as HTML, JSON, images, or other resources.
  Example HTTP Response
  ```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{
"id": 10,
"name": "Laptop",
"price": 900
}
```
Breakdown:
| Part | Example |
| --- | --- |
| Status line | HTTP/1.1 200 OK |
| Headers | Content-Type, Cache-Control |
| Body |JSON data |



