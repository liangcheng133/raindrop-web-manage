import { CardExtraOptions } from '@/components'
import { IconFont } from '@/components/rd-ui'
import { useTable, UseTableColumnsType } from '@/hooks'
import { deleteSysOrgApi, querySysOrgListAllApi, saveSysOrgOrderApi } from '@/services/Org'
import { querySysRoleListAllApi } from '@/services/Role'
import { deleteSysUserApi } from '@/services/User'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components'
import { useRequest, useSafeState } from 'ahooks'
import { Card, Dropdown, Empty, Flex, MenuProps, Spin, Tree, TreeProps } from 'antd'
import { cloneDeep } from 'es-toolkit'
import React, { useRef } from 'react'
import EditOrgModal, { EditOrgModalRef } from './components/EditOrgModal'
import EditUserModal, { EditUserModalRef } from './components/EditUserModal'
import styles from './index.less'

type OrgTreeNodeType = API.SystemOrg & {
  children?: API.SystemOrg[]
}

type OrgUpdateOrderType = {
  id?: string
  parent_id?: string
  order?: number
}

const cx = classNameBind(styles)

const orgTreeTitleOptions: MenuProps['items'] = [
  { key: 'createChildOrg', label: '创建子组织' },
  { key: 'editOrg', label: '编辑组织' },
  { key: 'removeOrg', label: '删除组织' }
]

const UserList: React.FC = () => {
  const tableRef = useRef<ActionType>()
  const editOrgModalRef = useRef<EditOrgModalRef>(null)
  const editUserRef = useRef<EditUserModalRef>(null)

  const [isOrgTreeDrop, setIsOrgTreeDrop] = useSafeState<boolean>(false) // 是否使用组织树拖曳

  // 组织架构数据
  const orgListData = useRef<API.SystemOrg[]>([]) // 组织列表数据
  const oldOrgTreeData = useRef<OrgTreeNodeType[]>([]) // 旧组织树数据，在排序取消时，重新设置回来
  const [selectOrgId, setSelectOrgId] = useSafeState<string>() // 选中的组织id
  const {
    data: orgTreeData,
    mutate: setOrgTreeData,
    loading: refreshOrgListLoading,
    run: refreshOrgList
  } = useRequest(() => {
    return new Promise<OrgTreeNodeType[]>(async (resolve, reject) => {
      try {
        const res = await querySysOrgListAllApi()
        const sortFn = (list: OrgTreeNodeType[]): OrgTreeNodeType[] => {
          return list
            .map((item) => {
              const newItem: OrgTreeNodeType = { ...item }
              if (item.children?.length) {
                newItem.children = sortFn(item.children)
              }
              return newItem
            })
            .sort((a, b) => {
              return a.order! - b.order!
            })
        }
        const treeData = sortFn(listToTree(res.data))
        orgListData.current = res.data
        oldOrgTreeData.current = treeData
        resolve(treeData)
      } catch (error) {
        resolve([])
      }
    })
  })

  // 处理节点设置为可拖动
  const handleOrgTreeDraggable: TreeProps['draggable'] = (nodeData) => {
    if ((nodeData as OrgTreeNodeType).id === 'root_1111') return false // 根节点不允许拖动
    return isOrgTreeDrop
  }

  // 处理节点标题渲染
  const handleOrgTreeTitleRender: TreeProps['titleRender'] = (nodeData) => {
    const data = nodeData as OrgTreeNodeType
    return (
      <div className={cx('tree-title')}>
        <span className={cx('tree-title-txt')}> {data.name}</span>
        <span onClick={(e) => e.stopPropagation()}>
          <Dropdown
            menu={{ items: orgTreeTitleOptions, onClick: (e) => onOrgTreeTitleClick(e, data) }}
            placement='bottomLeft'
            trigger={['click']}>
            <IconFont className={cx('tree-title-icon', isOrgTreeDrop && 'hide')} type='icon-setting-fill' />
          </Dropdown>
        </span>
      </div>
    )
  }

  // 处理节点设置下拉菜单点击回调
  const onOrgTreeTitleClick = ({ key }: { key: string }, record: OrgTreeNodeType) => {
    switch (key) {
      case 'createChildOrg':
        setSelectOrgId(record.id)
        editOrgModalRef.current?.open()
        break
      case 'editOrg':
        editOrgModalRef.current?.open(record)
        break
      case 'removeOrg':
        antdUtil.modal?.confirm({
          title: '提示',
          content: `此操作将删除组织【${record.name}】及其子组织，确定删除？`,
          onOk: async () => {
            try {
              const res = await deleteSysOrgApi({ id: record.id })
              antdUtil.message?.success('删除成功')
              refreshOrgList()
            } catch (error) {
              // console.log(error)
            }
          }
        })
        break
    }
  }

  // 处理树形拖曳结束回调
  const onOrgDrop: TreeProps['onDrop'] = (info) => {
    if (!orgTreeData) return
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (
      data: OrgTreeNodeType[],
      key: React.Key,
      callback: (node: OrgTreeNodeType, i: number, data: OrgTreeNodeType[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback)
        }
      }
    }

    const data = cloneDeep(orgTreeData) as OrgTreeNodeType[]

    let dragObj: OrgTreeNodeType
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })
    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        item.children.unshift(dragObj)
      })
    } else {
      let ar: OrgTreeNodeType[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!)
      } else {
        ar.splice(i! + 1, 0, dragObj!)
      }
    }
    setOrgTreeData(data)
  }

  // 处理树形选中回调
  const onOrgTreeSelect: TreeProps['onSelect'] = (selectedKeys, { node, selected }) => {
    if (isOrgTreeDrop) return
    setSelectOrgId(selected ? (node as API.SystemOrg).id : undefined)
    tableRef.current?.reload()
  }

  // 处理编辑组织成功回调
  const onOrgSaveSuccess = () => {
    refreshOrgList()
  }

  // 处理编辑用户成功回调
  const onUserSaveSuccess = () => {
    tableRef.current?.reload()
  }

  // 表格列配置
  const columns: UseTableColumnsType<API.SystemUser>[] = [
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      fixed: 'left',
      valueEnum: new Map().set(0, { text: '启用', status: 'Success' }).set(1, { text: '禁用', status: 'Default' })
    },
    { title: '名称', dataIndex: 'name' },
    { title: '账号', dataIndex: 'account', width: 200 },
    { title: '手机号', dataIndex: 'mobile_phone', width: 160 },
    { title: '邮箱', dataIndex: 'email', width: 200 },
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
          const res = await querySysRoleListAllApi()
          return res.data
        } catch (error) {
          // console.log(error)
          return []
        }
      },
      renderText: (text, record) => record.role_name || ''
    },
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
              try {
                const res = await deleteSysUserApi({ id: record.id })
                antdUtil.message?.success('删除成功')
                tableRef.current?.reload()
              } catch (error) {
                // console.log(error)
              }
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
        org_id: selectOrgId
      }
    },
    toolBarRender: () => [<EditUserModal ref={editUserRef} orgId={selectOrgId} onSuccess={onUserSaveSuccess} />]
  })

  // 组织架构卡片extra
  const orgCardExtra = orgTreeData?.length ? (
    <CardExtraOptions
      items={[
        {
          key: 'dropFail',
          icon: 'icon-close',
          title: '取消',
          hide: !isOrgTreeDrop,
          onClick: () => {
            setOrgTreeData(oldOrgTreeData.current)
            setIsOrgTreeDrop(false)
          }
        },
        {
          key: 'dropSuccess',
          icon: 'icon-check',
          title: '确认',
          hide: !isOrgTreeDrop,
          onClick: async () => {
            try {
              const data: OrgUpdateOrderType[] = []
              const loop = (orgList: OrgTreeNodeType[], parent_id: string) => {
                orgList.forEach((item, index) => {
                  data.push({
                    id: item.id,
                    parent_id: parent_id,
                    order: index + 1
                  })
                  if (item.children?.length) {
                    loop(item.children, item.id!)
                  }
                })
              }
              loop(orgTreeData, '0')
              const res = await saveSysOrgOrderApi(data)
              antdUtil.message?.success('排序成功')
              setIsOrgTreeDrop(false)
              refreshOrgList()
            } catch (error) {
              // console.log(error)
            }
          }
        },
        {
          key: 'add',
          icon: 'icon-plus',
          title: '新增组织',
          hide: isOrgTreeDrop,
          onClick: (e) => {
            editOrgModalRef.current?.open?.()
          }
        },
        {
          key: 'sort',
          icon: 'icon-sort',
          title: '排序',
          hide: isOrgTreeDrop,
          onClick: () => {
            if (orgTreeData) {
              setIsOrgTreeDrop(true)
              oldOrgTreeData.current = cloneDeep(orgTreeData)
            }
          }
        },
        {
          key: 'reload',
          icon: 'icon-reload',
          title: '刷新',
          hide: isOrgTreeDrop,
          onClick: refreshOrgList
        }
      ]}
    />
  ) : null

  return (
    <PageContainer ghost className={cx('user-list-container')}>
      <Flex gap={16}>
        <Card
          className={cx('org-container')}
          title='组织架构'
          extra={orgCardExtra}
          styles={{
            body: {
              height: 'calc(100% - 48px)',
              overflowX: 'auto'
            }
          }}>
          {orgTreeData?.length ? (
            <Spin spinning={refreshOrgListLoading}>
              <Tree
                defaultExpandAll
                showIcon
                blockNode
                showLine
                draggable={handleOrgTreeDraggable}
                titleRender={handleOrgTreeTitleRender}
                selectedKeys={[selectOrgId || '']}
                treeData={orgTreeData as TreeProps['treeData']}
                fieldNames={{ key: 'id', title: 'name' }}
                onSelect={onOrgTreeSelect}
                onDrop={onOrgDrop}
              />
            </Spin>
          ) : refreshOrgListLoading ? (
            <Spin className={cx('spin-placeholder')} />
          ) : (
            <Empty />
          )}
        </Card>
        <ProTable className={cx('table-container')} {...tableProps} />
      </Flex>

      <EditOrgModal ref={editOrgModalRef} orgId={selectOrgId} onSuccess={onOrgSaveSuccess} />
    </PageContainer>
  )
}

export default UserList
