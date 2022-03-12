export const initialState = {
  basket: [],
};

export const actionTypes = {
  ADD_TO_BASKET: "ADD_TO_BASKET",
  REMOVE_ONE_FROM_BASKET: "REMOVE_ONE_FROM_BASKET",
  REMOVE_ALL: "REMOVE_ALL",
  CLEAR_CART: "CLEAR_CART",
};

export const getBasketTotal = (basket) =>
  basket.map((item) => item.price*item.quantity).reduce((acc, value) => acc + value, 0);

export const getItemsTotal = (basket)=>{
    let total = 0;
    if (basket.length !=0){
   for (var i=0; i<basket.length;i++){
       let item = basket[i];
       total += item.quantity;
   }}
   return total;

}
const reducer = (state = initialState, action) => {
    console.log(action)
  switch (action.type) {
    case "ADD_TO_BASKET":

        let newItem =  action.item
        
        let itemInCart = state.basket?.find((item) => item.id === newItem.id);
        
          return itemInCart
            ? {
                ...state,
                basket: state.basket.map((item) =>
                  item.id === newItem.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              }
            : {
                ...state,
                basket: [...state.basket, { ...newItem, quantity: 1 }],
              };
        
    // return {
    //     ...state,
    //     basket: [...state.basket, action.item]
    // };

    case "REMOVE_ONE_FROM_BASKET":
    let itemToDelete =  state.basket.find((basketItem) => basketItem.id === action.id);

    return itemToDelete.quantity > 1
      ? {
          ...state,
          basket: state.basket.map((item) =>
            item.id === action.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }
      : {
          ...state,
          basket: state.basket.filter((item) => item.id !== action.id),
        };

    case "REMOVE_ALL":
      return {
        ...state,
        basket: state.basket.filter((item) => item.id !== action.id),
      };

    case "CLEAR_CART":
      return { ...initialState };

    default:
      return state;
  }
};

export default reducer;
