import { config } from "dotenv";
import express from "express";
import { prisma } from "../prisma/client";
const app = express();

config();

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

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server started listening at http://localhost:${PORT}`)
  );
});
