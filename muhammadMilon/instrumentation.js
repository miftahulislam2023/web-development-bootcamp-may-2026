export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { warnEnvOnce } = await import("./lib/env-warnings.js");
    warnEnvOnce();
  }
}
