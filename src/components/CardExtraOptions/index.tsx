import { classNameBind } from '@/utils/classnamesBind'
import { Tooltip } from 'antd'
import React from 'react'
import { IconFont } from '../rd-ui'
import styles from './index.less'

const cx = classNameBind(styles)

type CardExtraOptionsItem = {
  key: string
  /** tooltip 的内容 */
  title: string
  icon: string
  onClick?: () => void
}

type CardExtraOptionsProps = React.PropsWithChildren & {
  items: CardExtraOptionsItem[]
}

/** 卡片额外区操作栏 */
const CardExtraOptions: React.FC<CardExtraOptionsProps> = ({ items }) => {
  return (
    <div className={cx('card-extra-options-container')}>
      {items.map((item) => {
        return (
          <Tooltip title={item.title} key={item.key}>
            <div className={cx('card-extra-options-item')}>
              <IconFont type={item.icon} onClick={item.onClick} />
            </div>
          </Tooltip>
        )
      })}
    </div>
  )
}

export default CardExtraOptions
