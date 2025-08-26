const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const nodemailer = require("nodemailer");

// Middleware: only logged in admin can access
function isAdmin(req, res, next) {
  if (req.session && req.session.admin) {
    return next();
  } else {
    return res.redirect("/admin/login");
  }
}

// Employees list
router.get("/", isAdmin, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("employees/index", { employees });
  } catch (err) {
    res.status(500).send("Error fetching employees");
  }
});

// Add employee form
router.get("/add", isAdmin, (req, res) => {
  res.render("employees/add");
});

// Add employee logic
router.post("/add", isAdmin, async (req, res) => {
  try {
    const { name, position, basicSalary, hra, da, email } = req.body;

    const totalSalary = Number(basicSalary) + Number(hra) + Number(da);
    const empId = "EMP" + Date.now();
    const password = Math.random().toString(36).substring(2, 8);

    const employee = new Employee({
      empId,
      name,
      position,
      basicSalary,
      hra,
      da,
      totalSalary,
      password,
      email
    });

    await employee.save();

    // ✅ Send email with empId & password
    if (email) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "yourgmail@gmail.com",
          pass: "your-app-password" // Use App Password if 2FA enabled
        }
      });

      let mailOptions = {
        from: "yourgmail@gmail.com",
        to: email,
        subject: "Your Employee Account Created",
        text: `Hello ${name},\n\nYour Employee ID: ${empId}\nPassword: ${password}\n\nLogin to your ERP portal.\n\n- ERP Team`
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("❌ Email Error:", err);
        else console.log("✅ Email Sent:", info.response);
      });
    }

    res.redirect("/employees");
  } catch (err) {
    res.status(500).send("Error adding employee");
  }
});

module.exports = router;
