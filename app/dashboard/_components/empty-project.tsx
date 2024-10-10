"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";

export const EmptyProject = () => {
    const { user, isLoaded } = useUser();
    const [isProjectCreated, setIsProjectCreated] = useState(false); // Track if project is created

    const createProject = async () => {
        if (user && isLoaded) {
            const body = {
                projectName: "Untitled",
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
                    setIsProjectCreated(true); // Set state to true after successful creation
                } else {
                    toast.error(data.title);
                }
            } catch (error) {
                console.error("Error creating project:", error);
            }
        }
    };

    // If project is created, you can return null or render another component
    if (isProjectCreated) {
        return null; // Or replace this with another component (e.g., project dashboard)
    }

    return (
        <div className="h-full flex flex-col items-center justify-center ">
            <Image src="/elements.svg" alt="empty" height={200} width={200} />
            <h2 className="text-2xl font-semibold mt-6">Welcome to InSync</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Create a Project to get started
            </p>
            <div className="mt-6">
                <Button size="lg" onClick={createProject}>
                    Create Project
                </Button>
            </div>
        </div>
    );
};
