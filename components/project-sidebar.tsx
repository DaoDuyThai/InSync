"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Banknote, LayoutDashboard, Star, Check, ChevronsUpDown, Folder, FileClock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import { Loading } from "@/app/scenario/[scenarioId]/_components/loading";
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

export const ProjectSidebar = () => {
    const router = usePathname();
    // TODO: Fetch and display projects

    // Projects ComboBox
    const [open, setOpen] = React.useState(false)
    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites");

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


    // const { organization } = useOrganization();
    // const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    //     orgId: organization?.id,
    // })

    // const portal = useAction(api.stripe.portal)
    // const pay = useAction(api.stripe.pay)
    const [pending, setPending] = React.useState(false);
    // const onClick = async () => {
    //     if (!organization?.id) return
    //     setPending(true)
    //     try {
    //         const action = isSubscribed ? portal : pay
    //         const redirectUrl = await action({
    //             orgId: organization.id,
    //         })
    //         window.location.href = redirectUrl
    //     } catch {
    //         toast.error("Something went wrong")
    //     } finally {
    //         setPending(false)
    //     }
    // }




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
        <div className=" hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image src="/logo.svg" alt="logo" height={60} width={60} />
                    <span className={cn(
                        "font-semibold text-2xl",
                        font.className,
                    )}>INSYNC</span>
                    <Badge variant="secondary">
                        Free
                        {/* TODO: is subscribed */}
                        {/* {isSubscribed ? "Pro" : "Free"} */}
                    </Badge>
                </div>
            </Link>
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


            <div className="space-y-1 w-full">
                <Button variant={(router === '/dashboard') && !favorites ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full">
                    <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Project Scenarios
                    </Link>
                </Button>
                {/* TODO: Add Link to Favorites */}
                <Button variant={favorites ? "secondary" : "ghost"} asChild size="lg" className="font-normal justify-start px-2 w-full">
                    <Link href={{
                        pathname: "/dashboard",
                        query: { favorites: true }
                    }}>
                        <Star className="h-4 w-4 mr-2" /> Favorite Scenarios
                    </Link>
                </Button>
                <Button
                    variant={router === '/assets' ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href="/assets">
                        <Folder className="h-4 w-4 mr-2" /> Project Assets
                    </Link>
                </Button>
                <Button
                    variant={router === '/logs' ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href="/logs">
                        <FileClock className="h-4 w-4 mr-2" /> Project Logs
                    </Link>
                </Button>
                <Button disabled={pending} variant="ghost" size="lg" className="font-normal justify-start px-2 w-full">
                    <Banknote className="h-4 w-4 mr-2" />
                    {/* TODO: Upgrade to Pro */}
                    Upgrade to Pro
                    {/* {isSubscribed ? "Payment Settings" : "Upgrade to Pro"} */}
                </Button>
            </div>
        </div>
    )
}


