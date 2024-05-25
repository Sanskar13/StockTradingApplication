import { StocksTypesTs } from "../utils/stocks.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStocks } from "./thunk/getStocks";

interface StockState {
  stocks: StocksTypesTs[];
  loading: boolean;
  error: string | null;
}

const initialState: StockState = {
  stocks: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getStocks.fulfilled,
        (state, action: PayloadAction<StocksTypesTs[]>) => {
          state.stocks = action.payload;
          state.loading = false;
        }
      )
      .addCase(getStocks.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch Stocks";
      });
  },
});

export default dashboardSlice.reducer;
