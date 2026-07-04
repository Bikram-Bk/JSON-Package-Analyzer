import { Hero } from "@/components/landing/Hero";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { Benefits } from "@/components/landing/Benefits";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ScrollToTop } from "@/components/analyzer/ScrollToTop";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-2 py-6">
        <Hero />
        <Benefits />
        <HowItWorks />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
