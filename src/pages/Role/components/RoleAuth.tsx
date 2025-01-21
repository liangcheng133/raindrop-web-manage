import { classNameBind } from '@/utils/classnamesBind'
import { ProForm, ProFormCheckbox } from '@ant-design/pro-components'
import { Card } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import React from 'react'
import styles from '../index.less'

const cx = classNameBind(styles)

const RoleAuth: React.FC<React.PropsWithChildren> = (props) => {
  const options: CheckboxGroupProps['options'] = [
    { label: '查看详情', value: 'user21321321312' },
    { label: '创建角色', value: '213213' }
  ]
  return (
    <Card className={cx('role-auth-container')}>
      <ProForm layout='horizontal' submitter={false}>
        <ProFormCheckbox name={'user'} formItemProps={{ className: cx('check-node main') }}>
          用户管理
        </ProFormCheckbox>
        <ProFormCheckbox.Group name='user-child' options={options} formItemProps={{ className: cx('check-node') }} />
      </ProForm>
    </Card>
  )
}

export default RoleAuth
