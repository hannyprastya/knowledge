import { app } from "./app";

export { app, type AppType } from "./app";

export default {
  port: Number(process.env.PORT ?? 3000),
  fetch: app.fetch,
};
