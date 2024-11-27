import { EMPLOYEE_INACTIVE, EmployeeAttendance } from "../models/index.js";
import { EmployeeId } from "../models/index.js";
import { Employees } from "../models/index.js";
import mongoose from "mongoose";
import { EMPLOYEE_ACTIVE } from "../models/index.js";

export const createEmployeeHandler = async (req, res) => {
    try {
        const { clientId } = req.locals;
        const { employeeName,
            employeePhoneNumber,
            employeeDOB,
            employeeLocation,
            employeeAadhar,
            employeeWagePerDay,
            employeeJoiningDate,
        } = req.body;
        const existingEmployeePhoneNumber = await Employees.findOne({ employeePhoneNumber, clientId, employeeStatus: EMPLOYEE_ACTIVE });
        const existingEmployeeAadhar = await Employees.findOne({ employeeAadhar, clientId, employeeStatus: EMPLOYEE_ACTIVE });
        if (existingEmployeePhoneNumber) {
            return res.status(409).json({
                message: "this employee phone Number already exist"
            })
        }
        if (existingEmployeeAadhar) {
            return res.status(409).json({
                message: "this employee Aadhar Number already exist"
            })
        }
        let fullEmployeeId = "";
        const empIdExist = await EmployeeId.findOne({ clientId });
        console.log(empIdExist);
        if (!empIdExist) {
            fullEmployeeId = 'EMP-1';
        } else {
            fullEmployeeId = empIdExist.employeeIdPrefix + (empIdExist.employeeIdNumber + 1);
        }
        const employee = await Employees.create({
            employeeName,
            employeePhoneNumber,
            employeeDOB,
            employeeLocation,
            employeeAadhar,
            employeeWagePerDay,
            employeeJoiningDate,
            "clientId": clientId,
            "employeeId": fullEmployeeId,
            employeeStatus: EMPLOYEE_ACTIVE
        });
        if (!empIdExist) {
            await EmployeeId.create({
                employeeIdPrefix: "EMP",
                employeeIdNumber: 1,
                clientId: clientId
            });
        } else {
            await EmployeeId.findOneAndUpdate({
                employeeIdNumber: empIdExist.employeeIdNumber + 1
            });
        }
        return res.status(200).json({
            message: "Employee created sucessfully",
            data: employee
        })

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "something went wrong please try again"
        })
    }
}

export const listEmployeesHandler = async (req, res) => {
    try {
        const { clientId } = req.locals;
        const listEmployees = await Employees.find({ clientId, employeeStatus: EMPLOYEE_ACTIVE });
        return res.status(200).json({
            message: "Employees get sucessfully",
            data: listEmployees
        })
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "something went wrong please try again"
        })
    }
}

export const getEmployeeByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.locals;
        console.log("id", id);
        console.log("clientId", clientId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid employee ID",
            });
        }
        const employee = await Employees.findOne({ clientId, _id: id, employeeStatus: EMPLOYEE_ACTIVE });
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }
        return res.status(200).json({
            message: "Employee retrieved successfully",
            data: employee
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "Something went wrong, please try again"
        });
    }
}

export const updateEmployeeByIdHandler = async (req, res) => {
    try {
        const {
            employeeName,
            employeePhoneNumber,
            employeeDOB,
            employeeLocation,
            employeeAadhar,
            employeeWagePerDay
        } = req.body;

        const { clientId } = req.locals;
        const { id } = req.params;

        console.log("update Id", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid employee ID",
            });
        }

        const findEmployee = await Employees.findOne({ clientId, _id: id });

        if (!findEmployee) {
            return res.status(404).json({
                message: "Employee ID not found",
            });
        }

        const updatedEmployee = await Employees.findOneAndUpdate(
            { clientId, _id: id },
            {
                employeeName,
                employeePhoneNumber,
                employeeDOB,
                employeeLocation,
                employeeAadhar,
                employeeWagePerDay
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Employee updated successfully",
            data: updatedEmployee
        });

    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "Something went wrong, please try again"
        });
    }
};

export const deleteEmployeeByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId } = req.locals;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid employee ID",
            });
        }
        const deleteEmployee = await Employees.findOneAndUpdate({ clientId, _id: id, employeeStatus: EMPLOYEE_ACTIVE }, {
            $set: {
                employeeStatus: EMPLOYEE_INACTIVE
            }
        });
        if (!deleteEmployee) {
            return res.status(404).json({
                message: "Employee not found"
            })
        }
        return res.status(200).json({
            message: "employee delete sucessfully"
        });
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "Something went wrong, please try again"
        });
    }
}

export const searchEmployeeHandler = async (req, res) => {
    try {
        const { searchText } = req.params;
        if (!searchText) {
            return res.status(400).json({
                message: "search Text required"
            })
        }
        const getSearchDetails = await Employees.find({
            $or: [
                { "employeeName": { $regex: searchText, $options: "i" } },
                { "employeeLocation": { $regex: searchText, $options: "i" } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$employeeWagePerDay" },
                            regex: searchText,
                            options: "i"
                        }
                    }
                }
            ]
        });
        // console.log(getSearchDetails);
        return res.status(200).json({
            message: "Search results get sucessfully",
            data: getSearchDetails
        })
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "Something went wrong please try again later"
        })
    }

}

export const attendanceEmployeeHandler = async (req, res) => {
    try {
        const { attendanceData } = req.body;
        console.log("attendance data ", attendanceData)
        const { clientId } = req.locals;
        const updateData = attendanceData.map((o) => ({
            updateOne: {
                filter: {
                    clientId: clientId,
                    employeeId: o.employeeId, // Use `o.employeeId`
                    attendanceDate: new Date(o.attendanceDate) // Use `o.attendanceDate` 
                },
                update: {
                    $set: { ...o }
                },
                upsert: true
            }
        }));
        await EmployeeAttendance.bulkWrite(updateData);
        return res.status(200).json({
            message: "employees attendance create sucess fully"
        })
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({
            message: "something went wrong please try again"
        })
    }
}

export const attendanceGetByDateHandler = async (req, res) => {
    try {
        const { date } = req.body;
        const { clientId } = req.locals;
        const employeeData = await Employees.find({
            employeeStatus: EMPLOYEE_ACTIVE,
            clientId,
            employeeJoiningDate: { $lte: new Date(date) }
        })
        console.log(`employees less than equal to this date ${date} `, employeeData);
        const activeEmployeeIds = employeeData.map((o) => o.employeeId);
        console.log(activeEmployeeIds);
        const getattendanceData = await EmployeeAttendance.find({
            employeeId: { $in: activeEmployeeIds},
            clientId,
            attendanceDate : new Date(date)
        });
        console.log("getattendanceData :: ",getattendanceData);
        const finalAttendanceData = employeeData.map((o) => {
            let empAttData = getattendanceData.find((att) => att.employeeId === o.employeeId);
            return {
                employeeName: o.employeeName,
                employeeId: o.employeeId,
                attendanceStatus: empAttData?.attendanceStatus || null
            }
        })
        // if(getattendanceData.length === 0){
        //     console.log("true");
        // }
        return res.status(200).json({
            message: "attendance Data get By date sucessfully",
            data: finalAttendanceData
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong please try again"
        })
    }
}