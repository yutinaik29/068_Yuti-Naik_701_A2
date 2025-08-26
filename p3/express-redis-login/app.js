const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").RedisStore; // ✅ v9 export
const { createClient } = require("redis");

const app = express();

// Create Redis client
let redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});
redisClient.connect().catch(console.error);

// Create store instance
let store = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

// Session middleware
app.use(
  session({
    store: store,
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page. <a href='/login'>Login</a>");
});

app.get("/login", (req, res) => {
  req.session.user = "yuti";
  res.send("You are logged in. <a href='/profile'>Go to profile</a>");
});

app.get("/profile", (req, res) => {
  if (req.session.user) {
    res.send(`Hello ${req.session.user}, this is your profile!`);
  } else {
    res.send("Please login first.");
  }
});

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
