import { NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { getGitHubInstallationToken } from "@/lib/cms/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const BRANCH = "main";
const DIRECTORY = "content/schedule";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey:
    process.env.CLERK_PUBLISHABLE_KEY,
});

type ScheduleEventPayload = {
  slug: string;
  id: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  description?: string;
  thrivecartUrl: string;
  isPublished: boolean;
};

type GitHubFile = {
  sha?: string;
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

function cleanSlug(slug: string) {
  return slug
    .replace(/\.json$/i, "")
    .replace(/[^a-zA-Z0-9-_]/g, "");
}

function filePath(slug: string) {
  return `${DIRECTORY}/${cleanSlug(slug)}.json`;
}

function fileContent(
  payload: ScheduleEventPayload
) {
  const {
    slug: _slug,
    ...content
  } = payload;

  return Buffer.from(
    `${JSON.stringify(content, null, 2)}\n`,
    "utf8"
  ).toString("base64");
}

async function getExistingFile(
  token: string,
  slug: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath(slug)}?ref=${BRANCH}`,
    {
      headers:
        githubHeaders(token),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const detail =
      await response.text();

    throw new Error(
      `Could not read schedule file (${response.status}): ${detail}`
    );
  }

  return (await response.json()) as
    GitHubFile;
}

async function saveFile(
  token: string,
  payload: ScheduleEventPayload,
  sha?: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath(payload.slug)}`,
    {
      method: "PUT",
      headers: {
        ...githubHeaders(token),
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        message: sha
          ? `Update schedule event: ${payload.title}`
          : `Create schedule event: ${payload.title}`,
        content:
          fileContent(payload),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail =
      await response.text();

    console.error(
      "GitHub schedule save failed:",
      response.status,
      detail
    );

    return NextResponse.json(
      {
        error:
          "GitHub could not save the schedule event.",
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
}

export async function POST(
  request: Request
) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload =
      (await request.json()) as
        ScheduleEventPayload;

    if (
      !payload.slug ||
      !payload.title ||
      !payload.date ||
      !payload.startTime
    ) {
      return NextResponse.json(
        {
          error:
            "Title, date, and start time are required.",
        },
        {
          status: 400,
        }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const existing =
      await getExistingFile(
        token,
        payload.slug
      );

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A schedule event with this file name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    return await saveFile(
      token,
      payload
    );
  } catch (error) {
    console.error(
      "Create schedule event error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create schedule event.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const payload =
      (await request.json()) as
        ScheduleEventPayload;

    if (
      !payload.slug ||
      !payload.title ||
      !payload.date ||
      !payload.startTime
    ) {
      return NextResponse.json(
        {
          error:
            "Title, date, and start time are required.",
        },
        {
          status: 400,
        }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const existing =
      await getExistingFile(
        token,
        payload.slug
      );

    if (!existing?.sha) {
      return NextResponse.json(
        {
          error:
            "That schedule event could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    return await saveFile(
      token,
      payload,
      existing.sha
    );
  } catch (error) {
    console.error(
      "Update schedule event error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update schedule event.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    if (!(await isAuthorized(request))) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body =
      (await request.json()) as {
        slug?: string;
        title?: string;
      };

    if (!body.slug) {
      return NextResponse.json(
        {
          error:
            "Missing schedule event slug.",
        },
        {
          status: 400,
        }
      );
    }

    const token =
      await getGitHubInstallationToken();

    const existing =
      await getExistingFile(
        token,
        body.slug
      );

    if (!existing?.sha) {
      return NextResponse.json(
        {
          error:
            "That schedule event could not be found.",
        },
        {
          status: 404,
        }
      );
    }

    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${filePath(body.slug)}`,
      {
        method: "DELETE",
        headers: {
          ...githubHeaders(token),
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          message:
            `Delete schedule event: ${
              body.title ||
              body.slug
            }`,
          sha: existing.sha,
          branch: BRANCH,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const detail =
        await response.text();

      console.error(
        "GitHub schedule delete failed:",
        response.status,
        detail
      );

      return NextResponse.json(
        {
          error:
            "GitHub could not delete the schedule event.",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Delete schedule event error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not delete schedule event.",
      },
      {
        status: 500,
      }
    );
  }
}
