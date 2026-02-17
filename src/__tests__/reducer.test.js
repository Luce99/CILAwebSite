import reducer, {
  initialState,
  actionTypes,
  getBasketTotal,
  getItemsTotal,
} from "../reducer";

const SAMPLE_ITEM = {
  id: "1",
  name: "Blusa CILA",
  price: 50000,
  quantity: 1,
  productType: "Blusa",
  image: "test.png",
  description: "Una blusa",
};

const SECOND_ITEM = {
  id: "2",
  name: "Falda CILA",
  price: 60000,
  quantity: 1,
  productType: "Falda",
  image: "test2.png",
  description: "Una falda",
};

describe("reducer", () => {
  describe("ADD_TO_BASKET", () => {
    it("debe agregar un nuevo item al carrito", () => {
      const action = { type: actionTypes.ADD_TO_BASKET, item: SAMPLE_ITEM };
      const newState = reducer(initialState, action);

      expect(newState.basket).toHaveLength(1);
      expect(newState.basket[0].name).toBe("Blusa CILA");
      expect(newState.basket[0].quantity).toBe(1);
    });

    it("debe incrementar la cantidad si el item ya existe", () => {
      const stateWithItem = {
        ...initialState,
        basket: [{ ...SAMPLE_ITEM, quantity: 1 }],
      };
      const action = { type: actionTypes.ADD_TO_BASKET, item: SAMPLE_ITEM };
      const newState = reducer(stateWithItem, action);

      expect(newState.basket).toHaveLength(1);
      expect(newState.basket[0].quantity).toBe(2);
    });
  });

  describe("REMOVE_ONE_FROM_BASKET", () => {
    it("debe decrementar la cantidad si hay mas de 1", () => {
      const stateWithItem = {
        ...initialState,
        basket: [{ ...SAMPLE_ITEM, quantity: 3 }],
      };
      const action = { type: actionTypes.REMOVE_ONE_FROM_BASKET, id: "1" };
      const newState = reducer(stateWithItem, action);

      expect(newState.basket[0].quantity).toBe(2);
    });

    it("debe eliminar el item si la cantidad es 1", () => {
      const stateWithItem = {
        ...initialState,
        basket: [{ ...SAMPLE_ITEM, quantity: 1 }],
      };
      const action = { type: actionTypes.REMOVE_ONE_FROM_BASKET, id: "1" };
      const newState = reducer(stateWithItem, action);

      expect(newState.basket).toHaveLength(0);
    });
  });

  describe("REMOVE_ALL", () => {
    it("debe eliminar todas las unidades de un item", () => {
      const stateWithItems = {
        ...initialState,
        basket: [
          { ...SAMPLE_ITEM, quantity: 5 },
          { ...SECOND_ITEM, quantity: 2 },
        ],
      };
      const action = { type: actionTypes.REMOVE_ALL, id: "1" };
      const newState = reducer(stateWithItems, action);

      expect(newState.basket).toHaveLength(1);
      expect(newState.basket[0].id).toBe("2");
    });
  });

  describe("CLEAR_CART", () => {
    it("debe reiniciar al estado inicial", () => {
      const stateWithData = {
        basket: [SAMPLE_ITEM],
        shippingAddress: { firstName: "Juan" },
        preferenceId: "pref-123",
      };
      const action = { type: actionTypes.CLEAR_CART };
      const newState = reducer(stateWithData, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe("SET_SHIPPING_ADDRESS", () => {
    it("debe guardar la direccion de envio", () => {
      const address = { firstName: "Maria", city: "Bogota" };
      const action = { type: actionTypes.SET_SHIPPING_ADDRESS, address };
      const newState = reducer(initialState, action);

      expect(newState.shippingAddress).toEqual(address);
    });
  });

  describe("SET_PREFERENCE_ID", () => {
    it("debe guardar el preferenceId", () => {
      const action = { type: actionTypes.SET_PREFERENCE_ID, preferenceId: "pref-abc" };
      const newState = reducer(initialState, action);

      expect(newState.preferenceId).toBe("pref-abc");
    });
  });

  describe("PLACE_ORDER_SUCCESS", () => {
    it("debe reiniciar al estado inicial", () => {
      const stateWithData = {
        basket: [SAMPLE_ITEM],
        shippingAddress: { firstName: "Juan" },
        preferenceId: "pref-123",
      };
      const action = { type: actionTypes.PLACE_ORDER_SUCCESS };
      const newState = reducer(stateWithData, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe("accion desconocida", () => {
    it("debe retornar el estado actual", () => {
      const action = { type: "UNKNOWN_ACTION" };
      const newState = reducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });
});

describe("getBasketTotal", () => {
  it("debe calcular el total correctamente", () => {
    const basket = [
      { price: 50000, quantity: 2 },
      { price: 30000, quantity: 1 },
    ];
    expect(getBasketTotal(basket)).toBe(130000);
  });

  it("debe retornar 0 para un carrito vacio", () => {
    expect(getBasketTotal([])).toBe(0);
  });
});

describe("getItemsTotal", () => {
  it("debe contar todas las unidades", () => {
    const basket = [
      { quantity: 2 },
      { quantity: 3 },
    ];
    expect(getItemsTotal(basket)).toBe(5);
  });

  it("debe retornar 0 para un carrito vacio", () => {
    expect(getItemsTotal([])).toBe(0);
  });
});
