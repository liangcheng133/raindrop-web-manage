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
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '个人信息',
        path: '/personalCenter',
        component: './PersonalCenter',
        hideInMenu: true, // 在菜单隐藏
        wrappers: ['@/wrappers/auth']
      },
      {
        name: '成员',
        path: '/member',
        routes: [
          {
            path: '/member',
            redirect: '/member/members'
          },
          {
            name: '成员管理',
            path: '/member/members',
            component: './Member/Members',
            wrappers: ['@/wrappers/auth']
          }
        ]
      },
      {
        name: '系统',
        path: '/system',
        routes: [
          {
            path: '/system',
            redirect: '/system/sys/user'
          },
          {
            path: '/system/sys',
            redirect: '/system/sys/user'
          },
          {
            name: '系统管理',
            path: '/system/sys',
            icon: 'icon-setting', // 使用阿里巴巴iconfont，在app.tsx postMenuData 里处理。二级菜单没有显示图标，需要的话要再app.tsx处理
            routes: [
              {
                name: '用户管理',
                path: '/system/sys/user',
                component: './System/Sys/User',
                wrappers: ['@/wrappers/auth']
              }
            ]
          },
          {
            name: '系统日志',
            path: '/system/log',
            icon: 'icon-log',
            routes: [
              {
                path: '/system/log',
                redirect: '/system/log/loginLog'
              },
              {
                name: '登陆日志',
                path: '/system/log/loginLog',
                component: './System/Log/LoginLog',
                wrappers: ['@/wrappers/auth']
              },
              {
                name: '操作日志',
                path: '/system/log/operationLog',
                component: './System/Log/OperationLog',
                wrappers: ['@/wrappers/auth']
              },
              {
                name: '错误日志',
                path: '/system/log/errorLog',
                component: './System/Log/ErrorLog',
                wrappers: ['@/wrappers/auth']
              }
            ]
          }
        ]
      }
    ]
  }
]
