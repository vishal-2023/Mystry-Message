'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import axios, { AxiosError } from 'axios'
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

const signInPage = () => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // zod implementation
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
        identifier: data?.identifier,
        password: data?.password
      })  
      console.log("response - pro ",response)

      if(response?.error == "Error: Please verify your account before login"){
        toast({
          title: 'Login Failed',
          description: response?.error,
          variant:'destructive'
        })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false);
      }else{
        toast({
          title: 'Login Failed',
          description: response?.error,
          variant:'destructive'
        })
        setIsSubmitting(false);
      }

      // if (response?.error) {
        // toast({
        //   title: 'Login Failed',
        //   description: response?.error,
        //   variant:'destructive'
        // })
      //   router.replace(`/verify/${username}`)
      //   setIsSubmitting(false);
      // }
      console.log("first",response)
      if(response?.url){
        toast({
          title: 'Login Sucess',
          // description: res,
          variant:'default'
        })
        router.replace('/dashboard');
        setIsSubmitting(false)
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
            Sign in Page
          </h1>
          <p className="mb-4">
            Sign in to start your mystery adventure
          </p>
        </div>
        <Form {...register} >
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={register.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>identifier</FormLabel>
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
              ) : ('SignIn')}
            </Button>

          </form>
          <p className=" text-center" >Not Account yet ! <span className=" text-red-300 cursor-pointer" onClick={() => router.push('/sign-up')}>Signup here</span></p>
        </Form>
      </div>
    </div>
  )
}

export default signInPage;