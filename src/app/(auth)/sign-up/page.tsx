'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const signup = () => {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter();
    // zod implementation
    const register = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (username) {
                console.log("first")
                setIsCheckingUsername(true);
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`);
                    if (response.data) {
                        setUsernameMessage(response.data.message)
                    }
                } catch (err) {
                    const axiosError = err as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError?.response?.data?.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUserNameUnique()
    }, [username])

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
            if (response?.data) {
                toast({
                    title: 'success',
                    description: response.data.message
                })
                router.replace(`/verify/${username}`)
                setIsSubmitting(false);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data?.message;
            console.log("ee", errorMessage)
            toast({
                title: 'signup failed',
                description: errorMessage,
                variant: 'destructive'
            })
            setIsSubmitting(false);
        }
        // console.log(data)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
                <div className=" text-center ">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery mesage
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...register} >
                    <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={register.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }} />
                                    </FormControl>
                                    {
                                        isCheckingUsername && <Loader2 className="animate-spin" />
                                    }
                                    <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                        test {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={register.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>                                    
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={register.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                </>
                            ) : ('Signup')}
                        </Button>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default signup