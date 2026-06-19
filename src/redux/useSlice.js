import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    customer: null,
  },
  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    clearCustomer: (state) => {
      state.customer = null;
    },
  },
});

export const { setCustomer, clearCustomer } = userSlice.actions;

export default userSlice.reducer;
