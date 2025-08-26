const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EmployeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true },
  name: String,
  position: String,
  basicSalary: Number,
  hra: Number,
  da: Number,
  totalSalary: Number,
  password: String,
  email: String
});

// hash password before save
EmployeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema);
