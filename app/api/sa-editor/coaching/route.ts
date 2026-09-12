import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getGitHubInstallationToken } from "@/lib/cms/github";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const FILE_PATH = "content/coaching.json";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const token =
      await getGitHubInstallationToken();

    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Could not read coaching.json from GitHub:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Could not load coaching content.",
        },
        { status: 500 }
      );
    }

    const file =
      await response.json();

    if (!file.content) {
      return NextResponse.json(
        {
          error:
            "Coaching file had no content.",
        },
        { status: 500 }
      );
    }

    const decodedContent =
      Buffer.from(
        file.content,
        "base64"
      ).toString("utf8");

    const content =
      JSON.parse(decodedContent);

    return NextResponse.json(
      content,
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Coaching load error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not load coaching content.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const content =
      await request.json();

    if (
      !content?.hero ||
      !content?.included ||
      !content?.realFix ||
      !content?.cta
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid coaching content.",
        },
        { status: 400 }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const fileResponse =
      await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.github+json",
            "X-GitHub-Api-Version":
              "2022-11-28",
          },
          cache: "no-store",
        }
      );

    if (!fileResponse.ok) {
      const errorText =
        await fileResponse.text();

      console.error(
        "Could not read coaching.json from GitHub:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Could not load the current coaching file.",
        },
        { status: 500 }
      );
    }

    const existingFile =
      await fileResponse.json();

    const encodedContent =
      Buffer.from(
        `${JSON.stringify(
          content,
          null,
          2
        )}\n`,
        "utf8"
      ).toString("base64");

    const saveResponse =
      await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              "application/vnd.github+json",
            "Content-Type":
              "application/json",
            "X-GitHub-Api-Version":
              "2022-11-28",
          },

          body: JSON.stringify({
            message:
              "Update coaching content",
            content:
              encodedContent,
            sha:
              existingFile.sha,
            branch: "main",
          }),
        }
      );

    if (!saveResponse.ok) {
      const errorText =
        await saveResponse.text();

      console.error(
        "Could not update coaching.json in GitHub:",
        errorText
      );

      return NextResponse.json(
        {
          error:
            "GitHub rejected the coaching update.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Coaching publish error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Publishing failed.",
      },
      { status: 500 }
    );
  }
}