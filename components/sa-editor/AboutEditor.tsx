"use client";

import Image from "next/image";
import { useState } from "react";
import type { AboutContent } from "@/app/sa-editor/page";

type AboutEditorProps = {
  about: AboutContent;
};

type AboutSection =
  | "Hero"
  | "Transformation"
  | "Method"
  | "Final Section";

type PublishStatus =
  | "idle"
  | "publishing"
  | "success"
  | "error";

type UploadStatus =
  | "idle"
  | "uploading"
  | "error";

type ImageKey =
  | "hero"
  | "before-0"
  | "before-1"
  | "after";

const sections: AboutSection[] = [
  "Hero",
  "Transformation",
  "Method",
  "Final Section",
];

function getEditorImageSrc(
  image: string
) {
  if (image.startsWith("/uploads/")) {
    return `/api/sa-editor/media?path=${encodeURIComponent(image)}`;
  }

  return image;
}

export default function AboutEditor({
  about,
}: AboutEditorProps) {
  const [draft, setDraft] =
    useState<AboutContent>(() =>
      structuredClone(about)
    );

  const [
    activeSection,
    setActiveSection,
  ] = useState<AboutSection>("Hero");

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
    Partial<Record<ImageKey, string>>
  >({});

  const inputClass =
    "w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const textareaClass =
    "w-full resize-none rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/30";

  const labelClass =
    "mb-2 block text-sm font-medium";

  function changed() {
    setPublishStatus("idle");
    setPublishMessage("");
  }

  function updateNested<
    K extends keyof AboutContent
  >(
    section: K,
    field: keyof AboutContent[K],
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
    key: ImageKey,
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
          [key]: dataUrl,
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

      if (key === "hero") {
        updateNested(
          "hero",
          "image",
          result.path
        );
      }

      if (
        key === "before-0" ||
        key === "before-1"
      ) {
        const index =
          key === "before-0" ? 0 : 1;

        setDraft((current) => {
          const beforeImages = [
            ...current.transformation
              .beforeImages,
          ];

          beforeImages[index] = {
            ...beforeImages[index],
            image: result.path,
          };

          return {
            ...current,
            transformation: {
              ...current.transformation,
              beforeImages,
            },
          };
        });

        changed();
      }

      if (key === "after") {
        setDraft((current) => ({
          ...current,
          transformation: {
            ...current.transformation,
            afterImage: {
              ...current.transformation
                .afterImage,
              image: result.path,
            },
          },
        }));

        changed();
      }

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

          delete next[key];

          return next;
        }
      );

      setUploadStatus("error");
      setUploadMessage(
        "Image upload failed. Please try again."
      );
    }
  }

  async function publishAbout() {
    try {
      setPublishStatus(
        "publishing"
      );
      setPublishMessage(
        "Publishing changes..."
      );

      const response = await fetch(
        "/api/sa-editor/about",
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

  function ImageField({
    imageKey,
    image,
    label,
  }: {
    imageKey: ImageKey;
    image: string;
    label: string;
  }) {
    const preview =
      imagePreviews[imageKey] ||
      getEditorImageSrc(image);

    return (
      <div>
        <span className={labelClass}>
          {label}
        </span>

        <div className="rounded-2xl border border-black/10 p-4">
          {preview ? (
            <div className="mb-4 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/5">
                <Image
                  src={preview}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <p className="min-w-0 flex-1 truncate text-sm text-black/50">
                {imagePreviews[
                  imageKey
                ]
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
                    imageKey,
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

  function renderHeroFields() {
    const hero = draft.hero;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>

          <input
            className={inputClass}
            value={hero.eyebrow}
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
            value={hero.heading}
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
            Intro
          </span>

          <textarea
            rows={4}
            className={textareaClass}
            value={hero.intro}
            onChange={(e) =>
              updateNested(
                "hero",
                "intro",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <span className={labelClass}>
            Paragraphs
          </span>

          <div className="space-y-4">
            {hero.paragraphs.map(
              (paragraph, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-black/10 p-4"
                >
                  <textarea
                    rows={5}
                    className={textareaClass}
                    value={paragraph}
                    onChange={(e) => {
                      const paragraphs = [
                        ...hero.paragraphs,
                      ];

                      paragraphs[index] =
                        e.target.value;

                      updateNested(
                        "hero",
                        "paragraphs",
                        paragraphs
                      );
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateNested(
                        "hero",
                        "paragraphs",
                        hero.paragraphs.filter(
                          (
                            _,
                            itemIndex
                          ) =>
                            itemIndex !==
                            index
                        )
                      )
                    }
                    className="mt-3 text-sm font-medium text-red-600"
                  >
                    Remove paragraph
                  </button>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              updateNested(
                "hero",
                "paragraphs",
                [
                  ...hero.paragraphs,
                  "",
                ]
              )
            }
            className="mt-3 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold"
          >
            + Add Paragraph
          </button>
        </div>

        <label className="block">
          <span className={labelClass}>
            Image Alt Text
          </span>

          <input
            className={inputClass}
            value={hero.imageAlt}
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
          imageKey="hero"
          image={hero.image}
          label="Hero Image"
        />
      </div>
    );
  }

  function renderTransformationFields() {
    const transformation =
      draft.transformation;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>
          <input
            className={inputClass}
            value={
              transformation.eyebrow
            }
            onChange={(e) =>
              updateNested(
                "transformation",
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
              transformation.heading
            }
            onChange={(e) =>
              updateNested(
                "transformation",
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
              transformation.description
            }
            onChange={(e) =>
              updateNested(
                "transformation",
                "description",
                e.target.value
              )
            }
          />
        </label>

        {transformation.beforeImages.map(
          (item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/10 p-4"
            >
              <ImageField
                imageKey={
                  index === 0
                    ? "before-0"
                    : "before-1"
                }
                image={item.image}
                label={`Before Image ${index + 1}`}
              />

              <label className="mt-4 block">
                <span
                  className={
                    labelClass
                  }
                >
                  Alt Text
                </span>

                <input
                  className={
                    inputClass
                  }
                  value={item.alt}
                  onChange={(e) => {
                    const beforeImages =
                      transformation.beforeImages.map(
                        (
                          current,
                          itemIndex
                        ) =>
                          itemIndex ===
                          index
                            ? {
                                ...current,
                                alt:
                                  e
                                    .target
                                    .value,
                              }
                            : current
                      );

                    updateNested(
                      "transformation",
                      "beforeImages",
                      beforeImages
                    );
                  }}
                />
              </label>
            </div>
          )
        )}

        <div className="rounded-2xl border border-black/10 p-4">
          <ImageField
            imageKey="after"
            image={
              transformation.afterImage
                .image
            }
            label="After Image"
          />

          <label className="mt-4 block">
            <span className={labelClass}>
              Alt Text
            </span>

            <input
              className={inputClass}
              value={
                transformation.afterImage
                  .alt
              }
              onChange={(e) =>
                setDraft((current) => ({
                  ...current,
                  transformation: {
                    ...current.transformation,
                    afterImage: {
                      ...current
                        .transformation
                        .afterImage,
                      alt: e.target.value,
                    },
                  },
                }))
              }
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>
            Result Eyebrow
          </span>

          <input
            className={inputClass}
            value={
              transformation
                .resultEyebrow
            }
            onChange={(e) =>
              updateNested(
                "transformation",
                "resultEyebrow",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Result Heading
          </span>

          <input
            className={inputClass}
            value={
              transformation
                .resultHeading
            }
            onChange={(e) =>
              updateNested(
                "transformation",
                "resultHeading",
                e.target.value
              )
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>
            Result Text
          </span>

          <textarea
            rows={4}
            className={textareaClass}
            value={
              transformation.resultText
            }
            onChange={(e) =>
              updateNested(
                "transformation",
                "resultText",
                e.target.value
              )
            }
          />
        </label>
      </div>
    );
  }

  function renderMethodFields() {
    const method = draft.method;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>

          <input
            className={inputClass}
            value={method.eyebrow}
            onChange={(e) =>
              updateNested(
                "method",
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
            value={method.heading}
            onChange={(e) =>
              updateNested(
                "method",
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
            rows={6}
            className={textareaClass}
            value={method.description}
            onChange={(e) =>
              updateNested(
                "method",
                "description",
                e.target.value
              )
            }
          />
        </label>
      </div>
    );
  }

  function renderFinalFields() {
    const finalSection =
      draft.finalSection;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className={labelClass}>
            Eyebrow
          </span>

          <input
            className={inputClass}
            value={
              finalSection.eyebrow
            }
            onChange={(e) =>
              updateNested(
                "finalSection",
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
            value={
              finalSection.heading
            }
            onChange={(e) =>
              updateNested(
                "finalSection",
                "heading",
                e.target.value
              )
            }
          />
        </label>

        <div>
          <span className={labelClass}>
            Paragraphs
          </span>

          <div className="space-y-4">
            {finalSection.paragraphs.map(
              (paragraph, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-black/10 p-4"
                >
                  <textarea
                    rows={4}
                    className={textareaClass}
                    value={paragraph}
                    onChange={(e) => {
                      const paragraphs = [
                        ...finalSection.paragraphs,
                      ];

                      paragraphs[index] =
                        e.target.value;

                      updateNested(
                        "finalSection",
                        "paragraphs",
                        paragraphs
                      );
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateNested(
                        "finalSection",
                        "paragraphs",
                        finalSection.paragraphs.filter(
                          (
                            _,
                            itemIndex
                          ) =>
                            itemIndex !==
                            index
                        )
                      )
                    }
                    className="mt-3 text-sm font-medium text-red-600"
                  >
                    Remove paragraph
                  </button>
                </div>
              )
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              updateNested(
                "finalSection",
                "paragraphs",
                [
                  ...finalSection.paragraphs,
                  "",
                ]
              )
            }
            className="mt-3 rounded-full border border-black/15 px-5 py-3 text-sm font-semibold"
          >
            + Add Paragraph
          </button>
        </div>

        <label className="block">
          <span className={labelClass}>
            Button Text
          </span>

          <input
            className={inputClass}
            value={
              finalSection.buttonText
            }
            onChange={(e) =>
              updateNested(
                "finalSection",
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
            value={
              finalSection.buttonLink
            }
            onChange={(e) =>
              updateNested(
                "finalSection",
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
    switch (activeSection) {
      case "Hero":
        return renderHeroFields();

      case "Transformation":
        return renderTransformationFields();

      case "Method":
        return renderMethodFields();

      case "Final Section":
        return renderFinalFields();
    }
  }

  function renderPreview() {
    if (activeSection === "Hero") {
      const hero = draft.hero;
      const image =
        imagePreviews.hero ||
        getEditorImageSrc(
          hero.image
        );

      return (
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative h-[520px] overflow-hidden rounded-[32px] bg-brand-soft">
            <Image
              src={image}
              alt={hero.imageAlt}
              fill
              unoptimized
              className="object-cover object-center"
              sizes="400px"
            />
          </div>

          <div>
            <p className="font-script text-5xl text-brand-coral">
              {hero.eyebrow}
            </p>

            <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
              {hero.heading}
            </h3>

            <p className="mt-5 text-lg leading-8 text-brand-green/75">
              {hero.intro}
            </p>

            <div className="mt-5 space-y-4 leading-7 text-brand-green/70">
              {hero.paragraphs.map(
                (paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      );
    }

    if (
      activeSection ===
      "Transformation"
    ) {
      const transformation =
        draft.transformation;

      return (
        <div>
          <div className="text-center">
            <p className="font-script text-5xl text-brand-coral">
              {
                transformation.eyebrow
              }
            </p>

            <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
              {
                transformation.heading
              }
            </h3>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-brand-green/70">
              {
                transformation.description
              }
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {transformation.beforeImages.map(
              (item, index) => {
                const key =
                  index === 0
                    ? "before-0"
                    : "before-1";

                const image =
                  imagePreviews[key] ||
                  getEditorImageSrc(
                    item.image
                  );

                return (
                  <div key={index}>
                    <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-coral">
                      Before
                    </p>

                    <div className="relative h-[330px] overflow-hidden rounded-[24px] bg-white">
                      <Image
                        src={image}
                        alt={item.alt}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="240px"
                      />
                    </div>
                  </div>
                );
              }
            )}

            <div>
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
                After
              </p>

              <div className="relative h-[330px] overflow-hidden rounded-[24px] bg-white">
                <Image
                  src={
                    imagePreviews.after ||
                    getEditorImageSrc(
                      transformation
                        .afterImage.image
                    )
                  }
                  alt={
                    transformation
                      .afterImage.alt
                  }
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="240px"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-script text-4xl text-brand-pink">
              {
                transformation
                  .resultEyebrow
              }
            </p>

            <h4 className="mt-2 font-serifDisplay text-4xl">
              {
                transformation
                  .resultHeading
              }
            </h4>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-brand-green/70">
              {
                transformation
                  .resultText
              }
            </p>
          </div>
        </div>
      );
    }

    if (activeSection === "Method") {
      const method = draft.method;

      return (
        <div className="rounded-[2rem] bg-brand-green px-8 py-16 text-center text-white">
          <p className="font-script text-5xl text-brand-gold">
            {method.eyebrow}
          </p>

          <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
            {method.heading}
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            {method.description}
          </p>
        </div>
      );
    }

    const finalSection =
      draft.finalSection;

    return (
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="font-script text-5xl text-brand-pink">
            {finalSection.eyebrow}
          </p>

          <h3 className="mt-3 font-serifDisplay text-5xl leading-tight">
            {finalSection.heading}
          </h3>
        </div>

        <div className="space-y-4 leading-7 text-brand-green/70">
          {finalSection.paragraphs.map(
            (paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            )
          )}

          <div className="inline-block rounded-full bg-brand-coral px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
            {
              finalSection.buttonText
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => {
              setActiveSection(section);
              setUploadMessage("");
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeSection === section
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
              About page section
            </p>

            <h3 className="mt-1 text-2xl font-semibold">
              {activeSection}
            </h3>
          </div>

          {renderFields()}

          <div className="mt-8 border-t border-black/10 pt-5">
            <button
              type="button"
              onClick={publishAbout}
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
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
