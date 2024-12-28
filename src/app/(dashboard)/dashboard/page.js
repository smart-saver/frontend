import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { DollarSign } from "lucide-react";


export default function Page () {
    

    const columns = [
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "amount",
            header: "Amount",
        },
    ]
    
    return (
        <div className="flex flex-col gap-6">
            <h3 className="font-bold text-2xl">Dashboard</h3>
            <p>Breadcrump</p>
            <div className="flex md:flex-row flex-col gap-3 justify-between items-start">
                {Array.from({length: 3}).map((_, index) =>
                    <Card key={index} className='w-full'>
                        <CardContent className='flex justify-between w-full p-6'>
                            <div className="flex flex-col gap-12">
                                <p>Income</p>
                                <p className="font-bold text-2xl">
                                    $2000
                                </p>
                            </div>
                            <div className="bg-primary rounded-full p-3 w-12 h-12">
                                <DollarSign />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className=""> 
                <DataTable columns={columns} data={[]} />
            </div>
        </div>
    )
}