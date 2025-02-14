import { CardExtraOptions } from '@/components'
import { IconFont } from '@/components/rd-ui'
import { deleteSysRoleApi, querySysRoleListAllApi, saveSysRoleOrderApi } from '@/services/Role'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { useRequest, useSafeState } from 'ahooks'
import { Card, Dropdown, Flex, MenuProps, Spin } from 'antd'
import { cloneDeep } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import React, { forwardRef, useRef } from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd'
import styles from '../index.less'
import RoleEditModal, { RoleEditModalRef } from './RoleEditModal'

export type RoleDragListProps = {
  /** 选中角色回调 */
  onSelect?: (role: API.SystemRole) => void
}

export type RoleDragListRef = {}

const cx = classNameBind(styles)

const DropdownOptions: MenuProps['items'] = [
  { key: 'editRole', label: '编辑角色' },
  { key: 'removeRole', label: '删除角色' }
]

/** 角色可拖动排序列表 */
const RoleDragList = forwardRef<RoleDragListRef, RoleDragListProps>((props, ref) => {
  const { onSelect } = props

  const roleEditModalRef = useRef<RoleEditModalRef>(null)
  const [selectedInfo, setSelectedInfo] = useSafeState<API.SystemRole>({})

  const {
    data: roleDataList,
    mutate: setRoleDataList,
    loading: refreshRoleDataListLoading,
    run: refreshRoleDataList
  } = useRequest(() => {
    return new Promise<API.SystemRole[]>(async (resolve, reject) => {
      try {
        const res = await querySysRoleListAllApi()
        const data = res.data.sort((a, b) => a.order! - b.order!)
        if (isEmpty(selectedInfo) && data.length) {
          handleSelect(data[0])
        }
        resolve(data)
      } catch (error) {
        // console.log(error)
        resolve([])
      }
    })
  })

  // 调整排序
  const setRoleOrder = (dataList: API.SystemRole[]) => {
    const roleList = dataList.map((role, index) => ({ ...role, order: index + 1 }))
    saveSysRoleOrderApi(roleList).then((res) => {
      if (res.status !== 0) return
      antdUtil.message?.success('保存成功')
      refreshRoleDataList()
    })
  }

  // 处理选中角色
  const handleSelect = (record: API.SystemRole) => {
    setSelectedInfo(cloneDeep(record))
    onSelect && onSelect(cloneDeep(record))
  }

  // 处理下拉菜单点击事件
  const handleDropdownClick = ({ key }: { key: string }, record: API.SystemRole) => {
    switch (key) {
      case 'editRole':
        roleEditModalRef.current?.open(record)
        break
      case 'removeRole':
        antdUtil.modal?.confirm({
          title: '提示',
          content: `此操作将删除角色【${record.name}】，确定删除？`,
          onOk: async () => {
            try {
              await deleteSysRoleApi({ id: record.id })
              if (record.id === selectedInfo.id) handleSelect(roleDataList![0])
              antdUtil.message?.success('删除成功')
              refreshRoleDataList()
            } catch (error) {
              // console.log(error)
            }
          }
        })
        break
    }
  }

  // 处理拖动结束事件
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    const items = Array.from(roleDataList || [])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setRoleDataList(items)
    setRoleOrder(items)
  }

  // 组织架构卡片extra
  const orgCardExtra = roleDataList?.length ? (
    <CardExtraOptions
      items={[
        {
          key: 'add',
          icon: 'icon-plus',
          title: '新增组织',
          onClick: (e) => {
            roleEditModalRef.current?.open?.()
          }
        },
        {
          key: 'reload',
          icon: 'icon-reload',
          title: '刷新',
          onClick: refreshRoleDataList
        }
      ]}
    />
  ) : null

  return (
    <Card className={cx('organizational-container')} title='角色' extra={orgCardExtra}>
      <Spin spinning={refreshRoleDataListLoading}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='role-list'>
            {(provided: DroppableProvided) => (
              <div className={cx('role-drag-list-container')} {...provided.droppableProps} ref={provided.innerRef}>
                {roleDataList?.map((role, index) => (
                  <Draggable key={role.id} draggableId={role.id!} index={index}>
                    {(provided: DraggableProvided) => (
                      <div
                        className={cx('role-drag-list-item')}
                        onClick={() => handleSelect(role)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        <Flex className={cx('content', selectedInfo.id === role.id && 'active')}>
                          <span className={cx('label')}>{role.name}</span>
                          <span onClick={(e) => e.stopPropagation()}>
                            <Dropdown
                              menu={{ items: DropdownOptions, onClick: (e) => handleDropdownClick(e, role) }}
                              placement='bottomLeft'
                              trigger={['click']}>
                              <IconFont className={cx('dropdown-btn')} type='icon-setting-fill' />
                            </Dropdown>
                          </span>
                        </Flex>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <RoleEditModal ref={roleEditModalRef} onSuccess={refreshRoleDataList} />
      </Spin>
    </Card>
  )
})

export default RoleDragList
