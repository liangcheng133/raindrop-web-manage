import { querySysOrgListAllApi } from '@/services/Org'
import { querySysRoleListAllApi } from '@/services/Role'
import { saveSysUserApi } from '@/services/User'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { PlusOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ModalFormProps,
  ProFormGroup,
  ProFormSelect,
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
        org_id: orgId || null
      })
    }
    setVisible(visible)
  }

  const onFinish = async (values: API.SystemUser) => {
    try {
      const res = await saveSysUserApi(values)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.log(error)
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
      width={800}
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
          width='md'
        />
        <ProFormText
          name='name'
          label='用户名称'
          placeholder='请输入用户名称'
          rules={[{ required: true, message: '请输入用户名称' }]}
          width='md'
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText
          name='mobile_phone'
          label='手机号'
          placeholder='请输入手机号'
          rules={[{ required: true, message: '请输入手机号' }]}
          width='md'
        />
        <ProFormText
          name='email'
          label='邮箱'
          placeholder='请输入邮箱'
          rules={[{ required: true, message: '请输入邮箱' }]}
          width='md'
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormSelect
          name='role_ids'
          label='角色'
          placeholder='请选择角色'
          rules={[{ required: true, message: '请选择角色' }]}
          width='md'
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            mode: 'multiple'
          }}
          request={async () => {
            try {
              const res = await querySysRoleListAllApi()
              return res.data
            } catch (error) {
              return []
            }
          }}
        />
        <ProFormTreeSelect
          name='org_id'
          label='所在组织'
          placeholder='请选择所在组织'
          rules={[{ required: true, message: '请选择所在组织' }]}
          width='md'
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            treeDefaultExpandAll: true
          }}
          request={async () => {
            try {
              const res = await querySysOrgListAllApi()
              return listToTree(res.data)
            } catch (error) {
              return []
            }
          }}
        />
      </ProFormGroup>
      <ProFormTextArea name='remark' label='备注' placeholder='请输入备注' />
    </ModalForm>
  )
})

export default EditUserModal
