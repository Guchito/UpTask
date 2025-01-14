import mongoose from "mongoose";
import colors from "colors";
import { exit } from 'node:process';
import dotenv from "dotenv";


export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URI)
        const url = `${connection.host}:${connection.port}`;
        console.log(colors.magenta.bold(`MongoDB connected: ${url}`));
    }catch (error) {
        console.error(colors.red.bold(`Error connecting to MongoDB: ${error.message}`));
        exit(1); 
    }
}
        