import { saveSysUserAPI } from '@/services/user'
import { SysUserVO } from '@/types/api.zod'
import { ModalFormOnFinishType, ModalFormOnOpenChangeType } from '@/types/type'
import { antdUtil } from '@/utils/antdUtil'
import { ModalForm, ProFormSelect, ProFormTreeSelect } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Form } from 'antd'
import { BaseOptionType } from 'antd/es/select'
import { pick } from 'es-toolkit'
import React, { forwardRef, useImperativeHandle } from 'react'

export type EditOrgOrRoleModalActionType = {
  data: SysUserVO
  /**
   * 编辑类型
   * * org：编辑组织 role：编辑角色
   */
  type: 'org' | 'role'
}
export type EditOrgOrRoleModalRefType = {
  open: (action: EditOrgOrRoleModalActionType) => void
  close: () => void
}
export type EditOrgOrRoleModalPropsType = {
  onSuccess?: () => void
}
export type FormType = {
  id: string
  org_id: string
  role_ids: string[]
}

/** 编辑用户的组织或角色弹框 */
const EditOrgOrRoleModal = forwardRef<EditOrgOrRoleModalRefType, EditOrgOrRoleModalPropsType>(({ onSuccess }, ref) => {
  const { list: roleList } = useModel('role')
  const { treeList: orgTreeList } = useModel('org')
  const [form] = Form.useForm()

  const [visible, setVisible] = useSafeState(false)
  const [action, setAction] = useSafeState<EditOrgOrRoleModalActionType>()

  const open = (action: EditOrgOrRoleModalActionType) => {
    const formData: FormType = {
      ...pick(action.data, ['id', 'org_id']),
      role_ids: action.data.role_ids?.split(',') ?? []
    }

    form.setFieldsValue(formData)
    setAction(action)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const onOpenChange: ModalFormOnOpenChangeType = (visible) => {
    setVisible(visible)
  }

  useImperativeHandle(ref, () => ({ open, close }), [])

  const onFinish: ModalFormOnFinishType = async (values) => {
    try {
      const params: SysUserVO = {
        ...action?.data,
        ...values
      }
      if (action?.type === 'role') {
        params.role_ids = values.role_ids?.join(',')
      }

      await saveSysUserAPI(params)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  return (
    <ModalForm
      title={`编辑${{ org: '组织', role: '角色' }[action?.type ?? 'role']}`}
      width={500}
      form={form}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
      {action?.type === 'org' && (
        <ProFormTreeSelect
          name='org_id'
          label='所在组织'
          placeholder='请选择所在组织'
          rules={[{ required: true, message: '请选择所在组织' }]}
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            treeDefaultExpandAll: true,
            treeData: orgTreeList
          }}
        />
      )}
      {action?.type === 'role' && (
        <ProFormSelect
          name='role_ids'
          label='角色'
          placeholder='请选择角色'
          fieldProps={{
            fieldNames: { value: 'id', label: 'name' },
            mode: 'multiple',
            options: roleList as BaseOptionType[]
          }}
        />
      )}
    </ModalForm>
  )
})

export default EditOrgOrRoleModal
