"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomeContent } from "@/app/sa-editor/page";

type HomeEditorProps = {
  home: HomeContent;
};

type HomeSection =
  | "Hero"
  | "Services"
  | "Featured Offerings"
  | "Featured Program"
  | "Pillars"
  | "Quote"
  | "About Preview"
  | "Testimonials"
  | "CTA";

type PublishStatus =
  | "idle"
  | "publishing"
  | "success"
  | "error";

type UploadStatus =
  | "idle"
  | "uploading"
  | "error";

type ImageSection =
  | "hero"
  | "featuredProgram"
  | "aboutPreview";

const sections: HomeSection[] = [
  "Hero",
  "Services",
  "Featured Offerings",
  "Featured Program",
  "Pillars",
  "Quote",
  "About Preview",
  "Testimonials",
  "CTA",
];

export default function HomeEditor({
  home,
}: HomeEditorProps) {
  const [draft, setDraft] =
    useState<HomeContent>(() =>
      structuredClone(home)
    );

  const [
    activeHomeSection,
    setActiveHomeSection,
  ] = useState<HomeSection>("Hero");

  const [
    publishStatus,
    setPublishStatus,
  ] = useState<PublishStatus>("idle");

  const [
    publishMessage,
    setPublishMessage,
  ] = useState("");

  const [
    uploadStatus,
    setUploadStatus,
  ] = useState<UploadStatus>("idle");

  const [
    uploadMessage,
    setUploadMessage,
  ] = useState("");

  const [
    imagePreviews,
    setImagePreviews,
  ] = useState<
    Partial<Record<ImageSection, string>>
  >({});

  function changed() {
    setPublishStatus("idle");
    setPublishMessage("");
  }

  function updateSection<
    K extends keyof HomeContent
  >(
    section: K,
    value: HomeContent[K]
  ) {
    setDraft((current) => ({
      ...current,
      [section]: value,
    }));

    changed();
  }

  function updateNested<
    K extends keyof HomeContent
  >(
    section: K,
    field: keyof HomeContent[K],
    value: unknown
  ) {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...(current[section] as object),
        [field]: value,
      },
    }));

    changed();
  }

  async function uploadImage(
    section: ImageSection,
    file: File
  ) {
    try {
      setUploadStatus("uploading");
      setUploadMessage(
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
                resolve(reader.result);
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

            reader.readAsDataURL(file);
          }
        );

      setImagePreviews(
        (current) => ({
          ...current,
          [section]: dataUrl,
        })
      );

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

      updateNested(
        section,
        "image" as never,
        result.path
      );

      setUploadStatus("idle");
      setUploadMessage(
        "Image uploaded ✓"
      );
    } catch (error) {
      console.error(error);

      setImagePreviews(
        (current) => {
          const next = {
            ...current,
          };

          delete next[section];

          return next;
        }
      );

      setUploadStatus("error");
      setUploadMessage(
        "Image upload failed. Please try again."
      );
    }
  }

  async function publishHome() {
    try {
      setPublishStatus(
        "publishing"
      );
      setPublishMessage(
        "Publishing changes..."
      );

      const response = await fetch(
        "/api/sa-editor/home",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(draft),
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

  const inputClass =
    "w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const textareaClass =
    "w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const labelClass =
    "mb-2 block text-sm font-medium";

  function ImageField({
    section,
    image,
  }: {
    section: ImageSection;
    image: string;
  }) {
    const preview =
      imagePreviews[section] || image;

    return (
      <div>
        <span className={labelClass}>
          Image
        </span>

        <div className="rounded-2xl border border-black/10 p-4">
          {preview ? (
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5">
                <Image
                  src={preview}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <p className="min-w-0 flex-1 truncate text-sm text-black/50">
                {imagePreviews[section]
                  ? "New image preview"
                  : image}
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-xl bg-black/[0.03] px-4 py-6 text-center text-sm text-black/35">
              No image selected
            </div>
          )}

          <label className="inline-flex cursor-pointer rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
            {uploadStatus ===
            "uploading"
              ? "Uploading..."
              : preview
                ? "Change Image"
                : "Upload Image"}

            <input
              type="file"
              accept="image/*"
              disabled={
                uploadStatus ===
                "uploading"
              }
              className="hidden"
              onChange={(event) => {
                const file =
                  event.target.files?.[0];

                if (file) {
                  uploadImage(
                    section,
                    file
                  );
                }

                event.target.value = "";
              }}
            />
          </label>

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
      </div>
    );
  }

  function HeroFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={draft.hero.eyebrow}
            onChange={(e) =>
              updateNested(
                "hero",
                "eyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Heading
          </span>
          <textarea
            rows={3}
            className={textareaClass}
            value={draft.hero.heading}
            onChange={(e) =>
              updateNested(
                "hero",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Subheading
          </span>
          <textarea
            rows={4}
            className={textareaClass}
            value={draft.hero.subheading}
            onChange={(e) =>
              updateNested(
                "hero",
                "subheading",
                e.target.value
              )
            }
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>
              Primary Button Text
            </span>
            <input
              className={inputClass}
              value={
                draft.hero
                  .primaryButtonText
              }
              onChange={(e) =>
                updateNested(
                  "hero",
                  "primaryButtonText",
                  e.target.value
                )
              }
            />
          </label>

          <label className="block">
            <span className={labelClass}>
              Primary Button Link
            </span>
            <input
              className={inputClass}
              value={
                draft.hero
                  .primaryButtonLink
              }
              onChange={(e) =>
                updateNested(
                  "hero",
                  "primaryButtonLink",
                  e.target.value
                )
              }
            />
          </label>

          <label className="block">
            <span className={labelClass}>
              Secondary Button Text
            </span>
            <input
              className={inputClass}
              value={
                draft.hero
                  .secondaryButtonText
              }
              onChange={(e) =>
                updateNested(
                  "hero",
                  "secondaryButtonText",
                  e.target.value
                )
              }
            />
          </label>

          <label className="block">
            <span className={labelClass}>
              Secondary Button Link
            </span>
            <input
              className={inputClass}
              value={
                draft.hero
                  .secondaryButtonLink
              }
              onChange={(e) =>
                updateNested(
                  "hero",
                  "secondaryButtonLink",
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>
            Image Alt Text
          </span>
          <input
            className={inputClass}
            value={draft.hero.imageAlt}
            onChange={(e) =>
              updateNested(
                "hero",
                "imageAlt",
                e.target.value
              )
            }
          />
        </label>

        <ImageField
          section="hero"
          image={draft.hero.image}
        />
      </div>
    );
  }

  function ServicesFields() {
    return (
      <div className="space-y-4">
        {draft.services.map(
          (service, index) => (
            <div
              key={`${index}-${service}`}
              className="flex gap-3"
            >
              <input
                className={inputClass}
                value={service}
                onChange={(e) => {
                  const services = [
                    ...draft.services,
                  ];

                  services[index] =
                    e.target.value;

                  updateSection(
                    "services",
                    services
                  );
                }}
              />

              <button
                type="button"
                onClick={() => {
                  updateSection(
                    "services",
                    draft.services.filter(
                      (_, itemIndex) =>
                        itemIndex !== index
                    )
                  );
                }}
                className="rounded-xl border border-red-200 px-4 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          )
        )}

        <button
          type="button"
          onClick={() =>
            updateSection(
              "services",
              [...draft.services, ""]
            )
          }
          className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold"
        >
          + Add Service
        </button>
      </div>
    );
  }

  function FeaturedOfferingsFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={
              draft.featuredOfferings
                .eyebrow
            }
            onChange={(e) =>
              updateNested(
                "featuredOfferings",
                "eyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Heading
          </span>
          <textarea
            rows={3}
            className={textareaClass}
            value={
              draft.featuredOfferings
                .heading
            }
            onChange={(e) =>
              updateNested(
                "featuredOfferings",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Description
          </span>
          <textarea
            rows={4}
            className={textareaClass}
            value={
              draft.featuredOfferings
                .description
            }
            onChange={(e) =>
              updateNested(
                "featuredOfferings",
                "description",
                e.target.value
              )
            }
          />
        </label>

        <p className="rounded-xl bg-black/[0.04] px-4 py-3 text-sm text-black/55">
          The offering cards themselves
          are managed in the Offerings
          section.
        </p>
      </div>
    );
  }

  function FeaturedProgramFields() {
    const program =
      draft.featuredProgram;

    return (
      <div className="space-y-5">
        {[
          ["eyebrow", "Eyebrow"],
          ["heading", "Heading"],
          ["buttonText", "Button Text"],
          ["buttonLink", "Button Link"],
          ["imageAlt", "Image Alt Text"],
        ].map(([field, label]) => (
          <label
            key={field}
            className="block"
          >
            <span
              className={labelClass}
            >
              {label}
            </span>
            <input
              className={inputClass}
              value={
                program[
                  field as keyof typeof program
                ] as string
              }
              onChange={(e) =>
                updateNested(
                  "featuredProgram",
                  field as keyof typeof program,
                  e.target.value
                )
              }
            />
          </label>
        ))}

        <label className="block">
          <span className={labelClass}>
            Description
          </span>
          <textarea
            rows={5}
            className={textareaClass}
            value={program.description}
            onChange={(e) =>
              updateNested(
                "featuredProgram",
                "description",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <span className={labelClass}>
            Bullets
          </span>

          <div className="space-y-3">
            {program.bullets.map(
              (bullet, index) => (
                <div
                  key={`${index}-${bullet}`}
                  className="flex gap-3"
                >
                  <input
                    className={
                      inputClass
                    }
                    value={bullet}
                    onChange={(e) => {
                      const bullets = [
                        ...program.bullets,
                      ];

                      bullets[index] =
                        e.target.value;

                      updateNested(
                        "featuredProgram",
                        "bullets",
                        bullets
                      );
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateNested(
                        "featuredProgram",
                        "bullets",
                        program.bullets.filter(
                          (
                            _,
                            itemIndex
                          ) =>
                            itemIndex !==
                            index
                        )
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

          <button
            type="button"
            onClick={() =>
              updateNested(
                "featuredProgram",
                "bullets",
                [
                  ...program.bullets,
                  "",
                ]
              )
            }
            className="mt-3 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold"
          >
            + Add Bullet
          </button>
        </div>

        <ImageField
          section="featuredProgram"
          image={program.image}
        />
      </div>
    );
  }

  function PillarsFields() {
    const pillars = draft.pillars;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={pillars.eyebrow}
            onChange={(e) =>
              updateNested(
                "pillars",
                "eyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Heading
          </span>
          <textarea
            rows={3}
            className={textareaClass}
            value={pillars.heading}
            onChange={(e) =>
              updateNested(
                "pillars",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <div className="space-y-4">
          {pillars.items.map(
            (pillar, index) => (
              <div
                key={index}
                className="rounded-2xl border border-black/10 p-4"
              >
                <label className="block">
                  <span
                    className={
                      labelClass
                    }
                  >
                    Pillar Title
                  </span>
                  <input
                    className={
                      inputClass
                    }
                    value={
                      pillar.title
                    }
                    onChange={(e) => {
                      const items =
                        pillars.items.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            itemIndex ===
                            index
                              ? {
                                  ...item,
                                  title:
                                    e
                                      .target
                                      .value,
                                }
                              : item
                        );

                      updateNested(
                        "pillars",
                        "items",
                        items
                      );
                    }}
                  />
                </label>

                <label className="mt-4 block">
                  <span
                    className={
                      labelClass
                    }
                  >
                    Text
                  </span>
                  <textarea
                    rows={4}
                    className={
                      textareaClass
                    }
                    value={pillar.text}
                    onChange={(e) => {
                      const items =
                        pillars.items.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            itemIndex ===
                            index
                              ? {
                                  ...item,
                                  text:
                                    e
                                      .target
                                      .value,
                                }
                              : item
                        );

                      updateNested(
                        "pillars",
                        "items",
                        items
                      );
                    }}
                  />
                </label>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  function QuoteFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Quote
          </span>
          <textarea
            rows={5}
            className={textareaClass}
            value={draft.quote.text}
            onChange={(e) =>
              updateNested(
                "quote",
                "text",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Author
          </span>
          <input
            className={inputClass}
            value={draft.quote.author}
            onChange={(e) =>
              updateNested(
                "quote",
                "author",
                e.target.value
              )
            }
          />
        </label>
      </div>
    );
  }

  function AboutPreviewFields() {
    const about =
      draft.aboutPreview;

    return (
      <div className="space-y-5">
        {[
          ["eyebrow", "Eyebrow"],
          ["heading", "Heading"],
          ["buttonText", "Button Text"],
          ["buttonLink", "Button Link"],
          ["imageAlt", "Image Alt Text"],
        ].map(([field, label]) => (
          <label
            key={field}
            className="block"
          >
            <span
              className={labelClass}
            >
              {label}
            </span>
            <input
              className={inputClass}
              value={
                about[
                  field as keyof typeof about
                ] as string
              }
              onChange={(e) =>
                updateNested(
                  "aboutPreview",
                  field as keyof typeof about,
                  e.target.value
                )
              }
            />
          </label>
        ))}

        <label className="block">
          <span className={labelClass}>
            Description
          </span>
          <textarea
            rows={5}
            className={textareaClass}
            value={about.description}
            onChange={(e) =>
              updateNested(
                "aboutPreview",
                "description",
                e.target.value
              )
            }
          />
        </label>

        <ImageField
          section="aboutPreview"
          image={about.image}
        />
      </div>
    );
  }

  function TestimonialsFields() {
    const testimonials =
      draft.testimonials;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={
              testimonials.eyebrow
            }
            onChange={(e) =>
              updateNested(
                "testimonials",
                "eyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Heading
          </span>
          <textarea
            rows={3}
            className={textareaClass}
            value={
              testimonials.heading
            }
            onChange={(e) =>
              updateNested(
                "testimonials",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <div className="space-y-4">
          {testimonials.items.map(
            (
              testimonial,
              index
            ) => (
              <div
                key={index}
                className="rounded-2xl border border-black/10 p-4"
              >
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
                    value={
                      testimonial.title
                    }
                    onChange={(e) => {
                      const items =
                        testimonials.items.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            itemIndex ===
                            index
                              ? {
                                  ...item,
                                  title:
                                    e
                                      .target
                                      .value,
                                }
                              : item
                        );

                      updateNested(
                        "testimonials",
                        "items",
                        items
                      );
                    }}
                  />
                </label>

                <label className="mt-4 block">
                  <span
                    className={
                      labelClass
                    }
                  >
                    Testimonial
                  </span>
                  <textarea
                    rows={5}
                    className={
                      textareaClass
                    }
                    value={
                      testimonial.text
                    }
                    onChange={(e) => {
                      const items =
                        testimonials.items.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            itemIndex ===
                            index
                              ? {
                                  ...item,
                                  text:
                                    e
                                      .target
                                      .value,
                                }
                              : item
                        );

                      updateNested(
                        "testimonials",
                        "items",
                        items
                      );
                    }}
                  />
                </label>

                <label className="mt-4 block">
                  <span
                    className={
                      labelClass
                    }
                  >
                    Name / Attribution
                  </span>
                  <input
                    className={
                      inputClass
                    }
                    value={
                      testimonial.name
                    }
                    onChange={(e) => {
                      const items =
                        testimonials.items.map(
                          (
                            item,
                            itemIndex
                          ) =>
                            itemIndex ===
                            index
                              ? {
                                  ...item,
                                  name:
                                    e
                                      .target
                                      .value,
                                }
                              : item
                        );

                      updateNested(
                        "testimonials",
                        "items",
                        items
                      );
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    updateNested(
                      "testimonials",
                      "items",
                      testimonials.items.filter(
                        (
                          _,
                          itemIndex
                        ) =>
                          itemIndex !==
                          index
                      )
                    )
                  }
                  className="mt-4 text-sm font-medium text-red-600"
                >
                  Remove testimonial
                </button>
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            updateNested(
              "testimonials",
              "items",
              [
                ...testimonials.items,
                {
                  title: "",
                  text: "",
                  name: "",
                },
              ]
            )
          }
          className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold"
        >
          + Add Testimonial
        </button>
      </div>
    );
  }

  function CTAFields() {
    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={draft.cta.eyebrow}
            onChange={(e) =>
              updateNested(
                "cta",
                "eyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Heading
          </span>
          <textarea
            rows={4}
            className={textareaClass}
            value={draft.cta.heading}
            onChange={(e) =>
              updateNested(
                "cta",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Button Text
          </span>
          <input
            className={inputClass}
            value={draft.cta.buttonText}
            onChange={(e) =>
              updateNested(
                "cta",
                "buttonText",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Button Link
          </span>
          <input
            className={inputClass}
            value={draft.cta.buttonLink}
            onChange={(e) =>
              updateNested(
                "cta",
                "buttonLink",
                e.target.value
              )
            }
          />
        </label>
      </div>
    );
  }

  function renderFields() {
    switch (activeHomeSection) {
      case "Hero":
        return HeroFields();
      case "Services":
        return ServicesFields();
      case "Featured Offerings":
        return FeaturedOfferingsFields();
      case "Featured Program":
        return FeaturedProgramFields();
      case "Pillars":
        return PillarsFields();
      case "Quote":
        return QuoteFields();
      case "About Preview":
        return AboutPreviewFields();
      case "Testimonials":
        return TestimonialsFields();
      case "CTA":
        return CTAFields();
    }
  }

  function Preview() {
    switch (activeHomeSection) {
      case "Hero": {
        const hero = draft.hero;
        const preview =
          imagePreviews.hero ||
          hero.image;

        return (
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="font-script text-4xl text-brand-coral">
                {hero.eyebrow}
              </p>
              <h3 className="mt-3 font-serifDisplay text-5xl leading-[0.98]">
                {hero.heading}
              </h3>
              <p className="mt-5 leading-7 text-brand-green/70">
                {hero.subheading}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-brand-coral px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {
                    hero.primaryButtonText
                  }
                </span>
                <span className="rounded-full border border-brand-coral px-5 py-3 text-xs font-bold uppercase tracking-[0.16em]">
                  {
                    hero.secondaryButtonText
                  }
                </span>
              </div>
            </div>

            <div className="rounded-[32px] bg-brand-soft p-4">
              <div className="relative h-[420px] overflow-hidden rounded-[26px]">
                {preview ? (
                  <Image
                    src={preview}
                    alt={hero.imageAlt}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : null}
              </div>
            </div>
          </div>
        );
      }

      case "Services":
        return (
          <div className="flex flex-wrap justify-center gap-3">
            {draft.services.map(
              (service, index) => (
                <span
                  key={index}
                  className="rounded-full border border-brand-green/15 bg-white px-5 py-3 text-sm"
                >
                  {service ||
                    "Untitled service"}
                </span>
              )
            )}
          </div>
        );

      case "Featured Offerings":
        return (
          <div className="text-center">
            <p className="font-script text-5xl text-brand-pink">
              {
                draft
                  .featuredOfferings
                  .eyebrow
              }
            </p>
            <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
              {
                draft
                  .featuredOfferings
                  .heading
              }
            </h3>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-brand-green/70">
              {
                draft
                  .featuredOfferings
                  .description
              }
            </p>
          </div>
        );

      case "Featured Program": {
        const program =
          draft.featuredProgram;
        const preview =
          imagePreviews.featuredProgram ||
          program.image;

        return (
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="rounded-[32px] bg-brand-soft p-4">
              <div className="relative h-[420px] overflow-hidden rounded-[26px]">
                {preview ? (
                  <Image
                    src={preview}
                    alt={program.imageAlt}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                ) : null}
              </div>
            </div>

            <div>
              <p className="font-script text-4xl text-brand-coral">
                {program.eyebrow}
              </p>
              <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
                {program.heading}
              </h3>
              <p className="mt-5 leading-7 text-brand-green/70">
                {
                  program.description
                }
              </p>
              <ul className="mt-6 space-y-2">
                {program.bullets.map(
                  (bullet, index) => (
                    <li key={index}>
                      ✓ {bullet}
                    </li>
                  )
                )}
              </ul>
              <div className="mt-6 inline-block rounded-full bg-brand-coral px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white">
                {program.buttonText}
              </div>
            </div>
          </div>
        );
      }

      case "Pillars":
        return (
          <div>
            <div className="text-center">
              <p className="font-script text-4xl text-brand-pink">
                {
                  draft.pillars
                    .eyebrow
                }
              </p>
              <h3 className="mt-3 font-serifDisplay text-5xl">
                {
                  draft.pillars
                    .heading
                }
              </h3>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {draft.pillars.items.map(
                (pillar, index) => (
                  <article
                    key={index}
                    className="border border-brand-green/15 bg-white p-6"
                  >
                    <h4 className="font-serifDisplay text-3xl">
                      {pillar.title}
                    </h4>
                    <p className="mt-3 leading-7 text-brand-green/70">
                      {pillar.text}
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        );

      case "Quote":
        return (
          <div className="mx-auto max-w-2xl py-16 text-center">
            <p className="font-serifDisplay text-5xl leading-tight">
              “{draft.quote.text}”
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-brand-green/50">
              {draft.quote.author}
            </p>
          </div>
        );

      case "About Preview": {
        const about =
          draft.aboutPreview;
        const preview =
          imagePreviews.aboutPreview ||
          about.image;

        return (
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="font-script text-4xl text-brand-pink">
                {about.eyebrow}
              </p>
              <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
                {about.heading}
              </h3>
              <p className="mt-5 leading-7 text-brand-green/70">
                {about.description}
              </p>
              <div className="mt-6 inline-block rounded-full bg-brand-coral px-6 py-3 text-xs font-bold uppercase tracking-[0.16em]">
                {about.buttonText}
              </div>
            </div>

            <div className="relative h-[440px] overflow-hidden rounded-[32px] bg-brand-soft">
              {preview ? (
                <Image
                  src={preview}
                  alt={about.imageAlt}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              ) : null}
            </div>
          </div>
        );
      }

      case "Testimonials":
        return (
          <div>
            <div className="text-center">
              <p className="font-script text-4xl text-brand-pink">
                {
                  draft.testimonials
                    .eyebrow
                }
              </p>
              <h3 className="mt-3 font-serifDisplay text-5xl">
                {
                  draft.testimonials
                    .heading
                }
              </h3>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {draft.testimonials.items.map(
                (
                  testimonial,
                  index
                ) => (
                  <article
                    key={index}
                    className="bg-white p-5 shadow-sm"
                  >
                    <h4 className="font-serifDisplay text-2xl text-brand-coral">
                      {
                        testimonial.title
                      }
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-brand-green/70">
                      {
                        testimonial.text
                      }
                    </p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-green/45">
                      {
                        testimonial.name
                      }
                    </p>
                  </article>
                )
              )}
            </div>
          </div>
        );

      case "CTA":
        return (
          <div className="rounded-[2rem] bg-brand-green p-10 text-center text-white">
            <p className="font-script text-5xl text-brand-gold">
              {draft.cta.eyebrow}
            </p>
            <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
              {draft.cta.heading}
            </h3>
            <div className="mt-7 inline-block rounded-full bg-brand-coral px-6 py-3 text-xs font-bold uppercase tracking-[0.16em]">
              {
                draft.cta
                  .buttonText
              }
            </div>
          </div>
        );
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => {
              setActiveHomeSection(
                section
              );
              setUploadMessage("");
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeHomeSection ===
              section
                ? "bg-black text-white"
                : "border border-black/10 bg-white text-black/60 hover:bg-black/5"
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-sm text-black/40">
              Home page section
            </p>
            <h3 className="mt-1 text-2xl font-semibold">
              {activeHomeSection}
            </h3>
          </div>

          {renderFields()}

          <div className="mt-8 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={publishHome}
              disabled={
                publishStatus ===
                  "publishing" ||
                uploadStatus ===
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
                {publishMessage}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-[#f8f1e4] p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-medium">
              Live Preview
            </p>
            <p className="mt-1 text-sm text-black/40">
              Updates instantly while you
              type.
            </p>
          </div>

          <div className="min-h-[620px]">
            {Preview()}
          </div>
        </div>
      </div>
    </div>
  );
}
