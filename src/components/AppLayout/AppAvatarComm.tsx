/*
 * @Date: 2025-01-21 10:36:17
 * @LastEditTime: 2025-01-21 11:07:36
 * @Author: CLX
 * @LastEditors: CLX
 * @Description: 模板右上角的用户头像
 */
import { appendQueryParams } from '@/utils'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { history } from '@umijs/max'
import { Dropdown } from 'antd'
import React from 'react'

const LayoutAvar: React.FC<React.PropsWithChildren> = ({ children }) => {
  const toUserInfo = () => {
    console.log('用户信息')
    history.push(appendQueryParams('/personalCenter'))
  }
  const onLogout = () => {
    console.log('退出登录')
  }
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'userInfo',
            icon: <UserOutlined />,
            label: '个人信息',
            onClick: toUserInfo
          },
          { type: 'divider' },
          {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            onClick: onLogout
          }
        ]
      }}>
      {children}
    </Dropdown>
  )
}

export default LayoutAvar
