"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDispatch, useSelector } from 'react-redux';
import { selectProject, clearProject } from '@/store/projectSlice';
import { RootState, AppDispatch } from '@/store/store';
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProModal } from "@/store/use-pro-modal";

type Project = {
    id: string;
    projectName: string;
    description: string | null;
    userId: string;
    displayName: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
    isPublish: boolean | null;
}

type SubscriptionPlan = {
    id: string,
    subscriptionsName: string,
    status: boolean,
    price: number,
    userId: string,
    userIdGuid: string,
    displayName: string,
    content: string,
    dateCreated: string,
    dateUpdated: string | null,
    maxProjects: number,
    maxAssets: number,
    maxScenarios: number,
    maxUsersAccess: number,
    storageLimit: number,
    supportLevel: "standard" | "advanced",
    customFeaturesDescription: string,
    dataRetentionPeriod: number,
    prioritySupport: boolean,
    monthlyReporting: boolean
}

export const ProjectSelector = () => {
    const [openPopOver, setOpenPopOver] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [title, setTitle] = React.useState<string>("Untitled");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [isSubscribed, setIsSubscribed] = React.useState(null);
    const [subscriptionPlans, setSubscriptionPlans] = React.useState<SubscriptionPlan[]>([]);
    const { onOpen } = useProModal();
    const { user, isLoaded } = useUser();
    const selectedProject = useSelector((state: RootState) => state.project.selectedProject);
    const dispatch = useDispatch<AppDispatch>();

    const fetchProjects = async () => {
        if (user && isLoaded) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/project-user-clerk-is-publish/${user.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                        }
                    }
                );
                const data = await response.json();
                if (data?.data?.length > 0) {
                    // Sort projects by dateCreated in descending order, treating dateCreated as a string
                    const sortedProjects = data.data.sort((a: Project, b: Project) =>
                        new Date(b.dateCreated ?? "").getTime() - new Date(a.dateCreated ?? "").getTime()
                    );
                    setProjects(sortedProjects); // Adjust according to the API response structure
                    const storedProjectId = localStorage.getItem("selectedProjectId");
                    if (storedProjectId && !sortedProjects.find((project: Project) => project.id === storedProjectId)) {
                        dispatch(clearProject());
                        localStorage.removeItem("selectedProjectId");
                    }
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
    }

    const fetchSubscriptionPlans = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptionplans/pagination`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (!response.ok) throw new Error("Failed to fetch subscription plans");
            const data = await response.json();
            setSubscriptionPlans(data.data);
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
        }
    };

    const fetchIsSubscribed = async () => {
        try {
            if (!user) {
                return;
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/usersubscriptions/check-non-expired/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (!response.ok) {
                console.error('Failed to fetch subscription status');
                return
            }
            const data = await response.json();
            setIsSubscribed(data.isSubscribed);
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }

    React.useEffect(() => {
        fetchProjects();
    }, [user, isLoaded, dispatch]);

    React.useEffect(() => {
        fetchSubscriptionPlans();
        fetchIsSubscribed();
    }, [user, isLoaded]);


    // Load selected project from localStorage when component mounts
    React.useEffect(() => {
        const storedProjectId = localStorage.getItem("selectedProjectId");
        if (storedProjectId) {
            dispatch(selectProject(storedProjectId)); // Load project into Redux
        }
    }, [dispatch]);

    // Save selected project to Redux and localStorage
    const handleSelectProject = (currentValue: string) => {
        const newValue = currentValue === selectedProject ? "" : currentValue;
        if (newValue) {
            dispatch(selectProject(newValue));
            localStorage.setItem("selectedProjectId", newValue);
        } else {
            dispatch(clearProject());
            localStorage.removeItem("selectedProjectId");
        }
        setOpenPopOver(false);
    };

    const createProject = async (title: string) => {
        if (user && isLoaded) {
            const body = {
                projectName: title,
                userIdClerk: user.id,
                description: "Project added on " + new Date().toLocaleString(),
                isPublish: true,
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/byuserclerk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                console.log(data);
                // console.log(response)
                if (response.status === 200) {
                    toast.success(data.message);
                } else {
                    toast.error(data.title);
                }

                setProjects([...projects]);
            } catch (error) {
                console.error("Error creating project:", error);
            } finally {
                fetchProjects();
            }
        }
    }

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (!subscriptionPlans)
                throw new Error("Subscription plans not loaded");
            if (!isSubscribed && projects.length >= subscriptionPlans[0].maxProjects) {
                onOpen();
                return;
            } else if (isSubscribed && projects.length >= subscriptionPlans[1].maxProjects) {
                toast.error("You have reached the maximum number of projects allowed for your subscription plan. Contact Admin to upgrade your plan.");
                return;
            } else {
                await createProject(title);
            }
        } catch (error) {
            console.error("Failed to create scenario." + error);
        } finally {
            setIsLoading(false);
            setOpenDialog(false);
        }
    };

    return (
        <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openPopOver} className="w-[186px] justify-between">
                    {
                        selectedProject
                            ? projects && projects.length > 0
                                ? projects.find((project) => project.id === selectedProject)?.projectName
                                : "Select Project"
                            : "Select Project..."
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[186px] p-0">
                <Command>
                    <CommandInput placeholder="Search Project..." />
                    <CommandList>
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                            {projects.map((project) => (
                                <CommandItem
                                    key={project.id}
                                    value={project.projectName + project.id + project.description}
                                    onSelect={() => handleSelectProject(project.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedProject === project.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {project.projectName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    {projects.length === 0 ? null : (
                        <CommandItem>
                            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" size={"sm"} variant={"default"}>
                                        New Project
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
                        </CommandItem>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    )
}