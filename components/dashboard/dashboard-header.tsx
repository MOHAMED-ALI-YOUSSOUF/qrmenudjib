'use client';

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Moon,
  Sun,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import Link from "next/link";

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function DashboardHeader({ onMobileMenuToggle, isMobileMenuOpen }: DashboardHeaderProps) {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(3);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/signin" });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (status === "loading") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-9 md:hidden" />
            <div className="hidden md:flex items-center space-x-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-9 w-64" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          
         
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9"
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 min-w-5"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || undefined} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                    {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name || 'Utilisateur'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || 'email@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      
    </header>
  );
}