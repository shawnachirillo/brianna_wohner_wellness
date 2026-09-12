"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { CoachingContent } from "@/app/sa-editor/page";

type Props = {
  initialContent: CoachingContent;
};

type Section =
  | "Hero"
  | "Included"
  | "Real Fix"
  | "CTA";

type PublishStatus =
  | "idle"
  | "publishing"
  | "success"
  | "error";

type ImageUploadStatus =
  | "idle"
  | "uploading"
  | "error";

function getEditorImageSrc(
  image: string
) {
  if (image.startsWith("/uploads/")) {
    return `/api/sa-editor/media?path=${encodeURIComponent(
      image
    )}`;
  }

  return image;
}

export default function CoachingEditor({
  initialContent,
}: Props) {
  const [content, setContent] =
    useState<CoachingContent>(
      initialContent
    );
    useEffect(() => {
      async function loadLatestContent() {
        try {
          const response = await fetch(
            "/api/sa-editor/coaching",
            {
              cache: "no-store",
            }
          );
    
          if (!response.ok) {
            throw new Error(
              "Could not load latest coaching content."
            );
          }
    
          const latestContent =
            await response.json();
    
          setContent(latestContent);
        } catch (error) {
          console.error(
            "Could not refresh coaching content:",
            error
          );
        }
      }
    
      loadLatestContent();
    }, []);
  const [
    activeSection,
    setActiveSection,
  ] = useState<Section>("Hero");

  const [
    publishStatus,
    setPublishStatus,
  ] =
    useState<PublishStatus>("idle");

  const [
    publishMessage,
    setPublishMessage,
  ] = useState("");

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

  const inputClass =
    "w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const textareaClass =
    "w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const labelClass =
    "mb-2 block text-sm font-medium";

  function clearStatus() {
    setPublishStatus("idle");
    setPublishMessage("");
  }

  function updateHero(
    field: keyof CoachingContent["hero"],
    value: string | string[]
  ) {
    setContent((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }));

    clearStatus();
  }

  function updateIncluded(
    field:
      keyof CoachingContent["included"],
    value: string | string[]
  ) {
    setContent((current) => ({
      ...current,
      included: {
        ...current.included,
        [field]: value,
      },
    }));

    clearStatus();
  }

  function updateRealFix(
    field:
      keyof CoachingContent["realFix"],
    value: string | string[]
  ) {
    setContent((current) => ({
      ...current,
      realFix: {
        ...current.realFix,
        [field]: value,
      },
    }));

    clearStatus();
  }

  function updateCTA(
    field: keyof CoachingContent["cta"],
    value: string
  ) {
    setContent((current) => ({
      ...current,
      cta: {
        ...current.cta,
        [field]: value,
      },
    }));

    clearStatus();
  }

  function updateHighlight(
    index: number,
    value: string
  ) {
    const highlights = [
      ...content.hero.highlights,
    ];

    highlights[index] = value;

    updateHero(
      "highlights",
      highlights
    );
  }

  function addHighlight() {
    updateHero(
      "highlights",
      [
        ...content.hero.highlights,
        "",
      ]
    );
  }

  function removeHighlight(
    index: number
  ) {
    updateHero(
      "highlights",
      content.hero.highlights.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function updateIncludedItem(
    index: number,
    value: string
  ) {
    const items = [
      ...content.included.items,
    ];

    items[index] = value;

    updateIncluded("items", items);
  }

  function addIncludedItem() {
    updateIncluded(
      "items",
      [
        ...content.included.items,
        "",
      ]
    );
  }

  function removeIncludedItem(
    index: number
  ) {
    updateIncluded(
      "items",
      content.included.items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  function updateRealFixParagraph(
    index: number,
    value: string
  ) {
    const paragraphs = [
      ...content.realFix.paragraphs,
    ];

    paragraphs[index] = value;

    updateRealFix(
      "paragraphs",
      paragraphs
    );
  }

  function addRealFixParagraph() {
    updateRealFix(
      "paragraphs",
      [
        ...content.realFix.paragraphs,
        "",
      ]
    );
  }

  function removeRealFixParagraph(
    index: number
  ) {
    updateRealFix(
      "paragraphs",
      content.realFix.paragraphs.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  async function uploadRealFixImage(
    file: File
  ) {
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
            fileName:
              file.name,

            fileType:
              file.type,

            base64:
              dataUrl,
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

      setContent((current) => ({
        ...current,

        realFix: {
          ...current.realFix,

          image:
            result.path,
        },
      }));

      clearStatus();

      setImageUploadStatus(
        "idle"
      );

      setImageUploadMessage(
        "Image uploaded ✓"
      );
    } catch (error) {
      console.error(error);

      setImagePreview(null);

      setImageUploadStatus(
        "error"
      );

      setImageUploadMessage(
        "Image upload failed. Please try again."
      );
    }
  }

  function removeRealFixImage() {
    setImagePreview(null);

    setContent((current) => ({
      ...current,

      realFix: {
        ...current.realFix,
        image: "",
      },
    }));

    setImageUploadStatus("idle");
    setImageUploadMessage("");

    clearStatus();
  }

  async function saveAndPublish() {
    try {
      setPublishStatus(
        "publishing"
      );

      setPublishMessage(
        "Publishing changes..."
      );

      const response =
        await fetch(
          "/api/sa-editor/coaching",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                content
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

      setPublishStatus(
        "success"
      );

      setPublishMessage(
        "Published successfully. Your live site may take 1–3 minutes to update."
      );
    } catch (error) {
      console.error(error);

      setPublishStatus(
        "error"
      );

      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Publishing failed. Please try again."
      );
    }
  }

  const realFixImage =
    imagePreview ||
    (
      content.realFix.image
        ? getEditorImageSrc(
            content.realFix.image
          )
        : ""
    );

  function HeroFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span
            className={
              labelClass
            }
          >
            Eyebrow
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.hero
                .eyebrow
            }
            onChange={(e) =>
              updateHero(
                "eyebrow",
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
            Heading
          </span>

          <textarea
            rows={3}
            className={
              textareaClass
            }
            value={
              content.hero
                .heading
            }
            onChange={(e) =>
              updateHero(
                "heading",
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
            Intro
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.hero
                .intro
            }
            onChange={(e) =>
              updateHero(
                "intro",
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
              content.hero
                .description
            }
            onChange={(e) =>
              updateHero(
                "description",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              Highlights
            </span>

            <button
              type="button"
              onClick={
                addHighlight
              }
              className="text-sm font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {content.hero.highlights.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex gap-2"
                >
                  <input
                    className={
                      inputClass
                    }
                    value={
                      item
                    }
                    onChange={(
                      e
                    ) =>
                      updateHighlight(
                        index,
                        e
                          .target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeHighlight(
                        index
                      )
                    }
                    className="rounded-xl border border-red-200 px-4 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span
              className={
                labelClass
              }
            >
              Button Text
            </span>

            <input
              className={
                inputClass
              }
              value={
                content.hero
                  .buttonText
              }
              onChange={(
                e
              ) =>
                updateHero(
                  "buttonText",
                  e.target
                    .value
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
              Button Link
            </span>

            <input
              className={
                inputClass
              }
              value={
                content.hero
                  .buttonLink
              }
              onChange={(
                e
              ) =>
                updateHero(
                  "buttonLink",
                  e.target
                    .value
                )
              }
            />
          </label>
        </div>

        <label className="block">
          <span
            className={
              labelClass
            }
          >
            YouTube Embed URL
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.hero
                .videoUrl
            }
            onChange={(e) =>
              updateHero(
                "videoUrl",
                e.target.value
              )
            }
            placeholder="https://www.youtube.com/embed/..."
          />
        </label>

        <label className="block">
          <span
            className={
              labelClass
            }
          >
            Video Title
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.hero
                .videoTitle
            }
            onChange={(e) =>
              updateHero(
                "videoTitle",
                e.target.value
              )
            }
          />
        </label>
      </div>
    );
  }

  function IncludedFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span
            className={
              labelClass
            }
          >
            Eyebrow
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.included
                .eyebrow
            }
            onChange={(e) =>
              updateIncluded(
                "eyebrow",
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
            Heading
          </span>

          <textarea
            rows={3}
            className={
              textareaClass
            }
            value={
              content.included
                .heading
            }
            onChange={(e) =>
              updateIncluded(
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              What&apos;s
              Included
            </span>

            <button
              type="button"
              onClick={
                addIncludedItem
              }
              className="text-sm font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {content.included.items.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex gap-2"
                >
                  <textarea
                    rows={2}
                    className={
                      textareaClass
                    }
                    value={
                      item
                    }
                    onChange={(
                      e
                    ) =>
                      updateIncludedItem(
                        index,
                        e
                          .target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeIncludedItem(
                        index
                      )
                    }
                    className="self-start rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  function RealFixFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span
            className={
              labelClass
            }
          >
            Eyebrow
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.realFix
                .eyebrow
            }
            onChange={(e) =>
              updateRealFix(
                "eyebrow",
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
            Heading
          </span>

          <textarea
            rows={3}
            className={
              textareaClass
            }
            value={
              content.realFix
                .heading
            }
            onChange={(e) =>
              updateRealFix(
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <span className="mb-2 block text-sm font-medium">
            Image
          </span>

          <div className="rounded-2xl border border-black/10 p-4">
            {realFixImage ? (
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black/5">
                  <Image
                    src={
                      realFixImage
                    }
                    alt="Real Fix preview"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-black/55">
                    {imagePreview
                      ? "New image preview"
                      : content
                          .realFix
                          .image}
                  </p>

                  <button
                    type="button"
                    onClick={
                      removeRealFixImage
                    }
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
                : realFixImage
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
                    e.target
                      .files?.[0];

                  if (file) {
                    uploadRealFixImage(
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

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium">
              Paragraphs
            </span>

            <button
              type="button"
              onClick={
                addRealFixParagraph
              }
              className="text-sm font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {content.realFix.paragraphs.map(
              (
                paragraph,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex gap-2"
                >
                  <textarea
                    rows={4}
                    className={
                      textareaClass
                    }
                    value={
                      paragraph
                    }
                    onChange={(
                      e
                    ) =>
                      updateRealFixParagraph(
                        index,
                        e
                          .target
                          .value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeRealFixParagraph(
                        index
                      )
                    }
                    className="self-start rounded-xl border border-red-200 px-4 py-3 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  function CTAFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span
            className={
              labelClass
            }
          >
            Eyebrow
          </span>

          <input
            className={
              inputClass
            }
            value={
              content.cta
                .eyebrow
            }
            onChange={(e) =>
              updateCTA(
                "eyebrow",
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
            Heading
          </span>

          <textarea
            rows={3}
            className={
              textareaClass
            }
            value={
              content.cta
                .heading
            }
            onChange={(e) =>
              updateCTA(
                "heading",
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
              content.cta
                .description
            }
            onChange={(e) =>
              updateCTA(
                "description",
                e.target.value
              )
            }
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span
              className={
                labelClass
              }
            >
              Button Text
            </span>

            <input
              className={
                inputClass
              }
              value={
                content.cta
                  .buttonText
              }
              onChange={(
                e
              ) =>
                updateCTA(
                  "buttonText",
                  e.target
                    .value
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
              Button Link
            </span>

            <input
              className={
                inputClass
              }
              value={
                content.cta
                  .buttonLink
              }
              onChange={(
                e
              ) =>
                updateCTA(
                  "buttonLink",
                  e.target
                    .value
                )
              }
            />
          </label>
        </div>
      </div>
    );
  }

  function Preview() {
    if (
      activeSection ===
      "Included"
    ) {
      return (
        <div className="rounded-[36px] bg-brand-green p-8 text-white">
          <p className="font-script text-5xl text-brand-gold">
            {
              content.included
                .eyebrow
            }
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight">
            {
              content.included
                .heading
            }
          </h2>

          <div className="mt-10 grid gap-4">
            {content.included.items.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="rounded-[24px] border border-white/15 bg-white/10 p-5"
                >
                  <p className="text-lg leading-8">
                    ✦{" "}
                    {
                      item
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      );
    }

    if (
      activeSection ===
      "Real Fix"
    ) {
      return (
        <div className="rounded-[36px] bg-white p-8">
          {realFixImage && (
            <div className="relative mb-8 h-[360px] overflow-hidden rounded-[32px] bg-brand-soft">
              <Image
                src={
                  realFixImage
                }
                alt="Real Fix"
                fill
                unoptimized
                className="object-cover"
                sizes="600px"
              />
            </div>
          )}

          <p className="font-script text-5xl text-brand-pink">
            {
              content.realFix
                .eyebrow
            }
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight text-brand-green">
            {
              content.realFix
                .heading
            }
          </h2>

          {content.realFix.paragraphs.map(
            (
              paragraph,
              index
            ) => (
              <p
                key={
                  index
                }
                className="mt-6 text-lg leading-9 text-brand-green/75"
              >
                {
                  paragraph
                }
              </p>
            )
          )}
        </div>
      );
    }

    if (
      activeSection ===
      "CTA"
    ) {
      return (
        <div className="rounded-[36px] bg-brand-soft p-10 text-center">
          <p className="font-script text-5xl text-brand-coral">
            {
              content.cta
                .eyebrow
            }
          </p>

          <h2 className="mt-4 font-serifDisplay text-5xl leading-tight text-brand-green">
            {
              content.cta
                .heading
            }
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-brand-green/75">
            {
              content.cta
                .description
            }
          </p>

          <div className="mt-8 inline-block rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white">
            {
              content.cta
                .buttonText
            }
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-[36px] bg-white p-8">
        <p className="font-script text-5xl text-brand-coral">
          {
            content.hero
              .eyebrow
          }
        </p>

        <h1 className="mt-4 font-serifDisplay text-5xl leading-tight text-brand-green">
          {
            content.hero
              .heading
          }
        </h1>

        <p className="mt-8 text-xl leading-9 text-brand-green/75">
          {
            content.hero
              .intro
          }
        </p>

        <p className="mt-5 text-lg leading-8 text-brand-green/75">
          {
            content.hero
              .description
          }
        </p>

        <div className="mt-8 grid gap-2 text-lg font-semibold text-brand-green">
          {content.hero.highlights.map(
            (
              item,
              index
            ) => (
              <p
                key={
                  index
                }
              >
                {
                  item
                }
              </p>
            )
          )}
        </div>

        <div className="mt-8 inline-block rounded-full bg-brand-coral px-8 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white">
          {
            content.hero
              .buttonText
          }
        </div>

        {content.hero
          .videoUrl && (
          <div className="mt-10 rounded-[28px] bg-brand-soft p-4">
            <div className="mx-auto max-w-[220px] overflow-hidden rounded-[20px]">
              <iframe
                className="aspect-[9/16] w-full"
                src={
                  content.hero
                    .videoUrl
                }
                title={
                  content.hero
                    .videoTitle
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-black/40">
          Coaching
        </p>

        <h3 className="mt-1 text-2xl font-semibold">
          Modern Goddess Reset
        </h3>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            "Hero",
            "Included",
            "Real Fix",
            "CTA",
          ] as Section[]
        ).map(
          (
            section
          ) => (
            <button
              key={
                section
              }
              type="button"
              onClick={() =>
                setActiveSection(
                  section
                )
              }
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeSection ===
                section
                  ? "bg-black text-white"
                  : "border border-black/10 bg-white text-black/55 hover:text-black"
              }`}
            >
              {section ===
              "Included"
                ? "What's Included"
                : section}
            </button>
          )
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          {activeSection ===
            "Hero" &&
            HeroFields()}

          {activeSection ===
            "Included" &&
            IncludedFields()}

          {activeSection ===
            "Real Fix" &&
            RealFixFields()}

          {activeSection ===
            "CTA" &&
            CTAFields()}

          <div className="mt-8 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={
                saveAndPublish
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
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-brand-soft p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-medium">
              Live Preview
            </p>

            <p className="mt-1 text-sm text-black/40">
              Preview of the
              selected Coaching
              section.
            </p>
          </div>

          {Preview()}
        </div>
      </div>
    </div>
  );
}