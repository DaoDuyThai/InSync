import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Define an interface for the pricing plan that allows any string keys in the attributes
interface PricingPlan {
    id: number;
    name: string;
    price: string;
    attributes: { [key: string]: string };
}

const pricingPlans: PricingPlan[] = [
    {
        id: 0,
        name: "Templates & Plan Features",
        price: "Price",
        attributes: {
            Projects: "Projects",
            Scenarios: "Number of Scenarios",
            Support: "Support",
            Storage: "Storage",
            Users: "Number of Users",
            ApiAccess: "API Access",
        },
    },
    {
        id: 1,
        name: "Starters",
        price: "Free",
        attributes: {
            Projects: "3",
            Scenarios: "3",
            Support: "Weekdays",
            Storage: "5GB",
            Users: "1",
            ApiAccess: "No",
        },
    },
    {
        id: 2,
        name: "Professional",
        price: "100$/Month",
        attributes: {
            Projects: "Unlimited",
            Scenarios: "Unlimited",
            Support: "24/7",
            Storage: "Unlimited",
            Users: "10",
            ApiAccess: "Yes",
        },
    },
    // Additional plans can be added here in the same format

]

export default function PricingPlanSection() {
    const attributeKeys = Object.keys(pricingPlans[0].attributes);

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
                                <Button size={"lg"} className="my-3" variant={plan.name === "Professional" ? "premium" : "default"}>
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
                                {pricingPlans[0].attributes[key]}
                            </TableCell>
                            {pricingPlans.slice(1).map((plan) => (
                                <TableCell key={plan.id} className="w-1/3 text-left text-xl">
                                    {plan.attributes[key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}