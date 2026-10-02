// @ts-nocheck
"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AttachmentIcon,
  BubbleChatIcon,
  Calendar03Icon,
  ChevronDown,
  Plus
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  description?: string;
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

const GROUPS: { title: string; tasks: Task[] }[] = [
  {
    title: "Backlog",
    tasks: [
      {
        id: "1",
        title: "Integrate Stripe payment gateway",
        description: "Set up and configure Stripe API for handling credit card transactions.",
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
        priority: "medium",
        dueDate: "2024-09-29",
        progress: 0,
        attachments: 1,
        comments: 0,
        users: [
          { name: "Olivia", src: "/avatars/07.jpeg", fallback: "OD" },
          { name: "Henry", src: "/avatars/08.jpeg", fallback: "HT" }
        ]
      }
    ]
  },
  {
    title: "In Progress",
    tasks: [
      {
        id: "5",
        title: "Dark mode toggle implementation",
        description: "Allow users to switch between light and dark themes in settings.",
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
        priority: "low",
        dueDate: "2024-09-22",
        progress: 35,
        attachments: 1,
        comments: 1,
        users: [
          { name: "Noah", src: "/avatars/02.jpeg", fallback: "NT" },
          { name: "Ella", src: "/avatars/05.jpeg", fallback: "EL" }
        ]
      }
    ]
  },
  {
    title: "Done",
    tasks: [
      {
        id: "8",
        title: "Set up CI/CD pipeline",
        description: "Automate deployment process using GitHub Actions and Vercel.",
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
    ]
  }
];

export default function KanbanListView() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {GROUPS.map((group) => (
        <Collapsible key={group.title} defaultOpen className="group/section">
          <div className="flex items-center justify-between gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground -ml-2 h-8 gap-1.5">
                <HugeiconsIcon
                  icon={ChevronDown}
                  className="size-3.5 transition-transform group-data-[state=closed]/section:-rotate-90"
                />
                <span className="text-xs font-semibold tracking-wider uppercase">
                  {group.title}
                </span>
                <Badge variant="secondary" className="rounded-full px-2 tabular-nums">
                  {group.tasks.length}
                </Badge>
              </Button>
            </CollapsibleTrigger>
            <Button variant="ghost" size="icon" className="text-muted-foreground size-8">
              <HugeiconsIcon icon={Plus} />
              <span className="sr-only">Add task to {group.title}</span>
            </Button>
          </div>
          <CollapsibleContent>
            <div className="mt-2 divide-y rounded-xl border">
              {group.tasks.map((task) => (
                <div
                  key={task.id}
                  className="hover:bg-muted/50 flex flex-col gap-3 p-4 transition-colors first:rounded-t-xl last:rounded-b-xl sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      <Badge variant={PRIORITY_VARIANTS[task.priority]} className="capitalize">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {task.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground flex shrink-0 items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                      <span className="tabular-nums">{task.dueDate}</span>
                    </div>
                    <div className="flex w-24 items-center gap-2">
                      <Progress value={task.progress} className="h-1.5" />
                      <span className="text-foreground w-8 text-right font-medium tabular-nums">
                        {task.progress}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={AttachmentIcon} className="size-3.5" />
                      <span className="tabular-nums">{task.attachments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={BubbleChatIcon} className="size-3.5" />
                      <span className="tabular-nums">{task.comments}</span>
                    </div>
                    <div className="flex -space-x-2">
                      {task.users.map((user, index) => (
                        <Avatar key={index} className="border-background size-6 border-2">
                          <AvatarImage src={user.src} alt={user.name} />
                          <AvatarFallback className="text-[10px]">{user.fallback}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
