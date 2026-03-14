### Final Revision Notes

##### Question 1 : Explain the complete lifecycle of a request when a user enters: ```https://example.com/products?id=10 ```Explain the steps from typing the URL → webpage rendering.

##### Answer: 

Life cycle of a request

1. URL parsing
2. DNS Resolution
3. TCP Handshake
4. TLS Handshake(HTTPS only)
5. HTTP Request Sent
6. Server Processes Request
7. HTTP Response Returned
8. Browser Renders page

###### URL Parsing:

- Browser parces URL to identify
  1. protocol => https
  2. domain => example.com
  3. path => /products
  4. query => ?id=10
   
###### DNS Resolution :
- The browser must convert domain name into IP Address
    example.com => 93.184.216.34
- DNS Lookup order
  ```
    Browser cache
        ↓
    OS cache
        ↓
    Router cache
        ↓
    DNS resolver
        ↓
    Root DNS server
        ↓
    TLD server (.com)
        ↓
    Authoritative DNS server
        ↓
    IP address returned
    ```

###### TCP Connection:

- The browser(client) establishes a connection with the server using the three way TCP Handshake(Transmission Control Protocol).
  ```
  Client → SYN
  Server → SYN-ACK
  Client → ACK
  ```

###### TLS Handshake:

- Since the URL uses HTTPS, TLS Handshake(Transport Layer Security) occurs.
  1. Client sends supported encrytion algorithms
  2. Server sends SSL/TLS Certificate
  3. Client verifies certificate
  4. Encryption keys are generated.
- After this, communnication becomes encrypted.

###### HTTP Request Sent:

- Example Request:
  ```
  GET /products?id=10 HTTP/1.1
  Host: example.com
  Accept: application/json
  ```

###### Server Processing
- Server workflow may look like:
  ```
  Load balancer
    ↓
  Web server
    ↓
  Application server
    ↓
  Database query
  ```
- Example Query
  ```
  SELECT * FROM PRODUCTS WHERE id=10
  ```

###### HTTP Response returned

- Example Response
  ```
    HTTP/1.1 200 OK
    Content-Type: application/json
    {
    "id": 10,
    "name": "Laptop",
    "price": 900
    }
  ```

###### Browser Rendering
The broswe then 
1. Parses the HTML
2. build DOM tree
3. loads CSS
4. executes JavaScript
5. renders webpage

#### Interview-Ready Answer
> When a user enters a URL in a browser, the browser first parses the URL to identify the protocol, domain, and resource path. It then performs DNS resolution to convert the domain name into an IP address. Before querying DNS servers, the browser checks its cache and the operating system cache. Once the IP address is obtained, the browser establishes a TCP connection with the server using the three-way handshake. If HTTPS is used, a TLS handshake is performed to establish a secure encrypted connection. The browser then sends an HTTP request to the server. The server processes the request, may interact with databases or backend services, and sends an HTTP response back to the client. Finally, the browser parses the response and renders the webpage, fetching additional resources such as CSS, JavaScript, and images.

##### Question 2 : Why does DNS use a hierarchical structure like: ```Root → TLD → Authoritative``` instead of having one single DNS server for the entire internet?

###### Answer: 

