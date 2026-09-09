import home from "@/content/home.json";

export default function Testimonials() {
  const testimonials = home.testimonials;

  return (
    <section id="testimonials" className="bg-brand-soft px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-script text-5xl text-brand-pink">
            {testimonials.eyebrow}
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            {testimonials.heading}
          </h2>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.items.map((testimonial) => (
            <article
              key={`${testimonial.title}-${testimonial.name}`}
              className="bg-white p-8 shadow-soft"
            >
              <h3 className="font-serifDisplay text-3xl leading-tight text-brand-coral">
                {testimonial.title}
              </h3>

              <p className="mt-6 leading-8 text-brand-green/75">
                {testimonial.text}
              </p>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.28em] text-brand-green/50">
                {testimonial.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}