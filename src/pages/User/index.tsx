import { useTable } from '@/hooks'
import { UseTableColumnsType } from '@/hooks/type'
import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import React, { useRef } from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const columns: UseTableColumnsType<API.SystemUser>[] = [
  { title: '名称', dataIndex: 'name' },
  { title: '账号', dataIndex: 'account', width: 200 },
  { title: '手机号', dataIndex: 'phone', width: 160 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '创建时间', dataIndex: 'create_time', width: 200 },
  { title: '修改时间', dataIndex: 'update_time', width: 200 },
  {
    valueType: 'option',
    renderOperation: (text, record, index, action, schema) => {
      return [
        {
          name: '编辑',
          key: 'edit',
          onClick: () => {
            console.log('按钮点击事件1')
          }
        },
        {
          name: '编辑4',
          key: 'edit4',
          onClick: () => {
            console.log('按钮点击事件2')
          }
        },
        {
          name: '编辑3',
          key: 'edit3',
          onClick: () => {
            console.log('按钮点击事件3')
          }
        },
        {
          name: '编辑1',
          key: 'edit1',
          onClick: () => {
            console.log('按钮点击事件4')
          }
        }
      ]
    }
  }
]

const UserList: React.FC = () => {
  const tableRef = useRef(null)
  const tableProps = useTable<API.SystemUser, API.SystemUserQuery>({
    actionRef: tableRef,
    api: '/sys/user/list',
    columns: columns
  })
  return (
    <PageContainer ghost>
      <ProTable {...tableProps} />
    </PageContainer>
  )
}

export default UserList
