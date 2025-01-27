import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const dbConnectedToMongoDB = async () => {
  const { ATLAS_URL } = process.env;

  if (!ATLAS_URL) {
    console.error("MongoDB connection string is missing. Please check your .env file.");
    return;
  }

  try {
    // Connect to MongoDB with required and safe configurations
    await mongoose.connect(ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is found
      tls: true, // Enforce TLS for secure connections
    });

    console.log("Database connected successfully to MongoDB.");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);

    if (error.name === "MongooseServerSelectionError") {
      console.error(
        "Check the following:\n" +
          "- Your IP address is whitelisted in MongoDB Atlas.\n" +
          "- The database username and password in your connection string are correct.\n" +
          "- The cluster is running and accessible."
      );
    }
  }
};
