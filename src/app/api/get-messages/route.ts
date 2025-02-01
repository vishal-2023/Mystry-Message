import { getServerSession } from "next-auth"; // hepls in taking session from backend
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'
import mongoose from "mongoose";

export async function GET(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    // console.log("getSession ",session);
    const user: User = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user?._id);
    console.log("us---iiiddd ",userId);

    try{
        // const userM = await UserModel.findById({ _id: userId });
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {
              $lookup: {
                from: 'messages',  
                localField: 'messages',
                foreignField: '_id',
                as: 'messages'
              }
            },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', username: { $first: '$username' }, messages: { $push: '$messages' } } }
          ]);
          
        //   console.log(user);  // Check the output
          
        // console.log("uss mmmesss",user[0]?.messages??[])
        // if(!user || user?.length === 0){
        //     return Response.json({
        //         success:false,
        //         message:"User not found"
        //     },{status:401})
        // }

        return Response.json({
            success:true,
            messages:user[0]?.messages??[]
        },{status:200})

    }catch(error){
        console.log("emmm",error)
        return Response.json({
            status:false,
            message:"Internal Server Error"
        },{status:500})
    }

}