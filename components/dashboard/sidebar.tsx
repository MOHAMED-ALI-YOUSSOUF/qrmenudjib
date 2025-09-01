'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Home, 
  BookOpen, 
  UtensilsCrossed, 
  QrCode, 
  Settings,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { APP_NAME } from '@/lib/constants';

const routes = [
  { label: 'Tableau de bord', icon: Home, href: '/dashboard' },
  { label: 'Categories', icon: BookOpen, href: '/dashboard/categories' },
  { label: 'Mes Plats', icon: UtensilsCrossed, href: '/dashboard/plats' },
  { label: 'Générer QR Code', icon: QrCode, href: '/dashboard/qrcode' },
  { label: 'Paramètres', icon: Settings, href: '/dashboard/settings' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fermer sidebar automatiquement quand le pathname change (sur petit écran)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, [pathname]);

  // Sur resize → collapse si petit écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    handleResize(); // init au montage
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/auth/signin" });
      
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div
            className={cn(
              "flex items-center transition-opacity duration-300",
              isCollapsed && "opacity-0 w-0 overflow-hidden"
            )}
          >
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h2 className="ml-3 text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              {APP_NAME}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hidden md:flex cursor-pointer"
          >
            {isCollapsed ? (
            
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {routes.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              const button = (
                <Button
                  variant="ghost"
                  className={cn(
                    "cursor-pointer w-full h-11 lg:h-12 text-sm lg:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800  ",
                    isActive &&
                      "bg-orange-50 text-orange-700 hover:bg-orange-50 hover:text-orange-700 dark:bg-orange-950 dark:text-orange-400 dark:hover:bg-orange-950",
                    isCollapsed ? "justify-center px-2" : "justify-start px-3 lg:px-4"
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")}
                  />
                  {!isCollapsed && (
                    <span className="truncate transition-all duration-300">
                      {label}
                    </span>
                  )}
                </Button>
              );

              return isCollapsed ? (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link href={href}>{button}</Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium ">
                    {label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link key={href} href={href}>
                  {button}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 ">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center justify-center w-full transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Se déconnecter
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center justify-start w-full transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                Se déconnecter
              </span>
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
