import { RootState } from './store';

export const selectIngredientsState = (state: RootState) => state.ingredients;
export const selectIngredients = (state: RootState) =>
  selectIngredientsState(state).items;
export const selectIngredientsLoading = (state: RootState) =>
  selectIngredientsState(state).isLoading;
export const selectIngredientsError = (state: RootState) =>
  selectIngredientsState(state).error;
export const selectBuns = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'bun');
export const selectMains = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'main');
export const selectSauces = (state: RootState) =>
  selectIngredients(state).filter((ingredient) => ingredient.type === 'sauce');
export const selectIngredientById = (state: RootState, id?: string) =>
  selectIngredients(state).find((ingredient) => ingredient._id === id) ?? null;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderError = (state: RootState) => state.order.orderError;
export const selectSelectedOrder = (state: RootState) =>
  state.order.selectedOrder;
export const selectSelectedOrderRequest = (state: RootState) =>
  state.order.selectedOrderRequest;
export const selectSelectedOrderError = (state: RootState) =>
  state.order.selectedOrderError;

export const selectFeedState = (state: RootState) => state.feed;
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedError = (state: RootState) => state.feed.error;
export const selectUserOrders = (state: RootState) => state.feed.userOrders;
export const selectUserOrdersLoading = (state: RootState) =>
  state.feed.userOrdersLoading;
export const selectUserOrdersError = (state: RootState) =>
  state.feed.userOrdersError;
export const selectOrderByNumber = (state: RootState, number?: number) => {
  if (!number) {
    return null;
  }

  return (
    [...state.feed.orders, ...state.feed.userOrders].find(
      (order) => order.number === number
    ) ?? null
  );
};

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUpdateUserError = (state: RootState) =>
  state.user.updateUserError;
