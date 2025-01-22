import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const ErrorLogList: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <PageContainer ghost className={cx('error-log-list-container')}>
      <ProTable />
    </PageContainer>
  )
}

export default ErrorLogList
