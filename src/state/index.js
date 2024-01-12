import { createSlice } from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState = {
  user: null,
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth", // Name of the slice
  initialState, // Initial state
  reducers: {
    // Reducer to set user when logging in
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    // Reducer to set user to null when logging out
    setLogout: (state) => {
      state.user = null;
    },
  },
});

// Export action creators
export const { setLogin, setLogout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
