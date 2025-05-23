import { ModalFormProps } from '@ant-design/pro-components'
import { SysLoginUserVOType } from './API'

/** 表单弹框完成回调类型 */
export type ModalFormOnFinishType = ModalFormProps['onFinish']

/** 表单弹框显隐回调类型 */
export type ModalFormOnOpenChangeType = ModalFormProps['onOpenChange']

export type InitialStateType = SysLoginUserVOType & {
  name: string
}
