"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "@/app/sa-editor/page";

type Props = {
  initialEvents: EventItem[];
};

type PublishStatus = "idle" | "publishing" | "success" | "error";
type DeleteStatus = "idle" | "deleting" | "error";
type UploadStatus = "idle" | "uploading" | "error";

function makeSlug(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `event-${Date.now()}`
  );
}

function formatEventDate(dateString: string) {
  if (!dateString) {
    return "Choose a date";
  }

  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getEditorImageSrc(image: string) {
  if (image.startsWith("/uploads/")) {
    return `/api/sa-editor/media?path=${encodeURIComponent(image)}`;
  }

  return image;
}

export default function EventsEditor({ initialEvents }: Props) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [draft, setDraft] = useState<EventItem | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [publishStatus, setPublishStatus] =
    useState<PublishStatus>("idle");
  const [publishMessage, setPublishMessage] = useState("");

  const [deleteStatus, setDeleteStatus] =
    useState<DeleteStatus>("idle");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [uploadStatus, setUploadStatus] =
    useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [galleryPreviews, setGalleryPreviews] = useState<
    Record<number, string>
  >({});

  const inputClass =
    "w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const textareaClass =
    "w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const labelClass = "mb-2 block text-sm font-medium";

  async function refreshFromGitHub() {
    try {
      const response = await fetch("/api/sa-editor/events-list", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      if (Array.isArray(result.events)) {
        setEvents(result.events);
      }
    } catch (error) {
      console.error("Could not refresh events:", error);
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
    setUploadStatus("idle");
    setUploadMessage("");
  }

  function openEvent(event: EventItem) {
    setDraft({
      ...event,
      gallery: [...(event.gallery || [])],
    });

    setIsNew(false);
    setImagePreview(null);
    setGalleryPreviews({});
    resetMessages();
  }

  function addEvent() {
    const now = Date.now();

    setDraft({
      slug: `new-event-${now}`,
      id: `event-${now}`,
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      image: "",
      href: "#",
      gallery: [],
      isPublished: true,
    });

    setIsNew(true);
    setImagePreview(null);
    setGalleryPreviews({});
    resetMessages();
  }

  function closeEditor() {
    setDraft(null);
    setIsNew(false);
    setImagePreview(null);
    setGalleryPreviews({});
    resetMessages();
  }

  function updateDraft(
    field: keyof EventItem,
    value: string | boolean | string[]
  ) {
    setDraft((current) => {
      if (!current) return current;

      return {
        ...current,
        [field]: value,
      };
    });

    setPublishStatus("idle");
    setPublishMessage("");
  }

  async function fileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Could not read image."));
        }
      };

      reader.onerror = () => reject(new Error("Could not read image."));

      reader.readAsDataURL(file);
    });
  }

  async function uploadFile(file: File) {
    const dataUrl = await fileToDataUrl(file);

    const response = await fetch("/api/sa-editor/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        base64: dataUrl,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Image upload failed.");
    }

    return {
      path: result.path as string,
      preview: dataUrl,
    };
  }

  async function uploadMainImage(file: File) {
    try {
      setUploadStatus("uploading");
      setUploadMessage("Uploading event image...");

      const uploaded = await uploadFile(file);

      setImagePreview(uploaded.preview);
      updateDraft("image", uploaded.path);

      setUploadStatus("idle");
      setUploadMessage("Image uploaded ✓");
    } catch (error) {
      console.error(error);

      setUploadStatus("error");
      setUploadMessage("Image upload failed. Please try again.");
    }
  }

  async function uploadGalleryImage(file: File) {
    if (!draft) return;

    try {
      setUploadStatus("uploading");
      setUploadMessage("Uploading gallery image...");

      const uploaded = await uploadFile(file);

      const currentGallery = draft.gallery || [];
      const newIndex = currentGallery.length;

      setGalleryPreviews((current) => ({
        ...current,
        [newIndex]: uploaded.preview,
      }));

      updateDraft("gallery", [...currentGallery, uploaded.path]);

      setUploadStatus("idle");
      setUploadMessage("Gallery image uploaded ✓");
    } catch (error) {
      console.error(error);

      setUploadStatus("error");
      setUploadMessage("Gallery image upload failed. Please try again.");
    }
  }

  function removeGalleryImage(index: number) {
    if (!draft) return;

    const next = (draft.gallery || []).filter(
      (_, itemIndex) => itemIndex !== index
    );

    setGalleryPreviews((current) => {
      const shifted: Record<number, string> = {};

      Object.entries(current).forEach(([key, value]) => {
        const oldIndex = Number(key);

        if (oldIndex < index) {
          shifted[oldIndex] = value;
        } else if (oldIndex > index) {
          shifted[oldIndex - 1] = value;
        }
      });

      return shifted;
    });

    updateDraft("gallery", next);
  }

  async function publishEvent() {
    if (!draft) return;

    if (!draft.title.trim()) {
      setPublishStatus("error");
      setPublishMessage("Please enter an event title.");
      return;
    }

    if (!draft.date) {
      setPublishStatus("error");
      setPublishMessage("Please choose a date.");
      return;
    }

    if (!draft.description.trim()) {
      setPublishStatus("error");
      setPublishMessage("Please enter an event description.");
      return;
    }

    if (!draft.image.trim()) {
      setPublishStatus("error");
      setPublishMessage("Please choose an event image.");
      return;
    }

    try {
      setPublishStatus("publishing");

      setPublishMessage(
        isNew ? "Creating event..." : "Publishing changes..."
      );

      const payload: EventItem = {
        ...draft,
        slug: isNew ? makeSlug(draft.title) : draft.slug,
        title: draft.title.trim(),
        time: draft.time?.trim() || "",
        location: draft.location?.trim() || "",
        description: draft.description.trim(),
        href: draft.href.trim() || "#",
        gallery: draft.gallery || [],
      };

      const response = await fetch("/api/sa-editor/events", {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Publishing failed.");
      }

      setEvents((current) => {
        const withoutCurrent = current.filter(
          (item) =>
            item.slug !== payload.slug && item.slug !== draft.slug
        );

        return [...withoutCurrent, payload].sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
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
    if (!draft) return;

    if (isNew) {
      closeEditor();
      return;
    }

    const confirmed = window.confirm(
      `Delete "${draft.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleteStatus("deleting");

      const response = await fetch("/api/sa-editor/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: draft.slug,
          title: draft.title,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Deleting failed.");
      }

      setEvents((current) =>
        current.filter((item) => item.slug !== draft.slug)
      );

      closeEditor();
    } catch (error) {
      console.error(error);

      setDeleteStatus("error");

      setDeleteMessage(
        error instanceof Error ? error.message : "Deleting failed."
      );
    }
  }

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [events]
  );

  if (!draft) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-black/40">Events</p>

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
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <button
                key={event.slug}
                type="button"
                onClick={() => openEvent(event)}
                className="flex w-full items-center justify-between gap-5 border-b border-black/10 px-6 py-5 text-left transition last:border-b-0 hover:bg-black/[0.025]"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5">
                    {event.image ? (
                      <Image
                        src={getEditorImageSrc(event.image)}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : null}
                  </div>

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
                      {event.time ? ` · ${event.time}` : ""}
                    </p>
                  </div>
                </div>

                <span className="text-xl text-black/30">→</span>
              </button>
            ))
          ) : (
            <div className="px-6 py-16 text-center text-sm text-black/45">
              No events yet.
            </div>
          )}
        </div>
      </div>
    );
  }

  const previewImage = imagePreview || getEditorImageSrc(draft.image);

  return (
    <div>
      <button
        type="button"
        onClick={closeEditor}
        className="mb-5 text-sm font-medium text-black/50 hover:text-black"
      >
        ← Back to Events
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-sm text-black/40">
              {isNew ? "New event" : "Edit event"}
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              {draft.title || "Untitled Event"}
            </h3>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className={labelClass}>Title</span>

              <input
                className={inputClass}
                value={draft.title}
                onChange={(e) => updateDraft("title", e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>Date</span>

                <input
                  type="date"
                  className={inputClass}
                  value={draft.date}
                  onChange={(e) => updateDraft("date", e.target.value)}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Time</span>

                <input
                  className={inputClass}
                  value={draft.time || ""}
                  onChange={(e) => updateDraft("time", e.target.value)}
                  placeholder="1:00 PM – 3:00 PM"
                />
              </label>
            </div>

            <label className="block">
              <span className={labelClass}>Location</span>

              <input
                className={inputClass}
                value={draft.location || ""}
                onChange={(e) => updateDraft("location", e.target.value)}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Description</span>

              <textarea
                rows={5}
                className={textareaClass}
                value={draft.description}
                onChange={(e) =>
                  updateDraft("description", e.target.value)
                }
              />
            </label>

            <label className="block">
              <span className={labelClass}>Event Link</span>

              <input
                className={inputClass}
                value={draft.href}
                onChange={(e) => updateDraft("href", e.target.value)}
                placeholder="# or https://..."
              />
            </label>

            <div>
              <span className={labelClass}>Event Image</span>

              <div className="rounded-2xl border border-black/10 p-4">
                {previewImage ? (
                  <div className="mb-4 flex items-center gap-4">
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-black/5">
                      <Image
                        src={previewImage}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <p className="min-w-0 flex-1 truncate text-sm text-black/50">
                      {imagePreview ? "New image preview" : draft.image}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/35">
                    No image selected
                  </div>
                )}

                <label className="inline-flex cursor-pointer rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                  {uploadStatus === "uploading"
                    ? "Uploading..."
                    : previewImage
                      ? "Change Image"
                      : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadStatus === "uploading"}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        uploadMainImage(file);
                      }

                      event.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <span className={labelClass}>Gallery</span>

              <div className="rounded-2xl border border-black/10 p-4">
                {(draft.gallery || []).length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(draft.gallery || []).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative overflow-hidden rounded-xl bg-black/5"
                      >
                        <div className="relative aspect-square">
                          <Image
                            src={
                              galleryPreviews[index] ||
                              getEditorImageSrc(image)
                            }
                            alt=""
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="140px"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-red-600 shadow"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4 rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/35">
                    No gallery images yet.
                  </div>
                )}

                <label className="mt-4 inline-flex cursor-pointer rounded-full border border-black/15 px-5 py-3 text-sm font-semibold">
                  {uploadStatus === "uploading"
                    ? "Uploading..."
                    : "+ Add Gallery Image"}

                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadStatus === "uploading"}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        uploadGalleryImage(file);
                      }

                      event.target.value = "";
                    }}
                  />
                </label>
              </div>

              {uploadMessage && (
                <p
                  className={`mt-3 text-xs ${
                    uploadStatus === "error"
                      ? "text-red-600"
                      : "text-green-700"
                  }`}
                >
                  {uploadMessage}
                </p>
              )}
            </div>

            <label className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 px-4 py-4">
              <div>
                <p className="text-sm font-medium">Published</p>

                <p className="mt-1 text-xs text-black/45">
                  Only published events appear on the live Events page.
                </p>
              </div>

              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(e) =>
                  updateDraft("isPublished", e.target.checked)
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
                publishStatus === "publishing" ||
                uploadStatus === "uploading"
              }
              className="w-full rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              {publishStatus === "publishing"
                ? "Publishing..."
                : "Save & Publish"}
            </button>

            {publishMessage && (
              <p
                className={`mt-3 text-center text-xs ${
                  publishStatus === "error"
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
              disabled={deleteStatus === "deleting"}
              className="mt-3 w-full rounded-full border border-red-200 px-5 py-3.5 text-sm font-semibold text-red-600 disabled:opacity-40"
            >
              {isNew
                ? "Cancel New Event"
                : deleteStatus === "deleting"
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
            <p className="text-sm font-medium">Live Preview</p>

            <p className="mt-1 text-sm text-black/40">
              Preview of this Events card.
            </p>
          </div>

          <article className="overflow-hidden rounded-[32px] bg-white shadow-soft">
            <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={draft.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="500px"
                />
              ) : null}

              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-coral backdrop-blur-sm">
                {formatEventDate(draft.date)}
              </div>
            </div>

            <div className="p-7 md:p-8">
              <h3 className="font-serifDisplay text-4xl leading-tight text-brand-green">
                {draft.title || "Event title"}
              </h3>

              <div className="mt-4 space-y-1 text-sm text-brand-green/60">
                {draft.time && <p>{draft.time}</p>}

                {draft.location && <p>{draft.location}</p>}
              </div>

              <p className="mt-5 leading-7 text-brand-green/70">
                {draft.description || "Event description"}
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-full bg-brand-coral px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
                View Event
                <span>→</span>
              </div>
            </div>
          </article>

          {!draft.isPublished && (
            <div className="mt-4 rounded-2xl border border-dashed border-black/15 px-4 py-3 text-center text-sm text-black/45">
              This event is currently unpublished and will not appear on the
              live Events page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}