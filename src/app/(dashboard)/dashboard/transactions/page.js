"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { createTransactionAPI, getTransactionsAPI } from "@/services";
import { DollarSign, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import useMediaQuery from "@/hooks/use-media-query";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";

export default function Page () {
    const [transactions, setTransaction] = useState([])
    const isMobile = useMediaQuery('(max-width: 768px)')

    const columns = [
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({row}) => `${formatCurrency(row.original.amount)}`
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => <Badge className={row.original.type === 'sell' ? 'border-secondary text-secondary' : 'border-primary text-primary'} variant={'outline'}>
                                 {row.original.type}
                            </Badge>
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => <p className='truncate'>{row.original.description}</p>
        },
    ]

    useEffect(() => {
        getTransactionsAPI({page: 0})
            .then(res => {
                setTransaction(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    
    return (
        <div className="flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Transactions</h3>
            <p>Breadcrump</p>
            
            <div className="flex justify-between ">
                <div className="border rounded-full flex items-center pr-3 ">
                    <Input className='md:w-[300px] rounded-full shadow-none border-0 focus-visible:ring-0 ' placeholder='search' />
                    <Search className="text-gray-400" />
                </div>
                {isMobile ?
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button size='icon'>
                                <Plus />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                                <DrawerHeader>
                                    <DrawerTitle>Add Transaction</DrawerTitle>
                                    <DrawerDescription>add your daily transactions</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4">
                                    <TransactionForm />
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                    :
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus /> Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Transaction</DialogTitle>
                                <DialogDescription>
                                    <TransactionForm />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }
            </div>

            <div className=""> 
                <DataTable columns={columns} data={transactions} />
            </div>
        </div>
    )
}

const TransactionForm = () => {
    const [loading, setLoading] = useState(false)
    const formSchema = z.object({
        amount: z.string().min(2, {
          message: "email must be at least 2 characters.",
        }),
        type: z.string().min(2, {
            message: "password must be at least 2 characters.",
        }),
        description: z.string().min(2, {
            message: "password must be at least 2 characters.",
          }),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'buy'
        }
    })

    const onSubmit = (data) => {
        createTransactionAPI(data)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your amount" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Enter Transaction Type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sell">Sale</SelectItem>
                                    <SelectItem value="buy">Buy</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter your description" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                />
                <div className="w-full">
                    <Button loading={loading} className='w-full' type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}