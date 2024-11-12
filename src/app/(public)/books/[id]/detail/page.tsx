import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, User, Hash, DollarSign } from 'lucide-react'
import { PHX_ENDPOINT, PHX_HTTP_PROTOCOL } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/ui/header'
async function getBookData(id: string) {
    const res = await fetch(`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/api/webhook?scope=book_data&bi=${id}`)
    if (!res.ok) {
        throw new Error('Failed to fetch book data')
    }
    return res.json()
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
    const unwrappedParams = await params;

    const id = unwrappedParams.id;
    let bookData;
    try {
        bookData = await getBookData(id)
    } catch (error) {
        notFound()
    }

    const { book, author, publisher, book_category, available, code, book_images } = bookData

    return (
        <div>
           
            <div className="container mx-auto p-4 mt-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card className='blur-white'>
                            <CardContent className="p-4">
                                {book_images && book_images.length > 0 ? (
                                    <Image
                                        src={`${PHX_HTTP_PROTOCOL}${PHX_ENDPOINT}/${book_images[0].img_url}`}
                                        alt={`Cover of ${book.title}`}
                                        width={300}
                                        height={400}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                ) : (
                                    <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <Card className='blur-white'>
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
                                <CardDescription className="text-xl">{author.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary">{book_category.name}</Badge>
                                    <Badge variant={available ? "default" : "destructive"}>
                                        {available ? "Available" : "Not Available"}
                                    </Badge>
                                </div>
                                {book.description && (
                                    <p className="text-gray-700 mb-4">{book.description}</p>
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Publisher: {publisher.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Added: {new Date(book.inserted_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Hash className="mr-2 h-4 w-4" />
                                        <span>Call Number: {code}</span>
                                    </div>
                                    {book.isbn && (
                                        <div className="flex items-center">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            <span>ISBN: {book.isbn}</span>
                                        </div>
                                    )}
                                    {book.price > 0 && (
                                        <div className="flex items-center">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            <span>Price: ${book.price.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={!available}>
                                    {available ? "Borrow" : "Not Available"}
                                </Button>
                            </CardFooter>
                        </Card>
                        <Card className="mt-6 blur-white">
                            <CardHeader>
                                <CardTitle>Category Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-lg font-semibold mb-2">{book_category.name}</h3>
                                <p className="text-gray-700 mb-2">{book_category.description}</p>
                                <p className="text-sm text-gray-500">Books in this category: {book_category.book_count}</p>
                            </CardContent>
                        </Card>

                        {author.bio && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>About the Author</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{author.bio}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>


            </div>
        </div>

    )
}