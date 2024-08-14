import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

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
                                        <CardTitle>John D.</CardTitle>
                                        <CardDescription>Lead Developer</CardDescription>
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
                                        <CardTitle>Emily R.</CardTitle>
                                        <CardDescription>QA Engineer</CardDescription>
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
                                        <CardTitle>Michael B.</CardTitle>
                                        <CardDescription>Product Manager</CardDescription>
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
                                        <CardTitle>Sarah K.</CardTitle>
                                        <CardDescription>UX Designer</CardDescription>
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
                                        <CardTitle>David L.</CardTitle>
                                        <CardDescription>Software Engineer</CardDescription>
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
                                        <CardTitle>Anna T.</CardTitle>
                                        <CardDescription>Freelance Developer</CardDescription>
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
                                        <CardTitle>Chris W.</CardTitle>
                                        <CardDescription>Tech Consultant</CardDescription>
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
                                        <CardTitle>Linda P.</CardTitle>
                                        <CardDescription>CTO</CardDescription>
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
