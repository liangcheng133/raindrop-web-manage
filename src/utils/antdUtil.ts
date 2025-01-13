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
