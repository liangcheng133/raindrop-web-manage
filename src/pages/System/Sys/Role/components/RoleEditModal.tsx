import { saveSysRoleAPI } from '@/services/role'
import { antdUtil } from '@/utils/antdUtil'
import { ModalForm, ModalFormProps, ProFormText } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type RoleEditModalRefType = {
  /**
   * 打开弹框
   * @param {*} data 编辑数据，传递时则为编辑模式
   */
  open: (data?: API.SysRoleVO) => void
  /** 关闭弹框 */
  close: () => void
}

export type RoleEditModalPropsType = {
  /** 接口成功时回调 */
  onSuccess?: () => void
  /** 接口失败时回调 */
  onFail?: (error: any) => void
}

/** 新建、编辑角色弹框 */
const RoleEditModal = forwardRef<RoleEditModalRefType, RoleEditModalPropsType>((props, ref) => {
  const { onSuccess, onFail } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useSafeState(false)
  const [baseFormData, setBaseFormData] = useSafeState<API.SysRoleVO>()
  const isEdit = !!baseFormData

  const open = (data?: API.SysRoleVO) => {
    form.setFieldsValue(data)
    setBaseFormData(data)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const onOpenChange: ModalFormProps['onOpenChange'] = (visible) => {
    setVisible(visible)
  }

  const onFinish: ModalFormProps['onFinish'] = async (values) => {
    try {
      await saveSysRoleAPI(values)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.log(error)
      onFail?.(error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open, close }), [])

  return (
    <ModalForm
      title={isEdit ? '编辑角色' : '新建角色'}
      width={500}
      form={form}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
      <ProFormText name='id' hidden />
      <ProFormText name='sort' hidden />
      <ProFormText
        rules={[{ required: true, message: '请输入角色名称' }]}
        name='name'
        label='角色名称'
        tooltip='最长为 24 位'
        placeholder='请输入角色名称'
      />
    </ModalForm>
  )
})

export default RoleEditModal
