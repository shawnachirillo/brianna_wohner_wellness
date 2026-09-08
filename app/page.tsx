


import Hero from "@/components/home/Hero";
import FeaturedProgram from "@/components/home/FeaturedProgram";
import Pillars from "@/components/home/Pillars";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import ServicesBar from "@/components/home/ServicesBar";
// import LocalServicesBar from "@/components/home/LocalServicesBar";
import QuoteBreak from "@/components/home/QuoteBreak";
import AboutPreview from "@/components/home/AboutPreview";
import FeaturedOfferings from "@/components/home/FeaturedOfferings";




export default function Home() {
  return (
    <main className="min-h-screen bg-white text-brand-green">

     
      <Hero />
      <ServicesBar />
      {/* <LocalServicesBar /> */}
      <FeaturedOfferings />
      <FeaturedProgram />
      <Pillars />
      <QuoteBreak />
      <AboutPreview />
      {/* <Yoga /> */}
      <Testimonials />
      <CTA />

    </main>
  );
}
