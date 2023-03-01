const Layout = () => import('@/layout/index.vue');

export default {
  path: '/score',
  name: 'score',
  component: Layout,
  redirect: '/score/list',
  meta: {
    icon: 'score',
    title: '考试成绩管理',
    rank: 4,
    role: 'SCORE',
  },
  children: [
    {
      path: '/score/list',
      name: 'ScoreList',
      component: () => import('@/views/score/list.vue'),
      meta: {
        title: '考试成绩列表',
        showParent: true,
      },
    },
  ],
} as RouteConfigsTable;
