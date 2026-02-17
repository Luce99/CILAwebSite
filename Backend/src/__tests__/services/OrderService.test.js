const OrderService = require("../../services/OrderService");
const Venta = require("../../models/Venta");

jest.mock("../../models/Venta");

describe("OrderService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOrderByPaymentId", () => {
    it("debe retornar la orden si existe", async () => {
      const mockOrder = { _id: "abc123", mercadopagoPaymentId: "12345" };
      Venta.findOne.mockResolvedValue(mockOrder);

      const result = await OrderService.findOrderByPaymentId("12345");

      expect(Venta.findOne).toHaveBeenCalledWith({
        mercadopagoPaymentId: "12345",
      });
      expect(result).toEqual(mockOrder);
    });

    it("debe retornar null si la orden no existe", async () => {
      Venta.findOne.mockResolvedValue(null);

      const result = await OrderService.findOrderByPaymentId("99999");

      expect(result).toBeNull();
    });
  });

  describe("createOrderFromPayment", () => {
    it("debe retornar la orden existente si ya fue creada", async () => {
      const existingOrder = { _id: "existing", mercadopagoPaymentId: "12345" };
      Venta.findOne.mockResolvedValue(existingOrder);

      const paymentData = { paymentId: "12345", transactionAmount: 100000, status: "approved" };
      const orderDetails = { items: [] };

      const result = await OrderService.createOrderFromPayment(paymentData, orderDetails);

      expect(result).toEqual(existingOrder);
    });

    it("debe crear una nueva orden si no existe", async () => {
      Venta.findOne.mockResolvedValue(null);

      const savedOrder = {
        _id: "new123",
        totalVenta: 100000,
        mercadopagoPaymentId: "12345",
        paymentStatus: "approved",
      };
      Venta.prototype.save = jest.fn().mockResolvedValue(savedOrder);

      const paymentData = { paymentId: "12345", transactionAmount: 100000, status: "approved" };
      const orderDetails = { preferenceId: "pref-1", items: [], shippingAddress: null };

      const result = await OrderService.createOrderFromPayment(paymentData, orderDetails);

      expect(result).toEqual(savedOrder);
    });
  });

  describe("updateOrderPaymentStatus", () => {
    it("debe actualizar el estado de pago de la orden", async () => {
      const updatedOrder = { _id: "abc", paymentStatus: "approved" };
      Venta.findOneAndUpdate.mockResolvedValue(updatedOrder);

      const result = await OrderService.updateOrderPaymentStatus("12345", "approved");

      expect(Venta.findOneAndUpdate).toHaveBeenCalledWith(
        { mercadopagoPaymentId: "12345" },
        { paymentStatus: "approved" },
        { new: true }
      );
      expect(result).toEqual(updatedOrder);
    });
  });

  describe("findOrderByPreferenceId", () => {
    it("debe buscar una orden por preferenceId", async () => {
      const mockOrder = { _id: "abc", mercadopagoPreferenceId: "pref-1" };
      Venta.findOne.mockResolvedValue(mockOrder);

      const result = await OrderService.findOrderByPreferenceId("pref-1");

      expect(Venta.findOne).toHaveBeenCalledWith({
        mercadopagoPreferenceId: "pref-1",
      });
      expect(result).toEqual(mockOrder);
    });
  });
});
