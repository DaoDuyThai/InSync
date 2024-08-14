import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Loader, Medal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import IntroSection from "./introsection";
import WhyChooseSection from "./whychoosesection";
import WhatIsSection from "./whatissection";
import CustomerSection from "./customersection";
import PricingPlanSection from "./pricingplansection";

export default function Home() {
  return (
    <main>
      <IntroSection />
      <WhatIsSection />
      <WhyChooseSection />
      <CustomerSection />
      <PricingPlanSection />
    </main>

  );
}
