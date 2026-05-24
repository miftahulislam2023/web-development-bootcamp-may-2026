import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> console.log("Database Connected."))
        await mongoose.connect(`${process.env.MONGO_URI}`)
    } catch (error) {
        console.log(error)
    }
}