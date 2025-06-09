import { CardExtraOptions, IconFont } from '@/components'
import { ORG_ID_MAIN } from '@/constants'
import { deleteSysOrgAPI, sortSysOrgOrderAPI } from '@/services/org'
import { SysOrgTreeVO, SysOrgVO } from '@/types/api'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Card, Dropdown, Empty, MenuProps, Spin, Tree, TreeProps } from 'antd'
import { cloneDeep } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import React, { useEffect, useRef } from 'react'
import styles from '../index.less'
import EditOrgModal, { EditOrgModalRefType } from './EditOrgModal'

interface OrgTreeNode extends Omit<SysOrgTreeVO, 'children'> {
  /** 数据不需要写入key，Tree组件会自己写入一个uuid */
  key: string
  children?: OrgTreeNode[]
}
export type OrgTreePropsType = React.PropsWithChildren & {
  /** 选中树节点回调 */
  onSelect?: (node?: SysOrgTreeVO) => void
}
export type OrgUpdateOrderParamType = {
  id?: string
  parent_id?: string
  sort?: number
}

const cx = classNameBind(styles)

const orgTreeTitleOptions: MenuProps['items'] = [
  { key: 'createChildOrg', label: '创建子组织' },
  { key: 'editOrg', label: '编辑组织' },
  { key: 'removeOrg', label: '删除组织' }
]

/** 系统组织树 */
const OrgTree: React.FC<OrgTreePropsType> = ({ onSelect }) => {
  const { treeList: orgTreeList, loading: refreshOrgLoading, refresh: refreshOrgList } = useModel('org')

  const [isOrgTreeDrop, setIsOrgTreeDrop] = useSafeState<boolean>(false) // 是否使用组织树拖曳
  const [selectOrgId, setSelectOrgId] = useSafeState<string>() // 选中的组织id
  const [orgTreeListCopy, setOrgTreeListCopy] = useSafeState<OrgTreeNode[]>([]) // 组织树数据

  const editOrgModalRef = useRef<EditOrgModalRefType>(null)

  useEffect(() => {
    setOrgTreeListCopy(orgTreeList as OrgTreeNode[])
  }, [orgTreeList])

  /** 处理树形拖曳结束回调 */
  const onOrgDrop: TreeProps['onDrop'] = (info) => {
    if (!orgTreeListCopy) return
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (
      data: SysOrgTreeVO[],
      key: React.Key,
      callback: (node: SysOrgTreeVO, i: number, data: SysOrgTreeVO[]) => void
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

    const data = cloneDeep(orgTreeListCopy)

    let dragObj: SysOrgTreeVO
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
      let ar: SysOrgTreeVO[] = []
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
    setOrgTreeListCopy(data)
  }

  /** 处理节点设置是否可拖动 */
  const handleOrgTreeDraggable: TreeProps['draggable'] = (nodeData: any) => {
    const data = nodeData as SysOrgTreeVO
    if (data.id === ORG_ID_MAIN) return false // 根节点不允许拖动
    return isOrgTreeDrop
  }

  /** 设置选中的组织id并回调 */
  const setSelectOrgIdAndCallback = (node?: SysOrgTreeVO) => {
    setSelectOrgId(node?.id)
    onSelect?.(node)
  }

  /** 处理树形选中回调 */
  const onOrgTreeSelect: TreeProps['onSelect'] = (selectedKeys, { node, selected }) => {
    if (isOrgTreeDrop) return
    setSelectOrgIdAndCallback(selected ? (node as any) : undefined)
  }

  /** 处理编辑组织成功回调 */
  const onOrgSaveSuccess = () => {
    refreshOrgList(true)
  }

  /** 保存组织树排序 */
  const saveOrgTreeOrder = async () => {
    try {
      const data: OrgUpdateOrderParamType[] = []
      // 递归树，并且更新排序
      const loop = (orgList: SysOrgTreeVO[], parent_id: string) => {
        orgList.forEach((item, index) => {
          data.push({
            id: item.id,
            parent_id: parent_id,
            sort: index + 1
          })
          if (item.children?.length) {
            loop(item.children, item.id!)
          }
        })
      }
      loop(orgTreeListCopy, '0')

      await sortSysOrgOrderAPI(data)

      antdUtil.message?.success('排序成功')
      setIsOrgTreeDrop(false)
      refreshOrgList(true)
    } catch (error) {
      console.log('error', error)
    }
  }

  /** 处理节点设置下拉菜单点击回调 */
  const onOrgTreeTitleClick = ({ key }: { key: string }, record: SysOrgTreeVO) => {
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
              await deleteSysOrgAPI(record.id!)
              antdUtil.message?.success('删除成功')
              refreshOrgList(true)
            } catch (error) {
              console.log(error)
            }
          }
        })
        break
    }
  }

  /** 处理节点标题渲染 */
  const handleOrgTreeTitleRender: TreeProps['titleRender'] = (nodeData) => {
    const data = nodeData as unknown as SysOrgVO
    return (
      <div className={cx('tree-title')}>
        <span className={cx('tree-title-txt')}> {data.name}</span>
        {data.id !== ORG_ID_MAIN && (
          <span onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{ items: orgTreeTitleOptions, onClick: (e) => onOrgTreeTitleClick(e, data) }}
              placement='bottomLeft'
              trigger={['click']}>
              <IconFont className={cx('tree-title-icon', isOrgTreeDrop && 'hide')} type='icon-setting-fill' />
            </Dropdown>
          </span>
        )}
      </div>
    )
  }

  /** 组织架构卡片extra */
  const orgCardExtraRender = !isEmpty(orgTreeListCopy) ? (
    <CardExtraOptions
      items={[
        {
          key: 'dropFail',
          icon: 'icon-close',
          title: '取消',
          hide: !isOrgTreeDrop,
          onClick: () => {
            // setOrgTreeList(oldOrgTreeData.current)
            setOrgTreeListCopy(orgTreeListCopy)
            setIsOrgTreeDrop(false)
          }
        },
        {
          key: 'dropSuccess',
          icon: 'icon-check',
          title: '确认',
          hide: !isOrgTreeDrop,
          onClick: async () => {
            saveOrgTreeOrder()
          }
        },
        {
          key: 'add',
          icon: 'icon-plus',
          title: '新增组织',
          hide: isOrgTreeDrop,
          onClick: () => {
            editOrgModalRef.current?.open()
          }
        },
        {
          key: 'sort',
          icon: 'icon-sort',
          title: '排序',
          hide: isOrgTreeDrop,
          onClick: () => {
            if (orgTreeListCopy) {
              setIsOrgTreeDrop(true)
            }
          }
        },
        {
          key: 'reload',
          icon: 'icon-reload',
          title: '刷新',
          hide: isOrgTreeDrop,
          onClick: () => refreshOrgList(true)
        }
      ]}
    />
  ) : null

  return (
    <>
      <Card
        className={cx('org-container')}
        title='组织架构'
        extra={orgCardExtraRender}
        styles={{
          body: {
            height: 'calc(100% - 48px)',
            overflowX: 'auto'
          }
        }}>
        {!isEmpty(orgTreeListCopy) ? (
          <Spin spinning={refreshOrgLoading}>
            {/* 配合defaultExpandAll，刷新之后展开全部 */}
            {!refreshOrgLoading && (
              <Tree<OrgTreeNode>
                defaultExpandAll
                showIcon
                blockNode
                showLine
                draggable={handleOrgTreeDraggable}
                titleRender={handleOrgTreeTitleRender}
                selectedKeys={[selectOrgId || '']}
                treeData={orgTreeListCopy}
                fieldNames={{ key: 'id', title: 'name' }}
                onSelect={onOrgTreeSelect}
                onDrop={onOrgDrop}
              />
            )}
          </Spin>
        ) : refreshOrgLoading ? (
          <Spin className={cx('spin-placeholder')} />
        ) : (
          <Empty />
        )}
      </Card>
      <EditOrgModal ref={editOrgModalRef} orgId={selectOrgId} onSuccess={onOrgSaveSuccess} />
    </>
  )
}

export default OrgTree
