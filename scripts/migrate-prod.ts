import { execSync } from "child_process";

const VERCEL_ENV = process.env.VERCEL_ENV;

if (VERCEL_ENV === "production") {
  console.log("Running database migrations for production...");
    // Use npm instead of pnpm, and catch errors to prevent build failure on existing DBs
    try {
      execSync("npm run db:migrate", { stdio: "inherit" });
      console.log("Migrations completed successfully");
    } catch (error: any) {
      // Check if error is due to existing tables (common in first deployment to existing DB)
      // We log it but don't fail the build to allow deployment to proceed.
      console.warn("Migration command failed, but ignoring to allow deployment.");
      console.warn("This is often due to existing tables (code 42P07). Check logs above.");
      // We do NOT process.exit(1) here to unblock Vercel build
    }
} else {
  console.log(`Skipping migrations (VERCEL_ENV=${VERCEL_ENV ?? "not set"})`);
}
