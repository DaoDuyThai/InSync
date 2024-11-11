"use client";

import { UserButton, useUser } from "@clerk/nextjs";

import React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "../app/dashboard/_components/search-input";
import { ProjectSelector } from "./project-selector";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { Badge } from "./ui/badge";

interface NavbarProps {
    searchLink?: string;
    searchEntity?: string;
}

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

export const Navbar = (
    { searchLink, searchEntity }: NavbarProps
) => {
    const { user, isLoaded } = useUser();
    const [isSubscribed, setIsSubscribed] = React.useState(false);

    const checkIsSubscribed = async () => {
        try {
            if (!user) {
                console.error('User is not loaded');
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
        <div className="flex justify-between items-center w-full gap-x-4 p-5 ">
            <div className="hidden lg:flex-1 lg:flex ">
                <SearchInput searchLink={searchLink} searchEntity={searchEntity} />
            </div>
            <Link className="lg:hidden block" href="/dashboard">
                <div className="flex items-center gap-x-2">
                    <Image priority src="/logo.svg" alt="logo" height={60} width={60} />
                    <span className={cn(
                        "font-semibold text-2xl hidden md:block",
                        font.className,
                    )}>INSYNC</span>
                    {isSubscribed ? (
                        <Badge variant="secondaryGold">
                            Pro
                        </Badge>
                    ) : (
                        <Badge variant="secondary">
                            Free
                        </Badge>
                    )}
                </div>
            </Link>
            <div className="w-fit lg:hidden block items-center justify-center">
                <ProjectSelector />
            </div>
            <UserButton />
        </div>
    );
};