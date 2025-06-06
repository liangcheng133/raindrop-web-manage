// 运行时配置
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import type { SiderMenuProps } from '@ant-design/pro-layout/es/components/SiderMenu/SiderMenu.d.ts'
import { history, RuntimeAntdConfig, RunTimeLayoutConfig, useModel } from '@umijs/max'
import { Badge, Dropdown } from 'antd/lib'
import { isString } from 'es-toolkit'
import React from 'react'
import type { AxiosResponse, RequestConfig, RequestOptions } from 'umi'
import { IconFont } from './components'
import { USER_TOKEN_KEY, WEB_NAME } from './constants'
import AppLayout from './layouts/AppLayout'
import { getLoginUserAPI } from './services/user'
import { InitialStateType } from './types/type'
import { appendQueryParams } from './utils'
import { antdUtil } from './utils/antdUtil'
import { noAuthHandle } from './utils/auth'
import { localGet } from './utils/localStorage'
import { ResError } from './utils/ResError'
import { setupGlobalErrorHandling } from './utils/setupGlobalErrorHandling'
import { isAxiosError, isResError } from './utils/validate'

console.log('app start')

// 过滤开发环境 React 和 Antd 常见控制台警告 详见：https://github.com/ant-design/pro-components/discussions/8837
if (process.env.NODE_ENV === 'development') {
  setupGlobalErrorHandling()
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// 这里不能使用useModel等hook，会使getInitialState返回undefined
export async function getInitialState(): Promise<InitialStateType> {
  const defaultState = { name: WEB_NAME, user_info: {}, auths: {} }
  try {
    if (!localGet(USER_TOKEN_KEY) && window.location.pathname === '/login') {
      throw new Error('登录页不请求用户信息')
    }
    // 获取当前登录用户信息以及授权信息
    const res = await getLoginUserAPI()
    return { ...defaultState, ...res.data }
  } catch (error) {
    return defaultState
  }
}

/** 入口配置项 */
export function rootContainer(container?: React.ReactNode) {
  return React.createElement(AppLayout, null, container)
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
    avatarProps: handleAvatarProps(),
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
      return (
        menuData?.map((item) => {
          if (item.icon && isString(item.icon)) {
            return { ...item, icon: <IconFont type={item.icon} /> }
          }
          return item
        }) || []
      )
    }
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
    errorHandler: (error: any) => {
      console.log('接口错误拦截 >>> ', error)
      const onNotificationError = (msg: string, errMsg: string) => {
        if (isResError(error) && error.response.config?.isShowNotification === false) {
          return
        }
        antdUtil.notification?.error({
          message: msg,
          description: errMsg || '请求错误，请联系管理员'
        })
      }
      if (isResError(error)) {
        const res = error.response
        if (res) {
          const status = res.status
          if (status === 401) {
            // 未授权时是否跳转登录页
            if (res.config?.isReplaceLoginPage !== false) {
              noAuthHandle()
            }
          } else if (res.data.status === 1) {
            onNotificationError('请求错误', res.data.msg || res.data.error)
          }
        }
      } else if (isAxiosError(error)) {
        const res = error.response
        if (res) {
          if (res.status === 504) {
            onNotificationError('请求错误', '服务器响应超时，请稍后再试。')
          } else if (res.status === 404) {
            onNotificationError('请求错误', '地址资源不存在。')
          }
        }
      }
    }
  },
  requestInterceptors: [
    [
      (config: RequestOptions) => {
        // 请求前缀
        config.baseURL = '/api'
        const token = localGet(USER_TOKEN_KEY) || ''
        if (token) {
          // 拼接 token
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
          }
        }
        return config
      }
    ]
  ],
  responseInterceptors: [
    (response: AxiosResponse) => {
      const res = response.data
      if (res.status !== 0) {
        throw new ResError(res.msg, response)
      }
      return response
    }
  ]
}

/** 处理右上角用户头像以及用户名的渲染配置 */
const handleAvatarProps = (): SiderMenuProps['avatarProps'] => {
  const { initialState } = useModel('@@initialState')
  const userInfo = initialState?.user_info || {}

  const toUserInfo = () => {
    history.push(appendQueryParams('/personalCenter'))
  }

  const onLogout = () => {
    console.log('退出登录')
  }

  return {
    src: userInfo.avatar_url || 'https://wallpapershome.com/images/pages/ico_h/27018.jpg',
    size: 'small',
    title: userInfo.name,
    render: (props, dom) => {
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
  }
}
