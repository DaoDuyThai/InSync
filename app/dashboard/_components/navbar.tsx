"use client";

import { UserButton, useOrganization } from "@clerk/nextjs";

import React from "react";
import { SearchInput } from "./search-input";
// import { SearchInput } from "./search-input";
// import { InviteButton } from "./invite-button";

export const Navbar = () => {
    const { organization } = useOrganization();
    return (
        <div className="flex items-center gap-x-4 p-5 ">
            <div className="hidden lg:flex-1 lg:flex ">
                {/* TODO: Search Input */}
                <SearchInput />
            </div>
            <UserButton />
        </div>
    );
};