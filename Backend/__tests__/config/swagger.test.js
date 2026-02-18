const { swaggerSpec } = require("../../src/config/swagger");

describe("Swagger Configuration", () => {
  it("genera un spec OpenAPI válido", () => {
    expect(swaggerSpec).toBeDefined();
    expect(swaggerSpec.openapi).toBe("3.0.0");
  });

  it("tiene la información de la API correcta", () => {
    expect(swaggerSpec.info.title).toBe("LIMO API");
    expect(swaggerSpec.info.version).toBe("1.0.0");
    expect(swaggerSpec.info.description).toContain("LIMO");
  });

  it("define los servidores de desarrollo y producción", () => {
    expect(swaggerSpec.servers).toHaveLength(2);
    expect(swaggerSpec.servers[0].description).toContain("desarrollo");
    expect(swaggerSpec.servers[1].description).toContain("producción");
  });

  it("incluye los 3 tags principales", () => {
    const tagNames = swaggerSpec.tags.map((tag) => tag.name);
    expect(tagNames).toContain("Health");
    expect(tagNames).toContain("Payments");
    expect(tagNames).toContain("GraphQL");
  });

  it("tiene paths definidos", () => {
    const pathCount = Object.keys(swaggerSpec.paths).length;
    expect(pathCount).toBeGreaterThanOrEqual(4);
  });
});
