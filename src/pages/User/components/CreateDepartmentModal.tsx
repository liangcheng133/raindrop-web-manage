/*
 * @Date: 2025-01-17 11:04:32
 * @LastEditTime: 2025-01-17 16:49:51
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 新建、编辑部门
 */
import { IconFont } from '@/components/rd-ui'
import { ModalForm, ModalFormProps, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Button, Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type CreateDepartmentModalProps = {
  /** 保存成功后回调 */
  onSuccess?: () => void
}

export type CreateDepartmentModalRef = {
  /** 打开弹框 */
  open: () => void
}

const CreateDepartmentModal = forwardRef<CreateDepartmentModalRef, CreateDepartmentModalProps>((props, ref) => {
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

  useImperativeHandle(
    ref,
    () => {
      return {
        open
      }
    },
    []
  )

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

export default CreateDepartmentModal
