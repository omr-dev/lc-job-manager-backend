import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { JobSource } from "./models/JobSource.js";

dotenv.config();
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/lc-job-manager";
mongoose.connect(MONGODB_URI, (err) => {
  if (err) {
    console.log({
      error: "Cannot connect to MongoDB database.",
      err: `${err}`,
    });
  }
});

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Welcome my API!");
});
app.get("/job-sources", async (req, res) => {
  const jobSources = await JobSource.find();

  res.status(200).json(jobSources);
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (checkLogin(username, password)) {
    res.status(200).json({ username: "max", uid: 1 });
  } else {
    res.sendStatus(500);
  }
});
app.listen(port, () => {
  console.log(`Server runs on: http://localhost:${port}`);
});

function checkLogin(username, password) {
  if (username === "max" && password === "123") {
    return true;
  } else {
    return false;
  }
}
