import { USER_ID_KEY, WEB_NAME } from '@/constants'
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

/** 前端监控上报 */
WebTracing.init({
  dsn: '/sys/track',
  appName: WEB_NAME,
  debug: true,
  recordScreen: true, // 是否开启录屏
  pv: false, // 是否采集页面跳转相关数据
  performance: false, // 是否采集资源、接口、首次进入页面的数据
  error: true, // 是否采集错误信息
  event: false, // 是否采集点击事件
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: localGet(USER_ID_KEY),
  scopeError: true,
  tracesSampleRate: 0.5,
  beforeSendData(data) {
    const newData: any = cloneDeep(data)
    // react 有报错上抛第一次错误的机制，这里给它规避掉
    newData.eventInfo = newData.eventInfo?.reduce((acc: any, item: any) => {
      if (item.eventType === 'error') {
        if (!acc.some((accItem: any) => accItem.sendTime === item.sendTime)) {
          // 如果报错时间相同 且 含被忽略的报错，不添加到上报
          if (!IGNORED_WARNING_MESSAGES.some((warningMsg) => item.errMessage.includes(warningMsg))) {
            acc.push(item)
          }
        }
      } else {
        acc.push(item)
      }
      return acc
    }, [])

    // 返回false代表sdk不再发送
    if (newData.eventInfo.length === 0) return false
    console.log('上报信息', newData)
    return newData
  }
})
