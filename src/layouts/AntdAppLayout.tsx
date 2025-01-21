import { antdUtil } from '@/utils/antdUtil'
import { App } from 'antd'
import React, { useEffect } from 'react'

const AntdAppLayout: React.FC<React.PropsWithChildren> = (props) => {
  // 保存APP引用
  const { notification, message, modal } = App.useApp()
  useEffect(() => {
    antdUtil.setMessageInstance(message)
    antdUtil.setModalInstance(modal)
    antdUtil.setNotificationInstance(notification)
  }, [notification, message, modal])

  return props.children
}

const APPLayout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <App>
      <AntdAppLayout />
    </App>
  )
}
export default APPLayout
