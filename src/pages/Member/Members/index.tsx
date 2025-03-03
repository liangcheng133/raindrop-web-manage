import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const MembersList: React.FC<React.PropsWithChildren> = () => {
  return (
    <PageContainer ghost className={cx('list-container')}>
      <ProTable />
    </PageContainer>
  )
}

export default MembersList
