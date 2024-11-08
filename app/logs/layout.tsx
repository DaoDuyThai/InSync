"use client"
import { Navbar } from "@/components/navbar";
import { ProjectSidebar } from "@/components/project-sidebar";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode
}

const LogLayout = ({ children }: Props) => {


    return (
        <main className="h-full">
            <div className="flex gap-x-3 h-full">
                <ProjectSidebar />
                <div className="h-full flex-1">
                    <Navbar searchEntity="logs" searchLink="logs" />
                    {children}
                </div>
            </div>
        </main>
    );
}

export default LogLayout;