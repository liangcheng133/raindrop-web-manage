import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const data: Array<API.SystemUser> = [
  { id: '1', name: '张三' },
  { id: '2', name: '李四' },
  { id: '3', name: '王五' }
]

const column = [
  { title: 'ID', dataIndex: 'id' },
  { title: '名称', dataIndex: 'name' }
]

const UserList: React.FC = () => {
  return (
    <PageContainer ghost>
      <ProTable<API.SystemUser>
        request={() => {
          return Promise.resolve({
            data: data,
            success: true
          })
        }}
        columns={column}
        rowKey="id"
      />
    </PageContainer>
  )
}

export default UserList
