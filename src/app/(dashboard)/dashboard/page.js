"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { formatCurrency } from "@/lib/utils";
import { getTransactionsAPI } from "@/services";
import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar } from "recharts";

export default function Page () {
    const [transactions, setTransaction] = useState([])
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

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        desktop: {
          label: "Desktop",
          color: "#2563eb",
        },
        mobile: {
          label: "Mobile",
          color: "#60a5fa",
        },
    }

    useEffect(() => {
        getTransactionsAPI({page: 0, page_size: 5})
            .then(res => {
                setTransaction(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    
    return (
        <div className="flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Dashboard</h3>
            <p>Breadcrump</p>
            <div className="flex md:flex-row flex-col gap-3 justify-between items-start">
                {Array.from({length: 4}).map((_, index) =>
                    <Card key={index} className='w-full'>
                        <CardContent className='flex justify-between w-full p-6'>
                            <div className="flex flex-col gap-12">
                                <p>Income</p>
                                <p className="font-bold text-2xl">
                                    {formatCurrency(2000)}
                                </p>
                            </div>
                            <div className="bg-primary rounded-full p-3 w-12 h-12">
                                <DollarSign />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <Card>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}