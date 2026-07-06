import Link from "next/link";
import Image from "next/image";

export default function QuoteBreak() {
        return (
          <section className="bg-brand-green px-6 py-28 text-center text-white md:py-32">
            <p className="mx-auto max-w-5xl font-serifDisplay text-4xl leading-relaxed md:text-5xl">
              “True wellness isn&apos;t about becoming someone else. It&apos;s
              remembering who you&apos;ve always been.”
            </p>
      
            <p className="mt-10 text-sm uppercase tracking-[0.4em] text-brand-gold">
              — Brianna Wohner
            </p>
          </section>
        );
      }