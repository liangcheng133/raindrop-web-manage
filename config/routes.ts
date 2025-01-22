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
        name: '个人信息',
        path: '/personalCenter',
        component: './PersonalCenter',
        hideInMenu: true // 在菜单隐藏
      },
      {
        name: '系统管理',
        path: '/system',
        icon: 'icon-setting', // 使用阿里巴巴iconfont，在app.tsx postMenuData 里处理。二级菜单没有显示图标，需要的话要再app.tsx处理
        routes: [
          {
            path: '/system',
            redirect: '/system/user'
          },
          {
            name: '用户管理',
            path: '/system/user',
            component: './System/User'
          },
          {
            name: '角色管理',
            path: '/system/role',
            component: './System/Role'
          },
          {
            name: '字典管理',
            path: '/system/dict',
            component: './System/Dict'
          },
          {
            name: '登陆日志',
            path: '/system/loginLog',
            component: './System/LoginLog'
          },
          {
            name: '操作日志',
            path: '/system/operationLog',
            component: './System/OperationLog'
          },
          {
            name: '错误日志',
            path: '/system/errorLog',
            component: './System/ErrorLog'
          }
        ]
      }
    ]
  }
]
