'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from 'next-auth/react'

const SignInPage = () => { 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const register = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);
    try {
      const response = await signIn('credentials', {
        redirect: false,
        username: data?.identifier,
        password: data?.password
      })
      console.log("ress",response)  

      if (response?.error == "Error: Please verify your account before login") {
        toast({
          title: 'Login Failed',
          description: response?.error,
          variant: 'destructive'
        })
        router.replace(`/verify/${data.identifier}`)
        setIsSubmitting(false);
      } else {
        toast({
          title: 'Login Failed',
          description: response?.error,
          variant: 'destructive'
        })
        setIsSubmitting(false);
      }

      if (response?.url) {
        toast({
          title: 'Login Success',
          variant: 'default'
        })
        router.replace('/dashboard');
        setIsSubmitting(false)
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data?.message; // Use const here
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive'
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f6f9ff]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl w-10/12 mx-auto text-center font-bold tracking-tight text-gray-900 lg:text-4xl mb-6">
            Sign in to Your Account
          </h1>
          <p className="text-gray-600 mb-4">
            Enter your credentials to start your mystery adventure.
          </p>
        </div>

        <Form {...register}>
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={register.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-gray-800 bg-yellow-400 text-gray-800 py-2 rounded-md transform hover:scale-95 transition duration-300 hover:bg-yellow-500 "
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{' '}
            <span
              className="text-indigo-500 cursor-pointer hover:underline"
              onClick={() => router.push('/sign-up')}
            >
              Sign up here
            </span>
          </p>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage; // Export updated component name
