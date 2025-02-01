import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try{
        const { messages } = await req.json();


        if (!Array.isArray(messages)) {
            return Response.json({
                status: false,
                message: "Messages must be an array"
            }, { status: 400 });
        }

        const validMessages = messages.every(msg => msg.role && msg.content);
        if (!validMessages) {
            return Response.json({
                status: false,
                message: "Each message must have a 'role' and 'content'"
            }, { status: 400 });
        }

        const result = streamText({
            model: openai('gpt-4o'),
            messages,
        });
        return result.toDataStreamResponse();
    }catch(err){
        console.log("eerr",err);
        return Response.json({
            status:false,
            message:"Internal server error"
        },{status:500})
    }
 
}