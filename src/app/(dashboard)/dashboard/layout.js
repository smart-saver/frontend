import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"
import BottomNavbar from "@/components/layout/bottom-navbar"

export default function Layout ({children}) {

    return (
        <div className="flex min-h-screen justify-between w-full">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-grow flex flex-col gap-3 min-h-screen pb-8">
                <Navbar />

                <div className="md:px-32 flex-grow pb-20 md:pb-0 px-3">
                    {children}
                </div>
            </div>

            <BottomNavbar />
        </div>
    )
}