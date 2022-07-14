import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
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
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Welcome my API!");
});
app.get("/job-sources", async (req, res) => {
  const jobSources = await JobSource.find();
 
  res.status(200).json(jobSources);
});
app.listen(port, () => {
  console.log(`Server runs on: http://localhost:${port}`);
});
