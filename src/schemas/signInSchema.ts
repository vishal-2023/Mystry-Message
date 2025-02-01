import {z} from 'zod'

export const signInSchema = z.object({
    identifier:z.string().min(2, "username must be atleast 2 character")
    .max(20, "user name not more than 20 character"),
    password:z.string().min(6, { message: "message must not be atleast 6 character" })
})