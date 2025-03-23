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
PORT= "REPLACE WITH YOUR PORT"
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
    participant Storage
    participant Cache

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
