// import { Navbar } from "@/components/navbar";
// import { ProjectSidebar } from "@/components/project-sidebar";
"use client"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ChevronRight } from "lucide-react"


type Props = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
                    <div className="flex gap-2 items-center">
                        <SidebarTrigger className="ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight />
                                </BreadcrumbSeparator>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <UserButton />
                </header>

                <div className="container">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>







    )
}

export default AdminLayout;