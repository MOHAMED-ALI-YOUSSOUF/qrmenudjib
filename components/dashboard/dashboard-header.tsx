import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Bell } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ThemeToggle } from "../theme-toggle";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function DashboardHeader() {
  const { data: session } = useSession();
  const { data: userData, mutate } = useSWR(
    session?.user?.id ? `/api/user/${session.user.id}` : null,
    fetcher,
    { fallbackData: session?.user }
  );
  const [notifications] = useState(3);

  const handleSignOut = async () => signOut({ callbackUrl: "/auth/signin" });

  return (
    <header className="flex justify-end items-center p-4 border-b bg-white dark:bg-gray-950">
      <div className="flex items-center space-x-2">

        <ThemeToggle/>
        {/* Notifications */}
         <TooltipProvider> 
          <Tooltip> 
            <TooltipTrigger asChild> 
              <Button variant="ghost" size="sm" className="relative h-9 w-9" > 
                <Bell className="h-4 w-4" /> 
                {notifications > 0 && ( <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 min-w-5" > {notifications > 9 ? "9+" : notifications} </Badge> )} 
                <span className="sr-only">Notifications</span> 
                </Button> 
                </TooltipTrigger> 
                <TooltipContent side="bottom"> 
                  <p>Notifications (à implémenter)</p> </TooltipContent> 
                  </Tooltip> 
                  </TooltipProvider>
        

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.image || undefined} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{userData?.name || "Utilisateur"}</p>
                <p className="text-xs text-muted-foreground">{userData?.email || "email@example.com"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/profil" className="flex items-center w-full">
                <User className="mr-2 h-4 w-4" /> Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" /> Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
