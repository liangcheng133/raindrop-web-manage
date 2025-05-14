import { CardExtraOptions } from '@/components'
import { IconFont } from '@/components/rd-ui'
import { deleteSysRoleAPI, saveSysRoleOrderAPI } from '@/services/role'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { useModel } from '@umijs/max'
import { useSafeState } from 'ahooks'
import { Card, Dropdown, Flex, MenuProps, Spin } from 'antd'
import { cloneDeep } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import React, { forwardRef, useEffect, useRef } from 'react'
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
  onSelect?: (role?: API.SysRoleVO) => void
}

export type RoleDragListRef = Record<string, never>

const cx = classNameBind(styles)

const DropdownOptions: MenuProps['items'] = [
  { key: 'editRole', label: '编辑角色' },
  { key: 'removeRole', label: '删除角色' }
]

/** 角色可拖动排序列表 */
const RoleDragList = forwardRef<RoleDragListRef, RoleDragListProps>((props, ref) => {
  const { onSelect } = props

  const { list: roleListOrigin, loading: getRoleLoading, refresh: refreshRoleList } = useModel('role')

  const roleEditModalRef = useRef<RoleEditModalRef>(null)
  const [selectedInfo, setSelectedInfo] = useSafeState<API.SysRoleVO>({})
  const [roleList, setRoleList] = useSafeState<API.SysRoleVO[]>([])

  useEffect(() => {
    setRoleList(roleListOrigin)
    if (isEmpty(selectedInfo.id)) {
      handleSelect(roleListOrigin[0])
    }
  }, [roleListOrigin])

  useEffect(() => {
    handleSelect(roleListOrigin[0])
  }, [])

  // 处理选中角色
  const handleSelect = (record?: API.SysRoleVO) => {
    if (record) {
      setSelectedInfo(cloneDeep(record))
      onSelect?.(cloneDeep(record))
    }
  }

  // 调整排序
  const onUpdateRoleOrder = (dataList: API.SysRoleVO[]) => {
    const sortRoleList = dataList.map((role, index) => ({ ...role, sort: index + 1 }))
    saveSysRoleOrderAPI(sortRoleList).then((res) => {
      if (res.status !== 0) return
      antdUtil.message?.success('排序成功')
      refreshRoleList(true)
    })
  }

  // 处理下拉菜单点击事件
  const handleDropdownClick = (key: string, record: API.SysRoleVO) => {
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
              await deleteSysRoleAPI({ id: record.id })
              if (record.id === selectedInfo.id) handleSelect(roleList[0])
              antdUtil.message?.success('删除成功')
              refreshRoleList()
            } catch (error) {
              console.log(error)
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
    const items = Array.from(roleList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setRoleList(items)
    onUpdateRoleOrder(items)
  }

  // 处理角色编辑成功事件
  const onRoleEditSuccess = async () => {
    const data = await refreshRoleList(true)
    handleSelect(data[0])
  }

  // 角色卡片extra
  const CardExtraRender = (
    <CardExtraOptions
      items={[
        {
          key: 'add',
          icon: 'icon-plus',
          title: '新增组织',
          onClick: () => {
            roleEditModalRef.current?.open?.()
          }
        },
        {
          key: 'reload',
          icon: 'icon-reload',
          title: '刷新',
          onClick: () => {
            refreshRoleList(true)
          }
        }
      ]}
    />
  )

  return (
    <Card className={cx('organizational-container')} title='角色' extra={CardExtraRender}>
      <Spin spinning={getRoleLoading}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='role-list'>
            {(provided: DroppableProvided) => (
              <div className={cx('role-drag-list-container')} {...provided.droppableProps} ref={provided.innerRef}>
                {roleList.map((role, index) => (
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
                          <span className={cx('suffix')} onClick={(e) => e.stopPropagation()}>
                            <Dropdown
                              menu={{ items: DropdownOptions, onClick: (e) => handleDropdownClick(e.key, role) }}
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

        <RoleEditModal ref={roleEditModalRef} onSuccess={onRoleEditSuccess} />
      </Spin>
    </Card>
  )
})

export default RoleDragList
