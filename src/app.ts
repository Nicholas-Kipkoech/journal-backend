import { config } from "dotenv";
import express from "express";
const app = express();

config();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () =>
  console.log(`Server started listening at http://localhost:${port}`)
);
