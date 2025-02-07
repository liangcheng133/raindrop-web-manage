import { classNameBind } from '@/utils/classnamesBind'
import { isPromise } from '@/utils/validate'
import { useSetState } from 'ahooks'
import { Spin, Tooltip } from 'antd'
import React, { MouseEventHandler } from 'react'
import { IconFont } from '../rd-ui'
import styles from './index.less'

type CardExtraOptionsItem = {
  key: string
  /** tooltip 的内容 */
  title: string
  icon: string
  hide?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

type CardExtraOptionsProps = React.PropsWithChildren & {
  items: CardExtraOptionsItem[]
}

type ItemClickType = (record: CardExtraOptionsItem, event: React.MouseEvent<HTMLDivElement>) => void

type LoadingsType = { [key: string]: boolean }

const cx = classNameBind(styles)

/** 卡片额外区操作栏 */
const CardExtraOptions: React.FC<CardExtraOptionsProps> = ({ items }) => {
  const [loadings, setLoadings] = useSetState<LoadingsType>({})

  const onItemClick: ItemClickType = ({ onClick, key }, event) => {
    const res = onClick?.(event)
    if (isPromise(res)) {
      setLoadings({ [key]: true })
      res.finally(() => {
        setLoadings({ [key]: false })
      })
    }
  }

  return (
    <div className={cx('card-extra-options-container')}>
      {items.map((item) => {
        return (
          <div className={item.hide ? 'hideDom' : ''} key={item.key}>
            <Tooltip title={item.title}>
              <Spin spinning={!!loadings[item.key]}>
                <div className={cx('card-extra-options-item')} onClick={(e) => onItemClick(item, e)}>
                  <IconFont type={item.icon} />
                </div>
              </Spin>
            </Tooltip>
          </div>
        )
      })}
    </div>
  )
}

export default CardExtraOptions
