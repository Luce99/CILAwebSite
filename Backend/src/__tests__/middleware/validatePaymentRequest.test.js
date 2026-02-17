const {
  isValidCartItem,
  isValidShippingAddress,
  validateCreatePreference,
} = require("../../middleware/validatePaymentRequest");

describe("isValidCartItem", () => {
  it("debe retornar true para un item valido", () => {
    const validItem = { name: "Blusa", price: 50000, quantity: 2 };
    expect(isValidCartItem(validItem)).toBe(true);
  });

  it("debe retornar false si falta el nombre", () => {
    const itemSinNombre = { price: 50000, quantity: 2 };
    expect(isValidCartItem(itemSinNombre)).toBe(false);
  });

  it("debe retornar false si el precio es 0", () => {
    const itemPrecioCero = { name: "Blusa", price: 0, quantity: 2 };
    expect(isValidCartItem(itemPrecioCero)).toBe(false);
  });

  it("debe retornar false si la cantidad es negativa", () => {
    const itemCantidadNegativa = { name: "Blusa", price: 50000, quantity: -1 };
    expect(isValidCartItem(itemCantidadNegativa)).toBe(false);
  });

  it("debe retornar false si el precio es null", () => {
    const itemPrecioNull = { name: "Blusa", price: null, quantity: 2 };
    expect(isValidCartItem(itemPrecioNull)).toBe(false);
  });
});

describe("isValidShippingAddress", () => {
  const validAddress = {
    firstName: "Juan",
    lastName: "Perez",
    address1: "Calle 123",
    city: "Bogota",
    zip: "110111",
    country: "Colombia",
  };

  it("debe retornar true para una direccion valida", () => {
    expect(isValidShippingAddress(validAddress)).toBe(true);
  });

  it("debe retornar false si la direccion es null", () => {
    expect(isValidShippingAddress(null)).toBe(false);
  });

  it("debe retornar false si la direccion es undefined", () => {
    expect(isValidShippingAddress(undefined)).toBe(false);
  });

  it("debe retornar false si falta el firstName", () => {
    const addressSinNombre = { ...validAddress, firstName: "" };
    expect(isValidShippingAddress(addressSinNombre)).toBe(false);
  });

  it("debe retornar false si falta la ciudad", () => {
    const addressSinCiudad = { ...validAddress, city: "" };
    expect(isValidShippingAddress(addressSinCiudad)).toBe(false);
  });

  it("debe retornar false si falta el pais", () => {
    const { country, ...addressSinPais } = validAddress;
    expect(isValidShippingAddress(addressSinPais)).toBe(false);
  });
});

describe("validateCreatePreference middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("debe llamar next() cuando el request es valido", () => {
    mockReq.body = {
      items: [{ name: "Blusa", price: 50000, quantity: 1 }],
      shippingAddress: {
        firstName: "Juan",
        lastName: "Perez",
        address1: "Calle 123",
        city: "Bogota",
        zip: "110111",
        country: "Colombia",
      },
    };

    validateCreatePreference(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si items es un array vacio", () => {
    mockReq.body = {
      items: [],
      shippingAddress: {
        firstName: "Juan",
        lastName: "Perez",
        address1: "Calle 123",
        city: "Bogota",
        zip: "110111",
        country: "Colombia",
      },
    };

    validateCreatePreference(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si items no esta presente", () => {
    mockReq.body = {
      shippingAddress: {
        firstName: "Juan",
        lastName: "Perez",
        address1: "Calle 123",
        city: "Bogota",
        zip: "110111",
        country: "Colombia",
      },
    };

    validateCreatePreference(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it("debe retornar 400 si un item tiene precio 0", () => {
    mockReq.body = {
      items: [{ name: "Blusa", price: 0, quantity: 1 }],
      shippingAddress: {
        firstName: "Juan",
        lastName: "Perez",
        address1: "Calle 123",
        city: "Bogota",
        zip: "110111",
        country: "Colombia",
      },
    };

    validateCreatePreference(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("debe retornar 400 si falta la direccion de envio", () => {
    mockReq.body = {
      items: [{ name: "Blusa", price: 50000, quantity: 1 }],
    };

    validateCreatePreference(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
