import mongoose from "mongoose";

const connectDB = async () => {
    // console.log("MONGO URI =", process.env.MONGO_URI);
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    } catch (error) {
    console.log("Mongo error:", error.message);
    process.exit(1);
    }
};

export default connectDB;






