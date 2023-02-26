const Layout = () => import('@/layout/index.vue');

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/home',
  meta: {
    icon: 'home',
    title: '首页',
    rank: 0,
  },
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
} as RouteConfigsTable;
