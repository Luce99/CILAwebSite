export const initialState = {
  basket: [],
  shippingAddress: null,
  preferenceId: null,
};

export const actionTypes = {
  ADD_TO_BASKET: "ADD_TO_BASKET",
  REMOVE_ONE_FROM_BASKET: "REMOVE_ONE_FROM_BASKET",
  REMOVE_ALL: "REMOVE_ALL",
  CLEAR_CART: "CLEAR_CART",
  SET_SHIPPING_ADDRESS: "SET_SHIPPING_ADDRESS",
  SET_PREFERENCE_ID: "SET_PREFERENCE_ID",
  PLACE_ORDER_SUCCESS: "PLACE_ORDER_SUCCESS",
};

export const getBasketTotal = (basket) => {
  return basket
    .map((item) => item.price * item.quantity)
    .reduce((acc, value) => acc + value, 0);
};

export const getItemsTotal = (basket) => {
  if (basket.length === 0) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < basket.length; i++) {
    total += basket[i].quantity;
  }
  return total;
};

function handleAddToBasket(state, newItem) {
  const itemInCart = state.basket.find((item) => item.id === newItem.id);

  if (itemInCart) {
    const updatedBasket = state.basket.map((item) => {
      if (item.id === newItem.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    return { ...state, basket: updatedBasket };
  }

  return { ...state, basket: [...state.basket, { ...newItem, quantity: 1 }] };
}

function handleRemoveOneFromBasket(state, itemId) {
  const itemToRemove = state.basket.find((item) => item.id === itemId);

  if (!itemToRemove) {
    return state;
  }

  if (itemToRemove.quantity > 1) {
    const updatedBasket = state.basket.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    return { ...state, basket: updatedBasket };
  }

  const filteredBasket = state.basket.filter((item) => item.id !== itemId);
  return { ...state, basket: filteredBasket };
}

function handleRemoveAll(state, itemId) {
  const filteredBasket = state.basket.filter((item) => item.id !== itemId);
  return { ...state, basket: filteredBasket };
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_BASKET:
      return handleAddToBasket(state, action.item);

    case actionTypes.REMOVE_ONE_FROM_BASKET:
      return handleRemoveOneFromBasket(state, action.id);

    case actionTypes.REMOVE_ALL:
      return handleRemoveAll(state, action.id);

    case actionTypes.CLEAR_CART:
      return { ...initialState };

    case actionTypes.SET_SHIPPING_ADDRESS:
      return { ...state, shippingAddress: action.address };

    case actionTypes.SET_PREFERENCE_ID:
      return { ...state, preferenceId: action.preferenceId };

    case actionTypes.PLACE_ORDER_SUCCESS:
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
