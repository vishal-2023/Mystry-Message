import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject = {}

async function dbConnect() :Promise<void> {
    if(connection.isConnected){
        console.log("Db is already running")
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGO_URL || '')
        // console.log("dbbb",db)
        connection.isConnected = db?.connections[0].readyState
        console.log("Db connected successfully")

    }catch(error){
        console.log("dbConnection Error",error);
        process.exit(1)
    }
}

export default dbConnect;