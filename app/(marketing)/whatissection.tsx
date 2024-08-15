import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function WhatIsSection() {
    return (
        <section className="w-full h-full container md:px-40 my-10">
            <div className="text-2xl md:text-4xl font-bold text-center lg:text-left ">
                What is InSync?&nbsp;
                <span className="lg:inline block font-normal text-base md:text-xl h-fit text-neutral-500">Everything you need to streamlining your workflow.</span>
            </div>
            <div className="flex-row-reverse lg:flex">
                <div className="flex-1 flex justify-center">
                    <Image src="/hero2.svg" width={500} height={500} alt="hero" />
                </div>

                <div className="flex-1 flex flex-col justify-center gap-10 pt-14">
                    <div className="">
                        <Badge className="m-2" variant="purple">Automation</Badge>
                        <Badge className="m-2" variant="green">Mobile</Badge>
                        <Badge className="m-2" variant="blue">Productivity</Badge>
                        <Badge className="m-2" variant="yellow">Custom Scripts</Badge>
                        <Badge className="m-2" variant="red">Testing</Badge>
                        <Badge className="m-2" variant="orange">Computer Vision</Badge>
                        <Badge className="m-2" variant="cyan">Cloud Service</Badge>
                    </div>
                    <div>
                        <div className="font-normal text-base md:text-xl text-neutral-500 text-justify">
                            InSync is an advanced automation tool designed for Android applications, enabling you to create, customize, and execute automation scripts with ease.
                        </div>
                        <br />
                        <div className="font-normal text-base md:text-xl text-neutral-500 text-justify">
                            By leveraging a powerful web-based interface and an intuitive Android client, InSync allows developers and testers to automate complex scenarios without relying on traditional ADB methods.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}