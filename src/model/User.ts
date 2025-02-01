import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document {
    content:string,
    createdAt:Date
}

const MessageSchema : Schema<Message>= new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        // required:true,
        default:Date.now
    }
})

export const MessageModel = mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema);



export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    isVerified:boolean,
    verifyCodeExpiry:Date
    isAcceptingMessage:boolean,
    messages:mongoose.Types.ObjectId[]

}

const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,'Please use valid email address']
    },
    password:{
        type:String,
        required:[true,"passsword is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
})

const UserModel =  mongoose.models.User || mongoose.model<User>("User",UserSchema)
export default UserModel;