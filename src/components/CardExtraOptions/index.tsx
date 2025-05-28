import { NormalBehaviorType } from '@/types/Type'
import { classNameBind } from '@/utils/classnamesBind'
import { isPromise } from '@/utils/validate'
import { useSetState } from 'ahooks'
import { Spin, Tooltip } from 'antd'
import { debounce } from 'es-toolkit'
import React, { MouseEventHandler } from 'react'
import { IconFont } from '../rd-ui'
import styles from './index.less'

export type CardExtraOptionsItem = NormalBehaviorType & {
  icon: string
}
export type CardExtraOptionsProps = React.PropsWithChildren & {
  items: CardExtraOptionsItem[]
}
export type LoadingObjType = { [key: string]: boolean }
export type ItemClickType<T> = (record: T, index: number) => MouseEventHandler<HTMLDivElement>

const cx = classNameBind(styles)

const getKey = (index: number, key?: string) => key || `cardExtraButton_${index}`

/** 卡片额外区操作栏 */
const CardExtraOptions: React.FC<CardExtraOptionsProps> = ({ items }) => {
  const [loadings, setLoadings] = useSetState<LoadingObjType>({})

  const onItemClick: ItemClickType<CardExtraOptionsItem> = ({ onClick, key }, index) =>
    debounce(
      (event) => {
        {
          const res = onClick?.(event)
          if (isPromise(res)) {
            setLoadings({ [getKey(index, key)]: true })
            res.finally(() => {
              setLoadings({ [getKey(index, key)]: false })
            })
          }
        }
      },
      300,
      {
        edges: ['leading'] // 首次点击不执行防抖
      }
    )

  return (
    <div className={cx('card-extra-options-container')}>
      {items.map((item, index) => {
        return (
          <div className={item.hide ? 'hideDom' : ''} key={getKey(index, item.key)}>
            <Tooltip title={item.title}>
              <Spin spinning={!!loadings[getKey(index, item.key)]}>
                <div className={cx('card-extra-options-item')} onClick={onItemClick(item, index)}>
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
