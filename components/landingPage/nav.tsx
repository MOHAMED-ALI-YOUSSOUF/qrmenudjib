// components/Nav.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '../theme-toggle';

export const Nav = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              QRMenu
            </span>
          </div>
          <div className='flex items-center space-x-4'>

         
          <ThemeToggle/>

          {/* Desktop Session / Connexion */}
          <div className="hidden md:flex items-center space-x-4">
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
                  S&apos;inscrire
                </Link>
              </>
            )}

            {status === 'authenticated' && session?.user && (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <div className="flex items-center px-3 py-2 rounded-lg shadow-sm bg-gradient-to-r from-orange-500 to-yellow-500">
                    <User className="h-5 w-5 text-gray-600 mr-2 hidden sm:block" />
                    <span className="text-gray-100 font-medium hidden sm:block">
                      {session.user.name}
                    </span>
                    
                  </div>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span className="hidden sm:block">Déconnexion</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80">
                <SheetHeader>
                  <SheetTitle className='text-2xl font-bold text-center border-b border-gray-200 pb-5'>QRMenu</SheetTitle>
                </SheetHeader>

                <div className="mt-4 flex flex-col gap-4">
                  {status === 'loading' && (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  )}

                  {status === 'unauthenticated' && (
                    <>
                      <Link
                        href="/auth/signin"
                        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 mx-2 py-2 rounded-lg font-medium text-center"
                      >
                        Se connecter
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg font-medium text-center hover:bg-orange-50 mx-2"
                      >
                        S&apos;inscrire
                      </Link>
                    </>
                  )}

                  {status === 'authenticated' && session?.user && (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center space-x-3 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 mx-2"
                      >
                        <Avatar className="h-8 w-8 ">
                          <AvatarImage src={session.user?.image || undefined} />
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {session.user?.name?.charAt(0).toUpperCase() || 'R'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-gray-100 font-medium">
                          {session.user.name}
                        </span>
                      </Link>

                      <button
                        onClick={() =>
                          signOut({ callbackUrl: '/' })
                        }
                        className="flex items-center justify-center bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 mx-2"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Déconnexion
                      </button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
           </div>
        </div>
      </div>
    </motion.nav>
  );
};
