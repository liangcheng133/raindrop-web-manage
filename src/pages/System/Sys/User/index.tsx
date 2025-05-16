import { AuthButtons } from '@/components'
import { AuthButtonsItem } from '@/components/type'
import { useTable } from '@/hooks'
import { OrgTreeItem } from '@/models/org'
import { querySysUserListAPI, updateSysUserStatusAPI } from '@/services/user'
import { antdUtil } from '@/utils/antdUtil'
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

const updateStatusRequest = (ids: string[], status: number) => {
  return updateSysUserStatusAPI({ ids, status })
}

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
      { title: '组织', dataIndex: 'org_name', width: 200, search: false },
      {
        title: '角色',
        dataIndex: 'role_ids',
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
        renderText: (text, record) => record.role_names || ''
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
              hide: record.is_admin === 1,
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
      const itemsRender = ({ buttonProps, ...rest }: AuthButtonsItem): AuthButtonsItem => ({
        buttonProps: { type: 'link', size: 'small', ...buttonProps },
        ...rest
      })

      // 管理员账号不支持修改
      if (selectedRows.some((item) => item.is_admin === 1)) {
        return null
      }
      return (
        <AuthButtons
          items={[
            itemsRender({
              title: '启用',
              onClick: () => {
                antdUtil.modal?.confirm({
                  title: '提示',
                  content: '这些账号将被启用, 是否继续?',
                  onOk: async () => {
                    await updateStatusRequest(
                      selectedRows.map((item) => item.id!),
                      0
                    )
                    antdUtil.message?.success(`启用成功`)
                    tableRef.current?.reload()
                  }
                })
              }
            }),
            itemsRender({
              title: '禁用',
              onClick: () => {
                antdUtil.modal?.confirm({
                  title: '提示',
                  content: '禁用后，这些账号将无法登陆系统, 是否继续?',
                  onOk: async () => {
                    await updateStatusRequest(
                      selectedRows.map((item) => item.id!),
                      1
                    )
                    antdUtil.message?.success(`禁用成功`)
                    tableRef.current?.reload()
                  }
                })
              }
            }),
            itemsRender({ title: '编辑组织' }),
            itemsRender({ title: '编辑角色' })
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
