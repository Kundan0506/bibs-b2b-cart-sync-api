import { access } from "node:fs/promises";
import { execSync } from "node:child_process";

const serverEntry = "build/server/index.js";

try {
  await access(serverEntry);
} catch {
  console.log(`[render] ${serverEntry} missing — running production build...`);
  if (!process.env.SHOPIFY_APP_URL) {
    process.env.SHOPIFY_APP_URL = "http://localhost:3000";
  }
  execSync("npm run build", { stdio: "inherit" });
}
