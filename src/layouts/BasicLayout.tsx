import { WEB_NAME } from '@/constants'
import { localGet } from '@/utils/localStorage'
import { IGNORED_WARNING_MESSAGES } from '@/utils/setupGlobalErrorHandling'
import { Outlet, useModel } from '@umijs/max'
import WebTracing from '@web-tracing/core'
import { cloneDeep } from 'es-toolkit'
import React from 'react'
import AntdAppLayout from './AntdAppLayout'

const BasicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const {} = useModel('user');
  return (
    <>
      <Outlet />
      <AntdAppLayout>{children}</AntdAppLayout>
    </>
  )
}

export default BasicLayout

/** 前端监控上报 */
WebTracing.init({
  dsn: '/sys/track',
  appName: WEB_NAME,
  debug: true,
  recordScreen: true, // 开启录屏
  pv: false, // 不采集页面跳转相关数据
  performance: false, // 不采集资源、接口、首次进入页面的数据
  error: true,
  event: false, // 不采集点击事件
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: localGet('USER_ID'),
  scopeError: true,
  tracesSampleRate: 0.5,
  beforeSendData(data) {
    const newData: any = cloneDeep(data)
    // react 有报错上抛第一次错误的机制，这里给它规避掉
    newData.eventInfo = newData.eventInfo?.reduce((acc: any, item: any) => {
      if (!acc.some((accItem: any) => accItem.sendTime === item.sendTime)) {
        // 如果报错时间相同 且 含被忽略的报错，则不添加
        if (!IGNORED_WARNING_MESSAGES.some((warningMsg) => item.errMessage.includes(warningMsg))) {
          acc.push(item)
        }
      }
      return acc
    }, [])

    // 返回false代表sdk不再发送
    if (newData.eventInfo.length === 0) return false
    console.log('报错上报前信息', newData)
    return newData
  }
})
