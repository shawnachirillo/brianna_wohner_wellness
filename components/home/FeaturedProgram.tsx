import Link from "next/link";
import Image from "next/image";

export default function FeaturedProgram() {
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