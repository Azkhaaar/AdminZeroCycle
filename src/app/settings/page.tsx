
"use client";

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
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";

const settingsSchema = z.object({
  pointsPerKg: z.coerce.number().positive("Harus berupa angka positif"),
  rupiahPerPoint: z.coerce.number().int().positive("Harus berupa bilangan bulat positif"),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      pointsPerKg: 2,
      rupiahPerPoint: 500,
    },
  });
  
  const {formState} = form;

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    console.log("Menyimpan pengaturan:", values);
    toast({
      title: "Pengaturan Disimpan",
      description: "Konfigurasi poin telah berhasil diperbarui.",
    });
    form.reset(values); // Ini mengatur ulang status 'dirty' dari form
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Pengaturan Sistem
        </h1>
        <p className="text-muted-foreground">
          Konfigurasikan mekanisme inti aplikasi ZeroCycle.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Konfigurasi Sistem Poin</CardTitle>
              <CardDescription>
                Tentukan bagaimana poin diberikan dan nilai tunainya. Perubahan ini
                akan memengaruhi semua pengguna.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="pointsPerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poin per Kilogram (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rupiahPerPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rupiah (Rp) per Poin</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={!formState.isDirty || formState.isSubmitting}>
                {formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
