"use client"

import { ChevronRight, LayoutDashboard, LogOut, ArrowLeftRight, Bot } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { initializeUser } from "@/redux/features/userSlice"
import { getUserInfoAPI } from "@/services"
import { usePathname, useRouter } from "next/navigation"
import { logoutAPI } from "@/services"
import { useToast } from "@/hooks/use-toast"

export default function Sidebar () {
    const {user, token} = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const {toast} = useToast()
    
    const links = [
        {name: 'Dashboard', link: '/dashboard', icon: LayoutDashboard},
        {name: 'Transaction', link: '/dashboard/transactions', icon: ArrowLeftRight},
        {name: 'Smart Saver', link: '/dashboard/smart-saver', icon: Bot},
    ]

    useEffect(() => {
        if (!user)
            getUserInfoAPI()
                .then(res => {
                    dispatch(initializeUser({user: res.data}))
                })
                .catch(err => {
                    console.log(err)
                })
    }, [user])

    const handleLogout = () => {
        logoutAPI()
            .then(res => {
                console.log(res);
                toast({ description: 'logged out successfully!' })
                router.push('/')
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="w-64 p-3 bg-accent flex flex-col gap-20 h-full">
            <div className="flex flex-col gap-6">
                <h1 className="font-bold text-xl text-accent-foreground">
                    Smart Saver
                </h1>
                {/* Profile */}
                <div className="flex gap-3 items-center text-accent-foreground">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="font-bold">
                        {user?.first_name} {user?.last_name}
                    </p>
                </div>
            </div>
            <nav className="flex flex-col gap-3 text-accent-foreground flex-grow">
                {links.map((link, index) => 
                    <Button asChild variant='ghost' className={`hover:bg-[#242224] ${pathname === link.link && 'bg-primary text-primary-foreground'}`} key={index}>
                        <Link href={link.link} className="flex justify-between items-center">
                            <div>
                                <link.icon className="inline-flex" /> {link.name}
                            </div>
                            <ChevronRight />
                        </Link>
                    </Button>
                )}
            </nav>

            <div className="flex flex-col gap-3 text-accent-foreground">
                <Button variant='ghost' className='hover:bg-[#242224] flex justify-between items-center'
                    onClick={handleLogout}
                >
                    <div>
                        <LogOut className="inline-flex" /> Signout
                    </div>
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )

}