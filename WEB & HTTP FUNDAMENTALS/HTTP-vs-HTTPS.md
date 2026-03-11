## What is HTTP?

HTTP stands for HyperText Transfer Protocol.
It is the application layer protocol used for communication between a client and a web server.

Example communication:
```
Client (browser) → HTTP request → Server
Client (browser) ← HTTP response ← Server
```
HTTP is used to transfer:
- HTML pages
- CSS
- JavaScript
- images
- API responses (JSON/XML)
  
### Key Characteristics of HTTP

#### Stateless Protocol
- HTTP is stateless, meaning:
- Each request is independent
- Server does not remember previous requests
Example:
```
GET /profile
GET /orders
```
- The server treats each request separately.
- Runs Over TCP
- HTTP works on top of TCP (Transmission Control Protocol).

**Typical flow:**
```
HTTP request
↓
TCP connection
↓
Server response
```

**Default Port**

HTTP uses: **Port 80**
Example:
```
http://example.com:80
```

#### Problem with HTTP

- HTTP sends data in plain text.
- This means:
  - anyone intercepting the traffic can read it
  - passwords and sensitive data can be exposed
  - Example attack: Man-in-the-middle attack
- This is why HTTPS was introduced.

## What is HTTPS?

- HTTPS stands for:
```
HyperText Transfer Protocol Secure
```

- It is HTTP combined with encryption using TLS (Transport Layer Security).
- So HTTPS is essentially:
```
HTTPS = HTTP + TLS encryption
```

#### How HTTPS Works
- HTTPS establishes a secure encrypted communication channel.
- Steps:
  1. Client → TCP handshake
  2. Client → TLS handshake
  3. Encrypted communication begins
  4. HTTP requests/responses exchanged
   
- During TLS handshake:
  - server sends SSL/TLS certificate
  - client verifies certificate
  - encryption keys are generated
  - data is transmitted securely

##### SSL/TLS Certificate

- A certificate proves the identity of the server.
- It is issued by a Certificate Authority (CA).
- Examples of CAs:
  - Let's Encrypt
  - DigiCert
  - GlobalSign
  
- Certificates ensure:
  - Authentication
  - Encryption
  - Data integrity

#### Advantages of HTTPS
1. Encryption
   - All data exchanged is encrypted.
   - Example: 
     - passwords
     - payment information
     - personal data
2. Authentication
  - Ensures the client is communicating with the real server, not a fake one.
3. Data Integrity
  - Prevents attackers from modifying data during transmission.

### HTTP vs HTTPS (Comparison)
| Feature | HTTP | HTTPS |
| ---- | ---- | ---- |
| Security | not secure | encrypted |
| Protocol | HTTP | HTTP + TLS |
| Port | 80 | 443 |
| Data transfer | plain text | encrypted |
| Certificate | not required | required |

**Example**
```
HTTP request:
http://example.com/login
Data transmitted:
username=alice
password=123456
```

Anyone intercepting the request can read it.

```
HTTPS request:
https://example.com/login
Data transmitted:
encrypted data
```

Attackers cannot read the content.
### Interview-Ready Explanation
If asked:
**"What is the difference between HTTP and HTTPS?"**
You can answer:

> HTTP is a protocol used for communication between clients and web servers, but it transmits data in plain text. HTTPS is the secure version of HTTP that uses TLS encryption to protect data during transmission, ensuring confidentiality, authentication, and data integrity.

#### Ultra-Short Revision Notes

- HTTP → HyperText Transfer Protocol
- HTTPS → HTTP + TLS encryption
- HTTP:
  - port 80
  - not secure
  - plain text data
- HTTPS:
  - port 443
  - encrypted communication
  - uses SSL/TLS certificate

#### Common Interview Questions (HTTP vs HTTPS)

Be ready for these:
1. What is HTTP?
2. What is HTTPS?
3. Difference between HTTP and HTTPS?
4. Why is HTTPS secure?
5. What is TLS handshake?
6. What is an SSL certificate?
7. What happens if a certificate is invalid?

#### Final HTTP vs HTTPS Revision Notes

##### HTTP
- HyperText Transfer Protocol used for communication between client and server.
- *Characteristics:*
    - plain text communication
    - not secure
    - runs over TCP
    - port 80

##### HTTPS
- Secure version of HTTP.
- HTTPS = HTTP + TLS encryption
- *Features:*
  - encrypted communication
  - server authentication
  - data integrity
  - Port: 443
  
##### TLS Handshake

Steps:
```
Client connects to server
↓
Server sends SSL/TLS certificate
↓
Client verifies certificate
↓
Encryption keys generated
↓
Secure communication begins
```

##### HTTP vs HTTPS
| Feature | HTTP | HTTPS |
| ---- | ---- | ---- |
| Security | none | encrypted |
| Port | 80 | 443 |
| Encryption | no | yes |
| Certificate | no | yes |


