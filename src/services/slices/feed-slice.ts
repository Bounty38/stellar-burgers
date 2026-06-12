import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';
import { getErrorMessage } from '../error';

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
  userOrders: TOrder[];
  userOrdersLoading: boolean;
  userOrdersError: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  userOrders: [],
  userOrdersLoading: false,
  userOrdersError: null
};

export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('feed/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.userOrders = [];
      state.userOrdersError = null;
    },
    setFeedFromSocket: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    setUserOrdersFromSocket: (state, action: PayloadAction<TOrder[]>) => {
      state.userOrders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ленту заказов';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.payload ?? 'Не удалось загрузить историю заказов';
      });
  }
});

export const { clearUserOrders, setFeedFromSocket, setUserOrdersFromSocket } =
  feedSlice.actions;
export const feedReducer = feedSlice.reducer;
