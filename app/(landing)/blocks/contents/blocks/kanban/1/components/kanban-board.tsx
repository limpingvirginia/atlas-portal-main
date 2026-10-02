"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DragDropVerticalIcon,
  AttachmentIcon,
  BubbleChatIcon,
  Calendar03Icon,
  PlusSignCircleIcon
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import * as Kanban from "./kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  progress: number;
  attachments?: number;
  comments?: number;
  users: TaskUser[];
}

interface TaskUser {
  name: string;
  src: string;
  alt?: string;
  fallback?: string;
}

export default function KanbanBoard() {
  const [columns, setColumns] = React.useState<Record<string, Task[]>>({
    backlog: [
      {
        id: "1",
        title: "Integrate Stripe payment gateway",
        description: "Set up and configure Stripe API for handling credit card transactions.",
        priority: "high",
        assignee: "Emma Johnson",
        dueDate: "2024-09-20",
        users: [
          {
            name: "Emma",
            src: "/avatars/01.jpeg",
            alt: "Emma Avatar",
            fallback: "EJ"
          },
          {
            name: "Daniel",
            src: "/avatars/02.jpeg",
            alt: "Daniel Avatar",
            fallback: "DS"
          }
        ],
        progress: 10,
        attachments: 2,
        comments: 4
      },
      {
        id: "2",
        title: "Redesign marketing homepage",
        description: "Update the homepage with the new brand colors, typography, and hero section.",
        priority: "medium",
        assignee: "Lucas Brown",
        dueDate: "2024-09-25",
        users: [
          {
            name: "Lucas",
            src: "/avatars/03.jpeg",
            alt: "Lucas Avatar",
            fallback: "LB"
          },
          {
            name: "Sophia",
            src: "/avatars/04.jpeg",
            alt: "Sophia Avatar",
            fallback: "SR"
          }
        ],
        progress: 0,
        attachments: 1,
        comments: 1
      },
      {
        id: "3",
        title: "Set up automated backups",
        description: "Implement daily database backups with secure cloud storage.",
        priority: "low",
        assignee: "Mia Williams",
        dueDate: "2024-09-28",
        users: [
          {
            name: "Mia",
            src: "/avatars/05.jpeg",
            alt: "Mia Avatar",
            fallback: "MW"
          },
          {
            name: "Jack",
            src: "/avatars/06.jpeg",
            alt: "Jack Avatar",
            fallback: "JL"
          }
        ],
        progress: 5,
        attachments: 0,
        comments: 3
      },
      {
        id: "4",
        title: "Implement blog search functionality",
        description: "Add a search bar to filter blog posts by title and tags.",
        priority: "medium",
        assignee: "Olivia Davis",
        dueDate: "2024-09-29",
        users: [
          {
            name: "Olivia",
            src: "/avatars/07.jpeg",
            alt: "Olivia Avatar",
            fallback: "OD"
          },
          {
            name: "Henry",
            src: "/avatars/08.jpeg",
            alt: "Henry Avatar",
            fallback: "HT"
          }
        ],
        progress: 0,
        attachments: 1,
        comments: 0
      }
    ],
    inProgress: [
      {
        id: "5",
        title: "Dark mode toggle implementation",
        description: "Allow users to switch between light and dark themes in settings.",
        priority: "high",
        assignee: "Charlie Wilson",
        dueDate: "2024-09-18",
        users: [
          {
            name: "Charlie",
            src: "/avatars/09.jpeg",
            alt: "Charlie Avatar",
            fallback: "CW"
          },
          {
            name: "Ava",
            src: "/avatars/10.jpeg",
            alt: "Ava Avatar",
            fallback: "AR"
          }
        ],
        progress: 40,
        attachments: 2,
        comments: 6
      },
      {
        id: "6",
        title: "Database schema refactoring",
        description: "Normalize tables and improve query performance for large datasets.",
        priority: "medium",
        assignee: "Liam Martinez",
        dueDate: "2024-09-19",
        users: [
          {
            name: "Liam",
            src: "/avatars/11.jpeg",
            alt: "Liam Avatar",
            fallback: "LM"
          },
          {
            name: "Isabella",
            src: "/avatars/01.jpeg",
            alt: "Isabella Avatar",
            fallback: "IN"
          }
        ],
        progress: 55,
        attachments: 3,
        comments: 2
      },
      {
        id: "7",
        title: "Accessibility improvements",
        description: "Ensure the platform meets WCAG 2.1 AA accessibility standards.",
        priority: "low",
        assignee: "Noah Taylor",
        dueDate: "2024-09-22",
        users: [
          {
            name: "Noah",
            src: "/avatars/02.jpeg",
            alt: "Noah Avatar",
            fallback: "NT"
          },
          {
            name: "Ella",
            src: "/avatars/05.jpeg",
            alt: "Ella Avatar",
            fallback: "EL"
          }
        ],
        progress: 35,
        attachments: 1,
        comments: 1
      }
    ],
    done: [
      {
        id: "8",
        title: "Set up CI/CD pipeline",
        description: "Automate deployment process using GitHub Actions and Vercel.",
        priority: "high",
        assignee: "Ethan Clark",
        dueDate: "2024-09-12",
        users: [
          {
            name: "Ethan",
            src: "/avatars/06.jpeg",
            alt: "Ethan Avatar",
            fallback: "EC"
          },
          {
            name: "Grace",
            src: "/avatars/09.jpeg",
            alt: "Grace Avatar",
            fallback: "GR"
          }
        ],
        progress: 100,
        attachments: 2,
        comments: 4
      },
      {
        id: "9",
        title: "Initial project setup",
        description:
          "Create project structure, install dependencies, and configure ESLint/Prettier.",
        priority: "medium",
        assignee: "Harper Lewis",
        dueDate: "2024-09-10",
        users: [
          {
            name: "Harper",
            src: "/avatars/07.jpeg",
            alt: "Harper Avatar",
            fallback: "HL"
          },
          {
            name: "Benjamin",
            src: "/avatars/10.jpeg",
            alt: "Benjamin Avatar",
            fallback: "BM"
          }
        ],
        progress: 100,
        attachments: 1,
        comments: 2
      }
    ]
  });

  const [columnTitles, setColumnTitles] = React.useState<Record<string, string>>({
    backlog: "Backlog",
    inProgress: "In Progress",
    done: "Done"
  });

  function addColumn() {
    const id = `col-${Date.now()}`; // unique id
    setColumns((prev) => ({
      ...prev,
      [id]: [] // empty task list
    }));
    setColumnTitles((prev) => ({
      ...prev,
      [id]: `New Column ${Object.keys(prev).length + 1}`
    }));
  }

  const PRIORITY_STYLES: Record<Task["priority"], string> = {
    high: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400",
    low: "bg-blue-100 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400"
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <Button onClick={addColumn} className="rounded-full">
          + Add Column
        </Button>
      </div>
      <Kanban.Root value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <Kanban.Board className="flex w-full gap-4 overflow-x-auto pb-4">
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <Kanban.Column key={columnValue} value={columnValue} className="min-w-[340px]">
              <div className="flex items-center justify-between gap-2 py-0.5 pl-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {columnTitles[columnValue]}
                  </span>
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700 tabular-nums dark:bg-orange-400/10 dark:text-orange-400">
                    {tasks.length}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Kanban.ColumnHandle asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground size-8 rounded-full"
                    >
                      <HugeiconsIcon icon={DragDropVerticalIcon} className="size-4" />
                    </Button>
                  </Kanban.ColumnHandle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground size-8 rounded-full">
                        <HugeiconsIcon icon={PlusSignCircleIcon} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Task</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 p-0.5">
                {tasks.map((task) => (
                  <Kanban.Item key={task.id} value={task.id} asHandle asChild>
                    <CardContent className="rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[13px] leading-snug font-medium">{task.title}</p>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize",
                            PRIORITY_STYLES[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                        {task.description}
                      </p>
                      <div className="mt-3 space-y-3">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
                            <span className="tabular-nums">{task.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full border border-orange-200 bg-orange-100/60 dark:border-orange-400/30 dark:bg-orange-400/10">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${task.progress}%`,
                                  backgroundImage:
                                    "repeating-linear-gradient(135deg, #f97316, #f97316 4px, #fb923c 4px, #fb923c 7px)"
                                }}
                              />
                            </div>
                            <span className="text-foreground text-[11px] font-medium tabular-nums">
                              {task.progress}%
                            </span>
                          </div>
                        </div>

                        <div className="text-muted-foreground flex items-center justify-between border-t border-dashed pt-2.5 text-xs">
                          <div className="flex -space-x-2 overflow-hidden">
                            {task.users.map((user, index) => (
                              <Avatar key={index} className="border-card size-7 border-2">
                                <AvatarImage src={user.src || "/avatars/08.jpeg"} alt={user.alt} />
                                <AvatarFallback>{user.fallback}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon icon={AttachmentIcon} className="size-3.5" />
                              <span className="tabular-nums">{task.attachments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <HugeiconsIcon icon={BubbleChatIcon} className="size-3.5" />
                              <span className="tabular-nums">{task.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Kanban.Item>
                ))}
              </div>
            </Kanban.Column>
          ))}
        </Kanban.Board>
        <Kanban.Overlay>
          <div className="size-full rounded-xl bg-orange-500/10" />
        </Kanban.Overlay>
      </Kanban.Root>
    </div>
  );
}
