
"use client";

import { usePathname, useRouter } from 'next/navigation';
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Send,
  Settings,
  CircleHelp,
  LogOut,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/logo";
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                if (pathname !== '/login') {
                    router.replace('/login');
                }
            } else {
                if (pathname === '/login') {
                    router.replace('/dashboard');
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }
    
    // If not logged in and not on the login page, render nothing until redirect happens
    if (!auth.currentUser && pathname !== '/login') {
        return null;
    }

    return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Gagal keluar:", error);
    }
  };

  const showSidebarAndHeader = pathname !== '/login';

  return (
    <html lang="id" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <AuthWrapper>
            {showSidebarAndHeader ? (
              <SidebarProvider>
                <Sidebar>
                  <SidebarHeader>
                    <div className="flex items-center gap-2">
                      <Logo className="size-8" />
                      <span className="text-lg font-semibold font-headline">
                        ZeroCycle
                      </span>
                    </div>
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={{ children: "Dasbor" }}
                          isActive={pathname === '/dashboard'}
                        >
                          <Link href="/dashboard">
                            <LayoutDashboard />
                            Dasbor
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: "Pengguna" }} isActive={pathname === '/users'}>
                          <Link href="/users">
                            <Users />
                            Manajemen Pengguna
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={{ children: "Pengepul" }}
                          isActive={pathname === '/collectors'}
                        >
                          <Link href="/collectors">
                            <MapPin />
                            Lokasi Pengepul
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={{ children: "Notifikasi" }}
                          isActive={pathname === '/notifications'}
                        >
                          <Link href="/notifications">
                            <Send />
                            Notifikasi
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={{ children: "Pengaturan" }}
                          isActive={pathname === '/settings'}
                        >
                          <Link href="/settings">
                            <Settings />
                            Pengaturan
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarContent>
                  <SidebarFooter>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip={{ children: "Bantuan" }}>
                          <CircleHelp />
                          Bantuan & Dukungan
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                       <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                          <LogOut />
                          <span>Keluar</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Avatar className="size-7">
                            <AvatarImage
                              src="https://placehold.co/40x40.png"
                              alt="Admin"
                              data-ai-hint="person portrait"
                            />
                            <AvatarFallback>AD</AvatarFallback>
                          </Avatar>
                          <span>Admin</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarFooter>
                </Sidebar>
                <SidebarInset>
                  <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
                    <SidebarTrigger className="md:hidden" />
                    <div className="flex-1">
                      <h1 className="text-lg font-semibold font-headline">Pusat Admin</h1>
                    </div>
                  </header>
                  <main className="flex-1 p-4 sm:p-6">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            ) : (
               <main className="flex min-h-screen flex-col items-center justify-center p-24">
                {children}
               </main>
            )}
        </AuthWrapper>
        <Toaster />
      </body>
    </html>
  );
}
