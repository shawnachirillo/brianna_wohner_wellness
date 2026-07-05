import Link from "next/link";
import Image from "next/image";

const pillars = [
  ["MINDSET", "Break the all-or-nothing cycle. Build a relationship with food and your body that doesn't require perfection to work."],
  ["NUTRITION", "No calorie counting. No restriction. Real food strategies that fit your real life and include dessert."],
  ["MOVEMENT", "Find movement you actually enjoy. Yoga, strength, cardio. Whatever keeps you showing up consistently, for life."],
  ["ACCOUNTABILITY", "Weekly calls, daily app access, and a coach who genuinely celebrates every win, big and small, with you"],
];

const testimonials = [
  {
    title: "I lost 80 pounds, 20 pounds more than my goal weight!",
    text: "I lost 80 pounds over COVID with Bri’s coaching. She is compassionate but also keeps you accountable. I wouldn’t have been able to achieve this goal for myself without her guidance. I’m so grateful for her help.",
    name: "Jessica, Client",
  },
  {
    title: "So much clarity!",
    text: "Bri and I went on a grocery shopping tour. It gave me so much clarity and confidence to go shopping on my own.",
    name: "Leslie, Client",
  },
  {
    title: "I can bake and not binge!",
    text: "I love baking. Working with Bri has taught me that I can love baking and not overindulge on my own creations. I now give them away to friends and they love my baking too!",
    name: "Tamara, Client",
  },
  {
    title: "Now I have a better relationship with food!",
    text: "I’ve always had a horrible relationship with food and my body. Bri has taught me to see food as fuel and how to add movement into my daily routine. I love the replays when I can’t make live classes.",
    name: "Audrey, Client and Reset Studio Member",
  },
  {
    title: "No more leg pain!",
    text: "Before working with Brianna I was dealing with constant pain. Brianna makes our classes just what I need to manage my chronic pain. I can also feel circulation in my legs again!",
    name: "Riviera, Yoga Student",
  },
  {
    title: "We feel like we did when we got married!",
    text: "My wife and I ate healthy in our youth and then when we had kids we kind of fell off. When we worked with Bri, I lost over 25 pounds and my wife hit her goal. We gained time back with each other by making workouts a family activity.",
    name: "Ty, Client",
  },
  {
    title: "She’s so motivational and fun!",
    text: "I took the 6 week challenge with Bri. I loved the daily accountability texts. She’s so motivational and I was really inspired to finish the challenge strong.",
    name: "Deanna, Client",
  },
  {
    title: "Now I actually exercise!",
    text: "Working with Bri helped me to include exercise into my day and I now think differently about the foods I eat.",
    name: "Whitney, Client",
  },
  {
    title: "I hit my goal and maintained!",
    text: "Bri helped me hit my goal and I stayed on with her for maintenance coaching to help in that first year after the weight loss. My daughter got married within that time and Bri helped me stay on track so I looked and felt fabulous in my MOB dress. She is amazing and super encouraging.",
    name: "Michelle, Client",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-brand-green">
      <Header />
      <Hero />
      <ServicesBar />
      <FeaturedProgram />
      <Pillars />
      <QuoteBreak />
      <About />
      {/* <Yoga /> */}
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-green/10 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="#" className="font-serifDisplay text-lg tracking-[0.22em] md:text-xl">
          BRIANNA WOHNER
        </Link>

        <div className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.18em] md:flex">
          <Link href="#about">About</Link>
          <Link href="/coaching">Coaching</Link>
          {/* <Link href="#yoga">Yoga</Link> */}
          <Link href="#testimonials">Praise</Link>
        </div>

        <Link
          href="#contact"
          className="rounded-full bg-brand-pink px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-brand-coral md:text-sm"
        >
          Book a Call
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
     
      <Image
  src="/images/pink_flower_1.png"
  alt="pink flower"
  width={500}
  height={500}
  aria-hidden="true"
  className="pointer-events-none absolute -left-32 top-10 opacity-[0.25]"
/>
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="font-script text-4xl text-brand-coral md:text-5xl">
            Modern Goddess Coaching
          </p>

          <h1 className="mt-4 max-w-3xl font-serifDisplay text-5xl leading-[0.98] tracking-tight md:text-7xl">
            Wellness that feels like coming home to yourself.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-brand-green/75">
            Yoga, nutrition, and compassionate coaching for women ready to feel
            strong, nourished, and present in their own lives.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#contact"
              className="rounded-full bg-brand-coral px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-pink"
            >
              Start Your Journey
            </Link>

            <Link
              href="/coaching"
              className="rounded-full border border-brand-coral px-8 py-4 text-center text-sm font-bold uppercase tracking-[0.16em] hover:bg-brand-pink hover:text-white"
            >
              Explore Coaching
            </Link>
          </div>
        </div>

        <div className="relative">

<div className="overflow-hidden rounded-[42px] bg-brand-soft p-6 shadow-soft">

  <div className="relative h-[620px] overflow-hidden rounded-[34px]">

    <Image
      src="/images/BW_headshot.png"
      alt="Brianna Wohner"
      fill
      priority
      className="object-cover object-center"
    />

  </div>

</div>

<div className="absolute -bottom-10 -left-10 rounded-full bg-white px-8 py-6 shadow-soft">

  <p className="font-script text-3xl text-brand-coral">
    Yoga + Nutrition
  </p>

</div>

</div>
      </div>
    </section>
  );
}

function ServicesBar() {
  return (
    <section className="border-y border-brand-green/10 bg-brand-soft py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-4 px-6 text-center text-sm font-semibold uppercase tracking-[0.25em] text-brand-green/70">
        <span>Nutrition Coaching</span>
        <span>Yoga</span>
        <span>Weight Loss</span>
        <span>Women&apos;s Wellness</span>
        <span>Virtual Sessions</span>
      </div>
    </section>
  );
}

function FeaturedProgram() {
  return (
    <section id="coaching" className="relative overflow-hidden px-6 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="relative">
          <div className="overflow-hidden rounded-[42px] bg-brand-soft p-6 shadow-soft">
            <div className="relative h-[620px] overflow-hidden rounded-[34px]">
              <Image
                src="/images/BW_portrait_pepper.png"
                alt="Brianna Wohner"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COPY */}
        <div className="relative">

          <Image
            src="/images/WLWB pink flower 3.png"
            alt="Pink Flower"
            width={500}
            height={500}
            aria-hidden="true"
            className="
pointer-events-none
absolute
left-64
top-40
opacity-[0.12]
            transform -scale-x-100
            "
            
          />

          <p className="relative font-script text-5xl text-brand-coral">
            Signature Program
          </p>

          <h2 className="relative mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
            Modern Goddess Coaching
          </h2>

          <p className="relative mt-8 text-lg leading-9 text-brand-green/75">
            This isn't another diet. It's a coaching experience that combines
            yoga, nutrition, mindfulness, and compassionate accountability so
            you finally feel at home in your body.
          </p>

          <ul className="relative mt-10 space-y-5 text-lg text-brand-green/80">
            <li>✓ Weekly coaching</li>
            <li>✓ Nutrition guidance</li>
            {/* <li>✓ Yoga practice</li> */}
            <li>✓ Sustainable habits</li>
            <li>✓ Accountability</li>
          </ul>

          <Link
            href="/coaching"
            className="mt-12 inline-flex rounded-full bg-brand-coral px-10 py-4 font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-brand-pink"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  );
}
function Pillars() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-brand-pink">Our 4 Pillars</p>
          <h2 className="mt-3 font-serifDisplay text-5xl leading-tight">
            A softer, smarter path to sustainable wellness.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {pillars.map(([title, text], index) => (
            <article
              key={title}
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
              <h3 className="font-serifDisplay text-4xl">{title}</h3>
              <p className="mt-5 leading-7 text-brand-green/70">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuoteBreak() {
  return (
    <section className="bg-brand-green px-6 py-28 text-center text-white md:py-32">
      <p className="mx-auto max-w-5xl font-serifDisplay text-4xl leading-relaxed md:text-5xl">
        “True wellness isn&apos;t about becoming someone else. It&apos;s
        remembering who you&apos;ve always been.”
      </p>

      <p className="mt-10 text-sm uppercase tracking-[0.4em] text-brand-gold">
        — Brianna Wohner
      </p>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white px-6 py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-2">
        <div>
          <p className="font-script text-5xl text-brand-pink">Meet Brianna</p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
            Helping women reconnect with themselves.
          </h2>

          <p className="mt-8 text-lg leading-9 text-brand-green/75">
            After years of helping women transform their health, Brianna learned
            that sustainable wellness isn&apos;t created through perfection.
            It&apos;s created through compassion, movement, nutrition, and
            mindset.
          </p>

          <Link
            href="/about"
            className="mt-10 inline-flex rounded-full bg-brand-coral px-8 py-4 font-semibold uppercase tracking-[0.18em] hover:bg-brand-pink hover:text-white"
          >
            Read My Story
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[42px] bg-brand-soft shadow-soft">
  <div className="relative h-[650px]">
    <Image
      src="/images/blue_portrait.png"
      alt="Brianna Wohner"
      fill
      priority
      className="object-cover object-center"
    />
  </div>
</div>
        
      </div>
    </section>
  );
}

// function Yoga() {
//   return (
//     <section id="yoga" className="bg-brand-cream px-6 py-28">
//       <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
//         <div>
//           <p className="font-script text-5xl text-brand-coral">Practice</p>

//           <h2 className="mt-4 font-serifDisplay text-5xl leading-tight md:text-6xl">
//             Yoga for real bodies and real lives.
//           </h2>

//           <p className="mt-6 text-lg leading-8 text-brand-green/75">
//             Gentle, grounding movement designed to help women build strength,
//             release tension, and reconnect with their bodies.
//           </p>
//         </div>

//         <div className="grid gap-5 sm:grid-cols-2">
//           {["On-demand yoga", "Private sessions", "Group classes", "Wellness events"].map(
//             (item) => (
//               <div
//                 key={item}
//                 className="rounded-[28px] border border-brand-green/15 bg-white p-8 font-semibold shadow-sm"
//               >
//                 <div className="mb-8 h-1 w-16 bg-brand-gold" />
//                 <p className="font-serifDisplay text-3xl">{item}</p>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

function Testimonials() {
  return (
    <section id="testimonials" className="bg-brand-soft px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-script text-5xl text-brand-pink">Kind Words</p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            Real women. Real lives. Real results.
          </h2>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.title}
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

function CTA() {
  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-brand-green p-10 text-center text-white md:p-16">
        <p className="font-script text-5xl text-brand-gold">Ready?</p>

        <h2 className="mt-3 font-serifDisplay text-5xl leading-tight">
          Begin your next chapter feeling nourished, strong, and supported.
        </h2>

        <Link
          href="mailto:hello@example.com"
          className="mt-9 inline-flex rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-gold hover:text-brand-green"
        >
          Book a Discovery Call
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-brand-green/10 px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-center md:flex-row md:text-left">
        <p className="font-serifDisplay text-2xl tracking-[0.15em]">
          BRIANNA WOHNER
        </p>

        <p className="text-sm uppercase tracking-[0.25em] text-brand-green/60">
          Yoga • Nutrition • Coaching
        </p>
      </div>
    </footer>
  );
}