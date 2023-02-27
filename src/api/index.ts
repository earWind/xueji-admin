import { http } from '@/utils/http';

// 专业
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

// 课程
export const courseListPage = (data) => {
  return http.request<any>('post', '/course/listPage', { data });
};

export const courseAdd = (data) => {
  return http.request<any>('post', '/course/add', { data });
};

export const courseUpdate = (data) => {
  return http.request<any>('post', '/course/update', { data });
};

export const courseDelete = (id) => {
  return http.request<any>('delete', '/course/delete/' + id);
};

// 用户
export const userListPage = (data) => {
  return http.request<any>('post', '/user/listPage', { data });
};

export const userAdd = (data) => {
  return http.request<any>('post', '/user/add', { data });
};

export const userUpdate = (data) => {
  return http.request<any>('post', '/user/update', { data });
};

export const userDelete = (id) => {
  return http.request<any>('delete', '/user/delete/' + id);
};

export const userLogin = (data) => {
  return http.request<any>('post', '/user/login', { data });
};

export const userUpdatePwd = (data) => {
  return http.request<any>('post', '/user/updatePwd', { data });
};

// 考试成绩
export const examResultListPage = (data) => {
  return http.request<any>('post', '/exam-result/listPage', { data });
};

export const examResultAdd = (data) => {
  return http.request<any>('post', '/exam-result/add', { data });
};

export const examResultUpdate = (data) => {
  return http.request<any>('post', '/exam-result/update', { data });
};

export const examResultDelete = (id) => {
  return http.request<any>('delete', '/exam-result/delete/' + id);
};

export const examResultAddBatch = (data) => {
  return http.request<any>('post', '/exam-result/addBatch', { data });
};

// 日常行为
export const behaviorListPage = (data) => {
  return http.request<any>('post', '/behavior/listPage', { data });
};

export const behaviorAdd = (data) => {
  return http.request<any>('post', '/behavior/add', { data });
};

export const behaviorUpdate = (data) => {
  return http.request<any>('post', '/behavior/update', { data });
};

export const behaviorDelete = (id) => {
  return http.request<any>('delete', '/behavior/delete/' + id);
};

// 班级
export const classListPage = (data) => {
  return http.request<any>('post', '/class/listPage', { data });
};

export const classAdd = (data) => {
  return http.request<any>('post', '/class/add', { data });
};

export const classUpdate = (data) => {
  return http.request<any>('post', '/class/update', { data });
};

export const classDelete = (id) => {
  return http.request<any>('delete', '/class/delete/' + id);
};

// 学生
export const studentListPage = (data) => {
  return http.request<any>('post', '/student/listPage', { data });
};

export const studentAdd = (data) => {
  return http.request<any>('post', '/student/add', { data });
};

export const studentUpdate = (data) => {
  return http.request<any>('post', '/student/update', { data });
};

export const studentDelete = (id) => {
  return http.request<any>('delete', '/student/delete/' + id);
};

export const studentDetail = (data) => {
  return http.request<any>('get', '/student/detail', { data });
};
