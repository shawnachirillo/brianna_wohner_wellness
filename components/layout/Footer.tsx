import Link from "next/link";

export default function Footer () {
    return (
      <footer className="border-t border-brand-green/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-center md:flex-row md:text-left">
          <p className="font-serifDisplay text-2xl tracking-[0.15em]">
            BRIANNA WOHNER
          </p>
  
          <p className="text-sm uppercase tracking-[0.25em] text-brand-green/60">
            Yoga • Nutrition • Coaching
          </p>
        </div>
      </footer>
    );
  }