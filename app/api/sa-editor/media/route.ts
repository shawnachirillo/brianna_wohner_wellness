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
  publishableKey:
    process.env.CLERK_PUBLISHABLE_KEY,
});

type GitHubFileResponse = {
  content?: string;
  encoding?: string;
};

function getContentType(
  filePath: string
) {
  const lower =
    filePath.toLowerCase();

  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg")
  ) {
    return "image/jpeg";
  }

  if (lower.endsWith(".png")) {
    return "image/png";
  }

  if (lower.endsWith(".webp")) {
    return "image/webp";
  }

  if (lower.endsWith(".gif")) {
    return "image/gif";
  }

  if (lower.endsWith(".avif")) {
    return "image/avif";
  }

  return "application/octet-stream";
}

export async function GET(
  request: Request
) {
  try {
    const authState =
      await clerkClient.authenticateRequest(
        request
      );

    if (!authState.isAuthenticated) {
      return new NextResponse(
        "Unauthorized",
        {
          status: 401,
        }
      );
    }

    const url = new URL(request.url);

    const requestedPath =
      url.searchParams.get("path");

    if (!requestedPath) {
      return new NextResponse(
        "Missing image path.",
        {
          status: 400,
        }
      );
    }

    if (
      !requestedPath.startsWith(
        "/uploads/"
      )
    ) {
      return new NextResponse(
        "Invalid image path.",
        {
          status: 400,
        }
      );
    }

    const safePath =
      requestedPath
        .replace(/^\/+/, "")
        .replace(/\.\./g, "");

    const githubPath =
      `public/${safePath}`;

    const token =
      await getGitHubInstallationToken();

    const githubUrl =
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${githubPath}?ref=${BRANCH}`;

    const response = await fetch(
      githubUrl,
      {
        headers: {
          Accept:
            "application/vnd.github+json",
          Authorization:
            `Bearer ${token}`,
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const detail =
        await response.text();

      console.error(
        "GitHub media fetch failed:",
        response.status,
        detail
      );

      return new NextResponse(
        "Image not found.",
        {
          status: response.status,
        }
      );
    }

    const file =
      (await response.json()) as
        GitHubFileResponse;

    if (
      file.encoding !== "base64" ||
      !file.content
    ) {
      return new NextResponse(
        "Invalid image response.",
        {
          status: 500,
        }
      );
    }

    const buffer = Buffer.from(
      file.content.replace(/\n/g, ""),
      "base64"
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          getContentType(githubPath),
        "Cache-Control":
          "private, max-age=60",
      },
    });
  } catch (error) {
    console.error(
      "Media route error:",
      error
    );

    return new NextResponse(
      "Could not load image.",
      {
        status: 500,
      }
    );
  }
}
