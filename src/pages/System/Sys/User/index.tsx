import { AuthButtons } from '@/components'
import { useTable } from '@/hooks'
import { OrgTreeItem } from '@/models/org'
import { querySysUserListAPI } from '@/services/user'
import { classNameBind } from '@/utils/classnamesBind'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Button, Flex } from 'antd'
import React, { useRef } from 'react'
import EditUserModal, { EditUserModalRef } from './components/EditUserModal'
import OrgTree from './components/OrgTree'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  const { ValueEnum } = useModel('dict')
  const { list: roleList, refresh: refreshRoleList } = useModel('role')

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
    api: querySysUserListAPI,
    columns: [
      { title: '关键字', dataIndex: 'key', hideInTable: true },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        fixed: 'left',
        valueEnum: ValueEnum.isActive
      },
      { title: '名称', dataIndex: 'name', search: false },
      { title: '账号', dataIndex: 'account', width: 200, search: false },
      { title: '手机号', dataIndex: 'mobile_phone', width: 160, search: false },
      { title: '邮箱', dataIndex: 'email', width: 200, search: false },
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
            await refreshRoleList()
            return roleList
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
        width: 60,
        renderOperation: (text, record) => {
          return [
            {
              name: '编辑',
              key: 'edit',
              onClick: () => {
                editUserRef.current?.open(record)
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
    tableAlertOptionRender: ({ selectedRows }) => {
      return (
        <AuthButtons
          items={[
            { title: '启用', buttonProps: { type: 'link', size: 'small' } },
            { title: '禁用', buttonProps: { type: 'link', size: 'small' } },
            { title: '编辑', buttonProps: { type: 'link', size: 'small' } }
          ]}
        />
      )
    },
    toolBarRender: () => [
      <Button key='button' icon={<PlusOutlined />} type='primary' onClick={() => editUserRef.current?.open()}>
        新建
      </Button>
    ]
  })

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <OrgTree onSelect={onOrgTreeSelect} />
        <ProTable className={cx('table-container')} {...tableProps} />
      </Flex>
      <EditUserModal ref={editUserRef} key='editUserModal' orgId={orgInfo?.id} onSuccess={onUserSaveSuccess} />
    </PageContainer>
  )
}

export default UserList
