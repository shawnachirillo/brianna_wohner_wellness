import Image from "next/image";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  image: string;
  href: string;
  isPublished: boolean;
};

const events: EventItem[] = [
  {
    id: "1",
    title: "Women’s Wellness Workshop",
    date: "September 26, 2026",
    time: "1:00 PM – 3:00 PM",
    location: "Milwaukee, WI",
    description:
      "An intentional afternoon centered on sustainable wellness, nourishment, and reconnecting with yourself.",
    image: "/images/side_portrait.png",
    href: "#",
    isPublished: true,
  },
  {
    id: "2",
    title: "Sunday Reset",
    date: "October 4, 2026",
    time: "10:00 AM – 11:30 AM",
    location: "Milwaukee, WI",
    description:
      "A slower Sunday experience focused on movement, breath, reflection, and resetting for the week ahead.",
    image: "/images/blue_portrait.png",
    href: "#",
    isPublished: true,
  },
];

export default function EventsGrid() {
  const publishedEvents = events.filter((event) => event.isPublished);

  return (
    <section className="bg-brand-soft px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-brand-pink md:text-5xl">
            Come Gather
          </p>

          <h1 className="mt-3 font-serifDisplay text-5xl leading-tight text-brand-green md:text-7xl">
            Upcoming Events
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/70">
            Join Brianna for workshops, community gatherings, wellness
            experiences, and special events.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {publishedEvents.map((event) => (
            <article
              key={event.id}
              className="
                group overflow-hidden rounded-[32px]
                bg-white shadow-soft
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-xl
              "
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-105
                  "
                />

                <div
                  className="
                    absolute left-5 top-5
                    rounded-full bg-white/90
                    px-4 py-2
                    text-xs font-bold uppercase
                    tracking-[0.14em]
                    text-brand-coral
                    backdrop-blur-sm
                  "
                >
                  {event.date}
                </div>
              </div>

              <div className="flex h-full flex-col p-7 md:p-8">
                <h2 className="font-serifDisplay text-4xl leading-tight text-brand-green">
                  {event.title}
                </h2>

                <div className="mt-4 space-y-1 text-sm text-brand-green/60">
                  {event.time && <p>{event.time}</p>}
                  {event.location && <p>{event.location}</p>}
                </div>

                <p className="mt-5 leading-7 text-brand-green/70">
                  {event.description}
                </p>

                <div className="mt-7">
                  <Link
                    href={event.href}
                    target={event.href === "#" ? undefined : "_blank"}
                    rel={
                      event.href === "#"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="
                      inline-flex items-center gap-3
                      rounded-full bg-brand-coral
                      px-6 py-3.5
                      text-xs font-bold uppercase
                      tracking-[0.14em]
                      text-white
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:bg-brand-pink
                    "
                  >
                    View Event
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {publishedEvents.length === 0 && (
          <div className="mt-16 rounded-[32px] bg-white px-6 py-20 text-center shadow-soft">
            <p className="font-script text-4xl text-brand-pink">
              More coming soon
            </p>

            <p className="mt-3 text-brand-green/65">
              New events and wellness experiences will be added here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}