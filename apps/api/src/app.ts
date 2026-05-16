import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono()
  .use("/api/*", cors({ origin: "*" }))
  .get("/api/health", (c) =>
    c.json({
      status: "ok" as const,
      timestamp: new Date().toISOString(),
    }),
  );

export type AppType = typeof app;
