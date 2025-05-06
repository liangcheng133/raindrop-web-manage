import { useTable } from '@/hooks'
import { OrgTreeItem } from '@/models/org'
import { querySysRoleListAllAPI } from '@/services/role'
import { deleteSysUserAPI, getSysUserListAPI } from '@/services/user'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Flex, Space } from 'antd'
import React, { useRef } from 'react'
import EditUserModal, { EditUserModalRef } from './components/EditUserModal'
import OrgTree from './components/OrgTree'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  const { ValueEnum } = useModel('dict')

  const tableRef = useRef<ActionType>()
  const editUserRef = useRef<EditUserModalRef>(null)

  const [orgInfo, setOrgInfo] = useSafeState<OrgTreeItem | undefined>() // 选中的组织

  /** 设置树形选中项并更新列表 */
  const onOrgTreeSelect = (node?: OrgTreeItem) => {
    setOrgInfo(node)
    tableRef.current?.reload()
  }

  /** 处理编辑用户成功回调 */
  const onUserSaveSuccess = () => {
    tableRef.current?.reload()
  }

  /** 表格配置 */
  const tableProps = useTable<API.SysUserVO>({
    actionRef: tableRef,
    api: getSysUserListAPI,
    columns: [
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        fixed: 'left',
        valueEnum: ValueEnum.isActive
      },
      { title: '名称', dataIndex: 'name' },
      { title: '账号', dataIndex: 'account', width: 200 },
      { title: '手机号', dataIndex: 'mobile_phone', width: 160 },
      { title: '邮箱', dataIndex: 'email', width: 200 },
      {
        title: '角色',
        dataIndex: 'role_id',
        width: 140,
        valueType: 'select',
        fieldProps: {
          fieldNames: { value: 'id', label: 'name' },
          mode: 'multiple'
        },
        request: async () => {
          try {
            const res = await querySysRoleListAllAPI()
            return res.data
          } catch (error) {
            console.log(error)
            return []
          }
        },
        renderText: (text, record) => record.role_name || ''
      },
      { title: '创建时间', dataIndex: 'create_time', width: 200, search: false },
      { title: '修改时间', dataIndex: 'update_time', width: 200, search: false },
      {
        valueType: 'option',
        renderOperation: (text, record) => {
          return [
            {
              name: '编辑',
              key: 'edit',
              onClick: () => {
                editUserRef.current?.open(record)
              }
            },
            {
              name: '删除',
              key: 'delete',
              type: 'deleteConfirm',
              onClick: async () => {
                try {
                  await deleteSysUserAPI({ id: record.id })
                  antdUtil.message?.success('删除成功')
                  tableRef.current?.reload()
                } catch (error) {
                  console.log(error)
                }
              }
            }
          ]
        }
      }
    ],
    persistenceColumnsKey: 'sys.user.index',
    handleParams: (params) => {
      return {
        ...params,
        org_id: orgInfo?.id
      }
    },
    rowSelection: {},
    tableAlertOptionRender: () => {
      return (
        <Space size={16}>
          <a>编辑角色</a>
          <a>重置部门</a>
        </Space>
      )
    },
    toolBarRender: () => [
      <EditUserModal ref={editUserRef} key='editUserModal' orgId={orgInfo?.id} onSuccess={onUserSaveSuccess} />
    ]
  })

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <OrgTree onSelect={onOrgTreeSelect} />
        <ProTable className={cx('table-container')} {...tableProps} />
      </Flex>
    </PageContainer>
  )
}

export default UserList
