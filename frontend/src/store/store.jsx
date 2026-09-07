import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../modules/auth/AuthSlice';
import driverReducer from '../modules/driver/DriverSlice';
import journeyReducer from '../modules/journey/JourneySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    journey: journeyReducer,
  },
});
