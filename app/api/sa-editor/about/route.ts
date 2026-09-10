import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getGitHubInstallationToken } from "@/lib/cms/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const BRANCH = "main";
const FILE_PATH = "content/about.json";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey:
    process.env.CLERK_PUBLISHABLE_KEY,
});

async function authenticate(
  request: Request
) {
  const authState =
    await clerkClient.authenticateRequest(
      request
    );

  return authState.isAuthenticated;
}

async function getCurrentFile(
  token: string
) {
  const url =
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

  const response = await fetch(url, {
    headers: {
      Accept:
        "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version":
        "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail =
      await response.text();

    throw new Error(
      `Could not read about.json from GitHub (${response.status}): ${detail}`
    );
  }

  return response.json();
}

export async function PUT(
  request: Request
) {
  try {
    const isAuthenticated =
      await authenticate(request);

    if (!isAuthenticated) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid about page content.",
        },
        {
          status: 400,
        }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const currentFile =
      await getCurrentFile(token);

    const url =
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

    const content = Buffer.from(
      `${JSON.stringify(body, null, 2)}\n`,
      "utf8"
    ).toString("base64");

    const response = await fetch(url, {
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
          "Update about page content",
        content,
        sha: currentFile.sha,
        branch: BRANCH,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail =
        await response.text();

      console.error(
        "GitHub about publish failed:",
        response.status,
        detail
      );

      return NextResponse.json(
        {
          error:
            "GitHub could not save the about page.",
        },
        {
          status: response.status,
        }
      );
    }

    const result =
      await response.json();

    return NextResponse.json({
      success: true,
      commit:
        result.commit?.sha ?? null,
    });
  } catch (error) {
    console.error(
      "About publish route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "About page publish failed.",
      },
      {
        status: 500,
      }
    );
  }
}
