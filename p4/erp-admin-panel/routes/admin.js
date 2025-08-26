const express = require("express");
const router = express.Router();

// Admin login page
router.get("/login", (req, res) => {
  res.render("admin/login");
});

// Admin login logic
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials (can use DB later)
  if (username === "admin" && password === "admin123") {
    req.session.admin = { username };
    res.redirect("/employees");
  } else {
    res.render("admin/login", { error: "Invalid Credentials" });
  }
});

// Admin logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

module.exports = router;
