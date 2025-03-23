# Journal App Server

## How to Install and Run It

### 1. Clone the Repository

```sh
git clone https://github.com/Nicholas-Kipkoech/journal-backend
cd journal-backend
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Set Up Enviroment Variables

```sh
DATABASE_URL="postgresql://user:password@localhost:5432/journal_db"
JWT_SECRET="your_secret_key"
PORT= 8080
PIXABAY_API_KEY="YOUR PIXABAY API KEY" # This is free, use for image generation based on moods
```

Replace:

- **user** with your PostgreSQL username.

- **password** with your PostgreSQL password.

- **journal_db** with your preferred database name.

- **your_secret_key** with a strong secret for JWT authentication.

### 4. Set Up Prisma

#### 1. Initialize prisma

```sh
npx prisma init
```

#### 2. Migrate database

```sh
npx prisma migrate dev --name init
```

#### 3. Generate Prisma Client

```sh
npx prisma generate
```

#### 4. Run the server

```sh
npm run dev
```

#### 4. Run tests

```sh
npm test -- --verbose
```

### 5. Data model design and relationships

Below is the database model design for our backend server. The relationship between different tables in the system.

![database design](/assets/database_model.png)

### 6. High-Level Architectural Design

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Login/Register
    Frontend->>Backend: Send credentials (hashed password)
    Backend->>Database: Validate user and store session (JWT)
    Backend-->>Frontend: Return auth token

    User->>Frontend: Create a journal entry
    Frontend->>Backend: Send journal data (title, content, collection(category))
    Backend->>Database: Store journal entry
    Backend-->>Frontend: Return saved entry with ID

    User->>Frontend: View journal entries
    Frontend->>Backend: Fetch all user journal entries
    Backend->>Cache: Check cached data
    alt Data Cached
        Cache-->>Backend: Return cached journal entries
    else Data Not Cached
        Backend->>Database: Fetch journal entries
        Backend->>Cache: Store data in Redis cache
    end
    Backend-->>Frontend: Return journal entries

    User->>Frontend: View analytics (word trends, sentiment)
    Frontend->>Backend: Request analytics summary
    Backend->>Database: Aggregate journal data
    Backend->>AI Engine: Perform sentiment analysis
    Backend-->>Frontend: Return insights and summary


```

### 7. High-Level Architectural Flowchart

```mermaid
flowchart TD;
  User["User"] -->|Login/Register| Auth["Authentication Service (JWT)"]
  Auth -->|Validates & Issues Token| API["Node.js API (Express)"]

  API -->|Store/Retrieve User Data| DB["PostgreSQL"]
  API -->|Analyze Data| AI["AI Sentiment Analysis"]

  User -->|Create Journal Entry| API
  API -->|Save Entry| DB


  User -->|Create Collection| API
  API -->|Save Collection| DB


  User -->|View Analytics| API
  API -->|Aggregate Data| DB
  API -->|Analyze Trends| AI
  API -->|Return Insights| User
```

### 8. Security Measures Beyond Basic Authentication

1. Authentication & Authorization

- JWT + Refresh Tokens
- Role-Based Access Control (RBAC) for admin and user permissions.

2. Data Security

- Encryption: Hash passwords using bcrypt.

### 9. Potential Scaling Challenges & Solutions

#### 1. Potential bottlenecks and how I would address them

| Challenge          | solution                                                                           |
| ------------------ | ---------------------------------------------------------------------------------- |
| High Read Traffic  | Use Redis caching for frequently accessed journal entries.                         |
| High Write Traffic | Use PostgreSQL read replicas or sharding.                                          |
| Slow Queries       | Index search-heavy columns (created_at, user_id). Use PostgreSQL Full-Text Search. |
| API Scaling        | Deploy horizontal scaling with Kubernetes.                                         |

#### 2. Scaling to 1M+ Users

1. Database Optimization

- Read Replicas: Scale PostgreSQL reads horizontally.

- Partitioning: Split journal entries by time (monthly_partitions).

- Eventual Consistency: Use message queues (e.g., Kafka, RabbitMQ).

2. Backend Scaling

- Kubernetes + Load Balancer to distribute API requests.

- Node.js Worker Threads for background tasks.

3. Frontend Optimization

- Implement server-side rendering (SSR) with Next.js.

- Use CDN for faster asset delivery.

#### 3. Components That Might Need Redesign at Scale

1. Database Architecture

- Introduce sharding or multi-region replication for high availability.

2. Queueing System

- Use Kafka or RabbitMQ for asynchronous processing.

3. Logging & Monitoring

- Centralized logging using ELK Stack (Elasticsearch, Logstash, Kibana).

4. Microservices

- Split Auth, Journal Entries, Analytics into separate services.
