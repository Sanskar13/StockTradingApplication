import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPortfolioTransactions = createAsyncThunk(
  "getPortfolioTransaction",
  async () => {
    try {
      const response = await fetch(
        "https://kdu-automation.s3.ap-south-1.amazonaws.com/mini-project-apis/portfolio-transactions.json"
      );
      return response.json();
    } catch (error) {
      console.log("Error fetching portfolio transactions", error);
      throw error;
    }
  }
);
