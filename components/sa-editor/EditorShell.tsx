"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import HomeEditor from "@/components/sa-editor/HomeEditor";
import AboutEditor from "@/components/sa-editor/AboutEditor";
import ScheduleEditor from "@/components/sa-editor/ScheduleEditor";
import EventsEditor from "@/components/sa-editor/EventsEditor";
import CoachingEditor from "@/components/sa-editor/CoachingEditor";
import type { AboutContent, CoachingContent, EventItem, HomeContent, Offering, ScheduleEvent } from "@/app/sa-editor/page";

type EditorShellProps = {
  offerings: Offering[];
  homeContent: HomeContent;
  aboutContent: AboutContent;
  coachingContent: CoachingContent;
  scheduleEvents: ScheduleEvent[];
  events: EventItem[];
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

type ImageUploadStatus =
  | "idle"
  | "uploading"
  | "error";

const navItems = [
  "Home",
  "About",
  "Offerings",
  "Schedule",
  "Events",
  "Coaching",
];

function getEditorImageSrc(
  image: string
) {
  if (image.startsWith("/uploads/")) {
    return `/api/sa-editor/media?path=${encodeURIComponent(image)}`;
  }

  return image;
}

function makeSlug(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    `offering-${Date.now()}`
  );
}

export default function EditorShell({
  offerings,
  homeContent,
  aboutContent,
  coachingContent,
  scheduleEvents,
  events,
}: EditorShellProps) {
  const [activeSection, setActiveSection] =
    useState("Offerings");

  const [
    offeringList,
    setOfferingList,
  ] = useState<Offering[]>(offerings);

  const [
    selectedOffering,
    setSelectedOffering,
  ] = useState<Offering | null>(null);

  const [draft, setDraft] =
    useState<Offering | null>(null);

  const [
    isNewOffering,
    setIsNewOffering,
  ] = useState(false);

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
    imageUploadStatus,
    setImageUploadStatus,
  ] =
    useState<ImageUploadStatus>("idle");

  const [
    imageUploadMessage,
    setImageUploadMessage,
  ] = useState("");

  const [
    imagePreview,
    setImagePreview,
  ] = useState<string | null>(null);

  async function refreshOfferingsFromGitHub() {
    try {
      const response = await fetch(
        "/api/sa-editor/offerings-list",
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
        Array.isArray(
          result.offerings
        )
      ) {
        setOfferingList(
          result.offerings
        );
      }
    } catch (error) {
      console.error(
        "Could not refresh offerings:",
        error
      );
    }
  }

  useEffect(() => {
    refreshOfferingsFromGitHub();
  }, []);

  function resetMessages() {
    setPublishStatus("idle");
    setPublishMessage("");
    setDeleteStatus("idle");
    setImageUploadStatus("idle");
    setImageUploadMessage("");
  }

  function openOffering(
    offering: Offering
  ) {
    setSelectedOffering(offering);
    setDraft({ ...offering });
    setIsNewOffering(false);
    setImagePreview(null);
    resetMessages();
  }

  function addOffering() {
    const newOffering: Offering = {
      slug: `new-offering-${Date.now()}`,
      name: "",
      description: "",
      price: "",
      image: "",
      buttonText: "",
      buttonLink: "",
      order:
        offeringList.length + 1,
    };

    setSelectedOffering(newOffering);
    setDraft(newOffering);
    setIsNewOffering(true);
    setImagePreview(null);
    resetMessages();
  }

  function closeEditor() {
    setSelectedOffering(null);
    setDraft(null);
    setIsNewOffering(false);
    setImagePreview(null);
    resetMessages();
  }

  function updateDraft(
    field: keyof Offering,
    value: string | number
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

  async function uploadOfferingImage(
    file: File
  ) {
    if (!draft) return;

    try {
      setImageUploadStatus(
        "uploading"
      );
      setImageUploadMessage(
        "Uploading image..."
      );

      const dataUrl =
        await new Promise<string>(
          (resolve, reject) => {
            const reader =
              new FileReader();

            reader.onload = () => {
              if (
                typeof reader.result ===
                "string"
              ) {
                resolve(
                  reader.result
                );
              } else {
                reject(
                  new Error(
                    "Could not read image."
                  )
                );
              }
            };

            reader.onerror = () =>
              reject(
                new Error(
                  "Could not read image."
                )
              );

            reader.readAsDataURL(
              file
            );
          }
        );

      // Keep this separate from the
      // saved /uploads path.
      setImagePreview(dataUrl);

      const response = await fetch(
        "/api/sa-editor/uploads",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            base64: dataUrl,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Image upload failed."
        );
      }

      // GitHub path gets saved here.
      // Preview remains the local
      // data URL above.
      setDraft((current) => {
        if (!current)
          return current;

        return {
          ...current,
          image: result.path,
        };
      });

      setImageUploadStatus("idle");
      setImageUploadMessage(
        "Image uploaded ✓"
      );
    } catch (error) {
      console.error(error);

      setImagePreview(null);

      setImageUploadStatus("error");
      setImageUploadMessage(
        "Image upload failed. Please try again."
      );
    }
  }

  async function publishOffering() {
    if (!draft) return;

    const name = draft.name.trim();

    if (!name) {
      setPublishStatus("error");
      setPublishMessage(
        "Please enter an offering name."
      );
      return;
    }

    try {
      setPublishStatus(
        "publishing"
      );

      setPublishMessage(
        isNewOffering
          ? "Creating offering..."
          : "Publishing changes..."
      );

      const payload: Offering = {
        ...draft,
        name,
        slug: isNewOffering
          ? makeSlug(name)
          : draft.slug,
      };

      const response = await fetch(
        "/api/sa-editor/offerings",
        {
          method: isNewOffering
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

      setOfferingList(
        (current) => {
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
              (a.order ?? 999) -
              (b.order ?? 999)
          );
        }
      );

      setDraft(payload);
      setSelectedOffering(
        payload
      );
      setIsNewOffering(false);

      await refreshOfferingsFromGitHub();

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

  async function deleteOffering() {
    if (!draft) return;

    if (isNewOffering) {
      closeEditor();
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${draft.name}"? This cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeleteStatus(
        "deleting"
      );

      const response = await fetch(
        "/api/sa-editor/offerings",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            slug: draft.slug,
            name: draft.name,
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

      setOfferingList(
        (current) =>
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
    }
  }

  const previewImage =
    imagePreview ||
    (draft?.image
      ? getEditorImageSrc(
          draft.image
        )
      : "");

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#172d23]">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="border-r border-black/10 bg-white px-5 py-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
              Status: Available
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Website Editor
            </h1>
          </div>

          <nav className="space-y-2">
            {navItems.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setActiveSection(
                      item
                    );
                    closeEditor();
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                    activeSection ===
                    item
                      ? "bg-black text-white"
                      : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </nav>

          <div className="mt-10 border-t border-black/10 pt-6">
            <a
              href="https://brianna-wohner-wellness-theta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-black/60 hover:text-black"
            >
              View live site ↗
            </a>
          </div>
        </aside>

        <section className="px-6 py-8 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-sm text-black/45">
                Goddess Reset
              </p>

              <h2 className="mt-1 text-4xl font-semibold">
                {activeSection}
              </h2>
            </div>

            {activeSection === "Home" ? (
              <HomeEditor home={homeContent} />
            ) : activeSection === "About" ? (
              <AboutEditor about={aboutContent} />
            ) : activeSection === "Schedule" ? (
              <ScheduleEditor initialEvents={scheduleEvents} />
            ) : activeSection === "Events" ? (
              <EventsEditor initialEvents={events} />
            ) : activeSection === "Coaching" ? (
              <CoachingEditor initialContent={coachingContent} />
            ) : activeSection ===
            "Offerings" ? (
              draft ? (
                <div>
                  <button
                    type="button"
                    onClick={
                      closeEditor
                    }
                    className="mb-6 text-sm font-medium text-black/50 hover:text-black"
                  >
                    ← Back to
                    offerings
                  </button>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                      <div className="mb-8">
                        <p className="text-sm text-black/40">
                          {isNewOffering
                            ? "New offering"
                            : "Editing"}
                        </p>

                        <h3 className="mt-1 text-2xl font-semibold">
                          {draft.name ||
                            "Untitled Offering"}
                        </h3>
                      </div>

                      <div className="space-y-5">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">
                            Name
                          </span>

                          <input
                            value={
                              draft.name
                            }
                            onChange={(
                              e
                            ) =>
                              updateDraft(
                                "name",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">
                            Description
                          </span>

                          <textarea
                            rows={5}
                            value={
                              draft.description
                            }
                            onChange={(
                              e
                            ) =>
                              updateDraft(
                                "description",
                                e.target
                                  .value
                              )
                            }
                            className="w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                          />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium">
                              Price
                            </span>

                            <input
                              value={
                                draft.price ??
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                updateDraft(
                                  "price",
                                  e.target
                                    .value
                                )
                              }
                              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-sm font-medium">
                              Display
                              Order
                            </span>

                            <input
                              type="number"
                              min="1"
                              value={
                                draft.order ??
                                1
                              }
                              onChange={(
                                e
                              ) =>
                                updateDraft(
                                  "order",
                                  Number(
                                    e.target
                                      .value
                                  )
                                )
                              }
                              className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                            />
                          </label>
                        </div>

                        <div>
                          <span className="mb-2 block text-sm font-medium">
                            Image
                          </span>

                          <div className="rounded-2xl border border-black/10 p-4">
                            {previewImage ? (
                              <div className="mb-4 flex items-center gap-4">
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5">
                                  <Image
                                    src={
                                      previewImage
                                    }
                                    alt={
                                      draft.name ||
                                      "Offering image"
                                    }
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm text-black/55">
                                    {imagePreview
                                      ? "New image preview"
                                      : draft.image ||
                                        ""}
                                  </p>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview(
                                        null
                                      );

                                      setDraft(
                                        (
                                          current
                                        ) =>
                                          current
                                            ? {
                                                ...current,
                                                image:
                                                  "",
                                              }
                                            : current
                                      );
                                    }}
                                    className="mt-2 text-xs font-medium text-red-600"
                                  >
                                    Remove
                                    image
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-4 rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/35">
                                No image
                                selected
                              </div>
                            )}

                            <label className="inline-flex cursor-pointer rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                              {imageUploadStatus ===
                              "uploading"
                                ? "Uploading..."
                                : previewImage
                                  ? "Change Image"
                                  : "Upload Image"}

                              <input
                                type="file"
                                accept="image/*"
                                disabled={
                                  imageUploadStatus ===
                                  "uploading"
                                }
                                onChange={(
                                  e
                                ) => {
                                  const file =
                                    e
                                      .target
                                      .files?.[0];

                                  if (
                                    file
                                  ) {
                                    uploadOfferingImage(
                                      file
                                    );
                                  }

                                  e.target.value =
                                    "";
                                }}
                                className="hidden"
                              />
                            </label>

                            {imageUploadMessage && (
                              <p
                                className={`mt-3 text-xs ${
                                  imageUploadStatus ===
                                  "error"
                                    ? "text-red-600"
                                    : "text-green-700"
                                }`}
                              >
                                {
                                  imageUploadMessage
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">
                            Button Text
                          </span>

                          <input
                            value={
                              draft.buttonText ??
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateDraft(
                                "buttonText",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">
                            Button Link
                          </span>

                          <input
                            value={
                              draft.buttonLink ??
                              ""
                            }
                            onChange={(
                              e
                            ) =>
                              updateDraft(
                                "buttonLink",
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30"
                          />
                        </label>

                        <div className="border-t border-black/10 pt-5">
                          <button
                            type="button"
                            onClick={
                              publishOffering
                            }
                            disabled={
                              publishStatus ===
                                "publishing" ||
                              imageUploadStatus ===
                                "uploading"
                            }
                            className="w-full rounded-full bg-black px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
                          >
                            {publishStatus ===
                            "publishing"
                              ? "Publishing..."
                              : isNewOffering
                                ? "Create & Publish"
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
                              {
                                publishMessage
                              }
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={
                              deleteOffering
                            }
                            disabled={
                              deleteStatus ===
                              "deleting"
                            }
                            className="mt-3 w-full rounded-full border border-red-300 px-5 py-3.5 text-sm font-semibold text-red-600"
                          >
                            {isNewOffering
                              ? "Cancel New Offering"
                              : deleteStatus ===
                                  "deleting"
                                ? "Deleting..."
                                : "Delete Offering"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-black/10 bg-[#f8f1e4] p-6 shadow-sm">
                      <div className="mb-8">
                        <p className="text-sm font-medium">
                          Live Preview
                        </p>
                        <p className="mt-1 text-sm text-black/40">
                          Updates
                          instantly while
                          you type.
                        </p>
                      </div>

                      <div className="flex min-h-[620px] items-center justify-center">
                        <article className="flex w-full max-w-[360px] flex-col text-center">
                          <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                            <div className="absolute inset-3 rounded-full bg-brand-gold opacity-20" />

                            <div className="absolute inset-0 overflow-hidden rounded-full bg-white shadow-soft">
                              {previewImage ? (
                                <Image
                                  src={
                                    previewImage
                                  }
                                  alt={
                                    draft.name ||
                                    "Offering image"
                                  }
                                  fill
                                  unoptimized
                                  className="object-cover object-center"
                                  sizes="300px"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-black/25">
                                  No image
                                </div>
                              )}
                            </div>
                          </div>

                          <h3 className="mt-8 font-serifDisplay text-4xl leading-tight">
                            {draft.name ||
                              "Offering name"}
                          </h3>

                          <p className="mx-auto mt-4 max-w-sm leading-7 text-brand-green/70">
                            {draft.description ||
                              "Your description will appear here."}
                          </p>

                          {draft.price && (
                            <p className="mt-3 text-sm font-semibold text-brand-green/60">
                              $
                              {
                                draft.price
                              }
                            </p>
                          )}

                          {draft.buttonText &&
                            draft.buttonLink && (
                              <div className="pt-7">
                                <div className="inline-block rounded-full bg-brand-coral px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white">
                                  {
                                    draft.buttonText
                                  }
                                </div>
                              </div>
                            )}
                        </article>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold">
                        Offerings
                      </h3>
                      <p className="mt-1 text-sm text-black/50">
                        Edit, reorder,
                        add, or remove
                        offerings.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        addOffering
                      }
                      className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
                    >
                      + Add Offering
                    </button>
                  </div>

                  <div className="mt-8 space-y-3">
                    {offeringList.map(
                      (offering) => (
                        <button
                          key={
                            offering.slug
                          }
                          type="button"
                          onClick={() =>
                            openOffering(
                              offering
                            )
                          }
                          className="flex w-full items-center justify-between rounded-2xl border border-black/10 p-5 text-left"
                        >
                          <div>
                            <h4 className="font-semibold">
                              {
                                offering.name
                              }
                            </h4>

                            <p className="mt-1 text-sm text-black/45">
                              {offering.price
                                ? `$${offering.price}`
                                : "No price set"}
                            </p>
                          </div>

                          <span className="text-sm text-black/40">
                            Edit →
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-black/10 bg-white p-10 text-center text-black/40">
                {activeSection} editor
                coming next.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}