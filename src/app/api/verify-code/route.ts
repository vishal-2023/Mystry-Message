import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    try{
        const {username,code} = await request.json();
        const decodeUserName = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodeUserName});
        if(!user){
            return Response.json({
                success:false,
                message:"Username not found"
            },{status:400})
        }
        const isCodeValid = user.verifyCode === code;
        const isCodeExpiryCheck = new Date(user.verifyCodeExpiry) > new Date();
        if(isCodeValid && isCodeExpiryCheck){
            user.isVerified = true;
            await user.save();

            return Response.json({
                success:true,
                message:"Account Verified Successfully"
            },{status:200})
            
        }else if(!isCodeExpiryCheck){
            return Response.json({
                success:false,
                message: "Verification Code is expired ! please signup again"
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code"
            },{status:400})
        }
    }catch(error){
        console.error("error while verifying code",error)
        return Response.json({
            success:false,
            message:"Error while verifying user"
        },{status:500})
    }
}