import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import FeaturedProgram from "@/components/home/FeaturedProgram";
import Pillars from "@/components/home/Pillars";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import ServicesBar from "@/components/home/ServicesBar";
import LocalServicesBar from "@/components/home/LocalServicesBar";
import QuoteBreak from "@/components/home/QuoteBreak";
import AboutPreview from "@/components/home/AboutPreview";
import Footer from "@/components/layout/Footer";



export default function Home() {
  return (
    <main className="min-h-screen bg-white text-brand-green">
      <Header />
      <Hero />
      <ServicesBar />
      <LocalServicesBar />
      <FeaturedProgram />
      <Pillars />
      <QuoteBreak />
      <AboutPreview />
      {/* <Yoga /> */}
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}






// function Yoga() {
//   return (
//     <section id="yoga" className="bg-brand-cream px-6 py-28">
//       <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
//         <div>
//           <p className="font-script text-5xl text-brand-coral">Practice</p>

//           <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
//             Yoga for real bodies and real lives.
//           </h2>

//           <p className="mt-6 text-lg leading-8 text-brand-green/75">
//             Gentle, grounding movement designed to help women build strength,
//             release tension, and reconnect with their bodies.
//           </p>
//         </div>

//         <div className="grid gap-5 sm:grid-cols-2">
//           {["On-demand yoga", "Private sessions", "Group classes", "Wellness events"].map(
//             (item) => (
//               <div
//                 key={item}
//                 className="rounded-[28px] border border-brand-green/15 bg-white p-8 font-semibold shadow-sm"
//               >
//                 <div className="mb-8 h-1 w-16 bg-brand-gold" />
//                 <p className="font-serifDisplay text-3xl">{item}</p>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }



