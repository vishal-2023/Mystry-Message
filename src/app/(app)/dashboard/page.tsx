'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { Message } from '@/model/User';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useForm, FormProvider } from 'react-hook-form'; // use this only once
import { zodResolver } from '@hookform/resolvers/zod';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/custom/MessageCard';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const fullUrl = typeof window !== "undefined" ? window.location.href : '';
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages?.filter((item) => item?._id !== messageId))
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: session } = useSession();
  console.log("sssee", session)
  // console.log("ww",window.location?.origin+session?.user?.username)
  const userUrl = `${window.location?.origin}/u/${session?.user?.username}`
  console.log("ooo", userUrl)
  const methods = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { control, watch, setValue } = methods;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages')
      if (response?.data) {
        setValue('acceptMessages', response?.data?.isAcceptingMessages)
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
    }
    finally {
      setSwitchLoading(false)
    }
  }, [acceptMessages,messages, setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setSwitchLoading(true)

    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages`);
      if (response?.data) {
        setMessages(response?.data?.messages || [])
      }
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data?.message;
      console.log("ee", errorMessage)
      toast({
        title: 'signup failed',
        description: errorMessage || "Failed to fetch messages settings",
        variant: 'destructive'
      })
    }
    finally {
      setIsLoading(false);
      setSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session?.user?._id) return;
    fetchMessages();
    fetchAcceptMessages()
  }, [session, setValue])

  // Handle switch changes..
  const handleSwitchChanges = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-messages`, {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response?.data?.message,
        variant: "default"
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data?.message;
      console.log("ee", errorMessage)
      toast({
        title: 'signup failed',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  function copyText() {
    // Get the text field using the ref
    const copyText = inputRef?.current as HTMLInputElement ;

    // Select the text field
    if(copyText){
      copyText.select()
      navigator.clipboard.writeText(copyText.value as string)
    }

    toast({
      title: `Copied : ${copyText?.value as string} `,
      variant: "default"
    })
  }

  if (!session || !session?.user) {
    return <div>Please Login</div>
  }
console.log("OOOOOOOOOOOO",messages)
  return (
    <FormProvider {...methods}>
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full mx-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>User Dashboard</h1>
        <div className='mb-4'>
          <Card className="w-full px-5 flex justify-between items-center">
            <CardHeader>
              <Input id="name" ref={inputRef} value={userUrl} placeholder="Name of your project" />
            </CardHeader>
            <h2 onClick={copyText} className='text-md cursor-pointer font-bold mb-2'>Copy Unique Link</h2>
          </Card>
        </div>

        <div className='mb-4'>
          <FormField
            control={control} // Correctly passing control here
            name="acceptMessages"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Marketing emails</FormLabel>
                  <FormDescription>
                    Receive emails about new products, features, and more.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChanges}
                    disabled={isSwitchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <Separator className="my-4" />
          <Button
            className='mt-4'
            variant={'outline'}
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true)
            }}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <RefreshCcw className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {messages?.length > 0 ? (
            messages?.map((message) => {
              return <MessageCard key={message?._id as string} message={message} onMessageDelete={handleDeleteMessage} />
            })
          ) : (
            <p>No message to display.</p>
          )}
        </div>
      </div>
    </FormProvider>

  )
}

export default Dashboard
