Certainly! Here's the translation of the provided information into English, including the comments:

### Menu Route Explanation:
* Top-level keys use top-level directory names.
* Sub-levels adopt the structure `/top-level-key/current-directory/current-page`.
* Menu keys represent the navigation route addresses and must match the file directory structure.

### Menu Route Keys:
```
├─ Top-Level Key
| └─ /top-level-key/current-directory
|    └─ /top-level-key/current-directory/current-page
├─ system
|   ├─ /system/user
|   └─ /system/menu
└─ demo
    ├─ /demo/test
    └─ /demo/level1
        └─ /demo/level1/level2
            └─ /demo/level1/level3
```

### Static Menu Method:
If you need to use a static menu, change `menuList` in `useCommonStore` to `defaultMenus`.
```js
// src/hooks/useCommonStore.ts
import { defaultMenus } from '@/menus';
// Menu data
const menuList = defaultMenus;
```
