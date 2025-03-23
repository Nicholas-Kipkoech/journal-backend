import { config } from "dotenv";
import express from "express";
import { prisma } from "../prisma/client";
import authRouter from "./routes/authRoutes";
import collectionRouter from "./routes/collectionRoutes";
import journalRouter from "./routes/journalRoutes";
import analyticsRouter from "./routes/analyticsRoutes";
import cors from "cors";
import { setupSwagger } from "./swagger";
const app = express();

config();

app.use(cors());

app.use(express.json());

//setup swagger

setupSwagger(app);

// connect to pg database
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/journals", journalRouter);
app.use("/api/analytics", analyticsRouter);

let server: any;
const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, () =>
    console.log(`Server started listening at http://localhost:${PORT}`)
  );
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app, server, prisma };
