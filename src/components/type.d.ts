import { NormalBehaviorType } from '@/types/Type'
import React from 'react'

export type CardExtraOptionsItem = NormalBehaviorType & {
  icon: string
}
export type CardExtraOptionsProps = React.PropsWithChildren & {
  items: CardExtraOptionsItem[]
}

export type LoadingObjType = { [key: string]: boolean }
