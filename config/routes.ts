export default [
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false
  },
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    flatMenu: true, // 隐藏当前菜单，子级菜单提升
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        name: '首页',
        path: '/home',
        component: './Home',
        hideInBreadcrumb: true, // 在面包屑隐藏
        hideInMenu: true // 在菜单隐藏
      },
      {
        name: '系统管理',
        path: '/system',
        routes: [
          {
            name: '用户管理',
            path: '/system/user',
            component: './User'
          }
        ]
      }
    ]
  }
]
