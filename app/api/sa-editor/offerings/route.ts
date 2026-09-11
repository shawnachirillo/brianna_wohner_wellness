import { NextResponse } from "next/server";

import { getGitHubInstallationToken } from "@/lib/cms/github";
import { authorizeSAEditorRequest } from "@/lib/sa-editor/authorize";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const OWNER = "shawnachirillo";
const REPO = "brianna_wohner_wellness";
const BRANCH = "main";

type OfferingPayload = {
  slug: string;
  name: string;
  description: string;
  price?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
};

async function rejectUnauthorized(
  request: Request
) {
  const authorization =
    await authorizeSAEditorRequest(request);

  if (authorization.authorized) {
    return null;
  }

  return NextResponse.json(
    {
      error:
        authorization.status === 401
          ? "Unauthorized."
          : "You do not have permission to manage this site.",
    },
    {
      status: authorization.status,
    }
  );
}

async function getHeaders() {
  const token =
    await getGitHubInstallationToken();

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function githubFileUrl(slug: string) {
  return `https://api.github.com/repos/${OWNER}/${REPO}/contents/content/offerings/${slug}.json`;
}

function buildContent(
  offering: OfferingPayload
) {
  return {
    name: offering.name,
    description: offering.description,
    price: offering.price ?? "",
    image: offering.image ?? "",
    buttonText:
      offering.buttonText ?? "",
    buttonLink:
      offering.buttonLink ?? "",
    order: offering.order ?? 999,
  };
}

async function getExistingFile(
  slug: string,
  headers: Record<string, string>
) {
  const response = await fetch(
    `${githubFileUrl(slug)}?ref=${BRANCH}`,
    {
      headers,
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub lookup failed: ${error}`
    );
  }

  return response.json();
}

async function saveOffering(
  offering: OfferingPayload
) {
  const headers = await getHeaders();

  const existing =
    await getExistingFile(
      offering.slug,
      headers
    );

  const payload: {
    message: string;
    content: string;
    branch: string;
    sha?: string;
  } = {
    message: existing
      ? `Update offering: ${offering.name}`
      : `Create offering: ${offering.name}`,
    content: Buffer.from(
      JSON.stringify(
        buildContent(offering),
        null,
        2
      ) + "\n"
    ).toString("base64"),
    branch: BRANCH,
  };

  if (existing) {
    payload.sha = existing.sha;
  }

  const response = await fetch(
    githubFileUrl(offering.slug),
    {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    console.error(
      "GitHub offering save failed:",
      response.status,
      responseText
    );

    throw new Error(
      "GitHub could not save the offering."
    );
  }

  return JSON.parse(responseText);
}

export async function PUT(
  request: Request
) {
  try {
    const unauthorized =
      await rejectUnauthorized(request);

    if (unauthorized) {
      return unauthorized;
    }

    const offering =
      (await request.json()) as OfferingPayload;

    if (
      !offering.slug ||
      !offering.name?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Offering slug and name are required.",
        },
        { status: 400 }
      );
    }

    const result =
      await saveOffering(offering);

    return NextResponse.json({
      success: true,
      commit:
        result.commit?.sha ?? null,
    });
  } catch (error) {
    console.error(
      "Offering update error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Publishing failed.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const unauthorized =
      await rejectUnauthorized(request);

    if (unauthorized) {
      return unauthorized;
    }

    const offering =
      (await request.json()) as OfferingPayload;

    if (
      !offering.slug ||
      !offering.name?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Offering slug and name are required.",
        },
        { status: 400 }
      );
    }

    const result =
      await saveOffering(offering);

    return NextResponse.json({
      success: true,
      commit:
        result.commit?.sha ?? null,
    });
  } catch (error) {
    console.error(
      "Offering create error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Creating offering failed.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const unauthorized =
      await rejectUnauthorized(request);

    if (unauthorized) {
      return unauthorized;
    }

    const { slug, name } =
      (await request.json()) as {
        slug?: string;
        name?: string;
      };

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Offering slug is required.",
        },
        { status: 400 }
      );
    }

    const headers = await getHeaders();

    const existing =
      await getExistingFile(
        slug,
        headers
      );

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Offering does not exist.",
        },
        { status: 404 }
      );
    }

    const response = await fetch(
      githubFileUrl(slug),
      {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          message:
            `Delete offering: ${name ?? slug}`,
          sha: existing.sha,
          branch: BRANCH,
        }),
        cache: "no-store",
      }
    );

    const responseText =
      await response.text();

    if (!response.ok) {
      console.error(
        "GitHub offering delete failed:",
        response.status,
        responseText
      );

      return NextResponse.json(
        {
          error:
            "Deleting offering failed.",
        },
        {
          status: response.status,
        }
      );
    }

    const result =
      JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      commit:
        result.commit?.sha ?? null,
    });
  } catch (error) {
    console.error(
      "Offering delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Deleting offering failed.",
      },
      { status: 500 }
    );
  }
}