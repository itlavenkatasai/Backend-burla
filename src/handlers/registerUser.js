import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    try {
        const { firsrName,
            lastName,
            email,
            phoneNumber,
            password,
            confirmPwd } = req.body;
        const existingPhoneNumber = await User.findOne({ phoneNumber });
        if (existingPhoneNumber) {
            return res.status(409).json({
                message: "phone number are already registered. Please use different number."
            })
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({
                message: "email is already registered. Please use different mail ID"
            })
        }
        if(password !== confirmPwd){
            return res.status(400).json({
                message : "password and confirm password should be same"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const userRegister = await User.create({
            firsrName,
            lastName,
            email,
            phoneNumber,
            password : hashedPassword,
            confirmPassword : hashedPassword
        });
        return res.status(200).json({
            message: "user create sucessfully",
            data: userRegister
        })
    } catch (error) {
        console.log("error", error);

        return res.status(500).json({
            message: "something went error please try again"
        })
    }
}