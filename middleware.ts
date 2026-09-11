import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

const isSAEditorPage =
  createRouteMatcher([
    "/sa-editor(.*)",
  ]);

const isSAEditorAPI =
  createRouteMatcher([
    "/api/sa-editor(.*)",
  ]);

const isOwnerCMS =
  createRouteMatcher([
    "/admin(.*)",
    "/cms(.*)",
  ]);

function getUserIds(
  value: string | undefined
) {
  return (value ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function getEditorUserIds() {
  return getUserIds(
    process.env
      .SA_EDITOR_ALLOWED_USER_IDS
  );
}

function getOwnerUserIds() {
  return getUserIds(
    process.env.SA_OWNER_USER_IDS
  );
}

export default clerkMiddleware(
  async (auth, request) => {
    const isEditorPage =
      isSAEditorPage(request);

    const isEditorAPI =
      isSAEditorAPI(request);

    const isCMS =
      isOwnerCMS(request);

    if (
      !isEditorPage &&
      !isEditorAPI &&
      !isCMS
    ) {
      return;
    }

    const { userId } = await auth();

    /*
     * -------------------------
     * NOT SIGNED IN
     * -------------------------
     */

    if (!userId) {
      if (isEditorAPI) {
        return NextResponse.json(
          {
            error: "Unauthorized.",
          },
          {
            status: 401,
          }
        );
      }

      const signInUrl =
        new URL(
          "/sign-in",
          request.url
        );

      signInUrl.searchParams.set(
        "redirect_url",
        isCMS
          ? "/admin"
          : "/sa-editor"
      );

      return NextResponse.redirect(
        signInUrl
      );
    }

    /*
     * -------------------------
     * OWNER-ONLY DECAP CMS
     * -------------------------
     */

    if (isCMS) {
      const ownerUserIds =
        getOwnerUserIds();

      if (
        ownerUserIds.length === 0 ||
        !ownerUserIds.includes(
          userId
        )
      ) {
        return NextResponse.redirect(
          new URL(
            "/",
            request.url
          )
        );
      }

      return;
    }

    /*
     * -------------------------
     * STATUS: AVAILABLE EDITOR
     * -------------------------
     */

    const allowedUserIds =
      getEditorUserIds();

    if (
      allowedUserIds.length === 0 ||
      !allowedUserIds.includes(
        userId
      )
    ) {
      if (isEditorAPI) {
        return NextResponse.json(
          {
            error:
              "You do not have permission to manage this site.",
          },
          {
            status: 403,
          }
        );
      }

      return NextResponse.redirect(
        new URL(
          "/",
          request.url
        )
      );
    }
  }
);

export const config = {
  matcher: [
    "/admin(.*)",
    "/cms(.*)",
    "/sa-editor(.*)",
    "/api/sa-editor(.*)",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};