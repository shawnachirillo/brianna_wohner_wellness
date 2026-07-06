import Link from "next/link";
import Image from "next/image";



export default function ServicesBar() {
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