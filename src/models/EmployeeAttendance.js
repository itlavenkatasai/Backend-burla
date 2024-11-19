import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    attendanceDate: { type: Date },
    employeeId: { type: String },
    employeeName: { type: String },
    employeeStatus: { type: Number },
});
export const EmployeeAttendance = new mongoose.model("EmployeeAttendance", attendanceSchema);
