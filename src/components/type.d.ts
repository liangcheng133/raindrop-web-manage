import { ButtonProps } from 'antd'
import React, { MouseEventHandler } from 'react'

export type NormalBehaviorType = {
  key?: string
  title?: string
  hide?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

export type AuthButtonsItem = NormalBehaviorType & {
  buttonProps?: Omit<ButtonProps, 'onClick'>
}

export type AuthButtonsProps = React.PropsWithChildren & {
  items?: AuthButtonsItem[]
}

export type CardExtraOptionsItem = NormalBehaviorType & {
  icon: string
}

export type CardExtraOptionsProps = React.PropsWithChildren & {
  items: CardExtraOptionsItem[]
}

export type ItemClickType<T> = (record: T, index: number) => MouseEventHandler<HTMLDivElement>

export type LoadingObjType = { [key: string]: boolean }
