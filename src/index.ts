import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { productRoute } from "./routes/product.route";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { userRoute } from "./routes/users.route";
import { authRoute } from "./routes/auth.route";
const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.text("Hello This is Nakama's API!");
});
app.use("*", logger());
app.use(
  "*",
  // cors({
  //   origin:
  //     "'http://localhost:5173','https://nakama.endabelyu.store','https://nakama-api.endabelyu.store','https://postman-echo.com'",
  // }),
  cors(),
);
app.notFound((c) => {
  return c.text("Sorry, the page you are looking for does not exist.", 404);
});
app.onError((err, c) => {
  return c.text(
    "Oops! Something went wrong on our end. Please try again later.",
    500,
  );
});

app.get("/api", swaggerUI({ url: "/doc" }));
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Nakama API",
    description:
      "Nakama API is a RESTful service that provides access to detailed data for one-piece premium merchandise online store",
  },
});

// API ROUTES
app.route("/products", productRoute);
app.route("/users", userRoute);
app.route("/auth", authRoute);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
