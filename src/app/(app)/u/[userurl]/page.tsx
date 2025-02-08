'use client'
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
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

const Page = () => {
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();
    const { userurl } = useParams();

    const FormSchema = z.object({
        bio: z
            .string()
            .min(10, {
                message: "message must be at least 10 characters.",
            })
            .max(160, {
                message: "message must not be longer than 160 characters.",
            }),
    });

    const [loading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await axios.post('/api/send-messages', {
                username: userurl,
                content: data?.bio,
            });

            if (response?.data) {
                toast({
                    title: response?.data?.message,
                    variant: "default",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message;
            toast({
                title: 'Network failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            // Correctly calling the reset method here
            form.reset({
                bio: "", // Resetting the bio field
            });
        }
    }

    const suggestMessage = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`/api/suggest-messages`, {
                "messages": "suggest feedback message to send the friends general talk ",
            });
            setMessage(response?.data.message);
            console.log(response?.data, "chatgpt response..");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message;
            toast({
                title: 'Success failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                                    <FormMessage className='text-red-500' />
                                </FormItem>
                            )}
                        />
                        <div className=' flex justify-center'>
                            <Button className='mx-auto rounded-md text-gray-800 bg-yellow-400 text-gray-800  py-2 rounded-md transform hover:scale-95 transition duration-300 hover:bg-yellow-500 text-white' type="submit">Send it</Button>
                        </div>
                    </form>
                </Form>

                <div>
                    <Button onClick={suggestMessage} className=' my-3'> {loading ? 'Please wait' : 'Suggest Messages'} </Button>
                    <div className=' my-3'>
                        <Card className="w-full p-3">
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                <p>{message ?? 'messages'}</p>
                            </div>
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
    );
};

export default Page;
