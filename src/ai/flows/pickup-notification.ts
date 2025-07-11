
// pickup-notification.ts
'use server';

/**
 * @fileOverview Menghasilkan pesan WhatsApp untuk notifikasi penjemputan sampah berdasarkan data pengguna dan detail penjemputan.
 *
 * - generatePickupNotification - Fungsi yang menghasilkan pesan WhatsApp.
 * - PickupNotificationInput - Tipe input untuk fungsi generatePickupNotification.
 * - PickupNotificationOutput - Tipe return untuk fungsi generatePickupNotification.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PickupNotificationInputSchema = z.object({
  userName: z.string().describe('Nama pengguna.'),
  pickupDate: z.string().describe('Tanggal penjemputan yang dijadwalkan (YYYY-MM-DD).'),
  pickupTime: z.string().describe('Waktu penjemputan yang dijadwalkan (HH:MM).'),
  wasteType: z.string().describe('Jenis sampah yang akan dijemput (misalnya, plastik, kertas, campuran).'),
  wasteAmountKg: z.number().describe('Jumlah sampah dalam kilogram.'),
  pointsEarned: z.number().describe('Jumlah poin yang didapat dari penjemputan.'),
  currency: z.string().describe('Mata uang yang dapat dikonversi dari poin (misalnya, IDR).'),
  exchangeRate: z.number().describe('Nilai tukar poin ke mata uang (misalnya, 500).'),
  phoneNumber: z.string().describe('Nomor telepon pengguna dengan kode negara.'),
});
export type PickupNotificationInput = z.infer<typeof PickupNotificationInputSchema>;

const PickupNotificationOutputSchema = z.object({
  message: z.string().describe('Pesan WhatsApp yang dihasilkan.'),
});
export type PickupNotificationOutput = z.infer<typeof PickupNotificationOutputSchema>;

export async function generatePickupNotification(input: PickupNotificationInput): Promise<PickupNotificationOutput> {
  return pickupNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pickupNotificationPrompt',
  input: {schema: PickupNotificationInputSchema},
  output: {schema: PickupNotificationOutputSchema},
  prompt: `Yth. {{userName}},

Ini adalah pemberitahuan untuk jadwal penjemputan sampah Anda:

Tanggal: {{pickupDate}}
Waktu: {{pickupTime}}
Jenis Sampah: {{wasteType}}
Jumlah: {{wasteAmountKg}} kg

Anda mendapatkan {{pointsEarned}} poin dari penjemputan ini! Setiap poin bernilai {{exchangeRate}} {{currency}} yang bisa Anda tukarkan menjadi uang tunai melalui aplikasi ZeroCycle.

Terima kasih atas kontribusi Anda untuk lingkungan yang lebih bersih!

Hormat kami,
Tim ZeroCycle`,
});

const pickupNotificationFlow = ai.defineFlow(
  {
    name: 'pickupNotificationFlow',
    inputSchema: PickupNotificationInputSchema,
    outputSchema: PickupNotificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
