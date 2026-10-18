"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, BookOpen, Library, Sparkles, Clock } from 'lucide-react'
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
        <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#FDFBF7]/90 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Brand Identity */}
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-stone-200/80 transition-transform duration-200 group-hover:scale-105">
                        <Image
                            src="/pmc_logo.png"
                            alt="Pioneer Methodist Library"
                            width={36}
                            height={36}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl font-bold tracking-tight text-stone-900 leading-none">
                            PMC Library
                        </span>
                        <span className="text-[11px] font-medium uppercase tracking-widest text-rose-800/80 mt-1">
                            Community Book Catalogue
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/')
                                ? 'bg-stone-200/60 text-stone-900'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/books"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/books')
                                ? 'bg-rose-900/10 text-rose-900 font-semibold'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                        }`}
                    >
                        <BookOpen className="h-4 w-4 text-rose-800" />
                        <span>Browse Catalogue</span>
                    </Link>

                    <div className="h-5 w-[1px] bg-stone-200 mx-2" />

                    {!user ? (
                        <div className="flex items-center gap-2.5">
                            <Link href="/signIn">
                                <Button variant="ghost" className="text-stone-700 hover:text-stone-900 hover:bg-stone-100 font-medium text-sm">
                                    Member Sign In
                                </Button>
                            </Link>
                            <Link href="/signUp">
                                <Button className="bg-rose-900 hover:bg-rose-800 text-white shadow-sm font-medium text-sm px-4 rounded-lg">
                                    Join Library
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/profile"
                                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive('/profile')
                                        ? 'bg-rose-900 text-white shadow-sm'
                                        : 'bg-stone-100 hover:bg-stone-200/70 text-stone-800'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                <span>My Loans & Profile</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                title="Sign Out"
                                className="text-stone-500 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
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
                            <Button variant="ghost" size="icon" className="text-stone-700 hover:bg-stone-100">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#FDFBF7] border-stone-200 w-[280px] sm:w-[320px]">
                            <SheetHeader className="text-left border-b border-stone-200/80 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-lg bg-white p-1 shadow-sm ring-1 ring-stone-200 flex items-center justify-center">
                                        <Image src="/pmc_logo.png" alt="PMC Library" width={28} height={28} />
                                    </div>
                                    <div>
                                        <SheetTitle className="font-serif text-lg font-bold text-stone-900">
                                            PMC Library
                                        </SheetTitle>
                                        <p className="text-xs text-stone-500">Community Catalogue</p>
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="flex flex-col justify-between h-[calc(100%-5rem)]">
                                <nav className="space-y-1.5">
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                                            isActive('/') ? 'bg-stone-200/70 text-stone-900' : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <Library className="h-4 w-4 text-stone-500" />
                                        <span>Home</span>
                                    </Link>
                                    <Link
                                        href="/books"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                                            isActive('/books') ? 'bg-rose-900/10 text-rose-900 font-semibold' : 'text-stone-600 hover:bg-stone-100'
                                        }`}
                                    >
                                        <BookOpen className="h-4 w-4 text-rose-800" />
                                        <span>Browse Catalogue</span>
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                                                isActive('/profile') ? 'bg-rose-900/10 text-rose-900 font-semibold' : 'text-stone-600 hover:bg-stone-100'
                                            }`}
                                        >
                                            <Clock className="h-4 w-4 text-rose-800" />
                                            <span>My Loans & Profile</span>
                                        </Link>
                                    )}
                                </nav>

                                <div className="border-t border-stone-200/80 pt-4 space-y-2.5">
                                    {!user ? (
                                        <>
                                            <Link href="/signIn" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button variant="outline" className="w-full justify-center border-stone-300 text-stone-800">
                                                    Member Sign In
                                                </Button>
                                            </Link>
                                            <Link href="/signUp" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button className="w-full justify-center bg-rose-900 hover:bg-rose-800 text-white">
                                                    Become a Member
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center text-rose-800 border-rose-200 hover:bg-rose-50"
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