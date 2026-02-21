import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import summaryReducer from "./summarySlice";
import expensesReducer from "./expensesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    summary: summaryReducer,
    expenses: expensesReducer,
  },
});

export default store;
