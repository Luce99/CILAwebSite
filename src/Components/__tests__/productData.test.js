import products, { CATEGORIES } from "../product-data";

const REQUIRED_FIELDS = ["id", "name", "productType", "category", "price", "image", "images", "colors", "sizes", "description", "quantity"];
const VALID_CATEGORIES = ["Tops", "Bottoms", "Vestidos", "Novedades"];

describe("product-data integridad", () => {
  it("exporta un arreglo de productos no vacío", () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it("cada producto tiene todos los campos requeridos", () => {
    products.forEach((product) => {
      REQUIRED_FIELDS.forEach((field) => {
        expect(product).toHaveProperty(field);
      });
    });
  });

  it("todos los IDs son únicos", () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("todos los productos tienen una categoría válida", () => {
    products.forEach((product) => {
      expect(VALID_CATEGORIES).toContain(product.category);
    });
  });

  it("todos los productos tienen precio mayor a 0", () => {
    products.forEach((product) => {
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it("cada producto tiene al menos una imagen en el arreglo images", () => {
    products.forEach((product) => {
      expect(product.images.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("image principal está incluida en el arreglo images", () => {
    products.forEach((product) => {
      expect(product.images).toContain(product.image);
    });
  });

  it("cada producto tiene al menos un color", () => {
    products.forEach((product) => {
      expect(product.colors.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("cada producto tiene al menos una talla", () => {
    products.forEach((product) => {
      expect(product.sizes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("CATEGORIES exporta las 4 categorías con path correcto", () => {
    expect(CATEGORIES).toHaveLength(4);
    CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty("name");
      expect(cat).toHaveProperty("path");
      expect(cat.path).toMatch(/^\/categoria\//);
    });
  });

  it("no hay categorías Caóticas ni Encantadoras", () => {
    products.forEach((product) => {
      expect(product.category).not.toBe("Caóticas");
      expect(product.category).not.toBe("Encantadoras");
    });
  });

  it("todos los nombres de producto son strings no vacíos", () => {
    products.forEach((product) => {
      expect(typeof product.name).toBe("string");
      expect(product.name.length).toBeGreaterThan(0);
    });
  });
});
