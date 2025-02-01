import { z} from 'zod'

export const messageSchema = z.object({
    content: z.string().min(10,{message:"content must be atleast 20 charater"}).max(300,{message:"Content must be no longer than 300 character"})
})