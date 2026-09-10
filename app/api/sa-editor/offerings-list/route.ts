import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getGitHubInstallationToken } from "@/lib/cms/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const BRANCH = "main";
const DIRECTORY = "content/offerings";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey:
    process.env.CLERK_PUBLISHABLE_KEY,
});

type GitHubDirectoryItem = {
  name: string;
  path: string;
  type: string;
  download_url?: string | null;
};

type GitHubFile = {
  content?: string;
  encoding?: string;
};

async function isAuthorized(
  request: Request
) {
  const authState =
    await clerkClient.authenticateRequest(
      request
    );

  return authState.isAuthenticated;
}

function githubHeaders(token: string) {
  return {
    Accept:
      "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version":
      "2022-11-28",
  };
}

export async function GET(
  request: Request
) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const directoryUrl =
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIRECTORY}?ref=${BRANCH}`;

    const directoryResponse =
      await fetch(directoryUrl, {
        headers: githubHeaders(token),
        cache: "no-store",
      });

    if (!directoryResponse.ok) {
      const detail =
        await directoryResponse.text();

      console.error(
        "Could not read offerings directory:",
        directoryResponse.status,
        detail
      );

      return NextResponse.json(
        {
          error:
            "Could not load offerings from GitHub.",
        },
        {
          status:
            directoryResponse.status,
        }
      );
    }

    const directoryItems =
      (await directoryResponse.json()) as
        GitHubDirectoryItem[];

    const jsonFiles =
      directoryItems.filter(
        (item) =>
          item.type === "file" &&
          item.name.endsWith(".json")
      );

    const offerings =
      await Promise.all(
        jsonFiles.map(async (item) => {
          const fileUrl =
            `https://api.github.com/repos/${OWNER}/${REPO}/contents/${item.path}?ref=${BRANCH}`;

          const fileResponse =
            await fetch(fileUrl, {
              headers:
                githubHeaders(token),
              cache: "no-store",
            });

          if (!fileResponse.ok) {
            throw new Error(
              `Could not read ${item.path}`
            );
          }

          const file =
            (await fileResponse.json()) as
              GitHubFile;

          if (
            file.encoding !== "base64" ||
            !file.content
          ) {
            throw new Error(
              `Unexpected GitHub response for ${item.path}`
            );
          }

          const decoded = Buffer.from(
            file.content.replace(
              /\n/g,
              ""
            ),
            "base64"
          ).toString("utf8");

          const data =
            JSON.parse(decoded);

          return {
            ...data,
            slug: item.name.replace(
              /\.json$/,
              ""
            ),
          };
        })
      );

    offerings.sort(
      (a, b) =>
        (a.order ?? 999) -
        (b.order ?? 999)
    );

    return NextResponse.json({
      offerings,
    });
  } catch (error) {
    console.error(
      "Offerings list route error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not load offerings.",
      },
      {
        status: 500,
      }
    );
  }
}
