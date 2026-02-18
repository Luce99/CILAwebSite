const productoService = require("../../src/services/Producto");
const Producto = require("../../src/models/Producto");

jest.mock("../../src/models/Producto");

const SAMPLE_PRODUCT = {
  _id: "abc123",
  name: "Blusa Clásica",
  productType: "Blusa",
  category: "Tops",
  price: 22000,
  image: "/images/blusa.png",
  images: ["/images/blusa.png", "/images/blusa2.png"],
  colors: ["Blanco", "Negro"],
  sizes: ["S", "M", "L"],
  description: "Blusa versátil",
  stock: 50,
  quantity: 1,
};

describe("Producto Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProductos", () => {
    it("retorna todos los productos", async () => {
      Producto.find.mockResolvedValue([SAMPLE_PRODUCT]);

      const result = await productoService.getProductos();

      expect(Producto.find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Blusa Clásica");
    });

    it("retorna arreglo vacío si no hay productos", async () => {
      Producto.find.mockResolvedValue([]);

      const result = await productoService.getProductos();

      expect(result).toHaveLength(0);
    });
  });

  describe("getProductosById", () => {
    it("retorna producto por ID", async () => {
      Producto.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(SAMPLE_PRODUCT),
      });

      const result = await productoService.getProductosById("abc123");

      expect(Producto.findById).toHaveBeenCalledWith("abc123");
      expect(result.name).toBe("Blusa Clásica");
    });

    it("retorna null si no existe el producto", async () => {
      Producto.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await productoService.getProductosById("noexiste");

      expect(result).toBeNull();
    });
  });

  describe("getProductosByCategory", () => {
    it("filtra productos por categoría", async () => {
      const topsProducts = [SAMPLE_PRODUCT];
      Producto.find.mockResolvedValue(topsProducts);

      const result = await productoService.getProductosByCategory("Tops");

      expect(Producto.find).toHaveBeenCalledWith({ category: "Tops" });
      expect(result).toHaveLength(1);
    });

    it("retorna vacío para categoría sin productos", async () => {
      Producto.find.mockResolvedValue([]);

      const result = await productoService.getProductosByCategory("Accesorios");

      expect(Producto.find).toHaveBeenCalledWith({ category: "Accesorios" });
      expect(result).toHaveLength(0);
    });
  });

  describe("createProducto", () => {
    it("crea producto con todos los campos incluyendo variaciones", async () => {
      const saveMock = jest.fn().mockResolvedValue(SAMPLE_PRODUCT);
      Producto.mockImplementation(() => ({
        save: saveMock,
      }));

      const args = {
        name: "Blusa Clásica",
        productType: "Blusa",
        category: "Tops",
        price: 22000,
        image: "/images/blusa.png",
        images: ["/images/blusa.png"],
        colors: ["Blanco"],
        sizes: ["S", "M"],
        description: "Blusa versátil",
        stock: 50,
      };

      const result = await productoService.createProducto(args);

      expect(saveMock).toHaveBeenCalled();
      expect(result.name).toBe("Blusa Clásica");
    });

    it("crea producto con arrays vacíos si no se proporcionan variaciones", async () => {
      const saveMock = jest.fn().mockResolvedValue({
        ...SAMPLE_PRODUCT,
        images: [],
        colors: [],
        sizes: [],
      });
      Producto.mockImplementation((data) => {
        expect(data.images).toEqual([]);
        expect(data.colors).toEqual([]);
        expect(data.sizes).toEqual([]);
        return { save: saveMock };
      });

      const args = {
        name: "Producto sin variaciones",
        productType: "Genérico",
        category: "Tops",
        price: 10000,
        image: "/images/gen.png",
        description: "Sin variaciones",
        stock: 10,
      };

      await productoService.createProducto(args);

      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe("updateProductos", () => {
    it("actualiza un producto por ID", async () => {
      const updatedProduct = { ...SAMPLE_PRODUCT, price: 25000 };
      Producto.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      const result = await productoService.updateProductos("abc123", {
        price: 25000,
      });

      expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith(
        "abc123",
        { price: 25000 },
        { new: true }
      );
      expect(result.price).toBe(25000);
    });
  });

  describe("deleteProductos", () => {
    it("elimina un producto por ID", async () => {
      Producto.findByIdAndDelete.mockResolvedValue(SAMPLE_PRODUCT);

      const result = await productoService.deleteProductos("abc123");

      expect(Producto.findByIdAndDelete).toHaveBeenCalledWith("abc123");
      expect(result.name).toBe("Blusa Clásica");
    });

    it("retorna null si el producto no existe", async () => {
      Producto.findByIdAndDelete.mockResolvedValue(null);

      const result = await productoService.deleteProductos("noexiste");

      expect(result).toBeNull();
    });
  });

  describe("updateVenta", () => {
    it("agrega referencia de venta al producto", async () => {
      Producto.findByIdAndUpdate.mockResolvedValue(SAMPLE_PRODUCT);

      const result = await productoService.updateVenta("abc123", "venta456");

      expect(Producto.findByIdAndUpdate).toHaveBeenCalledWith("abc123", {
        $push: { venta: "venta456" },
      });
    });
  });
});
