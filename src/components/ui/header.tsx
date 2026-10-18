"use client"

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useLanguage } from '@/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, BookOpen, Library, Clock, UserPlus, Globe, ExternalLink } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebaseConfig'
import Cookies from 'js-cookie'
import { PHX_COOKIE } from '@/lib/constants'
import { usePathname } from 'next/navigation'

export default function Header() {
    const { user } = useAuth();
    const { lang, toggleLang, t } = useLanguage();
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
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
            {/* Subtle top light-blue accent line matching pioneercommunity.org.my */}
            <div className="h-0.5 w-full bg-[#00bff2]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Minimalist Brand Identity matching pioneercommunity.org.my */}
                <Link href="/" className="flex items-center gap-3.5 group">
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 p-1.5 border border-slate-200/80 transition-all duration-200 group-hover:border-[#00bff2]">
                        <Image
                            src="/pmc_logo.png"
                            alt="卫理公会宣道堂图书馆 Pioneer Methodist Library"
                            width={34}
                            height={34}
                            className="object-contain"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-800 group-hover:text-[#0097bf] transition-colors leading-tight">
                            {t('卫理公会宣道堂 • 图书馆', 'PMC Library')}
                        </span>
                        <span className="text-[11px] font-medium tracking-wider text-[#0097bf] mt-0.5">
                            {t('Pioneer Methodist Community Library', '实兆远甘文阁卫理公会宣道堂')}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1.5">
                    <Link
                        href="/"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isActive('/')
                                ? 'text-[#0097bf] bg-sky-50/80 font-semibold'
                                : 'text-slate-600 hover:text-[#00bff2] hover:bg-slate-50'
                        }`}
                    >
                        {t('主页', 'Home')}
                    </Link>
                    <Link
                        href="/books"
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            isActive('/books')
                                ? 'text-[#0097bf] bg-sky-50/80 font-semibold'
                                : 'text-slate-600 hover:text-[#00bff2] hover:bg-slate-50'
                        }`}
                    >
                        <BookOpen className="h-4 w-4 text-[#00bff2]" />
                        <span>{t('图书馆检索', 'Browse Books')}</span>
                    </Link>
                    <a
                        href="https://pioneercommunity.org.my/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-[#00bff2] hover:bg-slate-50 transition-colors"
                    >
                        <span>{t('宣道堂官网', 'Church Site')}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>

                    <div className="h-5 w-[1px] bg-slate-200 mx-2" />

                    {/* Language Switcher Pill */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleLang}
                        className="rounded-full border-slate-200 bg-white text-slate-700 hover:border-[#00bff2] hover:text-[#0097bf] hover:bg-sky-50/40 font-medium text-xs h-9 px-3 gap-1.5 shadow-none"
                        title={t('Switch to English', '切换至中文')}
                    >
                        <Globe className="h-3.5 w-3.5 text-[#00bff2]" />
                        <span>{lang === 'zh' ? 'EN' : '中文'}</span>
                    </Button>

                    {!user ? (
                        <div className="flex items-center gap-2 ml-1">
                            <Link href="/signIn">
                                <Button
                                    variant="ghost"
                                    className="text-slate-700 hover:text-[#0097bf] hover:bg-sky-50/50 font-medium text-sm rounded-full px-4"
                                >
                                    {t('会友登录', 'Member Login')}
                                </Button>
                            </Link>
                            <Link href="/signUp">
                                <Button className="bg-[#00bff2] hover:bg-[#0097bf] text-white shadow-sm font-semibold text-sm px-5 rounded-full transition-colors">
                                    <UserPlus className="h-4 w-4 mr-1.5" />
                                    {t('注册借阅', 'Join Free')}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 ml-1">
                            <Link
                                href="/profile"
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    isActive('/profile')
                                        ? 'bg-[#00bff2] text-white shadow-sm'
                                        : 'bg-sky-50 hover:bg-sky-100/80 text-[#0097bf] border border-sky-200/70'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                <span>{t('会友借阅特区', 'My Loans')}</span>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                title={t('退出登录', 'Sign Out')}
                                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
                                onClick={handleSignOut}
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Mobile Navigation */}
                <div className="flex items-center gap-2 md:hidden">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={toggleLang}
                        className="rounded-full border-slate-200 bg-white text-slate-700 font-medium text-xs h-8 px-2.5 gap-1 shadow-none"
                    >
                        <Globe className="h-3 w-3 text-[#00bff2]" />
                        <span>{lang === 'zh' ? 'EN' : '中文'}</span>
                    </Button>

                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 rounded-xl">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-white border-slate-200 w-[290px] sm:w-[330px]">
                            <SheetHeader className="text-left border-b border-slate-100 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 p-1.5 border border-slate-200 flex items-center justify-center">
                                        <Image src="/pmc_logo.png" alt="PMC Library" width={28} height={28} />
                                    </div>
                                    <div>
                                        <SheetTitle className="font-display text-base font-bold text-slate-800">
                                            {t('卫理公会宣道堂 • 图书馆', 'PMC Library')}
                                        </SheetTitle>
                                        <p className="text-xs font-medium text-[#0097bf]">
                                            {t('线上阅读 • 教会图书馆', 'Community Book Hub')}
                                        </p>
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="flex flex-col justify-between h-[calc(100%-5rem)]">
                                <nav className="space-y-1.5">
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                                            isActive('/') ? 'bg-sky-50 text-[#0097bf] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <Library className="h-4 w-4 text-[#00bff2]" />
                                        <span>{t('主页', 'Home')}</span>
                                    </Link>
                                    <Link
                                        href="/books"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                                            isActive('/books') ? 'bg-sky-50 text-[#0097bf] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <BookOpen className="h-4 w-4 text-[#00bff2]" />
                                        <span>{t('图书馆检索', 'Browse Books')}</span>
                                    </Link>
                                    {user && (
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                                                isActive('/profile') ? 'bg-[#00bff2] text-white font-semibold' : 'text-[#0097bf] bg-sky-50/60 hover:bg-sky-50'
                                            }`}
                                        >
                                            <Clock className="h-4 w-4" />
                                            <span>{t('会友借阅特区', 'My Loans & Profile')}</span>
                                        </Link>
                                    )}
                                    <a
                                        href="https://pioneercommunity.org.my/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                                    >
                                        <span>{t('返回宣道堂官网', 'Pioneer Church Website')}</span>
                                        <ExternalLink className="h-4 w-4 text-slate-400" />
                                    </a>
                                </nav>

                                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                                    {!user ? (
                                        <>
                                            <Link href="/signIn" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button variant="outline" className="w-full justify-center border-slate-200 text-slate-700 font-medium rounded-full">
                                                    {t('会友登录', 'Member Login')}
                                                </Button>
                                            </Link>
                                            <Link href="/signUp" onClick={() => setIsOpen(false)} className="block w-full">
                                                <Button className="w-full justify-center bg-[#00bff2] hover:bg-[#0097bf] text-white font-semibold rounded-full">
                                                    {t('注册借阅账号', 'Join Library Free')}
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center text-slate-600 border-slate-200 hover:bg-slate-50 font-medium rounded-full"
                                            onClick={handleSignOut}
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            {t('退出登录', 'Sign Out')}
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