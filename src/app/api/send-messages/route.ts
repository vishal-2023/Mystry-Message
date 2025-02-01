import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {MessageModel}  from "@/model/User";

export async function POST(request:Request){
    await dbConnect()
    const {username,content} = await request.json()
    try{
        // console.log("user",username,content);
        const user = await UserModel.findOne({username});
        // console.log("uss are user ",user);
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
 
        // is user accepting the message.. 
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting the message"
            },{status:403})
        }
        console.log("new hello ")

        const newMessage = new MessageModel({content:content})
        await newMessage.save()
        console.log("new message ",newMessage)

        const res = await UserModel.findByIdAndUpdate({_id:user?._id},{
            $push:{
                messages:newMessage?._id
            }
        })

        console.log("rdddss",res)

        return Response.json({
            status:true,
            message:"message sent  successfully"
        },{status:200})

    }catch(error){
        console.log("eee",error);
        return Response.json({
            status:false,
            message:"Internal Server Error"
        },{status:500})
    }
}


