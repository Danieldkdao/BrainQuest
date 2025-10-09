import mongoose from 'mongoose';
import "dotenv/config";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully!");
    }
    catch (error) {
        console.error(error);
    }
};
export default connectDB;
