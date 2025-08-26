const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const path = require("path");

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.use(
  session({
    store: new FileStore({ path: "./sessions" }),
    secret: "mySecretKey", 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 5 }, 
  })
);

//Login Credentials
const USER = {
  username: "admin",
  password: "12345",
};


app.get("/", (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/dashboard");
  }
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    req.session.isAuth = true;
    req.session.username = username;
    return res.redirect("/dashboard");
  } else {
    return res.render("login", { error: "Invalid username or password" });
  }
});

app.get("/dashboard", (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/");
  }
  res.render("dashboard", { user: req.session.username });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(8000, () => {
  console.log("Server running at http://localhost:8000");
});
