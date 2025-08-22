// components/dashboard/sidebar.tsx - Sidebar component
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  UtensilsCrossed, 
  QrCode, 
  Settings, 
  LogOut, 
  ChevronLeft,
  User
} from 'lucide-react';

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const routes = [
    { label: 'Tableau de bord', icon: Home, href: '/dashboard', active: pathname === '/dashboard' },
    { label: 'Mes Menus', icon: BookOpen, href: '/dashboard/menus', active: pathname === '/dashboard/menus' },
    { label: 'Ajouter un Plat', icon: UtensilsCrossed, href: '/dashboard/plats', active: pathname === '/dashboard/plats' },
    { label: 'Générer QR Code', icon: QrCode, href: '/dashboard/qrcode', active: pathname === '/dashboard/qrcode' },
    { label: 'Paramètres', icon: Settings, href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
  ];

  const sidebarVariants = { expanded: { width: 280 }, collapsed: { width: 80 } };
  const contentVariants = { expanded: { paddingLeft: 280 }, collapsed: { paddingLeft: 80 } };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
        <aside className="w-64 bg-white/90 backdrop-blur-xl shadow-lg p-6 space-y-6">
          <Skeleton className="h-10 w-40 rounded-md" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </aside>
        <main className="flex-1 p-6 space-y-4">
          <Skeleton className="h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-6 w-1/4 rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Accès Restreint</h2>
          <p className="text-gray-600 mb-6">
            Connectez-vous pour accéder à votre tableau de bord
          </p>
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl h-12 font-medium"
            onClick={() => window.location.href = '/auth/signin'}
          >
            Se connecter
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-white/90 backdrop-blur-xl shadow-lg border-r border-white/20 z-50"
      >
        <div className="p-4 border-b border-gray-100/50 flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold">QR Menu DJ</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center p-3 rounded-xl text-sm font-medium transition-all",
                  route.active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && route.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100/50">
          <button 
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            className="flex items-center p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-all"
          >
            <LogOut className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
            {!isCollapsed && "Déconnexion"}
          </button>
        </div>
      </motion.aside>

      <motion.main
        variants={contentVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-screen p-6"
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}