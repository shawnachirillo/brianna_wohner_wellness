import Link from "next/link";
import Image from "next/image";


const pillars = [
    ["MINDSET", "Break the all-or-nothing cycle. Build a relationship with food and your body that doesn't require perfection to work."],
    ["NUTRITION", "No calorie counting. No restriction. Real food strategies that fit your real life and include dessert."],
    ["MOVEMENT", "Find movement you actually enjoy. Yoga, strength, cardio. Whatever keeps you showing up consistently, for life."],
    ["ACCOUNTABILITY", "Weekly calls, daily app access, and a coach who genuinely celebrates every win, big and small, with you"],
  ];

export default function Pillars() {
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
  