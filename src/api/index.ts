import { http } from '@/utils/http';

export const majorListPage = (data) => {
  return http.request<any>('post', '/major/listPage', { data });
};

export const majorAdd = (data) => {
  return http.request<any>('post', '/major/add', { data });
};

export const majorUpdate = (data) => {
  return http.request<any>('post', '/major/update', { data });
};

export const majorDelete = (id) => {
  return http.request<any>('delete', '/major/delete/' + id);
};
