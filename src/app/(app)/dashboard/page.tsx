'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Message } from '@/model/User';
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
import { Label } from '@/components/ui/label';
import { FaMoon, FaSun } from 'react-icons/fa';  // Importing icons from react-icons


const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const fullUrl = typeof window !== "undefined" ? window.location.href : '';
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages?.filter((item) => item?._id !== messageId))
  }
  const [isChecked, setIsChecked] = useState(false as boolean);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
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
  }, [acceptMessages, messages, setValue, toast])

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
    console.log("OOOO//////")
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
    const copyText = inputRef?.current as HTMLInputElement;

    // Select the text field
    if (copyText) {
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
  console.log("OOOOOOOOOOOO", messages)



  return (
    <FormProvider {...methods}>
      <div className='py-8 bg-[#f6f9ff] mx-4 md:mx-8 lg:mx-auto p-6  rounded w-full mx-w-6xl'>
        <h1 className='text-3xl text-yellow-500 font-bold mb-4'>User Dashboard</h1>
        <div className=' p-2 bg-white flex justify-between items-center'>
          <Input id="name" className=' w-10/12 border-white' ref={inputRef} value={userUrl} placeholder="Name of your project" />
          <button onClick={copyText} className='text-sm h-full cursor-pointer font-bold  text-gray-800 bg-yellow-400 text-gray-800 py-2 px-6 rounded-full px-4  transform hover:scale-105 transition duration-300 text-white hover:bg-yellow-500'>Copy Link</button>
        </div>
        <div className='mb-4 text-sm px-2 text-yellow-400'>Share this link with freinds or user to get genuine feedback</div>
 


        <div className="flex items-center space-x-4">
          <label htmlFor="toggle" className="text-gray-600 font-bold">Accept Message</label>

          {/* The toggle icons */}
          <div className="flex items-center cursor-pointer" >
            {/* Sun icon for on state */}
            {acceptMessages ? (
              <>ON</>
            ) : (
              <>OFF</>
            )}
          </div>

          {/* Toggle switch for visual effect (optional) */}
          <div className="relative w-12 h-6">
            <div
              className={`w-full h-6 bg-gray-300 rounded-full cursor-pointer
          ${isChecked ? 'bg-blue-500' : 'bg-gray-300'} 
          transition-all ease-in-out`}
              onClick={handleSwitchChanges}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md 
            transform transition-transform ease-in-out 
            ${acceptMessages ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </div>
          </div>
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

        <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
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
