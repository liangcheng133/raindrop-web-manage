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
  }
]
