import type { TabPaneProps } from 'antd';
import type { NavData } from '@/menus/utils/helper';
import { createSlice } from '@reduxjs/toolkit';

interface TabsData extends Omit<TabPaneProps, 'tab'> {
  key: string;
  label: React.ReactNode;
  labelZh: React.ReactNode;
  labelEn: React.ReactNode;
}

const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    isLock: false,
    isMaximize: false,
    activeKey: '',
    nav: [] as NavData[],
    tabs: [] as TabsData[]
  },
  reducers: {
    /** Set lock */
    toggleLock: (state, action) => {
      state.isLock = !!action.payload;
    },
    /** Toggle maximize */
    toggleMaximize: (state, action) => {
      state.isMaximize = !!action.payload;
    },
    /** Set selected tab */
    setActiveKey: (state, action) => {
      state.activeKey = action.payload;
    },
    /** Set navigation */
    setNav: (state, action) => {
      state.nav = action.payload;
    },
    /** Switch language for tabs */
    switchTabsLang: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      for (let i = 0; i < tabs?.length; i++) {
        const item = tabs[i];
        item.label = payload === 'en' ? item.labelEn : item.labelZh;
      }
    },
    /** Add a tab */
    addTabs: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      // Check if the route already exists, if not, add it
      const has = tabs.find(item => item.key === payload.key);
      if (!has) tabs.push(payload);

      // If only one tab remains, it cannot be closed
      if (tabs?.length) tabs[0].closable = tabs?.length > 1;
    },
    /** Close a tab */
    closeTabs: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      // Find the index and remove from the array
      const index = tabs.findIndex(item => item.key === payload);
      if (index >= 0) tabs.splice(index, 1);

      // If the current tab is the active one, switch to the previous/next valid tab
      if (payload === state.activeKey) {
        let target = '';
        if (index === 0) {
          target = tabs?.[index]?.key || '';
        } else {
          target = tabs[index - 1].key;
        }
        state.activeKey = target;
        state.isLock = true;
      }

      // If only one tab remains, it cannot be closed
      if (tabs?.length) tabs[0].closable = tabs?.length > 1;
    },
    /** Close a tab and navigate to a new page */
    closeTabGoNext: (state, action) => {
      const { tabs } = state;
      const { payload } = action;
      const { key, nextPath } = payload;

      // Find the index and remove from the array
      const index = tabs.findIndex(item => item.key === key);
      if (index >= 0) tabs.splice(index, 1);

      // If the current tab is the active one, switch to the new path
      if (key === state.activeKey) {
        state.activeKey = nextPath;
        state.isLock = true;
      }

      // If only one tab remains, it cannot be closed
      if (tabs?.length) tabs[0].closable = tabs?.length > 1;
    },
    /** Close tabs to the left */
    closeLeft: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      // Find the index and remove from the array
      const index = tabs.findIndex(item => item.key === payload);
      if (index >= 0) tabs.splice(0, index);
      state.activeKey = tabs[0].key;

      // If only one tab remains, it cannot be closed
      if (tabs?.length) tabs[0].closable = tabs?.length > 1;
    },
    /** Close tabs to the right */
    closeRight: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      // Find the index and remove from the array
      const index = tabs.findIndex(item => item.key === payload);
      if (index >= 0) tabs.splice(index + 1, tabs.length - index - 1);
      state.activeKey = tabs[tabs.length - 1].key;

      // If only one tab remains, it cannot be closed
      if (tabs?.length) tabs[0].closable = tabs?.length > 1;
    },
    /** Close all other tabs */
    closeOther: (state, action) => {
      const { tabs } = state;
      const { payload } = action;

      // Find the tab and keep it as the only tab
      const tab = tabs.find(item => item.key === payload);
      if (tab) {
        state.tabs = [tab];
        state.activeKey = tab.key;
        state.isLock = true;
      }

      // If only one tab remains, it cannot be closed
      tabs[0].closable = false;
    },
    /** Close all tabs */
    closeAllTab: (state) => {
      state.tabs = [];
    }
  }
});

export const {
  toggleLock,
  toggleMaximize,
  setActiveKey,
  setNav,
  switchTabsLang,
  addTabs,
  closeTabs,
  closeTabGoNext,
  closeLeft,
  closeRight,
  closeOther,
  closeAllTab
} = tabsSlice.actions;

export default tabsSlice.reducer;
