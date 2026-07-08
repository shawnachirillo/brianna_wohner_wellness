import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <Image
        src="/images/pink_flower_1.png"
        alt="pink flower"
        width={500}
        height={500}
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 opacity-[0.25]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="font-script text-4xl text-brand-coral md:text-5xl">
            Modern Goddess Coaching
          </p>

          <h1 className="mt-4 max-w-3xl font-serifDisplay text-5xl leading-[0.98] tracking-tight md:text-7xl">
            Wellness that feels like coming home to yourself.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-brand-green/75">
            Yoga, nutrition, and compassionate coaching for women ready to feel
            strong, nourished, and present in their own lives.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="
    mt-10 inline-block rounded-full bg-brand-coral px-8 py-4
    text-sm font-bold uppercase tracking-[0.16em] text-white
    transition-all duration-300 ease-out
    hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
    active:translate-y-[2px] active:scale-[0.97]
    [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
  "
            >
              Start Your Journey
            </Link>

            <Link
              href="/coaching"
              className="mt-10 inline-block rounded-full border border-brand-coral px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-green
    transition-all duration-300 ease-out
    hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
    active:translate-y-[2px] active:scale-[0.97]
    [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
  "
            >
              Explore Coaching
            </Link>

          </div>
        </div>

        <div className="relative">

          <div className="overflow-hidden rounded-[42px] bg-brand-soft p-6 shadow-soft">

            <div className="relative h-[620px] overflow-hidden rounded-[34px]">

              <Image
                src="/images/BW_headshot.png"
                alt="Brianna Wohner"
                fill
                priority
                className="object-cover object-center"
              />

            </div>

          </div>

        

        </div>
      </div>
    </section>
  );
}