import { Outlet } from '@umijs/max'
import React from 'react'
import AntdAppLayout from './AntdAppLayout'


const BasicLayout: React.FC<React.PropsWithChildren> = ({ children, ...rest }) => {
  return (
    <>
      <Outlet />
      <AntdAppLayout>{children}</AntdAppLayout>
    </>
  )
}

export default BasicLayout
