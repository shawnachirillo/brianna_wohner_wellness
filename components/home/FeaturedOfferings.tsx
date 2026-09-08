import Image from "next/image";
import Link from "next/link";

const offerings = [
  {
    title: "Pop-Up Wellness Studio",
    description:
      "A restorative wellness experience that brings movement, mindfulness, and community together in an inviting space.",
    image: "/images/side_portrait.png",
    imageAlt: "Brianna Wohner leading a wellness experience",
    href: "https://thrivecart.com/placeholder-popup-wellness-studio",
    accent: "bg-brand-gold",
  },
  {
    title: "Group Yoga",
    description:
      "Grounding, supportive yoga sessions designed to help you build strength, release tension, and reconnect with your body.",
    image: "/images/BW_portrait_pepper.png",
    imageAlt: "Brianna Wohner wellness and yoga coaching",
    href: "https://thrivecart.com/placeholder-group-yoga",
    accent: "bg-brand-teal",
  },
  {
    title: "Private Yoga",
    description:
      "One-on-one sessions shaped around your body, your goals, and the kind of support you need right now.",
    image: "/images/blue_portrait.png",
    imageAlt: "Brianna Wohner private wellness coaching",
    href: "https://thrivecart.com/placeholder-private-yoga",
    accent: "bg-brand-coral",
  },
];

export default function FeaturedOfferings() {
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
            Featured Offerings
          </p>

          <h2 className="mt-3 font-serifDisplay text-5xl leading-tight md:text-5xl">
            Wellness support that meets you where you are.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/70">
            Choose the experience that fits your season, from community-centered
            movement to personalized one-on-one support.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
        {offerings.map((offering) => (
  <article
    key={offering.title}
    className="group flex h-full flex-col text-center"
  >
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <div
        className={`
          absolute inset-3 rounded-full
          ${offering.accent}
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
        <Image
          src={offering.image}
          alt={offering.imageAlt}
          fill
          className="
            object-cover object-center
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
          sizes="(max-width: 767px) 300px, 33vw"
        />
      </div>
    </div>

    <div className="flex flex-1 flex-col">
      <h3 className="mt-8 font-serifDisplay text-4xl leading-tight">
        {offering.title}
      </h3>

      <p className="mx-auto mt-4 max-w-sm leading-7 text-brand-green/70">
        {offering.description}
      </p>

      <div className="mt-auto pt-7">
        <Link
          href={offering.href}
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
          Reserve Your Spot
        </Link>
      </div>
    </div>
  </article>

          ))}
        </div>
      </div>
    </section>
  );
}