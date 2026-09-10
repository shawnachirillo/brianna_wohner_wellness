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

function slugifyFileName(fileName: string) {
  const lastDot = fileName.lastIndexOf(".");

  const extension =
    lastDot >= 0 ? fileName.slice(lastDot).toLowerCase() : "";

  const base =
    lastDot >= 0 ? fileName.slice(0, lastDot) : fileName;

  const safeBase = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${safeBase || "image"}-${Date.now()}${extension}`;
}

type UploadPayload = {
  fileName: string;
  fileType: string;
  base64: string;
};

export async function POST(request: Request) {
  try {
    const authState = await clerkClient.authenticateRequest(request);

    if (!authState.isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as UploadPayload;

    if (!body.fileName || !body.base64) {
      return NextResponse.json(
        { error: "Image data is missing." },
        { status: 400 }
      );
    }

    if (!body.fileType?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const cleanBase64 = body.base64.includes(",")
      ? body.base64.split(",")[1]
      : body.base64;

    const buffer = Buffer.from(cleanBase64, "base64");

    const maxSize = 8 * 1024 * 1024;

    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: "Image must be smaller than 8 MB." },
        { status: 400 }
      );
    }

    const safeFileName = slugifyFileName(body.fileName);

    const filePath = `public/uploads/${safeFileName}`;

    const token = await getGitHubInstallationToken();

    const githubUrl =
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath}`;

    const response = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Upload image: ${safeFileName}`,
        content: buffer.toString("base64"),
        branch: BRANCH,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();

      console.error("Image upload failed:", error);

      return NextResponse.json(
        { error: "Image upload failed." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      path: `/uploads/${safeFileName}`,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}