import { Button } from 'antd'
import { debounce } from 'es-toolkit'
import React from 'react'
import { AuthButtonsItem, AuthButtonsProps, ItemClickType } from '../type'

const AuthButtons: React.FC<AuthButtonsProps> = ({ items }) => {
  const onItemClick: ItemClickType<AuthButtonsItem> = ({ onClick, key }, index) =>
    debounce(
      (event) => {
        onClick?.(event)
      },
      300,
      { edges: ['leading'] }
    )

  return items?.map((item, index) => (
    <Button key={item.key || `authButton_${index}`} {...item.buttonProps} onClick={onItemClick(item, index)}>
      {item.title}
    </Button>
  ))
}

export default AuthButtons
