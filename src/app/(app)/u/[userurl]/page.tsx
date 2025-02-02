'use client'
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';


const page = () => {
    const { userurl } = useParams<{ userurl: string }>();
    console.log("ppp", userurl)
const router = useRouter();
    const FormSchema = z.object({
        bio: z
            .string()
            .min(10, {
                message: "message must be at least 10 characters.",
            })
            .max(160, {
                message: "message must not be longer than 30 characters.",
            }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await axios.post('/api/send-messages', {
                username: userurl,
                content: data?.bio
            })

            if (response?.data) {
                toast({
                    title: response?.data?.message,
                    variant: "default"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data?.message;
            toast({
                title: 'Network failed',
                description: errorMessage,
                variant: 'destructive'
            })
        }finally {
            // Correctly calling the reset method here
            form.reset({
                bio: "", // Resetting the bio field
            });
        }
    }

    const suggestMessage = async () => {
        // const messages = "Generate a list of 10 questions or statements that encourage someone to share personal thoughts, reflections, or experiences."
        try {
            const response = await axios.post(`/api/suggest-messages`, 
                {
                    "messages": [
                      { "role": "system", "content": "You are a helpful assistant." },
                      { "role": "user", "content": "What is the weather like today?" }
                    ]
                  }
                  
            )
            console.log(response?.data, "chatgpt response..")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data?.message;
            toast({
                title: 'Network failed',
                description: errorMessage,
                variant: 'destructive'
            })
        }

    }

    return (
        <div>
            <h2 className=' text-3xl font-semibold text-yellow-500 text-center my-10'>Public Profile Link</h2>
            
            <div className=' w-[60%] mx-auto'>
                <p className=' text-lg font-bold'>Send Anonymous Message to {userurl} </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        You can <span>@mention</span> other users and organizations.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className=' flex justify-center'>
                        <Button className='mx-auto rounded-md text-gray-800 bg-yellow-400 text-gray-800  py-2 rounded-md transform hover:scale-95 transition duration-300 hover:bg-yellow-500 text-white' type="submit">Send it</Button>
                        </div>
                    </form>
                </Form>

                <div>
                    <Button onClick={suggestMessage} className=' my-3'> Suggest Messages </Button>
                    <p>Click on any message below to select it</p>
                    <div className=' my-3'>
                        <Card className="w-full py-5">
                            <Textarea
                                placeholder="Tell us a little bit about yourself"
                                className="resize-none w-10/12 mx-auto"
                            />
                        </Card>
                    </div>
                </div>
            </div>
            <div className='text-black text-center mt-10'>
                <p className='font-semibold'>Get Your Message Board</p>
                <button onClick={() => router.push('/')} className='mx-auto rounded-md text-gray-800 bg-yellow-400 text-gray-800 my-2 rounded-md  p-2 rounded-md transform hover:scale-95 transition duration-300 hover:bg-yellow-500 text-white' type="submit">
                    Create Your Account
                </button>
            </div>
           

        </div>
    )
}

export default page