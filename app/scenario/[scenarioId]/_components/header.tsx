"use client"

import { Button } from "@/components/ui/button"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { ArrowRight, File, Lightbulb, Loader, MoreHorizontal, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react"
import { Poppins } from "next/font/google"
import { Badge } from "@/components/ui/badge"
import { Actions } from "@/components/actions"

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    id: string;
    title: string;
}

export const Header = ({
    id,
    title,
}: HeaderProps) => {
    const [isSubscribed, setIsSubscribed] = React.useState(null);

    const { user, isLoaded } = useUser();

    const checkIsSubscribed = async () => {
        try {
            if (!user) {

                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/usersubscriptions/check-non-expired/${user.id}`,
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
        checkIsSubscribed();
    }, [user, isLoaded]);


    return (
        <header className="border-b-2 border-slate-200 px-4 sticky top-0 bg-white z-10 h-16 flex justify-between items-center ">
            <div className="h-full flex">
                <Link href="/dashboard">
                    <div className="flex items-center gap-x-2">
                        <Image priority src="/logo.svg" alt="logo" height={60} width={60} />
                        <span className={cn(
                            "font-semibold text-2xl",
                            font.className,
                        )}>INSYNC</span>
                        {isSubscribed === null ? null : (
                            <Badge variant={isSubscribed ? "secondaryGold" : "secondary"}>
                                {isSubscribed ? "Pro" : "Free"}
                            </Badge>
                        )}
                    </div>
                </Link>
            </div>

            <h1 className="underline hidden md:block">
                {title}
            </h1>


            <div className="flex justify-end gap-5">
                <NavigationMenu className="hidden md:inline-flex ">
                    <NavigationMenuList className="gap-5">
                        <NavigationMenuItem>
                            <Link href="/docs" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <File className="mr-3" />
                                    Documentation
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <Link href="/examples" legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    <Lightbulb className="mr-3" />
                                    Examples
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <ClerkLoading >
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn >
                        <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                            <UserButton />
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                            <SignInButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                                <Button variant={"ghost"}>Sign In</Button>
                            </SignInButton>
                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard">
                                <Button >Get InSync for free</Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    )
}
