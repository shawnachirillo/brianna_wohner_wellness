import home from "@/content/home.json";

export default function Pillars() {
  const pillars = home.pillars;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-brand-pink">
            {pillars.eyebrow}
          </p>

          <h2 className="mt-3 font-serifDisplay text-5xl leading-tight">
            {pillars.heading}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.items.map((pillar, index) => (
            <article
              key={pillar.title}
              className="border border-brand-green/15 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div
                className={`mb-10 h-2 w-20 ${
                  index === 0
                    ? "bg-brand-gold"
                    : index === 1
                    ? "bg-brand-teal"
                    : "bg-brand-coral"
                }`}
              />

              <h3 className="font-serifDisplay text-4xl">
                {pillar.title}
              </h3>

              <p className="mt-5 leading-7 text-brand-green/70">
                {pillar.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}