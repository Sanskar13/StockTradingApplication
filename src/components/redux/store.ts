import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import dashboardReducer from "./DashboardSlice";
import portfolioReducer from "./PortfolioSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["portfolio"],
};

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  portfolio: portfolioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
