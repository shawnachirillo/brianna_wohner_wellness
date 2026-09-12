import Link from "next/link";
import Image from "next/image";

import coaching from "@/content/coaching.json";

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-white text-brand-green">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mt-16 grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            {/* LEFT SIDE */}
            <div className="relative">
              <Image
                src="/images/WLWB pink flower 3.png"
                alt=""
                width={650}
                height={650}
                aria-hidden="true"
                className="pointer-events-none absolute left-48 top-60 -scale-x-100 opacity-[0.14] select-none"
              />

              <p className="relative font-script text-5xl text-brand-coral">
                {coaching.hero.eyebrow}
              </p>

              <h1 className="relative mt-4 font-serifDisplay text-5xl leading-tight md:text-7xl">
                {coaching.hero.heading}
              </h1>

              <p className="relative mt-8 text-xl leading-9 text-brand-green/75">
                {coaching.hero.intro}
              </p>

              <p className="relative mt-6 text-lg leading-8 text-brand-green/75">
                {coaching.hero.description}
              </p>

              <div className="relative mt-10 grid gap-3 text-lg font-semibold">
                {coaching.hero.highlights.map(
                  (item) => (
                    <p key={item}>
                      {item}
                    </p>
                  )
                )}
              </div>

              <Link
                href={coaching.hero.buttonLink}
                className="mt-10 inline-block rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink active:translate-y-[2px] active:scale-[0.97] [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]"
              >
                {coaching.hero.buttonText}
              </Link>
            </div>

            {/* RIGHT SIDE VIDEO */}
            <div className="rounded-[42px] bg-brand-soft p-5 shadow-soft">
              <div className="mx-auto max-w-sm overflow-hidden rounded-[32px]">
                <iframe
                  className="aspect-[9/16] w-full"
                  src={coaching.hero.videoUrl}
                  title={coaching.hero.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-green px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-script text-5xl text-brand-gold">
            {coaching.included.eyebrow}
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            {coaching.included.heading}
          </h2>

          <div className="mt-16 grid gap-6 text-left md:grid-cols-2">
            {coaching.included.items.map(
              (item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-white/15 bg-white/10 p-7"
                >
                  <p className="text-xl leading-8">
                    ✦ {item}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {coaching.realFix.image ? (
            <div className="relative h-[560px] overflow-hidden rounded-[42px] shadow-soft">
              <Image
                src={coaching.realFix.image}
                alt={coaching.realFix.heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="image-card h-[560px] rounded-[42px] shadow-soft" />
          )}

          <div>
            <p className="font-script text-5xl text-brand-pink">
              {coaching.realFix.eyebrow}
            </p>

            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
              {coaching.realFix.heading}
            </h2>

            <div>
              {coaching.realFix.paragraphs.map(
                (paragraph, index) => (
                  <p
                    key={paragraph}
                    className={`text-lg leading-9 text-brand-green/75 ${
                      index === 0
                        ? "mt-8"
                        : "mt-6"
                    }`}
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="apply"
        className="px-6 pb-28"
      >
        <div className="mx-auto max-w-5xl rounded-[42px] bg-brand-soft p-10 text-center md:p-16">
          <p className="font-script text-5xl text-brand-coral">
            {coaching.cta.eyebrow}
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            {coaching.cta.heading}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/75">
            {coaching.cta.description}
          </p>

          <Link
            href={coaching.cta.buttonLink}
            className="mt-10 inline-block rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 ease-out hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink active:translate-y-[2px] active:scale-[0.97] [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]"
          >
            {coaching.cta.buttonText}
          </Link>
        </div>
      </section>
    </main>
  );
}