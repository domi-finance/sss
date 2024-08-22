import type { SideMenu } from '#/public';
import { createSlice } from '@reduxjs/toolkit';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    isPhone: false,
    isCollapsed: false,
    selectedKeys: 'dashboard', // Selected value of the menu
    openKeys: ['Dashboard'], // Expanded menu items
    menuList: [] as SideMenu[], // Menu list data
  },
  reducers: {
    toggleCollapsed: (state, action) => {
      state.isCollapsed = !!action.payload;
    },
    togglePhone: (state, action) => {
      state.isPhone = !!action.payload;
    },
    setSelectedKeys: (state, action) => {
      state.selectedKeys = action.payload;
    },
    setOpenKeys: (state, action) => {
      state.openKeys = action.payload;
    },
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
  }
});

export const {
  toggleCollapsed,
  togglePhone,
  setSelectedKeys,
  setOpenKeys,
  setMenuList
} = menuSlice.actions;

export default menuSlice.reducer;
