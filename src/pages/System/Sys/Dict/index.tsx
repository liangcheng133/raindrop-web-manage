import { IconFont } from '@/components/rd-ui'
import { classNameBind } from '@/utils/classnamesBind'
import { PageContainer, ProTable } from '@ant-design/pro-components'
import { Card, Flex, Tree, TreeProps } from 'antd'
import React from 'react'
import styles from './index.less'

const cx = classNameBind(styles)

const DictList: React.FC<React.PropsWithChildren> = (props) => {
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

  return (
    <PageContainer ghost className={cx('dict-list-container')}>
      <Flex gap={16}>
        <Card className={cx('organizational-container')} title='角色'>
          <Tree defaultExpandAll blockNode showIcon treeData={treeData} onSelect={onOrganizationTreeSelect} />
        </Card>
        <ProTable className={cx('table-container')} />
      </Flex>
    </PageContainer>
  )
}

export default DictList
