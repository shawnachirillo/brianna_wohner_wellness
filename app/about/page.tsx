import Image from "next/image";
import Link from "next/link";
import about from "@/content/about.json";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-brand-green">
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <Image
          src="/images/WLWB pink flower 3.png"
          alt=""
          width={800}
          height={800}
          aria-hidden="true"
          className="pointer-events-none absolute right-[-180px] top-28 opacity-[0.12] select-none"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-[42px] bg-brand-soft shadow-soft">
            <div className="relative h-[720px]">
              <Image
                src={about.hero.image}
                alt={about.hero.imageAlt}
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="relative">
            <p className="font-script text-5xl text-brand-coral">
              {about.hero.eyebrow}
            </p>

            <h1 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-7xl">
              {about.hero.heading}
            </h1>

            <p className="mt-8 text-xl leading-9 text-brand-green/75">
              {about.hero.intro}
            </p>

            <div className="mt-8 space-y-6 text-lg leading-9 text-brand-green/75">
              {about.hero.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-soft px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-center font-script text-5xl text-brand-coral">
            {about.transformation.eyebrow}
          </p>

          <h2 className="mt-4 text-center font-serifDisplay text-5xl leading-tight">
            {about.transformation.heading}
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-brand-green/75">
            {about.transformation.description}
          </p>

          <div className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_0.8fr_1.2fr]">
            {about.transformation.beforeImages.map((item, index) => (
              <div key={`${item.image}-${index}`}>
                <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-coral">
                  Before
                </p>

                <div className="overflow-hidden rounded-[32px] bg-white shadow-soft">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={500}
                    height={700}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            ))}

            <div>
              <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-green">
                After
              </p>

              <div className="overflow-hidden rounded-[40px] bg-white shadow-soft">
                <Image
                  src={about.transformation.afterImage.image}
                  alt={about.transformation.afterImage.alt}
                  width={700}
                  height={900}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-20 max-w-4xl text-center">
            <p className="font-script text-5xl text-brand-pink">
              {about.transformation.resultEyebrow}
            </p>

            <h3 className="mt-4 font-serifDisplay text-4xl leading-tight">
              {about.transformation.resultHeading}
            </h3>

            <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-brand-green/75">
              {about.transformation.resultText}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-green px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-script text-5xl text-brand-gold">
            {about.method.eyebrow}
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            {about.method.heading}
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/80">
            {about.method.description}
          </p>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-script text-5xl text-brand-pink">
              {about.finalSection.eyebrow}
            </p>

            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
              {about.finalSection.heading}
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-9 text-brand-green/75">
            {about.finalSection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <Link
              href={about.finalSection.buttonLink}
              className="
                mt-10 inline-block rounded-full bg-brand-coral px-8 py-4
                text-sm font-bold uppercase tracking-[0.16em] text-brand-green
                transition-all duration-300 ease-out
                hover:-translate-y-4 hover:scale-[1.04] hover:bg-brand-pink
                active:translate-y-[2px] active:scale-[0.97]
                [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
              "
            >
              {about.finalSection.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}