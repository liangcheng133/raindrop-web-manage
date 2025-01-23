import React from 'react'
import { classNameBind } from '@/utils/classnamesBind'
import styles from './index.less'

const cx = classNameBind(styles)

const ItemsList: React.FC<React.PropsWithChildren> = (props) => {
  return <div> 这是 ItemsList 组件 </div>
}

export default ItemsList
