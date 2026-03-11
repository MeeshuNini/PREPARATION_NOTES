# DNS Resolution Basics

### What is DNS?

**DNS (Domain Name System)** is the system responsible for translating **human-readable domain names into IP addresses**.

Example:
```
google.com → 142.250.183.46
```

Computers communicate using **IP addresses**, not domain names.

DNS acts like the **phonebook of the internet**, mapping domain names to their corresponding IP addresses.

### Why DNS is Needed

Humans prefer to remember names like:

- amazon.com
- google.com
- openai.com

But computers require **IP addresses** to communicate.

Example:
```
amazon.com → 54.239.28.85
```

DNS allows users to access websites using **domain names instead of IP addresses**.

#### What Happens During DNS Resolution

When a user enters a URL:
```
https://example.com
```

The browser must determine the **IP address of `example.com`**.

This process is called **DNS Resolution**.


### DNS Resolution Process

DNS resolution happens in a sequence of steps.


#### Step 1 — Browser Cache

The browser first checks its **local DNS cache**.

If the browser has previously visited the website, the IP address may already be stored.

Example cached entry:
```
example.com → 93.184.216.34
```

If found, **DNS lookup stops here**.


#### Step 2 — Operating System Cache

If the browser cache misses, the request goes to the **Operating System DNS cache**.

Operating systems store DNS results for **previously visited domains**.


#### Step 3 — Router Cache

If the OS does not have the record, the request may be checked in the **router cache**.

Home routers sometimes **cache DNS records**.


#### Step 4 — DNS Resolver (ISP)

If the record is still not found, the request goes to the **DNS resolver** provided by the ISP.

Examples:

- Google DNS → `8.8.8.8`
- Cloudflare DNS → `1.1.1.1`

The resolver now begins a **recursive search**.

### DNS Lookup Hierarchy

The DNS resolver queries multiple DNS servers.
```
Root DNS Server
↓
Top-Level Domain (TLD) Server
↓
Authoritative DNS Server
```


#### Root DNS Servers

The **Root Server** is the starting point of DNS resolution.

It does **not know the IP address** of the domain but knows where to find **TLD servers**.

Example:

User requests:
```
example.com
```

Root server replies:
```
Ask the .com TLD server
```

#### TLD Servers (Top-Level Domain)

TLD servers manage domain extensions such as:

- `.com`
- `.org`
- `.net`
- `.edu`

The TLD server responds with the **location of the authoritative DNS server**.

Example:
```
example.com → ask authoritative DNS server
```

#### Authoritative DNS Server

This server stores the **actual DNS records for the domain**.

It returns the final mapping:
```
example.com → 93.184.216.34
```

Now the browser knows the **server IP address**.

#### DNS Records

DNS servers store different types of records.

The most important ones are:

| Record | Purpose |
|------|------|
| A | Maps domain name to IPv4 address |
| AAAA | Maps domain name to IPv6 address |
| CNAME | Maps one domain to another domain |
| MX | Used for email servers |

##### Examples
```
A Record
example.com → 93.184.216.34

CNAME Record
→ example.com

MX Record
example.com → mail server
```

### DNS Caching

To improve performance, DNS results are **cached**.

Caching happens at:

- Browser
- Operating system
- Router
- ISP resolver

Each DNS record has a **TTL (Time To Live)** value.

Example:
```
TTL = 3600 seconds
```


Meaning the record can be cached for **1 hour**.


### Recursive vs Iterative DNS Query

#### Recursive Query

The **DNS resolver does all the work** for the client.

Client asks resolver:
```
What is the IP for example.com?
```

Resolver queries:
```
Root → TLD → Authoritative Server
```

And returns the **final IP address**.

#### Iterative Query

Each DNS server returns the **next server to query**.

Example:
```
Root → ask .com server
.com → ask authoritative server
```

### DNS Example (Full Flow)

User enters:
```
https://example.com
```

Resolution steps:
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
TLD DNS server (.com)
↓
Authoritative DNS server
↓
IP address returned
```
Result:

```
example.com → 93.184.216.34
```

Now the browser can **connect to the server**.

---

### Interview-Ready Explanation

If asked:

**"What is DNS resolution?"**

Answer:

> DNS resolution is the process of translating a domain name into its corresponding IP address. When a user enters a URL, the browser checks local caches first. If the IP is not found, the request goes to a DNS resolver which queries root servers, TLD servers, and authoritative DNS servers to obtain the IP address of the domain.

---

### Ultra-Short Revision Notes

DNS = Domain Name System
domain name → IP address

Resolution flow:
```
Browser cache
↓
OS cache
↓
Router cache
↓
DNS resolver
↓
Root server
↓
TLD server
↓
Authoritative server
↓
IP address returned
```

---

#### Very Common Interview Questions on DNS

You should be ready to answer:

- What is DNS?
- What is DNS resolution?
- What is the role of a DNS resolver?
- What are root DNS servers?
- What are TLD servers?
- What is an authoritative DNS server?
- What is DNS caching?
- What is TTL in DNS?
- Difference between recursive and iterative DNS queries.

---

### Interview Answer Evaluations

#### 1️⃣ What is DNS and why is it needed?

> DNS is a **distributed system that translates human-readable domain names into IP addresses** so computers can locate servers on the internet.

#### 2️⃣ What is DNS Resolution?

> DNS resolution is the process of **converting a domain name into its corresponding IP address** by querying DNS servers such as:
> - DNS resolver
> - Root servers
> - TLD servers
> - Authoritative DNS servers

#### 3️⃣ DNS Lookup Order

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


#### 4️⃣ DNS Caching

> DNS caching is the **temporary storage of domain name → IP mappings** in:
> - Browser
> - Operating system
> - Router
> - DNS resolver
This **speeds up future DNS lookups**.

#### 5️⃣ TTL (Time To Live)

TTL is the **duration for which a DNS record can be cached** before it must be refreshed.

Example:
```
TTL = 3600 seconds
```

Meaning the record can be cached for **1 hour**.


#### 6️⃣ Root, TLD, and Authoritative Servers

##### Root DNS Server

First level of DNS hierarchy.

Directs queries to the **appropriate TLD server**.

Example:
```
example.com → ask .com TLD server
```

##### TLD Server
Manages domain extensions such as:

- `.com`
- `.org`
- `.net`
- `.edu`

Returns the **authoritative DNS server**.

##### Authoritative DNS Server

Stores the **actual DNS records** and returns the **final IP address**.

Example:
```
example.com → 93.184.216.34

```

#### 7️⃣ DNS Resolver

A **DNS resolver** receives DNS queries from clients and resolves domain names by querying other DNS servers.

Examples:
- Google DNS → `8.8.8.8`
- Cloudflare DNS → `1.1.1.1`

#### 8️⃣ DNS Records

| Record | Purpose |
|------|------|
| A | Domain → IPv4 |
| AAAA | Domain → IPv6 |
| CNAME | Domain alias |
| MX | Email servers |

#### 9️⃣ Recursive vs Iterative Queries

##### Recursive Query

Client asks resolver:
```
example.com → give final IP
```

Resolver does **all the work**.
##### Iterative Query

DNS server replies:

```
I don't know the answer,
but ask this server next.
```

#### 🔟 What happens if DNS fails?

If DNS resolution fails:

- Website fails to load
- Browser error appears

Example error:
```

DNS_PROBE_FINISHED_NXDOMAIN

```
Meaning the browser **cannot find the server IP address**.

#### Why We Still Need CDNs or Load Balancers

DNS only tells the browser **which server IP to contact**.

Large systems also need to:

- Distribute traffic
- Improve speed
- Reduce server overload

Example architecture:

```
DNS → Load Balancer → Multiple Servers

```
CDNs store cached copies of content **closer to users**.

Example:

```
User in India → CDN server in Mumbai
User in US → CDN server in California
```

This **reduces latency**.

### DNS Propagation

When DNS records are updated, the changes **do not appear instantly everywhere**.

**Why**?

Because DNS records are **cached across the internet**.

Example:
```
Server updated → new IP
But some DNS caches still store old IP
```

The update appears only after **TTL expires**.

Typical propagation time:
Few minutes → up to 24 hours

### Final DNS Revision Notes (Interview Version)

#### DNS

DNS translates **domain names → IP addresses**.

Example:

```
google.com → 142.250.183.46

```
#### DNS Resolution Process

```
Browser cache
↓
OS cache
↓
Router cache
↓
DNS resolver
↓
Root server
↓
TLD server
↓
Authoritative server
↓
IP address returned
```

#### DNS Server Roles

##### Root Server

Directs query to the correct **TLD server**.

##### TLD Server

Handles domains like:

- `.com`
- `.org`
- `.net`

Returns **authoritative DNS server**.

##### Authoritative Server

Stores DNS records and returns **final IP address**.


#### DNS Records

| Record | Purpose |
|------|------|
| A | IPv4 mapping |
| AAAA | IPv6 mapping |
| CNAME | Domain alias |
| MX | Email routing |


#### DNS Caching

Cached in:

- Browser
- OS
- Router
- Resolver

Improves **lookup speed**.

#### TTL (Time To Live)

Defines how long a DNS record can be cached.

Example:
```
TTL = 3600 seconds
```
#### Recursive vs Iterative Queries

Recursive → resolver finds final IP  
Iterative → each DNS server returns next server

#### DNS Propagation

DNS updates take time to spread because **cached records must expire**.
