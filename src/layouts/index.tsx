import { USER_ID_KEY, WEB_CODE, WEB_NAME } from '@/constants'
import { TrackType } from '@/types/API'
import { localGet } from '@/utils/localStorage'
import { IGNORED_WARNING_MESSAGES } from '@/utils/setupGlobalErrorHandling'
import { Outlet, useModel } from '@umijs/max'
import WebTracing from '@web-tracing/core'
import { useSafeState } from 'ahooks'
import { App, Spin } from 'antd'
import { cloneDeep } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import React, { useEffect } from 'react'
import AntdAppLayout from './AntdAppLayout'

/** 系统布局 */
const BasicLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useModel('user')
  const { refresh: refreshOrgList } = useModel('org')
  const { refresh: refreshRoleList } = useModel('role')

  const [isShow, setIsShow] = useSafeState(false)

  useEffect(() => {
    if (isShow && !isEmpty(token)) {
      refreshOrgList(true)
      refreshRoleList(true)
    }
  }, [token, isShow])
  return (
    <App>
      <Spin spinning={!isShow}>{isShow && <Outlet />}</Spin>
      <AntdAppLayout onAfterMount={() => setIsShow(true)}>{children}</AntdAppLayout>
    </App>
  )
}

export default BasicLayout

type TrackListType = TrackType & {
  errMessage: string
}

/** 前端监控上报 */
WebTracing.init({
  dsn: '/api/public/track',
  appName: WEB_NAME,
  appCode: WEB_CODE,
  debug: true,
  recordScreen: true, // 是否开启录屏
  pv: false, // 是否采集页面跳转相关数据
  performance: false, // 是否采集资源、接口、首次进入页面的数据
  error: true, // 是否采集错误信息
  event: false, // 是否采集点击事件
  cacheMaxLength: 5,
  cacheWatingTime: 5000,
  userUuid: localGet(USER_ID_KEY),
  scopeError: true,
  tracesSampleRate: 0.5,
  beforeSendData(data) {
    const { eventInfo, baseInfo }: any = cloneDeep(data)
    const trackList: TrackListType[] = []
    // react 有报错上抛第一次错误的机制，这里给它规避掉
    eventInfo.forEach((item: any) => {
      if (['error', 'custom'].includes(item.eventType)) {
        console.log(item)
        // 过滤的错误信息不上传
        if (IGNORED_WARNING_MESSAGES.some((warningMsg) => item.errMessage.includes(warningMsg))) {
          return
        }
        // 相同错误信息不上报
        if (trackList.find((fItem) => fItem.event_source === item.eventId && fItem.errMessage === item.errMessage)) {
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
          send_time: baseInfo.sendTime,
          data: JSON.stringify(item),
          errMessage: item.errMessage
        })
      }
    })

    console.log('上报信息', trackList)
    // 返回false代表sdk不再发送
    if (trackList.length === 0) return false
    return trackList
  }
})
