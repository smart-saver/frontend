"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createCategoryAPI, createTransactionAPI, exportTransactionsAPI, getCategoriesAPI, getTransactionsAPI, importTransactionsAPI } from "@/services";
import { ChevronDown, Plus, Search, Check, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
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
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page () {
    const [transactions, setTransaction] = useState([])
    const [importFile, setImportFile] = useState(undefined)
    const isMobile = useMediaQuery('(max-width: 768px)')
    const {toast} = useToast()
    const [open, setOpen] = useState(false)

    const columns = [
        {
            accessorKey: "amount",
            header: "Amount",
            cell: ({row}) => `${formatCurrency(row.original.amount)}`
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({row}) => `${formatDate(row.original.date)}`
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({row}) => <Badge className={row.original.type === 'sell' ? 'border-secondary text-secondary' : 'border-primary text-primary'} variant={'outline'}>
                                 {row.original.type}
                            </Badge>
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({row}) => row.original.category && <Badge variant={'outline'}>
                                 {row.original.category.name}
                            </Badge>
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({row}) => <p className='truncate'>{row.original.description}</p>
        },
    ]

    const fetchTransactions = () => {
        getTransactionsAPI({page: 0})
            .then(res => {
                setTransaction(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const handleExport = () => {
        exportTransactionsAPI()
            .then(res => {
                const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', 'transactions.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast({ title: "Export Successful", description: "Transactions exported successfully!" });
            })
            .catch(err => {
                console.log(err);
                toast({ title: "Export Failed", description: "There was an error exporting transactions.", variant: 'destructive' });
            })
    }

    const handleImport = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv, .xlsx'; // Accept CSV and Excel files
        fileInput.click()
        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await importTransactionsAPI(formData);
                    console.log(response.data);
                    toast({ title: "Import Successful", description: "Transactions imported successfully!" });
                    fetchTransactions()
                } catch (error) {
                    console.error(error);
                    toast({ title: "Import Failed", description: "There was an error importing transactions.", variant: 'destructive' });
                }
            }
        };
    }
    
    return (
        <div className="flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Transactions</h3>
            <p>Breadcrump</p>
            
            <div className="flex justify-between gap-2 ">
                <div className="border rounded-full flex items-center pr-3 ">
                    <Input className='md:w-[300px] rounded-full shadow-none border-0 focus-visible:ring-0 ' placeholder='search' />
                    <Search className="text-gray-400" />
                </div>
                <div className="flex md:gap-3 gap-1">
                {isMobile ?
                    <Drawer open={open} onOpenChange={setOpen}>
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
                                    <TransactionForm fetchTransactions={fetchTransactions} setOpen={setOpen} />
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                    :
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus /> Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Transaction</DialogTitle>
                                <DialogDescription>
                                    <TransactionForm fetchTransactions={fetchTransactions} setOpen={setOpen}  />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                }

                {isMobile ?
                <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size='icon' variant='outline'>
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleExport}>Export</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleImport}>Import</DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
                :
                <>
                    <Button variant='outline' onClick={handleExport}>Export</Button>
                    <Button variant='outline' onClick={handleImport}>Import</Button>
                </>
                }

                </div>
            </div>

            <div className=""> 
                <ScrollArea className='max-h-[600px] overflow-y-auto'>
                    <DataTable columns={columns} data={transactions} />
                </ScrollArea>
            </div>
        </div>
    )
}

const TransactionForm = ({fetchTransactions, setOpen}) => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const {toast} = useToast()
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
        category_id: z.number({
            message: "password must be at least 2 characters.",
          }),
        date: z.date({
            required_error: "A date is required.",
        })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'buy',
            date: Date.now()
        }
    })

    const createCategory = (data) => {
        createCategoryAPI({name: data})
            .then(res => {
                setCategories([...categories, res.data])
                toast({ description: 'category created succesfully' })
            })
            .catch(err => {
                console.log(err);
                toast({ description: 'error in create category', variant: 'destructive' })
            })
    }

    useEffect(() => {
        getCategoriesAPI()
            .then(res => {
                setCategories(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const onSubmit = (data) => {
        createTransactionAPI({...data, date: new Date(data.date)})
            .then(res => {
                toast({ description: 'transaction created succesfully' })
                fetchTransactions()
                setOpen(false)
            })
            .catch(err => {
                console.log(err);
                toast({ description: 'error in transaction category', variant: 'destructive' })
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
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date of transation</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal rounded-sm",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem className="flex flex-col col-span-full">
                        <FormLabel>Category</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between hover:bg-inherit hover:text-inherit rounded-md",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                {field.value
                                    ? categories.find(
                                        (category) => category.id === field.value
                                    )?.name
                                    : "Enter Category"}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput placeholder="create category"
                                    onClick={createCategory}
                                />
                                <CommandList>
                                <CommandEmpty>Empty</CommandEmpty>
                                <CommandGroup>
                                    {categories.map((category) => (
                                    <CommandItem
                                        value={category.name}
                                        key={category.id}
                                        onSelect={() => {
                                            form.setValue("category_id", category.id)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                category.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                        />
                                        {category.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
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