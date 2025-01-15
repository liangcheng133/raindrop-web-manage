import useTable, { UseTableColumnsType } from '@/hooks/useTable'
import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const columns: UseTableColumnsType<API.SystemUser>[] = [
  { title: '名称', dataIndex: 'name' },
  { title: '账号', dataIndex: 'account', width: 200 },
  { title: '手机号', dataIndex: 'phone', width: 120 },
  { title: '邮箱', dataIndex: 'email', width: 200 },
  { title: '创建时间', dataIndex: 'create_time', width: 200 },
  { title: '修改时间', dataIndex: 'update_time', width: 200 },
  {
    type: 'operation',
    renderOperation: (text, record, index, action, schema) => {
      console.log('[ record ] >', record)
      return [
        {
          label: '编辑',
          key: 'edit',
          icon: <i className={cx('iconfont', 'icon-edit')} />,
          onClick: () => {
            console.log('按钮点击事件')
          }
        },
        {
          label: '编辑1',
          key: 'edit1',
          icon: <i className={cx('iconfont', 'icon-edit')} />,
          onClick: () => {
            console.log('按钮点击事件')
          }
        }
      ]
    }
  }
]

const UserList: React.FC = () => {
  const tableProps = useTable<API.SystemUser, API.SystemUserQuery>({
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
