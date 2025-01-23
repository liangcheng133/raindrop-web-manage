import { IconFont } from '@/components/rd-ui'
import { ModalForm, ModalFormProps, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Button, Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

/** 新建、编辑部门弹框 */
const EditDepartmentModal = forwardRef<ModalComm.ModalCommRef, ModalComm.ModalCommProps>((props, ref) => {
  const { onSuccess } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useSafeState(false)

  const trigger = (
    <Button type='link' icon={<IconFont type='icon-plus' />}>
      创建部门
    </Button>
  )

  const open = () => {
    setVisible(true)
  }

  const onOpenChange: ModalFormProps['onOpenChange'] = (visible) => {
    setVisible(visible)
  }

  const onFinish: ModalFormProps['onFinish'] = async (values) => {
    console.log('[ values ] >', values)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess?.()
      return true
    } catch (error) {
      console.error('提交失败', error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open }), [])

  return (
    <ModalForm
      title='新建部门'
      width={500}
      form={form}
      trigger={trigger}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}>
      <ProFormText
        rules={[{ required: true, message: '请输入部门名称' }]}
        name='name'
        label='部门名称'
        tooltip='最长为 24 位'
        placeholder='请输入部门名称'
      />
      <ProFormSelect name='parentId' label='上级部门' placeholder='请选择上级部门' />
    </ModalForm>
  )
})

export default EditDepartmentModal
