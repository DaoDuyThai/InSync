import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function PricingPlanSection() {
    return (
        <section className="w-full h-full container my-10 flex flex-col justify-center py-10 gap-5 ">
            <Table className="h-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">
                            <div className="text-3xl md:text-4xl font-bold text-left text-primary pb-5">
                                Plan & Pricing&nbsp;
                            </div>
                            <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                Get started in complete confidence. Our 30-day money-back guarantee means it&apos;s risk-free.
                            </div>
                        </TableHead>
                        <TableHead className="w-1/3">
                            <div className="text-2xl md:text-3xl font-bold text-left text-primary">
                                Starters
                            </div>
                            <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                For hobbyists and prototypes.
                            </div>
                            <Button size={"lg"} className="my-3" variant="default">Get Started</Button>
                        </TableHead>
                        <TableHead className="w-1/3 ">
                            <div className="text-2xl md:text-3xl font-bold text-left text-primary">
                                Professional
                            </div>
                            <div className="hidden md:block font-normal text-base text-left md:text-xl text-neutral-500">
                                For teams working on growing projects.
                            </div>
                            <Button size={"lg"} className="my-3" variant="premium">Buy Professional</Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="w-1/3 text-left font-bold text-xl">Price</TableCell>
                        <TableCell className="w-1/3 text-left text-xl">Free</TableCell>
                        <TableCell className="w-1/3 text-left text-xl">100$/Month</TableCell>
                    </TableRow>
                </TableBody>
            </Table>



        </section>
    )
}