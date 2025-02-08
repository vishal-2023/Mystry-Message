'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifySchema } from '@/schemas/verifySchema';
import * as z from "zod"
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useParams } from 'next/navigation'

const Page = () => {
  const router = useRouter();
  const {toast} = useToast()
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const register = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    }
  })

  async function onSubmit(data: z.infer<typeof verifySchema>) {
    const details ={
      username:params.username,
      code:data.code
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, details);
      if (response?.data) {
        toast({
          title: 'success',
          description: response.data.message
        })
        router.replace(`/sign-in`)
        setIsSubmitting(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data?.message;
      // console.log("ee", errorMessage)
      toast({
        title: 'signup failed',
        description: errorMessage,
        variant: 'destructive'
      })
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className=" w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">
        <div className=" text-center ">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Email Verification
          </h1>
          <p className="mb-4">
            Verify your email to Signin the Mystery Page
          </p>
        </div>
        <Form {...register} >
          <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={register.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} />
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
              ) : ('Submit')}
            </Button>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page