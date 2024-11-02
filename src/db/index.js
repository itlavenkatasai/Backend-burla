import mongoose from "mongoose";

export const dbConnectedToMongoDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/BurlaBuilders");
        console.log("db is connected with node");
    }catch(error){
        console.log(error);
        console.log("db is not connected with nodemon");
    }
}