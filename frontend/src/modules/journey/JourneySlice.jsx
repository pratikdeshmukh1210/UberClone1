import { createSlice } from "@reduxjs/toolkit";

const journeySlice = createSlice({
  name: "journey",
  initialState: {
    journey: null, // naming it journey for consistency with state usage
    history: [],
  },
  reducers: {
    setJourney: (state, action) => {
      state.journey = action.payload;
    },
    setStatus: (state, action) => {
        if (state.journey) {
            state.journey.status = action.payload;
        }
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    clearJourney: (state) => {
      state.journey = null;
    },
  },
});

export const { setJourney, setStatus, setHistory, clearJourney } = journeySlice.actions;
export default journeySlice.reducer;
