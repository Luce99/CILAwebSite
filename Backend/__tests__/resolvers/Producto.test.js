const { productoResolvers } = require("../../src/resolvers/Producto");
const productoService = require("../../src/services/Producto");

jest.mock("../../src/services/Producto");

const SAMPLE_PRODUCT = {
  _id: "abc123",
  name: "Jean Tiro Alto",
  category: "Bottoms",
  price: 70000,
  images: ["/img1.png", "/img2.png"],
  colors: ["Azul", "Negro"],
  sizes: ["26", "28", "30"],
};

describe("Producto Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Query", () => {
    it("getProductos delega al servicio y retorna resultado", async () => {
      productoService.getProductos.mockResolvedValue([SAMPLE_PRODUCT]);

      const result = await productoResolvers.Query.getProductos();

      expect(productoService.getProductos).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Jean Tiro Alto");
    });

    it("getProductosById pasa el _id al servicio", async () => {
      productoService.getProductosById.mockResolvedValue(SAMPLE_PRODUCT);

      const result = await productoResolvers.Query.getProductosById(null, {
        _id: "abc123",
      });

      expect(productoService.getProductosById).toHaveBeenCalledWith("abc123");
      expect(result.category).toBe("Bottoms");
    });

    it("getProductosByCategory pasa la categoría al servicio", async () => {
      productoService.getProductosByCategory.mockResolvedValue([SAMPLE_PRODUCT]);

      const result = await productoResolvers.Query.getProductosByCategory(
        null,
        { category: "Bottoms" }
      );

      expect(productoService.getProductosByCategory).toHaveBeenCalledWith("Bottoms");
      expect(result).toHaveLength(1);
    });
  });

  describe("Mutation", () => {
    it("createProducto pasa todos los args al servicio", async () => {
      const newProduct = {
        name: "Nuevo",
        productType: "Top",
        category: "Tops",
        price: 30000,
        image: "/img.png",
        images: ["/img.png"],
        colors: ["Rojo"],
        sizes: ["M"],
        description: "Nuevo producto",
        stock: 20,
      };
      productoService.createProducto.mockResolvedValue({
        _id: "new123",
        ...newProduct,
      });

      const result = await productoResolvers.Mutation.createProducto(
        null,
        newProduct
      );

      expect(productoService.createProducto).toHaveBeenCalledWith(newProduct);
      expect(result._id).toBe("new123");
    });

    it("updateProductos pasa _id y datos al servicio", async () => {
      const updateArgs = { _id: "abc123", price: 80000, colors: ["Negro", "Gris"] };
      productoService.updateProductos.mockResolvedValue({
        ...SAMPLE_PRODUCT,
        price: 80000,
      });

      const result = await productoResolvers.Mutation.updateProductos(
        null,
        updateArgs
      );

      expect(productoService.updateProductos).toHaveBeenCalledWith(
        "abc123",
        updateArgs
      );
      expect(result.price).toBe(80000);
    });

    it("deleteProductos pasa el _id al servicio", async () => {
      productoService.deleteProductos.mockResolvedValue(SAMPLE_PRODUCT);

      const result = await productoResolvers.Mutation.deleteProductos(null, {
        _id: "abc123",
      });

      expect(productoService.deleteProductos).toHaveBeenCalledWith("abc123");
    });
  });
});
