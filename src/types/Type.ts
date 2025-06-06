import { ModalFormProps } from '@ant-design/pro-components'
import { MouseEventHandler } from 'react'
import { SysLoginUserVO } from './api.zod'

/** 表单弹框完成回调类型 */
export type ModalFormOnFinishType = ModalFormProps['onFinish']

/** 表单弹框显隐回调类型 */
export type ModalFormOnOpenChangeType = ModalFormProps['onOpenChange']

/** 基础行为类型 */
export type NormalBehaviorType = {
  key?: string
  auth?: string
  title?: string
  hide?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

/** 初始化值类型 */
export type InitialStateType = SysLoginUserVO & {
  name: string
}
