"use client";

import * as React from "react"
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Banknote, LayoutDashboard, Star,Check, ChevronsUpDown, Folder } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export const ProjectSidebar = () => {
    // Projects ComboBox
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")


    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites");

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

    return (
        <div className=" hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image src="/logo.svg" alt="logo" height={60} width={60} />
                    <span className={cn(
                        "font-semibold text-2xl",
                        font.className,
                    )}>MemoZ</span>
                    <Badge variant="secondary">
                        Free
                        {/* TODO: is subscribed */}
                        {/* {isSubscribed ? "Pro" : "Free"} */}
                    </Badge>
                </div>
            </Link>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[186px] justify-between"
                    >
                        {value
                            ? projects.find((project) => project.value === value)?.label
                            : "Select Project..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[186px] p-0">
                    <Command>
                        <CommandInput placeholder="Search Project..." />
                        <CommandList>
                            <CommandEmpty>No framework found.</CommandEmpty>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.value}
                                        value={project.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === project.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {project.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />

                        <CommandItem>
                            <Button className="w-full" size={"sm"} variant={"default"}>
                                New Project
                            </Button>
                        </CommandItem>
                    </Command>
                </PopoverContent>
            </Popover>


            <div className="space-y-1 w-full">
                <Button variant={favorites ? "ghost" : "secondary"} asChild size="lg" className="font-normal justify-start px-2 w-full">
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
                {/* TODO: Add Link to Assets */}
                <Button variant={"ghost"} asChild size="lg" className="font-normal justify-start px-2 w-full">
                    <Link href="/assets">
                        <Folder className="h-4 w-4 mr-2" /> Project Assets
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

const projects = [
    {
        value: "project-1",
        label: "Project 1",
    },
    {
        value: "project-2",
        label: "Project 2",
    },
    {
        value: "project-3",
        label: "Project 3",
    },
    {
        value: "project-4",
        label: "Project 4",
    },
    {
        value: "project-5",
        label: "Project 5",
    },
    {
        value: "project-6",
        label: "Project 6",
    },
    {
        value: "project-7",
        label: "Project 7",
    },
]