import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

const customerResponses = [
    {
        id: 1,
        name: "John D.",
        jobTitle: "Lead Developer",
        review: "InSync transformed our app testing process!",
        image: "/test.png",
    },
    {
        id: 2,
        name: "Emily R.",
        jobTitle: "QA Engineer",
        review: "A must-have tool for automation!",
        image: "/test.png",
    },
    {
        id: 3,
        name: "Michael B.",
        jobTitle: "Product Manager",
        review: "Saved us countless hours on repetitive tasks.",
        image: "/test.png",
    },
    {
        id: 4,
        name: "Sarah K.",
        jobTitle: "UX Designer",
        review: "InSync’s interface is incredibly intuitive.",
        image: "/test.png",
    },
    {
        id: 5,
        name: "David L.",
        jobTitle: "Software Engineer",
        review: "The real-time logs are a game-changer!",
        image: "/test.png",
    },
    {
        id: 6,
        name: "Anna T.",
        jobTitle: "Freelance Developer",
        review: "Efficient and easy to use—highly recommended!",
        image: "/test.png",
    },
    {
        id: 7,
        name: "Chris W.",
        jobTitle: "Tech Consultant",
        review: "InSync is a top-notch automation solution.",
        image: "/test.png",
    },
    {
        id: 8,
        name: "Linda P.",
        jobTitle: "CTO",
        review: "Unparalleled performance and flexibility in automation.",
        image: "/test.png",
    },
]


export default function CustomerSection() {
    return (
        <section className="bg-neutral-100 py-10">
            <div className="w-full h-full container my-10">
                <div className="text-2xl md:text-4xl font-bold lg:text-left my-3">
                    Customers&nbsp;
                </div>
                <div className="text-md md:text-xl font-medium lg:text-left ">What people using InSync are saying?</div>
            </div>
            <div className="container">
                <Carousel
                    opts={{ align: "start", }}
                    className="w-full h-full"
                >
                    <CarouselContent >
                        {
                            customerResponses?.map((cr) => (
                                <CarouselItem key={cr.id} className="md:basis-1/4 lg:basis-1/5">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center p-6">
                                                <span className="text-xl font-normal">“{cr.review}”</span>
                                            </CardContent>
                                            <CardHeader>
                                                <div className="flex gap-2 align-middle">
                                                    <Image className="rounded-full h-fit" src={cr.image} width={40} height={40} alt="hero" />
                                                    <div>
                                                        <CardTitle>{cr.name}</CardTitle>
                                                        <CardDescription>{cr.jobTitle}</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))
                        }
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

        </section>
    );
}
