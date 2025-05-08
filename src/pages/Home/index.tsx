import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={cx('container')}>test</div>
    </PageContainer>
  )
}

export default HomePage
