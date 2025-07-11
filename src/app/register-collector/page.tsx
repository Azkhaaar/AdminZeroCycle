
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Loader2, Send } from 'lucide-react';
import { firestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const collectorSchema = z.object({
  name: z.string().min(3, { message: "Nama harus minimal 3 karakter." }),
  location: z.string().min(5, { message: "Lokasi harus minimal 5 karakter." }),
  contact: z.string().regex(/^\+?[0-9\s-]{10,15}$/, { message: "Nomor telepon tidak valid." }),
});

export default function RegisterCollectorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof collectorSchema>>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof collectorSchema>) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, "collectors"), {
        ...values,
        status: "Menunggu Konfirmasi",
      });
      setIsSubmitted(true);
    } catch (error) {
       console.error("Gagal mengirim pendaftaran: ", error);
       toast({
          title: "Error",
          description: "Gagal mengirim formulir pendaftaran. Silakan coba lagi.",
          variant: "destructive",
       });
       setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="flex justify-center items-center mb-4">
                    <Logo className="size-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Pendaftaran Terkirim!</CardTitle>
                <CardDescription>
                    Terima kasih telah mendaftar. Data Anda akan segera kami tinjau.
                    Anda akan mendapatkan notifikasi jika pendaftaran Anda disetujui.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                 <Button className="w-full" onClick={() => router.push('/login')}>Kembali ke Halaman Login</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Logo className="size-12" />
        </div>
        <CardTitle className="font-headline text-2xl">Daftar Sebagai Pengepul</CardTitle>
        <CardDescription>Isi formulir untuk bergabung dengan jaringan ZeroCycle.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Bank Sampah/Pengepul</FormLabel>
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
                  <FormLabel>Alamat/Lokasi</FormLabel>
                  <FormControl>
                    <Input placeholder="cth., Jl. Godean, Sleman, Yogyakarta" {...field} />
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
                  <FormLabel>Nomor Kontak (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input placeholder="+62 812 3456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Kirim Pendaftaran
            </Button>
          </form>
        </Form>
      </CardContent>
       <CardFooter className="flex flex-col gap-4">
         <p className="text-xs text-muted-foreground text-center w-full">
            Sudah punya akun admin? <a href="/login" className="text-primary hover:underline">Masuk di sini</a>.
        </p>
         <p className="text-xs text-muted-foreground text-center w-full">
            © {new Date().getFullYear()} ZeroCycle. Dibuat untuk lingkungan.
        </p>
      </CardFooter>
    </Card>
  );
}

