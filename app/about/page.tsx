import Image from "next/image";
import Link from "next/link";


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
                src="/images/side_portrait.png"
                alt="Brianna Wohner"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="relative">
            <p className="font-script text-5xl text-brand-coral">
              Hi, I'm Bri
            </p>

            <h1 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-7xl">
              Your new wellness bestie.
            </h1>

            <p className="mt-8 text-xl leading-9 text-brand-green/75">
              I know what it feels like to be stuck. I&apos;ve been exactly
              where you are.
            </p>

            <div className="mt-8 space-y-6 text-lg leading-9 text-brand-green/75">
              <p>
                Battling depression, anxiety, a sugar addiction I couldn&apos;t
                shake, and a body I didn&apos;t recognize. I tried everything
                and nothing worked. Until I stopped dieting and started
                building a life I actually loved living in.
              </p>

              <p>
                I lost 52 pounds, 4 dress sizes, and gained confidence I never
                knew I had. And I&apos;ve kept it off for over 15 years. Not
                through restriction, but through the exact method I now teach.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-brand-soft px-6 py-28">
  <div className="mx-auto max-w-7xl">

    <p className="text-center font-script text-5xl text-brand-coral">
      My Transformation
    </p>

    <h2 className="mt-4 text-center font-serifDisplay text-5xl leading-tight">
      I never ask women to go somewhere I've never been.
    </h2>

    <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-brand-green/75">
      I know what it's like to feel uncomfortable in your body. These photos
      remind me why this work matters.
    </p>

    <div className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_0.8fr_1.2fr]">

      {/* Before 1 */}
      <div>
        <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-coral">
          Before
        </p>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-soft">
          <Image
            src="/images/before_1.jpg"
            alt="Before transformation"
            width={500}
            height={700}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* Before 2 */}
      <div>
        <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-coral">
          Before
        </p>

        <div className="overflow-hidden rounded-[32px] bg-white shadow-soft">
          <Image
            src="/images/before_2.jpg"
            alt="Before transformation"
            width={500}
            height={700}
            className="w-full object-cover"
          />
        </div>
      </div>

      {/* After */}
      <div>
        <p className="mb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-green">
          After
        </p>

        <div className="overflow-hidden rounded-[40px] bg-white shadow-soft">
          <Image
            src="/images/after.png"
            alt="After transformation"
            width={700}
            height={900}
            className="w-full object-cover"
          />
        </div>
      </div>

    </div>
    <div className="mx-auto mt-20 max-w-4xl text-center">

<p className="font-script text-5xl text-brand-pink">
  52 pounds.
</p>

<h3 className="mt-4 font-serifDisplay text-4xl leading-tight">
  More importantly...
</h3>

<p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-brand-green/75">
  I gained confidence, peace, freedom around food, and a life I genuinely
  love living.
</p>

</div>
  </div>
</section>

      <section className="bg-brand-green px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-script text-5xl text-brand-gold">
            The Modern Goddess Method
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            I built this because I needed it to exist.
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/80">
            I&apos;m not a coach who just read a book. I&apos;m a coach who
            lived it as a mom, a wife, a business owner, with a full life and
            real responsibilities. Now it&apos;s here for you.
          </p>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="font-script text-5xl text-brand-pink">
              No more quick-fix lies.
            </p>

            <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
              Natural weight loss without restriction, shame, or starting over
              every Monday.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-9 text-brand-green/75">
            <p>
              I&apos;m here to disrupt the health industry with no drugs, no fad
              diets, no quick-fix lies.
            </p>

            <p>
              I help ambitious women lose weight naturally and reclaim their
              energy, without calorie counting, restriction, or starting over
              every Monday. Dessert included!
            </p>

            <p>
              My passion is empowering women to love themselves deeply through
              mindset coaching and nourishing food.
            </p>

            <Link
              href="/coaching"
              className="mt-8 inline-flex rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-green"
            >
              Work With Me
            </Link>
          </div>
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
          <Link href="/about">About</Link>
          <Link href="/coaching">Coaching</Link>
          {/* <Link href="/#yoga">Yoga</Link> */}
          <Link href="/#testimonials">Praise</Link>
        </div>

        <Link
          href="/coaching"
          className="rounded-full bg-brand-coral px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-brand-pink md:text-sm"
        >
          Book a Call
        </Link>
        
      </nav>
    </header>
    
  );
}