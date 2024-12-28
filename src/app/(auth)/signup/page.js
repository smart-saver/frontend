"use client"

import { Earth, Github } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFormContext } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { loginAPI, signupAPI } from "@/services";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";

export default function Page () {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const {toast} = useToast()
    const formSchema = z.object({
        email: z.string().min(2, {
          message: "email must be at least 2 characters.",
        }),
        first_name: z.string().min(2, {
            message: "first_name must be at least 2 characters.",
          }),
        last_name: z.string().min(2, {
            message: "last_name must be at least 2 characters.",
          }),
        username: z.string().min(2, {
            message: "username must be at least 2 characters.",
          }),
        password: z.string().min(2, {
            message: "password must be at least 2 characters.",
          }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = (data) => {
        setLoading(true)
        signupAPI(data)
            .then(res  => {
                toast({
                    title: "Signed up successfully!",
                    description: new Date().toISOString(),
                })
                router.push('/dashboard')
            })
            .catch(err => {
                toast({
                    title: err.response.data.error,
                    description: new Date().toLocaleString(),
                    variant: 'destructive'
                })
            })
            .finally(() => setLoading(false))
    }

    return (
        <div className="grid grid-cols-2 h-screen"> 
            <div className="bg-accent text-accent-foreground h-full w-full md:flex justify-center items-center flex-col gap-3 py-6 hidden">
                <div className="flex items-center justify-center flex-grow">
                    <h1 className="font-extrabold text-6xl">Smart Saver</h1>
                </div>
                <div className="flex gap-4 border-t pt-2 px-6 text-accent-foreground">
                    <Link href='https://github/sajjadkiani' className=" hover:text-primary">
                        <Github className="" />
                    </Link>
                    <Link href='https://www.sajadkiyani.ir/'  className=" hover:text-primary">
                        <Earth className="" />
                    </Link>
                </div>
            </div>
            <div className="flex justify-center items-center md:p-20 p-6 col-span-full md:col-span-1">
                <Card>
                    <CardContent className='flex flex-col items-center justify-center gap-5 p-8 md:w-[380px] '>
                        <h3 className="font-bold text-xl">Signup</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your first name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your last name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your Username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type='password' placeholder="Enter your password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                />
                                <p className="text-sm font-extralight text-gray-500">Are you have an account? 

                                    <Link className="text-secondary" href={'/login'}>login</Link>
                                </p>
                                <div className="w-full">
                                    <Button loading={loading} className='w-full' type="submit">Submit</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}