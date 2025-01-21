import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer } from '@ant-design/pro-components'
import { Avatar, Card, Descriptions, DescriptionsProps, Space, Tabs } from 'antd'
import { TabsProps } from 'antd/lib'
import React from 'react'
import styles from './index.less'
import BasicInformation from './components/BasicInformation'
import SecuritySetting from './components/SecuritySetting'

const cx = classNameBind(styles)

const PersonalCenter: React.FC = () => {
  const descriptionItems: DescriptionsProps['items'] = [
    { key: '1', label: '用户名', children: 'Dylan' },
    { key: '2', label: '账号', children: 'Dylan' },
    { key: '3', label: '邮箱', children: 'Dylan' },
    { key: '4', label: '部门', children: 'Dylan' },
    { key: '5', label: '角色', children: 'Dylan' },
    { key: '6', label: '性别', children: 'Dylan' }
  ]

  const tabItems: TabsProps['items'] = [
    { key: '1', label: '基础信息', children: <BasicInformation /> },
    { key: '2', label: '安全设置', children: <SecuritySetting /> }
  ]

  return (
    <PageContainer className={cx('personal-center')}>
      <Card className={cx('card-container')}>
        <Space size={60}>
          <Avatar size={100} />
          <Descriptions items={descriptionItems} />
        </Space>
      </Card>
      <Card className={cx('card-container')}>
        <Tabs items={tabItems} />
      </Card>
    </PageContainer>
  )
}

export default PersonalCenter
