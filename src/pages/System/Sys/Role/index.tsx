import { useTable, UseTableColumnsType } from '@/hooks'
import { querySysUserListAPI } from '@/services/user'
import { SysRoleVO, SysUserVO } from '@/types/api'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Flex, Tabs, TabsProps } from 'antd'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import EditOrgOrRoleModal, { EditOrgOrRoleModalRefType } from '../User/components/EditOrgOrRoleModal'
import RoleAuth from './components/RoleAuth'
import RoleDragList from './components/RoleDragList'
import styles from './index.less'

type UserListTablePropsType = {
  roleId?: string
}
type UserListTableRefType = {
  refresh: () => void
}

const cx = classNameBind(styles)

/** 根据角色id查询用户列表 */
const UserListTable = forwardRef<UserListTableRefType, UserListTablePropsType>(({ roleId }, ref) => {
  const tableRef = useRef<ActionType>()
  const editOrgOrRoleRef = useRef<EditOrgOrRoleModalRefType>(null)

  const [searchValue, setSearchValue] = useSafeState<string>() // 表格关键字查询

  const refresh = () => {
    tableRef.current?.reload()
  }

  useImperativeHandle(ref, () => ({ refresh }), [])

  // 表格列配置
  const columns: UseTableColumnsType<SysUserVO>[] = [
    { title: '名称', dataIndex: 'name', search: false },
    { title: '组织', dataIndex: 'org_name', search: false },
    { title: '角色', dataIndex: 'role_names', width: 140, search: false },
    {
      valueType: 'option',
      width: 100,
      renderOperation: (text, record, index, action, colProps) => {
        return [
          {
            name: '编辑',
            key: 'edit',
            hide: record.is_admin === 1,
            onClick: () => {
              editOrgOrRoleRef.current?.open({ data: record, type: 'role' })
            }
          }
        ]
      }
    }
  ]

  // 表格配置
  const { config: tableProps } = useTable<SysUserVO, any>({
    actionRef: tableRef,
    api: querySysUserListAPI,
    columns: columns,
    persistenceColumnsKey: 'sys.role.user.index',
    toolbar: {
      search: {
        allowClear: true,
        placeholder: '名称/账号/手机号/邮箱',
        onSearch: (value: string) => {
          setSearchValue(value)
          tableRef.current?.reload()
        }
      }
    },
    handleParams: (params) => {
      return {
        ...params,
        key: searchValue,
        role_id: roleId
      }
    }
  })
  return (
    <>
      <ProTable className={cx('table-container')} {...tableProps} />
      <EditOrgOrRoleModal ref={editOrgOrRoleRef} onSuccess={refresh} />
    </>
  )
})

const RolePageIndex: React.FC = () => {
  const [roleSelectedInfo, setRoleSelectedInfo] = useSafeState<SysRoleVO>()
  const userListTableRef = useRef<UserListTableRefType>(null)

  const tabItems: TabsProps['items'] = [
    // { key: '1', label: '角色用户', children: <UserListTable ref={userListTableRef} roleId={roleSelectedInfo?.id} /> },
    { key: '2', label: '角色权限', children: <RoleAuth roleId={roleSelectedInfo?.id} /> }
  ]

  const handleRoleDragListSelect = (role?: SysRoleVO) => {
    if (role) {
      if (role.id === roleSelectedInfo?.id) return
      setRoleSelectedInfo(role)
      userListTableRef.current?.refresh()
    }
  }

  return (
    <PageContainer ghost className={cx('role-list-container')}>
      <Flex className={cx('flex-container')} gap={16}>
        <RoleDragList onSelect={handleRoleDragListSelect} />
        <Tabs className={cx('tabs-container')} items={tabItems} />
      </Flex>
    </PageContainer>
  )
}

export default RolePageIndex
