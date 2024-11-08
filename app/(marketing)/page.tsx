import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Loader, Medal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CustomerSection from "./_component/customer-section";
import IntroSection from "./_component/intro-section";
import PricingPlanSection from "./_component/pricing-plan-section";
import WhatIsSection from "./_component/what-is-section";
import WhyChooseSection from "./_component/why-choose-section";


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
