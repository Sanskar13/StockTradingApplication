import { createAsyncThunk } from "@reduxjs/toolkit";
import allstocks from "../../utils/allStocks.json";
import { StocksTypesTs } from "../../utils/stocks.types";

export const getStocks = createAsyncThunk("getStocks", async () => {
  return new Promise<StocksTypesTs[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(allstocks as StocksTypesTs[]);
      } catch (error) {
        console.log("error fetching api");
        reject(error);
      }
    }, 1000);
  });
});
