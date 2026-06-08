import { Cormorant_Garamond, Manrope } from "next/font/google";
import { HomeContactSection } from "@/components/home/home-contact-section";
import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { HomeNavSection } from "@/components/home/home-nav-section";
import { HomeApproachSection } from "@/components/home/home-approach-section";
import { HomeFeaturesSection } from "@/components/home/home-features-section";
import { HomeProcessSection } from "@/components/home/home-process-section";
import { HomeTeamSection } from "@/components/home/home-team-section";
import { HomeTestimonialsSection } from "@/components/home/home-testimonials-section";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <main className={`relative flex-1 ${bodyFont.className}`}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(22,163,74,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.08),transparent_45%)]" />
      <HomeNavSection />
      <HomeHeroSection headingClassName={headingFont.className} />
      <HomeApproachSection headingClassName={headingFont.className} />
      <HomeProcessSection headingClassName={headingFont.className} />
      <HomeFeaturesSection headingClassName={headingFont.className} />
      <HomeTeamSection headingClassName={headingFont.className} />
      <HomeTestimonialsSection headingClassName={headingFont.className} />
      <HomeContactSection headingClassName={headingFont.className} />
      <HomeFooter />
    </main>
  );
}
