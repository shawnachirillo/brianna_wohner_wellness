import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getGitHubInstallationToken } from "@/lib/cms/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com";
const GITHUB_API_VERSION = "2026-03-10";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

const ALLOWED_ROOTS = [
  "git",
  "contents",
  "pulls",
  "branches",
  "merges",
  "statuses",
  "compare",
  "commits",
];

function isAllowedPath(path: string) {
  if (
    ALLOWED_ROOTS.some(
      (root) => path === root || path.startsWith(`${root}/`)
    )
  ) {
    return true;
  }

  return /^issues\/\d+\/labels(?:\/.*)?$/.test(path);
}

async function handler(
  request: Request,
  context: { params: { path: string[] } }
) {
  try {
    const authState = await clerkClient.authenticateRequest(request, {
      acceptsToken: "oauth_token",
    });

    if (!authState.isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const path = context.params.path.join("/");

    if (!path || !isAllowedPath(path)) {
      return NextResponse.json(
        { error: "GitHub path not allowed" },
        { status: 403 }
      );
    }

    const githubToken = await getGitHubInstallationToken();

    const incomingUrl = new URL(request.url);
    const githubUrl = new URL(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/${path}`
    );

    incomingUrl.searchParams.forEach((value, key) => {
      githubUrl.searchParams.append(key, value);
    });

    const headers = new Headers();

    headers.set("Accept", "application/vnd.github+json");
    headers.set("Authorization", `Bearer ${githubToken}`);
    headers.set("X-GitHub-Api-Version", GITHUB_API_VERSION);
    headers.set("User-Agent", "Status-Available-CMS");

    const contentType = request.headers.get("content-type");

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    const method = request.method.toUpperCase();

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const githubResponse = await fetch(githubUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();

    const githubContentType =
      githubResponse.headers.get("content-type");

    if (githubContentType) {
      responseHeaders.set("Content-Type", githubContentType);
    }

    const link = githubResponse.headers.get("link");

    if (link) {
      responseHeaders.set("Link", link);
    }

    const bodyBuffer = await githubResponse.arrayBuffer();

    return new NextResponse(bodyBuffer, {
      status: githubResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("CMS Git Gateway error:", error);

    return NextResponse.json(
      { error: "Git Gateway request failed" },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
