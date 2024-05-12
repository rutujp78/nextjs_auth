import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL || "");
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log("MongoDB connected");
        })
        connection.on('error', (err) => {
            console.log("Error while connectiong to MongoDB", err);
            process.exit();
        })

    } catch (error) {
        console.log("Something went wrong while connecting to DB");
        console.log(error);
    }
}