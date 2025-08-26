require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

async function createEmployee() {
    const emp = new Employee({
        empId: 'EMP1001',      // your employee ID
        name: 'Ram',            // changed from John to Ram
        email: 'ram@example.com',
        password: '123456',    // plain password, will be hashed automatically
        position: 'Developer',
        baseSalary: 50000,
        totalSalary: 60000
    });

    await emp.save();
    console.log('Employee created');
    mongoose.disconnect();
}

createEmployee();
