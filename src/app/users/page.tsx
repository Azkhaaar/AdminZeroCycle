
"use client";

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
import { MoreHorizontal, Ban, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const users = [
  {
    id: "usr_1",
    name: "Anisa Rahmawati",
    email: "anisa.r@example.com",
    joined: "2023-10-01",
    status: "Aktif",
  },
  {
    id: "usr_2",
    name: "Bagus Setiawan",
    email: "bagus.s@example.com",
    joined: "2023-11-15",
    status: "Aktif",
  },
  {
    id: "usr_3",
    name: "Citra Dewi",
    email: "citra.d@example.com",
    joined: "2023-09-20",
    status: "Diblokir",
  },
  {
    id: "usr_4",
    name: "Dian Nugroho",
    email: "dian.n@example.com",
    joined: "2024-01-05",
    status: "Aktif",
  },
  {
    id: "usr_5",
    name: "Eka Prasetya",
    email: "eka.p@example.com",
    joined: "2024-02-12",
    status: "Aktif",
  },
];

export default function UsersPage() {
  const { toast } = useToast();

  const handleBlock = (userId: string) => {
    toast({
      title: "Pengguna Diblokir",
      description: `Pengguna dengan ID: ${userId} telah diblokir.`,
    });
  };

  const handleDelete = (userId: string) => {
    toast({
      title: "Pengguna Dihapus",
      description: `Pengguna dengan ID: ${userId} telah dihapus.`,
      variant: "destructive",
    });
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joined}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
