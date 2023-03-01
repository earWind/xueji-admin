const Layout = () => import('@/layout/index.vue');

export default {
  path: '/dailyActs',
  name: 'DailyActs',
  component: Layout,
  redirect: '/dailyActs/list',
  meta: {
    icon: 'dailyActs',
    title: '日常行为管理',
    rank: 5,
    role: 'BEHAVIOR',
  },
  children: [
    {
      path: '/dailyActs/list',
      name: 'DailyActsList',
      component: () => import('@/views/dailyActs/list.vue'),
      meta: {
        title: '日常行为列表',
        showParent: true,
      },
    },
  ],
} as RouteConfigsTable;
