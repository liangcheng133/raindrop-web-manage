import { querySysMenuListAllAPI } from '@/services/menu'
import { saveRoleMenuAPI } from '@/services/roleMenu'
import { SysMenuVO, SysRoleMenuSaveDTO } from '@/types/api'
import { listToTree } from '@/utils'
import { antdUtil } from '@/utils/antdUtil'
import { classNameBind } from '@/utils/classnamesBind'
import { useBoolean, useRequest, useSafeState } from 'ahooks'
import { Button, Card, Checkbox, Spin } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { ReactNode, useEffect } from 'react'
import styles from '../index.less'

export interface MenuTreeItem extends SysMenuVO {
  children?: MenuTreeItem[]
}
export interface MenuOptionsItem extends Omit<MenuTreeItem, 'children'> {
  label: string
  value: string
  children?: MenuOptionsItem[]
}
export type RoleAuthPropsType = React.FC<{ roleId?: string }>

const cx = classNameBind(styles)

const queryMenuListAll = (roleIds?: String[]) => {
  return async () => {
    const res = await querySysMenuListAllAPI({ role_ids: roleIds })
    return res.data
  }
}

/** 角色权限配置 */
const RoleAuth: RoleAuthPropsType = ({ roleId }) => {
  const { data, loading, runAsync } = useRequest(queryMenuListAll(roleId ? [roleId] : []), {
    refreshDeps: [roleId]
  })

  const [menuOptions, setMenuOptions] = useSafeState<MenuOptionsItem[]>([])
  const [formData, setFormData] = useSafeState<Record<string, boolean>>({})
  const [saveLoading, { toggle, setTrue: setSaveLoadingTrue, setFalse: setSaveLoadingFalse }] = useBoolean(false)

  /** 保存 */
  const onSubmit = async () => {
    try {
      if (!roleId) {
        throw new Error('请选择角色')
      }

      setSaveLoadingTrue()
      const menuIds: string[] = []
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          const ids = key.split('-')
          menuIds.push(ids[ids.length - 1])
        }
      })
      const values: SysRoleMenuSaveDTO = {
        role_id: roleId,
        menu_ids: menuIds.join(',')
      }

      await saveRoleMenuAPI(values)
      setSaveLoadingFalse()
      antdUtil.message?.success('保存成功')
      runAsync()
    } catch (error) {
      setSaveLoadingFalse()
      antdUtil.message?.error('保存失败')
      throw error
    }
  }

  /** 处理树形选项 */
  const handleOption = (data: MenuTreeItem[], numbers: string[]): MenuOptionsItem[] => {
    return data.map((item) => {
      const { children, ...rest } = item
      const number = [...numbers, item.id!]
      const value = number.join('-')

      const result: MenuOptionsItem = {
        ...rest,
        label: item.name!,
        value
      }

      if (children && children.length > 0) {
        result.children = handleOption(children, number)
      }

      return result
    })
  }

  /** 处理选项变化 */
  const handleCheckChange = (e: CheckboxChangeEvent, item: MenuOptionsItem) => {
    const checked = e.target.checked
    const values = { ...formData }
    const loop = (data?: MenuOptionsItem[]) => {
      data?.forEach((child) => {
        values[child.value] = checked
        if (child.children?.length) loop(child.children)
      })
    }

    if ([1, 2].includes(item.type!)) {
      loop(item.children)
    } else if (item.type === 3) {
      values[item.value] = checked
    }
    setFormData(values)
    handleChecked(values)
  }

  const handleChecked = (values: Record<string, boolean> = formData) => {
    const loop = (data?: MenuOptionsItem[]) => {
      if (!data) return

      data.forEach((item) => {
        if (item.children?.length) {
          loop(item.children)

          const allChildrenChecked = item.children.every((child) => values[child.value])

          values[item.value] = allChildrenChecked
          // 只更新父级选中状态
          setFormData((prev) => ({
            ...prev,
            [item.value]: allChildrenChecked
          }))
        }
      })
    }

    loop(menuOptions)
  }

  /** 获取checkbox的是否选中但未全选状态 */
  const getCheckboxProps = (item: MenuOptionsItem) => {
    const keys: Record<string, boolean> = {}
    item.children?.forEach((child) => {
      keys[child.value] = formData[child.value] || false
    })

    const hasSomeChecked = Object.values(keys).some((val) => val)
    const hasAllChecked = Object.values(keys).every((val) => val)

    return {
      indeterminate: hasSomeChecked && !hasAllChecked,
      checked: hasAllChecked
    }
  }

  const renderMenuOptions = (menu: MenuOptionsItem[]): ReactNode => {
    const renders: ReactNode[] = []

    const loop = (data: MenuOptionsItem[]) => {
      data.forEach((item) => {
        if ([1, 2].includes(item.type!)) {
          renders.push(
            <div key={item.value} className={cx('check-node', 'main')}>
              <Checkbox {...getCheckboxProps(item)} onChange={(e) => handleCheckChange(e, item)}>
                {item.name}
              </Checkbox>
            </div>
          )
        }
        if (item.type === 3) {
          renders.push(
            <div key={item.value} className={cx('check-node')}>
              <Checkbox checked={formData[item.value]} onChange={(e) => handleCheckChange(e, item)}>
                {item.name}
              </Checkbox>
            </div>
          )
        }
        if (item.children?.length) {
          loop(item.children)
        }
      })
    }
    loop(menu)
    return renders
  }

  useEffect(() => {
    if (data) {
      const menuTree = listToTree(data, 'id', 'parentId', '0')
      const menuOptions = handleOption(menuTree, [])
      setMenuOptions(menuOptions)

      const initValues: Record<string, boolean> = {}

      const loop = (data?: MenuOptionsItem[]) => {
        data?.forEach((item) => {
          initValues[item.value] = item.auth === 1
          if (item.children?.length) loop(item.children)
        })
      }

      loop(menuOptions)
      setFormData(initValues)
    }
  }, [data])

  return (
    <Card className={cx('role-auth-container')} loading={loading}>
      <div className={cx('header-options')}>
        <Button type='primary' loading={saveLoading} onClick={onSubmit}>
          保存
        </Button>
      </div>
      <Spin spinning={saveLoading}>
        <div className={cx('auth-form-container')}>{renderMenuOptions(menuOptions)}</div>
      </Spin>
    </Card>
  )
}

export default RoleAuth
