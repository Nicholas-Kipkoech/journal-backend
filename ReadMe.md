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

### 5. Set Up Prisma

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
