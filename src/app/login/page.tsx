
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
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid.' }).refine(
    (val) => val === 'zeroadmin@admin.com',
    { message: 'Email tidak terdaftar.' }
  ),
  password: z.string().min(1, { message: 'Kata sandi harus diisi.' }).refine(
    (val) => val === 'AdminZeroCycle',
    { message: 'Kata sandi salah.' }
  ),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    if (values.email === 'zeroadmin@admin.com' && values.password === 'AdminZeroCycle') {
      localStorage.setItem('isAuthenticated', 'true');
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang kembali, Admin!',
      });
      router.push('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Logo className="size-12" />
        </div>
        <CardTitle className="font-headline text-2xl">ZeroCycle Admin Hub</CardTitle>
        <CardDescription>Silakan masuk untuk mengelola sistem.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="zeroadmin@admin.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi</FormLabel>
                   <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                        <span className="sr-only">{showPassword ? 'Sembunyikan' : 'Tampilkan'} kata sandi</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              Masuk
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
         <p className="text-xs text-muted-foreground text-center w-full">
            © {new Date().getFullYear()} ZeroCycle. Dibuat untuk lingkungan.
        </p>
      </CardFooter>
    </Card>
  );
}
