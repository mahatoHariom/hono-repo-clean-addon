import { OpenAPIHono } from "@hono/zod-openapi";
import { productRoute } from "./routes/product.route";
import { userRoute } from "./routes/users.route";
import { authRoute } from "./routes/auth.route";
import { cartRoute } from "./routes/cart.route";
import { orderRoute } from "./routes/order.route";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new OpenAPIHono();
const API_TAGS = ["Auth", "Products", "Users", "Orders", "Carts"];

// Set global middleware
app.use("*", logger());
app.use("*", cors());

// Register security schemes once
app.openAPIRegistry.registerComponent(
  "securitySchemes",
  "AuthorizationBearer",
  {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token",
  }
);

// Serve API documentation
app.get(
  "/api",
  apiReference({
    spec: {
      url: "/doc",
    },
  })
);
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Nakama API",
    description:
      "Nakama API is a RESTful service that provides access to detailed data for one-piece premium merchandise online store",
  },
});

// Set default routes
app.get("/", (c) => c.text("Hello This is Nakama's API!"));
app.notFound((c) => c.text("Sorry, the page you are looking for does not exist.", 404));
app.onError((err, c) =>
  c.text("Oops! Something went wrong on our end. Please try again later.", 500)
);

// Mount routes
app.route("/products", productRoute);
app.route("/users", userRoute);
app.route("/auth", authRoute);
app.route("/carts", cartRoute);
app.route("/orders", orderRoute);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
