"use client";

import { UserButton, useOrganization } from "@clerk/nextjs";

import React from "react";
import { SearchInput } from "../app/dashboard/_components/search-input";
// import { SearchInput } from "./search-input";
// import { InviteButton } from "./invite-button";

interface NavbarProps {
    searchLink?: string;
    searchEntity?: string;
}

export const Navbar = (
    { searchLink, searchEntity }: NavbarProps
) => {
    const { organization } = useOrganization();
    return (
        <div className="flex items-center gap-x-4 p-5 ">
            <div className="hidden lg:flex-1 lg:flex ">
                {/* TODO: Search Input */}
                <SearchInput searchLink={searchLink} searchEntity={searchEntity} />
            </div>
            <UserButton />
        </div>
    );
};