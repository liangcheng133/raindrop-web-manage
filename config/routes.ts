export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false
  },
  {
    name: '首页',
    path: '/home',
    component: './Home'
  },
  {
    name: '系统管理',
    path: '/system',
    routes: [
      {
        path: '/system',
        redirect: '/system/user'
      },
      {
        name: '用户管理',
        path: '/system/user',
        component: './User'
      }
    ]
  }
]
