import Link from "next/link";
import home from "@/content/home.json";

export default function CTA() {
  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-brand-green p-10 text-center text-white md:p-16">
        <p className="font-script text-5xl text-brand-gold">
          {home.cta.eyebrow}
        </p>

        <h2 className="mt-3 font-serifDisplay text-5xl leading-tight">
          {home.cta.heading}
        </h2>

        <Link
          href={home.cta.buttonLink}
          className="
            mt-10 inline-block rounded-full bg-brand-coral px-8 py-4
            text-sm font-bold uppercase tracking-[0.16em] text-white
            transition-all duration-300 ease-out
            hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
            active:translate-y-[2px] active:scale-[0.97]
            [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
          "
        >
          {home.cta.buttonText}
        </Link>
      </div>
    </section>
  );
}