import "server-only";

export const GITHUB_USERNAME_REGEX = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

export function githubApiHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "shadcn-dashboard-landing"
  };
}

/**
 * Invites a GitHub user to the repo with read (pull) access.
 * 201 = invitation created, 204 = already a collaborator or invite pending.
 */
export async function inviteCollaborator(repo: string, username: string): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${repo}/collaborators/${username}`, {
    method: "PUT",
    headers: githubApiHeaders(),
    body: JSON.stringify({ permission: "pull" })
  });
  if (![201, 204, 404].includes(res.status)) {
    console.error("GitHub invite error:", res.status, await res.text());
  }
  return res.status;
}

/** True when a GitHub account with this username exists. */
export async function githubUserExists(username: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: githubApiHeaders(),
    cache: "no-store"
  });
  return res.ok;
}

/** True when the user has accepted the invitation and is a collaborator. */
export async function isCollaborator(repo: string, username: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${repo}/collaborators/${username}`, {
    headers: githubApiHeaders(),
    cache: "no-store"
  });
  return res.status === 204;
}

/** Removes collaborator access and cancels any pending invitation for the user. */
export async function revokeRepoAccess(repo: string, username: string): Promise<void> {
  await fetch(`https://api.github.com/repos/${repo}/collaborators/${username}`, {
    method: "DELETE",
    headers: githubApiHeaders()
  });

  const res = await fetch(`https://api.github.com/repos/${repo}/invitations?per_page=100`, {
    headers: githubApiHeaders(),
    cache: "no-store"
  });
  if (!res.ok) return;
  const invitations: { id: number; invitee?: { login?: string } }[] = await res.json();
  for (const invitation of invitations) {
    if (invitation.invitee?.login?.toLowerCase() === username.toLowerCase()) {
      await fetch(`https://api.github.com/repos/${repo}/invitations/${invitation.id}`, {
        method: "DELETE",
        headers: githubApiHeaders()
      });
    }
  }
}

/** True when the user still has an unaccepted invitation to the repo. */
export async function hasPendingInvitation(repo: string, username: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${repo}/invitations?per_page=100`, {
    headers: githubApiHeaders(),
    cache: "no-store"
  });
  if (!res.ok) return false;
  const invitations: { invitee?: { login?: string } }[] = await res.json();
  return invitations.some(
    (invitation) => invitation.invitee?.login?.toLowerCase() === username.toLowerCase()
  );
}
