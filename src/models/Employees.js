import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeName : {type : String},
    employeePhoneNumber : {type : Number},
    employeeDOB : {type : Date},
    employeeLocation : {type : String},
    employeeAadhar : {type : Number},
    employeeWagePerDay : {type : Number},
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' } // reference to Client model
});
export const Employees = new mongoose.model('Employees',employeeSchema);