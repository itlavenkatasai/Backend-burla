import mongoose from "mongoose";

const employeeIdSchema = new mongoose.Schema({
    employeeIdPrefix : {type : String},
    employeeIdNumber : {type : Number}
});

export const EmployeeId = new mongoose.model('EmployeeId',employeeIdSchema);