"use client"

import { useState } from 'react'
import { logOut, useAuth } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, User, LogOut, BookOpen } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import Cookies from 'js-cookie'
import { PHX_COOKIE } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export default function Header() {
    const { user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);


    const handleSignOut = async () => {
        try {
            await signOut(auth)

            Cookies.remove(PHX_COOKIE)
            setIsOpen(false);
            window.location.href = "/"
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }
    const NavItems = () => (
        <>
            <li>
                <Link href="/books" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                    <BookOpen className="h-5 w-5 mr-2" />
                    <span>Books</span>
                </Link>
            </li>
            {!user && (
                <li>
                    <Link href="/signIn" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <User className="h-5 w-5 mr-2" />
                        <span>Sign In</span>
                    </Link>
                </li>
            )}
            {user && (
                <>
                    <li>
                        <Link href="/profile" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <User className="h-5 w-5 mr-2" />
                            <span className="md:hidden">Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Button
                            variant="ghost"
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors p-0"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            <span className="md:hidden">Log Out</span>
                        </Button>
                    </li>
                </>
            )}
        </>
    );

    return (
        <header className="">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-4">
                    <Image
                        src="/pmc_logo.png"
                        alt="Pioneer Methodist Library"
                        width={40}
                        height={40}
                    />
                    <h1 className="text-2xl font-bold text-blue-800 ">PMC Library</h1>
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex space-x-6 items-center">
                        <NavItems />
                    </ul>
                </nav>
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col h-full">
                                <nav className="flex-grow">
                                    <ul className="space-y-4">
                                        <NavItems />
                                    </ul>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}