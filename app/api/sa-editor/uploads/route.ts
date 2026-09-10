import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getGitHubInstallationToken } from "@/lib/cms/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const BRANCH = "main";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

type UploadPayload = {
  fileName?: string;
  fileType?: string;
  base64?: string;
};

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

function getExtension(fileName: string) {
  const dot = fileName.lastIndexOf(".");

  if (dot === -1) {
    return "";
  }

  return fileName
    .slice(dot)
    .toLowerCase();
}

function makeSafeFileName(
  fileName: string
) {
  const extension =
    getExtension(fileName);

  const originalBase = extension
    ? fileName.slice(
        0,
        -extension.length
      )
    : fileName;

  const safeBase = originalBase
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeBase || "image"}-${Date.now()}${extension}`;
}

export async function POST(
  request: Request
) {
  try {
    const authState =
      await clerkClient.authenticateRequest(
        request
      );

    if (!authState.isAuthenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      (await request.json()) as UploadPayload;

    if (!body.fileName) {
      console.error(
        "Upload rejected: missing fileName"
      );

      return NextResponse.json(
        {
          error:
            "The image filename is missing.",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.base64) {
      console.error(
        "Upload rejected: missing base64 data"
      );

      return NextResponse.json(
        {
          error:
            "The image data is missing.",
        },
        {
          status: 400,
        }
      );
    }

    const extension =
      getExtension(body.fileName);

    const validMime =
      body.fileType?.startsWith(
        "image/"
      ) ?? false;

    const validExtension =
      allowedExtensions.includes(
        extension
      );

    if (
      !validMime &&
      !validExtension
    ) {
      console.error(
        "Upload rejected: unsupported image",
        {
          fileName: body.fileName,
          fileType:
            body.fileType || "(empty)",
          extension,
        }
      );

      return NextResponse.json(
        {
          error:
            "Please upload a JPG, PNG, WEBP, GIF, or AVIF image.",
        },
        {
          status: 400,
        }
      );
    }

    const commaIndex =
      body.base64.indexOf(",");

    const cleanBase64 =
      commaIndex >= 0
        ? body.base64.slice(
            commaIndex + 1
          )
        : body.base64;

    let imageBuffer: Buffer;

    try {
      imageBuffer = Buffer.from(
        cleanBase64,
        "base64"
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "The image could not be processed.",
        },
        {
          status: 400,
        }
      );
    }

    if (!imageBuffer.length) {
      return NextResponse.json(
        {
          error:
            "The uploaded image is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize =
      8 * 1024 * 1024;

    if (
      imageBuffer.length > maxSize
    ) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 8 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const safeFileName =
      makeSafeFileName(
        body.fileName
      );

    const filePath =
      `public/uploads/${safeFileName}`;

    const token =
      await getGitHubInstallationToken();

    const githubUrl =
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;

    const githubResponse =
      await fetch(githubUrl, {
        method: "PUT",

        headers: {
          Accept:
            "application/vnd.github+json",

          Authorization:
            `Bearer ${token}`,

          "X-GitHub-Api-Version":
            "2022-11-28",

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message:
            `Upload image: ${safeFileName}`,

          content:
            imageBuffer.toString(
              "base64"
            ),

          branch: BRANCH,
        }),

        cache: "no-store",
      });

    if (!githubResponse.ok) {
      const githubError =
        await githubResponse.text();

      console.error(
        "GitHub image upload failed:",
        githubResponse.status,
        githubError
      );

      return NextResponse.json(
        {
          error:
            "GitHub could not save the image.",
        },
        {
          status:
            githubResponse.status,
        }
      );
    }

    const result =
      await githubResponse.json();

    console.log(
      "Image uploaded successfully:",
      filePath
    );

    return NextResponse.json({
      success: true,

      path:
        `/uploads/${safeFileName}`,

      commit:
        result.commit?.sha ?? null,
    });
  } catch (error) {
    console.error(
      "Image upload route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}