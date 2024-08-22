import type { SideMenu } from '#/public';
import type { Langs } from '@/components/I18n';
import { LANG } from '@/utils/config';

/**
 * Get the array of open menus based on the route.
 * @param router - Route
 */
export function getOpenMenuByRouter(router: string): string[] {
  const arr = splitPath(router), result: string[] = [];

  // Use the first word capitalized as the new expanded menu key
  if (arr.length > 0) result.push(`/${arr[0]}`);

  // When the route is in multiple levels
  if (arr.length > 2) {
    let str = '/' + arr[0];
    for (let i = 1; i < arr.length - 1; i++) {
      str += '/' + arr[i];
      result.push(str);
    }
  }

  return result;
}

/**
 * Match fields in the path.
 * @param lang - Language
 * @param path - Path
 * @param arr - Path array
 */
function matchPath(lang: Langs, path: string, arr: MenuPath[]): string[] {
  const result: string[] = [];

  // Split the path
  const pathArr = splitPath(path);
  let left = 0;
  const right = pathArr.length;

  for (let i = 0; i < arr.length; i++) {
    const { path } = arr[i];
    if (path?.[left] === pathArr[left]) {
      result.push(lang === 'en' ? arr[i].labelEn : arr[i].label);
      if (left < right - 1) left++;
    }
    if (left === right) return result;
  }

  return result;
}

/**
 * Split the path and remove the first string.
 * @param path - Path
 */
export function splitPath(path: string): string[] {
  // Return empty array if path is empty or not a string
  if (!path || typeof path !== 'string') return [];
  // Split the path
  const result = path?.split('/') || [];
  // Remove the first empty string
  if (result?.[0] === '') result.shift();
  return result;
}

/**
 * Search for menu items based on a value.
 * @param menus - Menus
 * @param permissions - Permissions list
 * @param value - Search value
 * @param currentPath - Current path
 * @param result - Result
 */
interface MenuPath {
  label: string;
  labelZh: string;
  labelEn: string;
  path: string[];
}
interface SearchMenuProps {
  menus: SideMenu[] | undefined,
  permissions: string[],
  value: string,
  currentPath?: MenuPath[],
  result?: SideMenu[]
}

export function searchMenuValue(data: SearchMenuProps): SideMenu[] {
  const { menus, permissions, value } = data;
  let { currentPath, result } = data;
  if (!menus?.length || !value) return [];
  if (!currentPath) currentPath = [];
  if (!result) result = [];
  const lang = localStorage.getItem(LANG);

  for (let i = 0; i < menus.length; i++) {
    // If there are child items, recurse
    if (hasChildren(menus[i])) {
      currentPath.push({
        label: menus[i].label,
        labelZh: menus[i].label,
        labelEn: menus[i].labelEn,
        path: splitPath(menus[i].key)
      });

      // Recursively process child items and return results
      const childrenData = {
        menus: menus[i].children,
        permissions,
        value,
        currentPath,
        result
      };
      const childResult = searchMenuValue(childrenData);

      // If child result contains values, merge arrays
      if (childResult.length) {
        result.concat(childResult);
      } else {
        currentPath.pop();
      }
    } else if (
      (
        lang === 'en' && menus[i]?.labelEn?.toLocaleUpperCase()?.includes(value?.toLocaleUpperCase()) ||
        lang !== 'en' && menus[i]?.label?.includes(value)
      ) && hasPermission(menus[i], permissions)
    ) {
      currentPath.push({
        label: menus[i].label,
        labelZh: menus[i].label,
        labelEn: menus[i].labelEn,
        path: splitPath(menus[i].key)
      });
      const nav = matchPath(lang as Langs, menus[i].key, currentPath);

      // Add menu item to result if it matches the value
      const { label, labelEn, key } = menus[i];
      result.push({ label, labelEn, key, nav });
    }
  }

  return result;
}

/**
 * Get the current menu item based on the key.
 * @param menus - Menus
 * @param permissions - Permissions list
 * @param key - Route key
 * @param fatherNav - Parent breadcrumb
 * @param result - Result
 */
export interface NavData {
  label: string;
  labelZh: string;
  labelEn: string;
}
interface GetMenuByKeyResult {
  label: string;
  labelZh: string;
  labelEn: string;
  key: string;
  nav: NavData[];
}
interface GetMenuByKeyProps {
  menus: SideMenu[] | undefined,
  permissions: string[],
  key: string,
  fatherNav?: NavData[],
  result?: GetMenuByKeyResult
}

export function getMenuByKey(data: GetMenuByKeyProps): GetMenuByKeyResult | undefined {
  const { menus, permissions, key } = data;
  const lang = localStorage.getItem(LANG);
  let { fatherNav, result } = data;
  if (!menus?.length) return result;
  if (!fatherNav) fatherNav = [];
  if (!result?.key) result = {
    key: '',
    label: '',
    labelZh: '',
    labelEn: '',
    nav: []
  };

  for (let i = 0; i < menus.length; i++) {
    if (!key || (result as GetMenuByKeyResult).key) return result;

    const { label, labelEn, children } = menus[i];
    const currentLabel = lang === 'en' ? labelEn : label;

    // Filter values in child data
    if (hasChildren(menus[i])) {
      fatherNav.push({
        label: currentLabel,
        labelZh: label,
        labelEn,
      });

      // Recursively process child items and return results
      const childProps = {
        menus: children,
        permissions,
        key,
        fatherNav,
        result
      };
      const childResult = getMenuByKey(childProps);

      // If child result contains a key, update result
      if (childResult?.key) {
        result = childResult;
      } else {
        // Remove incorrect path from breadcrumb before next recursion
        fatherNav.pop();
      }
    } else if (
      menus[i]?.key === key &&
      hasPermission(menus[i], permissions)
    ) {
      const { key } = menus[i];
      fatherNav.push({
        label: currentLabel,
        labelZh: label,
        labelEn,
      });
      if (key) result = {
        label,
        labelZh: label,
        labelEn,
        key,
        nav: fatherNav
      };
    }
  }

  return result;
}

/**
 * Get the menu name.
 * @param list - Menu list
 * @param path - Path
 * @param lang - Language
 */
export const getMenuName = (list: SideMenu[], path: string, lang: string) => {
  let result = '';

  const deepData = (list: SideMenu[], path: string) => {
    if (result) return result;

    for (let i = 0; i < list?.length; i++) {
      const item = list[i];

      if (item.key === path) {
        result = lang === 'en' ? item.labelEn : item.label;
        return result;
      }

      if (item.children?.length) {
        const childResult = deepData(item.children, path);
        if (childResult) {
          result = childResult;
          return result;
        }
      }
    }

    return result;
  };
  deepData(list, path);

  return result;
};

/**
 * Filter menus based on permissions.
 * @param menus - Menus
 * @param permissions - Permissions list
 */
export function filterMenus(
  menus: SideMenu[],
  permissions: string[]
): SideMenu[] {
  const result: SideMenu[] = [];
  const newMenus = JSON.parse(JSON.stringify(menus));
  const lang = localStorage.getItem(LANG);

  for (let i = 0; i < newMenus.length; i++) {
    const item = newMenus[i];
    // Process child items
    if (hasChildren(item)) {
      const result = filterMenus(
        item.children as SideMenu[],
        permissions
      );

      // Keep item if it has child permission data
      item.children = result?.length ? result : undefined;
    }

    // Add item if it has permission or child data
    if (
      hasPermission(item, permissions) ||
      hasChildren(item)
    ) {
      if (lang === 'en') item.label = item.labelEn;
      result.push(item);
    }
  }

  return result;
}

/**
 * Get the first valid permission route
 * @param menus - Menu
 * @param permissions - Permissions
 */
export function getFirstMenu(
  menus: SideMenu[],
  permissions: string[],
  result = ''
): string {
  // Return directly if there's a result
  if (result) return result;

  for (let i = 0; i < menus.length; i++) {
    // Process child arrays
    if (hasChildren(menus[i]) && !result) {
      const childResult = getFirstMenu(
        menus[i].children as SideMenu[],
        permissions,
        result
      );

      // Assign value if there is a result
      if (childResult) {
        result = childResult;
        return result;
      }
    }

    // Check if there's permission and no child data
    if (
      hasPermission(menus[i], permissions) &&
      !hasChildren(menus[i])
    ) result = menus[i].key;
  }

  return result;
}

/**
 * Get the key of child data
 * @param menus - Menu data
 * @param level - Level
 */
function getChildrenKey(menus: SideMenu[] | undefined, level: number) {
  if (!menus?.length) return 'none';
  let result = '';

  const deep = (menus: SideMenu[], level: number) => {
    if (result) return result;
    const newLevel = level + 1;

    for (let i = 0; i < menus?.length; i++) {
      const item = menus[i];
      if (item.key) {
        const arr = item.key.split('/');
        for (let j = 1; j < arr?.length && j <= newLevel; j++) {
          const key = arr[j];
          result += `/${key}`;
        }
        return result;
      }

      if (item.children) {
        deep(item.children, newLevel);
      }
    }
  };
  deep(menus, level);

  return result;
}

/**
 * Menu data processing - Remove unnecessary fields
 * @param menus - Menu data
 * @param level - Level
 */
export function handleFilterMenus(menus: SideMenu[], level = 0): SideMenu[] {
  const currentItem: SideMenu[] = [];

  for (let i = 0; i < menus?.length; i++) {
    const item = menus[i];
    let children: SideMenu[] = [];

    if (item.children?.length) {
      const newLevel = level + 1;
      children = handleFilterMenus(item.children, newLevel);
    }

    const data: Partial<SideMenu> = { ...item };
    if (children?.length) (data as SideMenu).children = children;
    if (!data.key) data.key = getChildrenKey(data.children, level);
    delete data.labelEn;

    currentItem.push(data as SideMenu);
  }

  return currentItem;
}

/**
 * Convert to the format required for navigation
 * @param list - Title queue
 */
export function handleFilterNav(list: string[]): NavData[] {
  const result: NavData[] = [];

  for (let i = 0; i < list?.length; i++) {
    const item = list[i];
    result.push({
      label: item,
      labelZh: item,
      labelEn: item,
    });
  }
  return result;
}

/**
 * Check if the route has permission
 * @param route - Route
 * @param permissions - Permissions
 */
function hasPermission(route: SideMenu, permissions: string[]): boolean {
  return permissions?.includes(route?.rule || '');
}

/**
 * Check if there are child routes
 * @param route - Route
 */
function hasChildren(route: SideMenu): boolean {
  return Boolean(route.children?.length);
}
