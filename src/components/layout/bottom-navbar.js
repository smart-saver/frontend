"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User2, Mail, Bell, Home } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function BottomNavbar () {

    const pathname = usePathname()
    const navItems = [
        { name: 'خانه', href: '/', icon: Home },
        { name: 'پیشنهاد', href: '/orders', icon: Bell },
        { name: 'پیام', href: '/messages', icon: Mail },
        { name: 'پروفایل', href: '/profile', icon: User2 },
    ]

    const activeIndex = navItems.findIndex((item) => item.href === pathname)
    const [activeItemStyle, setActiveItemStyle] = useState({ width: 0, right: 0 })
    
    // Create refs for all nav items
    const itemRefs = useRef([])

    useEffect(() => {
        // If the active item exists, measure its width and position
        if (itemRefs.current[activeIndex]) {
            const activeItem = itemRefs.current[activeIndex]
            setActiveItemStyle({
                width: activeItem.offsetWidth, // get the active item's width
                left: activeItem.offsetLeft,   // get the active item's position
            })
        }
    }, [activeIndex]) // Run the effect when the active index changes

    return (
        <nav className="fixed bottom-2 left-2 right-2 rounded-full bg-accent text-accent-foreground md:hidden p-2">
            {/* Highlight div */}
            <div
                className="absolute top-auto h-8 bg-white rounded-full shadow transition-all duration-500"
                style={{
                    width: `${activeItemStyle.width}px`, // Set the width dynamically
                    left: `${activeItemStyle.left}px`,   // Set the position dynamically
                }}
            ></div>
            <ul className="flex justify-around">
                {navItems.map((item, index) => (
                    <li key={item.name} className="flex-1">
                        <Link href={item.href} 
                              className="flex items-center gap-1 p-1 px-2 relative z-10 justify-center"
                              ref={(el) => (itemRefs.current[index] = el)} // Save the ref for each item
                        >
                            <item.icon
                                className={`h-6 w-6 ${item.href === pathname && 'fill-[#374151] text-white'}`} 
                            />
                            {item.href === pathname && 
                                <span className="text-sm font-bold text-[#374151]">{item.name}</span>
                            }
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
