import { createSlice } from '@reduxjs/toolkit';

export type ThemeType = 'dark' | 'light'

export const publicSlice = createSlice({
  name: 'public',
  initialState: {
    theme: 'light' as ThemeType, // Theme
    isFullscreen: false, // Whether fullscreen
    isRefresh: false, // Refresh status
    isRefreshPage: false // Page refresh status
  },
  reducers: {
    /** Set the theme */
    setThemeValue: (state, action) => {
      state.theme = action.payload;
    },
    /** Set fullscreen mode */
    setFullscreen: (state, action) => {
      state.isFullscreen = action.payload;
    },
    /** Set refresh status */
    setRefresh: (state, action) => {
      state.isRefresh = action.payload;
    },
    /** Set page refresh status */
    setRefreshPage: (state, action) => {
      state.isRefreshPage = action.payload;
    }
  }
});

export const {
  setThemeValue,
  setFullscreen,
  setRefresh,
  setRefreshPage
} = publicSlice.actions;

export default publicSlice.reducer;
