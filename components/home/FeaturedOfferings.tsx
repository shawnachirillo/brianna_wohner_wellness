import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import home from "@/content/home.json";

type Offering = {
  name: string;
  description: string;
  price?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
};

const accents = [
  "bg-brand-gold",
  "bg-brand-teal",
  "bg-brand-coral",
];

function getOfferings(): Offering[] {
  const offeringsDirectory = path.join(
    process.cwd(),
    "content",
    "offerings"
  );

  const files = fs
    .readdirSync(offeringsDirectory)
    .filter((file) => file.endsWith(".json"));

  return files
    .map((file) => {
      const filePath = path.join(offeringsDirectory, file);
      const fileContents = fs.readFileSync(filePath, "utf8");

      return JSON.parse(fileContents) as Offering;
    })
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export default function FeaturedOfferings() {
  const section = home.featuredOfferings;
  const offerings = getOfferings();

  return (
    <section
      id="offerings"
      className="relative overflow-hidden bg-brand-soft px-6 py-24 md:py-28"
    >
      <Image
        src="/images/WLWB pink flower 3.png"
        alt=""
        width={520}
        height={520}
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 opacity-[0.08]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-brand-pink md:text-7xl">
            {section.eyebrow}
          </p>

          <h2 className="mt-3 font-serifDisplay text-5xl leading-tight md:text-5xl">
            {section.heading}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/70">
            {section.description}
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {offerings.map((offering, index) => {
            const accent = accents[index % accents.length];

            return (
              <article
                key={offering.name}
                className="group flex h-full flex-col text-center"
              >
                <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                  <div
                    className={`
                      absolute inset-3 rounded-full
                      ${accent}
                      opacity-20
                      transition-all duration-500 ease-out
                      group-hover:inset-0
                      group-hover:opacity-30
                    `}
                    aria-hidden="true"
                  />

                  <div
                    className="
                      absolute inset-0
                      overflow-hidden rounded-full
                      bg-white shadow-soft
                      transition-all duration-500 ease-out
                      group-hover:-translate-y-3
                      group-hover:scale-[1.04]
                      [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
                    "
                  >
                    {offering.image && (
                      <Image
                        src={offering.image}
                        alt={offering.name}
                        fill
                        className="
                          object-cover object-center
                          transition-transform duration-700 ease-out
                          group-hover:scale-110
                        "
                        sizes="(max-width: 767px) 300px, 33vw"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="mt-8 font-serifDisplay text-4xl leading-tight">
                    {offering.name}
                  </h3>

                  <p className="mx-auto mt-4 max-w-sm leading-7 text-brand-green/70">
                    {offering.description}
                  </p>

                  {offering.buttonLink && offering.buttonText && (
                    <div className="mt-auto pt-7">
                      <Link
                        href={offering.buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-block
                          rounded-full bg-brand-coral
                          px-7 py-3.5
                          text-sm font-bold uppercase tracking-[0.16em]
                          text-white
                          transition-all duration-300 ease-out
                          hover:-translate-y-2
                          hover:scale-[1.04]
                          hover:bg-brand-pink
                          active:translate-y-[2px]
                          active:scale-[0.97]
                          [transition-timing-function:cubic-bezier(.175,.885,.32,1.275)]
                        "
                      >
                        {offering.buttonText}
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}