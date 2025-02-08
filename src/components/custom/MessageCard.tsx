'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    
    CardHeader,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import {Message} from '../../model/User';
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'


type MessageProps = {
    key:string
    message:Message;
    onMessageDelete : (id:string) => void
}

const MessageCard = ({message,onMessageDelete} :MessageProps) => {
    // console.log("mmm",message)
    const {toast} = useToast();
    const handleDeleteConfirm  = async() => {
        console.log("this line print")
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`)
        console.log("rss",response)
        toast({
            title: response.data.message
        })
        onMessageDelete(message?._id as string)
    } 

    return (
        <Card className='bg-white'>
            <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className=' flex justify-end'>
                        <Button className='border w-10 bg-red-500' variant="destructive">
                            <X className='text-white bg-red-500' />
                        </Button>
                        </div>
                        
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure want to delete this message ?</AlertDialogTitle>
                            <AlertDialogDescription>
                            {message?.content}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription className='text-xl font-bold'>{message?.content}</CardDescription>
                <div>{new Date(message?.createdAt).toLocaleString()}</div>
                </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}

export default MessageCard