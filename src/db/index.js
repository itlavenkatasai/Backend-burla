import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const dbConnectedToMongoDB = () => {
    const { ATLAS_URL } = process.env;

    if (!ATLAS_URL) {
        console.error("MongoDB connection string is missing. Please check your .env file.");
        return;
    }

    try {
        // Connect to MongoDB without deprecated options
        mongoose.connect(ATLAS_URL, {
            serverSelectionTimeoutMS: 5000,  // Timeout if the server is not available
            socketTimeoutMS: 45000,  // Timeout for socket connections
        });

        console.log("db is connected to node");
    } catch (error) {
        console.log("db is not connected to node");
        console.error(error);
    }
};
