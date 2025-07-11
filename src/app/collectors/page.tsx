
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const collectors = [
  {
    id: "col_1",
    name: "Pengepul Berkah",
    location: "Jakarta Selatan",
    status: "Active",
  },
  {
    id: "col_2",
    name: "Sampah Jadi Emas",
    location: "Surabaya",
    status: "Active",
  },
  {
    id: "col_3",
    name: "Gudang Daur Ulang",
    location: "Bandung",
    status: "Inactive",
  },
  {
    id: "col_4",
    name: "CV. Rejeki Plastik",
    location: "Medan",
    status: "Active",
  },
];

const collectorSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  location: z.string().min(5, { message: "Location must be at least 5 characters." }),
  contact: z.string().regex(/^\+?[0-9\s-]{10,15}$/, { message: "Invalid phone number." }),
});

export default function CollectorsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof collectorSchema>>({
    resolver: zodResolver(collectorSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
    },
  });

  const handleDelete = (collectorId: string) => {
    toast({
      title: "Collector Removed",
      description: `Collector with ID: ${collectorId} has been removed.`,
      variant: "destructive",
    });
  };
  
  const onSubmit = (values: z.infer<typeof collectorSchema>) => {
    console.log(values);
    toast({
      title: "Collector Added",
      description: `New collector "${values.name}" has been added successfully.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Collector Location Management
        </h1>
        <p className="text-muted-foreground">
          Add, remove, and manage waste collector locations.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Collectors</CardTitle>
            <CardDescription>A list of all waste collectors in the network.</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Collector
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-headline">Add New Collector</DialogTitle>
                <DialogDescription>
                  Enter the details for the new waste collector.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collector Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Pengepul Berkah" {...field} />
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
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jakarta Selatan" {...field} />
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
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+62 812 3456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Collector</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collectors.map((collector) => (
                <TableRow key={collector.id}>
                  <TableCell className="font-medium">{collector.name}</TableCell>
                  <TableCell>{collector.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={collector.status === "Active" ? "default" : "secondary"}
                       className={collector.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                    >
                      {collector.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDelete(collector.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remove</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
