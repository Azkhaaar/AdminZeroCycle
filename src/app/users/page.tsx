
"use client";

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
import { MoreHorizontal, Ban, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const users = [
  {
    id: "usr_1",
    name: "Ahmad Subarjo",
    email: "ahmad.s@example.com",
    joined: "2023-10-01",
    status: "Active",
  },
  {
    id: "usr_2",
    name: "Budi Santoso",
    email: "budi.s@example.com",
    joined: "2023-11-15",
    status: "Active",
  },
  {
    id: "usr_3",
    name: "Cici Paramida",
    email: "cici.p@example.com",
    joined: "2023-09-20",
    status: "Blocked",
  },
  {
    id: "usr_4",
    name: "Dewi Lestari",
    email: "dewi.l@example.com",
    joined: "2024-01-05",
    status: "Active",
  },
  {
    id: "usr_5",
    name: "Eko Prasetyo",
    email: "eko.p@example.com",
    joined: "2024-02-12",
    status: "Active",
  },
];

export default function UsersPage() {
  const { toast } = useToast();

  const handleBlock = (userId: string) => {
    toast({
      title: "User Blocked",
      description: `User with ID: ${userId} has been blocked.`,
    });
  };

  const handleDelete = (userId: string) => {
    toast({
      title: "User Deleted",
      description: `User with ID: ${userId} has been deleted.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          User Account Management
        </h1>
        <p className="text-muted-foreground">
          View, manage, block, and delete user accounts.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users in the ZeroCycle system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "Active" ? "default" : "destructive"}
                      className={user.status === "Active" ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}
                    >
                      {user.status}
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
                        <DropdownMenuItem onClick={() => handleBlock(user.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          <span>Block User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete User</span>
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
