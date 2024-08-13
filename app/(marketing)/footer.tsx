"use client"

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

export const Footer = () => {
    return (
        <footer className="p-10 w-full border-t-2 border-slate-200 bg-white ">
            <div className="grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                    <span className="font-extrabold text-2xl tracking-wide text-center">InSync</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-bold pb-2">Resources</div>
                    <Link href="/tutorials">Tutorials</Link>
                    <Link href="/learn">Learn</Link>
                    <Link href="/tutorials">Tutorials</Link>
                    <Link href="/client">InSync Client</Link>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-bold pb-2">About</div>
                    <Link href="/aboutus">About InSync</Link>
                    <Link href="/faq">Frequent Asked Questions</Link>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="font-bold pb-2">Legal</div>
                    <Link href="/privacypolicy">Privacy Policy</Link>
                    <Link href="/terms">Terms</Link>
                </div>
                <div className="col-span-full md:col-span-2 lg:col-span-1 flex flex-col gap-4">
                    <div className="font-bold pb-2 w-full text-center">Contact Us</div>
                    <Input className="w-full" type="email" placeholder="Email" />
                    <Textarea className="w-full" placeholder="Type your message here" />

                </div>
            </div>
        </footer>
    )
}

export default Footer;