import { NormalBehaviorType } from '@/types/Type'
import { classNameBind } from '@/utils/classnamesBind'
import { useAccess } from '@umijs/max'
import { Button, ButtonProps } from 'antd'
import { debounce } from 'es-toolkit'
import React from 'react'
import style from './index.less'

const cx = classNameBind(style)

export type AuthButtonsItemType = NormalBehaviorType & {
  buttonProps?: Omit<ButtonProps, 'onClick'>
  /** 按钮类型
   ** button: 按钮，使用antd Button
   ** link: 链接，使用a标签
   */
  type?: 'button' | 'link'
  render?: () => React.ReactNode
}
export type AuthButtonsPropsType = React.PropsWithChildren & {
  items?: AuthButtonsItemType[]
}
export type ItemClickType<T> = (record: T, index: number) => any

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
      const key = item.key || `authButton_${index}`
      if (item.render) {
        return item.render()
      }
      if (item.type === 'link') {
        return (
          <a className={cx('auth-button-link')} key={key} onClick={onItemClick(item, index)}>
            {item.title}
          </a>
        )
      }
      return (
        <Button key={key} {...item.buttonProps} onClick={onItemClick(item, index)}>
          {item.title}
        </Button>
      )
    })
}

export default AuthButtons
