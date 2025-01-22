// 运行时配置
import { RuntimeAntdConfig, RunTimeLayoutConfig } from '@umijs/max'
import { BreadcrumbProps } from 'antd/lib'
import { isString } from 'es-toolkit'
import React from 'react'
import type { AxiosResponse, RequestConfig, RequestOptions } from 'umi'
import { AppAvatarComm } from './components/AppLayout'
import { IconFont } from './components/rd-ui'
import { DEFAULT_NAME } from './constants'
import { antdUtil } from './utils/antdUtil'
import { noAuthHandle } from './utils/auth'
import { setupGlobalErrorHandling } from './utils/setupGlobalErrorHandling'

// 过滤 React 和 Antd 常见控制台警告 详见：https://github.com/ant-design/pro-components/discussions/8837
setupGlobalErrorHandling()

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: DEFAULT_NAME }
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    title: DEFAULT_NAME,
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false // 关闭菜单国际化
    },
    layout: 'mix', // 混合菜单结构
    avatarProps: {
      src: 'https://wallpapershome.com/images/pages/ico_h/27018.jpg',
      size: 'small',
      title: 'Dylan',
      render: (props, dom) => {
        return <AppAvatarComm>{dom}</AppAvatarComm>
      }
    },
    postMenuData: (menuData) => {
      return menuData?.map((item) => {
        if (item.icon && isString(item.icon)) {
          return { ...item, icon: <IconFont type={item.icon} /> }
        }
        return item
      })
    },
    breadcrumbRender: (routers: BreadcrumbProps[]) => {
      return [{ path: '/', breadcrumbName: '首页' }, ...routers]
    }
  }
}

export const antd: RuntimeAntdConfig = (memo) => {
  memo.theme ??= {}
  return memo
}

export const request: RequestConfig = {
  timeout: 2000,
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
        console.log('[  antdUtil?.notification ] >', antdUtil?.notification)
        if (res.status === 1) {
          onError(res.msg)
        } else if (res.status === 401) {
          noAuthHandle()
        }
      }
      console.log('请求Response拦截器', response)
      return response
    }
  ]
}
