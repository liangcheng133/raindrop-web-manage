import { saveSysOrgAPI } from '@/services/org'
import { ModalFormOnFinishType, ModalFormOnOpenChangeType } from '@/types/Type'
import { antdUtil } from '@/utils/antdUtil'
import { ModalForm, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

export type EditOrgModalPropsType = {
  /** 组织id，不传递时默认顶级组织 */
  orgId?: string
  onSuccess?: () => void
  onFail?: (error: any) => void
}
export type EditOrgModalRefType = {
  /**
   * 打开弹框
   * @param {*} data 编辑数据，传递时则为编辑模式
   */
  open: (data?: API.SysOrgVO) => void
  close: () => void
}

/** 新建、编辑组织弹框 */
const EditOrgModal = forwardRef<EditOrgModalRefType, EditOrgModalPropsType>(({ onSuccess, onFail, orgId }, ref) => {
  const [form] = Form.useForm()
  const { treeList: orgTreeList } = useModel('org')

  const [visible, setVisible] = useSafeState(false)
  const [baseFormData, setBaseFormData] = useSafeState<API.SysOrgVO>()
  const isEdit = !!baseFormData?.id

  const open = (data?: API.SysOrgVO) => {
    form.setFieldsValue(data)
    setBaseFormData(data)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const onOpenChange: ModalFormOnOpenChangeType = (visible) => {
    if (!isEdit) {
      form.setFieldsValue({
        parent_id: orgId || orgTreeList[0].id
      })
    }
    setVisible(visible)
  }

  const onFinish: ModalFormOnFinishType = async (values) => {
    try {
      await saveSysOrgAPI(values)
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
      title={isEdit ? '编辑组织' : '新建组织'}
      width={500}
      form={form}
      // trigger={trigger}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true, forceRender: true }}>
      <ProFormText name='id' hidden />
      <ProFormText name='sort' hidden />
      <ProFormText
        rules={[{ required: true, message: '请输入组织名称' }]}
        name='name'
        label='组织名称'
        tooltip='最长为 24 位'
        placeholder='请输入组织名称'
      />
      <ProFormTreeSelect
        rules={[{ required: true, message: '请选择上级组织' }]}
        name='parent_id'
        label='上级组织'
        placeholder='请选择上级组织'
        fieldProps={{
          fieldNames: { label: 'name', value: 'id' },
          treeDefaultExpandAll: true,
          treeData: orgTreeList
        }}
      />
    </ModalForm>
  )
})

export default EditOrgModal
