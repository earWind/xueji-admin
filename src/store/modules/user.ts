import { defineStore } from 'pinia';
import { store } from '@/store';
import { userType } from './types';
import { routerArrays } from '@/layout/types';
import { router, resetRouter } from '@/router';
import { storageSession } from '@pureadmin/utils';
import { refreshTokenApi } from '@/api/user';
import type { UserResult, RefreshTokenResult } from '@/api/user';
import { userLogin } from '@/api';
import { useMultiTagsStoreHook } from '@/store/modules/multiTags';
import { type DataInfo, setToken, removeToken, sessionKey } from '@/utils/auth';

export const useUserStore = defineStore({
  id: 'user',
  state: (): userType => ({
    // 用户名
    username: storageSession().getItem<DataInfo>(sessionKey)?.username ?? '',
    // 页面级别权限
    roles: storageSession().getItem<DataInfo>(sessionKey)?.roles ?? [],
  }),
  getters: {
    userId() {
      return storageSession().getItem<DataInfo>(sessionKey)?.id ?? '';
    },
  },
  actions: {
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUsername(param) {
      return new Promise<UserResult>((resolve, reject) => {
        userLogin(param)
          .then((res) => {
            const { code, message, data } = res;
            if (code === 200) {
              setToken(data);
              resolve(res);
            } else {
              reject(message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = '';
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags('equal', [...routerArrays]);
      resetRouter();
      router.push('/login');
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then((data) => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});

export function useUserStoreHook() {
  return useUserStore(store);
}
