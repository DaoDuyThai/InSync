"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";


export default function PricingPlanSection() {
    const [pricingPlans, setPricingPlans] = useState<Array<Record<string, any>> | null>(null);

    useEffect(() => {
        const fetchPricingPlans = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/SubscriptionPlans`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPricingPlans(data);
            } catch (error) {
                console.error("Error fetching pricing plans:", error);
            }
        };

        fetchPricingPlans();
    }, []);

    if (pricingPlans == null) return <PricingPlanSkeleton />;

    // Define the keys and their display labels
    const displayKeys: Record<string, string> = {
        content: "Target",
        maxProjects: "Maximum Projects",
        maxAssets: "Maximum Assets",
        maxScenarios: "Maximum Scenarios",
        maxUsersAccess: "Maximum User Access",
        storageLimit: "Storage Limit (blocks/scenario)",
        supportLevel: "Support Level",
        customFeaturesDescription: "Custom Features Description"
    };

    return (
        <section className="w-full h-full container my-10 hidden md:flex flex-col justify-center py-10 gap-5">
            <Table className="h-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">
                            <div className="text-3xl md:text-4xl font-bold text-left text-primary pb-5">
                                Plan & Pricing
                            </div>
                            <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                Get started in complete confidence. Our 30-day money-back guarantee means it&apos;s risk-free.
                            </div>
                        </TableHead>
                        {pricingPlans.map((plan) => (
                            <TableHead key={plan.id} className="w-1/3">
                                <div className="text-2xl md:text-3xl font-bold text-left text-primary">
                                    {plan.subscriptionsName}
                                </div>
                                <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                    {plan.content}
                                </div>
                                <Link href="/dashboard">
                                    <Button
                                        size={"lg"}
                                        className="my-3"
                                        variant={plan.subscriptionsName === "Professional" ? "premium" : "default"}
                                    >
                                        {plan.subscriptionsName === "Professional" ? `Buy ${plan.subscriptionsName}` : "Get Started"}
                                    </Button>
                                </Link>

                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 text-left font-bold text-xl">Price</TableCell>
                        {pricingPlans.map((plan) => (
                            <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                {plan.price === 0 ? "Free" : `đ${plan.price.toFixed(3)}`}
                            </TableCell>
                        ))}
                    </TableRow>
                    {Object.entries(displayKeys).map(([key, label]) => (
                        <TableRow key={key}>
                            <TableCell className="w-1/3 text-left font-bold text-xl">
                                {label}
                            </TableCell>
                            {pricingPlans.map((plan) => (
                                <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                    {String(plan[key])}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}

export const PricingPlanSkeleton = function PricingPlanSkeleton() {
    return (
        <section className="w-full h-full container my-10 hidden md:flex flex-col justify-center py-10 gap-5">
            <Table className="h-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">
                            <div className="text-3xl md:text-4xl font-bold text-left text-primary pb-5">
                                Plan & Pricing
                            </div>
                            <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                Get started in complete confidence. Our 30-day money-back guarantee means it&apos;s risk-free.
                            </div>
                        </TableHead>

                        <TableHead className="w-1/3">
                            <Skeleton className="h-full w-full" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                        <TableCell className="h-20">
                            <Skeleton className="h-full w-full" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </section>
    );
};