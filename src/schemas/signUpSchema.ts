import { z } from 'zod'

export const usernameValidation = z.string()
    .min(2, "username must be atleast 2 character")
    .max(20, "user name not more than 20 character")
    // .regex(/^[A-Z][a-zA-Z-' ]+$/, "user name must not contains special symbol")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "message must not be atleast 6 character" })

})