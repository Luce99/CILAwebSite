beforeAll(() => {
  process.env.MP_ACCESS_TOKEN = "TEST-fake-token-for-testing";
  process.env.FRONTEND_BASE_URL = "http://localhost:3000";
});

const express = require("express");
const request = require("supertest");

jest.mock("../../services/PaymentService");
jest.mock("../../services/OrderService");

const PaymentService = require("../../services/PaymentService");
const OrderService = require("../../services/OrderService");
const paymentRoutes = require("../../routes/paymentRoutes");

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/payments", paymentRoutes);
  return app;
}

const VALID_REQUEST_BODY = {
  items: [{ name: "Blusa CILA", price: 50000, quantity: 1 }],
  shippingAddress: {
    firstName: "Juan",
    lastName: "Perez",
    address1: "Calle 123 #45-67",
    city: "Bogota",
    zip: "110111",
    country: "Colombia",
  },
  buyerEmail: "juan@test.com",
};

describe("POST /api/payments/create-preference", () => {
  const app = createTestApp();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar 200 con preferenceId cuando el request es valido", async () => {
    PaymentService.createPreference.mockResolvedValue({
      preferenceId: "pref-123",
      initPoint: "https://mp.com/checkout",
      sandboxInitPoint: "https://sandbox.mp.com/checkout",
    });

    const response = await request(app)
      .post("/api/payments/create-preference")
      .send(VALID_REQUEST_BODY);

    expect(response.status).toBe(200);
    expect(response.body.preferenceId).toBe("pref-123");
    expect(response.body.initPoint).toBeDefined();
  });

  it("debe retornar 400 si no hay items", async () => {
    const response = await request(app)
      .post("/api/payments/create-preference")
      .send({ items: [], shippingAddress: VALID_REQUEST_BODY.shippingAddress });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it("debe retornar 400 si falta la direccion", async () => {
    const response = await request(app)
      .post("/api/payments/create-preference")
      .send({ items: VALID_REQUEST_BODY.items });

    expect(response.status).toBe(400);
  });

  it("debe retornar 500 si el servicio de pago falla", async () => {
    PaymentService.createPreference.mockRejectedValue(new Error("MP error"));

    const response = await request(app)
      .post("/api/payments/create-preference")
      .send(VALID_REQUEST_BODY);

    expect(response.status).toBe(500);
  });
});

describe("POST /api/payments/webhook", () => {
  const app = createTestApp();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar 200 y procesar un pago nuevo", async () => {
    PaymentService.getPaymentInfo.mockResolvedValue({
      paymentId: "pay-1",
      status: "approved",
      transactionAmount: 50000,
    });
    OrderService.findOrderByPaymentId.mockResolvedValue(null);
    OrderService.createOrderFromPayment.mockResolvedValue({ _id: "order-1" });

    const response = await request(app)
      .post("/api/payments/webhook")
      .send({ type: "payment", data: { id: "pay-1" } });

    expect(response.status).toBe(200);
    expect(OrderService.createOrderFromPayment).toHaveBeenCalled();
  });

  it("debe actualizar una orden existente en lugar de crear una nueva", async () => {
    PaymentService.getPaymentInfo.mockResolvedValue({
      paymentId: "pay-1",
      status: "approved",
    });
    OrderService.findOrderByPaymentId.mockResolvedValue({ _id: "existing" });
    OrderService.updateOrderPaymentStatus.mockResolvedValue({});

    const response = await request(app)
      .post("/api/payments/webhook")
      .send({ type: "payment", data: { id: "pay-1" } });

    expect(response.status).toBe(200);
    expect(OrderService.updateOrderPaymentStatus).toHaveBeenCalledWith("pay-1", "approved");
    expect(OrderService.createOrderFromPayment).not.toHaveBeenCalled();
  });

  it("debe ignorar notificaciones que no sean de tipo payment", async () => {
    const response = await request(app)
      .post("/api/payments/webhook")
      .send({ type: "merchant_order", data: { id: "123" } });

    expect(response.status).toBe(200);
    expect(PaymentService.getPaymentInfo).not.toHaveBeenCalled();
  });
});

describe("GET /api/payments/status/:paymentId", () => {
  const app = createTestApp();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debe retornar la info del pago", async () => {
    PaymentService.getPaymentInfo.mockResolvedValue({
      paymentId: "pay-1",
      status: "approved",
      transactionAmount: 50000,
    });

    const response = await request(app).get("/api/payments/status/pay-1");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("approved");
  });

  it("debe retornar 500 si el servicio falla", async () => {
    PaymentService.getPaymentInfo.mockRejectedValue(new Error("Not found"));

    const response = await request(app).get("/api/payments/status/invalid-id");

    expect(response.status).toBe(500);
  });
});
