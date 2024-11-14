"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight, ChevronRight, Loader } from "lucide-react"
import { DocsSidebar } from "./_components/docs-sidebar"
import { Button } from "@/components/ui/button"


type Props = {
    children: React.ReactNode
}

const DocsLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <DocsSidebar />
            <SidebarInset>
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 justify-between z-10">
                    <div className="flex gap-2 items-center ">
                        <SidebarTrigger className="ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronRight />
                                </BreadcrumbSeparator>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <ClerkLoading >
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <SignedIn >
                            <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                                <div className="h-10 px-4 py-2 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                    <SignOutButton redirectUrl="/"></SignOutButton>
                                </div>
                                <Link href="/dashboard">
                                    <Button variant={"default"}>
                                        Go to dashboard <ArrowRight />
                                    </Button>
                                </Link>
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
                </header>
                <div className="container">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DocsLayout;