import { querySysOrgListAllApi } from '@/services/Org'
import { saveSysUserInfoApi } from '@/services/User'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ModalFormProps,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Button, Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type EditUserModalProps = ModalComm.ModalCommProps & {
  /** 组织id，不传递时默认顶级组织 */
  orgId?: string
}

export type EditUserModalRef = Omit<ModalComm.ModalCommRef, 'open'> & {
  open: (data?: API.SystemUser) => void
}

/** 新建、编辑用户信息弹框 */
const EditUserModal = forwardRef<EditUserModalRef, EditUserModalProps>((props, ref) => {
  const { onSuccess, orgId } = props
  const [form] = Form.useForm()
  const [baseFormData, setBaseFormData] = useSafeState<API.SystemUser>()
  const [visible, setVisible] = useSafeState(false)

  const isEdit = !!baseFormData

  const open = (data?: API.SystemUser) => {
    form.setFieldsValue(data)
    setBaseFormData(data)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const onOpenChange: ModalFormProps['onOpenChange'] = (visible) => {
    if (!isEdit) {
      form.setFieldsValue({
        org_id: orgId || '0'
      })
    }
    setVisible(visible)
  }

  const onFinish = async (values: API.SystemUser) => {
    try {
      const res = await saveSysUserInfoApi(values)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.error('提交失败', error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open, close }), [])

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
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
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
      <ProFormTreeSelect
        rules={[{ required: true, message: '请选择所在组织' }]}
        name='org_id'
        label='所在组织'
        initialValue='0'
        placeholder='请选择所在组织'
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
          treeDefaultExpandAll: true
        }}
        request={async () => {
          const res = await querySysOrgListAllApi()
          if (!res.data) return []
          return [{ name: '顶级', id: '0', children: listToTree(res.data) }]
        }}
      />
      <ProFormTextArea name='remark' label='备注' placeholder='请输入备注' />
    </ModalForm>
  )
})

export default EditUserModal
