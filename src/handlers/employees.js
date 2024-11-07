import { Employees } from "../models/index.js";
import mongoose from "mongoose";
export const createEmployeeHandler = async (req, res) => {
    try {
        const { clientId } = req.locals;
        const { employeeName,
            employeePhoneNumber,
            employeeDOB,
            employeeLocation,
            employeeAadhar,
            employeeWagePerDay
        } = req.body;
        const existingEmployeePhoneNumber = await Employees.findOne({ employeePhoneNumber, clientId });
        const existingEmployeeAadhar = await Employees.findOne({ employeeAadhar, clientId });
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
        const employee = await Employees.create({
            employeeName,
            employeePhoneNumber,
            employeeDOB,
            employeeLocation,
            employeeAadhar,
            employeeWagePerDay,
            "clientId": clientId
        });
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
        const listEmployees = await Employees.find({ clientId });
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
        console.log("id",id);
        console.log("clientId",clientId);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid employee ID",
            });
        }
        const employee = await Employees.findOne({ clientId, _id : id });
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

export const deleteEmployeeByIdHandler = async (req,res) => {
    try{
       const {id} = req.params;
       const {clientId} = req.locals;
       if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid employee ID",
        });
    }
       const deleteEmployee = await Employees.findOneAndDelete({clientId,_id : id});
       if(!deleteEmployee){
        return res.status(404).json({
            message : "Employee not found"
        })
       }
       return res.status(200).json({
        message : "employee delete sucessfully"
       });
    }catch(error){
        console.log("error", error);
        return res.status(500).json({
            message: "Something went wrong, please try again"
        });
    }
}