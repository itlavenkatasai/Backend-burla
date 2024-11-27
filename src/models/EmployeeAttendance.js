import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    attendanceDate: { type: Date },
    employeeId: { type: String },
    employeeName: { type: String },
    attendanceStatus: { type: Number },
    clientId : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});
export const EmployeeAttendance = new mongoose.model("EmployeeAttendance", attendanceSchema);
