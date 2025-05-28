import { NormalBehaviorType } from '@/types/Type'
import { useAccess } from '@umijs/max'
import { Button, ButtonProps } from 'antd'
import { debounce } from 'es-toolkit'
import React, { MouseEventHandler } from 'react'

export type AuthButtonsItemType = NormalBehaviorType & {
  buttonProps?: Omit<ButtonProps, 'onClick'>
}
export type AuthButtonsPropsType = React.PropsWithChildren & {
  items?: AuthButtonsItemType[]
}
export type ItemClickType<T> = (record: T, index: number) => MouseEventHandler<HTMLDivElement>

/**
 * 按钮组
 * * 可通过传递auth来设定权限（如：sys.user.create）
 */
const AuthButtons: React.FC<AuthButtonsPropsType> = ({ items }) => {
  const access = useAccess()
  const onItemClick: ItemClickType<AuthButtonsItemType> = ({ onClick, key }, index) =>
    debounce(
      (event) => {
        onClick?.(event)
      },
      300,
      { edges: ['leading'] }
    )

  return items
    ?.filter((item) => !item.hide)
    .map((item, index) => {
      if (item.auth && access.checkPermission(item.auth) !== true) {
        return null
      }
      return (
        <Button key={item.key || `authButton_${index}`} {...item.buttonProps} onClick={onItemClick(item, index)}>
          {item.title}
        </Button>
      )
    })
}

export default AuthButtons
