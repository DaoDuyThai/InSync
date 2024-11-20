import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {  Loader, Medal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function IntroSection() {

    return (
        <section className="flex items-center justify center flex-col">
            <div className="flex items-center justify-center flex-col">
                <div className="mb-4 flex items-center border shadow-sm p-1 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    Top Automation Tool
                </div>
                <h1 className="text-3xl md:text-5xl text-center font-bold text-neutral-800 mb-6">
                    InSync - The ultimate tool for
                </h1>
                <div className="text-3xl md:text-5xl text-center font-extrabold ">
                    MOBILE AUTOMATION
                </div>
            </div>
            <div>
                <Image src="/hero1.svg" width={400} height={400} alt="hero" />
            </div>
            <div className="text-sm md:text-lg text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
                Automate, optimize, and elevate your Mobile experience with InSync. Whether you&apos;re <span className="text-black">refining app tests or streamlining daily tasks,</span> InSync adapts to your needs—bringing seamless automation right to your fingertips.
            </div>
            <div className="p-10 flex flex-col">
                <ClerkLoading >
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedOut>
                        <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                            <Button size={"lg"} className="w-full">GET STARTED</Button>
                        </SignUpButton>
                        <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                            <Button size={"lg"} variant={"link"} className="w-full">I ALREADY HAVE AN ACCOUNT</Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <Button size={"lg"} className="w-full">
                            <Link href="/dashboard">
                                GO TO DASHBOARD
                            </Link>
                        </Button>
                    </SignedIn>
                </ClerkLoaded>
            </div>
        </section>
    )

}