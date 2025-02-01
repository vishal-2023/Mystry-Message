import { getServerSession } from "next-auth"; // hepls in taking session from backend
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    await dbConnect()
    console.log("TTTTTTTTTTTT")
    const session = await getServerSession(authOptions);
    console.log("session--del",session)

    const user: User = session?.user;
    console.log("ussss--del",user)
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const messageId = params.messageId
console.log("m-id",messageId)
    try {

        // UserModel.findByIdAndUpdate({_id:user?._id},{
        //     $push:{
        //         messages:newMessage?._id
        //     }
        // })

        const updateResult = await UserModel.updateOne({
            _id: user._id
        },
            {
                $pull: {
                    messages: messageId 
                }
            }
        )
        console.log("up",updateResult);
        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: 'message not found or already deleted'
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: 'message deleted successfully'
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            status: false,
            message: "Internal Server Error"
        }, { status: 500 })
    }

}