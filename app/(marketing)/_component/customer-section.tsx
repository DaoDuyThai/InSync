import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"

const customerResponses: Array<any> | null = [
    {
        id: 1,
        name: "John D.",
        jobTitle: "Lead Developer",
        review: "InSync transformed our app testing process!",
        image: "/customers/johnd.png",
    },
    {
        id: 2,
        name: "Emily R.",
        jobTitle: "QA Engineer",
        review: "A must-have tool for automation!",
        image: "/customers/emilir.png",
    },
    {
        id: 3,
        name: "Michael B.",
        jobTitle: "Product Manager",
        review: "Saved us countless hours on repetitive tasks.",
        image: "/customers/michaelb.png",
    },
    {
        id: 4,
        name: "Sarah K.",
        jobTitle: "UX Designer",
        review: "InSync’s interface is incredibly intuitive.",
        image: "/customers/sarahk.png",
    },
    {
        id: 5,
        name: "David L.",
        jobTitle: "Software Engineer",
        review: "The real-time logs are a game-changer!",
        image: "/customers/davidl.png",
    },
    {
        id: 6,
        name: "Anna T.",
        jobTitle: "Freelance Developer",
        review: "Efficient and easy to use—highly recommended!",
        image: "/customers/annat.png",
    },
    {
        id: 7,
        name: "Chris W.",
        jobTitle: "Tech Consultant",
        review: "InSync is a top-notch automation solution.",
        image: "/customers/cristw.png",
    },
    {
        id: 8,
        name: "Linda P.",
        jobTitle: "CTO",
        review: "Unparalleled performance and flexibility in automation.",
        image: "/customers/lindap.png",
    },
]


export default function CustomerSection() {
    if (customerResponses == null) return <CustomerSectionSkeleton />;

    return (
        <section className="bg-neutral-100 py-10">
            <div className="w-full h-full container my-10">
                <div className="text-2xl md:text-4xl font-bold lg:text-left my-3">
                    Customers&nbsp;
                </div>
                <div className="text-md md:text-xl font-medium lg:text-left">
                    What people using InSync are saying?
                </div>
            </div>
            <div className="container px-14">
                <Carousel opts={{ align: "start" }} className="w-full h-full">
                    <CarouselContent>
                        {customerResponses?.map((cr) => (
                            <CarouselItem key={cr.id} className="md:basis-1/4 lg:basis-1/5">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-xl font-normal">“{cr.review}”</span>
                                        </CardContent>
                                        <CardHeader>
                                            <div className="flex gap-2 align-middle">
                                                <Image className="rounded-full h-fit" src={cr.image} width={40} height={40} alt={cr.name} />
                                                <div>
                                                    <CardTitle>{cr.name}</CardTitle>
                                                    <CardDescription>{cr.jobTitle}</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
}


export const CustomerSectionSkeleton = function CustomerSectionSkeleton() {
    return (
        <section className="bg-neutral-100 py-10">
            <div className="w-full h-full container my-10">
                <div className="text-2xl md:text-4xl font-bold lg:text-left my-3">
                    Customers&nbsp;
                </div>
                <div className="text-md md:text-xl font-medium lg:text-left">
                    What people using InSync are saying?
                </div>
            </div>
            <div className="container px-14">
                <Carousel opts={{ align: "start" }} className="w-full h-full">
                    <CarouselContent>
                        {Array(5).fill(null).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/4 lg:basis-1/5">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <Skeleton className="h-20 w-20 rounded-full" />
                                        </CardContent>
                                        <CardHeader>
                                            <div className="flex gap-2 align-middle">
                                                <Skeleton className="rounded-full h-10 w-10" />
                                                <div className="flex flex-col">
                                                    <Skeleton className="h-6 w-24" />
                                                    <Skeleton className="h-4 w-32 mt-1" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
};