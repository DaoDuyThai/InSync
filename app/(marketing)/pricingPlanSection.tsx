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

export default function PricingPlanSection() {
    const [pricingPlans, setPricingPlans] = useState<Array<Record<string, string | number>> | null>(null);

    useEffect(() => {
        const fetchPricingPlans = async () => {
            try {
                const response = await fetch("https://dockerhub-insyncapi.onrender.com/weatherforecast");
    
                // Log the raw response to see what is returned
                console.log("Response:", response);
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const data = await response.json();
    
                // Log the data to ensure it’s being parsed correctly
                console.log("Data:", data);
    
                setPricingPlans(data);
            } catch (error) {
                // Log any error that occurs during fetch or parsing
                console.error("Error fetching pricing plans:", error);
            }
        };
    
        fetchPricingPlans();
    }, []);

    if (pricingPlans == null) return <PricingPlanSkeleton />;

    const attributeKeys = Object.keys(pricingPlans[0]).filter(
        (key) => key !== "id" && key !== "name" && key !== "price"
    );

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
                        {pricingPlans.slice(1).map((plan) => (
                            <TableHead key={plan.id} className="w-1/3">
                                <div className="text-2xl md:text-3xl font-bold text-left text-primary">
                                    {plan.name}
                                </div>
                                <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                    {/* You can add a brief description of the plan here */}
                                </div>
                                <Button
                                    size={"lg"}
                                    className="my-3"
                                    variant={plan.name === "Professional" ? "premium" : "default"}
                                >
                                    {plan.name === "Professional" ? "Buy Professional" : "Get Started"}
                                </Button>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 text-left font-bold text-xl">Price</TableCell>
                        {pricingPlans.slice(1).map((plan) => (
                            <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                {plan.price}
                            </TableCell>
                        ))}
                    </TableRow>
                    {attributeKeys.map((key) => (
                        <TableRow key={key}>
                            <TableCell className="w-1/3 text-left font-bold text-xl">
                                {pricingPlans[0][key]}
                            </TableCell>
                            {pricingPlans.slice(1).map((plan) => (
                                <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                    {plan[key]}
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



const temp: Array<Record<string, string | number>> | null = [
    {
        id: 0,
        name: "Templates & Plan Features",
        price: "Price",
        projects: "Projects",
        scenarios: "Number of Scenarios",
        support: "Support",
        storage: "Storage",
        users: "Number of Users",
        apiAccess: "API Access",
    },
    {
        id: 1,
        name: "Starters",
        price: "Free",
        projects: "3",
        scenarios: "3",
        support: "Weekdays",
        storage: "5GB",
        users: "1",
        apiAccess: "No",
    },
    {
        id: 2,
        name: "Professional",
        price: "100$/Month",
        projects: "Unlimited",
        scenarios: "Unlimited",
        support: "24/7",
        storage: "Unlimited",
        users: "10",
        apiAccess: "Yes",
    },
];