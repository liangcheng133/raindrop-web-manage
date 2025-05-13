import { querySysMenuListAllAPI } from '@/services/menu'
import { listToTree } from '@/utils'
import { classNameBind } from '@/utils/classnamesBind'
import { ProForm, ProFormCheckbox } from '@ant-design/pro-components'
import { useRequest, useSafeState } from 'ahooks'
import { Button, Card, Form } from 'antd'
import { CheckboxChangeEvent, CheckboxGroupProps } from 'antd/es/checkbox'
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

  const [form] = Form.useForm()

  const [menuOptions, setMenuOptions] = useSafeState<MenuOptionsItemType[]>([])
  const [refreshTime, setRefreshTime] = useSafeState(0)

  const options: CheckboxGroupProps['options'] = [
    { label: '查看详情', value: 'user21321321312' },
    { label: '创建角色', value: '213213' }
  ]

  /** 保存 */
  const onSubmit = () => {
    console.log('[ onSubmit ] >', form.getFieldsValue())
  }

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

  /** 处理选项变化 */
  const handleCheckChange = (e: CheckboxChangeEvent, item: MenuOptionsItemType) => {
    // target
    console.log('[ e, item ] >', e, item)
    const checked = e.target.checked
    const values: Record<string, boolean> = {}
    const loop = (data?: MenuOptionsItemType[]) => {
      data?.forEach((child) => {
        values[child.value] = checked
        if (child.children && child.children.length) {
          loop(child.children)
        }
      })
    }
    loop(item.children)
    setRefreshTime(Date.now())
    handleChecked()
    form.setFieldsValue(values)
  }

  const handleChecked = () => {
    const values = form.getFieldsValue()
    const loop = (data?: MenuOptionsItemType[]) => {
      // data?.forEach((item) => {
      //   if ([1, 2].includes(item.type!)) {
      //     values[item.value] = item.children?.every((fItem) => values[fItem.value])
      //     console.log(item.value, item.children?.every((fItem) => values[fItem.value]))
      //     loop(item.children)
      //   }
      // })
    }
    loop(menuOptions)
    console.log('[ values ] >', values)
  }

  /** 获取checkbox的是否选中但未全选状态 */
  const getCheckboxProps = (item: MenuOptionsItemType) => {
    const values = form.getFieldsValue()
    const keys: Record<string, boolean> = {}
    item.children?.forEach((item) => {
      keys[item.value] = values[item.value] || false
    })
    const indeterminate = Object.keys(keys).some((key) => values[key])
    const checkedAll = Object.keys(keys).every((key) => values[key])

    return {
      indeterminate: checkedAll ? false : indeterminate,
      checked: checkedAll
    }
  }

  /** 处理选项渲染 */
  const handleOptionsRender = (menu: MenuOptionsItemType[]): ReactNode => {
    const renders: ReactNode[] = []

    const loop = (data: MenuOptionsItemType[]) => {
      data.forEach((item) => {
        if (item.type === 1 || item.type === 2) {
          renders.push(
            <ProFormCheckbox
              key={item.value}
              name={item.value}
              formItemProps={{ className: cx('check-node main') }}
              fieldProps={{
                ...getCheckboxProps(item),
                onChange: (e) => handleCheckChange(e, item)
              }}>
              {item.name}
            </ProFormCheckbox>
          )
        }
        if (item.type === 3) {
          renders.push(
            <ProFormCheckbox
              key={item.value}
              name={item.value}
              formItemProps={{ className: cx('check-node') }}
              fieldProps={{ onChange: (e) => handleCheckChange(e, item) }}>
              {item.name}
            </ProFormCheckbox>
          )
          return
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

      // 表单默认值
      const values: Record<string, boolean> = {}
      const loop = (data?: MenuOptionsItemType[]) => {
        data?.forEach((item) => {
          values[item.value] = false
          if (item.children?.length) {
            loop(item.children)
          }
        })
      }
      loop(menuOptions)
      form.setFieldsValue(values)
    }
  }, [data])

  return (
    <Card className={cx('role-auth-container')} loading={loading}>
      <div className={cx('header-options')}>
        <Button type='primary' onClick={onSubmit}>
          保存
        </Button>
      </div>
      <ProForm form={form} layout='horizontal' submitter={false}>
        {handleOptionsRender(menuOptions)}
      </ProForm>
    </Card>
  )
})

export default RoleAuth
