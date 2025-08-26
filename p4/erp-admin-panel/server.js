const express = require("express");
const session = require("express-session");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// DB connect
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "erp-secret", resave: false, saveUninitialized: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const adminRoutes = require("./routes/admin");
const employeeRoutes = require("./routes/employees");

app.use("/admin", adminRoutes);
app.use("/employees", employeeRoutes);

app.get("/", (req, res) => res.redirect("/admin/login"));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 ERP Admin Panel is running on http://localhost:${PORT}`));
