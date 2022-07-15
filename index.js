import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
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

const user = { username: "max" };

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

const decodeJwt = (token) => {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace("-", "+").replace("_", "/");
  let decodedData = JSON.parse(
    Buffer.from(base64, "base64"),
    toString("binary")
  );
  return decodedData;
};

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
    jwt.sign({ user }, "secretkey", { expiresIn: "20s" }, (err, token) => {
      
      res.json({
        user,
        token,
      });
    });
  } else {
    res.sendStatus(500);
  }
});

app.post("/maintain-login", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const data = decodeJwt(req.token);
      res.json({
        user: data.user,
      });
    }
  });
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
