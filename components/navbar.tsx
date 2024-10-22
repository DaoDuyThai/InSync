"use client";

import { UserButton } from "@clerk/nextjs";

import React from "react";
import { cn } from "@/lib/utils";
import { SearchInput } from "../app/dashboard/_components/search-input";
import { ProjectSelector } from "./project-selector";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

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
    return (
        <div className="flex justify-between items-center w-full gap-x-4 p-5 ">
            <div className="hidden lg:flex-1 lg:flex ">
                <SearchInput searchLink={searchLink} searchEntity={searchEntity} />
            </div>
            <Link className="lg:hidden block" href="/">
                <div className="flex items-center gap-x-2">
                    <Image priority src="/logo.svg" alt="logo" height={60} width={60} />
                    <span className={cn(
                        "font-semibold text-2xl",
                        font.className,
                    )}>INSYNC</span>
                </div>
            </Link>
            <div className="w-fit lg:hidden block items-center justify-center">
                <ProjectSelector />
            </div>
            <UserButton />
        </div>
    );
};