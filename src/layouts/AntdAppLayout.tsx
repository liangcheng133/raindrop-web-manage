import { antdUtil } from '@/utils/antdUtil'
import { App } from 'antd'
import React, { useEffect } from 'react'
import { ReactFcProps } from './BasicLayout'

const AntdAppLayout: React.FC<ReactFcProps> = (props) => {
  // 保存APP引用
  const { notification, message, modal } = App.useApp()
  useEffect(() => {
    antdUtil.setMessageInstance(message)
    antdUtil.setModalInstance(modal)
    antdUtil.setNotificationInstance(notification)
  }, [notification, message, modal])

  return props.children
}

const APPLayout: React.FC<ReactFcProps> = (props) => {
  return (
    <App>
      <AntdAppLayout />
    </App>
  )
}
export default APPLayout
