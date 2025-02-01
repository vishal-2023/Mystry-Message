import { getServerSession } from "next-auth"; // hepls in taking session from backend
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from 'next-auth'

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    // console.log("usse",session)

    const userId = user?._id;
    const { acceptMessages } = await request.json()

    try {
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        }, { new: true })

        if (!updateUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message update status updates successfully",
            updateUser
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    // console.log("accepe ss",session)
    try {
        const user: User = session?.user;
        // console.log("sss--idd",session,user)
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "Not Authenticated"
            }, { status: 401 })
        }
        const userId = user?._id;
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not founf"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (err) {
        console.log("accept message error",err);
        return Response.json({
            success: false,
            message: "Intenal Server Error"
        }, { status: 500 })
    }

}