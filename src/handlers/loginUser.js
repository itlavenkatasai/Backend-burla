import { User } from "../models/index.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        console.log(phoneNumber);
        const existingUser = await User.findOne({ phoneNumber });
        console.log(existingUser);
        if (!existingUser) {
            return res.status(400).json({
                message: "Invalid PhoneNumber"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid password"
            })
        }
        const { TOKEN_SECRET, TOKEN_EXPIRES_IN } = process.env;
        console.log();
        const token = jwt.sign({phoneNumber,clientId: existingUser._id},TOKEN_SECRET,{expiresIn: TOKEN_EXPIRES_IN});
        return res.status(200).json({
            message: "token crate sucessful",
            token: token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "something went wrong please try again later"
        })
    }
}