const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
    empId: { type: String, unique: true },
    name: String,
    email: { type: String, unique: true },
    password: String,
    position: String,
    baseSalary: Number,
    totalSalary: Number
});

// Hash password before saving
employeeSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare password
employeeSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('Employee', employeeSchema);
