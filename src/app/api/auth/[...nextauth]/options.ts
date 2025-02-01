import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials :any) : Promise<any> {
            await dbConnect();
            try{
                const user = await User.findOne({
                    $or:[
                        {email: credentials.identifier},
                        {username:credentials.identifier}
                    ]
                })
                if(!user){
                    throw new Error("No user found this email")
                }

                if(!user?.isVerified){
                    throw new Error("Please verify your account before login")
                }

                const verifyPassword = await bcrypt.compare(credentials.password,user.password);
                if(verifyPassword){
                    return user;
                }else{  
                    throw new Error("Incorrect password")
                }

            }catch(err:any){
                throw new Error(err)
            }
        }
      })
    ],  
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user = {
                    _id: token._id,
                    isVerified: token.isVerified,
                    isAcceptingMessage: token.isAcceptingMessage,
                    username: token.username
                  };
            }
            // console.log("auth seesion",session)
          return session
        },
        async jwt({ token, user }) {
            // console.log("user",user)
            if(user){
                token._id = user?._id?.toString(),
                token.isVerified = user?.isVerified,
                token.isAcceptingMessage = user?.isAcceptingMessage,
                token.username = user.username
            }
            // console.log("jwt..auth",token,user)
            return token
        }
    },
    pages: {
      signIn: '/sign-in', 
    },
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
  
