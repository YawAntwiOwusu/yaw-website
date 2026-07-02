import { HeroSection } from "@/components/firstdomain/HeroSection";
import { WhyFirstDomain } from "@/components/firstdomain/WhyFirstDomain";
import { ProgramOverview } from "@/components/firstdomain/ProgramOverview";
import { WhoShouldApply } from "@/components/firstdomain/WhoShouldApply";
import { HowItWorks } from "@/components/firstdomain/HowItWorks";
import { SelectionCriteria } from "@/components/firstdomain/SelectionCriteria";
import { WinnersTeaser } from "@/components/firstdomain/WinnersTeaser";
import { FAQ } from "@/components/firstdomain/FAQ";
import { PersonalNote } from "@/components/firstdomain/PersonalNote";
import { ApplyCTA } from "@/components/firstdomain/ApplyCTA";

export const dynamic = "force-dynamic";

export default function FirstDomainPage() {
  return (
    <>
      <HeroSection />
      <WhyFirstDomain />
      <ProgramOverview />
      <WhoShouldApply />
      <HowItWorks />
      <SelectionCriteria />
      <WinnersTeaser />
      <FAQ />
      <PersonalNote />
      <ApplyCTA />
    </>
  );
}
