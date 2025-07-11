
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
import { Label } from "@/components/ui/label";
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
  userName: z.string().min(2, "User name is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  wasteType: z.string().min(1, "Waste type is required"),
  wasteAmountKg: z.coerce.number().min(0.1, "Waste amount must be at least 0.1 kg"),
  phoneNumber: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
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
      wasteType: "Mixed",
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
          title: "Message Generated",
          description: "Notification message created successfully.",
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
          Automated WhatsApp Notifications
        </h1>
        <p className="text-muted-foreground">
          Generate and send waste pickup notifications to users.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Details</CardTitle>
            <CardDescription>
              Fill in the form to generate a pickup notification.
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
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Budi Santoso" {...field} />
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
                      <FormLabel>User Phone Number</FormLabel>
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
                        <FormLabel>Pickup Date</FormLabel>
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
                        <FormLabel>Pickup Time</FormLabel>
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
                        <FormLabel>Waste Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select waste type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Plastic">Plastic</SelectItem>
                            <SelectItem value="Paper">Paper</SelectItem>
                            <SelectItem value="Glass">Glass</SelectItem>
                            <SelectItem value="Metal">Metal</SelectItem>
                            <SelectItem value="Mixed">Mixed</SelectItem>
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
                        <FormLabel>Amount (kg)</FormLabel>
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
                  Generate Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Generated Message</CardTitle>
            <CardDescription>
              Review the generated message before sending.
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
                <p>Your generated message will appear here.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild disabled={!generatedMessage || isPending} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Send className="mr-2 h-4 w-4" /> Send via WhatsApp <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
