"use client"

import { Button } from "@/components/ui/button"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ArrowRight, Loader } from "lucide-react"
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

const components: { title: string; href: string; description: string }[] = [
    {
        title: "About InSync",
        href: "/about",
        description:
            "The genius minds behind InSync and the story of how it all started.",
    },
    {
        title: "Term of Service",
        href: "/terms",
        description:
            "The terms and conditions that govern the use of InSync.",
    },
    {
        title: "FAQs",
        href: "/faq",
        description:
            "Frequently asked questions about InSync and its features.",
    },
    {
        title: "Privacy Policy",
        href: "/privacypolicy",
        description: "How we handle your data and protect your privacy.",
    },

]


export const Header = () => {
    return (
        <header className="border-b-2 border-slate-200 px-4 sticky top-0 bg-white z-10">
            <div className="h-16 w-full container">
                <div className="mx-auto flex items-center justify-between h-full">
                    <Link href={"/"} className=" flex-row align-middle hidden md:block">
                        <div className=" flex items-center gap-x-3">
                            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                            <span className="hidden md:block font-extrabold text-2xl tracking-wide text-center">InSync</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <NavigationMenuLink asChild>
                                                    <a
                                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                        href="/"
                                                    >
                                                        <center>
                                                            <Image src={"/logo.svg"} width={"75"} height={"75"} alt="Logo" />
                                                            <div className="mb-2 mt-4 text-lg font-bold">
                                                                InSync
                                                            </div>
                                                        </center>
                                                        <p className="text-sm leading-tight text-muted-foreground">
                                                            Streamline and optimize the process of Mobile applications today.
                                                        </p>
                                                    </a>
                                                </NavigationMenuLink>
                                            </li>
                                            <ListItem href="/introduction" title="Introduction">
                                                Custom scenario execution, real-time logging and many more.
                                            </ListItem>
                                            <ListItem href="/docs/installation" title="Installation">
                                                How to install Mobile Client to start automating.
                                            </ListItem>
                                            <ListItem href="/docs/examples" title="Examples">
                                                How InSync can be used in different scenarios.
                                            </ListItem>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>About</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            {components.map((component) => (
                                                <ListItem
                                                    key={component.title}
                                                    title={component.title}
                                                    href={component.href}
                                                >
                                                    {component.description}
                                                </ListItem>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/price" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Pricing
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/docs" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Documentation
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <ClerkLoading >
                        <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <SignedIn >
                            <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                                <Button variant={"ghost"}>
                                    <SignOutButton>Sign out</SignOutButton>
                                </Button>
                                <Button variant={"default"}>
                                    <Link href="/dashboard">Go to dashboard </Link><ArrowRight />
                                </Button>
                                {/* <UserButton afterSwitchSessionUrl="/" /> */}
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <div className="flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                                    <Button variant={"ghost"}>Login</Button>
                                </SignInButton>
                                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                                    <Button >Get InSync for free</Button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </ClerkLoaded>
                </div>
            </div>
        </header>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"