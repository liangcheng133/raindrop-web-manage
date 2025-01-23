import { IconFont } from '@/components/rd-ui'
import { useTable, UseTableColumnsType } from '@/hooks'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { Card, Flex, Tree, TreeProps } from 'antd'
import React, { useRef } from 'react'
import EditDepartmentModal from './components/EditDepartmentModal'
import EditUserModal, { EditUserModalRef } from './components/EditUserModal'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  const tableRef = useRef<ActionType | null>(null)
  const createDepartmentRef = useRef<ModalComm.ModalCommRef>(null)
  const editUserRef = useRef<EditUserModalRef>(null)

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
    console.log('[ selectedKeys ] >', selectedKeys[0])
  }

  // 新增部门成功回调
  const onEditDepartmentModalSuccess: ModalComm.ModalCommProps['onSuccess'] = () => {
    tableRef.current?.reload()
  }

  // 表格列配置
  const columns: UseTableColumnsType<API.SystemUser>[] = [
    { title: '名称', dataIndex: 'name' },
    { title: '账号', dataIndex: 'account', width: 200 },
    { title: '手机号', dataIndex: 'phone', width: 160 },
    { title: '邮箱', dataIndex: 'email', width: 200 },
    { title: '创建时间', dataIndex: 'create_time', width: 200, search: false },
    { title: '修改时间', dataIndex: 'update_time', width: 200, search: false },
    {
      valueType: 'option',
      renderOperation: (text, record, index, action, colProps) => {
        return [
          {
            name: '编辑',
            key: 'edit',
            onClick: () => {
              editUserRef.current?.open(record)
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
  const tableProps = useTable<API.SystemUser>({
    actionRef: tableRef,
    api: '/sys/user/list',
    columns: columns,
    toolBarRender: () => [<EditUserModal ref={editUserRef} />]
  })
  // 组织架构卡片extra
  const organizationCardExtra = (
    <EditDepartmentModal ref={createDepartmentRef} onSuccess={onEditDepartmentModalSuccess} />
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
