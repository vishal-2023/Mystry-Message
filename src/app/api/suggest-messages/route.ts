import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { GoogleGenerativeAI } from "@google/generative-ai";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try{
        const { messages } = await req.json();

        const genAI = new GoogleGenerativeAI("AIzaSyA7j_h0aQfTB9wTfzR9D3zc4ciRbBb_ohs");
    
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // const prompt = "Explain how AI works";
        
        const result = await model.generateContent(messages);
        // console.log(result.response.text());

        return Response.json({
            success:true,
            message:result.response.text()
        })

       
    }catch(err){
        console.log("eerr",err);
        return Response.json({
            status:false,
            message:"Internal server error"
        },{status:500})
    }
 
}