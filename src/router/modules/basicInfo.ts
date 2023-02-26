const Layout = () => import('@/layout/index.vue');

export default {
  path: '/basicInfo',
  name: 'BasicInfo',
  component: Layout,
  redirect: '/basicInfo/profession',
  meta: {
    icon: 'basicInfo',
    title: '基础信息管理',
    rank: 2,
  },
  children: [
    {
      path: '/basicInfo/profession',
      name: 'profession',
      component: () => import('@/views/basicInfo/profession.vue'),
      meta: {
        title: '专业管理',
      },
    },
    {
      path: '/basicInfo/lesson',
      name: 'lesson',
      component: () => import('@/views/basicInfo/lesson.vue'),
      meta: {
        title: '课程管理',
      },
    },
  ],
} as RouteConfigsTable;
