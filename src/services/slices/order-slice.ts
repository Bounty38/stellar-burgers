import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { getErrorMessage } from '../error';

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orderError: string | null;
  selectedOrder: TOrder | null;
  selectedOrderRequest: boolean;
  selectedOrderError: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  orderError: null,
  selectedOrder: null,
  selectedOrderRequest: false,
  selectedOrderError: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, { rejectWithValue }) => {
  try {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    const [order] = data.orders;

    if (!order) {
      return rejectWithValue('Заказ не найден');
    }

    return order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.orderError = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.selectedOrderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.selectedOrderRequest = true;
        state.selectedOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrderRequest = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.selectedOrderRequest = false;
        state.selectedOrderError =
          action.payload ?? 'Не удалось загрузить заказ';
      });
  }
});

export const { clearOrderModal, clearSelectedOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
