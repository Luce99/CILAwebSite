import { createPaymentPreference, getPaymentStatus } from "../../services/paymentService";

const MOCK_CART_ITEMS = [
  { id: "1", name: "Blusa CILA", price: 50000, quantity: 2, image: "img.png" },
];

const MOCK_ADDRESS = {
  firstName: "Juan",
  lastName: "Perez",
  address1: "Calle 123",
  city: "Bogota",
  zip: "110111",
  country: "Colombia",
};

describe("paymentService", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("createPaymentPreference", () => {
    it("debe enviar los items formateados al backend", async () => {
      const mockResponse = {
        preferenceId: "pref-123",
        initPoint: "https://mp.com/checkout",
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await createPaymentPreference(MOCK_CART_ITEMS, MOCK_ADDRESS, "test@test.com");

      expect(result.preferenceId).toBe("pref-123");

      const fetchCall = global.fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody.items).toHaveLength(1);
      expect(requestBody.items[0].name).toBe("Blusa CILA");
      expect(requestBody.items[0].price).toBe(50000);
      expect(requestBody.shippingAddress).toEqual(MOCK_ADDRESS);
    });

    it("debe lanzar error si la respuesta no es ok", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Error del servidor" }),
      });

      await expect(
        createPaymentPreference(MOCK_CART_ITEMS, MOCK_ADDRESS, null)
      ).rejects.toThrow("Error del servidor");
    });
  });

  describe("getPaymentStatus", () => {
    it("debe retornar la info del pago", async () => {
      const mockPaymentInfo = { paymentId: "pay-1", status: "approved" };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaymentInfo),
      });

      const result = await getPaymentStatus("pay-1");

      expect(result.status).toBe("approved");
    });

    it("debe lanzar error si la consulta falla", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      });

      await expect(getPaymentStatus("invalid")).rejects.toThrow(
        "Error al consultar el estado del pago"
      );
    });
  });
});
