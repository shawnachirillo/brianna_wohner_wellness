import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey:
    process.env.CLERK_PUBLISHABLE_KEY,
});

export type SAEditorAuthorization = {
  authorized: boolean;
  status: 200 | 401 | 403;
  userId: string | null;
};

function getAllowedUserIds() {
  return (
    process.env.SA_EDITOR_ALLOWED_USER_IDS ?? ""
  )
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export async function authorizeSAEditorRequest(
  request: Request
): Promise<SAEditorAuthorization> {
  const authState =
    await clerkClient.authenticateRequest(
      request
    );

  if (!authState.isAuthenticated) {
    return {
      authorized: false,
      status: 401,
      userId: null,
    };
  }

  const auth = authState.toAuth();
  const userId = auth.userId;

  if (!userId) {
    return {
      authorized: false,
      status: 401,
      userId: null,
    };
  }

  const allowedUserIds =
    getAllowedUserIds();

  if (
    allowedUserIds.length === 0 ||
    !allowedUserIds.includes(userId)
  ) {
    return {
      authorized: false,
      status: 403,
      userId,
    };
  }

  return {
    authorized: true,
    status: 200,
    userId,
  };
}