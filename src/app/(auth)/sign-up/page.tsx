'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
        <div className="flex justify-center items-center min-h-screen bg-[#f6f9ff]">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 lg:text-4xl mb-6">
              Join Mystery Message
            </h1>
            <p className="text-gray-600 mb-4">
              Sign up to start your anonymous adventure.
            </p>
          </div>
      
          <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Username Field */}
              <FormField
                control={register.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin text-teal-500" />}
                    <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                    <FormMessage  className=" text-red-500" />
                  </FormItem>
                )}
              />
              
              {/* Email Field */}
              <FormField
                control={register.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </FormControl>
                    <FormMessage  className=" text-red-500" />
                  </FormItem>
                )}
              />
              
              {/* Password Field */}
              <FormField
                control={register.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-teal-500"
                      />
                    </FormControl>
                    <FormMessage className=" text-red-500" />
                  </FormItem>
                )}
              />
      
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full text-gray-800 bg-yellow-400 text-gray-800  py-2 rounded-md transform hover:scale-95 transition duration-300 hover:bg-yellow-500 "
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
      
          {/* Redirect to Sign In */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <span
              className="text-teal-500 cursor-pointer hover:underline"
              onClick={() => router.push('/sign-in')}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
      
    )
}

export default signup