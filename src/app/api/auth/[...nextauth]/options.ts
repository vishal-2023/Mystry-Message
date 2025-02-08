import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";  // Import the User model


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined): Promise<InstanceType<typeof User> | null> {  // Using InstanceType to get the instance type of User model
        await dbConnect();
        try {
          // console.log("cred",credentials);
          const user = await User.findOne({
            $or: [
              { email: credentials?.username },
              { username: credentials?.username }
            ]
          });
          // console.log("uss",user);
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user?.isVerified) {
            throw new Error("Please verify your account before login");
          }
          if (credentials?.password) {
            const verifyPassword = await bcrypt.compare(credentials?.password, user?.password);
            if (verifyPassword) {
              return user;  // Returning the user here
            } else {
              throw new Error("Incorrect password");
            }
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            throw new Error(err.message);  // TypeScript knows `err` is an instance of `Error`
          } else {
            throw new Error("An unknown error occurred");
          }
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          isVerified: token.isVerified,
          isAcceptingMessage: token.isAcceptingMessage,
          username: token.username
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user?._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessage = user?.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    }
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
