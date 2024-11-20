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
