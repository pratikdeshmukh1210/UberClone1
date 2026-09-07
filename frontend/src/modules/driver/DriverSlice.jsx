import { createSlice } from "@reduxjs/toolkit";

const driverSlice = createSlice({
  name: "driver",
  initialState: {
    driver: null,
    isOnline: false,
  },
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    clearDriver: (state) => {
        state.driver = null;
        state.isOnline = false;
    }
  },
});

export const { setDriver, setOnlineStatus, clearDriver } = driverSlice.actions;
export default driverSlice.reducer;
