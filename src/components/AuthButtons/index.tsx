import { Button, ButtonProps } from 'antd'
import React, { MouseEventHandler } from 'react'

type AuthButtonsItems = {
  key?: string
  title?: string
  hide?: boolean
  buttonProps?: ButtonProps
  onClick?: MouseEventHandler<HTMLDivElement>
}

type AuthButtonsProps = React.PropsWithChildren & {
  items?: AuthButtonsItems[]
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ items }) => {
  return items?.map((item, index) => (
    <Button key={item.key || `authButton_${index}`} {...item.buttonProps}>
      {item.title}
    </Button>
  ))
}

export default AuthButtons
