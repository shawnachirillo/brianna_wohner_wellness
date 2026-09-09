import home from "@/content/home.json";

export default function QuoteBreak() {
  return (
    <section className="bg-brand-green px-6 py-28 text-center text-white md:py-32">
      <p className="mx-auto max-w-5xl font-serifDisplay text-4xl leading-relaxed md:text-5xl">
        “{home.quote.text}”
      </p>

      <p className="mt-10 text-sm uppercase tracking-[0.4em] text-brand-gold">
        — {home.quote.author}
      </p>
    </section>
  );
}