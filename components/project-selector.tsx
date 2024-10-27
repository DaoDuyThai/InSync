"use client";

import * as React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";

import { useDispatch, useSelector } from 'react-redux';
import { selectProject, clearProject } from '@/store/projectSlice';
import { RootState, AppDispatch } from '@/store/store';

import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";



const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface Project {
    id: string;
    projectName: string;
    description: string | null;
    userId: string;
    displayName: string | null;
    dateCreated: string | null;
    dateUpdated: string | null;
    isPublish: boolean | null;
}

export const ProjectSelector = () => {
    // TODO: Fetch and display projects

    // Projects ComboBox
    const [open, setOpen] = React.useState(false)

    // Get the current project from Redux
    const selectedProject = useSelector((state: RootState) => state.project.selectedProject);
    const dispatch = useDispatch<AppDispatch>();

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
        setOpen(false);
    };

    const { user, isLoaded } = useUser();

    const [projects, setProjects] = React.useState<Project[]>([]);

    // Fetch projects when user is loaded
    React.useEffect(() => {
        if (user && isLoaded) {
            const fetchProjects = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/project-user-clerk-is-publish/${user.id}`);
                    const data = await response.json();
                    setProjects(data.data); // Adjust according to the structure of the API response
                    const storedProjectId = localStorage.getItem("selectedProjectId");
                    if (storedProjectId && !projects.find((project) => project.id === storedProjectId)) {
                        dispatch(clearProject());
                        localStorage.removeItem("selectedProjectId");
                    }
                } catch (error) {
                    console.error("Error fetching projects:", error);
                }
            };
            fetchProjects();
        }
    }, [user, isLoaded, projects]);

    // console.log(projects);

    const createProject = async () => {
        if (user && isLoaded) {
            const body = {
                projectName: "Untitled",
                userIdClerk: user.id,
                description: "Project added on " + new Date().toLocaleString(),
                isPublish: true,
            }
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/projects/byuserclerk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });
                const data = await response.json();
                // console.log(data);
                // console.log(response)
                if (response.status === 200) {
                    toast.success(data.message);
                } else {
                    toast.error(data.title);
                }

                setProjects([...projects]);
            } catch (error) {
                console.error("Error creating project:", error);
            }
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-[186px] justify-between">
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
                    <CommandItem>
                        <Button onClick={createProject} className="w-full" size={"sm"} variant={"default"}>
                            New Project
                        </Button>
                    </CommandItem>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


