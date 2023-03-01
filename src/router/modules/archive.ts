const Layout = () => import('@/layout/index.vue');

export default {
  path: '/archive',
  name: 'Archive',
  component: Layout,
  redirect: '/archive/class',
  meta: {
    icon: 'archive',
    title: '学籍档案管理',
    rank: 3,
    role: 'ARCHIVE',
  },
  children: [
    {
      path: '/archive/class',
      name: 'Class',
      component: () => import('@/views/archive/class.vue'),
      meta: {
        title: '班级信息管理',
      },
    },
    {
      path: '/archive/student',
      name: 'Student',
      component: () => import('@/views/archive/student.vue'),
      meta: {
        title: '学生学籍管理',
      },
    },
  ],
} as RouteConfigsTable;
