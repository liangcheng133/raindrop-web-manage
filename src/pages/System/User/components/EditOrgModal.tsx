import { querySysOrgListAllApi, saveSysOrgApi } from '@/services/Org'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { ModalForm, ModalFormProps, ProFormText, ProFormTreeSelect } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Form } from 'antd'
import React, { forwardRef, useImperativeHandle } from 'react'

/** 新建、编辑组织弹框 */
const EditOrgModal = forwardRef<ModalComm.ModalCommRef, ModalComm.ModalCommProps>((props, ref) => {
  const { onSuccess, onFail } = props
  const [form] = Form.useForm()
  const [visible, setVisible] = useSafeState(false)

  const open = () => {
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
      const res = await saveSysOrgApi(values)
      antdUtil.message?.success('保存成功')
      onSuccess?.()
      return true
    } catch (error) {
      console.error('提交失败', error)
      onFail?.(error)
      return false
    }
  }

  useImperativeHandle(ref, () => ({ open, close }), [])

  return (
    <ModalForm
      title='新建组织'
      width={500}
      form={form}
      // trigger={trigger}
      open={visible}
      onFinish={onFinish}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}>
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
        initialValue='0'
        placeholder='请选择上级组织'
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
    </ModalForm>
  )
})

export default EditOrgModal
