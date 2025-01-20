"use client"

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { chatBotAPI } from "@/services";
import { Loader2, Send } from "lucide-react";
import {useState} from 'react'
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import ReactMarkdown from 'react-markdown';

export default function Page () {
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState(undefined)
    const form = useForm()

    const onSubmit = (data) => {
        setLoading(true)
        chatBotAPI(data)
            .then(res => {
                setResponse(res.data.response)
                form.reset()
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false)
            })
    }
    
    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h3 className="font-bold text-2xl">Smart Saver</h3>
                <p className="text-gray-400">
                    ask ai about your transactions
                </p>
            </div>

            <div className='grow flex flex-col gap-10 md:px-20'>
                <div className='grow border p-10 rounded-md'>
                    <div className='flex flex-col gap-4'>
                        <p className={`font-bold ${loading && 'animate-pulse'}`}>AI Response:</p>
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                </div>

                <div className=''>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 justify-between items-center border rounded-md px-3">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className='grow'>
                                        <FormControl>
                                            <Textarea placeholder='ask about your transactions' className='border-0 shadow-none focus-visible:ring-0'  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                            />

                            <Button size='icon' disabled={loading}>
                                {loading ? 
                                    <Loader2 className='animate-spin' />
                                    :
                                    <Send />
                                }
                            </Button> 
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}