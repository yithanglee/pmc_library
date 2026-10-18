"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, BookOpen, Library, Clock, Sparkles, UserPlus } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import Cookies from 'js-cookie'
import { PHX_COOKIE } from '@/lib/constants'
import { usePathname } from 'next/navigation'

export default function Header() {
    const { user } = useAuth();
    const pathname = usePathname();
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

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/'
        return pathname?.startsWith(path)
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white/85 backdrop-blur-md shadow-sm shadow-blue-900/5">
            {/* Fun top accent bar with logo colors */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-700 via-indigo-500 to-red-500" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Brand Identity */}
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-red-50 p-1.5 shadow-sm ring-2 ring-blue-100 transition-all duration-300 group-hover:scale-105 group-hover:ring-red-200 group-hover:rotate-3">
                        <Image
                            src="/pmc_logo.png"
                            alt="Pioneer Methodist Library"
                            width={38}
                            height={38}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-800 via-blue-700 to-red-600 bg-clip-text text-transparent leading-none">
                            PMC Library
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 mt-1 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-red-500" />
                            Community Book Hub
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            isActive('/')
                                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/50'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/books"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            isActive('/books')
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/60'
                        }`}
                    >
                        <BookOpen className={`h-4 w-4 ${isActive('/books') ? 'text-white' : 'text-blue-600'}`} />
                        <span>Browse Books</span>
                    </Link>

                    <div className="h-5 w-[1px] bg-blue-100 mx-2" />

                    {!user ? (
                        <div className="flex items-center gap-2.5">
                            <Link href="/signIn">
                                <Button
                                    variant="ghost"
                                    className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 font-bold text-sm rounded-full px-5"
                                >
                                    Member Login
                                </Button>
                            </Link>
                            <Link href="/signUp">
                                <Button className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md shadow-red-500/20 font-bold text-sm px-5 rounded-full transition-transform hover:scale-105">
                                    <UserPlus className="h-4 w-4 mr-1.5" />
                                    Join Free
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/profile"
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                    isActive('/profile')
                                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/25'
                                        : 'bg-red-50 hover:bg-red-100 text-red-600 ring-1 ring-red-200'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                <span>My Loans & Profile</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Sign Out"
                                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-800 hover:bg-blue-50 rounded-xl">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-white border-blue-100 w-[290px] sm:w-[330px]">
                            <SheetHeader className="text-left border-b border-blue-100 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-50 to-red-50 p-1.5 shadow-sm ring-1 ring-blue-200 flex items-center justify-center">
                                        <Image src="/pmc_logo.png" alt="PMC Library" width={28} height={28} />
                                    </div>
                                    <div>
                                        <SheetTitle className="font-display text-lg font-extrabold bg-gradient-to-r from-blue-800 to-red-600 bg-clip-text text-transparent">
                                            PMC Library
                                        </SheetTitle>
                                        <p className="text-xs font-medium text-slate-500">Community Book Hub</p>
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="flex flex-col justify-between h-[calc(100%-5rem)]">
                                <nav className="space-y-2">
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                                            isActive('/') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Library className="h-4 w-4 text-blue-600" />
                                        <span>Home</span>
                                    </Link>
                                    <Link
                                        href="/books"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                                            isActive('/books') ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <BookOpen className={`h-4 w-4 ${isActive('/books') ? 'text-white' : 'text-blue-600'}`} />
                                        <span>Browse Books</span>
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold ${
                                                isActive('/profile') ? 'bg-red-500 text-white shadow-sm' : 'text-red-600 bg-red-50/60 hover:bg-red-50'
                                            }`}
                                        >
                                            <Clock className="h-4 w-4" />
                                            <span>My Loans & Profile</span>
                                        </Link>
                                    )}
                                </nav>

                                <div className="border-t border-blue-100 pt-4 space-y-2.5">
                                    {!user ? (
                                        <>
                                            <Link href="/signIn" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button variant="outline" className="w-full justify-center border-blue-200 text-blue-700 font-bold rounded-full">
                                                    Member Login
                                                </Button>
                                            </Link>
                                            <Link href="/signUp" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button className="w-full justify-center bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-full">
                                                    Join Library Free
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 font-bold rounded-full"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}