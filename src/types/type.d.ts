import { ModalFormProps } from '@ant-design/pro-components'
import { MouseEventHandler } from 'react'
import { AuthMap, SysUserVO } from './api'

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
export type InitialStateType = {
  name: string
  user_info: Partial<SysUserVO>
  auths: Partial<AuthMap>
}

export interface HandleErrorConfigType {
  /** 是否显示提示弹窗，默认为true */
  showMessage?: boolean
  /** 提示错误信息 */
  message?: string
  /** 是否发送到服务器，默认为true */
  sentToServer?: boolean
}

export interface SendErrorToServerConfigType extends HandleErrorConfigType {}
