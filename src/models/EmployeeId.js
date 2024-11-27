import mongoose from "mongoose";

const employeeIdSchema = new mongoose.Schema({
    employeeIdPrefix : {type : String},
    employeeIdNumber : {type : Number},
    clientId : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});

export const EmployeeId = new mongoose.model('EmployeeId',employeeIdSchema);