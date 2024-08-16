import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Loader, Medal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import CustomerSection from "./customerSection";
import IntroSection from "./introSection";
import PricingPlanSection from "./pricingPlanSection";
import WhatIsSection from "./whatIsSection";
import WhyChooseSection from "./whyChooseSection";


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
