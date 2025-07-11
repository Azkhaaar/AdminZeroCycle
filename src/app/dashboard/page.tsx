
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Star, Recycle, Send } from "lucide-react";

export default function Dashboard() {
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
            <div className="text-2xl font-bold">4,521</div>
            <p className="text-xs text-muted-foreground">
              +20.1% dari bulan lalu
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
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              +2 lokasi baru minggu ini
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
            <div className="text-2xl font-bold">12,500</div>
            <p className="text-xs text-muted-foreground">
              Setara dengan Rp 6.250.000
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
            <div className="text-2xl font-bold">+8,231 kg</div>
            <p className="text-xs text-muted-foreground">
              +19% dari bulan lalu
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
                  <p className="font-medium">Pengguna baru terdaftar: anisa.rahma@example.com</p>
                  <p className="text-sm text-muted-foreground">2 menit yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-2 rounded-full">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Pengepul baru ditambahkan: "Bank Sampah Godean"</p>
                  <p className="text-sm text-muted-foreground">1 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-2 rounded-full">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Notifikasi penjemputan dikirim ke +628123456789</p>
                  <p className="text-sm text-muted-foreground">3 jam yang lalu</p>
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
