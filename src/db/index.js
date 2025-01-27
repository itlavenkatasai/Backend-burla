import mongoose from "mongoose";

export const dbConnectedToMongoDB = async () => {
    const {ATLAS_URL} = process.env;
    try{
        await mongoose.connect(ATLAS_URL);
        console.log("db is connected with node");
    }catch(error){
        console.log(error);
        console.log("db is not connected with nodemon");
    }
}