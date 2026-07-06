
import Link from "next/link";
import Image from "next/image";



export default function CTA() {
    return (
      <section id="contact" className="px-6 py-28">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-brand-green p-10 text-center text-white md:p-16">
          <p className="font-script text-5xl text-brand-gold">Ready?</p>
  
          <h2 className="mt-3 font-serifDisplay text-5xl leading-tight">
            Begin your next chapter feeling nourished, strong, and supported.
          </h2>
  
          <Link
            href="mailto:hello@example.com"
            className="mt-9 inline-flex rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-gold hover:text-brand-green"
          >
            Book a Discovery Call
          </Link>
        </div>
      </section>
    );
  }
  