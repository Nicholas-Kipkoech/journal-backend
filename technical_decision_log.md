# Technical Decision Log

## 1. Authentication Strategy

**Decision:** Use JWT-based authentication  
**Options Considered:**

- **JWT (Chosen)**: Stateless, scalable, widely used.
- **Sessions & Cookies**: More secure for web but requires session storage.
- **OAuth2**: Best for third-party authentication but adds complexity.  
  **Trade-offs:**
- JWT requires careful token expiration handling.
- Sessions offer better security but increase server load.

---

## 2. Database Choice

**Decision:** Use PostgreSQL with Prisma ORM  
**Options Considered:**

- **PostgreSQL (Chosen)**: Relational, scalable, strong data integrity.
- **MySQL**: Good for relational data but lacks some features of PostgreSQL.  
  **Trade-offs:**
- PostgreSQL requires schema migrations but ensures data consistency.
- NoSQL databases would offer more flexibility but make queries complex.

---

## 3. Summary & Analytics Features

**Decision:** Use AI for sentiment analysis and trend detection  
**Options Considered:**

- **Basic Statistical Analysis(Chosen)**: Simple, but lacks contextual understanding.
- **NLP with OpenAI API**: Provides advanced insights.
- **Self-hosted ML Model**: More control, but higher maintenance.  
  **Trade-offs:**
- OpenAI API is easy to integrate but adds API cost.
- A custom ML model offers flexibility but requires more development time.

---

## 4. API Design Approach

**Decision:** Use RESTful APIs with Express  
**Options Considered:**

- **REST API (Chosen)**: Simple, widely used, easier to implement.
- **GraphQL**: Flexible queries, but added complexity.
- **gRPC**: High performance but requires a more structured approach.  
  **Trade-offs:**
- REST is easier to cache and scale.
- GraphQL allows complex queries but requires more backend resources.
