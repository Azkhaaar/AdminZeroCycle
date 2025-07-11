
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Star, Recycle, Send } from "lucide-react";
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [userCount, setUserCount] = useState(0);
  const [collectorCount, setCollectorCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const usersCollection = await getDocs(collection(firestore, 'users'));
        setUserCount(usersCollection.size);

        const collectorsCollection = await getDocs(collection(firestore, 'collectors'));
        setCollectorCount(collectorsCollection.size);
      } catch (error) {
        console.error("Error fetching counts: ", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Ringkasan Dasbor
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, Admin! Berikut adalah ringkasan aktivitas ZeroCycle.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengguna
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">
              Pengguna terdaftar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lokasi Pengepul
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectorCount}</div>
            <p className="text-xs text-muted-foreground">
              Pengepul dalam jaringan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Poin Diberikan (Hari Ini)
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Belum ada transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sampah Didaur Ulang (kg)
            </CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 kg</div>
            <p className="text-xs text-muted-foreground">
               Belum ada setoran
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Aktivitas Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-2 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Tidak ada aktivitas baru</p>
                  <p className="text-sm text-muted-foreground">Data aktivitas akan muncul di sini</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Status Sistem</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p>Otentikasi Pengguna</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-muted-foreground">Beroperasi</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p>Database Pengepul</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-muted-foreground">Beroperasi</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p>Layanan Notifikasi (AI)</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm text-muted-foreground">Beroperasi</p>
              </div>
            </div>
             <div className="flex items-center justify-between">
              <p>Gerbang Pembayaran</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <p className="text-sm text-muted-foreground">Performa Menurun</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
