import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image";

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
                    opts={{
                        align: "start",
                    }}
                    className="w-full h-full"
                >
                    <CarouselContent>
                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“InSync transformed our app testing process!”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>John D.</CardTitle>
                                                <CardDescription>Lead Developer</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“A must-have tool for automation!”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Emily R.</CardTitle>
                                                <CardDescription>QA Engineer</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“Saved us countless hours on repetitive tasks.”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Michael B.</CardTitle>
                                                <CardDescription>Product Manager</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“InSync’s interface is incredibly intuitive.”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Sarah K.</CardTitle>
                                                <CardDescription>UX Designer</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“The real-time logs are a game-changer!”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>David L.</CardTitle>
                                                <CardDescription>Software Engineer</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“Efficient and easy to use—highly recommended!”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Anna T.</CardTitle>
                                                <CardDescription>Freelance Developer</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“InSync is a top-notch automation solution.”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Chris W.</CardTitle>
                                                <CardDescription>Tech Consultant</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="md:basis-1/4 lg:basis-1/5">
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-xl font-normal">“Unparalleled performance and flexibility in automation.”</span>
                                    </CardContent>
                                    <CardHeader>
                                        <div className="flex gap-2 align-middle">
                                            <Image className="rounded-full" src="/test.png" width={40} height={40} alt="hero" />
                                            <div>
                                                <CardTitle>Linda P.</CardTitle>
                                                <CardDescription>CTO</CardDescription>
                                            </div>
                                        </div>

                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>

                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

        </section>
    );
}
