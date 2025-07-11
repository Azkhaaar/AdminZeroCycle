// pickup-notification.ts
'use server';

/**
 * @fileOverview Generates a WhatsApp message for waste pickup notifications based on user data and pickup details.
 *
 * - generatePickupNotification - A function that generates the WhatsApp message.
 * - PickupNotificationInput - The input type for the generatePickupNotification function.
 * - PickupNotificationOutput - The return type for the generatePickupNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PickupNotificationInputSchema = z.object({
  userName: z.string().describe('The name of the user.'),
  pickupDate: z.string().describe('The date of the scheduled pickup (YYYY-MM-DD).'),
  pickupTime: z.string().describe('The time of the scheduled pickup (HH:MM).'),
  wasteType: z.string().describe('The type of waste to be picked up (e.g., plastic, paper, mixed).'),
  wasteAmountKg: z.number().describe('The amount of waste in kilograms.'),
  pointsEarned: z.number().describe('The number of points earned for the pickup.'),
  currency: z.string().describe('The currency which points can be converted to (e.g. IDR).'),
  exchangeRate: z.number().describe('The exchange rate of points to currency (e.g., 500).'),
  phoneNumber: z.string().describe('The phone number of the user with country code.'),
});
export type PickupNotificationInput = z.infer<typeof PickupNotificationInputSchema>;

const PickupNotificationOutputSchema = z.object({
  message: z.string().describe('The generated WhatsApp message.'),
});
export type PickupNotificationOutput = z.infer<typeof PickupNotificationOutputSchema>;

export async function generatePickupNotification(input: PickupNotificationInput): Promise<PickupNotificationOutput> {
  return pickupNotificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pickupNotificationPrompt',
  input: {schema: PickupNotificationInputSchema},
  output: {schema: PickupNotificationOutputSchema},
  prompt: `Dear {{userName}},

This is a notification for your scheduled waste pickup:

Date: {{pickupDate}}
Time: {{pickupTime}}
Waste Type: {{wasteType}}
Amount: {{wasteAmountKg}} kg

You have earned {{pointsEarned}} points for this pickup! Each point is worth {{exchangeRate}} {{currency}} which you can convert into cash via the ZeroCycle app.

Thank you for contributing to a cleaner environment!

Sincerely,
The ZeroCycle Team`,
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
