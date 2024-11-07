import mongoose from "mongoose";
const usersSchema = new mongoose.Schema({
    firstName : {type : String},
    lastName : {type : String},
    email : {type : String},
    phoneNumber : {type : Number},
    password : {type : String},
    confirmPwd : {type : String}
});
export const User = new mongoose.model('Users',usersSchema);