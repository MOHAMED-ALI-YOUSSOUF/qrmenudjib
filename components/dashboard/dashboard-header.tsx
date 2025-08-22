'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Bell, 
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sidebar } from '@/components/dashboard/sidebar';


export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40"
    >
      <div className="h-full px-6 flex items-center justify-end space-x-3">

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 relative"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
            3
          </Badge>
        </Button> */}

        {/* Help */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HelpCircle className="h-5 w-5" />
        </Button> */}

        {/* User Menu */}
        {session ? (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user?.image || ''} />
              <AvatarFallback>{session.user?.name?.charAt(0) || "?"}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-xl"
            >
              Déconnexion
            </Button>
          </div>
        ) : (
          <Link href="/auth/signin">
            <Button 
              variant="outline" 
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800 rounded-xl"
            >
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </motion.header>
  );
}