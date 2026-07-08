import Link from "next/link";
import Image from "next/image";

export default function AboutPreview() {
    return (
      <section id="about" className="bg-white px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
          <div>
            <p className="font-script text-5xl text-brand-pink">Meet Brianna</p>
  
            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
              Helping women reconnect with themselves.
            </h2>
  
            <p className="mt-8 text-lg leading-9 text-brand-green/75">
              After years of helping women transform their health, Brianna learned
              that sustainable wellness isn&apos;t created through perfection.
              It&apos;s created through compassion, movement, nutrition, and
              mindset.
            </p>
  
          
            <Link
  href="/about"
  className="
    mt-10 inline-block rounded-full bg-brand-coral px-8 py-4
   font-semibold font-bold uppercase tracking-[0.18em] text-brand-green
    transition-all duration-300 ease-out
    hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
    active:translate-y-[2px] active:scale-[0.97]
    [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
  "
>
  Read My  story
</Link>
          </div>
  
          <div className="relative overflow-hidden rounded-[42px] bg-brand-soft shadow-soft">
    <div className="relative h-[650px]">
      <Image
        src="/images/blue_portrait.png"
        alt="Brianna Wohner"
        fill
        priority
        className="object-cover object-center"
      />
    </div>
  </div>
          
        </div>
      </section>
    );
  }
  