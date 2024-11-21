import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer } from '@ant-design/pro-components'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const UserList: React.FC = () => {
  return (
    <PageContainer ghost>
      <div className={cx('container')}> 这是 UserList 组件 </div>
    </PageContainer>
  )
}

export default UserList
