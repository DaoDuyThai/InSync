"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Banknote, LayoutDashboard, Star, Folder, FileClock } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";



import { useDispatch, useSelector } from 'react-redux';
import { selectProject, clearProject } from '@/store/projectSlice';
import { RootState, AppDispatch } from '@/store/store';

import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { ProjectSelector } from "./project-selector";
import { useProModal } from "@/store/use-pro-modal";



const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});


export const ProjectSidebar = () => {
    const router = usePathname();
    // TODO: Fetch and display projects

    // Projects ComboBox
    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites");

    const { user, isLoaded } = useUser();
    const [isSubscribed, setIsSubscribed] = React.useState(null);

    const fetchIsSubscribed = async () => {
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
        fetchIsSubscribed();
    }, [user, isLoaded]);

    // Get the current project from Redux
    const dispatch = useDispatch<AppDispatch>();

    // Load selected project from localStorage when component mounts
    React.useEffect(() => {
        const storedProjectId = localStorage.getItem("selectedProjectId");
        if (storedProjectId) {
            dispatch(selectProject(storedProjectId)); // Load project into Redux
        }
    }, [dispatch]);


    // TODO: Implement Stripe
    const { onOpen } = useProModal();
    const onClickPay = () => {
        onOpen();
    }


    const onClickPortal = () => {
        setPending(true);

        if (!user) {
            toast.error("Please log in to continue.");
            setPending(false);
            return;
        }
        try {
            const portalLinkUrl = `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_LINK_URL!}?prefilled_email=${user.primaryEmailAddress}`;
            window.open(portalLinkUrl, "_blank");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later.");
            return
        } finally {
            setPending(false);
        }
    }

    const [pending, setPending] = React.useState(false);

    return (
        <div className=" hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
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


            <ProjectSelector />


            <div className="space-y-1 w-full">
                <Button variant={(router === '/dashboard') && !favorites ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full">
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
                <Button
                    variant={router === '/assets' ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href="/assets">
                        <Folder className="h-4 w-4 mr-2" /> Project Assets
                    </Link>
                </Button>
                <Button
                    variant={router === '/logs' ? 'secondary' : 'ghost'}
                    asChild
                    size="lg"
                    className="font-normal justify-start px-2 w-full"
                >
                    <Link href="/logs">
                        <FileClock className="h-4 w-4 mr-2" /> Project Logs
                    </Link>
                </Button>
                {/* TODO: Upgrade to Pro */}

                {isSubscribed === null ? null : isSubscribed ? (
                    <Button onClick={onClickPortal} disabled={pending} variant="ghost" size="lg" className="font-normal justify-start px-2 w-full">
                        <Banknote className="h-4 w-4 mr-2" />
                        My Billing & Plan
                    </Button>
                ) : (
                    <Button onClick={onClickPay} disabled={pending} variant="ghost" size="lg" className="font-normal justify-start px-2 w-full">
                        <Banknote className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                    </Button>
                )}


            </div>
        </div>
    )
}


