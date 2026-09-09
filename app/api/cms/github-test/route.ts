import { NextResponse } from "next/server";
import { testGitHubRepositoryAccess } from "@/lib/cms/github";

export const runtime = "nodejs";

export async function GET() {
  try {
    const repo = await testGitHubRepositoryAccess();

    return NextResponse.json({
      status: "ok",
      authenticatedAs: "Status Available CMS",
      repository: repo,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unknown GitHub authentication error",
      },
      { status: 500 }
    );
  }
}
