// @ts-nocheck
"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AttachmentIcon, BubbleChatIcon } from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "Backlog" | "In Progress" | "Done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  progress: number;
  attachments?: number;
  comments?: number;
  users: { name: string; src: string; fallback: string }[];
}

const PRIORITY_VARIANTS: Record<Task["priority"], "destructive" | "secondary" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline"
};

const TASKS: Task[] = [
  {
    id: "1",
    title: "Integrate Stripe payment gateway",
    description: "Set up and configure Stripe API for handling credit card transactions.",
    status: "Backlog",
    priority: "high",
    dueDate: "2024-09-20",
    progress: 10,
    attachments: 2,
    comments: 4,
    users: [
      { name: "Emma", src: "/avatars/01.jpeg", fallback: "EJ" },
      { name: "Daniel", src: "/avatars/02.jpeg", fallback: "DS" }
    ]
  },
  {
    id: "2",
    title: "Redesign marketing homepage",
    description: "Update the homepage with the new brand colors, typography, and hero section.",
    status: "Backlog",
    priority: "medium",
    dueDate: "2024-09-25",
    progress: 0,
    attachments: 1,
    comments: 1,
    users: [
      { name: "Lucas", src: "/avatars/03.jpeg", fallback: "LB" },
      { name: "Sophia", src: "/avatars/04.jpeg", fallback: "SR" }
    ]
  },
  {
    id: "3",
    title: "Set up automated backups",
    description: "Implement daily database backups with secure cloud storage.",
    status: "Backlog",
    priority: "low",
    dueDate: "2024-09-28",
    progress: 5,
    attachments: 0,
    comments: 3,
    users: [
      { name: "Mia", src: "/avatars/05.jpeg", fallback: "MW" },
      { name: "Jack", src: "/avatars/06.jpeg", fallback: "JL" }
    ]
  },
  {
    id: "4",
    title: "Implement blog search functionality",
    description: "Add a search bar to filter blog posts by title and tags.",
    status: "Backlog",
    priority: "medium",
    dueDate: "2024-09-29",
    progress: 0,
    attachments: 1,
    comments: 0,
    users: [
      { name: "Olivia", src: "/avatars/07.jpeg", fallback: "OD" },
      { name: "Henry", src: "/avatars/08.jpeg", fallback: "HT" }
    ]
  },
  {
    id: "5",
    title: "Dark mode toggle implementation",
    description: "Allow users to switch between light and dark themes in settings.",
    status: "In Progress",
    priority: "high",
    dueDate: "2024-09-18",
    progress: 40,
    attachments: 2,
    comments: 6,
    users: [
      { name: "Charlie", src: "/avatars/09.jpeg", fallback: "CW" },
      { name: "Ava", src: "/avatars/10.jpeg", fallback: "AR" }
    ]
  },
  {
    id: "6",
    title: "Database schema refactoring",
    description: "Normalize tables and improve query performance for large datasets.",
    status: "In Progress",
    priority: "medium",
    dueDate: "2024-09-19",
    progress: 55,
    attachments: 3,
    comments: 2,
    users: [
      { name: "Liam", src: "/avatars/11.jpeg", fallback: "LM" },
      { name: "Isabella", src: "/avatars/01.jpeg", fallback: "IN" }
    ]
  },
  {
    id: "7",
    title: "Accessibility improvements",
    description: "Ensure the platform meets WCAG 2.1 AA accessibility standards.",
    status: "In Progress",
    priority: "low",
    dueDate: "2024-09-22",
    progress: 35,
    attachments: 1,
    comments: 1,
    users: [
      { name: "Noah", src: "/avatars/02.jpeg", fallback: "NT" },
      { name: "Ella", src: "/avatars/05.jpeg", fallback: "EL" }
    ]
  },
  {
    id: "8",
    title: "Set up CI/CD pipeline",
    description: "Automate deployment process using GitHub Actions and Vercel.",
    status: "Done",
    priority: "high",
    dueDate: "2024-09-12",
    progress: 100,
    attachments: 2,
    comments: 4,
    users: [
      { name: "Ethan", src: "/avatars/06.jpeg", fallback: "EC" },
      { name: "Grace", src: "/avatars/09.jpeg", fallback: "GR" }
    ]
  },
  {
    id: "9",
    title: "Initial project setup",
    description: "Create project structure, install dependencies, and configure ESLint/Prettier.",
    status: "Done",
    priority: "medium",
    dueDate: "2024-09-10",
    progress: 100,
    attachments: 1,
    comments: 2,
    users: [
      { name: "Harper", src: "/avatars/07.jpeg", fallback: "HL" },
      { name: "Benjamin", src: "/avatars/10.jpeg", fallback: "BM" }
    ]
  }
];

export default function KanbanTableView() {
  return (
    <div className="mx-auto w-full max-w-5xl overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-64">Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignees</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="min-w-32">Progress</TableHead>
            <TableHead className="text-right">Activity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {TASKS.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-muted-foreground mt-0.5 max-w-72 truncate text-xs">
                  {task.description}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant={task.status === "Done" ? "default" : "outline"}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={PRIORITY_VARIANTS[task.priority]} className="capitalize">
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  {task.users.map((user, index) => (
                    <Avatar key={index} className="border-background size-7 border-2">
                      <AvatarImage src={user.src} alt={user.name} />
                      <AvatarFallback className="text-[10px]">{user.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs tabular-nums">
                {task.dueDate}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={task.progress} className="h-1.5 w-16" />
                  <span className="text-xs font-medium tabular-nums">{task.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-muted-foreground flex items-center justify-end gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={AttachmentIcon} className="size-3.5" />
                    <span className="tabular-nums">{task.attachments}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon icon={BubbleChatIcon} className="size-3.5" />
                    <span className="tabular-nums">{task.comments}</span>
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
