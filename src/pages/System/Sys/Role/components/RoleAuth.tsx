import { querySysMenuListAllAPI } from '@/services/menu'
import { listToTree } from '@/utils'
import { classNameBind } from '@/utils/classnamesBind'
import { ProForm, ProFormCheckbox } from '@ant-design/pro-components'
import { useRequest, useSafeState } from 'ahooks'
import { Card } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import React, { forwardRef, ReactNode, useEffect } from 'react'
import styles from '../index.less'

type MenuTreeItemType = API.SysMenuVO & {
  children?: MenuTreeItemType[]
}

type MenuOptionsItemType = Omit<MenuTreeItemType, 'children'> & {
  label: string
  value: string
  children?: MenuOptionsItemType[]
}

const cx = classNameBind(styles)

const queryMenuListAll = async () => {
  const res = await querySysMenuListAllAPI()
  return res.data
}

/** 角色权限配置 */
const RoleAuth = forwardRef((props, ref) => {
  const { data, loading, run, runAsync } = useRequest<API.SysMenuVO[], any[]>(queryMenuListAll, {})

  const [menuOptions, setMenuOptions] = useSafeState<MenuOptionsItemType[]>([])

  const options: CheckboxGroupProps['options'] = [
    { label: '查看详情', value: 'user21321321312' },
    { label: '创建角色', value: '213213' }
  ]

  /** 处理树形选项 */
  const handleOption = (data: MenuTreeItemType[], numbers: Array<string>) => {
    return data.map<MenuOptionsItemType>((item) => {
      const { children, ...rest } = item
      const number = [...numbers, item.id!]
      const value = number.join('-')

      // 构造新对象并递归处理 children
      const result: MenuOptionsItemType = {
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

  /** 处理选项渲染 */
  const handleOptionsRender = (menu: MenuOptionsItemType[]): ReactNode => {
    const renders: ReactNode[] = []

    const loop = (data: MenuOptionsItemType[]) => {
      data.forEach((item) => {
        console.log('[ item ] >', item)
        if (item.type === 1 || item.type === 2) {
          renders.push(
            <ProFormCheckbox key={item.id} name={item.id} formItemProps={{ className: cx('check-node main') }}>
              {item.name}
            </ProFormCheckbox>
          )
        }
        if (item.type === 2) {
          renders.push(
            <ProFormCheckbox.Group
              key={item.id}
              name={item.id}
              formItemProps={{ className: cx('check-node') }}
              options={item.children}
            />
          )
          return
        }
        if (item.children?.length) {
          loop(item.children)
        }
      })
    }

    loop(menu)
    console.log('[ renders ] >', renders)
    return renders
  }

  useEffect(() => {
    if (data) {
      const menuTree = listToTree(data, 'id', 'parentId', '0')
      setMenuOptions(handleOption(menuTree, []))
    }
  }, [data])

  console.log('[ menuOptions ] >', menuOptions)

  return (
    <Card className={cx('role-auth-container')} loading={loading}>
      <ProForm layout='horizontal' submitter={false}>
        {handleOptionsRender(menuOptions)}
        {/* <ProFormCheckbox name='user' formItemProps={{ className: cx('check-node main') }}>
          用户管理
        </ProFormCheckbox>
        <ProFormCheckbox.Group name='user-child' options={options} formItemProps={{ className: cx('check-node') }} /> */}
      </ProForm>
    </Card>
  )
})

export default RoleAuth
