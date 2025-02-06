import { CardExtraOptions } from '@/components'
import { useTable, UseTableColumnsType } from '@/hooks'
import { querySysOrgListAll } from '@/services/Org'
import { deleteSysUserApi } from '@/services/User'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Card, Empty, Flex, Spin, Tree, TreeProps } from 'antd'
import React, { useRef } from 'react'
import EditOrgModal from './components/EditOrgModal'
import EditUserModal, { EditUserModalRef } from './components/EditUserModal'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  const tableRef = useRef<ActionType>()
  const editOrgModalRef = useRef<ModalComm.ModalCommRef>(null)
  const editUserRef = useRef<EditUserModalRef>(null)

  // 组织架构数据
  const orgListData = useRef<API.SystemOrg[]>([])
  const selectOrgId = useRef<string>()
  const {
    data: orgTreeData,
    loading: getOrgListDataLoading,
    run: getOrgListData
  } = useRequest(() => {
    return new Promise<TreeProps['treeData']>((resolve, reject) => {
      querySysOrgListAll().then((res) => {
        const data = res.data
        orgListData.current = data
        resolve(listToTree(data))
      })
    })
  })

  // 树形选中回调
  const onOrgTreeSelect: TreeProps['onSelect'] = (selectedKeys, { node, selected }) => {
    selectOrgId.current = selected ? (node as API.SystemOrg).id : undefined
    tableRef.current?.reload()
  }

  // 处理编辑组织成功回调
  const handleOrgSaveSuccess = () => {
    getOrgListData()
    editOrgModalRef.current?.close()
  }

  // 处理编辑用户成功回调
  const handleUserSaveSuccess = () => {
    tableRef.current?.reload()
  }

  // 表格列配置
  const columns: UseTableColumnsType<API.SystemUser>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      fixed: 'left',
      valueEnum: {
        0: {
          text: '启用',
          status: 'Success'
        },
        1: {
          text: '禁用',
          status: 'Error'
        }
      }
    },
    { title: '名称', dataIndex: 'name' },
    { title: '账号', dataIndex: 'account', width: 200 },
    { title: '手机号', dataIndex: 'mobile_phone', width: 160 },
    { title: '邮箱', dataIndex: 'email', width: 200 },
    { title: '角色', dataIndex: 'role_name', width: 140 },
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
            name: '删除',
            key: 'delete',
            type: 'deleteConfirm',
            onClick: async () => {
              await deleteSysUserApi({ id: record.id })
              antdUtil.message?.success('删除成功')
              tableRef.current?.reload()
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
    persistenceColumnsKey: 'sys.user.index',
    handleParams: (params) => {
      return {
        ...params,
        org_id: selectOrgId.current
      }
    },
    toolBarRender: () => [<EditUserModal ref={editUserRef} onSuccess={handleUserSaveSuccess} />]
  })

  // 组织架构卡片extra
  const orgCardExtra = (
    <CardExtraOptions
      items={[
        {
          key: 'add',
          icon: 'icon-plus',
          title: '新增组织',
          onClick: () => {
            editOrgModalRef.current?.open?.()
          }
        },
        {
          key: 'reload',
          icon: 'icon-reload',
          title: '刷新',
          onClick: () => {
            getOrgListData()
          }
        }
      ]}
    />
  )

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <Card className={cx('org-container')} title='组织架构' extra={orgCardExtra}>
          {orgTreeData?.length ? (
            <Spin spinning={getOrgListDataLoading}>
              <Tree
                defaultExpandAll
                blockNode
                showIcon
                showLine
                titleRender={(nodeData) => {
                  const data = nodeData as API.SystemOrg & { children: API.SystemOrg[] }
                  return <div>{data.name}</div>
                }}
                treeData={orgTreeData}
                fieldNames={{ key: 'id' }}
                onSelect={onOrgTreeSelect}
              />
            </Spin>
          ) : getOrgListDataLoading ? (
            <Spin className={cx('spin-placeholder')} />
          ) : (
            <Empty />
          )}
        </Card>
        <ProTable className={cx('table-container')} {...tableProps} />
      </Flex>

      <EditOrgModal ref={editOrgModalRef} onSuccess={handleOrgSaveSuccess} />
    </PageContainer>
  )
}

export default UserList
