
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ban, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { firestore } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  joined: { seconds: number; nanoseconds: number; } | string;
  status: 'Aktif' | 'Diblokir';
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const usersCollection = collection(firestore, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data pengguna:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pengguna dari database.",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleBlock = (userId: string) => {
    toast({
      title: "Fungsi Belum Tersedia",
      description: `Fungsi untuk memblokir pengguna dengan ID: ${userId} akan segera hadir.`,
    });
  };

  const handleDelete = (userId: string) => {
    toast({
      title: "Fungsi Belum Tersedia",
      description: `Fungsi untuk menghapus pengguna dengan ID: ${userId} akan segera hadir.`,
      variant: "destructive",
    });
  };

  const formatDate = (date: { seconds: number; nanoseconds: number; } | string) => {
    if (typeof date === 'string') {
        return date;
    }
    if (date && date.seconds) {
        return format(new Date(date.seconds * 1000), 'yyyy-MM-dd');
    }
    return 'Tanggal tidak valid';
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Manajemen Akun Pengguna
        </h1>
        <p className="text-muted-foreground">
          Lihat, kelola, blokir, dan hapus akun pengguna.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Semua Pengguna</CardTitle>
          <CardDescription>Daftar semua pengguna yang terdaftar di sistem ZeroCycle.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Belum ada data pengguna.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.joined)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status === "Aktif" ? "default" : "destructive"}
                          className={user.status === "Aktif" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleBlock(user.id)}>
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Blokir Pengguna</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Hapus Pengguna</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
