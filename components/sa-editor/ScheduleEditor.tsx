"use client";

import { useEffect, useMemo, useState } from "react";
import type { ScheduleEvent } from "@/app/sa-editor/page";

type Props = {
  initialEvents: ScheduleEvent[];
};

type PublishStatus =
  | "idle"
  | "publishing"
  | "success"
  | "error";

type DeleteStatus =
  | "idle"
  | "deleting"
  | "error";

function formatDate(dateString: string) {
  if (!dateString) {
    return {
      month: "DATE",
      day: "—",
      weekday: "Choose a date",
    };
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return {
    month: date
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase(),
    day: date.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
      }
    ),
    weekday: date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    ),
  };
}

function makeSlug(
  date: string,
  title: string
) {
  const titleSlug =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    "event";

  return `${
    date || "schedule"
  }-${titleSlug}`;
}

export default function ScheduleEditor({
  initialEvents,
}: Props) {
  const [events, setEvents] =
    useState<ScheduleEvent[]>(
      initialEvents
    );

  const [draft, setDraft] =
    useState<ScheduleEvent | null>(
      null
    );

  const [isNew, setIsNew] =
    useState(false);

  const [
    publishStatus,
    setPublishStatus,
  ] = useState<PublishStatus>("idle");

  const [
    publishMessage,
    setPublishMessage,
  ] = useState("");

  const [
    deleteStatus,
    setDeleteStatus,
  ] = useState<DeleteStatus>("idle");

  const [
    deleteMessage,
    setDeleteMessage,
  ] = useState("");

  const inputClass =
    "w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const textareaClass =
    "w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const labelClass =
    "mb-2 block text-sm font-medium";

  async function refreshFromGitHub() {
    try {
      const response = await fetch(
        "/api/sa-editor/schedule-list",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const result =
        await response.json();

      if (
        Array.isArray(result.events)
      ) {
        setEvents(result.events);
      }
    } catch (error) {
      console.error(
        "Could not refresh schedule:",
        error
      );
    }
  }

  useEffect(() => {
    refreshFromGitHub();
  }, []);

  function resetMessages() {
    setPublishStatus("idle");
    setPublishMessage("");
    setDeleteStatus("idle");
    setDeleteMessage("");
  }

  function openEvent(
    event: ScheduleEvent
  ) {
    setDraft({ ...event });
    setIsNew(false);
    resetMessages();
  }

  function addEvent() {
    const now = Date.now();

    setDraft({
      slug: `new-event-${now}`,
      id: `event-${now}`,
      title: "",
      category: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      thrivecartUrl: "#",
      isPublished: true,
    });

    setIsNew(true);
    resetMessages();
  }

  function closeEditor() {
    setDraft(null);
    setIsNew(false);
    resetMessages();
  }

  function updateDraft(
    field: keyof ScheduleEvent,
    value: string | boolean
  ) {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });

    setPublishStatus("idle");
    setPublishMessage("");
  }

  async function publishEvent() {
    if (!draft) {
      return;
    }

    if (!draft.title.trim()) {
      setPublishStatus("error");
      setPublishMessage(
        "Please enter an event title."
      );
      return;
    }

    if (!draft.date) {
      setPublishStatus("error");
      setPublishMessage(
        "Please choose a date."
      );
      return;
    }

    if (!draft.startTime.trim()) {
      setPublishStatus("error");
      setPublishMessage(
        "Please enter a start time."
      );
      return;
    }

    try {
      setPublishStatus(
        "publishing"
      );
      setPublishMessage(
        isNew
          ? "Creating event..."
          : "Publishing changes..."
      );

      const payload: ScheduleEvent = {
        ...draft,
        title: draft.title.trim(),
        category:
          draft.category.trim(),
        startTime:
          draft.startTime.trim(),
        endTime:
          draft.endTime?.trim() ||
          "",
        location:
          draft.location?.trim() ||
          "",
        description:
          draft.description?.trim() ||
          "",
        thrivecartUrl:
          draft.thrivecartUrl.trim() ||
          "#",
        slug: isNew
          ? makeSlug(
              draft.date,
              draft.title
            )
          : draft.slug,
      };

      const response = await fetch(
        "/api/sa-editor/schedule",
        {
          method: isNew
            ? "POST"
            : "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Publishing failed."
        );
      }

      setEvents((current) => {
        const withoutCurrent =
          current.filter(
            (item) =>
              item.slug !==
                payload.slug &&
              item.slug !==
                draft.slug
          );

        return [
          ...withoutCurrent,
          payload,
        ].sort(
          (a, b) =>
            new Date(
              a.date
            ).getTime() -
            new Date(
              b.date
            ).getTime()
        );
      });

      setDraft(payload);
      setIsNew(false);

      await refreshFromGitHub();

      setPublishStatus("success");
      setPublishMessage(
        "Published successfully. Your live site may take 1–3 minutes to update."
      );
    } catch (error) {
      console.error(error);

      setPublishStatus("error");
      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Publishing failed. Please try again."
      );
    }
  }

  async function deleteEvent() {
    if (!draft) {
      return;
    }

    if (isNew) {
      closeEditor();
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${draft.title}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteStatus("deleting");
      setDeleteMessage("");

      const response = await fetch(
        "/api/sa-editor/schedule",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            slug: draft.slug,
            title: draft.title,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Deleting failed."
        );
      }

      setEvents((current) =>
        current.filter(
          (item) =>
            item.slug !==
            draft.slug
        )
      );

      closeEditor();
    } catch (error) {
      console.error(error);

      setDeleteStatus("error");
      setDeleteMessage(
        error instanceof Error
          ? error.message
          : "Deleting failed."
      );
    }
  }

  const formattedDate = useMemo(
    () =>
      formatDate(
        draft?.date || ""
      ),
    [draft?.date]
  );

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(
            a.date
          ).getTime() -
          new Date(
            b.date
          ).getTime()
      ),
    [events]
  );

  if (!draft) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-black/40">
              Schedule
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              Upcoming events
            </h3>
          </div>

          <button
            type="button"
            onClick={addEvent}
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            + Add Event
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-black/10 bg-white">
          {sortedEvents.length >
          0 ? (
            sortedEvents.map(
              (event) => (
                <button
                  key={event.slug}
                  type="button"
                  onClick={() =>
                    openEvent(event)
                  }
                  className="flex w-full items-center justify-between gap-5 border-b border-black/10 px-6 py-5 text-left transition last:border-b-0 hover:bg-black/[0.025]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-lg font-semibold">
                        {event.title}
                      </h4>

                      {!event.isPublished && (
                        <span className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-black/45">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-black/45">
                      {event.date}
                      {event.startTime
                        ? ` · ${event.startTime}`
                        : ""}
                      {event.category
                        ? ` · ${event.category}`
                        : ""}
                    </p>
                  </div>

                  <span className="text-xl text-black/30">
                    →
                  </span>
                </button>
              )
            )
          ) : (
            <div className="px-6 py-16 text-center text-sm text-black/45">
              No schedule events yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={closeEditor}
        className="mb-5 text-sm font-medium text-black/50 hover:text-black"
      >
        ← Back to Schedule
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-sm text-black/40">
              {isNew
                ? "New schedule event"
                : "Edit schedule event"}
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              {draft.title ||
                "Untitled Event"}
            </h3>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                Title
              </span>

              <input
                className={
                  inputClass
                }
                value={draft.title}
                onChange={(e) =>
                  updateDraft(
                    "title",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                Category
              </span>

              <input
                className={
                  inputClass
                }
                value={
                  draft.category
                }
                onChange={(e) =>
                  updateDraft(
                    "category",
                    e.target.value
                  )
                }
                placeholder="Yoga, Wellness, Workshop..."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span
                  className={
                    labelClass
                  }
                >
                  Date
                </span>

                <input
                  type="date"
                  className={
                    inputClass
                  }
                  value={
                    draft.date
                  }
                  onChange={(e) =>
                    updateDraft(
                      "date",
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="block">
                <span
                  className={
                    labelClass
                  }
                >
                  Start Time
                </span>

                <input
                  className={
                    inputClass
                  }
                  value={
                    draft.startTime
                  }
                  onChange={(e) =>
                    updateDraft(
                      "startTime",
                      e.target.value
                    )
                  }
                  placeholder="10:00 AM"
                />
              </label>
            </div>

            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                End Time
              </span>

              <input
                className={
                  inputClass
                }
                value={
                  draft.endTime || ""
                }
                onChange={(e) =>
                  updateDraft(
                    "endTime",
                    e.target.value
                  )
                }
                placeholder="11:30 AM"
              />
            </label>

            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                Location
              </span>

              <input
                className={
                  inputClass
                }
                value={
                  draft.location || ""
                }
                onChange={(e) =>
                  updateDraft(
                    "location",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                Description
              </span>

              <textarea
                rows={5}
                className={
                  textareaClass
                }
                value={
                  draft.description ||
                  ""
                }
                onChange={(e) =>
                  updateDraft(
                    "description",
                    e.target.value
                  )
                }
              />
            </label>

            <label className="block">
              <span
                className={
                  labelClass
                }
              >
                ThriveCart / Registration Link
              </span>

              <input
                className={
                  inputClass
                }
                value={
                  draft.thrivecartUrl
                }
                onChange={(e) =>
                  updateDraft(
                    "thrivecartUrl",
                    e.target.value
                  )
                }
                placeholder="# or https://..."
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-4">
              <div>
                <p className="text-sm font-medium">
                  Published
                </p>

                <p className="mt-1 text-xs text-black/45">
                  Only published events appear on the live Schedule page.
                </p>
              </div>

              <input
                type="checkbox"
                checked={
                  draft.isPublished
                }
                onChange={(e) =>
                  updateDraft(
                    "isPublished",
                    e.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>
          </div>

          <div className="mt-8 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={publishEvent}
              disabled={
                publishStatus ===
                "publishing"
              }
              className="w-full rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {publishStatus ===
              "publishing"
                ? "Publishing..."
                : "Save & Publish"}
            </button>

            {publishMessage && (
              <p
                className={`mt-3 text-center text-xs ${
                  publishStatus ===
                  "error"
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {publishMessage}
              </p>
            )}

            <button
              type="button"
              onClick={deleteEvent}
              disabled={
                deleteStatus ===
                "deleting"
              }
              className="mt-3 w-full rounded-full border border-red-200 px-5 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-40"
            >
              {isNew
                ? "Cancel New Event"
                : deleteStatus ===
                    "deleting"
                  ? "Deleting..."
                  : "Delete Event"}
            </button>

            {deleteMessage && (
              <p className="mt-3 text-center text-xs text-red-600">
                {deleteMessage}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-brand-soft p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium">
              Live Preview
            </p>

            <p className="mt-1 text-sm text-black/40">
              Preview of this Schedule row.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-brand-green/10 bg-white shadow-soft">
            <div className="grid gap-5 px-6 py-7 md:grid-cols-[110px_1fr] md:items-center">
              <div className="flex items-center gap-4 md:block md:text-center">
                <div className="flex h-[74px] w-[74px] shrink-0 flex-col items-center justify-center rounded-full bg-brand-pink/15 md:mx-auto">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                    {
                      formattedDate.month
                    }
                  </span>

                  <span className="font-serifDisplay text-3xl leading-none">
                    {
                      formattedDate.day
                    }
                  </span>
                </div>

                <p className="text-sm font-semibold text-brand-green/60 md:mt-3">
                  {
                    formattedDate.weekday
                  }
                </p>
              </div>

              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-[0.14em] text-brand-coral">
                  {draft.category ||
                    "Category"}
                </span>

                <h4 className="mt-2 font-serifDisplay text-4xl leading-tight text-brand-green">
                  {draft.title ||
                    "Event title"}
                </h4>

                {draft.description && (
                  <p className="mt-3 text-sm leading-6 text-brand-green/65">
                    {
                      draft.description
                    }
                  </p>
                )}

                <div className="mt-5 text-sm leading-6">
                  <p className="font-semibold text-brand-green">
                    {draft.startTime ||
                      "Start time"}
                    {draft.endTime
                      ? ` – ${draft.endTime}`
                      : ""}
                  </p>

                  {draft.location && (
                    <p className="mt-1 text-brand-green/60">
                      {
                        draft.location
                      }
                    </p>
                  )}
                </div>

                <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-brand-coral px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
                  Reserve Spot
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>

          {!draft.isPublished && (
            <div className="mt-4 rounded-2xl border border-dashed border-black/15 px-4 py-3 text-center text-sm text-black/45">
              This event is currently unpublished and will not appear on the live Schedule page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
