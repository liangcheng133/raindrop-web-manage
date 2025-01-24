/*
 * @Date: 2025-01-14 09:28:10
 * @LastEditTime: 2025-01-24 11:11:14
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: antd 挂载弹框实例
 */
import { MessageInstance } from 'antd/es/message/interface'
import { HookAPI } from 'antd/es/modal/useModal'
import { NotificationInstance } from 'antd/es/notification/interface'

class AntdUtil {
  message: MessageInstance | null = null
  notification: NotificationInstance | null = null
  modal: HookAPI | null = null

  setMessageInstance(message: MessageInstance) {
    this.message = message
  }
  setNotificationInstance(notification: NotificationInstance) {
    this.notification = notification
  }
  setModalInstance(modal: HookAPI) {
    this.modal = modal
  }
}
export const antdUtil = new AntdUtil()
