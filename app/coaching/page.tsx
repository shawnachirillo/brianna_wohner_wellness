import Link from "next/link";

export default function CoachingPage() {
  return (
    <main className="min-h-screen bg-white text-brand-green">
      <Header />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mt-16 grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-script text-5xl text-brand-coral">
                Modern Goddess Reset
              </p>

              <h1 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-7xl">
                12 Week 1:1 Weight Loss Coaching Program
              </h1>

              <p className="mt-8 text-xl leading-9 text-brand-green/75">
                This is where everything changes.
              </p>

              <p className="mt-6 text-lg leading-8 text-brand-green/75">
                In 12 weeks, we build your foundation: mindset, nutrition,
                movement, and the daily habits that will carry you for life.
              </p>

              <div className="mt-10 grid gap-3 text-lg font-semibold">
                <p>Real support.</p>
                <p>Real results.</p>
                <p>Real mom life.</p>
              </div>

              <Link
                href="#apply"
                className="mt-10 inline-flex rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-green"
              >
                Apply for Coaching
              </Link>
            </div>

            <div className="rounded-[42px] bg-brand-soft p-5 shadow-soft">
              <div className="aspect-video overflow-hidden rounded-[32px]">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID"
                  title="What it is like to work with a weight loss coach"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
            What&apos;s Included
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            Everything you need to stop starting over.
          </h2>

          <div className="mt-16 grid gap-6 text-left md:grid-cols-2">
            {[
              "Weekly 1:1 Zoom calls with focused coaching every single week",
              "Daily coach access via my custom app, Monday through Saturday",
              "Weekly digital check-ins for accountability and pattern tracking",
              "3 private yoga or fitness sessions tailored to your body",
              "Full Yoga Studio membership included free — $19/month value",
              "2 post-program maintenance sessions included",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-white/15 bg-white/10 p-7"
              >
                <p className="text-xl leading-8">✦ {item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="image-card h-[560px] rounded-[42px] shadow-soft" />

          <div>
            <p className="font-script text-5xl text-brand-pink">
              The Real Fix
            </p>

            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
              You&apos;ve tried quick fixes. Now it&apos;s time for the real
              fix.
            </h2>

            <p className="mt-8 text-lg leading-9 text-brand-green/75">
              This program is for the woman who needs structure, support, and a
              plan that works with real life — not against it.
            </p>

            <p className="mt-6 text-lg leading-9 text-brand-green/75">
              Together, we focus on the habits underneath the results:
              nourishment, movement, mindset, consistency, and compassion.
            </p>
          </div>
        </div>
      </section>

      <section id="apply" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl rounded-[42px] bg-brand-soft p-10 text-center md:p-16">
          <p className="font-script text-5xl text-brand-coral">
            Ready to reset?
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            One that lasts.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/75">
            Apply for Modern Goddess Reset and begin building the foundation
            that carries you beyond the next 12 weeks.
          </p>

          <Link
            href="mailto:hello@example.com"
            className="mt-10 inline-flex rounded-full bg-brand-green px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-coral"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-green/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serifDisplay text-lg tracking-[0.22em] md:text-xl"
        >
          BRIANNA WOHNER
        </Link>

        <div className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.18em] md:flex">
          <Link href="/#about">About</Link>
          <Link href="/coaching">Coaching</Link>
          <Link href="/#yoga">Yoga</Link>
          <Link href="/#testimonials">Praise</Link>
        </div>

        <Link
          href="#apply"
          className="rounded-full bg-brand-green px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-brand-coral md:text-sm"
        >
          Book a Call
        </Link>
      </nav>
    </header>
  );
}