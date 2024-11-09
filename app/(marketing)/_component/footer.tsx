"use client"

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

export const Footer = () => {
    return (
        <footer className="border-t-2 border-slate-200 bg-neutral-50 ">
            <div className="container p-10 w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-5">
                    <div className="flex items-start gap-x-3">
                        <div className="flex items-center">
                            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                            <div className="font-extrabold text-2xl tracking-wide text-center">InSync</div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="font-bold pb-2">GETTING STARTED</div>
                        <Link href="/introduction">Introduction</Link>
                        <Link href="/docs/installation">Installation</Link>
                        <Link href="/docs/examples">Examples</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="font-bold pb-2">ABOUT</div>
                        <Link href="/about">About InSync</Link>
                        <Link href="/faq">FAQs</Link>
                        <Link href="/term">Term of Service</Link>
                        <Link href="/privacypolicy">Privacy Policy</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="font-bold pb-2">SERVICE</div>
                        <Link href="/price">Pricing</Link>
                        <Link href="/docs">Documentation</Link>
                    </div>
                    <div className="col-span-full md:col-span-2 lg:col-span-1 flex flex-col gap-4">
                        <div className="font-bold pb-2 w-full text-center">CONTACT US</div>
                        <Input className="w-full" type="email" placeholder="Email" />
                        <Textarea className="w-full" placeholder="Type your message here" />
                    </div>
                </div>
                <div className="w-full h-full bg-neutral-50 flex justify-center">
                    <div className="text-neutral-400">
                        @{new Date().getFullYear()} InSync. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;