import { useTable, UseTableColumnsType } from '@/hooks'
import { querySysUserListAPI } from '@/services/user'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Flex, Tabs, TabsProps } from 'antd'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import RoleAuth from './components/RoleAuth'
import RoleDragList from './components/RoleDragList'
import styles from './index.less'

const cx = classNameBind(styles)

type UserListTableProps = {
  roleId?: string
}

interface UserListTableRef {
  refresh: () => void
}

/** 根据角色id查询用户列表 */
const UserListTable = forwardRef<UserListTableRef, UserListTableProps>(({ roleId }, ref) => {
  const tableRef = useRef<ActionType>()

  const refresh = () => {
    tableRef.current?.reload()
  }

  useImperativeHandle(ref, () => ({ refresh }), [])

  // 表格列配置
  const columns: UseTableColumnsType<API.SysUserVO>[] = [
    { title: '关键字', dataIndex: 'key', hideInTable: true },
    { title: '名称', dataIndex: 'name', search: false },
    { title: '组织', dataIndex: 'org_name', search: false },
    { title: '角色', dataIndex: 'role_names', width: 140, search: false },
    {
      valueType: 'option',
      renderOperation: (text, record, index, action, colProps) => {
        return [
          {
            name: '编辑',
            key: 'edit',
            onClick: () => {}
          },
          {
            name: '删除',
            key: 'delete',
            type: 'deleteConfirm',
            onClick: async () => {}
          }
        ]
      }
    }
  ]

  // 表格配置
  const tableProps = useTable<API.SysUserVO>({
    actionRef: tableRef,
    api: querySysUserListAPI,
    columns: columns,
    persistenceColumnsKey: 'sys.role.user.index',
    handleParams: (params) => {
      return {
        ...params,
        role_ids: [roleId]
      }
    }
  })
  return <ProTable {...tableProps} />
})

const RolePage: React.FC = () => {
  const [roleSelectedInfo, setRoleSelectedInfo] = useSafeState<API.SysRoleVO>({})
  const userListTableRef = useRef<UserListTableRef>(null)

  const tabItems: TabsProps['items'] = [
    { key: '1', label: '角色用户', children: <UserListTable ref={userListTableRef} roleId={roleSelectedInfo.id} /> },
    { key: '2', label: '角色权限', children: <RoleAuth roleId={roleSelectedInfo.id} /> }
  ]

  const handleRoleDragListSelect = (role?: API.SysRoleVO) => {
    if (role) {
      if (role.id === roleSelectedInfo.id) return
      setRoleSelectedInfo(role)
      userListTableRef.current?.refresh()
    }
  }

  return (
    <PageContainer ghost className={cx('role-list-container')}>
      <Flex gap={16}>
        <RoleDragList onSelect={handleRoleDragListSelect} />
        <Tabs className={cx('tabs-container')} items={tabItems} />
      </Flex>
    </PageContainer>
  )
}

export default RolePage
