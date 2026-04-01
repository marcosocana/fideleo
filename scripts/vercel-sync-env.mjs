import fs from "node:fs";
import { execFileSync } from "node:child_process";

const scope = process.argv[2];
const projectUrl = process.argv[3] ?? "https://fideleo.vercel.app";
const environments = (process.argv[4] ?? "production").split(",").filter(Boolean);

if (!scope) {
  throw new Error("Missing Vercel scope.");
}

const envFile = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const vars = {
  NEXT_PUBLIC_SUPABASE_URL: envFile.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: envFile.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: envFile.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL: projectUrl,
  RESEND_FROM_EMAIL: envFile.RESEND_FROM_EMAIL
};

for (const target of environments) {
  for (const [key, value] of Object.entries(vars)) {
    const targetArgs = target === "preview" ? ["preview", "main"] : [target];

    try {
      execFileSync("npx", ["vercel", "env", "rm", key, ...targetArgs, "-y", "--scope", scope], {
        stdio: "ignore"
      });
    } catch {}

    execFileSync("npx", ["vercel", "env", "add", key, ...targetArgs, "--value", value, "--yes", "--scope", scope], {
      stdio: "ignore"
    });

    console.log(`set ${key} for ${target}`);
  }
}
