import { AuthButtons, AuthButtonsItemType } from '@/components'
import { useTable } from '@/hooks'
import { OrgTreeItemType } from '@/models/org'
import { querySysUserListAPI, updateSysUserStatusAPI } from '@/services/user'
import { SysUserVOType } from '@/types/API'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { PlusOutlined } from '@ant-design/icons'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Flex } from 'antd'
import React, { useRef } from 'react'
import EditOrgOrRoleModal, { EditOrgOrRoleModalRefType } from './components/EditOrgOrRoleModal'
import EditUserModal, { EditUserModalRefType } from './components/EditUserModal'
import OrgTree from './components/OrgTree'
import styles from './index.less'

const cx = classNameBind(styles)

const updateStatusRequest = (ids: string[], status: number) => {
  return updateSysUserStatusAPI({ ids, status })
}

const UserPageIndex: React.FC = () => {
  const { ValueEnum } = useModel('dict')

  const tableRef = useRef<ActionType>()
  const editOrgOrRoleRef = useRef<EditOrgOrRoleModalRefType>(null)
  const editUserRef = useRef<EditUserModalRefType>(null)

  const [orgInfo, setOrgInfo] = useSafeState<OrgTreeItemType | undefined>() // 选中的组织
  const [searchValue, setSearchValue] = useSafeState<string>() // 表格关键字查询

  /** 设置树形选中项并更新列表 */
  const onOrgTreeSelect = (node?: OrgTreeItemType) => {
    setOrgInfo(node)
    tableRef.current?.reload()
  }

  /** 处理成功回调 */
  const handleOnSuccess = () => {
    tableRef.current?.reload()
  }

  /** 表格配置 */
  const { config: tableProps } = useTable<SysUserVOType, any>({
    api: querySysUserListAPI,
    persistenceColumnsKey: 'sys.user.index',
    rowSelection: {},
    columns: [
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
      { title: '组织', dataIndex: 'org_name', width: 140, search: false },
      { title: '角色', dataIndex: 'role_names', width: 140, search: false },
      { title: '创建时间', dataIndex: 'create_time', width: 170, search: false },
      { title: '修改时间', dataIndex: 'update_time', width: 170, search: false },
      { title: '创建人', dataIndex: 'create_time1', width: 160, search: false },
      { title: '修改人', dataIndex: 'update_time1', width: 160, search: false },
      {
        title: '操作',
        dataIndex: 'option',
        width: 60,
        fixed: 'right',
        render: (_, record) => {
          return (
            <AuthButtons
              items={[
                {
                  title: '编辑',
                  type: 'link',
                  auth: 'sys.user.edit',
                  hide: record.is_admin === 1,
                  onClick: () => editUserRef.current?.open(record)
                }
              ]}
            />
          )
        }
      }
    ],
    handleParams: (params) => {
      return {
        ...params,
        key: searchValue,
        org_id: orgInfo?.id
      }
    },
    tableAlertOptionRender: ({ selectedRows }) => {
      const itemsRender = ({ buttonProps, ...rest }: AuthButtonsItemType): AuthButtonsItemType => ({
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
              auth: 'sys.user.status',
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
              auth: 'sys.user.status',
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
            itemsRender({
              title: '编辑组织',
              auth: 'sys.user.edit',
              hide: selectedRows.length > 1,
              onClick: () => {
                editOrgOrRoleRef.current?.open({ data: selectedRows[0], type: 'org' })
              }
            }),
            itemsRender({
              title: '编辑角色',
              auth: 'sys.user.edit',
              hide: selectedRows.length > 1,
              onClick: () => {
                editOrgOrRoleRef.current?.open({ data: selectedRows[0], type: 'role' })
              }
            })
          ]}
        />
      )
    },
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
    toolBarRender: () => [
      <AuthButtons
        items={[
          {
            title: '新建',
            auth: 'sys.user.create',
            buttonProps: {
              type: 'primary',
              icon: <PlusOutlined />
            },
            onClick: () => editUserRef.current?.open()
          }
        ]}
      />
    ]
  })

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <OrgTree onSelect={onOrgTreeSelect} />
        <ProTable className={cx('table-container')} {...tableProps} />
      </Flex>
      <EditUserModal ref={editUserRef} orgId={orgInfo?.id} onSuccess={handleOnSuccess} />
      <EditOrgOrRoleModal ref={editOrgOrRoleRef} onSuccess={handleOnSuccess} />
    </PageContainer>
  )
}

export default UserPageIndex
