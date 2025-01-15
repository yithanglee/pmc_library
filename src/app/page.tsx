'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book, Users, UserPlus } from 'lucide-react'
import Header from '@/components/ui/header'

export default function CommunityLibrary() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="" >
      <Header></Header>
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">PMC Library</h2>
          <p className="text-xl text-blue-600 font-bold">Discover, Learn, and Connect with Us</p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { title: "Discover Books", description: "Explore a wide range of books across different categories, curated to foster your love for reading.", icon: Book, color: "blue" },
            { title: "Community Resource Hub", description: "A welcoming space for everyone to come, read, and engage with a variety of resources.", icon: Users, color: "blue" },
            { title: "Become a Member", description: "Register as a member to track your loans and gain access to exclusive library features.", icon: UserPlus, color: "blue" },
          ].map((card, index) => (
            <Link href="/books" key={index}>
              <div

                className={`blur-white p-6 rounded-lg shadow-lg transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <card.icon className={`w-12 h-12 ${card.color === 'blue' ? 'text-blue-500' : 'text-red-500'} mb-4`} />
                <h3 className={`text-xl font-semibold ${card.color === 'blue' ? 'text-blue-800' : 'text-red-800'} mb-2`}>{card.title}</h3>
                <p className={card.color === 'blue' ? 'text-gray-600' : 'text-red-600'}>{card.description}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer className="bg-gradient-to-r from-blue-800 to-red-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="mb-8">Get started with your library journey and unlock a world of knowledge.</p>
          <Link href="/signUp" className="p-3 rounded bg-white text-blue-800 hover:bg-red-100 transition-colors">
            Register / Login
          </Link>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .${isLoaded ? 'translate-y-0' : ''} {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}