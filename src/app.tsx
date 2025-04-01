// 运行时配置
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { history, RuntimeAntdConfig, RunTimeLayoutConfig } from '@umijs/max'
import { Badge, Dropdown } from 'antd/lib'
import { isString } from 'es-toolkit'
import React from 'react'
import type { AxiosResponse, RequestConfig, RequestOptions } from 'umi'
import { IconFont } from './components/rd-ui'
import { WEB_NAME } from './constants'
import { appendQueryParams } from './utils'
import { antdUtil } from './utils/antdUtil'
import { noAuthHandle } from './utils/auth'
import { setupGlobalErrorHandling } from './utils/setupGlobalErrorHandling'

// 过滤 React 和 Antd 常见控制台警告 详见：https://github.com/ant-design/pro-components/discussions/8837
if (process.env.NODE_ENV === 'development') {
  setupGlobalErrorHandling()
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: WEB_NAME }
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    title: WEB_NAME,
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false, // 关闭菜单国际化
      request: (params, defaultMenuData) => {
        console.log('[ params, defaultMenuData ] >', params, defaultMenuData)
        return new Promise((resolve) => {
          console.log('触发request')
          setTimeout(() => {
            console.log('模拟resolve')
            resolve([
              {
                name: '首页',
                path: '/home'
              },
              {
                name: '成员',
                path: '/member',
                children: [
                  {
                    name: '成员管理',
                    path: '/member/members'
                  }
                ]
              }
            ])
          }, 3000)
        })
      }
    },
    layout: 'mix', // 混合菜单结构
    splitMenus: true, // 自动分离顶部与侧边菜单
    fixSiderbar: true, // 固定侧边栏
    avatarProps: {
      src: 'https://wallpapershome.com/images/pages/ico_h/27018.jpg',
      size: 'small',
      title: 'Dylan',
      render: (props, dom) => {
        const toUserInfo = () => {
          console.log('用户信息')
          history.push(appendQueryParams('/personalCenter'))
        }
        const onLogout = () => {
          console.log('退出登录')
        }
        return (
          <Dropdown
            menu={{
              items: [
                { key: 'userInfo', icon: <UserOutlined />, label: '个人信息', onClick: toUserInfo },
                { type: 'divider' },
                { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: onLogout }
              ]
            }}>
            {dom}
          </Dropdown>
        )
      }
    },
    actionsRender: () => {
      return [
        <Badge key='InfoCircleFilled' count={87} size='small' offset={[0, 10]}>
          <IconFont
            type='icon-bell-fill'
            className='layout-menu-action'
            onClick={() => {
              console.log('我被点击了')
            }}
          />
        </Badge>
      ]
    },
    postMenuData: (menuData) => {
      return menuData?.map((item) => {
        if (item.icon && isString(item.icon)) {
          return { ...item, icon: <IconFont type={item.icon} /> }
        }
        return item
      })
    }

    // breadcrumbRender: (routers: BreadcrumbProps[]) => {
    //   return [{ path: '/', breadcrumbName: '首页' }, ...routers]   // 面包屑增加首页路由
    // }
  }
}

export const antd: RuntimeAntdConfig = (memo) => {
  memo.theme ??= {}
  return memo
}

export const request: RequestConfig = {
  timeout: 10 * 1000,
  headers: { 'Content-Type': 'application/json' },
  errorConfig: {
    errorThrower: (res: any) => {
      console.log('拦截错误>>>', res)
    },
    errorHandler: (error: any, opts: any) => {
      console.log('处理错误>>>', { error, opts })
    }
  },
  requestInterceptors: [
    [
      (config: RequestOptions) => {
        config.baseURL = '/api'
        return config
      }
    ]
  ],
  responseInterceptors: [
    (response: AxiosResponse) => {
      const res = response.data
      const onError = (msg: string) => {
        // if (!hideMsg) {
        // return ;
        // }
        antdUtil.message?.error(msg)
      }
      if (res.status !== 0) {
        if (res.status === 1) {
          onError(res.msg)
        } else if (res.status === 401) {
          noAuthHandle()
        }
        return Promise.reject(res)
      }
      console.log('请求Response拦截器', response)
      return response
    }
  ]
}
