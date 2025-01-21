import { IconFont } from '@/components/rd-ui'
import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Card, Flex, Tabs, TabsProps, Tree } from 'antd'
import { TreeProps } from 'antd/lib'
import React from 'react'
import RoleAuth from './components/RoleAuth'
import styles from './index.less'

const cx = classNameBind(styles)

const RolePage: React.FC = () => {
  // 组织架构树数据
  const treeData: TreeProps['treeData'] = [
    {
      title: 'parent 1',
      key: '0-0',
      icon: <IconFont type='icon-team' />,
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0'
        }
      ]
    }
  ]
  // 树形点击回调
  const onOrganizationTreeSelect: TreeProps['onSelect'] = (selectedKeys) => {
    console.log('[ selectedKeys ] >', selectedKeys[0])
  }

  const tabItems: TabsProps['items'] = [
    { key: '1', label: '角色用户', children: <ProTable /> },
    { key: '2', label: '角色权限', children: <RoleAuth /> }
  ]

  return (
    <PageContainer ghost className={cx('role-list-container')}>
      <Flex gap={16}>
        <Card className={cx('organizational-container')} title='组织架构'>
          <Tree defaultExpandAll blockNode showIcon treeData={treeData} onSelect={onOrganizationTreeSelect} />
        </Card>
        <Tabs className={cx('tabs-container')} items={tabItems} />
      </Flex>
    </PageContainer>
  )
}

export default RolePage
