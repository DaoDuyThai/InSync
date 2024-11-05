"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import React, { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const EmptyProject = () => {
    const { user, isLoaded } = useUser();
    const [openDialog, setOpenDialog] = React.useState(false)
    const [title, setTitle] = React.useState<string>("Untitled");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const createProject = async (title: string) => {
        if (user && isLoaded) {
            const body = {
                projectName: title,
                userIdClerk: user.id,
                description: "Project added on " + new Date().toLocaleString(),
                isPublish: true,
            };
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/byuserclerk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                if (response.status === 200) {
                    toast.success(data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(data.title);
                }
            } catch (error) {
                console.error("Error creating project:", error);
            }
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createProject(title);
        } catch (error) {
            console.error("Failed to create scenario.");
        } finally {
            setIsLoading(false);
            setOpenDialog(false);
        }
    };



    return (
        <div className="h-full flex flex-col items-center justify-center md-overflow-y-auto">
            <Image src="/elements.svg" alt="empty" height={200} width={200} />
            <h2 className="text-2xl font-semibold mt-6">Welcome to InSync</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Create a Project to get started
            </p>
            <div className="mt-6">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button size="lg">
                            Create Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" >
                        <DialogHeader>
                            <DialogTitle>Create Project</DialogTitle>
                            <DialogDescription>
                                Enter title for this Project.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <Input
                                required
                                maxLength={18}
                                minLength={5}
                                placeholder="Enter project title"
                                // value={title} // Pre-filled with the current title
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Submit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
};
