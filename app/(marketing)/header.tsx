import { Button } from "@/components/ui/button"
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ArrowRight, Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Header = () => {
    return (
        <header className="h-16 w-full border-b-2 border-slate-200 px-4 sticky top-0 bg-white">
            <div className=" mx-auto flex items-center justify-between h-full">
                <Link href={"/"} className=" flex-row align-middle hidden md:block">
                    <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                        <span className="hidden md:block font-extrabold text-2xl tracking-wide text-center">InSync</span>

                    </div>
                </Link>

                <div>

                </div>

                <ClerkLoading >
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn >
                        <div className="md:block flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                            <Button variant={"ghost"}>
                                <SignOutButton>Sign out</SignOutButton>
                            </Button>
                            <Button variant={"default"}>
                                <Link href="/dashboard">Go to dashboard </Link><ArrowRight />
                            </Button>
                            {/* <UserButton afterSwitchSessionUrl="/" /> */}
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <div className="md:block flex align-middle gap-2 items-center justify-between md:w-fit w-full">
                            <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                                <Button variant={"ghost"}>Login</Button>
                            </SignInButton>
                            <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                                <Button >Get InSync for free</Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </ClerkLoaded>
            </div>

        </header>
    )
}

