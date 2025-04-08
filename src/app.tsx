// 运行时配置
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { history, RuntimeAntdConfig, RunTimeLayoutConfig } from '@umijs/max'
import { Badge, Dropdown } from 'antd/lib'
import { isString } from 'es-toolkit'
import React from 'react'
import type { AxiosResponse, RequestConfig, RequestOptions } from 'umi'
import { IconFont } from './components/rd-ui'
import { USER_TOKEN_KEY, WEB_NAME } from './constants'
import { appendQueryParams } from './utils'
import { antdUtil } from './utils/antdUtil'
import { noAuthHandle } from './utils/auth'
import { localGet } from './utils/localStorage'
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
      locale: false // 关闭菜单国际化
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

/** 请求 拦截器 */
export const request: RequestConfig = {
  timeout: 10 * 1000,
  headers: { 'Content-Type': 'application/json' },
  errorConfig: {
    // errorThrower: (res: any) => {
    //   console.log('拦截错误>>>', res)
    // },
    errorHandler: (error: any, opts: any) => {
      console.log('处理错误>>>', { error, opts })
      const onNotificationError = (msg: string, errMsg: string) => {
        // if (!hideMsg) {
        // return ;
        // }
        antdUtil.notification?.error({
          message: msg,
          description: errMsg || '请求错误，请联系管理员'
        })
      }
      const res = error.response
      const status = res.status
      if (status === 401) {
        noAuthHandle()
      } else if ([403, 404].includes(status) || res.data.status === 1) {
        onNotificationError('请求错误', res.data.msg || res.data.error)
      }
    }
  },
  requestInterceptors: [
    [
      (config: RequestOptions) => {
        // 请求前缀
        config.baseURL = '/api'
        // 拼接 token
        config.headers = {
          ...config.headers,
          Authorization: 'Bearer ' + localGet(USER_TOKEN_KEY) || ''
        }
        return config
      }
    ]
  ],
  responseInterceptors: [
    (response: AxiosResponse) => {
      const res = response.data
      if (res.status !== 0) {
        return Promise.reject({ response })
      }
      console.log('请求Response拦截器', response)
      return response
    }
  ]
}
