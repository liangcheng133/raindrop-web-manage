import { saveSysRoleApi } from '@/services/Role'
import { antdUtil } from '@/utils/antdUtil'
import { ModalForm, ModalFormProps, ProFormText } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type RoleEditModalRef = Omit<ModalComm.ModalCommRef, 'open'> & {
  open: (data?: API.SystemRole) => void
}

/** 新建、编辑角色弹框 */
const RoleEditModal = forwardRef<RoleEditModalRef, ModalComm.ModalCommProps>((props, ref) => {
  const { onSuccess, onFail } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useSafeState(false)
  const [baseFormData, setBaseFormData] = useSafeState<API.SystemRole>()
  const isEdit = !!baseFormData

  const open = (data?: API.SystemRole) => {
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
      const res = await saveSysRoleApi(values)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      // console.log(error)
      onFail?.(error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open, close }), [])

  return (
    <ModalForm
      title='新建角色'
      width={500}
      form={form}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
      <ProFormText name='id' hidden />
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
