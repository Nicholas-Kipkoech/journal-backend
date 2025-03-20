import { config } from "dotenv";
import express from "express";
import { prisma } from "../prisma/client";
import authRouter from "./routes/authRoutes";
import collectionRouter from "./routes/collectionRoutes";
import journalRouter from "./routes/journalRoutes";
import analyticsRouter from "./routes/analyticsRoutes";
const app = express();

config();

app.use(express.json());

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

app.use("/auth", authRouter);
app.use("/collections", collectionRouter);
app.use("/journals", journalRouter);
app.use("/analytics", analyticsRouter);

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server started listening at http://localhost:${PORT}`)
  );
});
