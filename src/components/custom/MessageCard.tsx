'use client'
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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

const MessageCard = ({key,message,onMessageDelete} :MessageProps) => {
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
        <Card>
            <CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <X className='w-5 h-5' />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
                <CardDescription>{message?.content}</CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    )
}

export default MessageCard