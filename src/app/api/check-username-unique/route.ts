import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from 'zod'
import { usernameValidation } from '../../../schemas/signUpSchema';


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result,"safeparse-result")
        if(!result?.success){
            const useNameError = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: useNameError?.length >0 ? useNameError.join(', ') : "Invalid query parameter"
            },{status:400})
        }
        const {username} = result.data;
        const existingUser = await UserModel.findOne({username, isVerified:true})
        if(existingUser){
            return Response.json({
                success:false,
                message: "Username already taken"
            },{status:400})
        }

        return Response.json({
            success:true,
            message: "Username is unique"
        },{status:200})

    } catch (err) {
        console.error(err);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 }
        )
    }
}
