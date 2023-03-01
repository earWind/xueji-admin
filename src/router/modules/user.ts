const Layout = () => import('@/layout/index.vue');

export default {
  path: '/user',
  name: 'User',
  component: Layout,
  redirect: '/overview',
  meta: {
    icon: 'user',
    title: '用户管理',
    rank: 1,
    role: 'USER',
  },
  children: [
    {
      path: '/user/overview',
      name: 'Overview',
      component: () => import('@/views/user/overview.vue'),
      meta: {
        title: '用户全览',
      },
    },
    {
      path: '/user/password',
      name: 'Password',
      component: () => import('@/views/user/password.vue'),
      meta: {
        title: '修改密码',
      },
    },
  ],
} as RouteConfigsTable;
