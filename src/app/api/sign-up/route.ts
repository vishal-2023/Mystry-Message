import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import bcrypt from 'bcryptjs'
import sendVerificationEmail from '../../helpers/sendVerificationEmail'

export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,email,password} = await request.json()

        //check username already exist
        const checkAlreadyExistUser = await User.findOne({username,isVerified:true})
        if(checkAlreadyExistUser){
            return Response.json({
                success:false,
                message:"Username Already Exist"
            })
        }

        // check useremail already exist or not ?
        const existingUserByEmail = await User.findOne({
            email
        })

        const verifyCode = Math.floor(Math.random()*900000 + 100000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "User Already exist with this email"
                },{status:400})
            }else{
                const hashPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }

        }else{
            const hashPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new User({
                username:username,
                email:email,
                password:hashPassword,
                verifyCode:verifyCode,
                isVerified:false,
                verifyCodeExpiry:expiryDate,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email,username,verifyCode)
        console.log("email response ",emailResponse)

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message: emailResponse.message || "Error in sending mail" ,
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"User registered successfully || Please Verify your email"
        },{status:201})

    }catch(error){
        console.error("Error registering error",error)
        return Response.json({
            success:false,
            message:"Error occurred while registering"
        },{status:500}
    )
    }
}