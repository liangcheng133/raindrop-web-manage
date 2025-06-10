import { USER_ID_KEY, WEB_CODE, WEB_NAME } from '@/constants'
import { TrackVO } from '@/types/api'
import { localGet } from '@/utils/localStorage'
import { IGNORED_WARNING_MESSAGES } from '@/utils/setupGlobalErrorHandling'
import WebTracing from '@web-tracing/core'
import { App } from 'antd'
import { cloneDeep } from 'es-toolkit'
import React from 'react'
import AntdAppLayout from './AntdAppLayout'

/** 系统入口布局 */
const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <App>
      <AntdAppLayout />
      {children}
    </App>
  )
}

export default AppLayout

/** 前端监控上报 */
WebTracing.init({
  dsn: '/api/public/track',
  appName: WEB_NAME,
  appCode: WEB_CODE,
  debug: process.env.NODE_ENV === 'development',
  recordScreen: true, // 是否开启录屏
  pv: false, // 是否采集页面跳转相关数据
  performance: false, // 是否采集资源、接口、首次进入页面的数据
  error: true, // 是否采集错误信息
  event: false, // 是否采集点击事件
  cacheMaxLength: 5,
  cacheWatingTime: 5000,
  userUuid: localGet(USER_ID_KEY) || '',
  scopeError: true,
  tracesSampleRate: 0.5,
  beforeSendData(data) {
    const { eventInfo, baseInfo }: any = cloneDeep(data)
    const trackList: TrackVO[] = []
    // react 有报错上抛第一次错误的机制，这里给它规避掉
    eventInfo.forEach((item: any) => {
      if (['error', 'custom'].includes(item.eventType)) {
        console.log(item)
        // 过滤的错误信息不上传
        if (IGNORED_WARNING_MESSAGES.some((warningMsg) => item.errMessage.includes(warningMsg))) {
          return
        }
        // 接口异常 不上报
        if (['server'].includes(item.eventId)) return
        // 相同错误信息不上报
        if (trackList.find((fItem) => fItem.event_source === item.eventId && fItem.message === item.errMessage)) {
          return
        }
        trackList.push({
          event_type: item.eventType,
          event_source: item.eventId,
          url: item.triggerPageUrl,
          user_id: baseInfo.userUuid,
          app_code: baseInfo.appCode,
          app_name: baseInfo.appName,
          ip_address: baseInfo.ip,
          device: baseInfo.platform,
          browser: baseInfo.vendor,
          send_time: item.triggerTime,
          record_screen: item.recordscreen,
          message: item.errMessage
        })
      }
    })

    // 返回false代表sdk不再发送
    if (trackList.length === 0) return false

    return trackList
  }
})
