

import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
     users: [],
    user: null,
    confirmed: false,
  },
  reducers: {
    confirmSuccess: (state, action) => {
      state.user = action.payload.user;
      state.confirmed = true;
    },
    confirmFail: (state, action) => {
      state.error = action.payload.message;
      state.confirmed = false;
    },
     updateUserList: (state, action) => {
      state.users = action.payload.users;
     }
  },
});

export const { confirmSuccess, confirmFail, updateUserList } = userSlice.actions;
export default userSlice.reducer;
