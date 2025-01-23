import { saveUserInfoApi } from '@/services/User'
import { PlusOutlined } from '@ant-design/icons'
import { ModalForm, ModalFormProps, ProFormGroup, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Button, Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type EditUserModalRef = Omit<ModalComm.ModalCommRef, 'open'> & {
  open: (data?: API.SystemUser) => void
}

/** 新建、编辑用户信息弹框 */
const EditUserModal = forwardRef<EditUserModalRef, ModalComm.ModalCommProps>((props, ref) => {
  const { onSuccess } = props
  const [form] = Form.useForm()
  const [baseFormData, setBaseFormData] = useSafeState<API.SystemUser>()
  const [visible, setVisible] = useSafeState(false)

  const isEdit = !!baseFormData

  const open = (data?: API.SystemUser) => {
    form.setFieldsValue(data)
    setBaseFormData(data)
    setVisible(true)
  }

  const onOpenChange: ModalFormProps['onOpenChange'] = (visible) => {
    setVisible(visible)
  }

  const onFinish: ModalFormProps['onFinish'] = async (values) => {
    console.log('[ values ] >', values)
    return
    try {
      const res = await saveUserInfoApi(values)
      console.log('[ res ] >', res)
      onSuccess?.()
      return true
    } catch (error) {
      console.error('提交失败', error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open }), [])

  const trigger = (
    <Button key='button' icon={<PlusOutlined />} type='primary'>
      新建
    </Button>
  )

  return (
    <ModalForm
      title={isEdit ? '编辑用户' : '新建用户'}
      width={600}
      form={form}
      trigger={trigger}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}>
      <ProFormText name='id' hidden />
      <ProFormGroup>
        <ProFormText
          name='account'
          label='用户账号'
          placeholder='请输入用户账号'
          rules={[{ required: true, message: '请输入用户账号' }]}
        />
        <ProFormText
          name='name'
          label='用户名称'
          placeholder='请输入用户名称'
          rules={[{ required: true, message: '请输入用户名称' }]}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText
          name='mobile_phone'
          label='手机号'
          placeholder='请输入手机号'
          rules={[{ required: true, message: '请输入手机号' }]}
        />
        <ProFormText
          name='email'
          label='邮箱'
          placeholder='请输入邮箱'
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
      </ProFormGroup>
      <ProFormTextArea name='remark' label='备注' placeholder='请输入备注' />
    </ModalForm>
  )
})

export default EditUserModal
