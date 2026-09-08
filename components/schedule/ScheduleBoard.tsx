import Link from "next/link";
import {
  scheduleEvents,
  type ScheduleEvent,
} from "@/data/schedule";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return {
    month: date
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase(),

    day: date.toLocaleDateString("en-US", {
      day: "numeric",
    }),

    weekday: date.toLocaleDateString("en-US", {
      weekday: "long",
    }),
  };
}

function EventRow({ event }: { event: ScheduleEvent }) {
  const formattedDate = formatDate(event.date);

  return (
    <Link
      href={event.thrivecartUrl}
      target={event.thrivecartUrl === "#" ? undefined : "_blank"}
      rel={
        event.thrivecartUrl === "#"
          ? undefined
          : "noopener noreferrer"
      }
      className="
        group
        grid gap-5
        border-b border-brand-green/10
        px-6 py-7
        transition-all duration-300
        last:border-b-0
        hover:relative
        hover:z-10
        hover:-translate-y-1
        hover:bg-brand-pink/[0.08]
        hover:shadow-soft
        md:grid-cols-[120px_1fr_190px_160px]
        md:items-center
        md:px-8
      "
    >
      {/* DATE */}
      <div className="flex items-center gap-4 md:block md:text-center">
        <div
          className="
            flex h-[74px] w-[74px]
            shrink-0 flex-col
            items-center justify-center
            rounded-full
            bg-brand-pink/15
            transition-all duration-300
            group-hover:scale-105
            group-hover:bg-brand-pink
            group-hover:text-white
            md:mx-auto
          "
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
            {formattedDate.month}
          </span>

          <span className="font-serifDisplay text-3xl leading-none">
            {formattedDate.day}
          </span>
        </div>

        <p className="text-sm font-semibold text-brand-green/60 md:mt-3">
          {formattedDate.weekday}
        </p>
      </div>

      {/* EVENT INFO */}
      <div>
        <span
          className="
            inline-block
            text-xs font-bold uppercase
            tracking-[0.14em]
            text-brand-coral
          "
        >
          {event.category}
        </span>

        <h2
          className="
            mt-2
            font-serifDisplay
            text-3xl leading-tight
            text-brand-green
            transition-colors duration-300
            group-hover:text-brand-coral
            md:text-4xl
          "
        >
          {event.title}
        </h2>

        {event.description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-green/65">
            {event.description}
          </p>
        )}
      </div>

      {/* TIME / LOCATION */}
      <div className="text-sm leading-6">
        <p className="font-semibold text-brand-green">
          {event.startTime}
          {event.endTime && ` – ${event.endTime}`}
        </p>

        {event.location && (
          <p className="mt-1 text-brand-green/60">
            {event.location}
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="flex md:justify-end">
        <span
          className="
            inline-flex items-center gap-3
            rounded-full
            bg-brand-coral
            px-6 py-3
            text-xs font-bold uppercase
            tracking-[0.14em]
            text-white
            transition-all duration-300
            group-hover:translate-x-1
            group-hover:bg-brand-pink
          "
        >
          Reserve Spot
          <span
            className="
              transition-transform duration-300
              group-hover:translate-x-1
            "
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function ScheduleBoard() {
  const publishedEvents = scheduleEvents
    .filter((event) => event.isPublished)
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    );

  return (
    <section className="relative overflow-hidden bg-brand-soft px-4 py-20 md:px-6 md:py-28">
      {/* Decorative circles */}
      <div
        className="
          pointer-events-none
          absolute -left-24 top-32
          h-72 w-72
          rounded-full
          border border-brand-pink/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute -right-32 bottom-20
          h-96 w-96
          rounded-full
          border border-brand-gold/30
        "
      />

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-script text-4xl text-brand-pink md:text-5xl">
            Find Your Moment
          </p>

          <h1 className="mt-3 font-serifDisplay text-5xl leading-tight md:text-7xl">
            Upcoming Schedule
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-green/70">
            Explore upcoming classes, workshops, wellness experiences,
            and private sessions.
          </p>
        </div>

        {/* SCHEDULE */}
        <div
          className="
            mt-14
            overflow-hidden
            rounded-[36px]
            border border-brand-green/10
            bg-white
            shadow-soft
          "
        >
          {/* DESKTOP HEADER */}
          <div
            className="
              hidden
              bg-brand-green
              px-8 py-4
              text-xs font-bold uppercase
              tracking-[0.14em]
              text-white
              md:grid
              md:grid-cols-[120px_1fr_190px_160px]
            "
          >
            <span className="text-center">Date</span>
            <span>Experience</span>
            <span>Time + Location</span>
            <span className="text-right">Registration</span>
          </div>

          {publishedEvents.length > 0 ? (
            publishedEvents.map((event) => (
              <EventRow
                key={event.id}
                event={event}
              />
            ))
          ) : (
            <div className="px-6 py-20 text-center">
              <p className="font-script text-4xl text-brand-pink">
                More coming soon
              </p>

              <p className="mt-3 text-brand-green/65">
                New sessions and events will be added here.
              </p>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-brand-green/50">
          Schedule and availability are subject to change.
        </p>
      </div>
    </section>
  );
}