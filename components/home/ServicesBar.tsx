import home from "@/content/home.json";

export default function ServicesBar() {
  return (
    <section className="border-y border-brand-green/10 bg-brand-soft py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-4 px-6 text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-green/70">
        {home.services.map((service) => (
          <span key={service}>{service}</span>
        ))}
      </div>
    </section>
  );
}