import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    // User permissions
    permissions: [],
    // User information
    userInfo: {
      id: 0,
      username: '',
      email: '',
      phone: ''
    }
  },
  reducers: {
    /** Set user information */
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    /** Set permissions */
    setPermissions: (state, action) => {
      state.permissions = action.payload;
    },
    /** Clear user information */
    clearInfo: (state) => {
      state.userInfo = {
        id: 0,
        username: '',
        email: '',
        phone: ''
      };
    }
  }
});

export const {
  setUserInfo,
  setPermissions,
  clearInfo
} = userSlice.actions;

export default userSlice.reducer;
