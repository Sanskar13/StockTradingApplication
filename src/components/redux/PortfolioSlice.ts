import { createSlice } from "@reduxjs/toolkit";
import { PortfolioTypeTs } from "../utils/portfolio.type";
import { getPortfolioTransactions } from "./thunk/getPortfolioTransactions";

interface PortfolioState {
  transactions: PortfolioTypeTs[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  transactions: [],
  loading: false,
  error: null,
};

const PortfolioState = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    updateTransaction: (state, action) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPortfolioTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPortfolioTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPortfolioTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Error Fetching Portfolio Transactions";
      });
  },
});

export default PortfolioState.reducer;
export const { updateTransaction } = PortfolioState.actions;
