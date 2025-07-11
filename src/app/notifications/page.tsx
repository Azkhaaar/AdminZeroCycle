
"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createNotification } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Wand2, MessageSquare, ExternalLink } from "lucide-react";

const notificationSchema = z.object({
  userName: z.string().min(2, "Nama pengguna harus diisi"),
  pickupDate: z.string().min(1, "Tanggal penjemputan harus diisi"),
  pickupTime: z.string().min(1, "Waktu penjemputan harus diisi"),
  wasteType: z.string().min(1, "Jenis sampah harus diisi"),
  wasteAmountKg: z.coerce.number().min(0.1, "Jumlah sampah minimal 0.1 kg"),
  phoneNumber: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Format nomor telepon tidak valid"),
});

export default function NotificationsPage() {
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      userName: "",
      pickupDate: new Date().toISOString().split('T')[0],
      pickupTime: "",
      wasteType: "Campuran",
      wasteAmountKg: 1,
      phoneNumber: "",
    },
  });

  const onSubmit = (values: z.infer<typeof notificationSchema>) => {
    startTransition(async () => {
      const result = await createNotification(values);
      if (result.success) {
        setGeneratedMessage(result.message);
        toast({
          title: "Pesan Dibuat",
          description: "Pesan notifikasi berhasil dibuat.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  const getWhatsAppLink = () => {
    const phone = form.getValues("phoneNumber").replace(/[^0-9]/g, "");
    const text = encodeURIComponent(generatedMessage);
    return `https://wa.me/${phone}?text=${text}`;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Notifikasi WhatsApp Otomatis
        </h1>
        <p className="text-muted-foreground">
          Buat dan kirim notifikasi penjemputan sampah kepada pengguna.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detail Penjemputan</CardTitle>
            <CardDescription>
              Isi formulir untuk membuat notifikasi penjemputan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pengguna</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Budi Santoso" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Pengguna</FormLabel>
                      <FormControl>
                        <Input placeholder="+62..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Penjemputan</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Waktu Penjemputan</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="wasteType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Sampah</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis sampah" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Plastik">Plastik</SelectItem>
                            <SelectItem value="Kertas">Kertas</SelectItem>
                            <SelectItem value="Kaca">Kaca</SelectItem>
                            <SelectItem value="Logam">Logam</SelectItem>
                            <SelectItem value="Campuran">Campuran</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="wasteAmountKg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Buat Pesan
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Pesan Dihasilkan</CardTitle>
            <CardDescription>
              Tinjau pesan yang dibuat sebelum mengirim.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {generatedMessage ? (
              <Textarea
                readOnly
                value={generatedMessage}
                className="h-full resize-none text-base"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-md p-4">
                 <MessageSquare className="w-12 h-12 mb-4"/>
                <p>Pesan yang Anda buat akan muncul di sini.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild disabled={!generatedMessage || isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" /> Kirim via WhatsApp <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
