
"use client";

import React, { useState } from "react";
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
import { MoreHorizontal, Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const collectors = [
  {
    id: "col_1",
    name: "Bank Sampah Godean",
    location: "Godean, Sleman",
    status: "Aktif",
  },
  {
    id: "col_2",
    name: "Pengepul Maju Jaya",
    location: "Kotagede, Yogyakarta",
    status: "Aktif",
  },
  {
    id: "col_3",
    name: "Gudang Daur Ulang Bantul",
    location: "Bantul, Bantul",
    status: "Tidak Aktif",
  },
  {
    id: "col_4",
    name: "CV. Rejeki Depok",
    location: "Depok, Sleman",
    status: "Aktif",
  },
];

const collectorSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter." }),
  location: z.string().min(5, { message: "Lokasi harus minimal 5 karakter." }),
  contact: z.string().regex(/^\+?[0-9\s-]{10,15}$/, { message: "Nomor telepon tidak valid." }),
});

export default function CollectorsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof collectorSchema>>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
    },
  });

  const handleDelete = (collectorId: string) => {
    toast({
      title: "Pengepul Dihapus",
      description: `Pengepul dengan ID: ${collectorId} telah dihapus.`,
      variant: "destructive",
    });
  };
  
  const onSubmit = (values: z.infer<typeof collectorSchema>) => {
    console.log(values);
    toast({
      title: "Pengepul Ditambahkan",
      description: `Pengepul baru "${values.name}" telah berhasil ditambahkan.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Manajemen Lokasi Pengepul
        </h1>
        <p className="text-muted-foreground">
          Tambah, hapus, dan kelola lokasi pengepul sampah.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Semua Pengepul</CardTitle>
            <CardDescription>Daftar semua pengepul sampah di dalam jaringan.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Pengepul
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Tambah Pengepul Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail untuk pengepul sampah yang baru.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Pengepul</FormLabel>
                        <FormControl>
                          <Input placeholder="cth., Bank Sampah Godean" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lokasi</FormLabel>
                        <FormControl>
                          <Input placeholder="cth., Godean, Sleman" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Kontak</FormLabel>
                        <FormControl>
                          <Input placeholder="+62 812 3456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Simpan Pengepul</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell className="font-medium">{collector.name}</TableCell>
                  <TableCell>{collector.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={collector.status === "Aktif" ? "default" : "secondary"}
                       className={collector.status === "Aktif" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                    >
                      {collector.status}
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
                        <DropdownMenuItem
                          onClick={() => handleDelete(collector.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
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
