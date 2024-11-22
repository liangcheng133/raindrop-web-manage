// 运行时配置

import { RunTimeLayoutConfig } from '@umijs/max'
import { BreadcrumbProps } from 'antd/lib'
import { DEFAULT_NAME } from './constants'

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
    breadcrumbRender: (routers: BreadcrumbProps[]) => {
      console.log('[ routers ] >', routers)
      return [{ path: '/', breadcrumbName: '首页' }, ...routers]
    }
  }
}
