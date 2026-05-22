import type { SessionStorage } from "@shopify/shopify-app-session-storage";
import { Session } from "@shopify/shopify-api";

const memorySessions = new Map<string, Session>();

export function normalizeShop(shop: string): string {
  return shop
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

function offlineSessionId(shop: string): string {
  return `offline_${normalizeShop(shop)}`;
}

/**
 * In-memory OAuth sessions only.
 * Requires SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SHOPIFY_APP_URL, SCOPES on Render.
 * After install, open the app in Admin once per deploy/restart to refresh the session.
 */
export class SingleShopSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    memorySessions.set(session.id, session);
    return true;
  }

  async loadSession(id: string): Promise<Session | undefined> {
    return memorySessions.get(id);
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
    const session = memorySessions.get(offlineSessionId(shop));
    return session ? [session] : [];
  }
}

export function getInstalledShop(): string | null {
  for (const session of memorySessions.values()) {
    if (!session.isOnline && session.shop && session.accessToken) {
      return session.shop;
    }
  }
  return null;
}

export function hasOfflineSession(): boolean {
  return getInstalledShop() !== null;
}
