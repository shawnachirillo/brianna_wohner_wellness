import Link from "next/link";
import Image from "next/image";
import home from "@/content/home.json";

export default function FeaturedProgram() {
  const program = home.featuredProgram;

  return (
    <section id="coaching" className="relative overflow-hidden px-6 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
        <div className="relative">
          <div className="overflow-hidden rounded-[42px] bg-brand-soft p-6 shadow-soft">
            <div className="relative h-[620px] overflow-hidden rounded-[34px]">
              <Image
                src={program.image}
                alt={program.imageAlt}
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="relative">
          <Image
            src="/images/WLWB pink flower 3.png"
            alt=""
            width={500}
            height={500}
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-64
              top-40
              opacity-[0.12]
              transform -scale-x-100
            "
          />

          <p className="relative font-script text-5xl text-brand-coral">
            {program.eyebrow}
          </p>

          <h2 className="relative mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
            {program.heading}
          </h2>

          <p className="relative mt-8 text-lg leading-9 text-brand-green/75">
            {program.description}
          </p>

          <ul className="relative mt-10 space-y-5 text-lg text-brand-green/80">
            {program.bullets.map((bullet) => (
              <li key={bullet}>✓ {bullet}</li>
            ))}
          </ul>

          <Link
            href={program.buttonLink}
            className="
              mt-10 inline-block rounded-full bg-brand-coral px-8 py-4
              text-sm font-bold uppercase tracking-[0.16em] text-white
              transition-all duration-300 ease-out
              hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
              active:translate-y-[2px] active:scale-[0.97]
              [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
            "
          >
            {program.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}