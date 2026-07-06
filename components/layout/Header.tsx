import Link from "next/link";

export default function Header() {
    return (
      <header className="sticky top-0 z-50 border-b border-brand-green/10 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="#" className="font-serifDisplay text-lg tracking-[0.22em] md:text-xl">
            BRIANNA WOHNER
          </Link>
  
          <div className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.18em] md:flex">
            <Link href="#about">About</Link>
            <Link href="/coaching">Coaching</Link>
            <Link href="#testimonials">Praise</Link>
          </div>
  
          <Link
            href="#contact"
            className="rounded-full bg-brand-pink px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-brand-coral md:text-sm"
          >
            Book a Call
          </Link>
        </nav>
      </header>
    );
  }