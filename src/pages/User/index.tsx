import useTable from '@/hooks/useTable'
import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const columns: ProColumns[] = [
  { title: '名称', dataIndex: 'name' },
  { title: '账号', dataIndex: 'account' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '创建时间', dataIndex: 'create_time' },
  { title: '修改时间', dataIndex: 'update_time' },
  { dataIndex: 'operation' }
]

const UserList: React.FC = () => {
  const tableProps = useTable<API.SystemUser, API.SystemUserQuery>({
    api: '/sys/user/list',
    columns: columns,
    scroll: { y: 300 },
    virtual: true
  })
  return (
    <PageContainer ghost>
      <ProTable<API.SystemUser> {...tableProps} />
      
    </PageContainer>
  )
}

export default UserList
