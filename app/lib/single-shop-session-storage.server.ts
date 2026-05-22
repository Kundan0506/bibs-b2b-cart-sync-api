import type { SessionStorage } from "@shopify/shopify-app-session-storage";
import { Session } from "@shopify/shopify-api";

const memorySessions = new Map<string, Session>();

export function normalizeShop(shop: string): string {
  return shop
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export function configuredShop(): string | null {
  const raw = process.env.SHOPIFY_SHOP?.trim();
  return raw ? normalizeShop(raw) : null;
}

function offlineSessionId(shop: string): string {
  return `offline_${normalizeShop(shop)}`;
}

function sessionFromEnv(shop: string): Session | undefined {
  const configured = configuredShop();
  const token = process.env.SHOPIFY_ACCESS_TOKEN?.trim();
  if (!configured || !token || normalizeShop(shop) !== configured) {
    return undefined;
  }

  return new Session({
    id: offlineSessionId(configured),
    shop: configured,
    state: "env",
    isOnline: false,
    accessToken: token,
    scope: process.env.SCOPES || "",
  });
}

/**
 * Session storage for a single store (bibs-b2b).
 * Production: SHOPIFY_SHOP + SHOPIFY_ACCESS_TOKEN env vars.
 * Install: OAuth session kept in memory until you copy the token to Render.
 */
export class SingleShopSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    memorySessions.set(session.id, session);
    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    const fromMemory = memorySessions.get(id);
    if (fromMemory) return fromMemory;

    const offlineMatch = id.match(/^offline_(.+)$/);
    if (offlineMatch) {
      const fromEnv = sessionFromEnv(offlineMatch[1]);
      if (fromEnv) return fromEnv;
    }

    const configured = configuredShop();
    if (configured) {
      return sessionFromEnv(configured);
    }

    return undefined;
  }

  async deleteSession(id: string): Promise<boolean> {
    memorySessions.delete(id);
    return true;
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    ids.forEach((id) => memorySessions.delete(id));
    return true;
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    const normalized = normalizeShop(shop);
    const session =
      sessionFromEnv(normalized) ??
      memorySessions.get(offlineSessionId(normalized));
    return session ? [session] : [];
  }
}

/** Offline token from a recent OAuth install (before copying to env). */
export function getPendingOfflineAccessToken(): string | null {
  const configured = configuredShop();
  if (configured) {
    const session = memorySessions.get(offlineSessionId(configured));
    if (session?.accessToken && !session.isOnline) {
      return session.accessToken;
    }
  }

  for (const session of memorySessions.values()) {
    if (!session.isOnline && session.accessToken) {
      return session.accessToken;
    }
  }

  return null;
}

export function assertShopAllowed(shop: string | null): void {
  if (!shop) return;
  const configured = configuredShop();
  if (!configured) return;
  if (normalizeShop(shop) !== configured) {
    throw new Response("This app is only configured for one store.", {
      status: 403,
    });
  }
}

export function isAccessTokenConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_ACCESS_TOKEN?.trim());
}
