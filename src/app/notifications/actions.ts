
"use server";

import { generatePickupNotification, type PickupNotificationInput } from '@/ai/flows/pickup-notification';
import { z } from 'zod';

const NotificationActionInputSchema = z.object({
  userName: z.string(),
  pickupDate: z.string(),
  pickupTime: z.string(),
  wasteType: z.string(),
  wasteAmountKg: z.number(),
  phoneNumber: z.string(),
});

export async function createNotification(data: z.infer<typeof NotificationActionInputSchema>) {
  try {
    const pointsPerKg = 2;
    const exchangeRate = 500;
    const currency = 'IDR';

    const pointsEarned = data.wasteAmountKg * pointsPerKg;

    const input: PickupNotificationInput = {
      ...data,
      pointsEarned,
      exchangeRate,
      currency,
    };
    
    const result = await generatePickupNotification(input);
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Error generating notification:", error);
    return { success: false, message: 'Failed to generate notification message.' };
  }
}
