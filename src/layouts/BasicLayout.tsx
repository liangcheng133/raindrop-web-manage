import { Outlet } from '@umijs/max'
import React from 'react'
import AntdAppLayout from './AntdAppLayout'

export interface ReactFcProps {
  children?: React.ReactNode
}

const BasicLayout: React.FC<ReactFcProps> = ({ children, ...rest }) => {
  return (
    <>
      <Outlet />
      <AntdAppLayout>{children}</AntdAppLayout>
    </>
  )
}

export default BasicLayout
