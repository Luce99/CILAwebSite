const request = require("supertest");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("../../src/config/swagger");

function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "connected", database: "connected" });
  });
  return app;
}

describe("Endpoints de integración", () => {
  let app;

  beforeAll(() => {
    app = buildTestApp();
  });

  describe("GET /health", () => {
    it("retorna status 200 con estado del servidor", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("database");
    });

    it("retorna content-type JSON", async () => {
      const response = await request(app).get("/health");

      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /api-docs", () => {
    it("retorna la página de Swagger UI con status 200", async () => {
      const response = await request(app).get("/api-docs/").redirects(1);

      expect(response.status).toBe(200);
      expect(response.text).toContain("swagger");
    });
  });

  describe("GET /api-docs.json", () => {
    it("retorna el spec JSON de OpenAPI", async () => {
      const response = await request(app).get("/api-docs.json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("openapi", "3.0.0");
      expect(response.body).toHaveProperty("info");
      expect(response.body.info).toHaveProperty("title", "LIMO API");
    });

    it("contiene los paths documentados", async () => {
      const response = await request(app).get("/api-docs.json");
      const paths = Object.keys(response.body.paths);

      expect(paths).toContain("/health");
      expect(paths).toContain("/api/payments/create-preference");
      expect(paths).toContain("/api/payments/webhook");
      expect(paths).toContain("/api/payments/status/{paymentId}");
      expect(paths).toContain("/graphql");
    });

    it("contiene los schemas de componentes", async () => {
      const response = await request(app).get("/api-docs.json");
      const schemas = Object.keys(response.body.components.schemas);

      expect(schemas).toContain("Producto");
      expect(schemas).toContain("User");
      expect(schemas).toContain("Venta");
      expect(schemas).toContain("Rol");
      expect(schemas).toContain("GraphQLQuery");
    });

    it("contiene los tags definidos", async () => {
      const response = await request(app).get("/api-docs.json");
      const tagNames = response.body.tags.map((tag) => tag.name);

      expect(tagNames).toContain("Health");
      expect(tagNames).toContain("Payments");
      expect(tagNames).toContain("GraphQL");
    });
  });
});
