import { useTable, UseTableColumnsType } from '@/hooks'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useSafeState } from 'ahooks'
import { Card, Flex, Tabs, TabsProps } from 'antd'
import React, { useRef } from 'react'
import RoleAuth from './components/RoleAuth'
import RoleDragList from './components/RoleDragList'
import styles from './index.less'

const cx = classNameBind(styles)

const RolePage: React.FC = () => {
  const tableRef = useRef<ActionType>()

  const [roleSelectedInfo, setRoleSelectedInfo] = useSafeState<API.SystemRole>({})

  // 表格列配置
  const columns: UseTableColumnsType<API.SystemUser>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '组织', dataIndex: 'org_name', search: false },
    { title: '角色', dataIndex: 'role_name', width: 140, search: false },
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
  const tableProps = useTable<API.SystemUser>({
    actionRef: tableRef,
    api: '/sys/user/list',
    manualRequest: true,
    columns: columns,
    persistenceColumnsKey: 'sys.user.index',
    handleParams: (params) => {
      return {
        ...params,
        role_id: [roleSelectedInfo.id]
      }
    }
  })

  const tabItems: TabsProps['items'] = [
    { key: '1', label: '角色用户', children: <ProTable {...tableProps} /> },
    { key: '2', label: '角色权限', children: <RoleAuth /> }
  ]

  const handleRoleDragListSelect = (role: API.SystemRole) => {
    setRoleSelectedInfo(role)
    tableRef.current?.reload()
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
