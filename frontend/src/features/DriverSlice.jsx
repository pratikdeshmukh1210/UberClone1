import { createSlice } from "@reduxjs/toolkit";

let driverSlice = createSlice({
  name: "driver",
  initialState: {
    profile: null,
  },
  reducers: {
    setDriver: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setDriver } = driverSlice.actions;
export default driverSlice.reducer;