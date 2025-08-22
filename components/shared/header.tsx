'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Header() {
  const { data: session, status } = useSession()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="w-full bg-gradient-to-br from-orange-50 to-red-50 shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Nom */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          🍽️ QR Menu DJ
        </Link>

        {/* Navigation principale */}
        <nav className="hidden md:flex items-center space-x-4">
          {status === 'loading' ? (
            <>
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </>
          ) : (
            navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))
          )}
        </nav>

        {/* Session / Connexion */}
        <div className="flex items-center space-x-4">
          {status === 'loading' && (
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          )}

          {status === 'unauthenticated' && (
            <>
              <Link
                href="/auth/signin"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                S'inscrire
              </Link>
            </>
          )}

          {status === 'authenticated' && session?.user && (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
              <div className="flex items-center bg-white/80 backdrop-blur-xl px-3 py-2 rounded-lg shadow-sm">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-800 font-medium">{session.user.name}</span>
              </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
