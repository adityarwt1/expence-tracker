import mongoose from "mongoose";

export const mongoconnect = async () :Promise<boolean> =>{
    try {
        const isConnected = await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName:"ExpencseTrackerNextjs"
        } )

        if(!isConnected){
            return false
        } else {
            return true
        }
    } catch (error) {
        return false
    }
}