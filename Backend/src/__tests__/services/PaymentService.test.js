beforeAll(() => {
  process.env.MP_ACCESS_TOKEN = "TEST-fake-token-for-testing";
  process.env.FRONTEND_BASE_URL = "http://localhost:3000";
});

const {
  buildPreferenceItem,
  buildPreferenceItems,
  buildBackUrls,
  buildPreferenceBody,
} = require("../../services/PaymentService");

describe("PaymentService", () => {
  describe("buildPreferenceItem", () => {
    it("debe transformar un item del carrito al formato de MercadoPago", () => {
      const cartItem = { name: "Blusa CILA", price: 75000, quantity: 2 };

      const result = buildPreferenceItem(cartItem);

      expect(result).toEqual({
        title: "Blusa CILA",
        unit_price: 75000,
        quantity: 2,
        currency_id: "COP",
      });
    });

    it("debe convertir precio y cantidad a numeros", () => {
      const cartItem = { name: "Falda", price: "45000", quantity: "3" };

      const result = buildPreferenceItem(cartItem);

      expect(result.unit_price).toBe(45000);
      expect(result.quantity).toBe(3);
    });
  });

  describe("buildPreferenceItems", () => {
    it("debe transformar multiples items", () => {
      const cartItems = [
        { name: "Blusa", price: 50000, quantity: 1 },
        { name: "Falda", price: 60000, quantity: 2 },
      ];

      const result = buildPreferenceItems(cartItems);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Blusa");
      expect(result[1].title).toBe("Falda");
    });

    it("debe retornar un array vacio si no hay items", () => {
      const result = buildPreferenceItems([]);
      expect(result).toEqual([]);
    });
  });

  describe("buildBackUrls", () => {
    it("debe generar URLs con la base del frontend", () => {
      const result = buildBackUrls();

      expect(result.success).toBe("http://localhost:3000/payment/result?status=approved");
      expect(result.failure).toBe("http://localhost:3000/payment/result?status=rejected");
      expect(result.pending).toBe("http://localhost:3000/payment/result?status=pending");
    });
  });

  describe("buildPreferenceBody", () => {
    it("debe construir el body sin payer si no hay email", () => {
      const items = [{ name: "Blusa", price: 50000, quantity: 1 }];

      const result = buildPreferenceBody(items, null);

      expect(result.items).toHaveLength(1);
      expect(result.back_urls).toBeDefined();
      expect(result.auto_return).toBe("approved");
      expect(result.payer).toBeUndefined();
    });

    it("debe incluir payer si hay email", () => {
      const items = [{ name: "Blusa", price: 50000, quantity: 1 }];
      const email = "test@example.com";

      const result = buildPreferenceBody(items, email);

      expect(result.payer).toEqual({ email: "test@example.com" });
    });
  });
});
