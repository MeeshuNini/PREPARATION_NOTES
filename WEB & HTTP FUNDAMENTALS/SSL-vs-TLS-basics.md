# SSL / TLS Basics
- SSL and TLS are cryptographic protocols used to secure communication over the internet.
- They ensure three things:
  - Confidentiality
  - Authentication
  - Data Integrity
- These protocols are primarily used with HTTPS.

### What is SSL?
SSL stands for:
```
Secure Sockets Layer
```
- It was the original protocol developed to secure communication between clients and servers.
- However, SSL had security vulnerabilities, so it is now deprecated.
- Modern systems use TLS instead of SSL.

### What is TLS?

TLS stands for:

```
Transport Layer Security
```

- TLS is the modern and secure successor of SSL.
- It performs the same role as SSL but with stronger encryption and better security mechanisms.
- Today, when people say: SSL certificate, they usually mean TLS certificate.

### SSL vs TLS

| Feature | SSL	| TLS |
| ---- | ---- | ---- |
|Full Form | Secure Sockets Layer | Transport Layer Security |
| Security | outdated | modern & secure |
| Versions | SSL 2.0, SSL 3.0 | TLS 1.0–1.3 |
| Usage	| deprecated | widely used |

In practice:
HTTPS uses TLS

### Why TLS is Needed

- Without TLS, data travels in plain text.
- Example HTTP request:
  
```
username=alice
password=123456
```

- Anyone intercepting the network can read it.
- With TLS: Encrypted data
- Even if intercepted, attackers cannot read it.

### What TLS Provides

- TLS guarantees three properties.
  1. **Confidentiality** :
     - Data is encrypted so attackers cannot read it.
     - Example:
       - login credentials
       - payment information
       - personal data
  2. **Authentication**
       - TLS ensures the client is communicating with the real server.
       - Example: bank.com
       - instead of a fake phishing server.
       - Authentication happens using certificates.
  3. **Data Integrity**
       - TLS ensures data cannot be modified during transmission.
       - If an attacker tries to alter data, the connection fails.

#### TLS Handshake

Before secure communication starts, a TLS handshake occurs.

Goal:
```
Establish encryption keys
Verify server identity
```

TLS Handshake Steps (Simplified)

##### Step 1 — Client Hello

The client sends:
- supported encryption algorithms
- TLS version
- random number

##### Step 2 — Server Hello

Server replies with:
- chosen encryption algorithm
- server certificate
- server random number

##### Step 3 — Certificate Verification

- The client verifies the certificate using Certificate Authorities (CA).
- If the certificate is valid, trusted connection established
- If not, Browser shows warning:
```
Your connection is not private
```

##### Step 4 — Key Exchange

- Client and server generate a shared symmetric key.
- This key will be used for fast encryption.

##### Step 5 — Secure Communication Begins

All HTTP data is now encrypted using the shared key.

Example:
HTTPS request/response encrypted

#### What is an SSL/TLS Certificate?

- A certificate proves the identity of a server.
- It contains:
  - domain name
  - public key
  - issuing certificate authority
  - expiration date

Example:
```
Issued to: google.com
Issued by: DigiCert
```

##### Certificate Authority (CA)
- Certificate Authorities are trusted organizations that issue certificates.
- Examples:
  - Let's Encrypt
  - DigiCert
  - GlobalSign
  - Sectigo
- Browsers trust these authorities.

##### Public Key vs Private Key

- TLS uses asymmetric cryptography.
- Two keys exist:
  1. Public Key
     - Shared with everyone.
     - Stored in the certificate.
  2. Private Key
     - Secret key stored on the server.
     - Used to decrypt messages.

##### Encryption Types in TLS

- TLS uses two types of encryption.
  1. Asymmetric Encryption
     - Used during handshake.
     - Example: RSA, ECC
  2. Symmetric Encryption
     - Used for actual data transfer.
     - Example: AES, ChaCha20

- Symmetric encryption is faster.

#### HTTPS Communication Flow

```

User enters https://example.com
↓
DNS resolution
↓
TCP connection
↓
TLS handshake
↓
Encrypted HTTP request sent
↓
Encrypted HTTP response returned
```

### Interview-Ready Explanation

If asked:

**"What is TLS?"**

Answer:

> TLS is a cryptographic protocol used to secure communication between clients and servers. It provides encryption, authentication, and data integrity. TLS is used in HTTPS to ensure that data transmitted over the internet cannot be intercepted or modified.

#### Ultra-Short Revision Notes

- TLS = Transport Layer Security
- Purpose:
  - Encryption
  - Authentication
  - Data integrity
- Used in: HTTPS
  
##### Common TLS Interview Questions

Be ready for these:

1. What is SSL?
2. What is TLS?
3. Difference between SSL and TLS?
4. What happens during TLS handshake?
5. What is an SSL certificate?
6. What is a certificate authority?
7. What is public key vs private key?

