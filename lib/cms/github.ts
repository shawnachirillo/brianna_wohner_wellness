import { importPKCS8, SignJWT } from "jose";

const GITHUB_API_VERSION = "2026-03-10";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function createGitHubAppJwt() {
  const appId = getRequiredEnv("GITHUB_APP_ID");

  const privateKey = Buffer.from(
    getRequiredEnv("GITHUB_PRIVATE_KEY_BASE64"),
    "base64"
  ).toString("utf8");

  const key = await importPKCS8(privateKey, "RS256");

  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt(now - 60)
    .setExpirationTime(now + 9 * 60)
    .setIssuer(appId)
    .sign(key);
}

type CachedInstallationToken = {
  token: string;
  expiresAt: number;
};

let cachedInstallationToken: CachedInstallationToken | null = null;

export async function getGitHubInstallationToken() {
  const now = Date.now();

  // Reuse the existing GitHub installation token until
  // five minutes before GitHub says it expires.
  if (
    cachedInstallationToken &&
    cachedInstallationToken.expiresAt - now > 5 * 60 * 1000
  ) {
    return cachedInstallationToken.token;
  }

  const installationId = getRequiredEnv("GITHUB_INSTALLATION_ID");
  const jwt = await createGitHubAppJwt();

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${jwt}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to create GitHub installation token: ${response.status} ${error}`
    );
  }

  const data = await response.json();

  if (!data.token || !data.expires_at) {
    throw new Error(
      "GitHub did not return a valid installation token."
    );
  }

  cachedInstallationToken = {
    token: data.token,
    expiresAt: new Date(data.expires_at).getTime(),
  };

  return cachedInstallationToken.token;
}

export async function testGitHubRepositoryAccess() {
  const token = await getGitHubInstallationToken();

  const response = await fetch(
    "https://api.github.com/repos/shawnachirillo/brianna_wohner_wellness",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub repository access failed: ${response.status} ${error}`
    );
  }

  const repo = await response.json();

  return {
    name: repo.full_name,
    private: repo.private,
    defaultBranch: repo.default_branch,
    permissions: repo.permissions ?? null,
  };
}