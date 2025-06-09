import { saveSysUserAPI } from '@/services/user'
import { SysUserSaveDTO, SysUserVO } from '@/types/api'
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
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Button, Form } from 'antd'
import { BaseOptionType } from 'antd/es/select'
import React, { forwardRef, useImperativeHandle } from 'react'

export interface EditUserModalPropsType {
  /** 组织id，不传递时默认顶级组织 */
  orgId?: string
  onSuccess?: () => void
  onFail?: (error: any) => void
}
export interface EditUserModalRefType {
  open: (data?: SysUserVO) => void
}
export interface SysUserFormType extends Omit<SysUserVO, 'role_ids'> {
  role_ids?: string[]
}

/** 新建、编辑用户信息弹框 */
const EditUserModal = forwardRef<EditUserModalRefType, EditUserModalPropsType>((props, ref) => {
  const { onSuccess, orgId } = props

  const { treeList: orgTreeList } = useModel('org')
  const { list: roleList } = useModel('role')
  const [form] = Form.useForm()

  const [baseFormData, setBaseFormData] = useSafeState<SysUserVO>()
  const [visible, setVisible] = useSafeState(false)

  // 是否编辑数据
  const isEdit = !!baseFormData

  const open = (data?: SysUserVO) => {
    const formData: SysUserFormType = {
      status: 0,
      id: '',
      account: '',
      name: '',
      mobile_phone: '',
      email: '',
      org_id: '',
      org_name: '',
      is_admin: 0
    }
    if (data) {
      Object.assign(formData, data, {
        role_ids: data.role_ids?.split(',') ?? []
      })
    } else {
      Object.assign(formData, {
        org_id: orgId ?? '0'
      })
    }
    form.setFieldsValue(formData)
    setBaseFormData(data)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const onOpenChange: ModalFormProps['onOpenChange'] = (visible) => {
    setVisible(visible)
  }

  const onFinish = async (values: SysUserFormType) => {
    try {
      const params: SysUserSaveDTO = {
        ...values,
        role_ids: values.role_ids?.join(',')
      }
      await saveSysUserAPI(params)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.log('[ error ] >', error)
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
      // trigger={trigger}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
      <ProFormText name='id' hidden />
      <ProFormText name='status' hidden />
      <ProFormGroup>
        <ProFormText
          name='account'
          label='用户账号'
          placeholder='请输入用户账号'
          rules={[{ required: true, message: '请输入用户账号' }]}
          width='md'
        />
        {!isEdit && (
          <ProFormText.Password
            name='password'
            label='登录密码'
            placeholder='请输入登录密码'
            rules={[{ required: true, message: '请输入登录密码' }]}
            width='md'
          />
        )}
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
        <ProFormTreeSelect
          name='org_id'
          label='所在组织'
          placeholder='请选择所在组织'
          rules={[{ required: true, message: '请选择所在组织' }]}
          width='md'
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            treeDefaultExpandAll: true,
            treeData: orgTreeList
          }}
        />
        <ProFormSelect
          name='role_ids'
          label='角色'
          placeholder='请选择角色'
          width='md'
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            mode: 'multiple',
            options: roleList as BaseOptionType[]
          }}
        />
      </ProFormGroup>
      <ProFormTextArea name='remark' label='备注' placeholder='请输入备注' />
    </ModalForm>
  )
})

export default EditUserModal
