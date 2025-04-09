import { antdUtil } from '@/utils/antdUtil'
import { App } from 'antd'
import { isNotNil } from 'es-toolkit'
import React, { useEffect } from 'react'

type AntdAppLayoutProps = {
  children?: React.ReactNode
  /** 挂载useApp 后触发 */
  onAfterMount?: () => void
}

const AntdAppLayout: React.FC<AntdAppLayoutProps> = ({ children, onAfterMount }) => {
  // 保存APP引用
  const { notification, message, modal } = App.useApp()
  useEffect(() => {
    antdUtil.setMessageInstance(message)
    antdUtil.setModalInstance(modal)
    antdUtil.setNotificationInstance(notification)
    if (isNotNil(onAfterMount)) {
      onAfterMount()
    }
  }, [notification, message, modal])

  return children
}

export default AntdAppLayout
