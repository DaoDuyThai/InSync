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
import { loadEnvConfig } from "@next/env";


export default function PricingPlanSection() {
    const [pricingPlans, setPricingPlans] = useState<Array<Record<string, any>> | null>(null);

    useEffect(() => {
        const fetchPricingPlans = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/SubscriptionPlans`);
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
        maxProjects: "Maximum Projects",
        maxAssets: "Maximum Assets",
        maxScenarios: "Maximum Scenarios",
        maxUsersAccess: "Maximum User Access",
        storageLimit: "Storage Limit",
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
                                <Button
                                    size={"lg"}
                                    className="my-3"
                                    variant={plan.subscriptionsName === "Professional" ? "premium" : "default"}
                                >
                                    {plan.subscriptionsName === "Professional" ? `Buy ${plan.subscriptionsName}` : "Get Started"}
                                </Button>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 text-left font-bold text-xl">Price</TableCell>
                        {pricingPlans.map((plan) => (
                            <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                ${plan.price}
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



const temp: Array<Record<string, string | number | boolean | null | Array<any>>> | null = [
    {
        "id": "e366c43e-a634-442b-a654-3aeecf6ffc24",
        "subscriptionsName": "Starter",
        "status": true,
        "price": 549,
        "userId": "933b6f98-8853-46aa-bafc-1b55709c1b8f",
        "content": "Basic plan for individual users.",
        "dateCreated": "2024-08-01T08:00:00",
        "dateUpdated": "2024-08-01T08:00:00",
        "maxProjects": 5,
        "maxAssets": 100,
        "maxScenarios": 10,
        "maxUsersAccess": 1,
        "storageLimit": 5000,
        "supportLevel": "Standard",
        "customFeaturesDescription": "Access to standard features with limited customization.",
        "dataRetentionPeriod": 365,
        "prioritySupport": false,
        "monthlyReporting": false,
        "user": null,
        "userSubscriptions": []
    },
    {
        "id": "cbab902f-779e-4013-8121-a3dc8f70c454",
        "subscriptionsName": "Professional",
        "status": true,
        "price": 49.99,
        "userId": "933b6f98-8853-46aa-bafc-1b55709c1b8f",
        "content": "Advanced plan for small teams.",
        "dateCreated": "2024-08-02T09:15:00",
        "dateUpdated": "2024-08-02T09:15:00",
        "maxProjects": 20,
        "maxAssets": 500,
        "maxScenarios": 50,
        "maxUsersAccess": 5,
        "storageLimit": 20000,
        "supportLevel": "Enhanced",
        "customFeaturesDescription": "Includes additional features and priority support.",
        "dataRetentionPeriod": 730,
        "prioritySupport": true,
        "monthlyReporting": true,
        "user": null,
        "userSubscriptions": []
    }
]