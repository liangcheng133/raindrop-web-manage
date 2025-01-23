import { IconFont } from '@/components/rd-ui'
import { useTable } from '@/hooks'
import { UseTableColumnsType } from '@/hooks/type'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { Card, Flex, Tree } from 'antd'
import { TreeProps } from 'antd/lib'
import React, { useRef } from 'react'
import CreateDepartmentModal, {
  CreateDepartmentModalProps,
  CreateDepartmentModalRef
} from './components/CreateDepartmentModal'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  const tableRef = useRef<ActionType | null>(null)
  const createDepartmentRef = useRef<CreateDepartmentModalRef>(null)

  // 表格列配置
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
  // 表格配置
  const tableProps = useTable<API.SystemUser, API.SystemUserQuery>({
    actionRef: tableRef,
    api: '/sys/user/list',
    columns: columns
  })

  // 组织架构树数据
  const treeData: TreeProps['treeData'] = [
    {
      title: 'parent 1',
      key: '0-0',
      icon: <IconFont type='icon-team' />,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0'
        }
      ]
    }
  ]
  // 树形点击回调
  const onOrganizationTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    console.log('[ selectedKeys ] >', selectedKeys[0], test)
  }

  // 新增部门成功回调
  const onCreateDepartmentModalSuccess: CreateDepartmentModalProps['onSuccess'] = () => {
    tableRef.current?.reload()
  }
  // 组织架构卡片extra
  const organizationCardExtra = (
    <CreateDepartmentModal ref={createDepartmentRef} onSuccess={onCreateDepartmentModalSuccess} />
  )

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <Card className={cx('organizational-container')} title='组织架构' extra={organizationCardExtra}>
          <Tree defaultExpandAll blockNode showIcon treeData={treeData} onSelect={onOrganizationTreeSelect} />
        </Card>
        <ProTable className={cx('user-table-container')} {...tableProps} />
      </Flex>
    </PageContainer>
  )
}

export default UserList
