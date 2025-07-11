
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
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, CheckCircle, XCircle, Trash2, KeyRound, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { firestore } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Collector {
    id: string;
    name: string;
    location: string;
    contact: string;
    status: 'Aktif' | 'Tidak Aktif' | 'Menunggu Konfirmasi';
}

export default function CollectorsPage() {
  const { toast } = useToast();
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [pendingCollectors, setPendingCollectors] = useState<Collector[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectorsCollection = collection(firestore, 'collectors');

    const unsubscribe = onSnapshot(collectorsCollection, (snapshot) => {
      const allCollectors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Collector));
      
      const activeAndInactive = allCollectors.filter(c => c.status === 'Aktif' || c.status === 'Tidak Aktif');
      const pending = allCollectors.filter(c => c.status === 'Menunggu Konfirmasi');

      setCollectors(activeAndInactive);
      setPendingCollectors(pending);
      setIsLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data pengepul:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pengepul dari database.",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleUpdateStatus = async (collectorId: string, newStatus: 'Aktif' | 'Tidak Aktif' | 'Ditolak') => {
    const collectorRef = doc(firestore, "collectors", collectorId);
    try {
      if (newStatus === 'Ditolak') {
        await deleteDoc(collectorRef);
        toast({
          title: "Pendaftaran Ditolak",
          description: "Data pendaftar pengepul telah dihapus.",
        });
      } else {
        await updateDoc(collectorRef, { status: newStatus });
        toast({
          title: "Status Pengepul Diperbarui",
          description: `Pengepul telah berhasil ditandai sebagai ${newStatus}.`,
        });
      }
    } catch (error) {
       console.error("Gagal memperbarui status:", error);
       toast({
        title: "Error",
        description: "Gagal memperbarui status pengepul.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (collectorId: string) => {
    try {
      await deleteDoc(doc(firestore, "collectors", collectorId));
      toast({
        title: "Pengepul Dihapus",
        description: `Pengepul telah berhasil dihapus.`,
      });
    } catch (error) {
      console.error("Gagal menghapus pengepul: ", error);
      toast({
        title: "Error",
        description: "Gagal menghapus pengepul.",
        variant: "destructive",
      });
    }
  };

  const renderCollectorTable = (data: Collector[], type: 'active' | 'pending') => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Lokasi</TableHead>
          <TableHead>Kontak</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Tindakan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24">
              {type === 'active' ? 'Belum ada data pengepul.' : 'Tidak ada pendaftar baru.'}
            </TableCell>
          </TableRow>
        ) : (
          data.map((collector) => (
            <TableRow key={collector.id}>
              <TableCell className="font-medium">{collector.name}</TableCell>
              <TableCell>{collector.location}</TableCell>
              <TableCell>{collector.contact}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    collector.status === "Aktif" ? "default" : 
                    collector.status === "Tidak Aktif" ? "secondary" : 
                    "outline"
                  }
                  className={
                    collector.status === "Aktif" ? "bg-green-500/20 text-green-700 border-green-500/30" : 
                    collector.status === "Menunggu Konfirmasi" ? "bg-amber-500/20 text-amber-700 border-amber-500/30" :
                    ""
                  }
                >
                  {collector.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {type === 'pending' ? (
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(collector.id, 'Aktif')}>
                      <CheckCircle className="mr-2 h-4 w-4"/> Setujui
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(collector.id, 'Ditolak')}>
                      <XCircle className="mr-2 h-4 w-4"/> Tolak
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => handleUpdateStatus(collector.id, collector.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif')}>
                          {collector.status === 'Aktif' ? 
                            <Ban className="mr-2 h-4 w-4" /> : 
                            <KeyRound className="mr-2 h-4 w-4" />
                          }
                          <span>{collector.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                        </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(collector.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Manajemen Lokasi Pengepul
        </h1>
        <p className="text-muted-foreground">
          Kelola dan konfirmasi pendaftaran pengepul sampah baru.
        </p>
      </header>
      
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="collectors">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="collectors">Daftar Pengepul</TabsTrigger>
                <TabsTrigger value="pending">
                  Menunggu Konfirmasi 
                  {pendingCollectors.length > 0 && 
                    <Badge className="ml-2 bg-accent text-accent-foreground">{pendingCollectors.length}</Badge>
                  }
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <TabsContent value="collectors">
              <CardHeader className="pt-0">
                <CardTitle>Semua Pengepul</CardTitle>
                <CardDescription>Daftar semua pengepul sampah yang aktif dan tidak aktif di dalam jaringan.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderCollectorTable(collectors, 'active')}
              </CardContent>
            </TabsContent>
            <TabsContent value="pending">
               <CardHeader className="pt-0">
                <CardTitle>Pendaftar Baru</CardTitle>
                <CardDescription>Tinjau dan konfirmasi pendaftaran pengepul baru.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderCollectorTable(pendingCollectors, 'pending')}
              </CardContent>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
}
