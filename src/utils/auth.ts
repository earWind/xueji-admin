import Cookies from 'js-cookie';
import { storageSession } from '@pureadmin/utils';
import { useUserStoreHook } from '@/store/modules/user';

export interface DataInfo {
  /** id */
  id: string;
  /** 用户名 */
  username?: string;
  /** 当前登陆用户的角色 */
  roles?: Array<string>;
}

export const sessionKey = 'user-info';
export const TokenKey = 'authorized-token';

// 获取token
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}

// 设置token
export function setToken(data: any) {
  const { id, name, permissionSet } = data;

  useUserStoreHook().SET_USERNAME(name);
  useUserStoreHook().SET_ROLES(permissionSet);
  storageSession().setItem(sessionKey, {
    id,
    username: name,
    roles: permissionSet,
  });
}

// 删除token
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

// 格式化token（jwt格式）
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};
